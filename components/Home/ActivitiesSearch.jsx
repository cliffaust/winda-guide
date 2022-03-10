import React from "react";
import moment from "moment";

import Input from "../ui/Input";
import Button from "../ui/Button";
import styles from "../../styles/Search.module.css";
import DatePicker from "../ui/DatePicker";
import Popup from "../ui/Popup";
import SearchButtonClose from "./SearchButtonClose";
import Guest from "./Guest";

function ActivitiesSearch({
  activityLocation,
  travelers,
  activityDate,
  onChange,
  changeActivityDate,
  setActivityDate,
  showActivityDate,
  showTravelersPopup,
  changeShowTravelersPopup,
  selectedActivitiesSearchItem,
  clearLocationInput,
  clearActivityDate,
  clearTravelers,
  changeSelectedActivitiesSearchItem,
  addTraveler,
  removeTraveler,
  showSearchModal,
}) {
  return (
    <div className="flex flex-col md:flex-row rounded-2xl py-4 px-2 md:py-0 md:px-0 md:rounded-full bg-white w-full shadow-md">
      <div
        onClick={(event) => {
          event.stopPropagation();
          changeSelectedActivitiesSearchItem(1);
        }}
        className={
          "md:w-2/6 w-full !py-2 !justify-between relative " +
          styles.searchInput
        }
      >
        <div className="font-bold text-sm">Location</div>
        <Input
          placeholder="Where to?"
          type="text"
          name="activityLocation"
          value={activityLocation}
          className={styles.input}
          autoComplete="off"
          onChange={(event) => {
            onChange(event);
          }}
        ></Input>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (selectedActivitiesSearchItem === 1 ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearLocationInput}></SearchButtonClose>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          changeActivityDate();
        }}
        className={
          "relative md:w-2/6 w-full !py-2 !justify-between " +
          styles.searchInput
        }
      >
        <div className="font-bold text-sm">Date</div>
        <div className="text-sm text-gray-400">
          {activityDate ? moment(activityDate).format("MMM Do") : "Add date"}
        </div>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (selectedActivitiesSearchItem === 2 ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearActivityDate}></SearchButtonClose>
        </div>
        <div
          className={"mt-4 absolute w-96 " + (showSearchModal ? "hidden" : "")}
        >
          <DatePicker
            setDate={(date, modifiers = {}) => {
              if (!modifiers.disabled) {
                setActivityDate(date);
              }
            }}
            date={activityDate}
            showDate={showActivityDate}
            className="!top-12 !-left-6 md:!-left-12 "
            disableDate={new Date()}
          ></DatePicker>
        </div>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          changeShowTravelersPopup();
        }}
        className={"relative md:w-1/4 w-full !py-2 " + styles.searchInput}
      >
        <div className="font-bold text-sm">Travelers</div>
        <div className="text-sm text-gray-400">
          {travelers === 0 ? "Add travelers" : travelers + " travelers"}
        </div>
        <div
          className={
            "absolute top-2/4 right-3 -translate-y-2/4 " +
            (selectedActivitiesSearchItem === 3 ? "block" : "hidden")
          }
        >
          <SearchButtonClose onClick={clearTravelers}></SearchButtonClose>
        </div>
        <div
          className={
            "mt-4 absolute !top-12 md:!top-14 md:!-left-16 w-72 z-30 " +
            (showSearchModal ? "hidden" : "")
          }
        >
          <Popup
            showPopup={showTravelersPopup}
            className="bg-white px-4 py-4 !rounded-2xl shadow-xl border border-gray-200"
          >
            <div className="py-4">
              <Guest
                add={addTraveler}
                remove={removeTraveler}
                guests={travelers}
                type="Travelers"
              ></Guest>
            </div>
          </Popup>
        </div>
      </div>
      <div className="flex-grow md:pr-4 flex mt-4 md:mt-0 items-center">
        <Button className="!rounded-full w-full">
          <span className="font-bold md:hidden mr-1 md:mr-0">Search</span>
          <svg
            className="h-6 w-6 hidden md:block"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
              fill="currentColor"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default ActivitiesSearch;
