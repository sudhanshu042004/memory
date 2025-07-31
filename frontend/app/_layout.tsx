import { AuthProvider } from '@/context/auth';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style='auto' />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
