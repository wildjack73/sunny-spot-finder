import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SunnyForecast } from '../types';

interface Props {
  forecast: SunnyForecast;
}

export default function ForecastCard({ forecast }: Props) {
  const timeLabel =
    forecast.hoursUntilSun <= 1
      ? "moins d'1h"
      : `${forecast.hoursUntilSun}h`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Soleil prevu ici</Text>

      <View style={styles.timeRow}>
        <Text style={styles.timePrefix}>dans </Text>
        <Text style={styles.timeValue}>{timeLabel}</Text>
      </View>

      <Text style={styles.timeDetail}>vers {forecast.sunnyTime}</Text>

      <View style={styles.weatherPill}>
        <Text style={styles.weatherEmoji}>{forecast.emoji}</Text>
        <Text style={styles.weatherText}>
          {forecast.label} · {forecast.temperature}°
        </Text>
      </View>
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
    alignItems: 'center',
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
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timePrefix: {
    fontSize: 18,
    color: '#6B7280',
  },
  timeValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#B45309',
  },
  timeDetail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 14,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  weatherEmoji: {
    fontSize: 16,
  },
  weatherText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
