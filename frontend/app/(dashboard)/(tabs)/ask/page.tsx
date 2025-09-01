import { Text, View, StyleSheet, TextInput, SafeAreaView, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useState } from "react"
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter"


const AskPage = () => {
  const [conversation, setConversation] = useState<{role: string, text: string}[]>([])
  const [input, setInput] = useState("")
   const [fontsLoaded] = useFonts({
      Inter_400Regular,
      Inter_700Bold,
      Inter_500Medium,
    });
    
  const handleSend = () => {
    if (!input.trim()) return
    
    setConversation([...conversation, { role: "user", text: input }])
    setInput("") 
  }

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
        style={styles.emptyCard}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={64} color="#6D78E7" />
        </View>
        <Text style={styles.emptyTitle}>Start a Conversation</Text>
        <Text style={styles.emptyText}>
          Ask any question about your stored memories and get intelligent responses
        </Text>

        {/* --- Quick Suggestions --- */}
        <View style={styles.suggestionBox}>
          <Text style={styles.suggestionTitle}>💡 Try asking:</Text>
          <Text style={styles.suggestionItem}>• What did I do last weekend?</Text>
          <Text style={styles.suggestionItem}>• Show me my saved highlights</Text>
          <Text style={styles.suggestionItem}>• Remind me about my goals</Text>
        </View>
      </LinearGradient>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Memory Assistant</Text>
        <Text style={styles.headerSubtitle}>Ask anything about your memories</Text>

        {/* --- Motivation Line --- */}
        <Text style={styles.headerMotivation}>✨ Your AI remembers so you don’t have to!</Text>
      </View>

      <ScrollView 
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {conversation.length === 0 ? (
          <EmptyState />
        ) : (
          conversation.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.messageContainer, 
                item.role === "user" ? styles.userMessage : styles.aiMessage
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input*/}
     <KeyboardAvoidingView
           behavior={Platform.OS === 'android' ? 'padding' : 'height'}
         >
        <View style={styles.inputSection}>
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput 
                style={styles.taskInput} 
                placeholder="How can AI-Memory help you today?"
                placeholderTextColor="#8E8E93"
                multiline={true}
                textAlignVertical="center"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <LinearGradient
                  colors={['#6D78E7', '#6D78E7']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AskPage

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily:"Inter_500Medium",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#8E8E93',
    fontSize: 16,
    fontFamily:"Inter_500Medium",
  },
  headerMotivation: {
    color: '#6D78E7',
    fontSize: 14,
    fontFamily:"Inter_400Regular",
    marginTop: 6,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyCard: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
  },
  emptyTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily:"Inter_500Medium",
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily:"Inter_500Medium",
  },
  suggestionBox: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  suggestionTitle: {
    color: '#6D78E7',
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  suggestionItem: {
    color: '#ccc',
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 4,
  },
  inputSection: {
    padding: 20,
    marginBottom: 80,
  },
  inputContainer: {
    borderRadius: 24,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#161618',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  taskInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    maxHeight: 120,
    paddingVertical: 8,
    paddingRight: 12,
    fontFamily:"Inter_500Medium",
  },
  sendButton: {
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: "#4facfe",
    alignSelf: "flex-end",
  },
  aiMessage: {
    backgroundColor: "#2c2c2e",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "white",
    fontSize: 16,
    fontFamily:"Inter_500Medium",
  }
})
