import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SunnyForecast } from '../types';

interface Props {
  forecast: SunnyForecast;
}

export default function ForecastCard({ forecast }: Props) {
  const timeLabel =
    forecast.hoursUntilSun <= 1
      ? "dans moins d'1h"
      : `dans ${forecast.hoursUntilSun}h`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.clockEmoji}>🕐</Text>
        <Text style={styles.title}>Soleil prévu ici</Text>
      </View>

      <Text style={styles.timeLabel}>{timeLabel}</Text>
      <Text style={styles.timeValue}>vers {forecast.sunnyTime}</Text>

      <View style={styles.weatherRow}>
        <Text style={styles.weatherEmoji}>{forecast.emoji}</Text>
        <Text style={styles.weatherText}>
          {forecast.label} - {forecast.temperature}°C
        </Text>
      </View>

      <Text style={styles.hint}>
        Patience, le soleil arrive bientôt !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  clockEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1565C0',
  },
  timeLabel: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F57F17',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  weatherEmoji: {
    fontSize: 20,
  },
  weatherText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  hint: {
    fontSize: 13,
    color: '#90A4AE',
    fontStyle: 'italic',
  },
});
