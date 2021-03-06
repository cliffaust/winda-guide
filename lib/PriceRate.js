export const priceConversionRateFunc = async (dispatch) => {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/kes",
      {
        method: "GET",
      }
    );

    const data = await response.json();
    dispatch({
      type: "SET_PRICE_CONVERSION",
      payload: data.rates.USD,
    });
  } catch (error) {
    console.log(error);
  }
};
