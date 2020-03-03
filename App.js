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
  SafeAreaView,
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

import {
  NearbyMeal,
  MealName,
  MealOrigin,
  TouchableMealListing,
  ScreenTitle,
  ScreenContainer,
} from './Styles.js';

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
    step_counts: [],
  };

  printSteps() {
    // AppleHealthKit.getStepCount(null, (err, results) => {
    //   console.log('RESULTS', results);
    //   this.setState({todaySteps: results}, () => {
    //     console.log('RESULTS FROM STATE', this.state.todaySteps);
    //   });
    // });

    this.setState({step_counts: []}, () => {
      console.log('STEP COUNTS BEFORE', this.state.step_counts);
      for (let day = 0; day < 7; day++) {
        var d = new Date();
        d.setDate(d.getDate() - day);

        let options = {date: new Date(d).toISOString()};
        AppleHealthKit.getStepCount(options, (err, steps) => {
          if (err) {
            console.log('error:', err);
          }
          let sc = this.state.step_counts;
          sc.push(steps);
          this.setState({step_counts: sc});
        });
      }
    });
    for (let i = 0; i < this.state.step_counts.length; i++) {
      console.log(this.state.step_counts[i]);
    }
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

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43],
          strokeWidth: 2, // optional
        },
      ],
    };

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
          <Text></Text>
          <Button title="Step count" onPress={this.printSteps} />
          {stepText}
        </View>
        <View>
          <ActivityChart data={data} />
        </View>
      </React.Fragment>
    );
  }
}

class ActivityChart extends React.Component {
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
        <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>
          Last 7 days of activity
        </Text>
        <LineChart
          data={this.props.data}
          width={screenWidth} // from react-native
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 16,
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

class NearbyMealItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableMealListing onPress={this.props.onPress}>
        <NearbyMeal>
          <MealName>{this.props.name}</MealName>
          <MealOrigin>
            {this.props.location} • {this.props.distance} •{' '}
            {this.props.priceRange}
          </MealOrigin>
        </NearbyMeal>
      </TouchableMealListing>
    );
  }
}

class FoodView extends React.Component {
  // This screen will use the users height, weight, age, etc to send
  // a request to our database and will receive and display food recommendations

  render() {
    Geolocation.getCurrentPosition(info => console.log(info));

    return (
      <View style={{flex: 1, paddingTop: 40}}>
        <TabHeader headerText="What would you like to eat?" bgColor="#d87073" />
        <ScreenContainer>
          <ScreenTitle>Next meal: Lunch</ScreenTitle>
          <NearbyMealItem
            name="French Toast"
            location="Ruby's Diner"
            distance="0.8mi"
            priceRange="$"
            onPress={() => console.log('pressed meal item')}
          />
        </ScreenContainer>
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
  // Handles switching between tabs
  // Each tab is a component
  render() {
    return (
      <NavigationContainer>
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
          <Tab.Screen name="Food" component={FoodView} />
          <Tab.Screen name="Profile" component={ProfileView} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
