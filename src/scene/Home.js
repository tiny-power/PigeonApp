import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    FlatList,
    NativeModules,
    NativeEventEmitter,
    requireNativeComponent
} from 'react-native'
import Svg from '../widget/Svg'

const { RewardedVC, InterstitialVC, ExpressVC, SelfRenderVC, SplashVC } = NativeModules

//const BannerVC = NativeModules.BannerVC
const NativeVCContainer = requireNativeComponent('NativeVCContainer')
// const eventEmitter = new NativeEventEmitter(RewardedVC)

const Home = ({ navigation }) => {
    const [profiles, setProfiles] = useState([])

    // useEffect(() => {
    //     const subscription = eventEmitter.addListener('wert', event => {
    //         console.log(event)
    //     })
    //     return () => subscription.remove()
    // }, [])

    useEffect(() => {
        fetchData()
    }, [navigation])

    const fetchData = async () => {
        let profilesStr = await localStorage.getItem('profiles')
        if (profilesStr != null) {
            setProfiles(JSON.parse(profilesStr))
        }
    }

    useEffect(() => {
        if (profiles.length === 0) {
            navigation.setOptions({
                headerRight: null
            })
        } else {
            navigation.setOptions({
                headerRight: () => (
                    <Pressable
                        onPress={() => {
                            handlePress()
                        }}
                    >
                        <Svg icon="logo" size="24" color="#171717"></Svg>
                    </Pressable>
                )
            })
        }
    }, [profiles])

    const handlePress = () => {
        //RewardedVC.showAd()
        //SelfRenderVC.showAd()
        SplashVC.showSplash()
        //BannerVC.showAd()
        // try {
        //     const eventId = await RewardedVC.testPrint('asd')
        //     console.log(`Created a new event with id ${eventId}`)
        // } catch (e) {
        //     console.error(e)
        // }
        //navigation.navigate('newServer')
    }

    const deleteProfile = async index => {
        let newProfiles = profiles.filter((_, i) => i !== index)
        setProfiles(newProfiles)
        await localStorage.setItem('profiles', JSON.stringify(newProfiles))
    }

    const listBuckets = item => {
        navigation.push('listBuckets', item)
    }

    const Item = ({ item, index }) => (
        <Pressable
            onPress={() => {
                listBuckets(item)
            }}
        >
            <View
                style={{
                    width: width - 24,
                    borderWidth: 1,
                    borderColor: '#e5e5e5',
                    borderRadius: 8,
                    marginTop: 12,
                    marginLeft: 12,
                    marginRight: 12,
                    paddingTop: 12,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Svg icon="minIO" size="22"></Svg>
                    <Text>{item.endPoint}</Text>
                </View>
                <View>
                    <Pressable
                        onPress={() => {
                            deleteProfile(index)
                        }}
                    >
                        <Svg icon="delete" size="20" color="#e7000b"></Svg>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    )

    return (
        <View style={styles.container}>
            <NativeVCContainer style={{ width: '100%', height: 300 }} />
            {profiles.length > 0 ? (
                <FlatList
                    data={profiles}
                    renderItem={({ item, index }) => <Item item={item} index={index} />}
                    keyExtractor={item => item.name}
                />
            ) : (
                <Pressable onPress={handlePress}>
                    <View style={styles.content}>
                        <Svg icon="logo" size="80" color="#171717"></Svg>
                        <Text style={styles.text}>Connect to your first S3 server</Text>
                    </View>
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginTop: 15,
        fontSize: 18,
        color: '#171717'
    }
})

export default Home
