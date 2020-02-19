import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';

import {Text, View} from 'react-native';

import {
  NearbyMeal,
  MealName,
  MealOrigin,
  TouchableMealListing,
  ScreenTitle,
  ScreenContainer,
  AddMealTouchable,
} from './Styles.js';

class TabHeader extends React.Component {
  render() {
    return (
      <View
        style={{
          height: 60,
          padding: 15,
          backgroundColor: this.props.bgColor,
        }}>
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

const FoodStack = createStackNavigator();
class FoodView extends React.Component {
  // This screen will use the users height, weight, age, etc to send
  // a request to our database and will receive and display food recommendations
  constructor(props) {
    super(props);
  }

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
            onPress={() =>
              this.props.navigation.navigate('MealInfoModal', {
                name: 'French Toast',
                location: "Ruby's Diner",
                distance: '0.8mi',
                priceRange: '$',
                description: 'A beautiful french toast',
                tags: ['vegetarian', 'breakfast'],
              })
            }
          />
        </ScreenContainer>
      </View>
    );
  }
}

function MealInfoModal({route, navigation}) {
  const {
    name,
    location,
    distance,
    priceRange,
    description,
    tags,
  } = route.params;
  return (
    <ScreenContainer>
      <ScreenTitle>{name}</ScreenTitle>
      <Text>{location}</Text>
      <Text>{distance}</Text>
      <Text>{priceRange}</Text>
      <Text>{description}</Text>
      <Text>{tags.map(tag => `${tag}, `)}</Text>
      <AddMealTouchable onPress={() => console.log('Added meal')}>
        <Text> Add meal</Text>
      </AddMealTouchable>
    </ScreenContainer>
  );
}

function FoodScreen() {
  return (
    <FoodStack.Navigator mode="card">
      <FoodStack.Screen
        name="FoodView"
        component={FoodView}
        options={{headerShown: false}}
      />
      <FoodStack.Screen name="MealInfoModal" component={MealInfoModal} />
    </FoodStack.Navigator>
  );
}

export default FoodScreen;
