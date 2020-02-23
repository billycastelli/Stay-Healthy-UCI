import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AppContext from '../../AppContext';

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

const DiaryScreen = props => {
  const [diaryEntries, setDiaryEntries] = useState([]);
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

  return (
    <View style={{flex: 1, marginTop: 40}}>
      <TabHeader headerText="Diary" bgColor="#d87073" />

      <Text>Hi</Text>
      <FlatList
        data={diaryEntries}
        renderItem={({item}) => <Text key={item.id}>{item.id}</Text>}
        keyExtractor={item => item.id}
      />
      <Button title="Reset" onPress={resetDiary}>
        Reset Diary
      </Button>
    </View>
  );
};

export default DiaryScreen;
