import React from 'react';
import { useStateValue } from '../context/StateProvider';
import './Product.css';
import 'animate.css';

import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { db } from '../firebase';

function Product({ id, title, price, rating, image }) {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  const addToCart = () => {
    if (user) {
      const data = {
        id,
        title,
        price,
        rating,
        image,
      };
      db.collection('users').doc(user.uid).collection('cart').add(data);

      dispatch({
        type: 'ADD_TO_CART',
        data,
      });
    } else {
      history.push('/login');
    }
  };

  return (
    <div className="product animate__animated animate__bounceIn">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <strong>${price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_) => (
              <span key={uuidv4()} role="img" aria-label="star">
                ⭐
              </span>
            ))}
        </div>
      </div>
      <img className="product__image" src={image} alt="product_image" />
      <button onClick={addToCart}>Add to cart</button>
    </div>
  );
}

export default Product;
