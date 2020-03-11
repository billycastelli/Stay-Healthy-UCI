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
  margin-bottom: 5px;
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
  border-radius: 10px;
  background-color: white;
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 5px 5px;
`;

export const SingleMealContainer = styled(ScreenContainer)`
  flex: 1;
`;

export const MealListingInfo = styled.View``;
export const MealListingDesc = styled.Text`
  font-size: 20px;
  margin-bottom: 5px;
`;

export const DatePickerContainer = styled.View``;
