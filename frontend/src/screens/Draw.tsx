import React, {
  useCallback,
  useRef
} from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import {
  DrawerContentScrollView,
  createDrawerNavigator,
  DrawerItem
} from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { INITIAL_DATE } from '../constants/constants';
import { CalendarKitHandle } from '@howljs/calendar-kit';
import { useSharedValue } from 'react-native-reanimated';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import Settings from './SettingsCalendar';
import CalendarScreen from './CalendarScreen';
import AppProvider from '../context/AppProvider';
import Header from '../components/CalendarHeader';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const theme = useTheme();

  const _onPressItem = (viewMode: string, numberOfDays: number) => {
    props.navigation.navigate('Calendar', {
      numberOfDays: numberOfDays,
    });
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="1 Day" onPress={() => _onPressItem('day', 1)} />
      <DrawerItem label="3 Days" onPress={() => _onPressItem('week', 3)} />
      <DrawerItem label="Work week" onPress={() => _onPressItem('week', 5)} />
      <DrawerItem label="7 Days" onPress={() => _onPressItem('week', 7)} />
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      <View style={[styles.line, { backgroundColor: theme.colors.border }]} />
      <DrawerItem
        label="Settings"
        onPress={() => {
          // Use the navigation prop to navigate to the Settings screen
          props.navigation.navigate('Settings');
        }}
      />
    </DrawerContentScrollView>
  );
}

const DrawerLayout = () => {
  const _renderDrawer = (props: DrawerContentComponentProps) => (
    <CustomDrawerContent {...props} />
  );
  const calendarRef = useRef<CalendarKitHandle>(null);
  const currentDate = useSharedValue(INITIAL_DATE);

  const onPressPrevious = () => {
    calendarRef.current?.goToPrevPage();
  };

  const onPressNext = () => {
    calendarRef.current?.goToNextPage();
  };

  const _onPressToday = useCallback(() => {
    calendarRef.current?.goToDate({
      date: new Date().toISOString(),
      animatedDate: true,
      hourScroll: true,
    });
  }, []);

  return (
    <AppProvider>
      <Drawer.Navigator
        screenOptions={{ drawerType: 'front' }}
        drawerContent={_renderDrawer}
      >
        <Drawer.Screen
          name="Calendar"
          options={{
            header: () => (
              <Header
                currentDate={currentDate}
                onPressToday={_onPressToday}
                onPressPrevious={onPressPrevious}
                onPressNext={onPressNext}
              />
            ),
          }}
        >
          {(props) => (
            <CalendarScreen
              {...props}
              calendarRef={calendarRef}
              currentDate={currentDate}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name="Settings" component={Settings} />
      </Drawer.Navigator>
    </AppProvider>
  );
};

export default DrawerLayout;

const styles = StyleSheet.create({
  line: {
    height: 1,
  },
});