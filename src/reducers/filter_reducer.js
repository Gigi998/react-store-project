import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  if (action.type === LOAD_PRODUCTS) {
    //Calculating max price
    let maxPriceArr = action.payload.map((item) => item.price);
    let maxPrice = Math.max(...maxPriceArr);
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let sortedProducts = [];
    if (sort === "price-lowest") {
      sortedProducts = filtered_products.sort((a, b) => {
        return a.price - b.price;
      });
    }
    if (sort === "price-highest") {
      sortedProducts = filtered_products.sort((a, b) => {
        return b.price - a.price;
      });
    }
    if (sort === "name-a") {
      sortedProducts = filtered_products.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
    if (sort === "name-z") {
      sortedProducts = filtered_products.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        return 0;
      });
    }
    return { ...state, filtered_products: sortedProducts };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  // Filter products logic
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, category, company, color, price, shipping } = state.filters;
    //If none of the filters are not trigered than display all the products
    let tempProducts = [...all_products];
    if (text) {
      tempProducts = tempProducts.filter((product) => {
        return product.name.toLowerCase().startsWith(text);
      });
    }
    if (category !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.category === category;
      });
    }
    if (company !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.company === company;
      });
    }
    if (color !== "all") {
      tempProducts = tempProducts.filter((product) => {
        return product.colors.includes(`${color}`);
      });
    }
    if (price >= 0) {
      tempProducts = tempProducts.filter((product) => {
        return product.price <= price;
      });
    }
    if (shipping) {
      tempProducts = tempProducts.filter((product) => {
        return product.shipping === shipping;
      });
    }
    //Important
    return {
      ...state,
      filtered_products: tempProducts,
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: "",
        company: "all",
        category: "all",
        color: "all",
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
