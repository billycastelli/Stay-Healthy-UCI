import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';
import AppContext from '../../AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';

import {Text, View, ScrollView, FlatList} from 'react-native';

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
  return Math.sqrt(
    Math.pow(userCoords.latitude - restaurantCoords.lat, 2) +
      Math.pow(userCoords.longitude - restaurantCoords.long, 2),
  );
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
          <MealName>{this.props.item}</MealName>
          <MealOrigin>
            {this.props.restaurant} • {this.props.price} • {this.props.calories}{' '}
            cal
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
  // const [curPosition, setCurPosition] = useState({});
  // const [firstDistance, setFirstDistance] = useState('-0.0mi');
  const [tags, setTags] = useState([]);
  const [meals, setMeals] = useState([]);
  // useEffect(() => {
  // Geolocation.getCurrentPosition(info => console.log(info));
  // Geolocation.getCurrentPosition(info =>
  // setFirstDistance(`${calcDistance(info.coords, firstPlace.Location)}mi`),
  // );
  // }, [firstPlace.Location]);
  useEffect(() => {
    const setVeg = async () => {
      const newTags = [];
      const vegeRes = await AsyncStorage.getItem('isVegetarian');
      if (vegeRes === 'true') newTags.push('vegetarian');
      const veganRes = await AsyncStorage.getItem('isVegan');
      if (veganRes === 'true') newTags.push('vegan');
      const d = new Date();
      newTags.push(
        d.getHours() < 11
          ? 'breakfast'
          : d.getHours() < 16
          ? 'lunch'
          : 'dinner',
      );
      setTags(newTags);
    };
    setVeg();
  }, []);

  useEffect(() => {
    const calRange = [0, 400];
    const fetchMealsList = async () => {
      try {
        const res = await fetch(
          'https://gb6o73460i.execute-api.us-west-2.amazonaws.com/prod/meals',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
              tags: tags,
            }),
          },
        );
        if (!res) {
          throw 'poop';
        }
        const recvdMeals = await res.json();

        setMeals(
          recvdMeals.filter(
            meal => meal.calories < calRange[1] && meal.calories > calRange[0],
          ),
        );
      } catch (e) {
        console.error(e);
      }
    };
    fetchMealsList();
  }, [tags]);

  return (
    <View style={{flex: 1, paddingTop: 40}}>
      <TabHeader headerText="What would you like to eat?" bgColor="#d87073" />
      <ScreenTitle>Next meal: {whichMeal}</ScreenTitle>
      <FlatList
        data={meals}
        renderItem={({item}) => (
          <NearbyMealItem
            key={item.item + item.restaurant}
            distance={''}
            {...item}
            onPress={() =>
              props.navigation.navigate('MealInfoModal', {...item})
            }
          />
        )}
        keyExtractor={item => item.item}
      />
    </View>
  );
};

function MealInfoModal({route, navigation}) {
  const {item, restaurant, price, description, tags, calories} = route.params;
  const {addDiaryEntry} = useContext(AppContext);
  const [date, setDate] = useState(new Date());
  return (
    <SingleMealContainer>
      <ScreenTitle>{item}</ScreenTitle>
      <MealListingInfo>
        <MealListingDesc>{description}</MealListingDesc>
        <Text>{restaurant}</Text>
        <Text>{price}</Text>
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
              name: item,
              location: restaurant,
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
