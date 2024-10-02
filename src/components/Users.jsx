import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		async function fetchUsers() {
			const response = await axios.get('/users');
			const data = response.data;
			setUsers(data);
			console.log(data);
		}

		fetchUsers();
	}, []);

	return (
		<div>
			<h1>Users</h1>

			{users.map((user) => (
				<div key={user.id}>
					<h2>{user.first_name + ' ' + user.last_name}</h2>
					<p>{user.email}</p>
				</div>
			))}
		</div>
	);
};

export default Users;
