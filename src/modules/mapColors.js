const initialState = [
  '#052458', '#1E69AD', '#48A5E8', '#D8F0F9', '#e7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221'
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