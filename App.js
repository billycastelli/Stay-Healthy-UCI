/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Image,
  KeyboardAvoidingView,
  useEffect,
  TouchableHighlight,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import SafeAreaView from 'react-native-safe-area-view';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useFocusEffect} from '@react-navigation/native';

import FoodScreen from './screens/FoodScreen';
import DiaryScreen from './screens/DiaryScreen';
import AppContext from './AppContext';

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

function FetchUsername(props) {
  const {getUsername} = props;
  // For switching tabs, this code runs when the screen is "in focus"
  // Could probably be used to retrive the persistent name/height/weight data
  useFocusEffect(
    React.useCallback(() => {
      {
        console.log('In focus');
        getUsername();
      }
      return () => {
        console.log('Out of focus');
      };
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
    this.asyncUsernameFetch = this.asyncUsernameFetch.bind(this);
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

  asyncUsernameFetch() {
    console.log('Passed function');
    AsyncStorage.getItem('username').then(value => {
      console.log('username is...', value);
      this.setState({username: value});
    });
  }

  render() {
    let stepText = null;
    if (this.state.todaySteps) {
      stepText = <Text>Today's steps: {this.state.todaySteps.value}</Text>;
    }

    let greeting = 'Hello there!';
    if (this.state.username) {
      greeting = 'Hello there, ' + this.state.username + '!';
    }

    return (
      <React.Fragment>
        <FetchUsername getUsername={this.asyncUsernameFetch} />
        <View style={{flex: 1, paddingTop: 40}}>
          <TabHeader headerText="Activity analyzer" bgColor="#6c8672" />
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold'}}>{greeting}</Text>
          <Button title="Step count" onPress={this.printSteps} />
          {stepText}
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
    const storeName = async () => {
      try {
        console.log('Attemping to store ' + this.state.nameInput);
        await AsyncStorage.setItem('username', this.state.nameInput);
        console.log('Saved username?');
      } catch (error) {}
    };
    storeName();
  }

  saveHeightInput() {
    const storeHeight = async () => {
      try {
        console.log('Attemping to store ' + this.state.heightInput);
        await AsyncStorage.setItem('height', this.state.heightInput);
        console.log('Saved height?');
      } catch (error) {}
    };
    storeHeight();
  }

  saveWeightInput() {
    const storeWeight = async () => {
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
        <View style={{flex: 1, paddingTop: 40}}>
          <TabHeader headerText="User profile" bgColor="#737495" />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 20, textAlign: 'center'}}>
            Welcome, Username
          </Text>
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
  addDiaryEntry = (food, date) => {
    if (!date) {
      date = new Date();
      // date = date.toISOString();
      // date = date.slice(0, date.indexOf('T'));
      date = date.toDateString();
    }
    const updateDiary = async () => {
      try {
        // await AsyncStorage.setItem('diary', 'my secret value');
        const diaryJSON = await AsyncStorage.getItem('diary');
        let diary = JSON.parse(diaryJSON);
        if (!diary) diary = [];
        const entry = diary.filter(obj => obj.id === date);
        if (entry.length < 1) {
          diary.push({
            id: date,
            log: [food],
          });
        } else {
          entry[0].log.push(food);
        }
        await AsyncStorage.setItem('diary', JSON.stringify(diary));
        console.log('================ updated diary:', diary);
      } catch (e) {
        // save error
        console.error(e);
      }
    };

    updateDiary();
  };
  // Handles switching between tabs
  // Each tab is a component
  render() {
    return (
      <NavigationContainer>
        <AppContext.Provider
          value={{
            addDiaryEntry: this.addDiaryEntry,
          }}>
          <Tab.Navigator>
            <Tab.Screen name="Activity" component={ActivityView} />
            {/*<Tab.Screen name="Food" component={FoodView} />*/}
            <Tab.Screen name="Food" component={FoodScreen} />

            <Tab.Screen name="Profile" component={ProfileView} />
            <Tab.Screen name="Diary" component={DiaryScreen} />
          </Tab.Navigator>
        </AppContext.Provider>
      </NavigationContainer>
    );
  }
}

export default App;
