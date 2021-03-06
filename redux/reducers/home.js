import { persistReducer } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";

const homePageState = {
  topBanner: true,
  helpReorderPopup: true,
  currencyToDollar: false,
  currentCartItemId: 0,
  currentCartItemActivitiesId: -1,
  currentCartItemName: "",
  mapRoute: [],
};

const homePageReducer = (state = homePageState, action) => {
  switch (action.type) {
    case "HIDE_TOP_BANNER":
      return { ...state, topBanner: false };

    case "HIDE_HELP_REORDER_POPUP":
      return { ...state, helpReorderPopup: false };

    case "SET_CURRENT_CART_ITEM_NAME":
      return { ...state, currentCartItemName: action.payload };

    case "SET_CURRENT_CART_ITEM_ID":
      return { ...state, currentCartItemId: action.payload };

    case "SET_CURRENT_CART_ACTIVITIES_ITEM_ID":
      return { ...state, currentCartItemActivitiesId: action.payload };

    case "SET_MAP_ROUTE":
      return { ...state, mapRoute: action.payload };

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
  whitelist: ["topBanner", "currencyToDollar", "helpReorderPopup"],
};

export default persistReducer(persistConfig, homePageReducer);
