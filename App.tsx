import React, { useEffect } from 'react'
import { StatusBar, Dimensions, View, Text, Pressable, Button, NativeModules, NativeEventEmitter } from 'react-native'

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
import OperationLog from './src/scene/OperationLog'
import dayjs from 'dayjs'

global.axios = axios
global.localStorage = localStorage
global.width = Dimensions.get('window').width
global.height = Dimensions.get('window').height
global.Toast = Toast
global.name = 'S3Vault'

const Stack = createNativeStackNavigator()

const { SplashVC, BannerVC, SelfRenderVC, InterstitialVC, RewardedVC } = NativeModules

const splashEmitter = new NativeEventEmitter(SplashVC)
const bannerEmitter = new NativeEventEmitter(BannerVC)
const interstitialEmitter = new NativeEventEmitter(InterstitialVC)
const rewardedEmitter = new NativeEventEmitter(RewardedVC)

const App = ({}) => {
    useEffect(() => {
        RewardedVC.getDeviceUUID().then(result => {
            localStorage.setItem('uniqueID', result)
        })
        SplashScreen.hide()
        SplashVC.showSplash()
        BannerVC.loadAd()
        SelfRenderVC.loadAd()
        InterstitialVC.loadAd()
        RewardedVC.loadAd()

        const splashSubscription = splashEmitter.addListener('record', async event => {
            insertRecord(event.id, event.publisher_revenue, event.adunit_format, dayjs().format('YYYY-MM-DD HH:mm:ss'))
        })
        const bannerSubscription = bannerEmitter.addListener('record', async event => {
            insertRecord(event.id, event.publisher_revenue, event.adunit_format, dayjs().format('YYYY-MM-DD HH:mm:ss'))
        })
        const interstitialSubscription = interstitialEmitter.addListener('record', async event => {
            insertRecord(event.id, event.publisher_revenue, event.adunit_format, dayjs().format('YYYY-MM-DD HH:mm:ss'))
        })
        const rewardedSubscription = rewardedEmitter.addListener('record', async event => {
            insertRecord(event.id, event.publisher_revenue, event.adunit_format, dayjs().format('YYYY-MM-DD HH:mm:ss'))
        })
        return () => {
            splashSubscription.remove()
            bannerSubscription.remove()
            interstitialSubscription.remove()
            rewardedSubscription.remove()
        }
    }, [])

    const insertRecord = async (show_id, publisher_revenue, adunit_format, record_time) => {
        let unique_id = await localStorage.getItem('uniqueID')
        let params = {
            unique_id: unique_id,
            show_id: show_id,
            publisher_revenue: publisher_revenue,
            adunit_format: adunit_format,
            record_time: record_time
        }
        await axios.get('insertRecord', { params })
    }

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
                    name="operationLog"
                    component={OperationLog}
                    options={() => ({
                        headerTitle: 'Operation Log',
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
