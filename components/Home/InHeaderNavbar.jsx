import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import SearchSelect from "./SearchSelect";
import UserDropdown from "./UserDropdown";

function Navbar({
  showDropdown,
  changeShowDropdown,
  currentNavState,
  setCurrentNavState,
  userProfile,
  showSearchOptions = true,
  isHomePage,
}) {
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

  const getNumberOfItemsInCartInDatabase = async () => {
    const stayCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const activityCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const transportCart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-transport-cart`,
      {
        headers: {
          Authorization: `Token ${Cookies.get("token")}`,
        },
      }
    );

    const totalNumberOfItemsInCart =
      stayCart.data.results.length +
      activityCart.data.results.length +
      transportCart.data.results.length;

    setNumberOfItemsInCart(totalNumberOfItemsInCart);
  };

  useEffect(() => {
    if (Cookies.get("token")) {
      getNumberOfItemsInCartInDatabase();
    } else if (Cookies.get("cart")) {
      let cookieVal = Cookies.get("cart");

      if (cookieVal !== undefined) {
        cookieVal = JSON.parse(cookieVal);
      }

      const data = [...(cookieVal || [])];

      setNumberOfItemsInCart(data.length);
    }
  }, []);

  const [trips, setTrips] = useState([]);

  const getItemsInTrip = async () => {
    if (Cookies.get("token")) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/trips/`,
        {
          headers: {
            Authorization: "Token " + Cookies.get("token"),
          },
        }
      );
      setTrips(data[0] || []);
    }
  };

  useEffect(() => {
    getItemsInTrip();
  }, []);
  return (
    <div className="flex items-center justify-between sm:px-12 px-6 md:px-24 py-4">
      <Link href="/">
        <a className="relative w-28 h-9 cursor-pointer">
          <Image
            layout="fill"
            alt="Logo"
            src="/images/winda_logo/horizontal-white-font.png"
            priority
          ></Image>
        </a>
      </Link>
      {showSearchOptions && !isHomePage && (
        <div className="hidden md:block">
          <SearchSelect
            setCurrentNavState={setCurrentNavState}
            currentNavState={currentNavState}
            isHomePage={isHomePage}
          ></SearchSelect>
        </div>
      )}
      <UserDropdown
        userProfile={userProfile}
        changeShowDropdown={changeShowDropdown}
        showDropdown={showDropdown}
        isHomePage={isHomePage}
        numberOfItemsInCart={numberOfItemsInCart}
        numberOfTrips={trips.trip && trips.trip.length}
      ></UserDropdown>
    </div>
  );
}

Navbar.propTypes = {
  showDropdown: PropTypes.bool.isRequired,
  changeShowDropdown: PropTypes.func.isRequired,
};

export default Navbar;
