import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { BaseComponentProps } from '../types';

const { width } = Dimensions.get('window');

const AddImageComponent: React.FC<BaseComponentProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [imageUri, setImageUri] = useState<string>('');
  const fadeAnimation = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickImage = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('📱 Permission Required', 'Please grant camera roll permissions to continue');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to pick image');
    }
  };

  const takePhoto = async (): Promise<void> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('📷 Permission Required', 'Please grant camera permissions to continue');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to take photo');
    }
  };

  const showImageOptions = (): void => {
    Alert.alert(
      '📸 Select Image Source',
      'How would you like to add your image?',
      [
        { 
          text: '📷 Camera', 
          onPress: takePhoto,
          style: 'default'
        },
        { 
          text: '🖼️ Gallery', 
          onPress: pickImage,
          style: 'default'
        },
        { 
          text: 'Cancel', 
          style: 'cancel' 
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = (): void => {
    if (!title.trim() || !imageUri) {
      Alert.alert('⚠️ Missing Information', 'Please add a title and select an image');
      return;
    }

    onSave({
      type: 'image',
      title: title.trim(),
      content: description.trim(),
      metadata: {
        imageUri,
      },
    });

    setTitle('');
    setDescription('');
    setImageUri('');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#f093fb', '#f5576c']}
            style={styles.iconContainer}
          >
            <Ionicons name="camera" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.title}>Add Image Memory</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Give your image a title..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            selectionColor="#f093fb"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Image</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={showImageOptions}>
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)']}
                  style={styles.imageOverlay}
                >
                  <Ionicons name="refresh" size={24} color="white" />
                </LinearGradient>
              </View>
            ) : (
              <LinearGradient
                colors={['rgba(240,147,251,0.1)', 'rgba(245,87,108,0.1)']}
                style={styles.imagePlaceholder}
              >
                <LinearGradient
                  colors={['#f093fb', '#f5576c']}
                  style={styles.cameraIcon}
                >
                  <Ionicons name="camera-outline" size={32} color="white" />
                </LinearGradient>
                <Text style={styles.imagePickerText}>Tap to capture or select</Text>
                <Text style={styles.imagePickerSubtext}>Camera • Gallery</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your image or add context..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={1000}
            selectionColor="#f093fb"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#f093fb', '#f5576c']}
              style={styles.saveGradient}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Image</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontWeight: '500',
  },
  imagePickerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 16/9,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 48,
    height: 48,
    borderTopLeftRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderWidth: 2,
    borderColor: 'rgba(240,147,251,0.3)',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  cameraIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  imagePickerSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AddImageComponent;

