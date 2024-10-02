import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListForCart = ({ cart, setCart, setAllProducts, selectedUser }) => {
	const [products, setProducts] = useState([]);
	const [availableProducts, setAvailableProducts] = useState([]);

	useEffect(() => {
		async function fetchProducts() {
			const response = await axios.get('/products');
			const data = response.data;
			setProducts(data);
			setAllProducts(data);
		}

		fetchProducts();
	}, []);

	const addToCart = async (id) => {
		if (selectedUser) {
			const productData = new Object();
			productData.user_id = selectedUser.id;
			productData.product_id = id;
			productData.quantity = 1;

			try {
				const result = await axios.post(
					`/cart/${selectedUser.id}`,
					productData
				);

				if (result.status === 201) {
					setCart((cart) => [...cart, id]);
					console.log(cart);
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			alert('Please select a user');
		}
	};

	return (
		<>
			<h1 style={{ marginTop: '32px' }}>Products</h1>

			<div className="cart-list">
				{products.map(
					(product) =>
						!cart.includes(product.id) && (
							<div className="card" key={product.id}>
								<p>{product.name}</p>

								<button
									className="primary"
									onClick={() => addToCart(product.id)}>
									Add to Cart
								</button>
							</div>
						)
				)}
			</div>
		</>
	);
};

export default ListForCart;
