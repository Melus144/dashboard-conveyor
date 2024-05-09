import sys
sys.path.append('/home/gft/Documents/SourceCode/acmarca_leak_inspection/ui/py-server/visual-inspection-gft/src/cameras/')
sys.path.append('/home/gft/Documents/SourceCode/acmarca_leak_inspection/ui/py-server/visual-inspection-gft/src/utils/')
import mil as MIL
import numpy as np
import cv2
from abc import ABC, abstractmethod
from vi_gft.src.utils.config import load_yaml
from vi_gft.src.utils.hook import HookDataStruct
import queue

class Camera(ABC):
    def __init__(self, config, buffer:int=1):
        self.BUFFERING_SIZE_MAX = 1
        self.MilApplication = None
        self.MilSystem = None
        self.MilDisplay = None
        self.CameraDigitizer = None
        self.CameraGrabBufferList = []
        self.CameraGrabBufferListSize = 0
        self.CameraProcessingFunctionPtr = None
        self.config = config
        self.settings = load_yaml(self.config)
        self.initialize_mil()
        self.CameraHookData = HookDataStruct(self.CameraDigitizer)
        self.frame_queue = queue.Queue(maxsize=buffer)


    @abstractmethod
    def initialize_mil(self):
        raise NotImplementedError

    def get_latest_frame(self):
        return self.latest_frame

    def start(self):
        # Start the processing. The processing function is called with every frame grabbed.
        MIL.MdigProcess(self.CameraDigitizer, self.CameraGrabBufferList, self.CameraGrabBufferListSize,
                    MIL.M_START, MIL.M_DEFAULT, self.CameraProcessingFunctionPtr, self.CameraHookData)

    @abstractmethod
    def display_frame(self):
        raise NotImplementedError

    @abstractmethod
    def release(self):
        raise NotImplementedError

    def apply_settings(self):
        for category, features in self.settings.items():
            for feature_data in features:
                feature = feature_data['feature']
                value = feature_data['value']
                type = None
                if isinstance(value, str):
                    # Si el valor es una cadena
                    type = MIL.M_TYPE_STRING
                elif isinstance(value, (int, float)):
                    # Si el valor es un número
                    type = MIL.M_TYPE_DOUBLE
                    value = np.array(float(value))
                else:
                    # Si el valor no es ni cadena ni número (puede ser otro tipo de dato)
                    raise ValueError(f"The value of the feature {feature} is not a string neither a number: {value}")
                MIL.MdigControlFeature(self.CameraDigitizer, MIL.M_FEATURE_VALUE, feature, type, value)

    def apply_control(self, feature, value):
        if isinstance(value, str):
            # Si el valor es una cadena
            type = MIL.M_TYPE_STRING
        elif isinstance(value, (int, float)):
            # Si el valor es un número
            type = MIL.M_TYPE_DOUBLE
            value = np.array(float(value))
        else:
            # Si el valor no es ni cadena ni número (puede ser otro tipo de dato)
            raise ValueError(f"The value of the feature {feature} is not a string neither a number: {value}")
        MIL.MdigControlFeature(self.CameraDigitizer, MIL.M_FEATURE_VALUE, feature, type, value)

    def grab_frame(self, HookType, HookId, HookDataPtr):
        # Retrieve the MIL_ID of the grabbed buffer.
        BufferId = MIL.MdigGetHookInfo(
            HookId, MIL.M_MODIFIED_BUFFER + MIL.M_BUFFER_ID)


        # get the color image into a numpy array
        image = MIL.MbufGet(BufferId)
        # Put the frame into the queue
        self.frame_queue.put(image)
        return 0
