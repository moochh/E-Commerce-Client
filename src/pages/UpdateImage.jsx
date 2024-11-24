import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import axios from 'axios';
import { storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function UpdateImage() {
	const [isLoadingProducts, setIsLoadingProducts] = useState(true);
	const [products, setProducts] = useState([]);
	const [targetProduct, setTargetProduct] = useState(null);

	async function fetchProducts() {
		const response = await axios.get('/products');
		const data = response.data;

		// Filter products where image_url is null
		const filteredProducts = data.filter(
			(product) => product.image_url === null
		);

		setProducts(filteredProducts);
		setIsLoadingProducts(false);
	}

	useEffect(() => {
		fetchProducts();
	}, []);

	function browseImage(productID) {
		setTargetProduct(productID);
		imageRef.current.click();
	}

	const [isUploading, setIsUploading] = useState(false);

	async function handleImageChange(e) {
		const file = e.target.files[0];

		if (file) {
			const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
			console.log(fileURL);
			// Set the image URL to the target product
			setProducts(
				products.map((product) => {
					if (product.id === targetProduct) {
						product.image_url = fileURL;
					}
					return product;
				})
			);

			// Upload the file to Firebase Storage
			const storageRef = ref(storage, `products/${targetProduct}`);
			// const storageRef = ref(storage, `${targetProduct}`);

			try {
				setIsUploading(true);
				await uploadBytes(storageRef, file);

				const downloadURL = await getDownloadURL(storageRef);
				console.log(downloadURL);

				// Send URL to server
				const response = await axios.post(
					`/update-product-image/${targetProduct}`,
					{
						image: downloadURL
					}
				);
				console.log(response.data);

				// Remove product from state
				setProducts(products.filter((product) => product.id !== targetProduct));
			} catch (error) {
				alert('Error uploading image');
				console.error('Upload failed:', error);
			} finally {
				setIsUploading(false);
			}
		}
	}

	useEffect(() => {
		console.log(products);
	}, [products]);

	const imageRef = React.useRef(null);

	return (
		<>
			<Nav />

			<h1>Update Image</h1>

			{isLoadingProducts && (
				<h1 style={{ marginTop: '24px' }}>Loading products...</h1>
			)}

			{isUploading && <h1 style={{ marginTop: '24px' }}>Uploading image...</h1>}

			{!isUploading && (
				<table style={{ marginTop: '24px' }}>
					<thead>
						<tr>
							<th>Product ID</th>
							<th>Name</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id}>
								<td>{product.id}</td>
								<td>{product.name}</td>
								<td>
									<button onClick={() => browseImage(product.id)}>
										Upload Image
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<input
				type="file"
				accept="image/*"
				onChange={handleImageChange}
				ref={imageRef}
				style={{ display: 'none' }}
			/>
		</>
	);
}

export default UpdateImage;
