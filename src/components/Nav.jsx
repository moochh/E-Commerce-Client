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

			<button>
				<Link to="/favorites" className="link">
					Favorites
				</Link>
			</button>

			<button>
				<Link to="/image" className="link">
					Image
				</Link>
			</button>
			{/* 
			<button>
				<Link to="/checkout" className="link">
					Checkout
				</Link>
			</button> */}
		</nav>
	);
};

export default Nav;
