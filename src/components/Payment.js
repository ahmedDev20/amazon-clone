import React, { useEffect, useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import { Link, useHistory } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css';

import axios from '../axios';
import CurrencyFormat from 'react-currency-format';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { getCartTotal } from '../context/reducer';
import { db } from '../firebase';

function Payment() {
  const [{ cart, user }, dispatch] = useStateValue();
  const history = useHistory();

  // Stripe
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState('');
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    // Generate stripe secret whenever the cart changes
    const getClientSecret = async () => {
      const response = await axios({
        method: 'post',
        url: `/payments/create?total=${getCartTotal(cart) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
    };

    getClientSecret();
  }, [cart]);

  const handleChange = e => {
    setDisabled(!e.complete);
    setError(e.error ? e.error.message : '');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessing(true);

    await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // Payment confirmation data

        db.collection('users').doc(user?.uid).collection('orders').doc(paymentIntent?.id).set({
          cart,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        // Delete data from cart
        db.collection('users')
          .doc(user?.uid)
          .collection('cart')
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => doc.ref.delete());
          });
        dispatch({
          type: 'EMPTY_CART',
        });

        history.replace('/orders');
      });
  };

  const groupProducts = arr => {
    return arr.reduce(
      (map => (r, a) => {
        // If the product has no quantity add quantity property to it
        if (!map.has(a.id)) {
          map.set(a.id, {
            id: a.id,
            title: a.title,
            price: a.price,
            rating: a.rating,
            image: a.image,
            quantity: 0,
          });
          r.push(map.get(a.id));
        }

        map.get(a.id).quantity++;
        map.get(a.id).price = parseFloat((a.price * map.get(a.id).quantity).toFixed(2));
        return r;
      })(new Map()),
      []
    );
  };
  const groupedCart = groupProducts(cart);

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{cart?.length} items</Link>)
        </h1>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery address</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>N 31 El khourchi Street</p>
            <p>Guelmim, Morocco</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {groupedCart?.map(item => {
              if (item.quantity > 1)
                return (
                  <CheckoutProduct
                    id={item.id}
                    quantity={item.quantity}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    image={item.image}
                  />
                );
              else
                return (
                  <CheckoutProduct
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    rating={item.rating}
                    image={item.image}
                  />
                );
            })}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payement Method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <div>
                <CardElement onChange={handleChange} />
                <p className="payment__test">⚠ Please use this number 4242 4242 4242 4242 ⚠</p>
              </div>

              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={value => <h3>Order Total: {value}</h3>}
                  decimalScale={2}
                  value={getCartTotal(cart)}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : 'Order Now'}</span>
                </button>
              </div>

              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
