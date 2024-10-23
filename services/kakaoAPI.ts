// services/kakaoAPI.ts
import axios, { AxiosInstance } from 'axios';
import { Restaurant } from '@/types/restaurant';

const KAKAO_API_KEY = '여기에_카카오_API_키를_넣으세요';

const kakaoAPI: AxiosInstance = axios.create({
    baseURL: 'https://dapi.kakao.com/v2/local',
    headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`,
    },
});

interface KakaoSearchResult {
    documents: {
        id: string;
        place_name: string;
        category_name: string;
        category_group_code: string;
        category_group_name: string;
        phone: string;
        address_name: string;
        road_address_name: string;
        x: string;
        y: string;
        place_url: string;
        distance: string;
    }[];
}

export const searchRestaurants = async (
    latitude: number,
    longitude: number,
    radius: number = 1000
): Promise<Restaurant[]> => {
    try {
        const response = await kakaoAPI.get<KakaoSearchResult>('/search/category.json', {
            params: {
                category_group_code: 'FD6',
                x: longitude,
                y: latitude,
                radius,
                size: 15,
            },
        });

        return response.data.documents.map(place => ({
            id: place.id,
            name: place.place_name,
            latitude: parseFloat(place.y),
            longitude: parseFloat(place.x),
            category: place.category_name.split(' > ').pop() || '',
            address: place.road_address_name,
            phone: place.phone,
            distance: place.distance,
            placeUrl: place.place_url,
            rating: Math.random() * 2 + 3, // 임시 평점 (3~5)
        }));
    } catch (error) {
        console.error('맛집 검색 오류:', error);
        throw error;
    }
};