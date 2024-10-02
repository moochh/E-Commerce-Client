import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CartUser = ({ notifyUserSelect }) => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [showUsers, setShowUsers] = useState(false);

	useEffect(() => {
		async function fetchUsers() {
			const response = await axios.get('/users');
			const data = response.data;
			setUsers(data);
		}

		fetchUsers();
	}, []);

	const selectUser = (user) => {
		setSelectedUser(user);
		setShowUsers(false);
		notifyUserSelect(user);
	};

	return (
		<div className="cart-user">
			<p onClick={() => setShowUsers(true)}>
				{selectedUser
					? `${selectedUser.first_name} ${selectedUser.last_name}`
					: 'Select User'}
			</p>

			{showUsers && (
				<div className="cart-users-container">
					{users.map((user) => (
						<div key={user.id}>
							<p
								onClick={() =>
									selectUser(user)
								}>{`${user.first_name} ${user.last_name}: ${user.email}`}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default CartUser;
