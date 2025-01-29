import React, {useEffect, useState} from 'react';
import {Mobile} from '../ui-share/Icon';
import {postGuestRegister} from '../api';
import {useDispatch} from 'react-redux';
import {setGuestUser} from '../store/reducers/guestUserSlice';
import {Link, useNavigate} from 'react-router-dom';
import Spinner from '../ui-share/Spinner';
import PageTitle from '../components/PageTitle';
import ReCAPTCHA from 'react-google-recaptcha';

export default function GuestRegisterPage() {
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [recaptchaToken, setRecaptchaToken] = useState('');
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Validation function
	const validateForm = () => {
		const newErrors = {};
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!firstName) newErrors.firstName = 'First name is required.';
		if (!lastName) newErrors.lastName = 'Last name is required.';
		if (!email || !emailPattern.test(email)) newErrors.email = 'A valid email is required.';
		if (!password) newErrors.password = 'Password is required.';
		if (!mobile) {
			newErrors.mobile = 'Phone number is required.';
		} else if (mobile.length !== 11 || !/^\d+$/.test(mobile)) {
			newErrors.mobile = 'Phone number must be exactly 11 digits and contain only numbers.';
		}
		if (!recaptchaToken) newErrors.recaptcha = 'Please complete the CAPTCHA verification.';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Update your handleSubmit function with basic sanitization for client-side (but rely on backend sanitization and validation)
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		// Sanitize inputs by trimming whitespace and removing potentially dangerous characters
		const sanitizedData = {
			first_name: firstName.trim(),
			last_name: lastName.trim(),
			phone: mobile.replace(/[^\d]/g, ''), // Remove any non-numeric characters
			email: email.trim(),
			password: password.trim(),
			params: 'create',
		};

		setLoading(true);
		try {
			const response = await postGuestRegister(sanitizedData);
			dispatch(setGuestUser(response));
			localStorage.setItem('registrationStatus', 'completed');
			navigate('/registration-success');
		} catch (error) {
			console.error('Registration failed:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleRecaptchaChange = (token) => {
		setRecaptchaToken(token);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		// Disable right-click
		document.addEventListener('contextmenu', (e) => e.preventDefault());

		// Disable keyboard shortcuts
		const disableShortcuts = (e) => {
			if (
				e.key === 'F12' ||
				(e.ctrlKey && e.shiftKey && e.key === 'I') ||
				(e.ctrlKey && e.shiftKey && e.key === 'C') ||
				(e.ctrlKey && e.key === 'U')
			) {
				e.preventDefault();
				e.stopPropagation();
			}
		};
		document.addEventListener('keydown', disableShortcuts);

		// Detect developer tools
		const detectDevTools = () => {
			const threshold = 160;
			const widthThreshold = window.outerWidth - window.innerWidth > threshold;
			const heightThreshold = window.outerHeight - window.innerHeight > threshold;
			if (widthThreshold || heightThreshold) {
				alert('Developer tools are disabled on this page.');
				window.location.reload(); // Optionally reload or redirect the page
			}
		};
		const intervalId = setInterval(detectDevTools, 1000);

		// Cleanup on unmount
		return () => {
			document.removeEventListener('contextmenu', (e) => e.preventDefault());
			document.removeEventListener('keydown', disableShortcuts);
			clearInterval(intervalId);
		};
	}, []);

	return (
		<>
			<PageTitle title="Sign up" description="Home Page Description" />

			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">Complete your registration</h1>
							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="flex flex-col gap-5">
									<div className="bg-white p-8 rounded-lg shadow-lg w-full border">
										<div className="mb-4 flex space-x-4">
											<div className="w-1/2">
												<label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
													First name <span className="text-red-500">*</span>
												</label>
												<input
													type="text"
													id="firstName"
													className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
													placeholder="eg. John"
													value={firstName}
													onChange={(e) => setFirstName(e.target.value)}
												/>
												{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
											</div>
											<div className="w-1/2">
												<label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
													Last name <span className="text-red-500">*</span>
												</label>
												<input
													type="text"
													id="lastName"
													className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
													placeholder="eg. Smith"
													value={lastName}
													onChange={(e) => setLastName(e.target.value)}
												/>
												{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
											</div>
										</div>
										<div className="mb-4">
											<label htmlFor="email" className="block text-gray-700 font-bold mb-2">
												Email address <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												id="email"
												className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
												placeholder="eg. user@example.com"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
										</div>
										<div className="mb-4">
											<label htmlFor="password" className="block text-gray-700 font-bold mb-2">
												Password <span className="text-red-500">*</span>
											</label>
											<div className="relative">
												<input
													type={showPassword ? 'text' : 'password'}
													id="password"
													className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
													placeholder="Enter your password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
												/>
												<button
													type="button"
													className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600 hover:text-gray-900 focus:outline-none"
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? 'Hide' : 'Show'}
												</button>
												{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
											</div>
										</div>
										<div className="mb-4">
											<label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-2">
												Phone number <span className="text-red-500">*</span>
											</label>
											<div className="flex">
												<div className="flex items-center bg-gray-200 px-3 rounded-l-lg border border-r-0">
													<span role="img" aria-label="flag">
														<Mobile />
													</span>
													<span className="ml-2">+44</span>
												</div>
												<input
													type="tel"
													id="phoneNumber"
													className="w-full px-3 py-2 border rounded-r-lg border-gray-300 focus:outline-none focus:shadow"
													placeholder="eg. 0123456789"
													value={mobile}
													onChange={(e) => setMobile(e.target.value)}
												/>
											</div>
											{errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
										</div>
										<div className="col-span-2 mb-4">
											<ReCAPTCHA sitekey="6LdqgH0qAAAAAH_U11rEQWl73Rm1f3clwQm0RvrT" onChange={handleRecaptchaChange} />
											{errors.recaptcha && <p className="text-red-500 text-sm">{errors.recaptcha}</p>}
										</div>
										<div className="text-center mt-4">
											<button
												type="submit"
												className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-x-2 m-auto"
												onClick={handleSubmit}
												disabled={loading}
											>
												Submit
												{loading && <Spinner />}
											</button>
										</div>
										<div className="text-center mt-4">
											<p className="text-gray-500">
												Already have an account?{' '}
												<Link to="/sign-in" className="text-button font-bold">
													Sign in
												</Link>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
