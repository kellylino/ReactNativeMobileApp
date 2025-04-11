import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  Dimensions,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import {
  CalendarContainer,
  CalendarHeader,
  CalendarBody,
  DraggingEventProps,
  PackedEvent,
  EventItem,
  DraggingEvent,
  SelectedEventType,
  DateOrDateTime,
  RenderHourProps,
} from '@howljs/calendar-kit';
import {
  CALENDAR_THEME,
  HIGHLIGHT_DATES,
  INITIAL_DATE,
  MAX_DATE,
  MIN_DATE,
  STATUS_COLOR,
  statusOptions,
} from '../constants/constants';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { useAppContext } from '../context/AppProvider';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { AppDispatch, RootState } from '../reducers/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SelectList } from "react-native-dropdown-select-list";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createEvent, updatedEvent, deleteEvent, initializeEvents, updateEventStatus } from '../reducers/eventReducer';
import { useAppStateChangeEvents } from '../utils/useAppStateChange';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const CalendarScreen = ({ route, currentDate, calendarRef }: any) => {
  const { numberOfDays } = route.params || 7;
  const [calendarWidth, setCalendarWidth] = useState(
    Dimensions.get('window').width
  );
  const dispatch = useDispatch<AppDispatch>();
  //const appState = useRef<AppStateStatus>(AppState.currentState as AppStateStatus);
  const colorScheme = useColorScheme();
  const { configs } = useAppContext();
  const { bottom: safeBottom } = useSafeAreaInsets();
  const [selectedEvent, setSelectedEvent] = useState<SelectedEventType>();

  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const showAddTaskModal = () => setIsAddTaskModalVisible(true);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [recurrence, setRecurrence] = useState('');
  const [status, setStatus] = useState('');
  const hideAddTaskModal = () => setIsAddTaskModalVisible(false);

  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);
  const showEditTaskModal = () => setIsEditTaskModalVisible(true);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedRecurrence, setEditedRecurrence] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const hideEditTaskModal = () => setIsEditTaskModalVisible(false);

  useEffect(() => {
    dispatch(initializeEvents())
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setCalendarWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  useAppStateChangeEvents();

  const events = useSelector((state: RootState) => state.events) || [];
  //console.log("calendar: ", events);

  const renderHour = useCallback(({ hourStr }: RenderHourProps) => {
    return (
      <View style={styles.hourContainer}>
        <View style={styles.dot} />
        <Text style={styles.hourText}>{hourStr}</Text>
      </View>
    );
  }, []);

  const _renderEvent = useCallback(
    (event: PackedEvent) => {
      const eventColor = STATUS_COLOR(event.status);
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            padding: 2,
            backgroundColor: eventColor,
          }}
        >
          {/* {event.status === 'Completed' ? (
            <Ionicons name="checkmark-circle" size={10} color="white" />
          ) : event.status === 'Pending' ? (
            <Ionicons name="time" size={10} color="white" />
          ) : (
            <Ionicons name="close-circle" size={10} color="white" />
          )} */}
          <Text style={{ color: 'white', fontSize: 12, }}>{event.title}</Text>
        </View>
      );
    },
    [events]
  );

  const _renderDraggingEvent = useCallback((props: DraggingEventProps) => {
    return (
      <DraggingEvent
        {...props}
        containerStyle={{ backgroundColor: '#1a73e8', opacity: 0.5 }}
      />
    );
  }, []);

  const _renderCustomHorizontalLine = useCallback(
    (props: { index: number; borderColor: string }) => {
      const isWholeNumber = Number.isInteger(props.index);
      if (isWholeNumber) {
        return (
          <View
            pointerEvents="none"
            style={{
              height: 1,
              backgroundColor: props.borderColor,
            }}
          />
        );
      }

      return (
        <View
          pointerEvents="none"
          style={{
            height: 1,
            borderWidth: 1,
            borderColor: props.borderColor,
            borderStyle: 'dashed',
          }}
        />
      );
    },
    []
  );

  const handleEventPress = (event: EventItem) => {
    console.log("on event press: ", event);
    setSelectedEvent(event);
    setEditedTitle(event.title ?? "");
    setEditedStatus(event.status)
    showEditTaskModal();
  };

  const handleDragCreateStart = (event: SelectedEventType) => {
    console.log("handleDragCreateStart: ", event);
    setSelectedEvent(event);
  };

  const handleCreateEvent = () => {
    // Validate required fields
    if (!newEventTitle || !status) {
      showMessage({
        message: "Please fill in all required fields.",
        type: 'danger',
      });
      return;
    }

    //console.log("selectedEvent:", selectedEvent);

    // Create a new event object
    const newEvent: EventItem = {
      id: Math.random().toString(),
      title: newEventTitle,
      start: selectedEvent?.start,
      end: selectedEvent?.end,
      status: status || "Pending",
      color: STATUS_COLOR(status || "Pending"),
    };

    dispatch(createEvent(newEvent));

    console.log("newEvent:", newEvent);

    // Reset form fields and close the modal
    setNewEventTitle("");
    setStatus("");
    setSelectedEvent(undefined);
  };

  const handleUpdatingEvent = () => {
    // Validate required fields
    if (!editedTitle || !selectedEvent) {
      showMessage({
        message: "Please fill in all required fields.",
        type: 'danger',
      });
      return;
    }

    if (!selectedEvent.id) {
      showMessage({
        message: "Please select an event!",
        type: 'danger',
      });
      return;
    } else {
      const editedEvent: EventItem = {
        ...selectedEvent,
        id: selectedEvent.id,
        title: editedTitle,
        start: selectedEvent.start,
        end: selectedEvent.end,
        recurrence: editedRecurrence,
        status: editedStatus,
        color: STATUS_COLOR(editedStatus),
      };

      dispatch(updatedEvent(editedEvent.id, editedEvent));
      console.log("editEvent:", editedEvent);
      console.log("events: ", events);
    }
    // Reset form fields and close the modal
    setEditedTitle("");
    setEditedStatus("");
    setSelectedEvent(undefined);
  };

  const handleEventDelete = () => {
    console.log("handleEventDelete: ", selectedEvent);
    if (!selectedEvent?.id) {
      showMessage({
        message: "Please select an event!",
        type: 'danger',
      });
      return;
    } else {
      dispatch(deleteEvent(selectedEvent?.id));
    }
    setSelectedEvent(undefined);
  }

  const handleOnDragEventEnd = async (event: EventItem) => {
    console.log('Drag event ended', event);
    const dragingEvent: EventItem = {
      ...selectedEvent,
      id: event.id,
      start: event.start,
      end: event.end,
    };

    dispatch(updatedEvent(dragingEvent.id, dragingEvent));
    setSelectedEvent(undefined);
  };

  const handleSelectedDragEventEnd = async (event: SelectedEventType) => {
    console.log('handleSelectedDragEventEnd', event);

    const dragingEvent: EventItem = {
      ...selectedEvent,
      id: event.id || "",
      start: event.start,
      end: event.end,
    };

    dispatch(updatedEvent(dragingEvent.id, dragingEvent));
    setSelectedEvent(undefined);
  }

  const _onChange = (date: string) => {
    currentDate.value = date;
  };

  const _onPressBackground = (props: DateOrDateTime) => {
    setSelectedEvent(undefined);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", }}>
      <CalendarContainer
        ref={calendarRef}
        calendarWidth={calendarWidth}
        numberOfDays={numberOfDays}
        locale="en"
        allowPinchToZoom
        scrollToNow
        useHaptic
        allowDragToEdit
        allowDragToCreate
        useAllDayEvent
        rightEdgeSpacing={0}
        overlapEventsSpacing={0}
        minRegularEventMinutes={5}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        initialDate={INITIAL_DATE}
        highlightDates={HIGHLIGHT_DATES}
        theme={
          configs.themeMode === 'auto'
            ? colorScheme === 'dark'
              ? CALENDAR_THEME.dark
              : CALENDAR_THEME.light
            : CALENDAR_THEME[configs.themeMode]
        }
        showWeekNumber={configs.showWeekNumber}
        onChange={_onChange}
        events={events}
        selectedEvent={selectedEvent}
        start={60}
        end={23 * 60}
        defaultDuration={60}
        spaceFromBottom={safeBottom}
        onPressBackground={_onPressBackground}
        onDragCreateEventEnd={(event) => {
          setSelectedEvent(event)
          console.log("onDragCreateEventEnd ->");
          console.log("seleted event ", event);
          showAddTaskModal();
        }}
        onDragSelectedEventEnd={handleSelectedDragEventEnd}
        onDragEventEnd={handleOnDragEventEnd}
        onPressEvent={handleEventPress}
        onLongPressEvent={(event) => {
          console.log("long press: ", event);
          setSelectedEvent(event);
        }}
        onDragCreateEventStart={handleDragCreateStart}
      >
        <CalendarHeader />
        <CalendarBody
          renderEvent={_renderEvent}
          renderHour={renderHour}
          renderCustomHorizontalLine={_renderCustomHorizontalLine}
          renderDraggingEvent={_renderDraggingEvent}
        />
      </CalendarContainer>

      {/* Add Task Modal */}
      <Modal
        visible={isAddTaskModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideAddTaskModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setNewEventTitle("");
                setRecurrence("");
                hideAddTaskModal();
                setSelectedEvent(undefined);
              }}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Event:</Text>

            {/* Habit Name Input */}
            <View style={styles.inputContainer}>
              {/* <Text style={styles.label}></Text> */}
              <TextInput
                style={styles.input}
                //placeholderTextColor="#999"
                autoFocus={true}
                clearButtonMode="while-editing"
                value={newEventTitle}
                onChangeText={setNewEventTitle}
                placeholder="Event Description"
              />
            </View>

            {/* Target Input */}
            <View style={styles.columnContainer}>
              <View style={styles.selectListWrapper}>
                <SelectList
                  placeholder="Select Status"
                  setSelected={(val: string) => setStatus(val)}
                  data={statusOptions}
                  save="key"
                  boxStyles={styles.selectListBox}
                  dropdownStyles={styles.dropdownStyles}
                />
              </View>

              {/* <View style={styles.selectListWrapper}>
                <SelectList
                  placeholder="Select Recurrence"
                  setSelected={(val: string) => setRecurrence(val)}
                  data={recurrenceOptions}
                  save="key"
                  boxStyles={styles.selectListBox}
                  dropdownStyles={styles.dropdownStyles}
                />
              </View> */}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  handleCreateEvent();
                  hideAddTaskModal();
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        visible={isEditTaskModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideEditTaskModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                hideEditTaskModal();
                setSelectedEvent(undefined);
              }}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Event</Text>
            {/* Habit Name Input */}
            <View style={styles.inputContainer}>
              {/* <Text style={styles.label}>Event name:</Text> */}
              <TextInput
                style={styles.input}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Enter Description"
                //placeholderTextColor="#999"
                autoFocus={true}
                clearButtonMode="while-editing" // Show clear button while typing (iOS only)
              />
            </View>
            {/* Target Input */}
            <View style={styles.columnContainer}>
              <View style={styles.selectListWrapper}>
                <SelectList
                  placeholder="Select Status"
                  setSelected={(val: string) => setEditedStatus(val)}
                  data={statusOptions}
                  save="key"
                  boxStyles={styles.selectListBox}
                  dropdownStyles={styles.dropdownStyles}
                  defaultOption={{
                    key: editedStatus,
                    value: editedStatus,
                  }}
                />
              </View>
              {/* <View style={styles.selectListWrapper}>
                <SelectList
                  placeholder="Select Recurrence"
                  setSelected={(val: string) => setEditedRecurrence(val)}
                  data={recurrenceOptions}
                  save="key"
                  boxStyles={styles.selectListBox}
                  dropdownStyles={styles.dropdownStyles}
                  defaultOption={editedRecurrence !== "" ?
                    (() => {
                        const foundOption = recurrenceOptions.find(option => option.key === editedRecurrence);
                        return foundOption ? { key: foundOption.key, value: foundOption.value } : undefined;
                    })()
                    : undefined}
                />
              </View> */}
            </View>
            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  handleEventDelete();
                  hideEditTaskModal();
                }}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  handleUpdatingEvent();
                  hideEditTaskModal();
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal >
    </View >
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    width: "100%",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    padding: 10
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#23cfde',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
  },
  resourceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  dateContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectListWrapper: {
    //flex: 1,
    height: 60,
    //marginVertical: 5,
  },
  selectListBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 60,
    alignItems: "center",
    //justifyContent: "center",
  },
  dropdownStyles: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    //marginTop: 5,
    backgroundColor: "white",
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: "row", // Place Text and TextInput in the same row
    alignItems: "center", // Align items vertically in the center
    width: "100%", // Take up full width
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    //fontWeight: "bold",
    padding: 10,
    color: "#000",
  },
  input: {
    flex: 1, // Take up remaining space in the row
    fontSize: 16,
    color: "#000",
    padding: 10,
    //paddingVertical: 5, // Add padding for better touch area
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  closeButton: {
    right: -140,
    padding: 10,
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 8,
    right: 0,
    top: -4,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38b000',
  },
  hourText: {
    //fontWeight: 'bold',
    fontSize: 8,
  },
});
