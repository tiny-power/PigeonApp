import React, { useEffect } from 'react'
import { StatusBar, Dimensions, View, Text, Pressable, Button, NativeModules } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-simple-toast'

import axios from './src/utils/axios'
import localStorage from './src/utils/localStorage'

import Svg from './src/widget/Svg'

import Home from './src/scene/Home'
import TabNavigator from './src/scene/TabNavigator'
import NewServer from './src/scene/NewServer'
import ListBuckets from './src/scene/ListBuckets'
import ListObjects from './src/scene/ListObjects'
import Rewarded from './src/scene/Rewarded'

global.axios = axios
global.localStorage = localStorage
global.width = Dimensions.get('window').width
global.height = Dimensions.get('window').height
global.Toast = Toast

const Stack = createNativeStackNavigator()

const { SplashVC } = NativeModules

const App = ({}) => {
    useEffect(() => {
        SplashScreen.hide()
        SplashVC.showSplash()
    }, [])

    return (
        <NavigationContainer>
            <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
            <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
                <Stack.Screen
                    name="home"
                    component={Home}
                    options={() => ({
                        headerTitle: 'S3 Servers',
                        headerTintColor: '#171717',
                        headerStyle: {
                            backgroundColor: '#FFFFFF'
                        },
                        headerShadowVisible: false
                    })}
                />
                <Stack.Screen
                    name="newServer"
                    component={NewServer}
                    options={() => ({
                        headerTitle: 'New Server',
                        headerTintColor: '#171717',
                        headerStyle: {
                            backgroundColor: '#FFFFFF'
                        },
                        headerShadowVisible: false,
                        headerBackButtonDisplayMode: 'minimal'
                    })}
                />
                <Stack.Screen
                    name="listBuckets"
                    component={ListBuckets}
                    options={() => ({
                        headerTitle: 'Buckets',
                        headerTintColor: '#171717',
                        headerStyle: {
                            backgroundColor: '#FFFFFF'
                        },
                        headerShadowVisible: false,
                        headerBackButtonDisplayMode: 'minimal'
                    })}
                />
                <Stack.Screen
                    name="listObjects"
                    component={ListObjects}
                    options={() => ({
                        headerTitle: 'Objects',
                        headerTintColor: '#171717',
                        headerStyle: {
                            backgroundColor: '#FFFFFF'
                        },
                        headerShadowVisible: false,
                        headerBackButtonDisplayMode: 'minimal'
                    })}
                />
                <Stack.Screen
                    name="rewarded"
                    component={Rewarded}
                    options={() => ({
                        headerTitle: '操作日记',
                        headerTintColor: '#171717',
                        headerStyle: {
                            backgroundColor: '#FFFFFF'
                        },
                        headerShadowVisible: false,
                        headerBackButtonDisplayMode: 'minimal'
                    })}
                />
                <Stack.Screen name="tabNavigator" component={TabNavigator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App
