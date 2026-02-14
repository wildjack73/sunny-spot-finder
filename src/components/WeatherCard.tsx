import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types';

interface Props {
  weather: WeatherData;
  title?: string;
}

export default function WeatherCard({ weather, title = 'Météo actuelle' }: Props) {
  return (
    <View style={[styles.card, weather.isSunny ? styles.sunny : styles.cloudy]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.emoji}>{weather.emoji}</Text>
      <Text style={styles.label}>{weather.label}</Text>
      <View style={styles.details}>
        <Text style={styles.temp}>{weather.temperature}°C</Text>
        <Text style={styles.wind}>{weather.windSpeed} km/h</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sunny: {
    backgroundColor: '#FFF8E1',
  },
  cloudy: {
    backgroundColor: '#ECEFF1',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emoji: {
    fontSize: 64,
    marginVertical: 8,
  },
  label: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 24,
  },
  temp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  wind: {
    fontSize: 16,
    color: '#888',
  },
});
