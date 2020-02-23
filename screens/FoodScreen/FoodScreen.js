import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';
import AppContext from '../../AppContext';

import {Text, View, ScrollView} from 'react-native';

import placesJson from './places.json';

import {
  NearbyMeal,
  MealName,
  MealOrigin,
  TouchableMealListing,
  ScreenTitle,
  ScreenContainer,
  SingleMealContainer,
  AddMealTouchable,
  MealListingInfo,
  MealListingDesc,
  ColorButtonText,
} from './Styles.js';

const calcDistance = (userCoords, restaurantCoords) => {
  const p = 0.017453292519943295;
  const a =
    0.5 -
    Math.cos((userCoords.latitude - restaurantCoords.lat) * p) / 2 +
    (Math.cos(userCoords.latitude * p) *
      Math.cos(restaurantCoords.lat * p) *
      (1 - Math.cos((userCoords.longitude - restaurantCoords.long) * p))) /
      2;
  return 12742 * Math.asin(Math.sqrt(a)) * 0.621371;
};

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
            {this.props.priceRange} • {this.props.calories} cal
          </MealOrigin>
        </NearbyMeal>
      </TouchableMealListing>
    );
  }
}

const FoodStack = createStackNavigator();
const FoodView = props => {
  // This screen will use the users height, weight, age, etc to send
  // a request to our database and will receive and display food recommendations
  const places = placesJson.places;
  const firstPlace = places[0];
  const [curPosition, setCurPosition] = useState({});
  const [firstDistance, setFirstDistance] = useState('-0.0mi');
  // Geolocation.getCurrentPosition(info => setCurPosition(info.coords));
  const d = new Date();
  const whichMeal =
    d.getHours() < 11 ? 'breakfast' : d.getHours() < 16 ? 'lunch' : 'dinner';
  // const firstDistance = `${calcDistance(curPosition, firstPlace.Location)}mi`;
  useEffect(() => {
    Geolocation.getCurrentPosition(info => console.log(info));
    Geolocation.getCurrentPosition(info =>
      setFirstDistance(`${calcDistance(info.coords, firstPlace.Location)}mi`),
    );
  }, [firstPlace.Location]);

  return (
    <View style={{flex: 1, paddingTop: 40}}>
      <TabHeader headerText="What would you like to eat?" bgColor="#d87073" />
      <ScrollView>
        <ScreenContainer>
          <ScreenTitle>Next meal: Lunch</ScreenTitle>
          {/*
          <NearbyMealItem
            name="French Toast"
            location="Ruby's Diner"
            distance="0.8mi"
            priceRange="$"
            onPress={() =>
              props.navigation.navigate('MealInfoModal', {
                name: 'French Toast',
                location: "Ruby's Diner",
                distance: '0.8mi',
                priceRange: '$',
                description: 'A beautiful french toast',
                tags: ['vegetarian', 'breakfast'],
              })
            }
          />
		  */}
          {firstPlace.Menu.filter(
            item => item.tags.indexOf(whichMeal) > -1,
          ).map(item => (
            <NearbyMealItem
              key={item.item + firstPlace.name}
              name={item.item}
              priceRange={`$${item.price}`}
              distance={firstDistance}
              location={firstPlace.name}
              calories={item.calories}
              onPress={() =>
                props.navigation.navigate('MealInfoModal', {
                  name: item.item,
                  location: firstPlace.name,
                  distance: firstDistance,
                  priceRange: `$${item.price}`,
                  description: item.description,
                  tags: item.tags,
                  calories: item.calories,
                })
              }
            />
          ))}
        </ScreenContainer>
      </ScrollView>
    </View>
  );
};

function MealInfoModal({route, navigation}) {
  const {
    name,
    location,
    distance,
    priceRange,
    description,
    tags,
    calories,
  } = route.params;
  const {addDiaryEntry} = useContext(AppContext);
  return (
    <SingleMealContainer>
      <ScreenTitle>{name}</ScreenTitle>
      <MealListingInfo>
        <MealListingDesc>{description}</MealListingDesc>
        <Text>{location}</Text>
        <Text>{distance}</Text>
        <Text>{priceRange}</Text>
        <Text>{calories}</Text>

        <Text>{tags.map(tag => `${tag}, `)}</Text>
      </MealListingInfo>
      <AddMealTouchable
        onPress={() =>
          addDiaryEntry({
            name: name,
            location: location,
            calories: calories,
            tags: tags,
          })
        }>
        <ColorButtonText> Add meal</ColorButtonText>
      </AddMealTouchable>
    </SingleMealContainer>
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
