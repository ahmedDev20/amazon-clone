import React, { useEffect, useState } from 'react';
import { useStateValue } from '../context/StateProvider';
import { db } from '../firebase';
import Order from './Order';

import './Orders.css';

function Orders() {
  const [{ user }] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      db.collection('users')
        .doc(user?.uid)
        .collection('orders')
        .orderBy('created', 'desc')
        .onSnapshot((snapshot) => {
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        });
    } else {
      setOrders([]);
    }
  });

  return (
    <div className="orders">
      {orders?.length ? (
        <>
          <h1>Your Orders:</h1>
          <div className="orders__container">
            {orders?.map((order) => (
              <Order order={order} />
            ))}
          </div>
        </>
      ) : (
        <h1>You have no orders yet.</h1>
      )}
    </div>
  );
}

export default Orders;
