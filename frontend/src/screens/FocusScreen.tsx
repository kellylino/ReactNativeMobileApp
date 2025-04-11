import React, { useRef, useState, useEffect, memo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { HabitData, RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from "../components/Header";
import Checkbox from 'expo-checkbox';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../reducers/store";
import { updatedHabit } from "../reducers/habitReducer";

const FocusScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits);

  const ActivityItem = memo(({ habit }: { habit: HabitData }) => {
    const [checkStatus, setCheckStatus] = useState(habit.is_checked);
    const progressAnim = useRef(new Animated.Value(habit.habit_progress)).current;

    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: habit.habit_progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }, [habit.habit_progress]);

    const handleCheckboxChange = () => {
      const today = new Date().toISOString();
      let updatedCheckedDates = [...habit.checked_dates];

      if (habit.checked_dates.some(date => date.split("T")[0] === today.split("T")[0])) {
        updatedCheckedDates = habit.checked_dates.filter(date => date.split("T")[0] !== today.split("T")[0]);
      } else {
        updatedCheckedDates.push(today);
      }

      let accumulating_time = checkStatus
        ? Math.max(0, habit.habit_accumulating_time - 1)
        : habit.habit_accumulating_time + 1

      const habitDataUpdating: HabitData = {
        ...habit,
        is_checked: !checkStatus,
        habit_accumulating_time: accumulating_time,
        habit_progress:
          (habit.habit_accumulating_time + (checkStatus ? -1 : 1)) / habit.habit_target_time,

        checked_dates: updatedCheckedDates,
        goal_reached: accumulating_time === habit.habit_target_time,
      };

      dispatch(updatedHabit(habit._id, habitDataUpdating));
      setCheckStatus(!checkStatus);
    };

    return (
      <View style={[
        styles.card,
        { backgroundColor: "#E7E7FF" },
      ]}
        key={habit._id}
      >
        <View style={styles.iconWrapper}>
          <Image source={{ uri: habit.habit_img }} style={styles.icon} resizeMode="cover" />
        </View>

        <View style={styles.content}>
          <View style={styles.textRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.habitText} numberOfLines={1} ellipsizeMode="tail">
                {habit.habit_name}
              </Text>
            </View>
            <View style={{ flexShrink: 1, marginHorizontal: 10 }}>
              <Text style={styles.daysText}>
                {habit.habit_target_type === "hours"
                  ? habit.habit_accumulating_time.toFixed(2)
                  : habit.habit_accumulating_time.toFixed(0)
                } / {habit.habit_target_time} {" "}
                {habit.habit_target_type === "hours"
                  ? "Hours"
                  : "Days"
                }
              </Text>
            </View>
            <View>
              {!habit.goal_reached && (
                habit.habit_target_type === "hours" ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Timer", { habitName: habit.habit_name, Habit: habit })}
                    style={styles.focusButton}
                  >
                    <Text style={styles.focusText}>Go</Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <Checkbox
                      value={checkStatus}
                      onValueChange={handleCheckboxChange}
                      color={checkStatus ? '#ff6d00' : '#ff6d00'}
                      style={styles.checkbox}
                    />
                  </View>
                )
              )}
            </View>
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <View style={styles.percentageContainer}>
              <Text style={styles.percentageText}>
                {(habit.habit_progress * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  });

  return (
    <View style={styles.container}>
      <Header />
      <FlatList
        data={habits}
        renderItem={({ item }) => <ActivityItem habit={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  iconWrapper: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  textRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  habitText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  daysText: {
    fontSize: 12,
    color: "#777",
  },
  progressRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    marginRight: 15,
    backgroundColor: "white",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff6d00",
  },
  focusButton: {
    width: 25,
    height: 25,
    backgroundColor: "#ff6d00",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  focusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 14,
    color: '#555'
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
  },
});

export default FocusScreen;