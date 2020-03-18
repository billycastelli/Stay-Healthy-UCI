import 'react-native-gesture-handler';
import React, {useContext, useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Geolocation from '@react-native-community/geolocation';
import AppContext from '../../AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';

import {Text, View, FlatList, ActivityIndicator, Alert} from 'react-native';

import {
  ScreenTitle,
  MainScreenTitle,
  SingleMealContainer,
  MealListingInfo,
  MealListingDesc,
  DatePickerContainer,
} from './Styles.js';

import {
  ColorButtonText,
  BottomButton,
  TouchableWhite,
  ButtonTitle,
  RoundedContainer,
} from '../Styles';

const calcDistance = (userCoords, restaurantCoords) => {
  return Math.sqrt(
    Math.pow(userCoords.latitude - restaurantCoords.latitude, 2) +
      Math.pow(userCoords.longitude - restaurantCoords.longitude, 2),
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
      <TouchableWhite onPress={this.props.onPress}>
        <ButtonTitle>{this.props.item}</ButtonTitle>
        <Text>
          {this.props.restaurant}
          {this.props.price > 0 && ` • $${this.props.price}`}
          {`  • ${this.props.calories} cal`}
        </Text>
      </TouchableWhite>
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
  const [meals, setMeals] = useState(null);
  const [whichMeal, setWhichMeal] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const calRange = [0, 9999];
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
            minCalories: calRange[0],
            maxCalories: calRange[1],
          }),
        },
      );
      if (!res) {
        throw 'poop';
      }
      const recvdMeals = await res.json();
      const prefsJSON = await AsyncStorage.getItem('prefsMatrix');
      let prefsMatrix = JSON.parse(prefsJSON);
      if (!prefsMatrix) {
        prefsMatrix = {};
      }
      recvdMeals.map(meal => {
        const score = meal.tags.reduce((cnt, tag) => {
          if (prefsMatrix[tag]) {
            return prefsMatrix[tag] + cnt;
          }
          return cnt;
        }, 0);
        meal.score = score;
        return meal;
      });
      Geolocation.getCurrentPosition(pos => {
        setMeals(
          recvdMeals
            .filter(
              meal =>
                meal.calories < calRange[1] && meal.calories > calRange[0],
            )
            .sort(
              (a, b) =>
                calcDistance(pos.coords, a.coordinates) * 0.5 + a.score <
                calcDistance(pos.coords, b.coordinates) * 0.5 + b.score,
            ),
        );
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    const setVeg = async () => {
      const newTags = [];
      const vegeRes = await AsyncStorage.getItem('isVegetarian');
      if (vegeRes === 'true') newTags.push('vegetarian');
      const veganRes = await AsyncStorage.getItem('isVegan');
      if (veganRes === 'true') newTags.push('vegan');
      const d = new Date();
      const nextMeal =
        d.getHours() < 11
          ? 'breakfast'
          : d.getHours() < 16
          ? 'lunch'
          : 'dinner';

      newTags.push(nextMeal);
      setWhichMeal(nextMeal);
      setTags(newTags);
    };
    setVeg();

    fetchMealsList();
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={{flex: 1, paddingTop: 40}}>
      <TabHeader headerText="What would you like to eat?" bgColor="#d87073" />
      <MainScreenTitle>Next meal: {whichMeal}</MainScreenTitle>
      <FlatList
        data={meals}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({item}) => (
          <NearbyMealItem
            key={item.item + item.restaurant}
            distance={''}
            {...item}
            onPress={() => props.navigation.navigate('Meal Info', {...item})}
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

  const onPressButton = () => {
    addDiaryEntry(
      {
        name: item,
        location: restaurant,
        calories: calories,
        tags: tags,
      },
      date.toDateString(),
    );
    Alert.alert('Meal added! ✅', `Added "${item}" to food diary.`, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  };
  return (
    <SingleMealContainer>
      <ScreenTitle>{item}</ScreenTitle>
      <MealListingInfo>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>{restaurant}</Text>

        <MealListingDesc style={{paddingTop: 8, paddingBottom: 12}}>
          {description}
        </MealListingDesc>
        <Text style={{fontSize: 18}}>Price: ${price}</Text>
        <Text style={{fontSize: 18}}>Calories: {calories}</Text>

        {/* <Text>{tags.map(tag => `${tag}, `)}</Text> */}
      </MealListingInfo>

      <RoundedContainer style={{marginTop: 48}}>
        <Text style={{fontSize: 24, fontWeight: '700'}}>
          Add this meal to your diary
        </Text>

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
      </RoundedContainer>
      <BottomButton onPress={onPressButton}>
        <ColorButtonText style={{fontSize: 24}}> Add meal</ColorButtonText>
      </BottomButton>
    </SingleMealContainer>
  );
}

function FoodScreen() {
  return (
    <FoodStack.Navigator mode="card">
      <FoodStack.Screen
        name="All Meals"
        component={FoodView}
        options={{headerShown: false}}
      />
      <FoodStack.Screen name="Meal Info" component={MealInfoModal} />
    </FoodStack.Navigator>
  );
}

export default FoodScreen;
