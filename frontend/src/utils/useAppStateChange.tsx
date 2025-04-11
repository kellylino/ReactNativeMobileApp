import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useDispatch } from "react-redux";
import { updateHabitsStatus } from "../reducers/habitReducer";
import { AppDispatch } from "../reducers/store";
import { updateEventStatus } from "../reducers/eventReducer";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";

export const useAppStateChangeHabits = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState = useRef<AppStateStatus>(AppState.currentState as AppStateStatus);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        dispatch(updateHabitsStatus());
      }
      appState.current = nextAppState;
      console.log("app state: ", appState.current);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
};

export const useAppStateChangeEvents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const appState = useRef<AppStateStatus>(AppState.currentState as AppStateStatus);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        dispatch(updateEventStatus());
      }
      appState.current = nextAppState;
      console.log("app state: ", appState.current);
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [dispatch]); // Dependency array ensures effect only runs once on mount
};
