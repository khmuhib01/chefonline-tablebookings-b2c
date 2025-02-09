import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import Popup from '../ui-share/Popup';
import {guestContactUs} from '../api';
import Spinner from '../ui-share/Spinner';
import ReCAPTCHA from 'react-google-recaptcha';

export default function BecomeAPartner() {
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
	const [recaptchaToken, setRecaptchaToken] = useState('');
	// const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		city: '',
		postcode: '',
		restaurantName: '',
		message: 'None',
		agreeTerms: false,
		agreeMarketing: false,
	});

	const handleRecaptchaChange = (token) => {
		setRecaptchaToken(token);
	};

	// Handle input change
	const handleChange = (e) => {
		const {name, value, type, checked} = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};

	// Validation
	const validateForm = () => {
		const newErrors = {};
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phonePattern = /^\d{11}$/;

		if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
		if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
		if (!formData.email.trim() || !emailPattern.test(formData.email)) newErrors.email = 'A valid email is required.';
		if (!formData.phone.trim() || !phonePattern.test(formData.phone))
			newErrors.phone = 'Phone number must be exactly 11 digits.';
		if (!formData.restaurantName.trim()) newErrors.restaurantName = 'Restaurant name is required.';
		if (!formData.city.trim()) newErrors.city = 'City is required.';
		if (!formData.postcode.trim()) newErrors.postcode = 'Postcode is required.';
		if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions.';

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submit
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		setErrors({});

		try {
			const data = {
				first_name: formData.firstName,
				last_name: formData.lastName,
				email: formData.email,
				phone: formData.phone,
				city: formData.city,
				post_code: formData.postcode,
				restaurant_name: formData.restaurantName,
				message: formData.message,
				params: 'registration',
			};

			const response = await guestContactUs(data);

			setPopupMessage(response.message || 'Your message has been sent successfully!');
			setIsPopupOpen(true);

			setFormData({
				firstName: '',
				lastName: '',
				email: '',
				phone: '',
				city: '',
				postcode: '',
				restaurantName: '',
				message: 'None',
				agreeTerms: false,
				agreeMarketing: false,
			});
		} catch (error) {
			const apiError = error.response?.data?.message || 'An unexpected error occurred. Please try again later.';
			setErrors({apiError});
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<PageTitle title="Sign Up" description="Home Page Description" />
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
				<div className="flex flex-col gap-5 w-full max-w-[800px] py-10">
					<div className="flex flex-col gap-y-5">
						<h2 className="text-center text-4xl font-bold">Get started</h2>
						<p className="text-center text-bodyText text-xl">
							Join our 15,000+ restaurant partners. Leave your contact details in the form below and we’ll get in touch
							with you soon.
						</p>
					</div>
					<div className="h-[1px] bg-gray-200"></div>
					<div className="">
						<div className="md:col-span-1 col-span-2">
							<h3 className="text-center text-2xl font-bold">Need any help?</h3>
							<Link to="/contact" className="text-blue-500 text-center block text-xl font-bold">
								Contact us
							</Link>
						</div>
					</div>
					{/* <div className="grid grid-cols-2 gap-y-3">
						<div className="md:col-span-1 col-span-2">
							<h3 className="text-center text-xl font-bold">Already a tablebookings partner?</h3>

							<Link
								to="https://restaurant.tablebookings.co.uk/restaurant-sign-in"
								className="text-blue-500 text-center block"
							>
								Log in
							</Link>
						</div>
						<div className="md:col-span-1 col-span-2">
							<h3 className="text-center text-xl font-bold">Need any help?</h3>
							<Link to="/contact" className="text-blue-500 text-center block">
								Contact us
							</Link>
						</div>
					</div>*/}
					<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
						<h2 className="text-2xl font-bold mb-6 text-center">Register Your Business</h2>
						{errors.apiError && <p className="text-red-500 text-center mb-4">{errors.apiError}</p>}
						<form className="w-full flex flex-col gap-y-4" onSubmit={handleSubmit}>
							<div className="grid grid-cols-12 gap-4">
								<div className="md:col-span-6 col-span-12">
									<label className="block text-gray-700">
										First name<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Enter your first name"
									/>
									{errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
								</div>
								<div className="md:col-span-6 col-span-12">
									<label className="block text-gray-700">
										Last name<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Enter your last name"
									/>
									{errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
								</div>
							</div>
							<div className="grid grid-cols-12 gap-4">
								<div className="md:col-span-6 col-span-12">
									<label className="block text-gray-700">
										Email address<span className="text-red-500">*</span>
									</label>
									<input
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Enter your email"
									/>
									{errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
								</div>
								<div className="md:col-span-6 col-span-12">
									<label className="block text-gray-700">
										Phone<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Enter your phone number"
									/>
									{errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
								</div>
							</div>
							<div className="grid grid-cols-12 gap-4">
								<div className="md:col-span-6 col-span-12">
									<label className="block text-gray-700">
										City<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="city"
										value={formData.city}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Enter your city"
									/>
									{errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
								</div>
								<div className="md:col-span-6 col-span-12">
									<label className="block text-gray-700">
										Post Code<span className="text-red-500">*</span>
									</label>
									<input
										type="text"
										name="postcode"
										value={formData.postcode}
										onChange={handleChange}
										className="w-full p-2 border border-gray-300 rounded-lg"
										placeholder="Enter your postal code"
									/>
									{errors.postcode && <p className="text-red-500 text-sm">{errors.postcode}</p>}
								</div>
							</div>

							<div>
								<label className="block text-gray-700">
									Restaurant Name<span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="restaurantName"
									value={formData.restaurantName}
									onChange={handleChange}
									className="w-full p-2 border border-gray-300 rounded-lg"
									placeholder="Enter your restaurant name"
								/>
								{errors.restaurantName && <p className="text-red-500 text-sm">{errors.restaurantName}</p>}
							</div>
							<div>
								<input
									type="checkbox"
									name="agreeTerms"
									checked={formData.agreeTerms}
									onChange={handleChange}
									className="mr-2"
								/>
								<label className="text-gray-700">
									By submitting this form, I agree to TableBookings{' '}
									<Link to="/terms-and-conditions" className="text-blue-500">
										Terms and Conditions
									</Link>{' '}
									and{' '}
									<Link to="/privacy-policy" className="text-blue-500">
										Privacy Policy
									</Link>
									.*
								</label>
							</div>
							<div>
								<input
									type="checkbox"
									name="agreeMarketing"
									checked={formData.agreeMarketing}
									onChange={handleChange}
									className="mr-2"
								/>
								<label className="text-gray-700">
									I agree to receive email newsletters and marketing communication from TableBookings.
								</label>
							</div>

							<div className="col-span-2 mb-4">
								<ReCAPTCHA sitekey="6LdqgH0qAAAAAH_U11rEQWl73Rm1f3clwQm0RvrT" onChange={handleRecaptchaChange} />
								{errors.recaptcha && <p className="text-red-500 text-sm">{errors.recaptcha}</p>}
							</div>
							<button
								type="submit"
								className="w-full bg-button text-white p-2 rounded-lg hover:bg-buttonHover flex justify-center items-center gap-2"
							>
								Submit
								{loading && <Spinner />}
							</button>
						</form>
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
