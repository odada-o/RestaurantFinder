// app/tabs/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'map';

                    if (route.name === 'index') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'list') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'favorites') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '지도',
                }}
            />
            <Tabs.Screen
                name="list"
                options={{
                    title: '리스트',
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: '즐겨찾기',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: '프로필',
                }}
            />
        </Tabs>
    );
}