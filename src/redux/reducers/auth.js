import actionTypes from "../actionTypes";

const initialState = {
  token: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case actionTypes.UNSET_TOKEN:
      return {
        ...state,
        token: "",
      };

    default:
      return state;
  }
};

export default reducer;
