// components/AskQuestionScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from '@/components/Footer';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

interface AskQuestionProps {
  onNavigate: (screen: string) => void;
}

const AskQuestionScreen: React.FC<AskQuestionProps> = ({ onNavigate }) => {
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'question' | 'answer';
    content: string;
    timestamp: Date;
  }>>([]);

  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const handleSendQuestion = async (): Promise<void> => {
    if (!question.trim()) {
      Alert.alert('Empty Question', 'Please enter a question before sending.');
      return;
    }

    setIsLoading(true);
    
    // Add question to conversation history
    const newQuestion = {
      type: 'question' as const,
      content: question.trim(),
      timestamp: new Date(),
    };
    
    setConversationHistory(prev => [...prev, newQuestion]);
    
    // Animate button
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {

      const response = await axios.post("http://192.168.3.101:5000/ask",{question:question})

      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
    } catch (error) {
      Alert.alert('Error', 'Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const renderConversationItem = (item: typeof conversationHistory[0], index: number) => {
    const isQuestion = item.type === 'question';
    
    return (
      <View 
        key={index} 
        style={[
          styles.conversationItem,
          isQuestion ? styles.questionItem : styles.answerItem
        ]}
      >
        <LinearGradient
          colors={isQuestion 
            ? ['rgba(79, 172, 254, 0.15)', 'rgba(79, 172, 254, 0.05)']
            : ['rgba(67, 233, 123, 0.15)', 'rgba(67, 233, 123, 0.05)']
          }
          style={styles.conversationGradient}
        >
          <View style={styles.conversationHeader}>
            <View style={styles.conversationIconContainer}>
              <Ionicons 
                name={isQuestion ? 'help-circle' : 'bulb'} 
                size={16} 
                color={isQuestion ? '#4facfe' : '#43e97b'} 
              />
            </View>
            <Text style={styles.conversationLabel}>
              {isQuestion ? 'Your Question' : 'AI Response'}
            </Text>
            <Text style={styles.conversationTime}>
              {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Text style={styles.conversationContent}>{item.content}</Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="help-circle" size={32} color="#4facfe" />
          <Text style={styles.title}>Ask AI</Text>
        </View>
        <Text style={styles.subtitle}>
          Ask questions about your memories
        </Text>
        
        {conversationHistory.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearHistory}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.clearButtonGradient}
            >
              <Ionicons name="trash-outline" size={16} color="#f5576c" />
              <Text style={styles.clearButtonText}>Clear History</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Conversation History */}
        <ScrollView 
          style={styles.conversationContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.conversationContent}
        >
          {conversationHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <LinearGradient
                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                style={styles.emptyCard}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={64} color="#4facfe" />
                <Text style={styles.emptyTitle}>Start a Conversation</Text>
                <Text style={styles.emptyText}>
                  Ask any question about your stored memories and get intelligent responses
                </Text>
              </LinearGradient>
            </View>
          ) : (
            conversationHistory.map((item, index) => renderConversationItem(item, index))
          )}
          
          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Question Input Section */}
        <View style={styles.inputSection}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Ask a question about your memories..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={question}
              onChangeText={setQuestion}
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            
            <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                onPress={handleSendQuestion}
                disabled={isLoading || !question.trim()}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isLoading || !question.trim()
                      ? ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                      : ['#4facfe', '#00f2fe']
                  }
                  style={styles.sendButtonGradient}
                >
                  {isLoading ? (
                    <Ionicons name="hourglass" size={24} color="rgba(255,255,255,0.6)" />
                  ) : (
                    <Ionicons name="send" size={24} color="white" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>

      {/* Footer */}
      <Footer 
        currentScreen="ask" 
       
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    textAlign: 'center',
  },
  clearButton: {
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  clearButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  clearButtonText: {
    color: '#f5576c',
    fontSize: 14,
    fontWeight: '600',
  },
  conversationContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  conversationContent: {
    paddingBottom: 20,
  },
  conversationItem: {
    marginBottom: 16,
  },
  questionItem: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  answerItem: {
    alignSelf: 'flex-start',
    maxWidth: '90%',
  },
  conversationGradient: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  conversationIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  conversationTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
  },
  conversationContent: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    maxWidth: 300,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  inputSection: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Space for footer
    paddingTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  textInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    maxHeight: 100,
    minHeight: 20,
    textAlignVertical: 'top',
  },
  sendButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AskQuestionScreen;
