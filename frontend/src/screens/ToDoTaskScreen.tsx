import { View, Text, StyleSheet, FlatList } from "react-native";
import Header from "../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../reducers/store";
import { useEffect } from "react";
import { initializeEvents, updatedEvent, updateEventStatus } from "../reducers/eventReducer";
import Checkbox from 'expo-checkbox';
import { EventItem } from "@howljs/calendar-kit";
import { STATUS_COLOR } from "../constants/constants";
import { getLocalTimeWithTimezone } from "../utils/getLocalTimeZoneTime";
import { useAppStateChangeEvents } from "../utils/useAppStateChange";
import React from "react";

const ToDoScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.events);
  useAppStateChangeEvents();

  console.log("todoscreen: ", events);
  const groupEventsByDate = (events: any[]) => {
    const groupedEvents: Record<string, any[]> = {};

    events.forEach(event => {
      const eventDate = new Date(event.start.dateTime);
      const formattedDate = eventDate.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      if (!groupedEvents[formattedDate]) {
        groupedEvents[formattedDate] = [];
      }

      groupedEvents[formattedDate].push({
        id: event.id,
        title: event.title,
        time: `${eventDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} - ${new Date(event.end.dateTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
        status: event.status,
        startTime: event.start.dateTime,
        endTime: event.end.dateTime,
      });
    });

    // Convert grouped object into an array and sort by date
    return Object.entries(groupedEvents)
      .map(([date, events]) => {
        const parsedDate = date.split(', ')[1]; // "DD/MM/YYYY"
        const [day, month, year] = parsedDate.split('/'); // [04, 03, 2025]
        const timestamp = new Date(`${month}-${day}`).getTime();
        //const timestamp = new Date(`${year}-${month}-${day}`).getTime(); // YYYY-MM-DD

        events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        return {
          date,
          timestamp,
          events,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  const categorizedEvents = groupEventsByDate(events);

  const handleEventStatus = (event: EventItem) => {
    return (newValue: boolean) => {
      const currentTime = getLocalTimeWithTimezone();
      //console.log("currentTime: ", currentTime);
      const newStatus = newValue
        ? "Completed"
        : new Date(event.endTime).getTime() > new Date(currentTime).getTime()
          ? "Pending"
          : "Overdue";

      const editedEvent: EventItem = {
        ...event,
        //id: event.id,
        status: newStatus,
        color: STATUS_COLOR(newStatus),
      };

      console.log("group event:")
      dispatch(updatedEvent(editedEvent.id, editedEvent));
      console.log("editEvent:", editedEvent);
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: events.length === 0 ? "#E7E7FF" : "white" }]}>
      <Header />
      <Text style={styles.title}>Schedule</Text>
      {events.length === 0 ? (
        <Text style={styles.empty} >
          Start to add your daily events from calendar!
        </Text>
      ) : (
        <FlatList
          data={categorizedEvents}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.section}>
              <Text style={styles.date}>{item.date.split(',')[0].toUpperCase()} {item.date.split(',')[1]}</Text>
              {item.events.map((event, index) => (
                <View key={index} style={styles.eventItem}>
                  <View >
                    <Checkbox
                      value={event.status === "Completed"}
                      onValueChange={
                        handleEventStatus(event)
                      }
                      color={event.status === "Completed" ? '#38b000' : event.status === "Overdue" ? 'red' : '#000'}
                      style={[styles.checkbox]}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={styles.eventTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail">
                      {event.title}
                    </Text>
                  </View>
                  <View style={{ flexShrink: 1 }}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    paddingVertical: 6,
    marginLeft: 20,
  },
  empty: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    padding: 15,
  },
  listContainer: {
    padding: 15,
  },
  section: {
    backgroundColor: "#E7E7FF",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  eventItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 10,
  },
  eventTime: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 10
    // position: 'absolute',
    // right: 10
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  // checked: {
  //   backgroundColor: "#585883",
  //   borderColor: "#585883",
  // },
});

export default ToDoScreen;
