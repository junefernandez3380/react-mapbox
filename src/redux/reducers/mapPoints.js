const initState = []

export const reducer = (state = initState, action) => {
  switch (action.type) {
    case 'VIEW_CHANGE':
      return action.payload;
    default:
      return state;
  }   
}