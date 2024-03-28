import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Image, Text, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { Audio } from 'expo-av';

//icons
import { MaterialIcons } from '@expo/vector-icons';


const EventForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [recording, setRecording] = useState();
  const [audioUri, setAudioUri] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const [events, setEvents] = useState([]);

  //image pick
  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission denied!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      // console.log(result.assets[0].uri);
      setImageUri(result.assets[0].uri);
    }
  };

  //audio record
  const handleAudioRecord = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone denied');
        return;
      }

      const recordingInstance = new Audio.Recording();
      await recordingInstance.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recordingInstance.startAsync();
      setRecording(recordingInstance);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const audioUri = recording.getURI();
      setAudioUri(audioUri);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  // Función para reproducir audio
  const playAudio = async (audioUri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error al reproducir audio:', error);
    }
  };

  //save event
  const saveEvent = async () => {

    const event = {
      title,
      description,
      imageUri,
      audioUri: audioUri // Agregamos el URI del audio al objeto del evento
    };

    const newEvents = [...events, event];
    setEvents(newEvents);
    await AsyncStorage.setItem('events', JSON.stringify(newEvents));
    setTitle('');
    setDescription('');
    setImageUri('');
    setAudioUri(''); // Limpiamos el URI del audio
    setRecording(null); // Limpiamos el estado de grabación
    setIsRecording(false); // Actualizamos el estado de grabación a false
  };

  //load events
  const loadEvents = async () => {
    const events = await AsyncStorage.getItem('events');
    if (events) {
      setEvents(JSON.parse(events));
    }
  };

  //delete event
  const deleteEvent = async (index) => {
    try {
      const alert = await Alert.alert(
        'Delete Event',
        'Are you sure you want to delete this event?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: async () => {
              const newEvents = events.filter((event, i) => i !== index);
              setEvents(newEvents);
              await AsyncStorage.setItem('events', JSON.stringify(newEvents));
            }
          }
        ],
        { cancelable: false }
      );


    }
    catch (error) {
      console.log(error);
    }
  };

  //delete all events
  const deleteAllEvents = async () => {
    try {
      const alert = await Alert.alert(
        'Delete All Events',
        'Are you sure you want to delete all events?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: 'OK',
            onPress: async () => {
              setEvents([]);
              await AsyncStorage.removeItem('events');
            }
          }
        ],
        { cancelable: false }
      );

      if (alert) {
        await AsyncStorage.removeItem('events');
        setEvents([]);
      }else{
        console.log('Cancel');
      }
    } catch (error) {
      console.log(error);
    }
  };


  //useEffect
  useEffect(() => {
    loadEvents();
  }, []);


  return (
    <View className="flex-1 items-center px-3 pt-10">
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        className="w-full p-2 border-2 border-gray-300 rounded-lg mt-3"
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        className="w-full p-2 border-2 border-gray-300 rounded-lg mt-3"
      />
      <View className="flex flex-row mt-3">
        <Pressable onPress={handleImagePick} className="flex-1 items-center">
          <MaterialIcons name="image" size={24} color="black" />
          <Text className="text-sm">Pick Image</Text>
        </Pressable>
        <Pressable onPress={isRecording ? handleStopRecording : handleAudioRecord} className="flex-1 items-center">
          <MaterialIcons name={isRecording ? "stop" : "mic"} size={24} color={isRecording ? "red" : "black"} />
          <Text className="text-sm">{isRecording ? "Stop Recording" : "Record Audio"}</Text>
        </Pressable>
      </View>

      <View className="flex flex-row mt-3 w-full justify-center">
        <Pressable onPress={saveEvent} className="bg-green-700  p-2 rounded-lg mt-3">
          <Text className="text-center text-white font-bold">Save Event</Text>
        </Pressable>
      </View>

      <View className="mt-5 w-full">
        {/* delete all events btn */}
        <View className="flex flex-row justify-start">
          {
            events.length > 0 && (
              <Pressable onPress={deleteAllEvents} className="bg-red-500 p-2 rounded-lg">
                <Text className="text-white">Delete All Events</Text>
              </Pressable>
            )
          }
        </View>
        <FlatList
          data={events}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className="flex flex-row items-center p-2 border-2 border-gray-300 rounded-lg mt-3 w-full">
              <Image source={{ uri: item.imageUri }} style={{ width: 50, height: 50 }} />
              <View className="flex-1 ml-3">
                <Text className="font-bold">{item.title}</Text>
                <Text>{item.description}</Text>
              </View>
              {/* Botón para reproducir audio */}
              <Pressable onPress={() => playAudio(item.audioUri)} className="bg-green-700 p-2 rounded-lg">
                <Text className="text-white">Play Audio</Text>
              </Pressable>
              <Pressable onPress={() => deleteEvent(index)} className="bg-red-500 p-2 rounded-lg ml-3">
                <Text className="text-white">Delete</Text>
              </Pressable>
            </View>
          )}
        />
      </View>

    </View>
  );
};

export default EventForm;
