/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import Icon from 'react-native-vector-icons/FontAwesome';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

Icon.loadFont();

import 'react-native-gesture-handler';
import {
  Button as RneButton,
  ThemeProvider,
  Input,
  Text,
  Card,
  ListItem,
} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  // Text,
  StatusBar,
  Button,
  Image,
  KeyboardAvoidingView,
  useEffect,
  TouchableHighlight,
  TextInput,
  Switch,
  Dimensions,
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

function FetchComponent(props) {
  const {focusFunction} = props;
  // For switching tabs, this code runs when the screen is "in focus"
  // Could probably be used to retrive the persistent name/height/weight data
  useFocusEffect(
    React.useCallback(() => {
      {
        console.log('In focus');
        focusFunction();
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
    this.getTodaySteps = this.getTodaySteps.bind(this);
    this.getWeeklySteps = this.getWeeklySteps.bind(this);
    this.getWeeklyWalking = this.getWeeklyWalking.bind(this);
    this.focusFetch = this.focusFetch.bind(this);
  }

  state = {
    todaySteps: null,
    username: null,
    weight: null,
    step_counts: [],
    walk_counts: [],
  };

  getTodaySteps() {
    let options = {date: new Date().toISOString()};
    AppleHealthKit.getStepCount(options, (err, steps) => {
      if (err) {
        console.log('error:', err);
      }
      if (steps) {
        this.state.todaySteps = steps.value.toFixed(0);
      }
    });
  }

  getWeeklySteps() {
    this.setState({step_counts: []}, () => {
      for (let day = 0; day < 7; day++) {
        var d = new Date();
        d.setDate(d.getDate() - day);

        let options = {date: new Date(d).toISOString()};
        AppleHealthKit.getStepCount(options, (err, steps) => {
          if (err) {
            console.log('error:', err);
          }
          const {step_counts} = this.state;
          if (steps) {
            this.setState({step_counts: step_counts.concat([steps])});
          }
        });
      }
    });
  }

  getWeeklyWalking() {
    this.setState({walk_counts: []}, () => {
      for (let day = 0; day < 7; day++) {
        var d = new Date();
        d.setDate(d.getDate() - day);

        let options = {date: new Date(d).toISOString(), unit: 'mile'};
        AppleHealthKit.getDistanceWalkingRunning(options, (err, today) => {
          if (err) {
            console.log('error:', err);
          }
          const {walk_counts} = this.state;
          if (today) {
            this.setState({walk_counts: walk_counts.concat([today])});
          }
        });
      }
    });
  }

  generateChart(source, title) {
    let cleaned_data = source
      .map(d => d && {date: d.startDate.slice(5, 10), value: d.value})
      .sort((a, b) => a.date > b.date);
    const data = {
      labels: cleaned_data.map(d => d.date),
      datasets: [
        {
          data: cleaned_data.map(d => d.value),
          strokeWidth: 2, // optional
        },
      ],
    };
    return <LineActivityChart data={data} title={title} />;
  }

  focusFetch() {
    this.getTodaySteps();
    this.getWeeklySteps();
    this.getWeeklyWalking();
    AsyncStorage.getItem('username').then(value => {
      console.log('username is...', value);
      this.setState({username: value});
    });
    AsyncStorage.getItem('weight').then(value => {
      console.log('weight is...', value);
      this.setState({weight: value});
    });
  }

  render() {
    let greeting = 'Hello there!';
    if (this.state.username) {
      greeting = 'Hello there, ' + this.state.username + '!';
    }

    let step_chart = null;
    let total_steps = null;
    let avg_steps = null;
    if (this.state.step_counts && this.state.step_counts.length > 0) {
      step_chart = this.generateChart(
        this.state.step_counts,
        (title = 'Steps'),
      );
      total_steps = 0;
      for (var day = 0; day < this.state.step_counts.length; day++) {
        total_steps += this.state.step_counts[day].value;
      }
      avg_steps = (total_steps / this.state.step_counts.length).toFixed(0);
    }

    let walking_chart = null;
    let total_miles = null;
    let avg_miles = null;
    if (this.state.walk_counts && this.state.walk_counts.length > 0) {
      walking_chart = this.generateChart(
        this.state.walk_counts,
        (title = 'Walking + Running distance'),
      );
      for (var day = 0; day < this.state.walk_counts.length; day++) {
        total_miles += this.state.walk_counts[day].value;
      }
      avg_miles = total_miles / this.state.step_counts.length;
    }

    let avg_calories = null;
    if (this.state.weight) {
      avg_calories = (this.state.weight * 0.57 * avg_miles).toFixed(0);
    }
    return (
      <ScrollView>
        <FetchComponent focusFunction={this.focusFetch} />
        <View style={{flex: 1, paddingTop: 40}}>
          <TabHeader headerText="Activity analyzer" bgColor="#6c8672" />
        </View>
        <View
          style={{
            flex: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, fontWeight: 'bold', padding: 20}}>
            {greeting}
          </Text>
          <Text>Today's steps: {this.state.todaySteps}</Text>
          <Text>Average steps this week: {avg_steps}</Text>
          <Text>Average daily calorie burn: {avg_calories}</Text>
        </View>
        <View>{step_chart}</View>
        <View>{walking_chart}</View>
      </ScrollView>
    );
  }
}

class LineActivityChart extends React.Component {
  render() {
    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#08130D',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(1, 1, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
    };
    return (
      <React.Fragment>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: 8,
          }}>
          {this.props.title}
        </Text>
        <LineChart
          data={this.props.data}
          width={screenWidth} // from react-native
          height={220}
          chartConfig={chartConfig}
          bezier
          fromZero
          style={{
            borderRadius: 10,
            paddingLeft: 10,
          }}
        />
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
    this.saveWeightInput = this.saveWeightInput.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.saveAgeInput = this.saveAgeInput.bind(this);
  }
  state = {
    nameInput: '',
    heightInput: '',
    weightInput: '',
    ageInput: '',
    username: '',
    height: '',
    weight: '',
    age: '',
    isVegan: false,
    isVegetarian: false,
    isLactoseIntolerant: false,
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

  handleAgeChange(inputText) {
    this.setState({
      ageInput: inputText,
    });
  }

  saveNameInput() {
    const storeName = async () => {
      try {
        console.log('Attemping to store ' + this.state.nameInput);
        await AsyncStorage.setItem('username', this.state.nameInput);
        this.setState({username: this.state.nameInput});
        this.console.log('Saved username?');
      } catch (error) {}
    };
    storeName();
  }

  saveHeightInput() {
    const storeHeight = async () => {
      try {
        console.log('Attemping to store ' + this.state.heightInput);
        await AsyncStorage.setItem('height', this.state.heightInput);
        this.setState({height: this.state.heightInput});
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
        this.setState({weight: this.state.weightInput});
        console.log('Saved weight?');
      } catch (error) {}
    };
    storeWeight();
  }

  saveAgeInput() {
    const storeAge = async () => {
      try {
        console.log('Attemping to store ' + this.state.ageInput);
        await AsyncStorage.setItem('age', this.state.ageInput);
        this.setState({age: this.state.ageInput});
        console.log('Saved age?');
      } catch (error) {}
    };
    storeAge();
  }

  componentDidMount() {
    AsyncStorage.getItem('username').then(value => {
      console.log('username is...', value);
      this.setState({username: value});
    });

    AsyncStorage.getItem('height').then(value => {
      console.log('height is...', value);
      this.setState({height: value});
    });

    AsyncStorage.getItem('weight').then(value => {
      console.log('weight is...', value);
      this.setState({weight: value});
    });

    AsyncStorage.getItem('age').then(value => {
      console.log('age is...', value);
      this.setState({age: value});
    });

    AsyncStorage.getItem('isVegan').then(value => {
      console.log('isVegan...', value);
      if (value === 'true') {
        this.setState({isVegan: true});
      } else {
        this.setState({isVegan: false});
      }
    });

    AsyncStorage.getItem('isVegetarian').then(value => {
      console.log('isVegatarian...', value);
      if (value === 'true') {
        this.setState({isVegetarian: true});
      } else {
        this.setState({isVegetarian: false});
      }
    });

    AsyncStorage.getItem('isLactoseIntolerant').then(value => {
      console.log('isLactoseIntolerant...', value);
      if (value === 'true') {
        this.setState({isLactoseIntolerant: true});
      } else {
        this.setState({isLactoseIntolerant: false});
      }
    });
  }

  render() {
    let emptyProfile = (
      <React.Fragment>
        <Card title="New user">
          <Text style={{fontSize: 16}}>
            Fill our your profile to begin your health journey!
          </Text>
        </Card>
      </React.Fragment>
    );

    let filledProfile = (
      <ProfileCard
        username={this.state.username}
        height={this.state.height}
        weight={this.state.weight}
        age={this.state.age}
        isVegan={this.state.isVegan}
        isLactoseIntolerant={this.state.isLactoseIntolerant}
        isVegetarian={this.state.isVegetarian}
      />
    );

    let profileCard = emptyProfile;

    if (this.state.username) {
      console.log('Switching card');
      profileCard = filledProfile;
    }
    return (
      <React.Fragment>
        <KeyboardAwareScrollView>
          <View style={{flex: 1, paddingTop: 40}}>
            <TabHeader headerText="User profile" bgColor="#737495" />
          </View>
          {profileCard}
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              paddingTop: 12,
              paddingLeft: 9,
              paddingBottom: 8,
            }}>
            Metrics
          </Text>

          <ProfileInput
            attribute="name"
            handleChangeFunction={this.handleUsernameChange}
            stateInput={this.state.nameInput}
            saveFunction={this.saveNameInput}
            placeholder="Lisa"
          />

          <ProfileInput
            attribute="age (years)"
            handleChangeFunction={this.handleAgeChange}
            stateInput={this.state.ageInput}
            saveFunction={this.saveAgeInput}
            placeholder="21"
          />

          <ProfileInput
            attribute="height (inches)"
            handleChangeFunction={this.handleHeightChange}
            stateInput={this.state.heightInput}
            saveFunction={this.saveHeightInput}
            placeholder="64"
          />

          <ProfileInput
            attribute="weight (pounds)"
            handleChangeFunction={this.handleWeightChange}
            stateInput={this.state.weightInput}
            saveFunction={this.saveWeightInput}
            placeholder="150"
          />

          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              paddingTop: 6,
              paddingLeft: 9,
              paddingBottom: 8,
            }}>
            Dietary Restrictions
          </Text>
          <View>
            <ListItem
              title="Vegan?"
              bottomDivider
              rightElement={() => {
                return (
                  <Switch
                    value={this.state.isVegan}
                    onValueChange={() => {
                      AsyncStorage.setItem(
                        'isVegan',
                        JSON.stringify(!this.state.isVegan),
                      );
                      this.setState({isVegan: !this.state.isVegan});
                    }}
                  />
                );
              }}
            />

            <ListItem
              title="Vegetarian?"
              bottomDivider
              rightElement={() => {
                return (
                  <Switch
                    value={this.state.isVegetarian}
                    onValueChange={() => {
                      AsyncStorage.setItem(
                        'isVegetarian',
                        JSON.stringify(!this.state.isVegetarian),
                      );

                      this.setState({isVegetarian: !this.state.isVegetarian});
                    }}
                  />
                );
              }}
            />
            <ListItem
              title="Lactose intolerant?"
              bottomDivider
              rightElement={() => {
                return (
                  <Switch
                    value={this.state.isLactoseIntolerant}
                    onValueChange={() => {
                      AsyncStorage.setItem(
                        'isLactoseIntolerant',
                        JSON.stringify(!this.state.isLactoseIntolerant),
                      );
                      this.setState({
                        isLactoseIntolerant: !this.state.isLactoseIntolerant,
                      });
                    }}
                  />
                );
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </React.Fragment>
    );
  }
}

