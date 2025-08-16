import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BaseComponentProps } from '../types';

const { width } = Dimensions.get('window');

const AddLinkComponent: React.FC<BaseComponentProps> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const fadeAnimation = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateUrl = (urlString: string): boolean => {
    try {
      const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
      return urlPattern.test(urlString);
    } catch {
      return false;
    }
  };

  const testLink = async (): Promise<void> => {
    if (!url.trim()) {
      Alert.alert('⚠️ Missing URL', 'Please enter a URL first');
      return;
    }

    if (!validateUrl(url)) {
      Alert.alert('❌ Invalid URL', 'Please enter a valid URL starting with http:// or https://');
      return;
    }

    setIsValidating(true);
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('❌ Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to open URL');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = (): void => {
    if (!title.trim() || !url.trim()) {
      Alert.alert('⚠️ Missing Information', 'Please fill in both title and URL');
      return;
    }

    if (!validateUrl(url)) {
      Alert.alert('❌ Invalid URL', 'Please enter a valid URL starting with http:// or https://');
      return;
    }

    onSave({
      type: 'link',
      title: title.trim(),
      content: description.trim(),
      metadata: {
        url: url.trim(),
      },
    });

    setTitle('');
    setUrl('');
    setDescription('');
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.iconContainer}
          >
            <Ionicons name="link" size={24} color="white" />
          </LinearGradient>
          <Text style={styles.title}>Save Link Memory</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Name this link..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            selectionColor="#4facfe"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>URL</Text>
          <View style={styles.urlContainer}>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={url}
              onChangeText={setUrl}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              selectionColor="#4facfe"
            />
            <TouchableOpacity 
              style={[styles.testButton, isValidating && styles.testButtonDisabled]} 
              onPress={testLink}
              disabled={isValidating}
            >
              <LinearGradient
                colors={isValidating ? ['#666', '#666'] : ['#4facfe', '#00f2fe']}
                style={styles.testGradient}
              >
                <Ionicons 
                  name={isValidating ? "hourglass" : "open-outline"} 
                  size={18} 
                  color="white" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          {url && !validateUrl(url) && (
            <Text style={styles.errorText}>Please enter a valid URL</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Add notes or context about this link..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={1000}
            selectionColor="#4facfe"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              style={styles.saveGradient}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Save Link</Text>
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
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  urlInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontWeight: '500',
  },
  testButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  testButtonDisabled: {
    opacity: 0.6,
  },
  testGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    marginTop: 4,
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

export default AddLinkComponent;
