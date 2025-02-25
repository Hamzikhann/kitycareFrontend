// import ReactPixel from 'react-facebook-pixel';
import { useNavigate } from "react-router-dom";
import { logout } from "../Redux/features/userSlice";
import { useAppDispatch } from "../Redux/hooks";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useState } from "react";
// Navigation items configuration
const NAV_ITEMS = [
	{ path: "/login", label: "Login" },
	{ path: "/signup", label: "Signup" },
	{ path: "/priceselection", label: "Price Selection" },
	{ path: "/paymentmethod", label: "Payment Method" },
	{ path: "/paymentdetail", label: "Payment Detail" },
	{ path: "/cat-assistant", label: "Chatroom" },
	{ path: "/cat-profile", label: "Profile" },
	{ path: "/progress", label: "Go to Progress" }
] as const;

/**
 * Dashboard component that displays navigation links and logout functionality
 */
const Dashboard = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [user, setUser] = useState<{ email: string; name: string; photo?: string } | null>(null);

	useEffect(() => {
		const email = localStorage.getItem("email");
		const photo = localStorage.getItem("photo");
		const name = JSON.stringify(localStorage.getItem("name"));

		if (email) {
			setUser({ email: email, name: name, photo: photo || undefined });
		}
		// Track ViewContent when dashboard loads
		// ReactPixel.track('ViewContent');
	}, []);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<Layout>
			<nav className="w-full min-h-[700px] flex flex-col items-center justify-center gap-4">
				{user && (
					<div className="flex flex-col items-center mb-6">
						{user.photo ? (
							<img src={user.photo} alt="Profile" className="w-20 h-20 rounded-full mb-2" />
						) : (
							<div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mb-2">
								<span className="text-gray-600 text-sm">No Image</span>
							</div>
						)}
						<p className="text-lg font-semibold">{user.name}</p>
						<p className="text-lg font-semibold">{user.email}</p>
					</div>
				)}

				{NAV_ITEMS.map(({ path, label }) => (
					<Link key={path} to={path} className="text-xl hover:text-primary transition-colors">
						{label}
					</Link>
				))}

				<button onClick={handleLogout} className="text-xl hover:text-red-500 transition-colors cursor-pointer">
					Logout
				</button>
			</nav>
		</Layout>
	);
};

export default Dashboard;