class ProfileSwitch extends React.Component {}

class ProfileCard extends React.Component {
  constructor(props) {
    super(props);
  }

  calculateBMI(height, weight) {
    bmi = ((Number(weight) / Number(height) / Number(height)) * 703).toFixed(2);
    return bmi;
  }

  harrisBenedictMale(height, weight, age) {
    return (
      (66 + 6.2 * Number(weight) + 12.7 * Number(height) - 6.67 * Number(age)) *
      1.75
    ).toFixed(0);
  }

  harrisBenedictFemale(height, weight, age) {
    return (
      (655.1 +
        4.35 * Number(weight) +
        4.7 * Number(height) -
        4.7 * Number(age)) *
      1.75
    ).toFixed(0);
  }

  render() {
    let bmi = 'Enter height and weight';
    if (this.props.height && this.props.weight) {
      bmi = this.calculateBMI(this.props.height, this.props.weight);
    }

    let calories = 'Enter age'; //Enter gender and age
    if (this.props.height && this.props.weight && this.props.age) {
      calories = this.harrisBenedictMale(
        this.props.height,
        this.props.weight,
        this.props.age,
      );
    }

    return (
      <React.Fragment>
        <Card title={this.props.username}>
          <Text style={{fontSize: 18, paddingBottom: 4}}>
            Age: {this.props.age}
          </Text>
          <Text style={{fontSize: 18, paddingBottom: 4}}>
            Height: {this.props.height}
          </Text>
          <Text style={{fontSize: 18, paddingBottom: 4}}>
            Weight: {this.props.weight}
          </Text>
          <Text style={{fontSize: 18, paddingBottom: 4}}>BMI: {bmi}</Text>
          <Text style={{fontSize: 18, paddingBottom: 4}}>
            Daily calories: {calories}
          </Text>
        </Card>
      </React.Fragment>
    );
  }
}

class ProfileInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let label = 'Enter your ' + this.props.attribute;
    return (
      <View
        style={{
          flex: 4,
          flexDirection: 'row',
          paddingBottom: 24,
        }}>
        <View style={{flex: 5}}>
          <Input
            placeholder={this.props.placeholder}
            onChangeText={this.props.handleChangeFunction}
            defaultValue={this.props.stateInput}
            label={label}
          />
        </View>
        <View
          style={{
            flex: 2,
            paddingTop: 20,
            paddingRight: 8,
          }}>
          <RneButton
            type="solid"
            title="Submit"
            onPress={this.props.saveFunction}>
            Submit
          </RneButton>
        </View>
      </View>
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
          <Tab.Navigator
            screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;

                if (route.name === 'Activity') {
                  iconName = 'child';
                } else if (route.name === 'Food') {
                  iconName = 'spoon';
                } else if (route.name === 'Profile') {
                  iconName = 'user-circle-o';
                }

                // You can return any component that you like here!
                return <Icon name={iconName} size={25} color="grey" />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            }}>
            <Tab.Screen name="Activity" component={ActivityView} />
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
