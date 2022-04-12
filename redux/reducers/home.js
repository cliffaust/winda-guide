import { persistReducer } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

const homePageState = {
  topBanner: true,
  currencyToDollar: false,
};

const homePageReducer = (state = homePageState, action) => {
  switch (action.type) {
    case "HIDE_TOP_BANNER":
      return { ...state, topBanner: false };

    case "SHOW_TOP_BANNER":
      return { ...state, topBanner: true };

    case "CHANGE_CURRENCY_TO_DOLLAR_FALSE":
      return { ...state, currencyToDollar: false };

    case "CHANGE_CURRENCY_TO_DOLLAR_TRUE":
      return { ...state, currencyToDollar: true };

    default:
      return state;
  }
};

const persistConfig = {
  key: "home",
  storage: storage,
  whitelist: ["topBanner", "currencyToDollar"],
};

export default persistReducer(persistConfig, homePageReducer);
