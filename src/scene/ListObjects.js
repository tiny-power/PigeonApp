import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Pressable, Text, FlatList } from 'react-native'
import Svg from '../widget/Svg'

const ListBuckets = ({ route, navigation }) => {
    const [buckets, setBuckets] = useState([])

    useEffect(() => {
        let bucket = route.params.bucket
        let prefix = route.params.prefix
        if (prefix) {
            navigation.setOptions({
                headerTitle: route.params.name
            })
        } else {
            navigation.setOptions({
                headerTitle: bucket
            })
        }
        s3.listObjectsV2({ Bucket: bucket, Prefix: prefix, Delimiter: '/' }, (err, data) => {
            if (err) {
                Toast.show(err.toString())
            } else {
                let bucketsList = []
                let commonPrefixes = data.CommonPrefixes
                for (let i = 0; i < commonPrefixes.length; i++) {
                    bucketsList.push({
                        Type: 'folder',
                        Name: commonPrefixes[i].Prefix.replace(prefix, '').replace('/', '')
                    })
                }
                let contents = data.Contents
                console.log(contents)
                for (let i = 0; i < contents.length; i++) {
                    bucketsList.push({
                        Type: 'file',
                        Name: contents[i].Key.replace(prefix, ''),
                        Size: contents[i].Size,
                        LastModified: contents[i].LastModified
                    })
                }
                setBuckets(bucketsList)
            }
        })
    }, [])

    const listObjects = item => {
        if (item.Type === 'folder') {
            navigation.push('listObjects', {
                bucket: route.params.bucket,
                name: item.Name,
                prefix: route.params.prefix + item.Name + '/'
            })
        } else if (item.Type === 'file') {
        }
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
                    <Text style={styles.text}>Empty Objects</Text>
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
