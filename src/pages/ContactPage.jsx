import React, {useEffect, useState, useRef} from 'react';
import {Link} from 'react-router-dom';
import Spinner from '../ui-share/Spinner';
import PageTitle from '../components/PageTitle';
import ReCAPTCHA from 'react-google-recaptcha';
import {guestContactUs} from '../api';
import Popup from '../ui-share/Popup';

export default function ContactPage() {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		restaurantName: '',
		postcode: '',
		phoneNumber: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [recaptchaToken, setRecaptchaToken] = useState('');
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');

	// Ref for reCAPTCHA
	const recaptchaRef = useRef();

	// prevent page reload and disable right-click
	/* 	useEffect(() => {
		window.scrollTo(0, 0);
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
	}, []); */

	const handleChange = (e) => {
		const {name, value} = e.target;
		setFormData({...formData, [name]: value});
	};

	const validateForm = () => {
		const newErrors = {};
		const namePattern = /^[A-Za-z]+$/;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phonePattern = /^\d{11}$/;
		const maxMessageLength = 5000;

		if (!formData.firstName) {
			newErrors.firstName = 'First Name is required.';
		} else if (!namePattern.test(formData.firstName)) {
			newErrors.firstName = 'First Name should contain only letters.';
		}

		if (!formData.lastName) {
			newErrors.lastName = 'Last Name is required.';
		} else if (!namePattern.test(formData.lastName)) {
			newErrors.lastName = 'Last Name should contain only letters.';
		}

		if (!formData.email) {
			newErrors.email = 'Email is required.';
		} else if (!emailPattern.test(formData.email)) {
			newErrors.email = 'Please enter a valid email address.';
		}

		if (!formData.phoneNumber) {
			newErrors.phoneNumber = 'Phone Number is required.';
		} else if (!phonePattern.test(formData.phoneNumber)) {
			newErrors.phoneNumber = 'Phone Number must be exactly 11 digits.';
		}

		if (!formData.restaurantName) {
			newErrors.restaurantName = 'Restaurant Name is required.';
		}

		if (!recaptchaToken) {
			newErrors.recaptcha = 'Please complete the CAPTCHA verification.';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});
		const formErrors = validateForm();

		if (!formErrors) return;

		setLoading(true);
		try {
			const data = {
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				restaurant_name: formData.restaurantName,
				post_code: formData.postcode,
				phone: formData.phoneNumber,
				message: formData.message,
				params: 'contact_us',
			};

			console.log('data', data);

			const response = await guestContactUs(data);

			setPopupMessage(response.message || 'Your message has been sent successfully!');
			setIsPopupOpen(true);

			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				restaurantName: '',
				postcode: '',
				phoneNumber: '',
				message: '',
			});
			setRecaptchaToken('');
			recaptchaRef.current.reset();
		} catch (error) {
			const apiError = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
			setErrors({apiError});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<PageTitle title="Contact Us" description="Get in touch with us" />

			<div className="bg-[#F7F8FA] py-10">
				<div className="container mx-auto px-4">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">We'd love to hear from you</h1>
							<div className="max-w-[800px] mx-auto rounded-md w-full">
								<div className="bg-white p-8 rounded-lg shadow-lg w-full border">
									<form onSubmit={handleSubmit} className="md:grid md:grid-cols-2 grid-cols-1 gap-4">
										<div className="mb-4">
											<label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
												First Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="firstName"
												name="firstName"
												className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow ${
													errors.firstName ? 'border-red-500' : ''
												}`}
												placeholder="e.g. John"
												value={formData.firstName}
												onChange={handleChange}
											/>
											{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
										</div>

										<div className="mb-4">
											<label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
												Last Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="lastName"
												name="lastName"
												className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow ${
													errors.lastName ? 'border-red-500' : ''
												}`}
												placeholder="e.g. Doe"
												value={formData.lastName}
												onChange={handleChange}
											/>
											{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
										</div>

										<div className="mb-4">
											<label htmlFor="email" className="block text-gray-700 font-bold mb-2">
												Email <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												id="email"
												name="email"
												className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow ${
													errors.email ? 'border-red-500' : ''
												}`}
												placeholder="e.g. john.doe@example.com"
												value={formData.email}
												onChange={handleChange}
											/>
											{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
										</div>

										<div className="mb-4">
											<label htmlFor="restaurantName" className="block text-gray-700 font-bold mb-2">
												Restaurant Name <span className="text-red-500">*</span>
											</label>
											<input
												type="text"
												id="restaurantName"
												name="restaurantName"
												className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow ${
													errors.restaurantName ? 'border-red-500' : ''
												}`}
												placeholder="e.g. John's Grill"
												value={formData.restaurantName}
												onChange={handleChange}
											/>
											{errors.restaurantName && <p className="text-red-500 text-sm">{errors.restaurantName}</p>}
										</div>

										<div className="mb-4">
											<label htmlFor="postcode" className="block text-gray-700 font-bold mb-2">
												Postcode
											</label>
											<input
												type="text"
												id="postcode"
												name="postcode"
												className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
												placeholder="e.g. 12345"
												value={formData.postcode}
												onChange={handleChange}
											/>
										</div>

										<div className="mb-4">
											<label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-2">
												Phone Number <span className="text-red-500">*</span>
											</label>
											<input
												type="tel"
												id="phoneNumber"
												name="phoneNumber"
												className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow ${
													errors.phoneNumber ? 'border-red-500' : ''
												}`}
												placeholder="e.g. 1234567890"
												value={formData.phoneNumber}
												onChange={handleChange}
											/>
											{errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
										</div>

										<div className="mb-4 col-span-2">
											<label htmlFor="message" className="block text-gray-700 font-bold mb-2">
												Message <span className="text-red-500">*</span>
											</label>
											<textarea
												id="message"
												name="message"
												className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow ${
													errors.message ? 'border-red-500' : ''
												}`}
												placeholder="Write your message here..."
												value={formData.message}
												onChange={handleChange}
												rows="5"
												maxLength={500} // Set maximum character limit
											></textarea>
											{errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
										</div>

										<div className="col-span-2 mb-4">
											<ReCAPTCHA
												ref={recaptchaRef}
												sitekey="6LdqgH0qAAAAAH_U11rEQWl73Rm1f3clwQm0RvrT"
												onChange={setRecaptchaToken}
											/>
											{errors.recaptcha && <p className="text-red-500 text-sm">{errors.recaptcha}</p>}
										</div>

										<div className="text-center mt-4 col-span-2">
											<button
												type="submit"
												className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-x-2 m-auto"
												disabled={loading}
											>
												Submit
												{loading && <Spinner />}
											</button>
										</div>

										<div className="col-span-2">
											<p className="text-center text-gray-500 mt-4">
												Looking for help?{' '}
												<Link to="/faq" className="text-button font-bold">
													Visit our FAQ
												</Link>
											</p>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">For more information</h1>
							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="container mx-auto px-4" style={{userSelect: 'none'}}>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
										{/* Customer Support */}
										<div className="bg-white p-6 rounded-lg shadow-lg border">
											<h2 className="text-xl font-bold mb-4">Customer Support</h2>
											<p>T: 0330 380 1000</p>
											<p>support@tablebookings.co.uk</p>
											<p>Mon - Fri: 9:30 am - 11:00 pm</p>
											<p>Sat: 10:00 am - 11:00 pm</p>
											<p>Sun: 2:00 pm - 11:00 pm</p>
										</div>

										{/* Sales and Marketing */}
										<div className="bg-white p-6 rounded-lg shadow-lg border">
											<h2 className="text-xl font-bold mb-4">Sales and Marketing</h2>
											<p>T: 0203 598 5956</p>
											<p>hello@tablebookings.co.uk</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Popup
				isOpen={isPopupOpen}
				title="Submission Successful"
				content={<p>{popupMessage}</p>}
				onClose={() => setIsPopupOpen(false)}
			/>
		</>
	);
}
