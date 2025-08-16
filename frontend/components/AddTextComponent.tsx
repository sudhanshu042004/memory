import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BaseComponentProps } from '../types';
import axios from "axios"
const { width } = Dimensions.get('window');

const AddTextComponent: React.FC<BaseComponentProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const fadeAnimation = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const [loading, setLoading] = useState(false);

const handleSave = async () => {
  if (!title.trim() || !content.trim()) {
    Alert.alert('⚠️ Missing Information', 'Please fill in both title and content');
    return;
  }

  try {
    setLoading(true);

    // ⚠️ Localhost ke jagah IP ya ngrok use karo agar device pe run kar rahe ho
    const response = await axios.post("http://192.168.3.101:5000/add-paragraph", {
      text: content.trim(),
    });

    console.log("✅ Saved to backend:", response.data);

    // Backend success hone ke baad parent ko data bhej do
    onSave({
      type: 'text',
      title: title.trim(),
      content: content.trim(),
    });

    // Fields reset karo
    setTitle('');
    setContent('');

    Alert.alert("✅ Success", "Your memory has been saved!");
  } catch (error) {
    console.error("❌ Save error:", error);
    Alert.alert("Error", "Failed to save memory. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.iconContainer}
          >
            <Ionicons name="document-text" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.title}>Create Text Memory</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter a memorable title..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            selectionColor="#667eea"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Content</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="Write your thoughts, ideas, or notes here..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            maxLength={5000}
            selectionColor="#667eea"
          />
          <Text style={styles.charCount}>
            {content.length}/5000 characters
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
  <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveGradient}>
    {loading ? (
      <ActivityIndicator size="small" color="#fff" />
    ) : (
      <>
        <Ionicons name="checkmark" size={20} color="white" />
        <Text style={styles.saveButtonText}>Save Memory</Text>
      </>
    )}
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
  contentInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontWeight: '500',
    lineHeight: 24,
  },
  charCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '500',
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

export default AddTextComponent;