import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Coordinates, Hotel } from '../types';
import { fetchHotelsNearSpot } from '../services/hotels';
import { buildHotelSearchLink, buildHotelDetailLink } from '../services/expedia';

interface Props {
  spotCoordinates: Coordinates;
  cityName?: string;
}

function StarRating({ stars }: { stars: number | null }) {
  if (!stars) return null;
  return (
    <Text style={styles.stars}>
      {'★'.repeat(stars)}
      {'☆'.repeat(5 - stars)}
    </Text>
  );
}

export default function HotelCard({ spotCoordinates, cityName }: Props) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchHotelsNearSpot(spotCoordinates)
      .then(setHotels)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [spotCoordinates.latitude, spotCoordinates.longitude]);

  const openHotelBooking = (hotel: Hotel) => {
    Linking.openURL(buildHotelDetailLink(hotel.name, hotel.coordinates));
  };

  const openHotelsSearch = () => {
    Linking.openURL(buildHotelSearchLink(spotCoordinates, cityName));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Ou dormir</Text>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Recherche d'hotels...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ou dormir</Text>

      {hotels.length > 0 ? (
        <>
          {hotels.map((hotel) => (
            <TouchableOpacity
              key={hotel.id}
              style={styles.hotelItem}
              onPress={() => openHotelBooking(hotel)}
              activeOpacity={0.6}
            >
              <View style={styles.hotelInfo}>
                <Text style={styles.hotelName} numberOfLines={1}>
                  {hotel.name}
                </Text>
                <View style={styles.hotelMeta}>
                  <StarRating stars={hotel.stars} />
                  <Text style={styles.hotelDistance}>{hotel.distance} km</Text>
                </View>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.moreButton}
            onPress={openHotelsSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.moreButtonText}>Voir plus sur Hotels.com</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.fallbackButton}
          onPress={openHotelsSearch}
          activeOpacity={0.7}
        >
          <Text style={styles.fallbackText}>Chercher un hotel sur Hotels.com</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  loadingText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  hotelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  hotelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stars: {
    fontSize: 12,
    color: '#D97706',
    letterSpacing: 1,
  },
  hotelDistance: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  arrow: {
    fontSize: 20,
    color: '#D1D5DB',
  },
  moreButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  moreButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D97706',
    textDecorationLine: 'underline',
  },
  fallbackButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  fallbackText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#D97706',
  },
});
