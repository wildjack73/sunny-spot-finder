import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  progress?: number; // 0-100
  message?: string;
}

export default function SearchingAnimation({
  progress,
  message = 'Recherche en cours...',
}: Props) {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circleOuter, { opacity: pulseAnim }]}>
        <LinearGradient
          colors={['#FBBF24', '#F59E0B', '#D97706']}
          style={styles.circle}
        />
      </Animated.View>
      <Text style={styles.message}>{message}</Text>
      {progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#FBBF24', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  circleOuter: {
    marginBottom: 20,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 20,
  },
  progressContainer: {
    width: '70%',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});
