import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carte</Text>
      <Text style={styles.subtitle}>
        La carte interactive n'est pas disponible sur le web.{'\n'}Utilisez l'app mobile pour la carte.
      </Text>
      <View style={styles.list}>
        <View style={styles.item}>
          <Text style={styles.dot}>🔴</Text>
          <Text style={styles.text}>Vous : {userLat.toFixed(4)}, {userLon.toFixed(4)}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.dot}>🟠</Text>
          <Text style={styles.text}>Soleil : {spotLat.toFixed(4)}, {spotLon.toFixed(4)} - {spotLabel}</Text>
        </View>
        {pois.map((poi) => (
          <View key={poi.id} style={styles.item}>
            <Text style={styles.dot}>{poi.emoji}</Text>
            <Text style={styles.text}>{poi.name} - {poi.distance} km</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
    lineHeight: 20,
  },
  list: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});
