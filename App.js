import { StatusBar } from 'expo-status-bar';
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

//router
import Router from './src/router/Router';

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Router />
    </SafeAreaProvider>
  );
}

