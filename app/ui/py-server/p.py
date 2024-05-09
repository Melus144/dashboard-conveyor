import argparse
import time

import numpy as np
from PIL import Image
from pycoral.adapters import classify
from pycoral.adapters import common
from pycoral.utils.dataset import read_label_file
from pycoral.utils.edgetpu import make_interpreter

import queue
from vi_gft.src.cameras.usb3camera import USB3Camera
from vi_gft.src.utils.disk_manager import DiskManager
import yaml
import cv2
import gradio as gr
import collections
import os
import datetime
from threading import Event
import multiprocessing
import socket


def read_yaml(filename):
    with open(filename, 'r') as file:
        data = yaml.safe_load(file)
    return data


class LinkSender:
  def __init__(self):
    self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.socket.connect(('localhost', 2999))

  def send_link(self, link):
    try:
      self.socket.sendall(link.encode())
      # self.socket.shutdown(socket.SHUT_WR)  # Shutdown write side to indicate end of data
      response = self.socket.recv(1024)
      print("Response", response.decode())
    except Exception as e:
      print(f"Error sending link: {e}")

  def close(self):
    self.socket.close()

class Process:
    def __init__(self, save_dir:str, max_images_to_keep:int = 100, max_image_age_seconds:int = 604800, max_disk_usage_percent:float = 0.8, capture_interval:int = 60, max_queue:int = 100):
        self.MAX_CAPACITY_QUEUE = 50
        self.stop_event = Event()
        self.results = None
        self.index = 0
        self.cam = USB3Camera(r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\acmarca_leak_inspection\ui\py-server\vi_gft\src\utils\example.yaml", buffer = 50)
        self.sender = LinkSender()
        self.cam.start()
        self.img_counter = 0
        self.img_counter_good = 0
        self.img_counter_bad = 0
        self.past_buffer = collections.deque(maxlen=self.MAX_CAPACITY_QUEUE)
        self.save_dir = save_dir
        # Creating structur folder for saving images: ok/ nok - bubble, pot, other
        os.makedirs(self.save_dir + "/ok", exist_ok=True)
        os.makedirs(self.save_dir + "/nok/bubble", exist_ok=True)
        os.makedirs(self.save_dir + "/nok/pot", exist_ok=True)
        os.makedirs(self.save_dir + "/nok/other", exist_ok=True)
        save_directories = [self.save_dir + "/ok"]
        self.labels = read_label_file(r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\acmarca_leak_inspection\ui\py-server\label_file.txt")
        self.interpreter = make_interpreter(r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\model_big_conveyor_edgetpu.tflite")
        # Model must be uint8 quantized
        if common.input_details(self.interpreter, 'dtype') != np.uint8:
          raise ValueError('Only support uint8 input type.')
        self.interpreter.allocate_tensors()
        self.model_inference(np.zeros((1080,1920,3), dtype=np.uint8))

        self.q = queue.Queue(maxsize=100)

    def show_frame(self, frame, name, wait=1):
        frame = cv2.resize(frame, (frame.shape[1]//4, frame.shape[0]//4))
        if name == "DEFECTS!":
          frame = cv2.putText(frame, 'NOK', (20, 20), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)
        else:
          frame = cv2.putText(frame, 'OK', (20, 20), cv2.FONT_HERSHEY_PLAIN, 2, (255, 255, 255), 2)
        return frame
    def start(self):
        print("READY")
        # Set output to ok!
        self.set_results(True)
        while True:
              # Check for camera frame
              frame = self.wait_for_camera_frame()
              tsmp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')[:-3]
              # If frame is received, perform model inference
              if frame is not None:
                  defect = self.model_inference(frame)
                  print(defect)
                  self.past_buffer.append(frame)

                  if defect:
                      frame = self.show_frame(frame, 'DEFECTS!', 100)
                      self.set_results(False)
                      self.stop_event.set()  # Set the stop event
                  else:
                      frame = self.show_frame(frame, 'LINE FEED')
                      self.set_results(True)

                  cv2.imwrite(r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\acmarca_leak_inspection\ui\shared_images\camera1\{}.jpg".format(tsmp),frame)
                  self.sender.send_link('1,{}.jpg'.format(tsmp))
                  if self.q.full():
                    p = self.q.get()
                    os.remove(p)
                  self.q.put(r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\acmarca_leak_inspection\ui\shared_images\camera1\{}.jpg".format(tsmp))


    def wait_for_camera_frame(self):
        while True:
            try:
                latest_frame = self.cam.frame_queue.get(block=False)
                # Save the frame
                return latest_frame
            except queue.Empty:
                continue

    def set_results(self, defect):
        self.cam.apply_control('UserOutputValue', defect)
        self.results = defect

    def model_inference(self, frame):
        # If results are False, stop acquisition
        # Model must be uint8 quantized
        if common.input_details(self.interpreter, 'dtype') != np.uint8:
          raise ValueError('Only support uint8 input type.')

        size = common.input_size(self.interpreter)
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(image).resize(size, Image.LANCZOS)

        params = common.input_details(self.interpreter, 'quantization_parameters')
        scale = params['scales']
        zero_point = params['zero_points']
        mean = 128
        std = 128
        if abs(scale * std - 1) < 1e-5 and abs(mean - zero_point) < 1e-5:
          # Input data does not require preprocessing.
          common.set_input(self.interpreter, image)
        else:
          common.set_input(self.interpreter, np.asarray(image).astype(np.uint8))

        # Run inference
        print('----INFERENCE TIME----')
        start = time.perf_counter()
        self.interpreter.invoke()
        inference_time = time.perf_counter() - start
        classes = classify.get_classes(self.interpreter, 1, 0)
        print(classes)
        print('%.1fms' % (inference_time * 1000))

        print('-------RESULTS--------')
        # 0 is NOK, 1 is OK
        return not classes[0].id

    def rearm(self):
        # Implement logic for rearming
        self.stop_event.clear()
        self.set_results(True)

    def stopped(self):
        self.stop_event.set()
        self.set_results(False)


def main():
    filename = r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\acmarca_leak_inspection\ui\py-server\config.yaml"  # Change this to your YAML file's name
    data = read_yaml(filename)
    global num_frames
    num_frames =  data.get('num_frames', 1)

    global save_every
    save_every =  data.get('save_every', 1)
    # Start an instance of Socket.IO
    # Run the web application and set_image loop concurrently
    process = Process(save_dir=r"C:\Users\kkkk\Desktop\ConveyorBeltDemo\acmarca_leak_inspection\ui\shared_images", )
    process.start()

if __name__ == "__main__":
    main()
