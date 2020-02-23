import styled from 'styled-components/native';

/*
 * styles for FoodView
 */
export const ScreenContainer = styled.View`
  padding: 10px 20px;
`;

export const NearbyMeal = styled.View`
  padding: 10px 10px;
`;

export const MealName = styled.Text`
  font-weight: 800;
  font-size: 20px;
`;

export const MealOrigin = styled.Text``;
export const ScreenTitle = styled.Text`
  color: black;
  font-weight: 800;
  font-size: 30px;
  margin-bottom: 10px;
`;

export const TouchableMealListing = styled.TouchableOpacity`
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  background-color: powderblue;
  margin-bottom: 15px;
`;

export const AddMealTouchable = styled.TouchableOpacity`
  border-radius: 5px;
  padding: 5px 5px;
  background-color: ${props => (props.disabled ? 'grey' : '#007aff')};
  margin-bottom: 10px;
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 20px;
`;
export const ColorButtonText = styled.Text`
  color: white;
  text-align: center;
`;

export const SingleMealContainer = styled(ScreenContainer)`
  flex: 1;
`;

export const MealListingInfo = styled.View``;
export const MealListingDesc = styled.Text`
  font-size: 20px;
  margin-bottom: 5px;
`;
