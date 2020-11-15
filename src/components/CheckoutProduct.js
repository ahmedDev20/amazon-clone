import React from 'react';
import { useStateValue } from '../context/StateProvider';
import './CheckoutProduct.css';

function CheckoutProduct({ id, title, price, rating, image, quantity, hideButton }) {
  const [, dispatch] = useStateValue();

  const removeFromCart = () => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      id,
    });
  };

  return (
    <div className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt={id} />

      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">
          {title} {quantity && `(x${quantity})`}
        </p>

        <p className="checkoutProduct__price">
          <strong>${price}</strong>
        </p>

        <div className="checkoutProduct__rating">
          {Array(rating)
            .fill()
            .map((_) => (
              <span role="img" aria-label="star">
                ⭐
              </span>
            ))}
        </div>
        {!hideButton && <button onClick={removeFromCart}>Remove from cart</button>}
      </div>
    </div>
  );
}

export default CheckoutProduct;
