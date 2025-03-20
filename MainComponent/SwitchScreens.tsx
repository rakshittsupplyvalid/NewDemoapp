import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


const SwitchScreens = () => {
  const navigation = useNavigation();
  const [selectedScreen, setSelectedScreen] = React.useState('');

  const handleSelectScreen = (screen: string) => {
    setSelectedScreen(screen);
    // navigation.navigate(screen); // Navigate to selected screen
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Select a Screen</Text>
      <Picker
        selectedValue={selectedScreen}
        onValueChange={(itemValue) => handleSelectScreen(itemValue)}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Screen 1" value="Screen1" />
        <Picker.Item label="Screen 2" value="Screen2" />
        <Picker.Item label="Screen 3" value="Screen3" />
        <Picker.Item label="Screen 4" value="Screen4" />
      </Picker>
    </View>
  );
};

export default SwitchScreens;
