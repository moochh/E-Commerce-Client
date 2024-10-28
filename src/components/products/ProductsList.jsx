import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsList = ({ trigger, triggerCategories, setProductNames }) => {
	const [products, setProducts] = useState([]);
	const [changed, setChanged] = useState(0);
	const [showDescription, setShowDescription] = useState(false);
	const [showImage, setShowImage] = useState(true);

	useEffect(() => {
		async function fetchProducts() {
			const response = await axios.get('/products');
			const data = response.data;

			const productNames = data.map((product) => product.name.toLowerCase());
			setProductNames(productNames);

			setProducts(data);
		}

		fetchProducts();
	}, [trigger, changed]);

	const deleteProduct = async (id) => {
		const result = await axios.delete(`/hard-delete/${id}`);
		console.log(result);

		if (result.status === 200) {
			await axios.delete(`/delete-all/${id}`);

			alert('Product deleted successfully');
			setChanged(changed + 1);
			triggerCategories();
		}
	};

	return (
		<div>
			<div className="section-header">
				<h1>Products</h1>

				<button
					className="primary"
					onClick={() => setShowDescription(!showDescription)}>
					{showDescription ? 'Hide' : 'Show'} Description
				</button>

				<button className="primary" onClick={() => setShowImage(!showImage)}>
					{showImage ? 'Hide' : 'Show'} Image
				</button>
			</div>

			<table className="table" style={{ marginTop: '16px' }}>
				<thead>
					<tr>
						<th>ID</th>
						{showImage && <th>Image</th>}
						<th>Name</th>
						<th>Brand</th>
						{showDescription && <th>Short Description</th>}
						<th>Category</th>
						<th>Type</th>
						<th>Price</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.id}>
							<td>{product.id}</td>
							{showImage && (
								<td>
									<img src={product.image_url} />
								</td>
							)}
							<td>{product.name}</td>
							<td>{product.brand}</td>
							{showDescription && (
								<td className="description">{product.short_description}</td>
							)}
							<td>{product.category}</td>
							<td>{product.type}</td>
							<td>{product.price}</td>
							<td
								className="delete-product"
								onClick={() => deleteProduct(product.id)}>
								Delete
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default ProductsList;
