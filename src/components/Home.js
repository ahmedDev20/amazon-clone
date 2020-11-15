import React from 'react';
import { useStateValue } from '../context/StateProvider';

import Product from './Product';
import './Home.css';

function Home() {
  const [{ products, filtredProducts }] = useStateValue();

  return (
    <div className="home">
      <img className="home__image" src="https://images-eu.ssl-images-amazon.com/images/G/02/digital/video/merch2016/Hero/Covid19/Generic/GWBleedingHero_ENG_COVIDUPDATE__XSite_1500x600_PV_en-GB._CB428684220_.jpg" alt="prime_banner" />

      <div className="home__row">
        {filtredProducts.length !== 0
          ? filtredProducts.map((product) => <Product key={product.id} id={product.id} title={product.title} price={product.price} rating={product.rating} image={product.image} />)
          : products.map((product) => <Product key={product.id} id={product.id} title={product.title} price={product.price} rating={product.rating} image={product.image} />)}
      </div>
    </div>
  );
}

export default Home;
