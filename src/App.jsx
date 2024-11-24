import './styles/styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import React from 'react';
import axios from 'axios';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Checkout from './pages/Checkout';
import PostCheckout from './pages/PostCheckout';
import Image from './pages/Image';
import UpdateImage from './pages/UpdateImage';

axios.defaults.baseURL = 'https://prof-elec.vercel.app/';
// axios.defaults.baseURL = 'http://localhost:3000';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/favorites" element={<Favorites />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/postcheckout" element={<PostCheckout />} />
				{/* <Route path="/image" element={<Image />} /> */}
				<Route path="/image" element={<UpdateImage />} />
			</Routes>
		</Router>
	);
}

export default App;
