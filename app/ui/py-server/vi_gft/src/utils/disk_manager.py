import os
import time
import shutil
import heapq
import multiprocessing

class DiskManager:
    def __init__(self, save_dirs:list, max_images:int, max_age_seconds:int, max_disk_usage_percent:float):
        self.save_dirs = save_dirs
        self.max_images = max_images
        self.max_age_seconds = max_age_seconds
        self.max_disk_usage_percent = max_disk_usage_percent
        self.file_heap = []

    def refresh_file_heap(self, save_dir):
        # Clear the existing heap
        self.file_heap = []

        # Populate the heap with file creation times
        for filename in os.listdir(save_dir):
            filepath = os.path.join(save_dir, filename)
            creation_time = os.path.getctime(filepath)
            heapq.heappush(self.file_heap, (creation_time, filepath))

    def delete_old_images(self, save_dir):
        while len(self.file_heap) > self.max_images:
            _, filepath = heapq.heappop(self.file_heap)
            os.remove(filepath)

    def delete_older_than(self, save_dir):
        current_time = time.time()
        while self.file_heap and current_time - self.file_heap[0][0] > self.max_age_seconds:
            _, filepath = heapq.heappop(self.file_heap)
            os.remove(filepath)

    def monitor_disk_space(self):
        for save_dir in self.save_dirs:
            disk_usage = shutil.disk_usage(save_dir)
            if (disk_usage.total - disk_usage.used) / disk_usage.total < self.max_disk_usage_percent:
                print("Disk usage left: {}%.".format((disk_usage.total - disk_usage.used) * 100 / disk_usage.total))
                # Refresh file heap and delete excess images to free up space
                self.refresh_file_heap(save_dir)
                self.delete_old_images(save_dir)

            # Also delete images older than a certain age
            self.delete_older_than(save_dir)

    def run(self, capture_interval):
        while True:
            # Monitor disk space and delete old images if necessary
            self.monitor_disk_space()

            # Wait for n seconds before checking again
            time.sleep(capture_interval)

if __name__ == "__main__":
    # Define parameters for DiskManager
    save_directories = ["/home/gft/Documents/SourceCode/acmarca_leak_inspection/ui/shared_images/ok/"]
    max_images_to_keep = 100
    max_image_age_seconds = 7 * 24 * 3600  # 1 week
    max_disk_usage_percent = 0.8  # 80%
    capture_interval = 60  # seconds

    # Create an instance of DiskManager
    image_saver = DiskManager(save_directories, max_images_to_keep, max_image_age_seconds, max_disk_usage_percent)
    # Define a process for DiskManager
    disk_manager_process = multiprocessing.Process(target=image_saver.run, args=(capture_interval,))

    try:
        # Start the DiskManager process
        disk_manager_process.start()

        # Main process can continue with other tasks or wait for DiskManager process
        disk_manager_process.join()

    except KeyboardInterrupt:
        # Terminate the DiskManager process if interrupted
        disk_manager_process.terminate()
        disk_manager_process.join()
