import React from 'react';
import './Subtotal.css';

import CurrencyFormat from 'react-currency-format';
import { useStateValue } from '../context/StateProvider';
import { getCartTotal } from '../context/reducer';
import { useHistory } from 'react-router-dom';

function Subtotal() {
  const history = useHistory();
  const [{ cart }] = useStateValue();

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({cart.length} items) : <strong>{`${value}`}</strong>
            </p>
            <small className="subtotal__gift">
              <input type="checkbox" /> This order contains a gift.
            </small>
          </>
        )}
        decimalScale={2}
        value={getCartTotal(cart)}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
      />

      <button onClick={(e) => history.push('/payment')}>Proceed to checkout</button>
    </div>
  );
}

export default Subtotal;
