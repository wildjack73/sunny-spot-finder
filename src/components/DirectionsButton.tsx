import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform, Linking } from 'react-native';

interface Props {
  destinationLatitude: number;
  destinationLongitude: number;
  userLatitude: number;
  userLongitude: number;
}

export default function DirectionsButton({
  destinationLatitude,
  destinationLongitude,
  userLatitude,
  userLongitude,
}: Props) {
  const openDirections = () => {
    const origin = `${userLatitude},${userLongitude}`;
    const destination = `${destinationLatitude},${destinationLongitude}`;

    let url: string;
    if (Platform.OS === 'ios') {
      url = `maps://app?saddr=${origin}&daddr=${destination}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }

    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={openDirections} activeOpacity={0.8}>
      <Text style={styles.buttonText}>Itinéraire</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F57F17',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#F57F17',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
