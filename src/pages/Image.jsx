import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Nav from '../components/Nav';
import { storage } from '../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

		const storageRef = ref(storage, `images/${image.name}`);

		try {
			// Upload the file without tracking progress
			await uploadBytes(storageRef, image);

			// Get the file's download URL
			const downloadURL = await getDownloadURL(storageRef);
			setUrl(downloadURL);
			console.log('File available at', downloadURL);
		} catch (error) {
			console.error('Upload failed:', error);
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
