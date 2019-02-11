const initialState = [
  '#052458',
  '#1E69AD',
  '#48A5E8',
  '#82C6F3', 
  '#DDF5FE',
  '#75E7D4',
  '#39E1B5',
  '#19CD9B',
  '#03B684'
]

const mapColors = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case 'UPDATE_COLOR':
      newState = [ ...state ];
      newState[action.index] = action.color;
      return newState;
    default:
      return state;
  }
}

export default mapColors;