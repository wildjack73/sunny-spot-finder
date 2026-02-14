import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { PointOfInterest } from '../types';

interface Props {
  pois: PointOfInterest[];
  userLatitude: number;
  userLongitude: number;
}

export default function POIList({ pois, userLatitude, userLongitude }: Props) {
  if (pois.length === 0) return null;

  const openDirections = (poi: PointOfInterest) => {
    const origin = `${userLatitude},${userLongitude}`;
    const destination = `${poi.coordinates.latitude},${poi.coordinates.longitude}`;

    let url: string;
    if (Platform.OS === 'ios') {
      url = `maps://app?saddr=${origin}&daddr=${destination}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    }

    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>A faire au soleil</Text>

      {pois.map((poi) => (
        <TouchableOpacity
          key={poi.id}
          style={styles.item}
          onPress={() => openDirections(poi)}
          activeOpacity={0.6}
        >
          <Text style={styles.emoji}>{poi.emoji}</Text>
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {poi.name}
            </Text>
            <Text style={styles.distance}>{poi.distance} km</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emoji: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  distance: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 1,
  },
  arrow: {
    fontSize: 20,
    color: '#D1D5DB',
  },
});
