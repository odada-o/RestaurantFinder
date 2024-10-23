// services/naverAPI.ts
import axios, { AxiosInstance } from 'axios';
import { Restaurant } from '../types/restaurant';

const NAVER_CLIENT_ID = 'qbBZaPa0GRYB8mAPL0D8';
const NAVER_CLIENT_SECRET = '_kk1fZVynf';

const naverAPI: AxiosInstance = axios.create({
    baseURL: 'https://openapi.naver.com/v1',
    headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
    },
});

export const searchRestaurants = async (
    latitude: number,
    longitude: number,
    radius: number = 500
): Promise<Restaurant[]> => {
    try {
        // 검색어를 더 구체적으로 변경
        const query = encodeURIComponent('맛집');
        console.log('Search Parameters:', {
            latitude,
            longitude,
            radius,
            query
        });

        const response = await naverAPI.get('/search/local.json', {
            params: {
                query,
                display: 15,
                start: 1,
                sort: 'random',
                coordinate: `${longitude},${latitude}`,
                radius,
            },
        });

        console.log('API Response:', response.data); // 응답 데이터 확인

        if (!response.data.items || response.data.items.length === 0) {
            console.log('No results found');
            return []; // 결과가 없을 경우 빈 배열 반환
        }

        return response.data.items.map((item: any) => ({
            id: item.title + Math.random(), // 고유 ID 생성
            name: item.title.replace(/<[^>]*>?/g, ''),
            latitude: parseFloat(item.mapy) / 10000000,
            longitude: parseFloat(item.mapx) / 10000000,
            category: item.category || '음식점',
            address: item.address,
            phone: item.telephone || '',
            distance: item.distance || '0',
            placeUrl: item.link,
            rating: (Math.random() * 2 + 3).toFixed(1),
        }));
    } catch (err: any) {  // error 대신 err: any로 변경
        console.error('맛집 검색 오류 상세:', err.response?.data || err);
        throw err;
    }
};