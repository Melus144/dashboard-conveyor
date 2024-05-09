import mil as MIL
import numpy as np
from base import Camera

class GigECamera(Camera):
    def initialize_mil(self):
        # Initialize MIL system
        self.MilApplication = MIL.MappAlloc("M_DEFAULT", MIL.M_DEFAULT)
        self.MilSystem = MIL.MsysAlloc(MIL.M_DEFAULT, MIL.M_SYSTEM_DEFAULT, MIL.M_DEFAULT, MIL.M_DEFAULT)
        self.CameraDigitizer = MIL.MdigAlloc(self.MilSystem, MIL.M_GC_CAMERA_ID(
            self.config['CameraSettings']['ip']), "M_DEFAULT", MIL.M_GC_DEVICE_IP_ADDRESS)

        # Apply settings from YAML file for camera
        self.set_camera_settings()
        
        # Get the size of the grab buffer.
        size_x = MIL.MdigInquire(self.CameraDigitizer, MIL.M_SIZE_X)
        size_y = MIL.MdigInquire(self.CameraDigitizer, MIL.M_SIZE_Y)

        
        # Allocate the grab buffers and clear them.
        self.CameraGrabBufferList = []
        CameraGrabBufferListSize = 0
        MIL.MappControl(MIL.M_DEFAULT, MIL.M_ERROR, MIL.M_PRINT_DISABLE)
        for n in range(0, self.BUFFERING_SIZE_MAX):
            self.CameraGrabBufferList.append(MIL.MbufAlloc2d(
                self.MilSystem, size_x, size_y, 8 + MIL.M_UNSIGNED, MIL.M_IMAGE + MIL.M_GRAB + MIL.M_PROC))
            if (self.CameraGrabBufferList[n] != MIL.M_NULL):
                MIL.MbufClear(self.CameraGrabBufferList[n], 0xFF)
                CameraGrabBufferListSize += 1
            else:
                break
        ProcessedImageCount = np.array([0, 0])
        local_images_folder = ""
        profiler_camera_sync = []
        
        # start part id index
        part_id = 0
        self.CameraHookData = HookDataStruct(None, None, self.CameraDigitizer, ProcessedImageCount,
                                    local_images_folder, False, profiler_camera_sync, part_id, 'Cam0', 0, 0)

        # Start the processing. The processing function is called with every frame grabbed.
        self.CameraProcessingFunctionPtr = MIL.MIL_DIG_HOOK_FUNCTION_PTR(self.save2disk)

    def grab_frame(self):
        # Grab frame from GigE camera
        pass

    def display_frame(self):
        # Display frame from GigE camera
        pass

    def release(self):
        # Release resources for GigE camera
        pass