import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Coordinates } from '../types';
import { buildExpediaHotelLink, buildExpediaWeekendLink } from '../services/expedia';

interface Props {
  spotCoordinates: Coordinates;
  spotDirection: string;
  spotDistance: number;
}

export default function HotelCard({ spotCoordinates, spotDirection, spotDistance }: Props) {
  const openTonight = () => {
    Linking.openURL(buildExpediaHotelLink(spotCoordinates));
  };

  const openWeekend = () => {
    Linking.openURL(buildExpediaWeekendLink(spotCoordinates));
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🏨</Text>
        <View>
          <Text style={styles.title}>Dormir au soleil</Text>
          <Text style={styles.subtitle}>
            Hotels a {spotDistance} km {spotDirection}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.tonightButton} onPress={openTonight} activeOpacity={0.8}>
        <Text style={styles.tonightEmoji}>🌙</Text>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>Ce soir</Text>
          <Text style={styles.buttonSubtitle}>Trouvez un hotel pour cette nuit</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.weekendButton} onPress={openWeekend} activeOpacity={0.8}>
        <Text style={styles.weekendEmoji}>☀️</Text>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>Ce week-end</Text>
          <Text style={styles.buttonSubtitle}>Escapade soleil samedi-dimanche</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <Text style={styles.poweredBy}>via Expedia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#E65100',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerEmoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#E65100',
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  tonightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  tonightEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  weekendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  weekendEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: '#CCC',
    fontWeight: '300',
  },
  poweredBy: {
    textAlign: 'center',
    fontSize: 11,
    color: '#BDBDBD',
  },
});
