import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WeatherData } from '../types';

interface Props {
  weather: WeatherData;
  title?: string;
}

export default function WeatherCard({ weather, title = 'Votre position' }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        <Text style={styles.emoji}>{weather.emoji}</Text>
        <View style={styles.info}>
          <Text style={styles.label}>{weather.label}</Text>
          <View style={styles.details}>
            <Text style={styles.temp}>{weather.temperature}°</Text>
            <View style={styles.dot} />
            <Text style={styles.wind}>{weather.windSpeed} km/h</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 36,
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  wind: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
