import React, { useEffect, useState } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import DrawerNavigator from '../screens/Draw';
import FocusScreen from '../screens/FocusScreen';
import ToDoScreen from '../screens/ToDoTaskScreen';
import MeScreen from '../screens/MeScreen';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reducers/store';
import { updateEventStatus } from '../reducers/eventReducer';
import { updateHabitsStatus } from '../reducers/habitReducer';

const NavigationTab = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'home', title: 'Home', focusedIcon: 'home-heart', unfocusedIcon: 'home-outline' },
    { key: 'calendar', title: 'Calendar', focusedIcon: 'calendar-plus', unfocusedIcon: 'calendar-outline' },
    { key: 'focus', title: 'Focus', focusedIcon: 'cat', unfocusedIcon: 'head-check-outline' },
    { key: 'daily', title: 'To Do', focusedIcon: 'clock-time-eight', unfocusedIcon: 'clock-outline' },
    { key: 'me', title: 'Me', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
  ]);

  useEffect(() => {
    const currentRoute = routes[index].key;
    //console.log(`Current screen: ${currentRoute}`);

    switch (currentRoute) {
      case 'home':
        //console.log('HomeScreen is focused');
        break;
      case 'calendar':
        //console.log('calendarScreen is focused');
        dispatch(updateEventStatus());
        break;
      case 'focus':
        //console.log('FocusScreen is focused');
        dispatch(updateHabitsStatus());
        break;
      case 'daily':
        //console.log('ToDoScreen is focused');
        dispatch(updateEventStatus());
        break;
      case 'me':
        //console.log('MeScreen is focused');
        break;
      default:
        break;
    }

    return () => {
      console.log(`Leaving screen: ${currentRoute}`);
    };
  }, [index, routes]);


  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    calendar: DrawerNavigator,
    focus: FocusScreen,
    daily: ToDoScreen,
    me: MeScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={styles.barStyle}
      activeColor="#000"
      inactiveColor="#808080"
    />
  );
};

const styles = StyleSheet.create({
  // screen: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   //backgroundColor: '#E7E7FF'
  // },
  barStyle: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default NavigationTab;