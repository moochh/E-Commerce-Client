import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import CartItem from '../components/cart/CartItem';
import { CONFIG_PARAMS } from '@cloudinary/url-gen/backwards/configuration';

const Checkout = () => {
	const [cart, setCart] = useState([]);
	const [paymentMethod, setPaymentMethod] = useState('gcash');
	const userID = '9a7b3d29-bf02-4cb8-9b1e-1d394c54e000';
	const isInitialMount = useRef(true);
	const apiKey = import.meta.env.VITE_PAYMONGO_API_KEY;

	const paymentOptions = ['GCash', 'Card', 'DOB'];

	const headers = {
		accept: 'application/json',
		authorization: `Basic ${btoa(`${apiKey}`)}`,
		'content-type': 'application/json'
	};

	async function checkout() {
		const paymentIntent = await createPaymentIntent();
		const paymentMethod = await createPaymentMethod();

		await attachPaymentMethod(paymentIntent, paymentMethod);
	}

	async function createPaymentIntent() {
		const attributes = {
			attributes: {
				amount: getAmount(),
				payment_method_allowed: [paymentMethod],
				payment_method_options: {
					card: { request_three_d_secure: 'any' }
				},
				currency: 'PHP',
				capture_type: 'automatic'
			}
		};

		try {
			const response = await axios.post(
				'https://api.paymongo.com/v1/payment_intents',
				{ data: attributes },
				{ headers }
			);

			const paymentIntent = response.data.data.id;

			console.log(response.data.data);

			return paymentIntent;
		} catch (error) {}
	}

	async function createPaymentMethod() {
		const attributes = {
			attributes: {
				type: paymentMethod,
				details: {
					card_number: '4343434343434345',
					exp_month: 12,
					exp_year: 2025,
					cvc: '123'
				}
			}
		};

		try {
			const response = await axios.post(
				'https://api.paymongo.com/v1/payment_methods',
				{ data: attributes },
				{ headers }
			);
			const paymentMethod = response.data.data.id;

			console.log(response.data.data);

			return paymentMethod;
		} catch (error) {}
	}

	async function attachPaymentMethod(paymentIntent, paymentMethod) {
		const attributes = {
			attributes: {
				payment_method: paymentMethod,
				return_url: 'http://localhost:5173/postcheckout'
			}
		};

		try {
			const response = await axios.post(
				`https://api.paymongo.com/v1/payment_intents/${paymentIntent}/attach`,
				{ data: attributes },
				{ headers }
			);

			if (response.status === 200) {
				alert('Payment successful!');
			}

			const redirectUrl =
				response.data.data.attributes.next_action.redirect.url;

			window.location.href = redirectUrl;
		} catch (error) {}
	}

	useEffect(() => {
		async function fetchCart() {
			const response = await axios.get(`/cart/${userID}`);
			const data = response.data;

			setCart(data);
		}

		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			fetchCart();
		}
	}, []);

	function getTotal() {
		const total = cart
			.reduce(
				(acc, product) => acc + parseFloat(product.price) * product.quantity,
				0
			)
			.toFixed(2);

		return total;
	}

	function getAmount() {
		return parseInt(getTotal().replace('.', ''));
	}

	function selectPaymentMethod(paymentMethod) {
		setPaymentMethod(paymentMethod.toLowerCase());
	}

	return (
		<div>
			<Nav />

			<h1>Checkout</h1>

			<div className="cart-list">
				{cart.map((product) => (
					<CartItem key={product.id} product={product} showActions={false} />
				))}
			</div>

			<h1 className="mt">Total: {getTotal()}</h1>

			<div className="payment-options">
				{paymentOptions.map((option) => (
					<button
						key={option}
						className={option.toLowerCase() === paymentMethod ? 'active' : ''}
						onClick={() => selectPaymentMethod(option)}>
						{option}
					</button>
				))}
			</div>

			<button className="mt" onClick={checkout}>
				Checkout
			</button>
		</div>
	);
};

export default Checkout;
