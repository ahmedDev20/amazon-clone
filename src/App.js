import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Checkout from './components/Checkout';
import Login from './components/Login';
import Payment from './components/Payment';
import Orders from './components/Orders';

import { auth, db } from './firebase';
import { useStateValue } from './context/StateProvider';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Prime from './components/Prime';

// Stripe magic ✨
const promise = loadStripe('pk_test_51HcYFjAPYqHAf51FhZhqRhbOU8yHo44aBOPSXUiFeDCFf4VLkgycseGN1ipFvU0wqSF7vofunuCp2czlQ17OgomC00bjxN7A19');

function App() {
  const [{ user }, dispatch] = useStateValue();

  const checkIfLoggedIn = () => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // The user is logged in
        dispatch({
          type: 'SET_USER',
          user: authUser,
        });
      } else {
        dispatch({
          type: 'SET_USER',
          user: null,
        });
        // The user is logged out
      }

      return () => {
        unsubscribe();
      };
    });
  };

  const loadProducts = () => {
    db.collection('products')
      .orderBy('rating', 'desc')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });

        dispatch({
          type: 'LOAD_PRODUCTS',
          data,
        });

        dispatch({
          type: 'SEARCH_PRODUCTS',
          data,
        });
      });
  };

  const loadCart = () => {
    if (user) {
      db.collection('users')
        .doc(user?.uid)
        .collection('cart')
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          });

          dispatch({
            type: 'LOAD_CART',
            data,
          });
        });
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    loadProducts();
  }, []);

  useEffect(() => {
    loadCart();
  }, [user]);

  return (
    <Router>
      <div className="app">
        <Switch>
          <Route path="/orders">
            <Header />
            <Orders />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/checkout">
            <Header />
            <Checkout />
          </Route>

          <Route path="/prime">
            <Header />
            <Prime />
          </Route>

          <Route path="/payment">
            <Header />
            <Elements stripe={promise}>
              <Payment />
            </Elements>
          </Route>

          <Route path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
