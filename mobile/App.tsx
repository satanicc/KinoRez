import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SearchScreen from './screens/SearchScreen';
import DetailsScreen from './screens/DetailsScreen';
import PlayerScreen from './screens/PlayerScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
          borderBottomWidth: 1,
          borderBottomColor: '#333',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: '#0f0f0f',
        },
      }}
    >
      <Stack.Screen
        name="SearchList"
        component={SearchScreen}
        options={{ title: 'KinoRez - Поиск' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: 'Детали' }}
      />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{ title: 'Просмотр', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'SearchTab') {
                iconName = focused ? 'search' : 'search-outline';
              } else if (route.name === 'Favorites') {
                iconName = focused ? 'heart' : 'heart-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#dc2626',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
              backgroundColor: '#1a1a1a',
              borderTopColor: '#333',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: -5,
            },
          })}
        >
          <Tab.Screen
            name="SearchTab"
            component={SearchStack}
            options={{ tabBarLabel: 'Поиск' }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ tabBarLabel: 'Избранное' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
