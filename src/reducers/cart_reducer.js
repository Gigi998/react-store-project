import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { id, color, amount, product } = action.payload;
    //Check if item is in array
    const tempItem = state.cart.find((item) => item.id === id + color);
    if (tempItem) {
      const tempCart = state.cart.map((c) => {
        //Find item and update state
        if (c.id === id + color) {
          let newAmount = c.amount + amount;
          //If amount is bigger than amount in stock
          if (newAmount > c.max) {
            newAmount = c.max;
          }
          return { ...c, amount: newAmount };
        } else {
          return c;
        }
      });
      return { ...state, cart: tempCart };

      //If it is not in the array, create newone and update state
    } else {
      const newItem = {
        id: id + color,
        name: product.name,
        price: product.price,
        amount,
        max: product.stock,
        image: product.images[0].url,
        color,
      };
      //Copy all items in cart state and add newone
      return { ...state, cart: [...state.cart, newItem] };
    }
  }
  if (action.type === REMOVE_CART_ITEM) {
    const tempCart = state.cart.filter((item) => item.id !== action.payload);
    return {
      ...state,
      cart: tempCart,
    };
  }
  if (action.type === CLEAR_CART) {
    return { ...state, cart: [] };
  }
  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;
    const tempCart = state.cart.map((item) => {
      if (item.id === id) {
        if (value === "inc") {
          let newAmount = item.amount + 1;
          if (newAmount > item.max) {
            newAmount = item.max;
          }
          return { ...item, amount: newAmount };
        }
        if (value === "dec") {
          let newAmount = item.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return { ...item, amount: newAmount };
        }
      }
      return item;
    });
    return { ...state, cart: tempCart };
  }
  if (action.type === COUNT_CART_TOTALS) {
    let newTotal = 0;
    let newCount = 0;
    state.cart.forEach((item) => {
      newTotal += item.price * item.amount;
      newCount += item.amount;
    });
    return { ...state, total_amount: newTotal, total_items: newCount };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
