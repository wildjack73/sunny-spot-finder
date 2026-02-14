import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SunnySpot } from '../types';
import { LocationName } from '../services/geocoding';
import DirectionsButton from './DirectionsButton';

interface Props {
  spot: SunnySpot;
  userLatitude: number;
  userLongitude: number;
  location: LocationName | null;
}

export default function SunnySpotCard({ spot, userLatitude, userLongitude, location }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Soleil disponible</Text>
        </View>
      </View>

      {location && (
        <View style={styles.locationRow}>
          <Text style={styles.cityText}>{location.city}</Text>
          {location.department ? (
            <Text style={styles.departmentText}>{location.department}</Text>
          ) : null}
        </View>
      )}

      <LinearGradient
        colors={['#FFFBF5', '#FFF8EE', '#FFFBF5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.statsRow}
      >
        <View style={styles.stat}>
          <Text style={styles.statValue}>{spot.distance}</Text>
          <Text style={styles.statUnit}>km</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{spot.direction}</Text>
          <Text style={styles.statUnit}>direction</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{spot.estimatedTime}</Text>
          <Text style={styles.statUnit}>min</Text>
        </View>
      </LinearGradient>

      <View style={styles.weatherRow}>
        <Text style={styles.weatherEmoji}>{spot.weather.emoji}</Text>
        <Text style={styles.weatherLabel}>{spot.weather.label}</Text>
        <Text style={styles.weatherTemp}>{spot.weather.temperature}°</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B45309',
  },
  locationRow: {
    alignItems: 'center',
    marginBottom: 18,
  },
  cityText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  departmentText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    marginBottom: 14,
    borderRadius: 10,
    overflow: 'hidden',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#B45309',
  },
  statUnit: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  weatherEmoji: {
    fontSize: 18,
  },
  weatherLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  weatherTemp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});
