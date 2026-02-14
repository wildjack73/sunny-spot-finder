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
      <Text style={styles.subtitle}>Points d'interet a proximite</Text>

      {pois.map((poi) => (
        <TouchableOpacity
          key={poi.id}
          style={styles.poiCard}
          onPress={() => openDirections(poi)}
          activeOpacity={0.7}
        >
          <Text style={styles.poiEmoji}>{poi.emoji}</Text>
          <View style={styles.poiInfo}>
            <Text style={styles.poiName} numberOfLines={1}>
              {poi.name}
            </Text>
            <Text style={styles.poiDistance}>{poi.distance} km du spot</Text>
          </View>
          <Text style={styles.poiArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  poiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  poiEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  poiInfo: {
    flex: 1,
  },
  poiName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  poiDistance: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  poiArrow: {
    fontSize: 24,
    color: '#CCC',
    fontWeight: '300',
  },
});
