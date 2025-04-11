import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { HabitData, RootStackParamList } from '../types/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { updatedHabit } from "../reducers/habitReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../reducers/store";

const TimerScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Timer'>>();
  const { habitName, Habit } = route.params;

  const [timeLeft, setTimeLeft] = useState(25 * 60); // default
  const [totalTime, setTotalTime] = useState(25);

  // Calculate the progress of the circle
  const radius = 122.5;
  const circumference = 2 * Math.PI * radius;
  const progress = ((totalTime * 60 - timeLeft) / (totalTime * 60)) * circumference;
  const [isRunning, setIsRunning] = useState(false);
  const [buttonText, setButtonText] = useState('Focus');
  const [customTime, setCustomTime] = useState("25");

  const [isEditing, setIsEditing] = useState(false);

  const handleTimerPress = () => {
    if (!isRunning) {
      setIsEditing(true);
    }
  };

  const handleTimeBlur = () => {
    if (!isRunning) {
      const timeInMinutes = parseInt(customTime, 10);

      if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
        Alert.alert("Invalid Time", "Please enter a valid time in minutes.", [
          {
            text: "OK",
            onPress: () => {
              setIsEditing(true);
              setCustomTime("");
            },
          },
        ]);
        return;
      }

      setTimeLeft(timeInMinutes * 60);
      setTotalTime(timeInMinutes);
      setIsEditing(false);
    }
  };

  const handleTimeChange = (text: string) => {
    setCustomTime(text);
  };

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (!isRunning && !isEditing) {

      const startTime = new Date();

      setIsRunning(true);
      setButtonText('Give Up');
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setButtonText('Focus');
            setTotalTime(0);

            const endTime = new Date();
            const newPeriod = { start_time: startTime, end_time: endTime };
            const updatedPeriods = [...Habit.hours_accumulated_period, newPeriod];

            let accumulating_time = Habit.habit_accumulating_time + totalTime / 60;
            let habit_progress = accumulating_time / Habit.habit_target_time;

            const habitDataUpdating: HabitData = {
              ...Habit,
              habit_accumulating_time: accumulating_time,
              habit_progress: habit_progress,
              hours_accumulated_period: updatedPeriods,
              goal_reached: accumulating_time === Habit.habit_target_time,
            };

            dispatch(updatedHabit(Habit._id, habitDataUpdating));

            console.log("accumulating_time: ", accumulating_time);
            console.log("habit_progress: ", habit_progress);
            console.log("newPeriod: ", newPeriod);
            Alert.alert(
              "Congratulations!",
              habitDataUpdating.goal_reached
                ? "You've completed your goal! Well done!"
                : "You've completed your focus time! Great job!",
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ],
              { cancelable: false }
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current!);
      setIsRunning(false);
      setButtonText('Focus');
      setTimeLeft(totalTime * 60);
      setTotalTime(totalTime);
    }
  };

  const handleButtonPress = () => {
    if (buttonText === 'Focus') {
      startTimer();
    } else {
      stopTimer();
    }
  };

  // Format time (MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleGoBack = () => {
    if (isRunning) {
      Alert.alert(
        "Warning",
        "Your timer will not be saved. Are you sure you want to go back?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Leave",
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      handleTimeBlur();
    }}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.closeButton} onPress={handleGoBack}>
            <Icon name="close-circle" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>{habitName}</Text>
        </View>

        <View style={styles.timerContainer}>
          <Svg height="260" width="260">
            <G rotation="-90" origin="130, 130">
              <Circle
                cx="130"
                cy="130"
                r={radius}
                stroke="#ddd"
                strokeWidth="15"
                fill="transparent"
              />
              <Circle
                cx="130"
                cy="130"
                r={radius}
                stroke="#ff6d00"
                strokeWidth="15"
                fill="transparent"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={circumference - progress}
              />
            </G>
            {!isEditing && (
              <SvgText
                x="130"
                y="140"
                textAnchor="middle"
                fontSize="36"
                fill="#333333"
              >
                {formatTime(timeLeft)}
              </SvgText>
            )}
          </Svg>
          <View style={styles.timerTextContainer}>
            <TouchableOpacity style={styles.timerTextInput} onPress={handleTimerPress}>
              {isEditing ? (
                <TextInput
                  style={styles.editableTimerText}
                  value={customTime}
                  onChangeText={handleTimeChange}
                  keyboardType="numeric"
                  onEndEditing={handleTimeBlur}
                  autoFocus
                />
              ) : (
                <Text style={styles.timerText}></Text>
              )}
            </TouchableOpacity>
          </View>
        </View>



        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  timerTextContainer: {
    width: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerTextInput: {
    width: 100,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editableTimerText: {
    fontSize: 36,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    width: 100,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 36,
    color: '#333333',
  },
  topSection: {
    flex: 1,
    backgroundColor: '#2a9d8f',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 20,
  },
  closeButton: {
    width: 65,
    height: 65,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 50,
    right: 10,
  },
  closeButtonText: {
    color: '#333',
    fontSize: 26,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -130 }, { translateY: -130 }],
    backgroundColor: "#fff",
    borderRadius: 130,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#2a9d8f',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  button: {
    backgroundColor: '#ff6d00',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TimerScreen;