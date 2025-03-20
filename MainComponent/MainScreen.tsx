import React from 'react';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types/Type';

// Navigation types define karo
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MainScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const cards = [
    { id: 1, title: 'Warehouse Check', screen: 'WarehouseDrawernavigator', icon: 'store' },
    { id: 2, title: 'Assaying', screen: 'AssyingDrawernavigator', icon: 'science' },
    { id: 3, title: 'Dispatch Health Report', screen: 'DispatchDrawernavigator', icon: 'local-shipping' },
    { id: 4, title: 'Receive Health Report', screen: 'RecieveDrawernavigator', icon: 'assignment' },
  ];

  return (
    <View style={styles.container}>
      {/* Status Bar Customized */}
      <StatusBar backgroundColor="#F6A001" barStyle="light-content" />
      
      {cards.map((card) => (
        <TouchableOpacity
          key={card.id}
          style={styles.card}
          onPress={() => navigation.navigate(card.screen as keyof RootStackParamList)}
        >
          <View style={styles.iconContainer}>
            <Icon name={card.icon} size={28} color="#fff" />
          </View>
          <Text style={styles.cardText}>{card.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    paddingVertical: 20,
  },
  card: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginVertical: 10,
    borderBottomWidth : 1.5,
    borderBottomColor : '#F6A001'
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F6A001",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MainScreen;
