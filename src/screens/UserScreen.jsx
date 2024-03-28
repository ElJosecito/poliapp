import React from 'react';
import { View, Text, Image } from 'react-native';
import userImage from '../assets/Josecito.png';


const UserScreen = () => {
  const delegateInfo = {
    firstName: 'José',
    lastName: 'Martinez',
    matricula: '2022-0521'
  };

  const reflection = "La democracia es más que un sistema político, es un compromiso con el bien común y la participación ciudadana.";

  return (
    <View className="flex-1 items-center justify-center">
      {/* Sección de información del delegado */}
      <View className="items-center mb-8">
        <Image source={userImage} style={{ width: 100, height: 100, borderRadius: 50 }} />
        <Text className="text-lg font-bold mt-2">
          {delegateInfo.firstName} {delegateInfo.lastName}
        </Text>
        <Text className="text-base mt-1">Matrícula: {delegateInfo.matricula}</Text>
      </View>
    
        {/* Sección de reflexión */}
      <View className="items-center">
        <Text className="text-base text-center">{reflection}</Text>
      </View>
    </View>
  );
};

export default UserScreen;
