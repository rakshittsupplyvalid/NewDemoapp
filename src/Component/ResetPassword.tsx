import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  Text,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from "react-native";
import api from "../service/api/apiInterceptors";
import { RootStackParamList } from "../types/Type";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { mmkvStorage } from '../service/storage';
import Navbar from "../../App/Navbar";
import Footer from "../../App/Footer";


const ResetPassword : React.FC = () => {
 


  const [OldPassword, setOldPassword] = useState("Pass@123");
  const [NewPassword, setNewPassword] = useState("Password@123");
  const [ConfirmPassword, setConfirmPassword] = useState("Password@123");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ConformpasswordVisible, ConformsetPasswordVisible] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const resetPassword = async (): Promise<void> => {
    try {
     const token = mmkvStorage.getItem('token', undefined);
if (!token) {
  Alert.alert("Authentication Error", "User not authenticated. Please log in again.");
  return;
}

console.log("token", token); // Now it's safe to use




     const response = await api.put("/api/user/changepassword", {
  oldPassword: OldPassword,
  newPassword: NewPassword,
  confirmPassword: ConfirmPassword

});

      if (response.data) {
        Alert.alert("Success", "Your password has been reset successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.log("Password reset failed", error);
    }
  };



  return (

     <View style={styles.mainContainer}>
      <Navbar />
   
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StatusBar backgroundColor={"black"} barStyle="light-content" />
          <View style={styles.logoContainer}>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              value={OldPassword}
              onChangeText={setOldPassword}
         
           
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={!passwordVisible}
              value={NewPassword}
              onChangeText={setNewPassword}
            
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={22}
       
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!ConformpasswordVisible}
              value={ConfirmPassword}
              onChangeText={setConfirmPassword}
          
            />
            <TouchableOpacity
              onPress={() => ConformsetPasswordVisible(!ConformpasswordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={ConformpasswordVisible ? "eye-off" : "eye"}
                size={22}
            
              />
            </TouchableOpacity>
          </View>

           

          <TouchableOpacity style={styles.button} onPress={resetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("DispatchDrawernavigator")}>
            <Text style={styles.forgotPasswordText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    
     <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding : 30
    
   
  },
 mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
   
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F6A001",
    borderRadius: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: "#000",
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    backgroundColor: "#F6A001",
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    alignSelf: "center",
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
});

export default ResetPassword;
