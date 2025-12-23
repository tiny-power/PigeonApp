import { Text, View, StyleSheet, Pressable, TextInput, Switch, NativeModules, NativeEventEmitter } from 'react-native'
import React, { useState, useEffect } from 'react'
import SelectDialog from './selectDialog'
import Svg from '../widget/Svg'
import AWS from 'aws-sdk'
import Schema from 'async-validator'

const { InterstitialVC, RewardedVC } = NativeModules

const NewServer = ({ navigation }) => {
    const [type, setType] = useState('')
    const [name, setName] = useState('')
    const [endPoint, setEndPoint] = useState('')
    const [port, setPort] = useState('9000')
    const [accessKey, setAccessKey] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [useSSL, setUseSSL] = useState(false)
    const [pathStyle, setPathStyle] = useState(true)
    const [selectList, setSelectList] = useState([
        { name: 'Amazon S3' },
        { name: 'Backblaze B2' },
        { name: 'CloudFlare R2' },
        { name: 'Alibaba Cloud OSS' },
        { name: 'MinIO' },
        { name: 'Other' }
    ])
    const [selectshow, setSelectshow] = useState(false)
    const [createFlag, setCreateFlag] = useState(false)
    const [loading, setLoading] = useState(false)

    const [isRepeatClick, setIsRepeatClick] = useState(true)

    useEffect(() => {
        setLoading(true)
        navigation.setOptions({
            headerRight: () => (
                <Pressable
                    onPress={() => {
                        navigation.push('operationLog')
                    }}
                >
                    <Svg icon="detail" size="24" color="#171717"></Svg>
                </Pressable>
            )
        })
        InterstitialVC.showAd()
    }, [])
    useEffect(() => {
        const focusListener = navigation.addListener('focus', () => {
            if (loading) {
                InterstitialVC.showAd()
                navigation.reset({ index: 0, routes: [{ name: 'home' }] })
            }
        })
        return focusListener
    }, [loading])

    useEffect(() => {
        if (type === 'Amazon S3') {
            setEndPoint('s3.amazonaws.com')
        } else {
            setEndPoint('')
        }
    }, [type])

    useEffect(() => {
        const descriptor = {
            type: {
                type: 'string',
                required: true
            },
            name: {
                type: 'string',
                required: true
            },
            endPoint: {
                type: 'string',
                required: true
            },
            port: {
                type: 'number',
                required: true
            },
            accessKey: {
                type: 'string',
                required: true
            },
            secretKey: {
                type: 'string',
                required: true
            }
        }
        const validator = new Schema(descriptor)
        validator.validate(
            {
                type: type,
                name: name,
                endPoint: endPoint,
                port: parseInt(port),
                accessKey: accessKey,
                secretKey: secretKey
            },
            (errors, fields) => {
                if (errors) {
                    setCreateFlag(false)
                } else {
                    setCreateFlag(true)
                }
            }
        )
    }, [type, name, endPoint, port, accessKey, secretKey])

    const callback = data => {
        setSelectshow(false)
        setType(data)
    }

    const handlePress = () => {
        setSelectshow(true)
    }

    const addProfile = async () => {
        if (!createFlag) {
            return
        }
        if (isRepeatClick) {
            setIsRepeatClick(false)
            let url = ''
            if (type === 'Amazon S3') {
                setUseSSL(true)
                setPort('443')
                url = 'https://' + endPoint
            } else if (type === 'Backblaze B2') {
                setUseSSL(true)
                setPort('443')
                url = 'https://' + endPoint
            } else if (type === 'CloudFlare R2') {
                setUseSSL(true)
                setPort('443')
                url = 'https://' + endPoint
            } else if (type === 'Alibaba Cloud OSS') {
                setUseSSL(true)
                setPort('443')
                url = 'https://' + endPoint
            } else if (type === 'MinIO') {
                url = useSSL ? 'https://' + endPoint + ':' + port : 'http://' + endPoint + ':' + port
            } else {
                url = useSSL ? 'https://' + endPoint + ':' + port : 'http://' + endPoint + ':' + port
            }

            // let s3 = new AWS.S3({
            //     s3ForcePathStyle: pathStyle,
            //     accessKeyId: accessKey,
            //     secretAccessKey: secretKey,
            //     endpoint: url
            // })

            let accessKeyId = 'AKIAYSE4N774P5KZTSZI'
            let secretAccessKey = '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'

            let s3 = new AWS.S3({
                s3ForcePathStyle: pathStyle,
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                endpoint: url
            })

            s3.listBuckets({}, async (err, data) => {
                if (err) {
                    Toast.show(err.toString())
                } else {
                    let profiles = await localStorage.getItem('profiles')
                    if (profiles != null) {
                        profiles = JSON.parse(profiles)
                    } else {
                        profiles = []
                    }
                    profiles.push({
                        name: name,
                        type: type,
                        endPoint: endPoint,
                        port: port,
                        accessKey: accessKeyId,
                        secretKey: secretAccessKey,
                        useSSL: useSSL,
                        pathStyle: pathStyle
                    })
                    RewardedVC.showAd()
                    await localStorage.setItem('profiles', JSON.stringify(profiles))
                    navigation.push('operationLog')
                    //navigation.reset({ index: 0, routes: [{ name: 'home' }] })
                }
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputclass}>
                <TextInput
                    style={{ padding: 0, width: '100%' }}
                    onChangeText={text => setName(text)}
                    value={name}
                    placeholder="Display Name"
                    placeholderTextColor="#737373"
                />
            </View>
            <Pressable onPress={handlePress}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        height: 46,
                        marginBottom: 20,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10
                    }}
                >
                    <Text>Account Type</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>{type}</Text>
                        <Svg icon="arrow_right" size="18" color="#e5e5e5"></Svg>
                    </View>
                </View>
            </Pressable>
            <SelectDialog
                entityList={selectList}
                show={selectshow}
                closeModal={data => setSelectshow(false)}
                callback={data => callback(data)}
            />
            {type === 'Amazon S3' ? null : (
                <View style={styles.inputclass}>
                    <TextInput
                        style={{ padding: 0, width: '100%', height: 66 }}
                        onChangeText={text => setEndPoint(text)}
                        value={endPoint}
                        placeholder="EndPoint is a host name or an IP address"
                        placeholderTextColor="#737373"
                    />
                </View>
            )}
            {type === 'MinIO' || type === 'Other' ? (
                <View style={styles.inputclass}>
                    <TextInput
                        style={{ padding: 0, width: '100%', height: 66 }}
                        inputMode="numeric"
                        keyboardType="numeric"
                        onChangeText={text => setPort(text)}
                        value={port}
                        placeholder="Port"
                        placeholderTextColor="#737373"
                    />
                </View>
            ) : null}
            <View style={styles.inputclass}>
                <TextInput
                    style={{ padding: 0, width: '100%', height: 66 }}
                    onChangeText={text => setAccessKey(text)}
                    value={accessKey}
                    placeholder="Access Key ID"
                    placeholderTextColor="#737373"
                />
            </View>
            <View style={styles.inputclass}>
                <TextInput
                    style={{ padding: 0, width: '100%', height: 66 }}
                    onChangeText={text => setSecretKey(text)}
                    value={secretKey}
                    placeholder="Secret Access Key"
                    placeholderTextColor="#737373"
                />
            </View>
            {type === 'MinIO' || type === 'Other' ? (
                <View
                    style={{
                        backgroundColor: '#fff',
                        height: 46,
                        marginBottom: 20,
                        borderRadius: 6,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10
                    }}
                >
                    <Text>Use secure transfer(SSL/TLS)</Text>
                    <Switch
                        trackColor={{ false: 'red', true: '#171717' }}
                        thumbColor={'#ffffff'}
                        ios_backgroundColor="#e5e5e5"
                        onValueChange={value => setUseSSL(value)}
                        value={useSSL}
                    />
                </View>
            ) : null}
            <Pressable onPress={addProfile}>
                <View
                    style={{
                        backgroundColor: '#171717',
                        height: 46,
                        borderRadius: 8,
                        color: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: createFlag ? 1 : 0.5
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 16 }}>Create</Text>
                </View>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        paddingTop: 70
    },
    inputclass: {
        backgroundColor: '#fff',
        height: 46,
        marginBottom: 20,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 10
    }
})

export default NewServer
