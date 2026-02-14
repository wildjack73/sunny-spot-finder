import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SunnySpot } from '../types';
import DirectionsButton from './DirectionsButton';

interface Props {
  spot: SunnySpot;
  userLatitude: number;
  userLongitude: number;
}

export default function SunnySpotCard({ spot, userLatitude, userLongitude }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sunEmoji}>☀️</Text>
        <Text style={styles.title}>Soleil trouvé !</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{spot.distance} km</Text>
          <Text style={styles.infoLabel}>Distance</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{spot.direction}</Text>
          <Text style={styles.infoLabel}>Direction</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoValue}>{spot.estimatedTime} min</Text>
          <Text style={styles.infoLabel}>En voiture</Text>
        </View>
      </View>

      <View style={styles.weatherInfo}>
        <Text style={styles.weatherText}>
          {spot.weather.emoji} {spot.weather.label} - {spot.weather.temperature}°C
        </Text>
      </View>

      <DirectionsButton
        destinationLatitude={spot.coordinates.latitude}
        destinationLongitude={spot.coordinates.longitude}
        userLatitude={userLatitude}
        userLongitude={userLongitude}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF9C4',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  sunEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F57F17',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0C85A',
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
  },
  weatherText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
});
