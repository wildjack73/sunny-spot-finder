import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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
import { reverseGeocode, LocationName } from '../src/services/geocoding';
import { Coordinates, WeatherData, SunnySpot, SunnyForecast, PointOfInterest, SearchStatus } from '../src/types';

export default function HomeScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [sunnySpot, setSunnySpot] = useState<SunnySpot | null>(null);
  const [spotLocation, setSpotLocation] = useState<LocationName | null>(null);
  const [forecast, setForecast] = useState<SunnyForecast | null>(null);
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [searchProgress, setSearchProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setStatus('locating');
    setError(null);
    setSunnySpot(null);
    setSpotLocation(null);
    setForecast(null);
    setPois([]);
    setSearchProgress(0);

    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      setStatus('checking_weather');
      const weather = await fetchWeatherAtPoint(location);
      setCurrentWeather(weather);

      if (weather.isSunny) {
        setStatus('already_sunny');
        return;
      }

      setStatus('searching');
      const spot = await findNearestSunnySpot(location, (searched, total) => {
        setSearchProgress((searched / total) * 100);
      });

      if (spot) {
        setSunnySpot(spot);
        setStatus('found');
        // Fetch location name, POIs in background
        reverseGeocode(spot.coordinates).then(setSpotLocation).catch(() => {});
        fetchPOIsNearSpot(spot.coordinates).then(setPois).catch(() => {});
      } else {
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
          <LinearGradient
            colors={['#FFFBF5', '#FFF5E6', '#F5F5F5']}
            locations={[0, 0.5, 1]}
            style={styles.centerContent}
          >
            <Image
              source={require('../assets/icon.png')}
              style={styles.heroLogo}
            />
            <Text style={styles.heroTitle}>SUNNY</Text>
            <Text style={styles.heroSubtitle}>
              Trouvez le soleil le plus proche
            </Text>
            <TouchableOpacity onPress={search} activeOpacity={0.7}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>Rechercher</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        );

      case 'locating':
        return <SearchingAnimation message="Localisation..." />;

      case 'checking_weather':
        return <SearchingAnimation message="Analyse de la meteo..." />;

      case 'searching':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} title="Ici maintenant" />}
            <SearchingAnimation
              message="Recherche du soleil..."
              progress={searchProgress}
            />
          </>
        );

      case 'already_sunny':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} />}
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Il fait beau ici</Text>
              <Text style={styles.messageSubtitle}>Profitez-en !</Text>
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
                  location={spotLocation}
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
                  activeOpacity={0.7}
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
                  cityName={spotLocation?.city}
                />
              </>
            )}
          </>
        );

      case 'no_sun_found':
        return (
          <>
            {currentWeather && <WeatherCard weather={currentWeather} />}
            <View style={styles.messageCard}>
              <Text style={styles.messageTitle}>Pas de soleil a proximite</Text>
              <Text style={styles.messageSubtitle}>Aucun soleil dans un rayon de 200 km</Text>
            </View>
            {forecast ? (
              <ForecastCard forecast={forecast} />
            ) : (
              <View style={styles.messageCard}>
                <Text style={styles.messageSubtitle}>
                  Pas de soleil prevu dans les 48h non plus
                </Text>
              </View>
            )}
          </>
        );

      case 'error':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.errorTitle}>Erreur</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={search} activeOpacity={0.7}>
              <Text style={styles.retryButtonText}>Reessayer</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <LinearGradient
      colors={['#FFF9F0', '#F7F7F7', '#F0F0F0']}
      locations={[0, 0.4, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={search}
              tintColor="#D97706"
            />
          }
        >
          {renderContent()}
        </ScrollView>

        {status !== 'idle' && status !== 'locating' && status !== 'checking_weather' && status !== 'searching' && (
          <LinearGradient
            colors={['rgba(240,240,240,0)', 'rgba(240,240,240,0.9)', 'rgba(240,240,240,1)']}
            locations={[0, 0.3, 1]}
            style={styles.bottomBar}
          >
            <TouchableOpacity style={styles.refreshButton} onPress={search} activeOpacity={0.7}>
              <Text style={styles.refreshButtonText}>Actualiser</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  heroLogo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#B45309',
    letterSpacing: 4,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 40,
  },
  searchButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  messageCard: {
    alignItems: 'center',
    padding: 28,
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  messageSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  mapButtonText: {
    color: '#D97706',
    fontSize: 15,
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#D97706',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#D97706',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
