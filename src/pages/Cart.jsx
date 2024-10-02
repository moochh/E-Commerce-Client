import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import ListForCart from '../components/cart/ListForCart';
import CartUser from '../components/cart/CartUser';

const Cart = () => {
	const [cart, setCart] = useState([]);
	const [cartProducts, setCartProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [quantityChanged, setQuantityChanged] = useState(0);

	useEffect(() => {
		async function fetchCart() {
			if (!selectedUser) {
				return;
			}
			const response = await axios.get(`/cart/${selectedUser.id}`);
			const data = response.data;

			// Sort by product_id
			data.sort((a, b) => a.product_id - b.product_id);

			setCart(data.map((cart) => cart.product_id));
			setCartProducts(data);
		}

		fetchCart();
	}, [selectedUser, quantityChanged]);

	const addQuantity = async (id, quantity) => {
		try {
			const data = new Object();
			data.product_id = id;
			data.quantity = quantity + 1;

			const result = await axios.put(`/cart/${selectedUser.id}`, data);
			console.log(result);

			if (result.status === 200) {
				setQuantityChanged(quantityChanged + 1);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const subtractQuantity = async (id, quantity) => {
		if (quantity > 1) {
			try {
				const data = new Object();
				data.product_id = id;
				data.quantity = quantity - 1;

				const result = await axios.put(`/cart/${selectedUser.id}`, data);
				console.log(result);

				if (result.status === 200) {
					setQuantityChanged(quantityChanged + 1);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const removeFromCart = async (id) => {
		try {
			const data = new Object();
			data.product_id = id;

			const result = await axios.delete(`/cart/${selectedUser.id}`, {
				data: data
			});
			console.log(result);

			if (result.status === 200) {
				setCart((cart) => cart.filter((cartId) => cartId !== id));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Nav />

			<CartUser notifyUserSelect={setSelectedUser} />

			<h1>Cart</h1>

			<div className="cart-container">
				{cart.map((id) => {
					const product = allProducts.find((product) => product.id === id);
					const cartProduct = cartProducts.find(
						(cartProduct) => cartProduct.product_id === id
					);

					return (
						<div className="card" key={id}>
							<p>{product.name}</p>
							<p>Quantity: {cartProduct.quantity}</p>

							<div className="cart-actions">
								<button
									className="quantity-button"
									onClick={() => addQuantity(id, cartProduct.quantity)}>
									+
								</button>
								<button
									className="quantity-button"
									onClick={() => subtractQuantity(id, cartProduct.quantity)}>
									-
								</button>
								<button className="primary" onClick={() => removeFromCart(id)}>
									Remove{' '}
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<ListForCart
				cart={cart}
				setCart={setCart}
				setAllProducts={setAllProducts}
				selectedUser={selectedUser}
			/>
		</>
	);
};

export default Cart;
