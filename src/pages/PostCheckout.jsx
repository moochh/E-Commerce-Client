import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import { useSearchParams } from 'react-router-dom';

const PostCheckout = () => {
	const [searchParams] = useSearchParams();
	const paymentIntent = searchParams.get('payment_intent_id');
	const isInitialMount = useRef(true);
	const [isPaid, setIsPaid] = useState(false);

	const apiKey = import.meta.env.VITE_PAYMONGO_API_KEY;

	const headers = {
		accept: 'application/json',
		authorization: `Basic ${btoa(`${apiKey}`)}`,
		'content-type': 'application/json'
	};

	useEffect(() => {
		async function fetchPaymentIntent() {
			const response = await axios.get(
				`https://api.paymongo.com/v1/payment_intents/${paymentIntent}`,
				{ headers }
			);

			if (response.data.data.attributes.next_action) {
				setIsPaid(false);
			} else {
				setIsPaid(true);
			}
		}

		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			fetchPaymentIntent();
		}
	}, []);

	return (
		<>
			<Nav />

			<h1>{isPaid ? 'Payment successful' : 'Payment failed'}</h1>
		</>
	);
};

export default PostCheckout;
