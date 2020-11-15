// This file contain the context provider for our app it holds informations about the cart and the user
// Consider it like a data layer

import React, { createContext, useContext, useReducer } from 'react';

// The data layer
export const StateContext = createContext();

// The provider
export const StateProvider = ({ reducer, initialState, children }) => <StateContext.Provider value={useReducer(reducer, initialState)}>{children}</StateContext.Provider>;

// How to use it
export const useStateValue = () => useContext(StateContext);
