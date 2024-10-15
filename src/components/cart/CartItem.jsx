import React from 'react';

const CartItem = ({ product, showActions }) => {
	return (
		<div className="card">
			<p>{product.name}</p>
			<p>Quantity: {product.quantity}</p>
			<p>Price: {product.price}</p>
			{showActions && (
				<div className="cart-actions">
					<button
						className="quantity-button"
						onClick={() => addQuantity(product.id, product.quantity)}>
						+
					</button>

					<button
						className="quantity-button"
						onClick={() => subtractQuantity(product.id, product.quantity)}>
						-
					</button>
				</div>
			)}
		</div>
	);
};

export default CartItem;
