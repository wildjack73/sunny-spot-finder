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
    <TouchableOpacity style={styles.button} onPress={openDirections} activeOpacity={0.7}>
      <Text style={styles.buttonText}>Y aller</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
