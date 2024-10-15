import Nav from '../components/Nav';
import React, { useState, useEffect, useRef } from 'react';
import Users from '../components/Users';
import ProductsList from '../components/products/ProductsList';
import axios from 'axios';
import sampleImage from '../assets/sample.png';
import { Form } from 'react-router-dom';

const Home = () => {
	const [categories, setCategories] = useState([]);
	const [types, setTypes] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [showTypeDropdown, setShowTypeDropdown] = useState(false);
	const [changed, setChanged] = useState(0);
	const [selectedName, setSelectedName] = useState('');
	const [selectedDescription, setSelectedDescription] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedType, setSelectedType] = useState('');
	const [selectedPrice, setSelectedPrice] = useState('');
	const [selectedStock, setSelectedStock] = useState('');
	const [productNames, setProductNames] = useState([]);
	const [image, setImage] = useState(null);
	const [imageURL, setImageURL] = useState(null);

	const nameRef = useRef(null);
	const shortDescriptionRef = useRef(null);
	const longDescriptionRef = useRef(null);
	const categoryRef = useRef(null);
	const priceRef = useRef(null);
	const stockRef = useRef(null);
	const brandRef = useRef(null);
	const dimensionsRef = useRef(null);
	const imageRef = useRef(null);

	const allCategories = [
		'Living Room',
		'Bedroom',
		'Kitchen',
		'Dining Room',
		'Bathroom',
		'Outdoor'
	];

	useEffect(() => {
		async function fetchCategories() {
			const response = await axios.get('/products');
			const data = response.data;

			const categories = data.map((product) => product.category);
			const types = data.map((product) => product.type);

			// Remove duplicates
			const uniqueCategories = [...new Set(categories)];
			const uniqueTypes = [...new Set(types)];

			setCategories(uniqueCategories);
			setTypes(uniqueTypes);
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

	function selectType(type) {
		setSelectedType(type);
		setShowTypeDropdown(false);
	}

	function handleTypeClick(e) {
		setShowTypeDropdown(true);
	}

	function handleTypeInput(e) {
		setSelectedType(e.target.value);
		setShowTypeDropdown(false);
	}

	async function addProduct() {
		const name = nameRef.current.value;
		const shortDescription = shortDescriptionRef.current.value;
		const longDescription = longDescriptionRef.current.value;
		const category = selectedCategory;
		const price = priceRef.current.value;
		const stock_quantity = stockRef.current.value;
		const type = selectedType;
		const dimensions = dimensionsRef.current.value;
		const brand = brandRef.current.value;

		if (
			name === '' ||
			shortDescription === '' ||
			longDescription === '' ||
			selectedCategory === '' ||
			price === '' ||
			stock_quantity === '' ||
			type === '' ||
			dimensions === '' ||
			brand === '' ||
			!image
		) {
			alert('Please fill in all fields');
			return;
		}

		// Loop thruogh product names to see similar name
		const similarName = productNames.find(
			(productName) => productName.toLowerCase() === name.toLowerCase()
		);

		if (similarName) {
			alert('Product already exists');
			return;
		}

		try {
			parseInt(price);
			parseInt(stock_quantity);
		} catch (error) {
			alert('Please enter valid numbers');
			return;
		}

		// Check if dimensions are in the correct format (lxwxh)
		if (!dimensions.match(/^\d+x\d+x\d+$/)) {
			alert('Dimensions must be in the format lxwxh');
			return;
		}

		const productData = new FormData();
		productData.append('name', name);
		productData.append('short_description', shortDescription);
		productData.append('long_description', longDescription);
		productData.append('category', category);
		productData.append('price', price);
		productData.append('stock_quantity', stock_quantity);
		productData.append('type', type);
		productData.append('dimensions', dimensions);
		productData.append('brand', brand);
		productData.append('image', image);

		try {
			const result = await axios.post('/products', productData);
			console.log(result.data);

			if (result.status === 201) {
				alert('Product added successfully');
				resetInputs();
				setChanged(changed + 1);
			}
		} catch (error) {
			if (error.status === 400) {
				alert('Product already exists');
			} else if (error.status === 500) {
				alert('Internal server error');
			}
		}
	}

	const triggerCategories = () => {
		setChanged(changed + 1);
	};

	const resetInputs = () => {
		nameRef.current.value = '';
		shortDescriptionRef.current.value = '';
		longDescriptionRef.current.value = '';
		setSelectedCategory('');
		priceRef.current.value = '';
		stockRef.current.value = '';
		brandRef.current.value = '';
		dimensionsRef.current.value = '';
		setSelectedType('');
		setImage(null);
		setImageURL(null);
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
			setImageURL(fileURL);
			setImage(file); // Set the image URL to state
		}
	};

	const browseImage = () => {
		imageRef.current.click();
	};

	const longDescriptionSample =
		'Adjustable feet allow you to level the table on uneven floors. \n\nPre-drilled leg holes for easy assembly. \n\nBoard-on-frame is a strong and lightweight material with a frame in wood, particleboard or fiberboard and a recycled paper filling. It requires less raw materials and is easy to transport, which reduces the environmental impact. \n\nPre-drilled holes for legs, for easy assembly. \n\nAdjustable feet make the table stand steady also on uneven floors. \n\nThe tabletop has pre-drilled holes to make it easier to attach to the underframe.';

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
					<p className="label">Brand</p>
					<input type="text" placeholder="Brand" ref={brandRef} />
				</div>

				<div className="input-group">
					<p className="label">Category</p>
					<input
						type="text"
						placeholder="Category"
						value={selectedCategory}
						onClick={handleClick}
					/>

					{showDropdown && (
						<div className="categories-dropdown">
							{allCategories.map((category, index) => (
								<div key={index}>
									<p onClick={() => selectCategory(category)}>{category}</p>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="input-group">
					<p className="label">Type</p>
					<input
						type="text"
						placeholder="Type"
						value={selectedType}
						onClick={handleTypeClick}
						onInput={handleTypeInput}
					/>

					{showTypeDropdown && (
						<div className="categories-dropdown">
							{types.map((type, index) => (
								<div key={index}>
									<p onClick={() => selectType(type)}>{type}</p>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="inputs-container">
				<div className="input-group">
					<p className="label">Dimensions in inches (lxwxh) (e.g. 4x3x6) </p>
					<input
						type="text"
						placeholder="Dimensions (lxwxh)"
						ref={dimensionsRef}
					/>
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

			<div className="inputs-container">
				<div className="input-group" style={{ marginTop: '12px' }}>
					<p className="label">Short Description</p>
					<input
						type="text"
						placeholder="E.g. White tray table"
						ref={shortDescriptionRef}
						rows="2"
					/>
				</div>

				<div className="input-group" style={{ marginTop: '12px' }}>
					<p className="label">Long Description</p>
					<textarea
						type="text"
						placeholder={longDescriptionSample}
						ref={longDescriptionRef}
						rows="15"
					/>
				</div>
			</div>

			<p>Use square images.</p>
			<div className="inputs-container">
				<div
					className="input-group image-upload-container"
					style={{ marginTop: '12px' }}>
					{!imageURL && <button onClick={browseImage}>Upload Image</button>}

					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						ref={imageRef}
					/>

					{imageURL && (
						<img src={imageURL} alt="Image preview" onClick={browseImage} />
					)}
				</div>

				<button
					className="primary"
					id="addProductButton"
					onClick={addProduct}
					style={{ height: 'fit-content' }}>
					Add Product
				</button>
			</div>

			<div className="divider"></div>

			<ProductsList
				trigger={changed}
				triggerCategories={triggerCategories}
				setProductNames={setProductNames}
			/>
		</>
	);
};

export default Home;
