// app/tabs/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { searchRestaurants } from '@/services/naverAPI';
import { Restaurant, Region } from '@/types/restaurant';

export default function MapScreen() {
    const router = useRouter();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [region, setRegion] = useState<Region>({
        latitude: 37.4979, // 강남역 위도
        longitude: 127.0276, // 강남역 경도
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const getLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    '위치 권한 필요',
                    '주변 맛집을 찾으려면 위치 권한이 필요합니다.',
                    [{ text: '확인' }]
                );
                return false;
            }
            return true;
        } catch (error) {
            console.error('위치 권한 요청 오류:', error);
            return false;
        }
    };

    const getCurrentLocation = async () => {
        try {
            const hasPermission = await getLocationPermission();
            if (!hasPermission) return;

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const newRegion: Region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            };

            setLocation(location);
            setRegion(newRegion);
            return location.coords;
        } catch (error) {
            console.error('위치 가져오기 오류:', error);
            Alert.alert('오류', '현재 위치를 가져올 수 없습니다.');
        }
    };

    const loadNearbyRestaurants = useCallback(async (latitude: number, longitude: number) => {
        try {
            setIsLoading(true);
            const places = await searchRestaurants(latitude, longitude);
            setRestaurants(places);
        } catch (error) {
            Alert.alert('오류', '주변 맛집을 불러올 수 없습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleRegionChangeComplete = useCallback((newRegion: Region) => {
        setRegion(newRegion);
        loadNearbyRestaurants(newRegion.latitude, newRegion.longitude);
    }, [loadNearbyRestaurants]);

    useEffect(() => {
        const initialize = async () => {
            const coords = await getCurrentLocation();
            if (coords) {
                loadNearbyRestaurants(coords.latitude, coords.longitude);
            }
        };

        initialize();
    }, [loadNearbyRestaurants]);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomEnabled={true}
                rotateEnabled={true}
            >
                {restaurants.map(restaurant => (
                    <Marker
                        key={restaurant.id}
                        coordinate={{
                            latitude: restaurant.latitude,
                            longitude: restaurant.longitude
                        }}
                        title={restaurant.name}
                        description={`${restaurant.category} - ${restaurant.distance}m`}
                        onCalloutPress={() => router.push({
                            pathname: '/restaurant/[id]',
                            params: { id: restaurant.id, data: JSON.stringify(restaurant) }
                        })}
                    />
                ))}
            </MapView>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 10,
    },
});