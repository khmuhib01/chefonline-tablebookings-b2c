import React, {useState, useContext, useRef, useEffect} from 'react';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import SearchComponent from '../components/frontend/SearchComponent';
import {logoImage} from '../ui-share/Image';
import {Restaurant, Profile, SignIn, SignUp, VerticalMenu, Menu, Partner} from '../ui-share/Icon';
import {AuthContextGuest} from '../context/AuthContextGuest';

export default function Header() {
	const [showProfileMenu, setShowProfileMenu] = useState(false);
	const [showMobileMenu, setShowMobileMenu] = useState(false);

	const path = useLocation();
	const navigate = useNavigate();

	const {isAuthenticated, logout} = useContext(AuthContextGuest);

	const profileMenuRef = useRef(null);
	const mobileMenuRef = useRef(null);

	const handleNavbarToggle = () => {
		setShowMobileMenu(!showMobileMenu);
	};

	const handleSignOut = () => {
		logout();
		navigate('/');
	};

	const handleProfileMenuToggle = () => {
		setShowProfileMenu(!showProfileMenu);
	};

	const closeMobileMenu = () => {
		setShowMobileMenu(false);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
				setShowProfileMenu(false);
			}
			if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
				setShowMobileMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className="flex flex-col bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-50">
			<div className="container py-5 px-5">
				<div className="flex justify-between items-center md:gap-x-5 gap-y-5">
					<div className="flex-shrink-0">
						<Link to="/">
							<img className="h-10" src={logoImage} alt="logo" />
						</Link>
					</div>
					<div className="flex-grow">
						<div className="flex xl:justify-between justify-end items-center">
							<div className="xl:block hidden">{path.pathname !== '/' && <SearchComponent />}</div>
							<div className="">
								<ul className="flex justify-between items-center gap-x-2">
									{isAuthenticated ? (
										<div className="relative" ref={profileMenuRef}>
											<Profile
												className="text-[40px] text-button hover:to-buttonHover hover:cursor-pointer block"
												onClick={handleProfileMenuToggle}
											/>
											{showProfileMenu && (
												<div className="absolute top-15 right-0 bg-white min-w-[200px] rounded-md shadow px-3 py-2">
													<ul>
														<NavLink to="/profile" onClick={() => setShowProfileMenu(false)}>
															<li className="hover:bg-gray-100 px-2 py-1 rounded">Profile</li>
														</NavLink>
														<NavLink to="/" onClick={handleSignOut}>
															<li className="hover:bg-gray-100 px-2 py-1 rounded">Sign out</li>
														</NavLink>
														{/* <NavLink to="/dashboard" className="items-center gap-2 md:hidden flex">
															<Restaurant size={25} />
															For restaurants
														</NavLink> */}
													</ul>
												</div>
											)}
										</div>
									) : (
										<div className="relative" ref={mobileMenuRef}>
											<Menu
												size={25}
												className="custom-cursor text-button font-bold md:hidden block"
												onClick={handleNavbarToggle}
											/>
											{showMobileMenu && (
												<div className="absolute top-15 right-0 bg-white min-w-[200px] rounded-md shadow px-3 py-2 md:hidden block">
													<ul>
														<NavLink
															to="/sign-in"
															className="flex items-center gap-2 text-button"
															onClick={closeMobileMenu}
														>
															<SignIn size={25} />
															<li className="px-2 py-1 rounded text-black">Sign in</li>
														</NavLink>
														<NavLink
															to="/sign-up"
															className="flex items-center gap-2 text-button"
															onClick={closeMobileMenu}
														>
															<SignUp size={25} />
															<li className="px-2 py-1 rounded text-black">Sign up</li>
														</NavLink>
														{/* <NavLink to="/dashboard" className="flex items-center gap-2 text-button">
															<Restaurant size={25} />
															<li className="px-2 py-1 rounded text-black">For restaurants</li>
														</NavLink> */}
													</ul>
												</div>
											)}
											<div className="md:flex hidden items-center gap-x-2">
												<li className="font-bold text-[16px] text-button hover:text-buttonHover">
													<NavLink to="/sign-in" className="flex items-center gap-2">
														<SignIn size={25} />
														Sign in
													</NavLink>
												</li>
												<li className="font-bold text-[16px] text-button hover:text-buttonHover">
													<NavLink to="/sign-up" className="flex items-center gap-2">
														<SignUp size={25} />
														Sign up
													</NavLink>
												</li>
											</div>
										</div>
									)}
									<NavLink
										to="become-a-partner"
										className="flex items-center text-button space-x-2"
										onClick={closeMobileMenu}
									>
										<Partner size={25} />
										<li className="rounded font-bold text-sm md:text-base">Become a partner</li>
									</NavLink>
									<NavLink
										to="https://restaurant.tablebookings.co.uk/"
										className="flex items-center text-button space-x-2"
										onClick={closeMobileMenu}
										target="_blank"
									>
										<Restaurant size={25} />
										<li className="rounded font-bold text-sm md:text-base">For restaurants</li>
									</NavLink>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
