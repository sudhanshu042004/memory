import { Memory, MemoryType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { JSX, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';


import AddImageComponent from '@/components/AddImageComponent';
import AddLinkComponent from '@/components/AddLinkComponent';
import AddPDFComponent from '@/components/AddPDFComponent';
import AddTextComponent from '@/components/AddTextComponent';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const HomePage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<MemoryType | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  
  // useRef instead of useState for animations
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const toggleModal = (): void => {
    if (!modalVisible) {
      setModalVisible(true);
      Animated.spring(modalAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }).start();
    } else {
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  };

  const handleOptionSelect = (option: MemoryType): void => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setCurrentInput(option);
    });
  };

  const handleSave = (memoryData: Omit<Memory, 'id' | 'createdAt'>): void => {
    const newMemory: Memory = {
      ...memoryData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setMemories(prev => [...prev, newMemory]);
    setCurrentInput(null);
    
    Alert.alert('✨ Success', `${memoryData.type} memory saved successfully!`);
  };

  const handleCancel = (): void => {
    setCurrentInput(null);
  };

  const animateButton = (): void => {
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
  };

  const handleOutsidePress = (): void => {
    toggleModal();
  };

  // Footer navigation handlers
  // const handleFooterNavigation = (screen: string): void => {
  //   switch (screen) {
  //     case 'home':
  //       setCurrentScreen('home')
  //       break;
  //     case 'ask':
  //       setCurrentScreen('ask')
  //       break;
  //   }
  // };

  const renderInputComponent = (): JSX.Element | null => {
    const commonProps = {
      onSave: handleSave,
      onCancel: handleCancel,
    };

    switch (currentInput) {
      case 'text':
        return <AddTextComponent {...commonProps} />;
      case 'image':
        return <AddImageComponent {...commonProps} />;
      case 'link':
        return <AddLinkComponent {...commonProps} />;
      case 'pdf':
        return <AddPDFComponent {...commonProps} />;
      default:
        return null;
    }
  };

  const memoryOptions = [
    { type: 'text' as MemoryType, icon: 'document-text', label: 'Add Text', gradient: ['#667eea', '#764ba2'] },
    { type: 'image' as MemoryType, icon: 'camera', label: 'Add Image', gradient: ['#f093fb', '#f5576c'] },
    { type: 'link' as MemoryType, icon: 'link', label: 'Add Link', gradient: ['#4facfe', '#00f2fe'] },
    { type: 'pdf' as MemoryType, icon: 'document', label: 'Add PDF', gradient: ['#43e97b', '#38f9d7'] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f0f23', '#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Top Navigation Bar */}
      <View style={styles.topNavBar}>
        {/* AI Memory Icon (Top Left) */}
        <TouchableOpacity style={styles.topNavIcon}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.navIconContainer}
          >
            <Ionicons name="bookmark-sharp" size={24} color="#4facfe" />
          </LinearGradient>
        </TouchableOpacity>

        {/* User Profile Icon (Top Right) */}
        <TouchableOpacity style={styles.topNavIcon} onPress={()=>router.push("/profile/page")}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            style={styles.navIconContainer}
          >
            <Ionicons name="person-circle" size={24} color="#f093fb" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>AI Memory</Text>
            <Text style={styles.subtitle}>
              {memories.length} {memories.length === 1 ? 'memory' : 'memories'} stored
            </Text>
          </View>
          
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.statCard}
            >
              <Ionicons name="analytics" size={24} color="#4facfe" />
              <Text style={styles.statNumber}>{memories.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.statCard}
            >
              <Ionicons name="trending-up" size={24} color="#43e97b" />
              <Text style={styles.statNumber}>
                {memories.filter(m => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return m.createdAt > weekAgo;
                }).length}
              </Text>
              <Text style={styles.statLabel}>This Week</Text>
            </LinearGradient>
          </View>
        </View>
        
        {/* Render current input component */}
        {renderInputComponent()}
        
        {/* Empty State with Larger Plus Icon */}
        {memories.length === 0 && !currentInput && (
          <View style={styles.emptyState}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.emptyCard}
            >
              <TouchableOpacity 
                // style={styles.emptyPlusButton}
                onPress={() => {
                  animateButton();
                  setTimeout(() => toggleModal(), 50);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.plusIconGradient}
                >
                  <Ionicons name="add" size={64} color="white" />
                </LinearGradient>
              </TouchableOpacity>
              
              <Text style={styles.emptyTitle}>Start Building Your Memory</Text>
              <Text style={styles.emptyText}>
                Create your first memory by tapping the + button above
              </Text>
            </LinearGradient>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Enhanced Modal with 4 Separate Boxes */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <BlurView intensity={20} style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <Animated.View
                style={[
                  styles.optionsContainer,
                  {
                    transform: [
                      {
                        scale: modalAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.8, 1],
                        }),
                      },
                    ],
                    opacity: modalAnimation,
                  },
                ]}
              >
                {memoryOptions.map((option, index) => (
                  <Animated.View
                    key={option.type}
                    style={[
                      styles.optionBox,
                      {
                        transform: [
                          {
                            scale: modalAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.5, 1],
                            }),
                          },
                          {
                            translateY: modalAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleOptionSelect(option.type)}
                      activeOpacity={0.8}
                      style={styles.optionTouchable}
                    >
                      <LinearGradient
                        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                        style={styles.optionGradient}
                      >
                        <LinearGradient
                          colors={option.gradient}
                          style={styles.optionIconContainer}                        >
                          <Ionicons name={option.icon as any} size={32} color="white" />
                        </LinearGradient>
                        <Text style={styles.optionLabel}>{option.label}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </Animated.View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Footer Component */}
      {/* <Footer 
        currentScreen={currentScreen}
      /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 100,
    marginTop:50
  },
  topNavIcon: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginTop: 4,
  },
  emptyState: {
    paddingHorizontal: 20,
    marginTop: 40,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emptyPlusButton: {
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  plusIconGradient: {
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  // New styles for 4 separate boxes
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    maxWidth: width - 48,
  },
  optionBox: {
    width: (width - 108) / 2, // 2 boxes per row with gaps
    minWidth: 140,
    maxWidth: 180,
  },
  optionTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  optionGradient: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    minHeight: 140,
  },
  optionIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default HomePage;
