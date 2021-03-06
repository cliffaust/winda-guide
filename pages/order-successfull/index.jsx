import React, { useState, useEffect } from "react";
import CartItem from "../../components/Cart/CartItem";
import Navbar from "../../components/Stay/Navbar";
import getToken from "../../lib/getToken";
import { priceConversionRateFunc } from "../../lib/PriceRate";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

function OrderSuccessfull({ userProfile, allOrders, activitiesOrders }) {
  const [state, setState] = useState({
    showDropdown: false,
    currentNavState: 1,
    showCheckOutDate: false,
    showCheckInDate: false,
    showPopup: false,
    showSearchModal: false,
  });

  const [showInfo, setShowInfo] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  }, []);

  return (
    <div>
      <Navbar
        showDropdown={state.showDropdown}
        currentNavState={state.currentNavState}
        userProfile={userProfile}
        showSearchModal={() => {
          setState({ ...state, showSearchModal: true });
        }}
        setCurrentNavState={(currentNavState) => {
          setState({
            ...state,
            currentNavState: currentNavState,
            showCheckOutDate: false,
            showCheckInDate: false,
            showPopup: false,
          });
        }}
        changeShowDropdown={() =>
          setState({
            ...state,
            showDropdown: !state.showDropdown,
          })
        }
      ></Navbar>
      <div className="px-2 xl:w-[1100px] mx-auto sm:px-16 md:px-12 lg:px-16">
        <div className="mt-6">
          <h1 className="font-bold text-2xl">Recent orders</h1>

          <div className="mt-4 ml-2">
            <div>
              <div className="flex flex-wrap mb-5">
                {allOrders.map((item, index) => (
                  <div key={item.id} className="md:w-[48%] w-full">
                    <CartItem
                      stay={item.stay}
                      cartIndex={index}
                      orderId={item.id}
                      setShowInfo={setShowInfo}
                      orderDays={item.days}
                      orderSuccessfull={true}
                      userProfile={userProfile}
                      stayPage={true}
                      lengthOfItems={allOrders.length}
                    ></CartItem>
                  </div>
                ))}
                {activitiesOrders.map((item, index) => (
                  <div key={item.id} className="md:w-[48%] w-full">
                    <CartItem
                      activity={item.activity}
                      lengthOfItems={activitiesOrders.length}
                      cartIndex={index}
                      orderId={item.id}
                      setShowInfo={setShowInfo}
                      orderDays={item.days}
                      orderSuccessfull={true}
                      activitiesPage={true}
                      userProfile={userProfile}
                    ></CartItem>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="font-bold text-2xl">
            Checkout these similar listings
          </h1>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-orders/paid/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    const activitiesOrders = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-activities-orders/paid/`,
      {
        headers: {
          Authorization: "Token " + token,
        },
      }
    );

    return {
      props: {
        userProfile: response.data[0],
        allOrders: data.results,
        activitiesOrders: activitiesOrders.data.results,
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "login",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
          cart: [],
        },
      };
    }
  }
}

export default OrderSuccessfull;
