const initialState = [
  '#33CCFF', 
  '#30A5CF', 
  '#2D7E9F', 
  '#2A566E', 
  
  '#272F3E', 
  
  '#2C5C5C', 
  '#30887A', 
  '#35B597', 
  '#39E1B5'
]

const mapColors = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_COLOR':
      return action.colors;
    default:
      return state;
  }
}

export default mapColors;