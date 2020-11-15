import moment from 'moment';
import React from 'react';
import CurrencyFormat from 'react-currency-format';
import CheckoutProduct from './CheckoutProduct';
import './Order.css';

function Order({ order }) {
  const groupProducts = (arr) => {
    return arr
      ? arr.reduce(
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
        )
      : [];
  };
  const groupedCart = groupProducts(order?.data.cart);

  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment.unix(order.data.created).format('MMMM Do YYYY, h:mma')}</p>
      <p className="order__id">
        <small>{order.id}</small>
      </p>
      {groupedCart?.map((item) => {
        if (item.quantity > 1) return <CheckoutProduct id={item.id} quantity={item.quantity} title={item.title} price={item.price} rating={item.rating} image={item.image} hideButton />;
        else return <CheckoutProduct id={item.id} title={item.title} price={item.price} rating={item.rating} image={item.image} hideButton />;
      })}

      <CurrencyFormat renderText={(value) => <h3 className="order__total">Order Total: {value}</h3>} decimalScale={2} value={order.data.amount / 100} displayType={'text'} thousandSeparator={true} prefix={'$'} />
    </div>
  );
}

export default Order;
