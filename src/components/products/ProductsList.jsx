import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsList = ({ trigger, triggerCategories }) => {
	const [products, setProducts] = useState([]);
	const [changed, setChanged] = useState(0);
	const [showDescription, setShowDescription] = useState(false);

	useEffect(() => {
		async function fetchProducts() {
			const response = await axios.get('/products');
			const data = response.data;

			setProducts(data);
		}

		fetchProducts();
	}, [trigger, changed]);

	const deleteProduct = async (id) => {
		const result = await axios.delete(`/products/${id}`);
		console.log(result);

		if (result.status === 200) {
			alert('Product deleted successfully');
			setChanged(changed + 1);
			triggerCategories();
		}
	};

	return (
		<div>
			<div className="section-header">
				<h1 style={{ marginTop: '32px' }}>Products</h1>

				<button
					className="primary"
					onClick={() => setShowDescription(!showDescription)}>
					{showDescription ? 'Hide' : 'Show'} Description
				</button>
			</div>

			<table className="table" style={{ marginTop: '16px' }}>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						{showDescription && <th>Description</th>}
						<th>Category</th>
						<th>Price</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.id}>
							<td>{product.id}</td>
							<td>{product.name}</td>
							{showDescription && (
								<td className="description">{product.description}</td>
							)}
							<td>{product.category}</td>
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
