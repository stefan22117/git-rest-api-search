import actionTypes from "../actionTypes";

export const addUserToSearchList = (user) => (dispatch) => {
  dispatch({
    type: actionTypes.ADD_USER_TO_SEARCH_LIST,
    payload: user,
  });
};
export const removeUserFromSearchList = (user) => (dispatch) => {
  dispatch({
    type: actionTypes.REMOVE_USER_FROM_SEARCH_LIST,
    payload: user,
  });
};
