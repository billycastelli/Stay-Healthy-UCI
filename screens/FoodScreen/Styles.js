import styled from 'styled-components/native';

/*
 * styles for FoodView
 */
export const ScreenContainer = styled.View`
  padding: 10px 20px;
`;

export const ScreenTitle = styled.Text`
  color: black;
  font-weight: 800;
  font-size: 30px;
`;

export const MainScreenTitle = styled(ScreenTitle)`
  padding: 12px;
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
