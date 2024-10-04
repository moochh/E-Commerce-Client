import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

const Cart = () => {
	const [cart, setCart] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const userID = '9a7b3d29-bf02-4cb8-9b1e-1d394c54e000';
	const isInitialMount = useRef(true);

	useEffect(() => {
		async function fetchAllProducts() {
			const response = await axios.get('/products');

			const data = response.data;
			setAllProducts(data);
		}

		fetchAllProducts();
	}, []);

	useEffect(() => {
		async function fetchCart() {
			const response = await axios.get(`/cart/${userID}`);
			const data = response.data;

			const updatedCart = data
				.map((cartProduct) => {
					const productData = allProducts.find(
						(product) => product.id === cartProduct.product_id
					);

					if (productData) {
						// Assign quantity if productData is found
						return {
							...productData,
							quantity: cartProduct.quantity
						};
					}
					return null; // Return null if the product is not found
				})
				.filter(Boolean); // Remove any null values

			// Set the cart state with the updated cart
			setCart(updatedCart);
		}

		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			fetchCart();
		}
	}, [allProducts]);

	const addToCart = async (product) => {
		product.quantity = 1;
		setCart((prevCart) => [...prevCart, product]);

		const body = {
			product_id: product.id,
			quantity: product.quantity
		};

		const response = await axios.post(`/cart/${userID}`, body);
		console.log(response.status);
	};

	const removeFromCart = async (id) => {
		setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== id));

		const body = {
			product_id: id
		};

		const response = await axios.delete(`/cart/${userID}`, { data: body });
		console.log(response.status);
	};

	const addQuantity = async (id, quantity) => {
		setCart((prevCart) => {
			const product = prevCart.find((cartItem) => cartItem.id === id);
			product.quantity = quantity + 1;
			return [...prevCart];
		});

		const body = {
			product_id: id,
			quantity: quantity + 1
		};

		const response = await axios.put(`/cart/${userID}`, body);
		console.log(response.status);
	};

	const subtractQuantity = async (id, quantity) => {
		if (quantity > 1) {
			setCart((prevCart) => {
				const product = prevCart.find((cartItem) => cartItem.id === id);
				product.quantity = quantity - 1;
				return [...prevCart];
			});

			const body = {
				product_id: id,
				quantity: quantity - 1
			};

			const response = await axios.put(`/cart/${userID}`, body);
			console.log(response.status);
		}
	};

	return (
		<>
			<Nav />

			<div className="flex gapped">
				<h1>Cart</h1>

				<h1 className="light-keep">
					Total:{' '}
					{parseFloat(
						cart
							.reduce(
								(acc, product) =>
									acc + parseFloat(product.price) * product.quantity,
								0
							)
							.toFixed(2)
					)}
				</h1>
			</div>

			{cart.length === 0 && <p>No items in cart.</p>}

			<div className="cart-container">
				{cart.map((product) => {
					return (
						<div className="card" key={product.id}>
							<p>{product.name}</p>
							<p>Quantity: {product.quantity}</p>
							<p>Price: {product.price}</p>

							<div className="cart-actions">
								<button
									className="quantity-button"
									onClick={() => addQuantity(product.id, product.quantity)}>
									+
								</button>
								<button
									className="quantity-button"
									onClick={() =>
										subtractQuantity(product.id, product.quantity)
									}>
									-
								</button>
								<button
									className="primary"
									onClick={() => removeFromCart(product.id)}>
									Remove{' '}
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<h1 className="mt">Products</h1>

			{allProducts.length === cart.length && <p>All products added to cart.</p>}

			<div className="cart-list">
				{allProducts.map((product) => {
					const notInCart = !cart.some(
						(cartItem) => cartItem.id === product.id
					);

					if (notInCart) {
						return (
							<div
								className="card"
								key={product.id}
								onClick={() => addToCart(product)}>
								<p>{product.name}</p>

								<button>Add to cart</button>
							</div>
						);
					}
				})}
			</div>
		</>
	);
};

export default Cart;
