import styled from 'styled-components/native';

export const TouchableEntryPreview = styled.TouchableOpacity`
  border-radius: 5px;
  margin-top: 15px;
  border-top-color: grey;
  border-top-width: 1px;
  padding: 10px 5px;
`;

export const FoodEntry = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SubHeader = styled.Text`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 5px;
  margin-top: 5px;
`;

export const ScreenTitle = styled.Text`
  color: black;
  font-weight: 800;
  font-size: 30px;
`;

export const CustomMealContainer = styled.View`
  margin-top: 35px;
`;

export const InputContainer = styled.View`
  margin-bottom: 10px;
`;

export const TagChoiceContainer = styled(InputContainer)`
  display: flex;
  margin-bottom: 40px;
`;
