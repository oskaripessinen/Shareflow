import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Alert,
  Dimensions,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import { X, ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Camera as VisionCameraType, CameraDevice } from 'react-native-vision-camera';

const isExpoGo = process.env.EXPO_PUBLIC_IS_EXPO_GO === 'true';

interface CameraViewProps {
  onClose: () => void;
  onPhotoTaken: (photoUri: string) => void;
}

const { width, height } = Dimensions.get('window');


type VisionCameraModule = {
  Camera: {
    requestCameraPermission: () => Promise<string>;
    getAvailableCameraDevices: () => Promise<CameraDevice[]>;
  } & typeof VisionCameraType;
};

let CameraModule: VisionCameraModule | null = null;

const initializeCamera = async (): Promise<boolean> => {
  if (isExpoGo) {
    console.warn('Camera not available in Expo Go');
    return false;
  }
  if (!CameraModule) {
    try {
      CameraModule = (await import('react-native-vision-camera')) as unknown as VisionCameraModule;
      console.log('Camera module loaded successfully');
    } catch (error) {
      console.error('Failed to import Camera module:', error);
      return false;
    }
  }
  return true;
};

export default function CameraView({ onClose, onPhotoTaken }: CameraViewProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedOpacity] = useState(new Animated.Value(0));
  const [isActive, setIsActive] = useState(true);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const cameraRef = useRef<VisionCameraType | null>(null);

  useEffect(() => {
    const initApp = async () => {
      if (isExpoGo) return;

      const success = await initializeCamera();
      if (success && CameraModule) {
        setCameraInitialized(true);

        const status = await CameraModule!.Camera.requestCameraPermission();
        setHasPermission(status === 'authorized');
        const available = await CameraModule.Camera.getAvailableCameraDevices();
        setDevices(available);
      }
    };

    initApp();
    return () => setIsActive(false);
  }, []);

  const convertToBase64 = async (photoPath: string): Promise<string> => {
    try {
      const response = await fetch(`file://${photoPath}`);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert to base64:', error);
      throw error;
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || isCapturing || !isCameraReady) return;

    try {
      setIsCapturing(true);
      setIsLoading(true);

      const photo = await cameraRef.current?.takeSnapshot({
        quality: 0.8,
      });

      if (photo?.path) {
        const base64Photo = await convertToBase64(photo.path);
        console.log('Photo taken:', base64Photo);
        onPhotoTaken(base64Photo);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsCapturing(false);
      setIsLoading(false);
    }
  };

  const requestCameraPermission = async () => {
    if (CameraModule) {
      const status = await CameraModule!.Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    }
  };

  if (isExpoGo) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Pressable className='ml-6 active:opacity-50' onPress={onClose}>
          <ArrowLeft color={'black'} />
        </Pressable>
        <View className="items-center justify-center px-6 flex-1">
          <Text className="text-default text-lg mb-5 text-center">
            Camera functionality is not available in Expo Go
          </Text>
          <Text className="text-muted text-sm mb-5 text-center">
            Please use a development build to access camera features
          </Text>
          <Pressable
            onPress={onClose}
            className="bg-primary px-5 py-2 rounded-xl active:bg-primaryDark"
          >
            <Text className="text-white text-base font-semibold">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!cameraInitialized) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white text-lg mt-4">Loading camera...</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white text-lg mt-4">Checking camera permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <Pressable className='ml-6 active:opacity-50' onPress={onClose}>
          <ArrowLeft color={'black'} />
        </Pressable>
        <View className="items-center justify-center px-6 flex-1">
          <Text className="text-default text-lg mb-5 text-center">
            We need your permission to use the camera
          </Text>
          <Pressable
            onPress={requestCameraPermission}
            className="bg-primary px-5 py-2 rounded-xl active:bg-primaryDark mb-4"
          >
            <Text className="text-white text-base font-semibold">Grant Permission</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const device: CameraDevice | undefined = devices.find((d) => d.position === 'back');

  if (!device) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">No camera device found</Text>
        <Pressable
          onPress={onClose}
          className="bg-gray-600 px-5 py-2.5 rounded-lg active:bg-gray-700 mt-4"
        >
          <Text className="text-white text-base font-semibold">Close</Text>
        </Pressable>
      </View>
    );
  }

  if (CameraModule) {
    const { Camera } = CameraModule;
    return (
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={isActive && isCameraReady}
          photo={true}
          preview={true}
          enableZoomGesture={true}
          onInitialized={() => {
            console.log('Camera is ready');
            setIsCameraReady(true);
          }}
        />

        {!isCameraReady && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text className="text-white text-lg mt-4">Initializing camera...</Text>
          </View>
        )}

        <SafeAreaView
          className={`absolute left-0 right-0 h-15 flex-row items-center justify-between px-5 ${
            Platform.OS === 'ios' ? 'top-15' : 'top-8'
          }`}
        >
          <Pressable onPress={onClose} className="w-11 h-11 rounded-full items-center justify-center">
            <X size={24} color="#fff" />
          </Pressable>
        </SafeAreaView>

        {isCameraReady && (
          <View
            className={`absolute left-0 right-0 h-30 justify-center items-center ${
              Platform.OS === 'ios' ? 'bottom-10' : 'bottom-5'
            }`}
          >
            <View className="flex-row items-center justify-center px-5" style={{ width: width - 40 }}>
              <Pressable
                onPress={takePhoto}
                className={`w-20 h-20 rounded-full bg-white items-center justify-center shadow-lg ${
                  isCapturing ? 'opacity-50' : ''
                }`}
                disabled={isCapturing}
              >
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center"></View>
              </Pressable>
            </View>
          </View>
        )}

        {isLoading && (
          <Animated.View style={[styles.loadingOverlay, { opacity: animatedOpacity }]}>
            <ActivityIndicator size="large" color="grey" />
            <Text className="text-gray-700 text-lg mt-4">Processing photo...</Text>
          </Animated.View>
        )}
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
