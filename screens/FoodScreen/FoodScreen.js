import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';
import AppContext from '../../AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';

import {Text, View, ScrollView, FlatList} from 'react-native';

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
  DatePickerContainer,
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
            {this.props.location} • {this.props.priceRange} •{' '}
            {this.props.calories} cal
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
  // const [curPosition, setCurPosition] = useState({});
  // const [firstDistance, setFirstDistance] = useState('-0.0mi');
  const d = new Date();
  const whichMeal =
    d.getHours() < 11 ? 'breakfast' : d.getHours() < 16 ? 'lunch' : 'dinner';
  // useEffect(() => {
  // Geolocation.getCurrentPosition(info => console.log(info));
  // Geolocation.getCurrentPosition(info =>
  // setFirstDistance(`${calcDistance(info.coords, firstPlace.Location)}mi`),
  // );
  // }, [firstPlace.Location]);

  return (
    <View style={{flex: 1, paddingTop: 40}}>
      <TabHeader headerText="What would you like to eat?" bgColor="#d87073" />
      <ScreenTitle>Next meal: Lunch</ScreenTitle>
      <FlatList
        data={places}
        renderItem={({item}) => (
          <NearbyMealItem
            key={item.name + item.Menu[0].item}
            name={item.Menu[0].item}
            priceRange={`$${item.Menu[0].price}`}
            distance={''}
            location={item.name}
            calories={item.Menu[0].calories}
            onPress={() =>
              props.navigation.navigate('MealInfoModal', {
                name: item.Menu[0].item,
                location: item.name,
                priceRange: `$${item.Menu[0].price}`,
                description: item.Menu[0].description,
                tags: item.Menu[0].tags,
                calories: item.Menu[0].calories,
              })
            }
          />
        )}
        keyExtractor={item => item.name}
      />
    </View>
  );
};

function MealInfoModal({route, navigation}) {
  const {
    name,
    location,
    priceRange,
    description,
    tags,
    calories,
  } = route.params;
  const {addDiaryEntry} = useContext(AppContext);
  const [date, setDate] = useState(new Date());
  return (
    <SingleMealContainer>
      <ScreenTitle>{name}</ScreenTitle>
      <MealListingInfo>
        <MealListingDesc>{description}</MealListingDesc>
        <Text>{location}</Text>
        <Text>{priceRange}</Text>
        <Text>{calories}</Text>

        <Text>{tags.map(tag => `${tag}, `)}</Text>
      </MealListingInfo>
      <DatePickerContainer>
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={(e, d) => setDate(d)}
        />
      </DatePickerContainer>
      <AddMealTouchable
        onPress={() =>
          addDiaryEntry(
            {
              name: name,
              location: location,
              calories: calories,
              tags: tags,
            },
            date.toDateString(),
          )
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
