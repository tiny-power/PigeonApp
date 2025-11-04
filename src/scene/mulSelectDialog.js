import React, { Component } from 'react'
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    View,
    ScrollView,
    Image
} from 'react-native'
import Svg from '../widget/Svg'
const { width, height } = Dimensions.get('window')
export default class MulSelectDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: this.props.show,
            values: [],
            entityList: this.props.entityList,
            codeshow: this.props.codeshow,
            clientH: this.props.clientH
        }
        // this.state.entityList.forEach(v => {
        //     v.selected = false
        // })
    }
    componentDidMount() {
        //第一种修改方式
        this.setState({ clientH: this.props.clientH })
    }
    static getDerivedStateFromProps(nextProps) {
        return {
            isVisible: nextProps.show
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     this.setState({isVisible: nextProps.show});
    // }

    closeModal() {
        this.setState({
            isVisible: false
        })
        this.props.closeModal(false)
    }

    renderItem(item, i) {
        return (
            <TouchableOpacity key={i + '-' + item.code} onPress={this.choose.bind(this, i)} style={styles.item}>
                <View style={styles.rowView}>
                    <Text style={styles.itemText}>
                        {this.state.codeshow ? item.code + '-' : ''}
                        {item.name}
                    </Text>
                    {item.selected ? <Svg icon="selected" size="22" color="#009DF9"></Svg> : null}
                </View>
            </TouchableOpacity>
        )
    }

    choose(i) {
        let temp = this.state.entityList
        temp[i].selected = !temp[i].selected

        this.setState({ entityList: temp })

        if (this.state.entityList[i].selected) {
            this.state.values.push(this.state.entityList[i].code)
        } else {
            let index = this.state.values.findIndex(item => {
                if (item.code == this.state.entityList[i]) {
                    return true
                }
            })
            this.state.values.splice(index, 1)
        }
    }

    define() {
        if (this.state.isVisible) {
            this.props.callback(this.state.values)
            this.closeModal()
        }
    }

    renderDialog() {
        return (
            <SafeAreaView style={styles.modalStyle}>
                <ScrollView style={{ maxHeight: this.state.clientH }}>
                    <View style={styles.optArea}>
                        {this.state.entityList.map((item, i) => this.renderItem(item, i))}
                    </View>
                </ScrollView>

                <View style={styles.touchStyle}>
                    <TouchableOpacity style={styles.closeBtn} onPress={this.define.bind(this)} activeOpacity={0.7}>
                        <Text style={styles.closeText}>确定</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeBtn} onPress={this.closeModal.bind(this)} activeOpacity={0.7}>
                        <Text style={styles.closeText}>取消</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}
                >
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.closeModal()}>
                        {this.renderDialog()}
                    </TouchableOpacity>
                </Modal>
            </View>
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
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        maxHeight: (height * 2) / 3
    },
    optArea: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 12,
        marginBottom: 12
    },
    langouStyle: {
        width: 10,
        height: 10
    },
    item: {
        width: width,
        minHeight: 40,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center'
    },
    itemText: {
        fontSize: 16,
        textAlign: 'left'
    },
    cancel: {
        width: '50%',
        height: 30,
        marginTop: 12,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    closeBtn: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E4E6F1',
        borderTopWidth: 2,
        borderRightWidth: 1,
        width: '50%'
    },
    rowView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    closeText: {
        fontSize: 16
    },
    touchStyle: {
        flexDirection: 'row',
        width: '100%'
    }
})
