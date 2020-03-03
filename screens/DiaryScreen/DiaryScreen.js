import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {Text, View, Button, FlatList} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import AppContext from '../../AppContext';

import {TouchableEntryPreview, FoodEntry, SubHeader} from './Styles';
import {ScreenContainer, ScreenTitle} from '../FoodScreen/Styles';

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

function DiaryEntry({route, navigation}) {
  const {id, log} = route.params;
  const breakfast = log.filter(meal => meal.tags.includes('breakfast'));
  const lunchDinner = log.filter(meal => meal.tags.includes('lunch'));
  const intake = log.reduce((cnt, meal) => cnt + meal.calories, 0);
  return (
    <ScreenContainer>
      <ScreenTitle>{id}</ScreenTitle>
      <Text>{intake} total calories consumed</Text>
      <SubHeader>Breakfast</SubHeader>
      {breakfast.length < 1 ? (
        <Text>No breakfast meals for this day.</Text>
      ) : (
        breakfast.map(meal => (
          <FoodEntry key={meal.name}>
            <Text>{meal.name}</Text>
          </FoodEntry>
        ))
      )}
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
    </ScreenContainer>
  );
}

const EntryPreview = props => {
  return (
    <TouchableEntryPreview onPress={props.onPress}>
      <Text>{props.id}</Text>
      <Text>{props.log.length} entries</Text>
    </TouchableEntryPreview>
  );
};

const DiaryView = props => {
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
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
  }, []);

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
        <Text>Hi</Text>
        <FlatList
          data={diaryEntries}
          onRefresh={onRefresh}
          refreshing={refreshing}
          renderItem={({item}) => (
            <EntryPreview
              onPress={() => props.navigation.navigate('DiaryEntry', {...item})}
              key={item.id}
              {...item}
            />
          )}
          keyExtractor={item => item.id}
        />
        <Button title="Reset" onPress={resetDiary}>
          Reset Diary
        </Button>
      </ScreenContainer>
    </View>
  );
};

const DiaryStack = createStackNavigator();

function DiaryScreen() {
  return (
    <DiaryStack.Navigator mode="card">
      <DiaryStack.Screen
        name="DiaryView"
        component={DiaryView}
        options={{headerShown: false}}
      />
      <DiaryStack.Screen name="DiaryEntry" component={DiaryEntry} />
    </DiaryStack.Navigator>
  );
}

export default DiaryScreen;
