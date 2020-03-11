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
