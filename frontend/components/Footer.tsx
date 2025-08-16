import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';


interface FooterProps {
  currentScreen: string;
}

const Footer: React.FC<FooterProps> = ({ currentScreen }) => {
  // console.log(currentScreen)
  const handleHomePress = () => {
    router.push("/Home/page")
  }
  const handleAskPress = () => {
    router.push("/ask/page")
  }
  return (
    <View style={styles.footerContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.footerGradient}
      >
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
                  color="rgba(255,255,255,0.6)"
                />
              </View>
            )}

            <Text
              style={[
                styles.footerLabel,
                {
                  color: currentScreen === 'home'
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.6)'
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
                  color="rgba(255,255,255,0.6)"
                />
              </View>
            )}

            <Text
              style={[
                styles.footerLabel,
                {
                  color: currentScreen === 'ask'
                    ? '#ffffff'
                    : 'rgba(255,255,255,0.6)'
                }
              ]}
            >
              Ask Question
            </Text>
          </TouchableOpacity>

        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  footerGradient: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 0,
  },
  activeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  inactiveIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  footerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Footer;
