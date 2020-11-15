import { db } from '../firebase';

export const initialState = {
  products: [],
  filtredProducts: [],
  cart: [],
  user: null,
};

export const getCartTotal = (cart) => cart?.reduce((amount, item) => item.price + amount, 0);

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
      };

    case 'LOAD_PRODUCTS':
      return {
        ...state,
        products: action.data,
      };

    case 'SEARCH_PRODUCTS':
      return {
        ...state,
        filtredProducts: action.data,
      };

    case 'LOAD_CART':
      return {
        ...state,
        cart: action.data,
      };

    case 'ADD_TO_CART':
      const cartData = [];
      db.collection('users')
        .doc(state.user?.uid)
        .collection('cart')
        .get()
        .then((snapshot) => {
          snapshot.forEach((item) => {
            cartData.push({ id: item.id, ...item.data() });
          });
        });

      return {
        ...state,
        cart: [...cartData],
      };

    case 'REMOVE_FROM_CART':
      const query = db.collection('users').doc(state.user?.uid).collection('cart').where('id', '==', action.id);
      query.get().then((querySnapshot) => {
        querySnapshot.forEach((item) => {
          item.ref.delete();
        });
      });
      return {
        ...state,
      };

    case 'EMPTY_CART':
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
}

export default reducer;
