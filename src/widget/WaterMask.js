import { Text, View, StyleSheet, Dimensions } from 'react-native'
import React, { Component } from 'react'
const { height } = Dimensions.get('window')
export default class WaterMask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            numbers: []
        }
        const numbers = []
        for (let i = 1; i <= height / 80 + 1; i++) {
            this.state.numbers.push(i)
        }
    }

    render() {
        return (
            <View style={styles.waterMask}>
                {this.state.numbers.map(key => {
                    return (
                        <View style={styles.waterMaskItem} key={key}>
                            <Text style={styles.waterMaskItemName}>{global.name}</Text>
                            <Text style={styles.waterMaskItemName}>{global.name}</Text>
                            <Text style={styles.waterMaskItemName}>{global.name}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    waterMask: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999
    },
    waterMaskItem: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        flexDirection: 'row',
        transform: ' rotate(-25deg)'
    },
    waterMaskItemName: {
        fontSize: 36,
        color: '#eee',
        margin: 40,
        textAlign: 'center'
    }
})
