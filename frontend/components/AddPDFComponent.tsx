import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import { BaseComponentProps } from '../types';

const { width } = Dimensions.get('window');

const AddPDFComponent: React.FC<BaseComponentProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    uri: string;
    size: number;
  } | null>(null);
  const fadeAnimation = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const pickPDF = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          uri: file.uri,
          size: file.size || 0,
        });
        
        if (!title) {
          setTitle(file.name.replace('.pdf', ''));
        }
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to pick PDF file');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = (): void => {
    if (!title.trim() || !selectedFile) {
      Alert.alert('⚠️ Missing Information', 'Please add a title and select a PDF file');
      return;
    }

    onSave({
      type: 'pdf',
      title: title.trim(),
      content: notes.trim(),
      metadata: {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        url: selectedFile.uri,
      },
    });

    setTitle('');
    setNotes('');
    setSelectedFile(null);
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#43e97b', '#38f9d7']}
            style={styles.iconContainer}
          >
            <Ionicons name="document" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.title}>Add PDF Memory</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Name your PDF..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            selectionColor="#43e97b"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PDF File</Text>
          <TouchableOpacity style={styles.filePickerButton} onPress={pickPDF}>
            {selectedFile ? (
              <LinearGradient
                colors={['rgba(67,233,123,0.1)', 'rgba(56,249,215,0.1)']}
                style={styles.selectedFileContainer}
              >
                <LinearGradient
                  colors={['#43e97b', '#38f9d7']}
                  style={styles.fileIcon}
                >
                  <Ionicons name="document-text" size={32} color="white" />
                </LinearGradient>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={2}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSize}>
                    {formatFileSize(selectedFile.size)}
                  </Text>
                </View>
                <LinearGradient
                  colors={['#43e97b', '#38f9d7']}
                  style={styles.checkIcon}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                </LinearGradient>
              </LinearGradient>
            ) : (
              <LinearGradient
                colors={['rgba(67,233,123,0.1)', 'rgba(56,249,215,0.1)']}
                style={styles.filePlaceholder}
              >
                <LinearGradient
                  colors={['#43e97b', '#38f9d7']}
                  style={styles.uploadIcon}
                >
                  <Ionicons name="cloud-upload-outline" size={32} color="white" />
                </LinearGradient>
                <Text style={styles.filePickerText}>Tap to select PDF</Text>
                <Text style={styles.filePickerSubtext}>PDF files only • Max 50MB</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes about this PDF..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
            maxLength={1000}
            selectionColor="#43e97b"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#43e97b', '#38f9d7']}
              style={styles.saveGradient}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save PDF</Text>
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
  filePickerButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  filePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 2,
    borderColor: 'rgba(67,233,123,0.3)',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  uploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  filePickerText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  filePickerSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(67,233,123,0.3)',
    borderRadius: 12,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fileInfo: {
    flex: 1,
    marginRight: 12,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  checkIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesInput: {
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

export default AddPDFComponent;