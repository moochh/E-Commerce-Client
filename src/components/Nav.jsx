import { Link } from 'react-router-dom';

const Nav = () => {
	return (
		<nav>
			<button>
				<Link to="/" className="link">
					Products
				</Link>
			</button>

			<button>
				<Link to="/cart" className="link">
					Cart
				</Link>
			</button>
		</nav>
	);
};

export default Nav;