// types/restaurant.ts
export interface Restaurant {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
    address: string;
    phone: string;
    distance: string;
    placeUrl: string;
    rating?: number;
}

export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}