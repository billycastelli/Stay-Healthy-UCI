/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  AsyncStorage,
  KeyboardAvoidingView,
  useEffect,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
  },
});

import AppleHealthKit from 'rn-apple-healthkit';
import {TextInput} from 'react-native-gesture-handler';

let options = {
  permissions: {
    read: ['Height', 'Weight', 'StepCount', 'Steps', 'DistanceWalkingRunning'],
  },
};

AppleHealthKit.initHealthKit(options, (err, results) => {
  if (err) {
    console.log('error initializing Healthkit: ', err);
    return;
  }
});

function FetchUsername({userId, onUpdate}) {
  // For switching tabs, this code runs when the screen is "in focus"
  // Could probably be used to retrive the persistent name/height/weight data
  useFocusEffect(
    React.useCallback(() => {
      console.log('In focus');

      return () => console.log('Out of focus');
    }, []),
  );

  return null;
}

class ActivityView extends React.Component {
  // Activity view will show overview of recent activity
  // Will make calculation for "calories burned", display updating total
  // https://www.healthline.com/nutrition/10000-steps-calories-burned#bottom-line
  //

  constructor(props) {
    super(props);
    this.printSteps = this.printSteps.bind(this);
  }

  state = {
    todaySteps: null,
    username: '',
    caloriesBurned: null,
  };

  printSteps() {
    AppleHealthKit.getStepCount(null, (err, results) => {
      console.log('RESULTS', results);
      this.setState({todaySteps: results}, () => {
        console.log('RESULTS FROM STATE', this.state.todaySteps);
      });
    });
  }

  render() {
    stepText = null;
    if (this.state.todaySteps) {
      stepText = <Text>Today's steps: {this.state.todaySteps.value}</Text>;
    }

    var greeting = 'Hello there!';
    if (this.state.username) {
      greeting = 'Hello there, ' + this.state.username + '!';
    }

    return (
      <React.Fragment>
        <View style={{flex: 1, paddingTop: 45}}>
          <TabHeader headerText="Activity analyzer" bgColor="#6c8672" />
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>{greeting}</Text>
          <Button title="Step count" onPress={this.printSteps}></Button>
          {stepText}
          <FetchUsername />
        </View>
      </React.Fragment>
    );
  }
}

class TabHeader extends React.Component {
  render() {
    return (
      <View style={[styles.header, {backgroundColor: this.props.bgColor}]}>
        <Text style={{color: 'white', fontSize: 24, textAlign: 'center'}}>
          {this.props.headerText}
        </Text>
      </View>
    );
  }
}

class FoodView extends React.Component {
  // This screen will use the users height, weight, age, etc to send
  // a request to our database and will receive and display food recommendations
  render() {
    return (
      <View style={{flex: 1, paddingTop: 45}}>
        <TabHeader headerText="What would you like to eat?" bgColor="#d87073" />
      </View>
    );
  }
}

class ProfileView extends React.Component {
  // This is where the user will enter important information about
  // height and weight. These are used in the total calorie calculation per meal.

  constructor() {
    super();
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.saveNameInput = this.saveNameInput.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.saveHeightInput = this.saveHeightInput.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.saveWeightInput = this.handleWeightChange.bind(this);
  }
  state = {
    nameInput: '',
    heightInput: '',
    weightInput: '',
  };

  handleUsernameChange(inputText) {
    this.setState({
      nameInput: inputText,
    });
  }

  handleHeightChange(inputText) {
    this.setState({
      heightInput: inputText,
    });
  }

  handleWeightChange(inputText) {
    this.setState({
      weightInput: inputText,
    });
  }

  saveNameInput() {
    storeName = async () => {
      try {
        console.log('Attemping to store ' + this.state.nameInput);
        await AsyncStorage.setItem('username', this.state.nameInput);
        console.log('Saved username?');
      } catch (error) {}
    };
    storeName();
  }

  saveHeightInput() {
    storeHeight = async () => {
      try {
        console.log('Attemping to store ' + this.state.heightInput);
        await AsyncStorage.setItem('height', this.state.heightInput);
        console.log('Saved height?');
      } catch (error) {}
    };
    storeHeight();
  }

  saveWeightInput() {
    storeHeight = async () => {
      try {
        console.log('Attemping to store ' + this.state.weightInput);
        await AsyncStorage.setItem('weight', this.state.weightInput);
        console.log('Saved weight?');
      } catch (error) {}
    };
    storeWeight();
  }

  render() {
    // KeyboardAvoidingView moves the screen up when a keyboard is openedx
    return (
      <React.Fragment>
        <View style={{flex: 1, paddingTop: 45}}>
          <TabHeader headerText="User profile" bgColor="#737495" />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 20}}>Welcome, Username</Text>
          <Image
            style={{width: 50, height: 50}}
            source={{
              uri: 'https://facebook.github.io/react-native/img/tiny_logo.png',
            }}
          />
        </View>
        {/* <KeyboardAvoidingView
          style={{
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}>
          <Text>Welcome, Username</Text>
          <Image
            style={{width: 50, height: 50}}
            source={{
              uri: 'https://facebook.github.io/react-native/img/tiny_logo.png',
            }}
          /> */}
        {/* </KeyboardAvoidingView> */}
        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text>Enter your name</Text>
          <TextInput
            style={{
              height: 40,
              width: 100,
              borderColor: '#8b95a6',
              borderWidth: 1,
            }}
            onChangeText={this.handleUsernameChange}
            defaultValue={this.state.nameInput}
          />
          <Button title="Submit" onPress={this.saveNameInput}>
            Submit
          </Button>
        </KeyboardAvoidingView>

        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text>Enter your height</Text>
          <TextInput
            style={{
              height: 40,
              width: 100,
              borderColor: '#8b95a6',
              borderWidth: 1,
            }}
            onChangeText={this.handleHeightChange}
            defaultValue={this.state.heightInput}
          />
          <Button title="Submit" onPress={this.saveHeightInput}>
            Submit
          </Button>
        </KeyboardAvoidingView>

        <KeyboardAvoidingView
          behavior="padding"
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text>Enter your weight (in pounds)</Text>
          <TextInput
            style={{
              height: 40,
              width: 100,
              borderColor: '#8b95a6',
              borderWidth: 1,
            }}
            onChangeText={this.handleWeightChange}
            defaultValue={this.state.weightInput}
            keyboardType="number-pad"
            returnKeyType="done"
          />
          {/* <Text>Echo: {this.state.weightInput}</Text> */}
          <Button title="Submit" onPress={this.saveWeightInput}>
            Submit
          </Button>
        </KeyboardAvoidingView>
      </React.Fragment>
    );
  }
}

const Tab = createBottomTabNavigator();
class App extends React.Component {
  // Handles switching between tabs
  // Each tab is a component
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Activity" component={ActivityView} />
          <Tab.Screen name="Food" component={FoodView} />
          <Tab.Screen name="Profile" component={ProfileView} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
