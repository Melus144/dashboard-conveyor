import mil as MIL
import numpy as np
from vi_gft.src.cameras.base import Camera

class USB3Camera(Camera):
    def __init__(self, config, buffer:int=1):
        super().__init__(config, buffer)

    def initialize_mil(self):
        # Initialize MIL system
        # self.MilApplication, self.MilSystem, self.MilDisplay, self.CameraDigitizer = MIL.MappAllocDefault(MIL.M_DEFAULT, ImageBufIdPtr=MIL.M_NULL)

        # Initialize MIL system
        self.MilApplication = MIL.MappAlloc("M_DEFAULT", MIL.M_DEFAULT)
        self.MilSystem = MIL.MsysAlloc(MIL.M_DEFAULT, MIL.M_SYSTEM_DEFAULT, MIL.M_DEFAULT, MIL.M_DEFAULT)
        self.CameraDigitizer = MIL.MdigAlloc(self.MilSystem, MIL.M_DEV0, "M_DEFAULT", MIL.M_DEFAULT)
        
        # Apply settings from YAML file for camera
        self.apply_settings()
        # Get the size of the grab buffer.
        size_x = MIL.MdigInquire(self.CameraDigitizer, MIL.M_SIZE_X)
        size_y = MIL.MdigInquire(self.CameraDigitizer, MIL.M_SIZE_Y)

        # Allocate the grab buffers and clear them.
        MIL.MappControl(MIL.M_DEFAULT, MIL.M_ERROR, MIL.M_PRINT_DISABLE)
        for n in range(0, self.BUFFERING_SIZE_MAX):
            self.CameraGrabBufferList.append(MIL.MbufAlloc2d(
                self.MilSystem, size_x, size_y, 8 + MIL.M_UNSIGNED, MIL.M_IMAGE + MIL.M_GRAB + MIL.M_PROC))
            if (self.CameraGrabBufferList[n] != MIL.M_NULL):
                MIL.MbufClear(self.CameraGrabBufferList[n], 0xFF)
                self.CameraGrabBufferListSize += 1
            else:
                break

        # Start the processing. The processing function is called with every frame grabbed.
        self.CameraProcessingFunctionPtr = MIL.MIL_DIG_HOOK_FUNCTION_PTR(self.grab_frame)
        
        # Additional initialization specific to USB3 camera

    def display_frame(self):
        # Display frame from USB3 camera
        pass

    def release(self):
        # Release resources for USB3 camera
        pass

class FrameProcessor:
    def __init__(self):
        pass

    def update(self, frame):
        # Process the latest frame
        print("Received new frame:", frame)

if __name__ == "__main__":
    cam = USB3Camera("/home/gft/Documents/SourceCode/acmarca_leak_inspection/ui/py-server/visual-inspection-gft/src/utils/example.yaml")
    processor = FrameProcessor()
    #cam.subscribe(processor)
    cam.start()
    import queue
    while True:
        try:
            latest_frame = cam.frame_queue.get(block=False)
            # Save the frame
            file_name = "latest_frame.png"
            print(latest_frame)
        except queue.Empty:
            continue