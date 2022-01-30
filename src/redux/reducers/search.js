import actionTypes from "../actionTypes";

const initialState = {
  lastFive: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_USER_TO_SEARCH_LIST:
      return {
        ...state,
        lastFive: [
          action.payload,
          ...state.lastFive.filter((x) => x.login !== action.payload.login),
        ].splice(0, 5),
      };

    case actionTypes.REMOVE_USER_FROM_SEARCH_LIST:
      return {
        ...state,
        lastFive: [
          ...state.lastFive.filter((x) => x.login !== action.payload.login),
        ].splice(0, 5),
      };
    default:
      return state;
  }
};

export default reducer;
