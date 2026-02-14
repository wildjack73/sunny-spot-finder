import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { PointOfInterest } from '../types';

interface Props {
  userLat: number;
  userLon: number;
  spotLat: number;
  spotLon: number;
  spotLabel: string;
  pois: PointOfInterest[];
}

export default function MapContent({ userLat, userLon, spotLat, spotLon, spotLabel, pois }: Props) {
  const midLat = (userLat + spotLat) / 2;
  const midLon = (userLon + spotLon) / 2;
  const latDelta = Math.abs(userLat - spotLat) * 1.5 + 0.05;
  const lonDelta = Math.abs(userLon - spotLon) * 1.5 + 0.05;

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: midLat,
          longitude: midLon,
          latitudeDelta: latDelta,
          longitudeDelta: lonDelta,
        }}
      >
        <Marker
          coordinate={{ latitude: userLat, longitude: userLon }}
          title="Vous"
          description="Votre position"
          pinColor="red"
        />
        <Marker
          coordinate={{ latitude: spotLat, longitude: spotLon }}
          title="Soleil"
          description={spotLabel}
          pinColor="orange"
        />
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{
              latitude: poi.coordinates.latitude,
              longitude: poi.coordinates.longitude,
            }}
            title={`${poi.emoji} ${poi.name}`}
            description={`${poi.distance} km du spot`}
            pinColor="green"
          />
        ))}
      </MapView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Text style={styles.legendDot}>🔴</Text>
          <Text style={styles.legendText}>Vous</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendDot}>🟠</Text>
          <Text style={styles.legendText}>Soleil</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendDot}>🟢</Text>
          <Text style={styles.legendText}>Loisirs</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    fontSize: 14,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
