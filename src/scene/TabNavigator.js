import { Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home'
import Mine from './Mine'

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    let icon
                    if (route.name === 'Home') {
                        icon = focused ? require('../assets/home-selected.png') : require('../assets/home.png')
                    } else if (route.name === 'Mine') {
                        icon = focused ? require('../assets/mine-selected.png') : require('../assets/mine.png')
                    }
                    return <Image source={icon} style={{ width: 24, height: 24 }} />
                },
                tabBarActiveTintColor: '#0064FF',
                tabBarInactiveTintColor: '#B8B8B8',
                headerTitleAlign: 'center'
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: '首页', headerTitle: '自动化办公' }} />
            <Tab.Screen name="Mine" component={Mine} options={{ tabBarLabel: '我的', headerShown: false }} />
        </Tab.Navigator>
    )
}

export default TabNavigator
