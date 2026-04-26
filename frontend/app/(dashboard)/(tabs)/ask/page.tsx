import { useContext, useEffect, useRef, useState } from "react"
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter"
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from "@/context/auth"
import { UserContext } from "@/context/UserContext"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"


const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const createAnimation = (val: Animated.Value, delay: number) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(val, { toValue: 0.3, duration: 400, useNativeDriver: true })
          ])
        )
      ]);

    Animated.parallel([
      createAnimation(dot1, 0),
      createAnimation(dot2, 200),
      createAnimation(dot3, 400),
    ]).start();
  }, [dot1, dot2, dot3]);

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, { opacity: dot1 }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot2 }]} />
      <Animated.View style={[styles.typingDot, { opacity: dot3 }]} />
    </View>
  );
};

const AskPage = () => {
  const { fetchWithAuth } = useAuth();
  const userContext = useContext(UserContext);
  const [conversation, setConversation] = useState<{ role: string, text: string }[]>([])
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("")
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_500Medium,
  });
  const scrollViewReff = useRef<ScrollView | null>(null);

  useEffect(() => {
    scrollViewReff.current?.scrollToEnd({ animated: true });
  }, [conversation, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setConversation(conver => [...conver, { role: "user", text: text }]);
    setIsTyping(true);
    try {
      const response = await fetchWithAuth(`${process.env.EXPO_PUBLIC_API_BASE}/ask`, {
        method: "POST",
        body: JSON.stringify({
          query: text,
        })
      });
      const data = await response.json();
      setConversation(conver => [...conver, { role: "ai", text: data.message }]);

    } catch (error) {
      console.log("error came up....");
      setConversation(conver => [...conver, { role: "ai", text: "Sorry, I couldn't reach my brain." }]);
    } finally {
      setIsTyping(false);
    }
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        ref={scrollViewReff}
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
                styles.messageRow,
                item.role === "user" ? styles.userRow : styles.aiRow
              ]}
            >
              {item.role === "ai" && (
                <View style={[styles.avatar, styles.aiAvatar]}>
                  <Ionicons name="hardware-chip-outline" size={18} color="white" />
                </View>
              )}
              <View
                style={[
                  styles.messageContainer,
                  item.role === "user" ? styles.userMessage : styles.aiMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  item.role === "user" ? styles.userMessageText : styles.aiMessageText
                ]}>{item.text}</Text>
              </View>
              {item.role === "user" && (
                <View style={[styles.avatar, styles.userAvatar]}>
                  <Text style={styles.avatarText}>
                    {userContext?.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
        {isTyping && (
          <View style={styles.aiRow}>
            <View style={[styles.avatar, styles.aiAvatar]}>
              <Ionicons name="hardware-chip-outline" size={18} color="white" />
            </View>
            <View style={[styles.messageContainer, styles.aiMessage, { paddingHorizontal: 16, paddingVertical: 12 }]}>
              <TypingIndicator />
            </View>
          </View>
        )}
      </ScrollView>

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
                placeholder="Ask me anything..."
                placeholderTextColor="#8E8E93"
                multiline={true}
                textAlignVertical="center"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <LinearGradient
                  colors={['#6D78E7', '#8E99FF']}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons name="send" size={18} color="white" />
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
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(109, 120, 231, 0.1)',
  },
  emptyTitle: {
    color: 'white',
    fontSize: 22,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: "Inter_400Regular",
  },
  suggestionBox: {
    marginTop: 10,
    width: '100%',
  },
  suggestionTitle: {
    color: '#6D78E7',
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  suggestionItem: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 6,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  aiRow: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  userAvatar: {
    backgroundColor: '#6D78E7',
  },
  aiAvatar: {
    backgroundColor: '#2c2c2e',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  messageContainer: {
    padding: 14,
    borderRadius: 20,
    maxWidth: "75%",
  },
  userMessage: {
    backgroundColor: "#6D78E7",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: "#1C1C1E",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Inter_500Medium",
  },
  userMessageText: {
    color: "white",
  },
  aiMessageText: {
    color: "#E5E5E7",
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    paddingHorizontal: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8E8E93',
    marginHorizontal: 2,
  },
  inputSection: {
    padding: 20,
    marginBottom: 80,
  },
  inputContainer: {
    borderRadius: 28,
    padding: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 27,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 52,
  },
  taskInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    maxHeight: 120,
    fontFamily: "Inter_400Regular",
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
