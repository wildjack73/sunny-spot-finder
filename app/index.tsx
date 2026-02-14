import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeatherCard from '../src/components/WeatherCard';
import SunnySpotCard from '../src/components/SunnySpotCard';
import SearchingAnimation from '../src/components/SearchingAnimation';
import ForecastCard from '../src/components/ForecastCard';
import POIList from '../src/components/POIList';
import HotelCard from '../src/components/HotelCard';
import { getCurrentLocation } from '../src/services/location';
import { fetchWeatherAtPoint, fetchSunnyForecast } from '../src/services/weather';
import { findNearestSunnySpot } from '../src/services/sunnyFinder';
import { fetchPOIsNearSpot } from '../src/services/poi';
import { Coordinates, WeatherData, SunnySpot, SunnyForecast, PointOfInterest, SearchStatus } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [sunnySpot, setSunnySpot] = useState<SunnySpot | null>(null);
  const [forecast, setForecast] = useState<SunnyForecast | null>(null);
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [searchProgress, setSearchProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setStatus('locating');
    setError(null);
    setSunnySpot(null);
    setForecast(null);
    setPois([]);
    setSearchProgress(0);

    try {
      // Step 1: Get location
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Step 2: Check current weather
      setStatus('checking_weather');
      const weather = await fetchWeatherAtPoint(location);
      setCurrentWeather(weather);

      // Step 3: Already sunny?
      if (weather.isSunny) {
        setStatus('already_sunny');
        return;
      }

      // Step 4: Search for sun
      setStatus('searching');
      const spot = await findNearestSunnySpot(location, (searched, total) => {
        setSearchProgress((searched / total) * 100);
      });

      if (spot) {
        setSunnySpot(spot);
        setStatus('found');
        // Fetch POIs near the sunny spot in background
        fetchPOIsNearSpot(spot.coordinates).then(setPois).catch(() => {});
      } else {
        // No sun nearby - check forecast for when sun returns here
        const sunForecast = await fetchSunnyForecast(location);
        setForecast(sunForecast);
        setStatus('no_sun_found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setStatus('error');
    }
  }, []);

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.heroEmoji}>☀️</Text>
            <Text style={styles.heroTitle}>Sunny</Text>
            <Text style={styles.heroSubtitle}>
              Trouvez le soleil le plus proche en un instant
            </Text>
            <TouchableOpacity style={styles.searchButton} onPress={search} activeOpacity={0.8}>
              <Text style={styles.searchButtonText}>Trouver le soleil</Text>
            </TouchableOpacity>
          </View>
        );

      case 'locating':
        return (
          <SearchingAnimation message="Localisation en cours..." />
        );

      case 'checking_weather':
        return (
          <SearchingAnimation message="Vérification de la météo..." />
        );

      case 'searching':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} title="Ici maintenant" />}
            <SearchingAnimation
              message="Recherche du soleil autour de vous..."
              progress={searchProgress}
            />
          </>
        );

      case 'already_sunny':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} />}
            <View style={styles.alreadySunny}>
              <Text style={styles.alreadySunnyEmoji}>🎉☀️</Text>
              <Text style={styles.alreadySunnyText}>
                Bonne nouvelle ! Il fait déjà beau ici !
              </Text>
            </View>
          </>
        );

      case 'found':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} title="Ici maintenant" />}
            {sunnySpot && userLocation && (
              <>
                <SunnySpotCard
                  spot={sunnySpot}
                  userLatitude={userLocation.latitude}
                  userLongitude={userLocation.longitude}
                />
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() =>
                    router.push({
                      pathname: '/map',
                      params: {
                        userLat: userLocation.latitude.toString(),
                        userLon: userLocation.longitude.toString(),
                        spotLat: sunnySpot.coordinates.latitude.toString(),
                        spotLon: sunnySpot.coordinates.longitude.toString(),
                        spotLabel: sunnySpot.weather.label,
                      },
                    })
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.mapButtonText}>Voir sur la carte</Text>
                </TouchableOpacity>
                <POIList
                  pois={pois}
                  userLatitude={userLocation.latitude}
                  userLongitude={userLocation.longitude}
                />
                <HotelCard
                  spotCoordinates={sunnySpot.coordinates}
                  spotDirection={sunnySpot.direction}
                  spotDistance={sunnySpot.distance}
                />
              </>
            )}
          </>
        );

      case 'no_sun_found':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} />}
            <View style={styles.noSun}>
              <Text style={styles.noSunEmoji}>😔☁️</Text>
              <Text style={styles.noSunText}>
                Pas de soleil trouvé dans un rayon de 200 km...
              </Text>
            </View>
            {forecast ? (
              <ForecastCard forecast={forecast} />
            ) : (
              <View style={styles.noSun}>
                <Text style={styles.noSunSubtext}>
                  Pas de soleil prévu dans les 48h non plus...{'\n'}Courage !
                </Text>
              </View>
            )}
          </>
        );

      case 'error':
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={search}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={search}
            tintColor="#FDB813"
          />
        }
      >
        {renderContent()}
      </ScrollView>

      {status !== 'idle' && status !== 'locating' && status !== 'checking_weather' && status !== 'searching' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.refreshButton} onPress={search} activeOpacity={0.8}>
            <Text style={styles.refreshButtonText}>Actualiser</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  heroEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  searchButton: {
    backgroundColor: '#FDB813',
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#FDB813',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  alreadySunny: {
    alignItems: 'center',
    padding: 32,
  },
  alreadySunnyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  alreadySunnyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F57F17',
    textAlign: 'center',
  },
  noSun: {
    alignItems: 'center',
    padding: 32,
  },
  noSunEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  noSunText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
  noSunSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: '#2196F3',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 32,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#F57F17',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  refreshButton: {
    backgroundColor: '#FDB813',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
