import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, FlatList, Pressable, NativeModules, NativeEventEmitter } from 'react-native'
import Svg from '../widget/Svg'
import dayjs from 'dayjs'

const { RewardedVC } = NativeModules

const eventEmitter = new NativeEventEmitter(RewardedVC)

const Home = ({ navigation }) => {
    const [userId, setUserId] = useState('')
    const [rewardeds, setRewardeds] = useState([])
    const [flag, setFlag] = useState('')

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable
                    onPress={() => {
                        navigation.reset({ index: 0, routes: [{ name: 'home' }] })
                    }}
                >
                    <Svg icon="arrow_left" size="24" color="#171717"></Svg>
                </Pressable>
            )
        })
        const subscription = eventEmitter.addListener('rewarded', async event => {
            await localStorage.setItem('uniqueID', event.idfv)
            let rewardeds = await localStorage.getItem('rewardeds')
            if (rewardeds != null) {
                rewardeds = JSON.parse(rewardeds)
            } else {
                rewardeds = []
            }
            rewardeds.push(dayjs().format('YYYY-MM-DD HH:mm:ss'))
            await localStorage.setItem('rewardeds', JSON.stringify(rewardeds))
            setFlag(dayjs().format('YYYY-MM-DD HH:mm:ss'))
            insertrewardeds()
        })
        return () => subscription.remove()
    }, [])

    useEffect(() => {
        fetchData()
    }, [flag])

    const insertrewardeds = async () => {
        let unique_id = await localStorage.getItem('uniqueID')
        let params = {
            unique_id: unique_id,
            record_time: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        let res = await axios.get('rewarded', { params })
    }

    const fetchData = async () => {
        let uniqueID = await localStorage.getItem('uniqueID')
        setUserId(uniqueID)
        let rewardedsStr = await localStorage.getItem('rewardeds')
        if (rewardedsStr != null) {
            setRewardeds(JSON.parse(rewardedsStr))
        }
    }

    const Item = ({ item, index }) => (
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
                <Text>
                    {index + 1 + '、'} {item}
                </Text>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <View>
                <Text style={{ marginLeft: 12, marginTop: 12 }}>UseId: {userId}</Text>
            </View>
            <FlatList
                data={rewardeds}
                renderItem={({ item, index }) => <Item item={item} index={index} />}
                keyExtractor={item => item}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#FFFFFF'
    }
})

export default Home
