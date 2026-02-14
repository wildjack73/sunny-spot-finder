import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FDB813',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '700',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Sunny Spot Finder',
          }}
        />
        <Stack.Screen
          name="map"
          options={{
            title: 'Carte',
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
