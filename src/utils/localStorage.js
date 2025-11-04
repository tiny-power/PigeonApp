import AsyncStorage from '@react-native-async-storage/async-storage'

export default class localStorage {
    static async setItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (e) {
            console.log(e)
        }
    }

    static async getItem(key) {
        try {
            const value = await AsyncStorage.getItem(key)
            return value
        } catch (e) {
            console.log(e)
            return null
        }
    }

    static async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key)
        } catch (e) {
            console.log(e)
        }
    }
}
