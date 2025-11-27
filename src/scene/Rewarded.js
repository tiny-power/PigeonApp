import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, FlatList } from 'react-native'
import Svg from '../widget/Svg'

const Home = ({ navigation }) => {
    const [rewardeds, setRewardeds] = useState([])

    useEffect(() => {
        fetchData()
    }, [navigation])

    const fetchData = async () => {
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
                <Svg icon="minIO" size="22"></Svg>
                <Text>{item.endPoint}</Text>
            </View>
        </View>
    )

    return (
        <View style={styles.container}>
            <FlatList
                data={rewardeds}
                renderItem={({ item, index }) => <Item item={item} index={index} />}
                keyExtractor={item => item.name}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    }
})

export default Home
