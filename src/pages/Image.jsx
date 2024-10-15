import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';

const Image = () => {
	const [image, setImage] = useState(null);
	const [url, setUrl] = useState('');

	const handleChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImage(file);

			// const fileURL = URL.createObjectURL(file); // Create a URL for the selected file
			// setUrl(fileURL); // Set the image URL to state
		}
	};

	const handleUpload = async () => {
		if (!image) return;

		const formData = new FormData();
		formData.append('image', image);

		try {
			const response = await axios.post('/image-test', formData);

			if (response.status === 201) {
				console.log(response.data);

				setUrl(response.data.url);
			} else if (response.status === 500) {
				alert('Internal server error');
			}
		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	return (
		<>
			<Nav />

			<h1>Image Upload</h1>

			<div>
				<input type="file" accept="image/*" onChange={handleChange} />
				<button onClick={handleUpload}>Upload Image</button>
				{url && (
					<img
						src={url}
						alt="Uploaded"
						style={{ width: '200px', height: 'auto' }}
					/>
				)}
			</div>
		</>
	);
};

export default Image;
