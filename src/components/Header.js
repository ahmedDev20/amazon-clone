import React, { useState } from 'react';
import './Header.css';

import { useStateValue } from '../context/StateProvider';
import { Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import { auth } from '../firebase';

function Header() {
  const [{ products, cart, user }, dispatch] = useStateValue();
  const [searchValue, setSearchValue] = useState('');

  const logInOrOut = () => {
    if (user) {
      auth.signOut();
      dispatch({
        type: 'EMPTY_CART',
      });
    }
  };

  const searchForProducts = (e) => {
    e.preventDefault();
    if (searchValue) {
      const regex = new RegExp(searchValue, 'gi');
      const filtredData = products.filter((product) => product.title.search(regex) >= 0);

      dispatch({
        type: 'SEARCH_PRODUCTS',
        data: filtredData,
      });
    } else {
      dispatch({
        type: 'SEARCH_PRODUCTS',
        data: products,
      });
    }
  };

  return (
    <nav className="header">
      <Link to="/">
        <img className="header__logo" src="http://pngimg.com/uploads/amazon/amazon_PNG11.png" alt="amazon-logo" />
      </Link>

      <form className="header__search" onSubmit={searchForProducts}>
        <input
          type="text"
          placeholder="Type to search..."
          onChange={(e) => {
            setSearchValue(e.currentTarget.value);
          }}
          className="header__searchInput"
        />
        <SearchIcon onClick={searchForProducts} className="header__searchIcon" />
      </form>

      <div className="header__nav">
        <Link className="header__link" to={user ? '' : '/login'}>
          <div onClick={logInOrOut} className="header__option">
            <span className="header__optionLineOne">Hello {user ? user.email : 'Guest'}</span>
            <span className="header__optionLineTwo">{user ? 'Sign Out' : 'Sign In'}</span>
          </div>
        </Link>

        <Link className="header__link" to={user ? '/orders' : '/login'}>
          <div className="header__option">
            <span className="header__optionLineOne">Returns </span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
        </Link>

        <Link className="header__link" to="/prime">
          <div className="header__option">
            <span className="header__optionLineOne">Your</span>
            <span className="header__optionLineTwo">Prime</span>
          </div>
        </Link>

        <Link className="header__link" to={user ? '/checkout' : '/login'}>
          <div className="header__optionCart">
            <ShoppingBasketIcon />
            <span className="header__optionLineTwo header__cartCount">{cart?.length}</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Header;
