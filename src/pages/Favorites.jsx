import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

const Favorites = () => {
	const [favorites, setFavorites] = useState([]);
	const [allProducts, setAllProducts] = useState([]);
	const userID = '9a7b3d29-bf02-4cb8-9b1e-1d394c54e000';
	const isInitialMount = useRef(true);
	const users = ['test_user_1', 'test_user_2', 'test_user_3'];
	const [selectedUser, setSelectedUser] = useState(users[0]);

	useEffect(() => {
		async function fetchAllProducts() {
			const response = await axios.get('/products');

			const data = response.data;
			setAllProducts(data);
		}

		fetchAllProducts();
	}, []);

	useEffect(() => {
		async function fetchFavorites() {
			const response = await axios.get(`/favorites/${selectedUser}`);
			const data = response.data;

			setFavorites(data);
		}

		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			fetchFavorites();
		}
	}, [selectedUser]);

	const addToFavorites = async (product) => {
		setFavorites((prevFavorites) => [...prevFavorites, product]);

		const body = {
			product_id: product.id
		};

		const response = await axios.post(`/favorites/${selectedUser}`, body);
		console.log(response.status);
	};

	const removeFromFavorites = async (id) => {
		setFavorites((prevFavorites) =>
			prevFavorites.filter((favoriteItem) => favoriteItem.id !== id)
		);

		const body = {
			product_id: id
		};

		const response = await axios.delete(`/favorites/${selectedUser}`, {
			data: body
		});
		console.log(response.status);
	};

	return (
		<div>
			<Nav />

			<div className="user-selector">
				{users.map((user) => (
					<button
						className={user == selectedUser ? 'active' : ''}
						key={user}
						onClick={() => setSelectedUser(user)}>
						{user}
					</button>
				))}
			</div>

			<h6 style={{ marginBottom: '24px' }}>Current User: {selectedUser}</h6>

			<h1>Favorites</h1>

			{favorites.length === 0 && <p>No items in favorites.</p>}

			<div className="cart-container">
				{favorites.map((product) => {
					return (
						<div className="card" key={product.id}>
							<p>{product.name}</p>

							<button
								className="red"
								onClick={() => removeFromFavorites(product.id)}>
								Remove
							</button>
						</div>
					);
				})}
			</div>

			<h1 className="mt">Products</h1>

			{allProducts.length === favorites.length && (
				<p>All products added to favorites.</p>
			)}

			<div className="cart-list">
				{allProducts.map((product) => {
					const notInCart = !favorites.some(
						(cartItem) => cartItem.id === product.id
					);

					if (notInCart) {
						return (
							<div
								className="card"
								key={product.id}
								onClick={() => addToFavorites(product)}>
								<p>{product.name}</p>

								<button>Add to cart</button>
							</div>
						);
					}
				})}
			</div>
		</div>
	);
};

export default Favorites;
