import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import ClientOnly from "../ClientOnly";
import LoadingSpinerChase from "../ui/LoadingSpinerChase";
import { priceConversionRateFunc } from "../../lib/PriceRate";

const CartItem = ({
  stay,
  checkoutInfo,
  cartIndex,
  setShowInfo,
  orderDays,
  orderId,
  cartId,
  orderSuccessfull,
  userProfile,
}) => {
  const currencyToDollar = useSelector((state) => state.home.currencyToDollar);
  const priceConversionRate = useSelector(
    (state) => state.stay.priceConversionRate
  );

  const dispatch = useDispatch();

  const router = useRouter();

  const [newPrice, setNewPrice] = useState(null);

  const [cartLoading, setCartLoading] = useState(false);

  const [cartAdded, setCartAdded] = useState(false);

  const [listingIsInCart, setListingIsInCart] = useState(false);

  const [removeButtonLoading, setRemoveButtonLoading] = useState(false);

  const [orderAgainLoading, setOrderAgainLoading] = useState(false);

  const price = () => {
    return stay.price;
  };

  const orderAgain = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    setOrderAgainLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-order/`,
        {
          first_name: userProfile.first_name || "",
          last_name: userProfile.last_name || "",
        },
        {
          headers: {
            Authorization: `Token ${Cookies.get("token")}`,
          },
        }
      )
      .then((res) => {
        router.push({
          pathname: "/orders",
        });
      })
      .catch((err) => {
        console.log(err);
        setOrderAgainLoading(false);
      });
  };

  const addToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = Cookies.get("token");

    if (!listingIsInCart) {
      setCartLoading(true);

      await axios
        .post(
          `${process.env.NEXT_PUBLIC_baseURL}/stays/${stay.slug}/add-to-cart/`,
          {},
          {
            headers: {
              Authorization: "Token " + token,
            },
          }
        )
        .then(() => {
          setCartLoading(false);
          setCartAdded(true);
        })
        .catch((err) => {
          console.log(err.response);
        });
      location.reload();
    } else if (listingIsInCart) {
      router.push({
        pathname: "/cart",
      });
    }
  };

  const itemIsInCart = async () => {
    let exist = false;
    const cart = await axios.get(
      `${process.env.NEXT_PUBLIC_baseURL}/user-cart/`,
      {
        headers: {
          Authorization: "Token " + Cookies.get("token"),
        },
      }
    );

    exist = cart.data.results.some((val) => {
      return val.stay.slug === stay.slug;
    });

    setListingIsInCart(exist);
  };

  useEffect(() => {
    priceConversionRateFunc(dispatch);
  });

  useEffect(() => {
    if (orderSuccessfull) {
      itemIsInCart();
    }
  }, []);

  const setCartId = (e) => {
    e.stopPropagation();
    e.preventDefault();

    dispatch({
      type: "SET_CURRENT_CART_ITEM_ID",
      payload: cartIndex,
    });

    dispatch({
      type: "SET_CURRENT_CART_ITEM_NAME",
      payload: stay.name,
    });

    setShowInfo(true);
  };

  const removeCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const token = Cookies.get("token");

    setRemoveButtonLoading(true);

    if (!checkoutInfo) {
      if (token) {
        await axios
          .delete(`${process.env.NEXT_PUBLIC_baseURL}/user-cart/${cartId}/`, {
            headers: {
              Authorization: "Token " + token,
            },
          })
          .then(() => {
            location.reload();
          })
          .catch((err) => {
            console.log(err.response.data);
            setRemoveButtonLoading(false);
          });
      } else if (Cookies.get("cart")) {
        const cart = JSON.parse(decodeURIComponent(Cookies.get("cart")));

        const newCart = cart.filter((el) => el.slug !== stay.slug);

        Cookies.set("cart", JSON.stringify(newCart));

        location.reload();
      }
    } else if (checkoutInfo) {
      await axios
        .delete(`${process.env.NEXT_PUBLIC_baseURL}/user-orders/${orderId}/`, {
          headers: {
            Authorization: "Token " + token,
          },
        })
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

  const priceConversion = async (price) => {
    if (price) {
      if (currencyToDollar && priceConversionRate) {
        setNewPrice(priceConversionRate * price);
      } else {
        setNewPrice(price);
      }
    } else {
      return null;
    }
  };
  useEffect(() => {
    priceConversion(price());
  }, [price(), currencyToDollar, priceConversionRate]);
  const sortedImages = stay.stay_images.sort((x, y) => y.main - x.main);
  let mainImage = sortedImages.find((image) => image.main);
  return (
    <div className="relative px-4">
      <Link href={`/stays/${stay.slug}/`}>
        <a className="px-4">
          <div className="flex w-full shadow-md">
            <div
              className="w-full min-h-[11rem] justify-between overflow-hidden rounded-md relative
      "
            >
              <div className="h-full w-full relative flex-shrink-0 flex-grow-0">
                <Image
                  className="w-full h-full"
                  layout="fill"
                  src={mainImage.image}
                  alt="Image"
                />
              </div>
            </div>
            <div className="w-2/4 flex-grow-0 flex-shrink-0 px-2 py-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-gray-500 truncate">{stay.name}</h1>
                <ClientOnly>
                  {currencyToDollar && (
                    <h1 className="font-bold text-lg font-OpenSans">
                      {price()
                        ? "$" + Math.ceil(newPrice).toLocaleString()
                        : "No data"}
                    </h1>
                  )}
                  {!currencyToDollar && (
                    <h1 className="font-bold text-lg font-OpenSans">
                      {price()
                        ? "KES" + Math.ceil(price()).toLocaleString()
                        : "No data"}
                    </h1>
                  )}
                </ClientOnly>
              </div>

              {!checkoutInfo && (
                <div className="text-gray-500 flex gap-1 text-sm truncate flex-wrap">
                  {stay.rooms && (
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        width="1em"
                        height="1em"
                        preserveAspectRatio="xMidYMid meet"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M5 5v14a1 1 0 0 0 1 1h3v-2H7V6h2V4H6a1 1 0 0 0-1 1zm14.242-.97l-8-2A1 1 0 0 0 10 3v18a.998.998 0 0 0 1.242.97l8-2A1 1 0 0 0 20 19V5a1 1 0 0 0-.758-.97zM15 12.188a1.001 1.001 0 0 1-2 0v-.377a1 1 0 1 1 2 .001v.376z"
                        />
                      </svg>

                      <span>{stay.rooms} rm</span>
                    </div>
                  )}

                  {stay.beds && (
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M20 9.556V3h-2v2H6V3H4v6.557C2.81 10.25 2 11.526 2 13v4a1 1 0 0 0 1 1h1v4h2v-4h12v4h2v-4h1a1 1 0 0 0 1-1v-4c0-1.474-.811-2.75-2-3.444zM11 9H6V7h5v2zm7 0h-5V7h5v2z" />
                      </svg>
                      <span>{stay.beds} bd</span>
                    </div>
                  )}

                  {stay.bathrooms && (
                    <div className="flex items-center gap-0.5">
                      <svg
                        className="w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M32 384c0 28.32 12.49 53.52 32 71.09V496C64 504.8 71.16 512 80 512h32C120.8 512 128 504.8 128 496v-15.1h256V496c0 8.836 7.164 16 16 16h32c8.836 0 16-7.164 16-16v-40.9c19.51-17.57 32-42.77 32-71.09V352H32V384zM496 256H96V77.25C95.97 66.45 111 60.23 118.6 67.88L132.4 81.66C123.6 108.6 129.4 134.5 144.2 153.2C137.9 159.5 137.8 169.8 144 176l11.31 11.31c6.248 6.248 16.38 6.248 22.63 0l105.4-105.4c6.248-6.248 6.248-16.38 0-22.63l-11.31-11.31c-6.248-6.248-16.38-6.248-22.63 0C230.7 33.26 204.7 27.55 177.7 36.41L163.9 22.64C149.5 8.25 129.6 0 109.3 0C66.66 0 32 34.66 32 77.25v178.8L16 256C7.164 256 0 263.2 0 272v32C0 312.8 7.164 320 16 320h480c8.836 0 16-7.164 16-16v-32C512 263.2 504.8 256 496 256z" />
                      </svg>{" "}
                      <span>{stay.bathrooms} ba</span>
                    </div>
                  )}
                </div>
              )}
              <div className="font-bold text-sm truncate mt-1">
                {stay.location}
              </div>

              {checkoutInfo && (
                <div className="font-bold text-sm truncate mt-1">
                  Order for {orderDays} days
                </div>
              )}

              <div className="flex flex-col">
                {checkoutInfo && (
                  <div
                    className="text-sm w-fit bg-blue-400 bg-opacity-30 px-2 py-1 text-blue-500 bg-primary-red-100 font-bold p-3 rounded-md mt-2
          "
                    onClick={setCartId}
                  >
                    Edit detail
                  </div>
                )}
                {!orderSuccessfull && (
                  <div
                    className="text-sm w-fit flex items-center bg-red-400 bg-opacity-30 px-2 py-1 text-red-500 bg-primary-red-100 font-bold p-3 rounded-md mt-2
          "
                    onClick={removeCart}
                  >
                    <span className="mr-1">Remove</span>
                    <div
                      className={" " + (!removeButtonLoading ? "hidden" : "")}
                    >
                      <LoadingSpinerChase
                        width={13}
                        height={13}
                        color="red"
                      ></LoadingSpinerChase>
                    </div>
                  </div>
                )}
                {orderSuccessfull && (
                  <div
                    className="text-sm w-fit flex items-center bg-green-500 bg-opacity-30 px-2 py-1 text-green-700 bg-primary-red-100 font-bold p-3 rounded-md mt-2
          "
                    onClick={orderAgain}
                  >
                    <span className="mr-1">Order again</span>
                    <div className={" " + (!orderAgainLoading ? "hidden" : "")}>
                      <LoadingSpinerChase
                        width={13}
                        height={13}
                        color="green"
                      ></LoadingSpinerChase>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </a>
      </Link>
      {stay.type_of_stay === "LODGE" && (
        <div className="absolute top-7 left-5 z-10 px-2 rounded-md bg-green-600 text-white">
          Lodge
        </div>
      )}
      {stay.type_of_stay === "HOUSE" && (
        <div className="absolute top-7 left-5 z-10 px-2 rounded-md bg-green-600 text-white">
          House
        </div>
      )}
      {stay.type_of_stay === "UNIQUE SPACE" && (
        <div className="absolute top-7 left-5 z-10 px-2 rounded-md bg-green-600 text-white">
          Unique space
        </div>
      )}
      {stay.type_of_stay === "CAMPSITE" && (
        <div className="absolute top-7 left-5 z-10 px-2 rounded-md bg-green-600 text-white">
          Campsite
        </div>
      )}
      {stay.type_of_stay === "BOUTIQUE HOTEL" && (
        <div className="absolute top-7 left-5 z-10 px-2 rounded-md bg-green-600 text-white">
          Boutique hotel
        </div>
      )}
      <div onClick={addToCart}>
        {orderSuccessfull && (
          <div className="p-2 bg-blue-100 cursor-pointer absolute top-1 right-1 flex items-center justify-center rounded-full">
            {!cartLoading && !cartAdded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
            {!cartLoading && cartAdded && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {cartLoading && (
              <LoadingSpinerChase
                width={15}
                height={15}
                color="#000"
              ></LoadingSpinerChase>
            )}
          </div>
        )}

        {orderSuccessfull && !listingIsInCart && !cartLoading && !cartAdded && (
          <div className="absolute top-1.5 right-1.5 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 cursor-pointer"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {orderSuccessfull && listingIsInCart && !cartLoading && !cartAdded && (
          <div className="absolute top-1.5 right-1.5 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 cursor-pointer text-blue-900"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

CartItem.propTypes = {
  checkoutInfo: PropTypes.bool,
};

export default CartItem;