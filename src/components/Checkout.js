import React from 'react';
import { useStateValue } from '../context/StateProvider';
import './Checkout.css';
import CheckoutProduct from './CheckoutProduct';
import Subtotal from './Subtotal';

import { v4 as uuidv4 } from 'uuid';
import 'animate.css';
import { db } from '../firebase';

function Checkout() {
  const [{ user, cart }, dispatch] = useStateValue();

  const groupProducts = (arr) => {
    return arr.reduce(
      ((map) => (r, a) => {
        // If the product has no quantity add quantity property to it
        if (!map.has(a.id)) {
          map.set(a.id, { id: a.id, title: a.title, price: a.price, rating: a.rating, image: a.image, quantity: 0 });
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

  const emptyCart = () => {
    db.collection('users')
      .doc(user?.uid)
      .collection('cart')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => doc.ref.delete());
      });
    dispatch({
      type: 'EMPTY_CART',
    });
  };

  return (
    <div className="checkout">
      <div className="checkout__left">
        <img className="checkout__ad" src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg" alt="checkout_ad" />
        {cart?.length === 0 ? (
          <div>
            <h2>Your shopping Cart is empty.</h2>
            <p>You have no items in your cart. To buy one or more items, click "Add to cart" next to the item.</p>
          </div>
        ) : (
          <div>
            <div className="checkout__title">
              <h2>Your Shopping Cart</h2>
              <button onClick={emptyCart}>Empty Cart</button>
            </div>
            {groupedCart.map((item) => {
              if (item.quantity > 1) return <CheckoutProduct key={uuidv4()} id={item.id} quantity={item.quantity} title={item.title} price={item.price} rating={item.rating} image={item.image} />;
              else return <CheckoutProduct key={uuidv4()} id={item.id} title={item.title} price={item.price} rating={item.rating} image={item.image} />;
            })}
          </div>
        )}
      </div>

      {cart?.length > 0 && (
        <div className="checkout_right">
          <Subtotal />
        </div>
      )}
    </div>
  );
}

export default Checkout;
