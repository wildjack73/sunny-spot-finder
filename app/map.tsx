import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import MapContent from '../src/components/MapContent';
import { fetchPOIsNearSpot } from '../src/services/poi';
import { PointOfInterest } from '../src/types';

export default function MapScreen() {
  const params = useLocalSearchParams<{
    userLat: string;
    userLon: string;
    spotLat: string;
    spotLon: string;
    spotLabel: string;
  }>();

  const userLat = parseFloat(params.userLat || '0');
  const userLon = parseFloat(params.userLon || '0');
  const spotLat = parseFloat(params.spotLat || '0');
  const spotLon = parseFloat(params.spotLon || '0');
  const spotLabel = params.spotLabel || 'Soleil';

  const [pois, setPois] = useState<PointOfInterest[]>([]);

  useEffect(() => {
    fetchPOIsNearSpot({ latitude: spotLat, longitude: spotLon })
      .then(setPois)
      .catch(() => {});
  }, [spotLat, spotLon]);

  return (
    <View style={styles.container}>
      <MapContent
        userLat={userLat}
        userLon={userLon}
        spotLat={spotLat}
        spotLon={spotLon}
        spotLabel={spotLabel}
        pois={pois}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
