import React from 'react';
const AppContext = React.createContext({
  addDiaryEntry: (food, date) => {},
  deleteDiaryEntry: (food, date) => {},
});

export default AppContext;
