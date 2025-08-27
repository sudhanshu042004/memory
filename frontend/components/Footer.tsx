import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface FooterProps {
  currentScreen: string;
}

const Footer: React.FC<FooterProps> = ({ currentScreen }) => {
  const handleHomePress = () => {
    router.push("/Home/page")
  }
  
  const handleAskPress = () => {
    router.push("/ask/page")
  }
  
  return (
    <View style={styles.footerWrapper}>
      {/* Background blur effect */}
      <BlurView 
        intensity={Platform.OS === 'ios' ? 100 : 80}
        tint="dark"
        style={styles.blurContainer}
      >
        {/* Overlay for better visibility */}
        <View style={styles.overlay} />
        
        {/* Footer content */}
        <View style={styles.footerContent}>
          <TouchableOpacity
            style={styles.footerItem}
            onPress={handleHomePress}
            activeOpacity={0.7}
          >
            {currentScreen === 'home' ? (
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.activeIconContainer}
              >
                <Ionicons
                  name="home"
                  size={24}
                  color="white"
                />
              </LinearGradient>
            ) : (
              <View style={styles.inactiveIconContainer}>
                <Ionicons
                  name="home"
                  size={24}
                  color="rgba(255,255,255,0.7)"
                />
              </View>
            )}

            <Text
              style={[
                styles.footerLabel,
                {
                  color: currentScreen === 'home'
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.7)'
                }
              ]}
            >
              Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            onPress={handleAskPress}
            activeOpacity={0.7}
          >
            {currentScreen === 'ask' ? (
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.activeIconContainer}
              >
                <Ionicons
                  name="help-circle"
                  size={24}
                  color="white"
                />
              </LinearGradient>
            ) : (
              <View style={styles.inactiveIconContainer}>
                <Ionicons
                  name="help-circle"
                  size={24}
                  color="rgba(255,255,255,0.7)"
                />
              </View>
            )}

            <Text
              style={[
                styles.footerLabel,
                {
                  color: currentScreen === 'ask'
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.7)'
                }
              ]}
            >
              Ask Question
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    height: 80,
    borderRadius: 24,
    overflow: 'hidden',
    // Enhanced shadow for better depth
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,

  },
  blurContainer: {
    flex: 1,
    borderRadius: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.OS === 'ios' 
      ? 'rgba(0, 0, 0, 0.2)' 
      : 'rgba(0, 0, 0, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 1,
    backgroundColor: 'transparent',
    backdropFilter : "blur(100px)"
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  inactiveIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default Footer;