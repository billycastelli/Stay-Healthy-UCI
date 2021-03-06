import 'react-native-gesture-handler';
import React, {useState, useEffect, useContext} from 'react';
import {Text, View, Button, FlatList, ScrollView, Alert} from 'react-native';
import {Input, CheckBox} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import AppContext from '../../AppContext';

import {
  FoodEntry,
  SubHeader,
  ScreenTitle,
  CustomMealContainer,
  InputContainer,
  TagChoiceContainer,
} from './Styles';
import {ScreenContainer} from '../FoodScreen/Styles';
import {
  BottomButton,
  ColorButtonText,
  TouchableWhite,
  ButtonTitle,
  RoundedContainer,
} from '../Styles';

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

function CustomMealPopup({route, navigation}) {
  const {date, log} = route.params;
  const {addDiaryEntry} = useContext(AppContext);

  const [calories, setCalories] = useState(0);
  const [mealName, setMealName] = useState('');
  const [isBreakfast, setIsBreakfast] = useState(false);
  const [isLunch, setIsLunch] = useState(false);
  const [isDinner, setIsDinner] = useState(false);

  const [tags, setTags] = useState([
    {
      tag: 'chicken',
      checked: false,
    },
    {
      tag: 'beef',
      checked: false,
    },
    {
      tag: 'vegan',
      checked: false,
    },
    {
      tag: 'vegetarian',
      checked: false,
    },
    {
      tag: 'fried',
      checked: false,
    },
    {
      tag: 'grilled',
      checked: false,
    },
    {
      tag: 'cheese',
      checked: false,
    },
    {
      tag: 'sandwich',
      checked: false,
    },
    {
      tag: 'burger',
      checked: false,
    },
    {
      tag: 'salad',
      checked: false,
    },
  ]);

  const showError = msg => {
    Alert.alert('Please fill in all fields', msg, [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
  };

  const handleButtonPress = () => {
    if (!isLunch && !isDinner && !isBreakfast) {
      showError('Please specify the type of meal');
      return;
    }

    if (mealName.length === 0) {
      showError('Please enter a valid meal name');
      return;
    }

    if (calories.length === 0 || !Number(calories)) {
      showError('Please enter a valid nunber of calories');
      return;
    }

    let mealTypes = [];
    if (isBreakfast) mealTypes.push('breakfast');
    if (isLunch) mealTypes.push('lunch');
    if (isDinner) mealTypes.push('dinner');

    const thisEntry = {
      name: mealName,
      location: 'Custom',
      calories: Number(calories),
      tags: tags
        .filter(t => t.checked)
        .map(t => t.tag)
        .concat(mealTypes),
    };

    addDiaryEntry(thisEntry, date);

    Alert.alert('Meal added! ✅', 'Added new custom meal to food diary.', [
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    navigation.navigate('DiaryEntry', {id: date, log: log.concat(thisEntry)});
  };

  return (
    <ScrollView>
      <ScreenContainer>
        <CustomMealContainer>
          <ScreenTitle>Add custom meal</ScreenTitle>
          <InputContainer>
            <Text>Eat something not in our database? Add it here.</Text>
          </InputContainer>
          <InputContainer>
            <Input
              label="Custom meal name"
              placeholder="Salad"
              onChangeText={data => setMealName(data)}
            />
          </InputContainer>
          <InputContainer>
            <Input
              label="Custom meal calories"
              placeholder="400"
              onChangeText={data => setCalories(data)}
            />
          </InputContainer>
          <InputContainer>
            <CheckBox
              title="Breakfast"
              checked={isBreakfast}
              onPress={() => setIsBreakfast(isBreakfast => !isBreakfast)}
            />
            <CheckBox
              title="Lunch"
              checked={isLunch}
              onPress={() => setIsLunch(isLunch => !isLunch)}
            />
            <CheckBox
              title="Dinner"
              checked={isDinner}
              onPress={() => setIsDinner(isDinner => !isDinner)}
            />
          </InputContainer>
          <InputContainer>
            <Text>Meal tags</Text>
          </InputContainer>
          <TagChoiceContainer>
            {tags.map(item => (
              <CheckBox
                title={item.tag}
                checked={item.checked}
                onPress={() =>
                  setTags(t => {
                    const curTag = t.filter(
                      allTags => allTags.tag === item.tag,
                    );
                    curTag[0].checked = !curTag[0].checked;
                    return t;
                  })
                }
                key={item.tag}
              />
            ))}
          </TagChoiceContainer>
        </CustomMealContainer>
        <BottomButton onPress={handleButtonPress}>
          <ColorButtonText>Add item</ColorButtonText>
        </BottomButton>
      </ScreenContainer>
    </ScrollView>
  );
}

function DiaryEntry({route, navigation}) {
  const {id, log} = route.params;

  const breakfast = log.filter(meal => meal.tags.includes('breakfast'));
  const lunchDinner = log.filter(meal => meal.tags.includes('lunch'));
  const intake = log.reduce((cnt, meal) => cnt + meal.calories, 0);
  return (
    <ScreenContainer style={{flex: 1}}>
      <RoundedContainer
        style={{
          marginLeft: -8,
          marginRight: -8,
          paddingLeft: 8,
          paddingBottom: 12,
          backgroundColor: '#c4185d',
        }}>
        <ScreenTitle style={{color: '#ffffff'}}>{id}</ScreenTitle>
        <Text style={{color: '#ffffff'}}>{intake} total calories consumed</Text>
      </RoundedContainer>
      <RoundedContainer
        style={{
          marginLeft: -8,
          marginRight: -8,
          paddingLeft: 8,
          paddingBottom: 12,
        }}>
        <SubHeader>Breakfast</SubHeader>
        {breakfast.length < 1 ? (
          <Text>No breakfast meals for this day.</Text>
        ) : (
          breakfast.map(meal => (
            <FoodEntry key={meal.name}>
              <Text>{meal.name}</Text>
              <Text>{meal.calories} cal</Text>
            </FoodEntry>
          ))
        )}
      </RoundedContainer>
      <RoundedContainer
        style={{
          marginLeft: -8,
          marginRight: -8,
          paddingLeft: 8,
          paddingBottom: 12,
        }}>
        <SubHeader>Lunch and Dinner</SubHeader>
        {lunchDinner.length < 1 ? (
          <Text>No lunch or dinner meals for this day.</Text>
        ) : (
          lunchDinner.map(meal => (
            <FoodEntry key={meal.name}>
              <Text>{meal.name}</Text>
              <Text>{meal.calories} cal</Text>
            </FoodEntry>
          ))
        )}
      </RoundedContainer>
      <BottomButton
        onPress={() =>
          navigation.navigate('Add Custom Meal', {date: id, log: log})
        }>
        <ColorButtonText>Add custom item</ColorButtonText>
      </BottomButton>
    </ScreenContainer>
  );
}

const EntryPreview = props => {
  return (
    <TouchableWhite onPress={props.onPress}>
      <ButtonTitle>{props.id}</ButtonTitle>
      <Text>
        {props.log.length} {props.log.length > 1 ? 'entries' : 'entry'}
      </Text>
    </TouchableWhite>
  );
};

const DiaryView = props => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          const val = await AsyncStorage.getItem('diary');
          if (val) {
            setDiaryEntries(JSON.parse(val));
          }
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [isFocused]);

  const resetDiary = async () => {
    await AsyncStorage.setItem('diary', JSON.stringify([]));
  };

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      const val = await AsyncStorage.getItem('diary');
      if (val) {
        setDiaryEntries(JSON.parse(val));
      }
    } catch (err) {
      console.error(err);
    }
    setRefreshing(false);
  };

  return (
    <View style={{flex: 1, marginTop: 40}}>
      <TabHeader headerText="Diary" bgColor="#d87073" />
      <ScreenContainer>
        <View style={{height: '100%'}}>
          <Button title="Reset" onPress={resetDiary}>
            Reset Diary
          </Button>
          {diaryEntries.length < 1 ? (
            <Text>Click on the Food tab to add meals to your diary!</Text>
          ) : (
            <FlatList
              data={diaryEntries}
              onRefresh={onRefresh}
              refreshing={refreshing}
              renderItem={({item}) => (
                <EntryPreview
                  onPress={() =>
                    props.navigation.navigate('DiaryEntry', {...item})
                  }
                  key={item.id}
                  {...item}
                />
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </ScreenContainer>
    </View>
  );
};

const DiaryStack = createStackNavigator();
const RootStack = createStackNavigator();

function DiaryStackScreen() {
  return (
    <DiaryStack.Navigator>
      <DiaryStack.Screen
        name="DiaryView"
        component={DiaryView}
        options={{headerShown: false}}
      />
      <DiaryStack.Screen name="DiaryEntry" component={DiaryEntry} />
    </DiaryStack.Navigator>
  );
}

function DiaryScreen() {
  return (
    <RootStack.Navigator mode="modal">
      <RootStack.Screen
        name="Diary"
        component={DiaryStackScreen}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="Add Custom Meal"
        component={CustomMealPopup}
        options={{headerShown: false}}
      />
    </RootStack.Navigator>
  );
}

export default DiaryScreen;
