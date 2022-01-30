import actionTypes from "../actionTypes";

export const setToken = (token) => (dispatch) => {
  dispatch({
    type: actionTypes.SET_TOKEN,
    payload: token,
  });
};
export const unsetToken = () => (dispatch) => {
  dispatch({
    type: actionTypes.UNSET_TOKEN,
  });
};
