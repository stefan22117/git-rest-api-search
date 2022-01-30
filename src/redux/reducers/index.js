import { combineReducers } from "redux";
import search from "./search";
import auth from "./auth";

const mainReducer = combineReducers({
  search,
  auth,
});
export default mainReducer;
