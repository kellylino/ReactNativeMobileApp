import { DateOrDateTime } from "@howljs/calendar-kit";
import { SharedValue } from "react-native-reanimated";

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  color?: string;
  textColor?: string;
}

export interface RootStackParamList {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Layout: undefined;
  Timer: {
    habitName: string,
    Habit: HabitData,
  };
  [key: string]: undefined | object;
};

export interface AccountLinkProps {
  promptText: string;
  linkText: string;
  navigateTo: string;
}

export interface AccountInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export interface HeaderProps {
  currentDate: SharedValue<string>;
  onPressToday?: () => void;
  onPressPrevious?: () => void;
  onPressNext?: () => void;
}

export interface UserData {
  id?: number;
  email: string;
  password?: string;
  username: string;
  profile_img?: string;
}

export interface HabitData {
  _id: string;
  user_id?: string;
  habit_name: string;
  habit_img: string;
  habit_target_time: number;
  habit_target_type: 'hours' | 'days';
  habit_accumulating_time: number;
  habit_progress: number;
  is_checked: boolean;
  checked_dates: string[];
  hours_accumulated_period: { start_time: Date; end_time: Date }[];
  goal_reached: boolean;
}
