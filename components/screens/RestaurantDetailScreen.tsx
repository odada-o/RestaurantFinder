// screens/RestaurantDetailScreen.js
import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantDetailScreen({ route }) {
    const { restaurant } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Implement actual favorite storage logic
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `${restaurant.name}에 가보는건 어떠세요? 맛있는 ${restaurant.category} 맛집입니다!`,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: 'https://via.placeholder.com/400x200' }}
                style={styles.image}
            />
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{restaurant.name}</Text>
                    <Text style={styles.category}>{restaurant.category}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFavorite ? 'red' : 'black'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                        <Ionicons name="share-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
                <Text style={styles.address}>서울시 강남구 테헤란로 123</Text>
                <Text style={styles.phone}>02-123-4567</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>영업시간</Text>
                <Text>월-금: 11:30 - 21:00</Text>
                <Text>주말: 12:00 - 21:00</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>메뉴</Text>
                <Text>김치찌개 - 8,000원</Text>
                <Text>된장찌개 - 8,000원</Text>
                <Text>비빔밥 - 9,000원</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
    },
    header: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        marginLeft: 15,
    },
    infoContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    rating: {
        fontSize: 18,
        marginBottom: 8,
    },
    address: {
        color: '#666',
        marginBottom: 4,
    },
    phone: {
        color: '#666',
    },
    section: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});