import { Text, View, StyleSheet, Image } from 'react-native'
import Svg from '../widget/Svg'
const Mine = ({ route, navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/headbg.png')} style={styles.imgbg}></Image>
            <View style={styles.avatarBox}>
                <Image
                    style={styles.avatar}
                    source={
                        global.avatar || global.sex == 'man'
                            ? require('../assets/man.png')
                            : require('../assets/woman.png')
                    }
                ></Image>
            </View>
            <Text style={styles.name}>{global.name}</Text>
            <View style={styles.menu}>
                <View style={styles.menuitemline}>
                    <Svg icon="lock" size="26" color="#4684FF"></Svg>
                    <View style={styles.menuname}>
                        <Text>修改密码</Text>
                    </View>
                    <Svg icon="arrow_right" size="26" color="#4684FF"></Svg>
                </View>
                <View style={styles.menuitem}>
                    <Svg icon="exit" size="26" color="#4684FF"></Svg>
                    <View style={styles.menuname}>
                        <Text>退出</Text>
                    </View>
                </View>
            </View>
            <View style={styles.noticebtn}>
                <Svg icon="notice" size="26" color="#ffffff"></Svg>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: '100%'
    },
    imgbg: {
        width: '100%',
        height: 236
    },
    avatarBox: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: -170
    },
    avatar: {
        height: 60,
        width: 60
    },
    name: { textAlign: 'center', fontSize: 16, color: '#fff', lineHeight: 20, marginTop: 5 },
    menu: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        margin: 15,
        marginTop: 30,
        paddingRight: 10,
        paddingLeft: 10,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowColor: '#656882',
        elevation: 4
    },
    menuitem: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        height: 55
    },
    menuitemline: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        height: 55,
        borderBottomColor: '#E3E4E8',
        borderBottomWidth: 1
    },
    menuname: { flex: 1, margin: 10 },
    noticebtn: {
        position: 'absolute',
        top: 40,
        right: 20
    }
})

export default Mine
