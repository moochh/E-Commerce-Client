import Nav from '../components/Nav';
import React, { useState, useEffect, useRef } from 'react';
import Users from '../components/Users';
import ProductsList from '../components/products/ProductsList';
import axios from 'axios';

const Home = () => {
	const [categories, setCategories] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [changed, setChanged] = useState(0);
	const [selectedName, setSelectedName] = useState('');
	const [selectedDescription, setSelectedDescription] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedPrice, setSelectedPrice] = useState('');
	const [selectedStock, setSelectedStock] = useState('');

	const nameRef = useRef(null);
	const descriptionRef = useRef(null);
	const categoryRef = useRef(null);
	const priceRef = useRef(null);
	const stockRef = useRef(null);

	useEffect(() => {
		async function fetchCategories() {
			const response = await axios.get('/products');
			const data = response.data;

			const categories = data.map((product) => product.category);

			// Remove duplicates
			const uniqueCategories = [...new Set(categories)];

			setCategories(uniqueCategories);
		}

		fetchCategories();
	}, [changed]);

	function selectCategory(category) {
		setSelectedCategory(category);
		setShowDropdown(false);
	}

	function handleClick(e) {
		setShowDropdown(true);
	}

	function handleInput(e) {
		setSelectedCategory(e.target.value);
		setShowDropdown(false);
	}

	async function addProduct() {
		const name = nameRef.current.value;
		const description = descriptionRef.current.value;
		const category = selectedCategory;
		const price = priceRef.current.value;
		const stock_quantity = stockRef.current.value;

		if (
			name === '' ||
			description === '' ||
			selectedCategory === '' ||
			price === '' ||
			stock_quantity === ''
		) {
			alert('Please fill in all fields');
			return;
		}

		try {
			parseInt(price);
			parseInt(stock_quantity);
		} catch (error) {
			alert('Please enter valid numbers');
			return;
		}

		const productData = new Object();
		productData.name = name;
		productData.description = description;
		productData.category = category;
		productData.price = price;
		productData.stock_quantity = stock_quantity;

		try {
			const result = await axios.post('/products', productData);
			console.log(result);

			if (result.status === 201) {
				alert('Product added successfully');
				resetInputs();
				setChanged(changed + 1);
			}
		} catch (error) {
			if (error.status === 400) {
				alert('Product already exists');
			}
		}
	}

	const triggerCategories = () => {
		setChanged(changed + 1);
	};

	const resetInputs = () => {
		nameRef.current.value = '';
		descriptionRef.current.value = '';
		setSelectedCategory('');
		priceRef.current.value = '';
		stockRef.current.value = '';
	};

	return (
		<>
			<Nav />

			<h1>Add Products</h1>

			<div className="inputs-container">
				<div className="input-group">
					<p className="label">Product Name</p>
					<input type="text" placeholder="Product Name" ref={nameRef} />
				</div>

				<div className="input-group">
					<p className="label">Category</p>
					<input
						type="text"
						placeholder="Category"
						value={selectedCategory}
						onClick={handleClick}
						onInput={handleInput}
					/>

					{showDropdown && (
						<div className="categories-dropdown">
							{categories.map((category, index) => (
								<div key={index}>
									<p onClick={() => selectCategory(category)}>{category}</p>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="input-group">
					<p className="label">Price</p>
					<input type="number" placeholder="Price" ref={priceRef} />
				</div>

				<div className="input-group">
					<p className="label">Stock Quantity</p>
					<input type="number" placeholder="Stock Quantity" ref={stockRef} />
				</div>
			</div>

			<div className="input-group" style={{ marginTop: '12px' }}>
				<p className="label">Description</p>
				<textarea
					type="text"
					placeholder="Description"
					ref={descriptionRef}
					rows="5"
				/>
			</div>

			<button className="primary" id="addProductButton" onClick={addProduct}>
				Add Product
			</button>

			<ProductsList trigger={changed} triggerCategories={triggerCategories} />
		</>
	);
};

export default Home;
