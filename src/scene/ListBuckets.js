import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, Text, FlatList } from 'react-native'
import Svg from '../widget/Svg'

const ListBuckets = ({ route, navigation }) => {
    const [profile, setProfile] = useState({})
    const [buckets, setBuckets] = useState([])

    useEffect(() => {
        setProfile(route.params)
    }, [])

    useEffect(() => {
        if (Object.keys(profile).length != 0) {
            getListBuckets(route.params)
        }
    }, [profile])

    const getListBuckets = () => {
        let url = ''
        if (profile.type === 'Amazon S3') {
            url = 'https://' + profile.endPoint
        } else if (profile.type === 'Backblaze B2') {
            url = 'https://' + profile.endPoint
        } else if (profile.type === 'CloudFlare R2') {
            url = 'https://' + profile.endPoint
        } else if (profile.type === 'Alibaba Cloud OSS') {
            url = 'https://' + profile.endPoint
        } else if (profile.type === 'MinIO') {
            url = profile.useSSL
                ? 'https://' + profile.endPoint + ':' + profile.port
                : 'http://' + profile.endPoint + ':' + profile.port
        } else {
            url = profile.useSSL
                ? 'https://' + profile.endPoint + ':' + profile.port
                : 'http://' + profile.endPoint + ':' + profile.port
        }

        global.s3 = new AWS.S3({
            s3ForcePathStyle: true,
            accessKeyId: profile.accessKey,
            secretAccessKey: profile.secretKey,
            endpoint: url
        })

        s3.listBuckets({}, (err, data) => {
            if (err) {
                Toast.show(err.toString())
            } else {
                let bucketsList = []
                for (let i = 0; i < data.Buckets.length; i++) {
                    bucketsList.push({
                        Type: 'bucket',
                        Name: data.Buckets[i].Name
                    })
                }
                setBuckets(bucketsList)
            }
        })
    }

    const listObjects = item => {
        navigation.push('listObjects', { bucket: item.Name, prefix: '' })
    }

    const Item = ({ item, index }) => (
        <Pressable
            onPress={() => {
                listObjects(item)
            }}
        >
            <View
                style={{
                    width: width - 16,
                    borderRadius: 8,
                    marginLeft: 8,
                    marginRight: 8,
                    paddingTop: 16,
                    paddingLeft: 8,
                    paddingRight: 8,
                    paddingBottom: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: index % 2 === 1 ? '#f5f5f5' : '#ffffff'
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Svg icon={item.Type} size="22" color="#171717"></Svg>
                    <Text style={{ marginLeft: 8 }}>{item.Name}</Text>
                </View>
                {item.Type === 'file' ? null : (
                    <View>
                        <Svg icon="arrow_right" size="18" color="#e5e5e5"></Svg>
                    </View>
                )}
            </View>
        </Pressable>
    )

    return (
        <View style={styles.container}>
            {buckets.length > 0 ? (
                <FlatList
                    data={buckets}
                    renderItem={({ item, index }) => <Item item={item} index={index} />}
                    keyExtractor={item => item.Name}
                />
            ) : (
                <View style={styles.content}>
                    <Svg icon="bucket" size="80" color="#171717"></Svg>
                    <Text style={styles.text}>Empty Buckets</Text>
                </View>
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

export default ListBuckets
