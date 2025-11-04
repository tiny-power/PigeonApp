import React, { Component, useEffect } from 'react'
import { Dimensions, Modal, StyleSheet, Text, SafeAreaView, TouchableOpacity, View, ScrollView } from 'react-native'

const { width } = Dimensions.get('window')
export default class SelectDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: this.props.show,
            entityList: this.props.entityList
        }
    }

    closeModal() {
        this.setState({
            isVisible: false
        })
        this.props.closeModal(false)
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            isVisible: nextProps.show
        }
    }

    renderItem(item, i) {
        return (
            <TouchableOpacity key={i} onPress={this.choose.bind(this, item.name)} style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    choose(name) {
        if (this.state.isVisible) {
            this.closeModal()
            this.props.callback(name)
        }
    }

    render() {
        return (
            <Modal
                transparent={true}
                visible={this.state.isVisible}
                animationType={'fade'}
                onRequestClose={() => this.closeModal()}
            >
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.closeModal()}>
                    <SafeAreaView style={styles.modalStyle}>
                        <ScrollView>
                            <View style={styles.optArea}>
                                {this.state.entityList.map((item, i) => this.renderItem(item, i))}
                            </View>
                        </ScrollView>
                        <View style={styles.actionSheetGap}></View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={this.closeModal.bind(this)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.closeText}>取消</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalStyle: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: width,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        // maxHeight: 300,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    optArea: {
        flex: 1,
        flexDirection: 'column'
    },
    item: {
        width: width,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        fontSize: 16
    },
    actionSheetGap: {
        height: 8,
        backgroundColor: '#f7f8fa'
    },
    cancel: {
        width: width,
        height: 30,
        marginTop: 12,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    closeBtn: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeText: {
        fontSize: 16
    }
})
