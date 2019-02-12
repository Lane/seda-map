const initialState = [
  '#2166ac','#4393c3','#92c5de','#d1e5f0','#f7f7f7','#e6f5d0','#b8e186','#7fbc41','#4d9221'
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