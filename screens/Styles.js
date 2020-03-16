import styled from 'styled-components/native';

export const BottomButton = styled.TouchableOpacity`
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

export const TouchableWhite = styled.TouchableOpacity`
  border-radius: 10px;
  background-color: white;
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 15px 15px;
`;

export const RoundedContainer = styled.View`
  border-radius: 10px;
  background-color: white;
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;
  padding: 15px 15px;
`;

export const ButtonTitle = styled.Text`
  font-weight: 700;
  font-size: 20px;
  margin-bottom: 5px;
`;
