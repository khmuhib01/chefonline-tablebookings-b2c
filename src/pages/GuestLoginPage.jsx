import React, {useState, useContext, useEffect} from 'react';
import {postGuestLogin} from '../api';
import {useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import Spinner from '../ui-share/Spinner';
import {setGuestUser, setGuestUserToken} from '../store/reducers/guestUserSlice';
import Popup from '../ui-share/Popup';
import {AuthContextGuest} from '../context/AuthContextGuest';
import PageTitle from '../components/PageTitle';
import ReCAPTCHA from 'react-google-recaptcha';

export default function GuestLoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [loading, setLoading] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [guestUserData, setGuestUserData] = useState(null);
	const [guestUserTokenData, setGuestUserTokenData] = useState(null);
	const [recaptchaToken, setRecaptchaToken] = useState('');
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {login} = useContext(AuthContextGuest);

	const handleRecaptchaChange = (token) => {
		setRecaptchaToken(token);
	};

	const handleOpenPopup = () => {
		setIsPopupOpen(true);
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
	};

	const validateForm = () => {
		let isValid = true;

		if (!email) {
			setEmailError('Email is required.');
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			setEmailError('Email address is invalid.');
			isValid = false;
		} else {
			setEmailError('');
		}

		if (!password) {
			setPasswordError('Password is required.');
			isValid = false;
		} else {
			setPasswordError('');
		}

		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		const data = {email, password};

		try {
			setLoading(true);
			const response = await postGuestLogin(data);

			if (response.status === true) {
				const guestData = response.data;
				const token = response.token;

				setGuestUserData(guestData);
				setGuestUserTokenData(token);

				dispatch(setGuestUser(guestData));
				dispatch(setGuestUserToken(token));

				navigate('/profile');
				login(response);
			} else {
				setErrorMessage('An error occurred. Please try again.');
				handleOpenPopup();
			}
		} catch (error) {
			setLoading(false);
			if (error.response && error.response.data) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage('An error occurred. Please try again.');
			}
			handleOpenPopup();
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			<PageTitle title="Sign in" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">Sign in to your account</h1>
							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="flex flex-col gap-5">
									<div className="bg-white p-8 rounded-lg shadow-lg w-full border">
										<form onSubmit={handleSubmit}>
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
													autoComplete="username"
												/>
												{emailError && <span className="text-red-500 text-xs">{emailError}</span>}
											</div>
											<div className="mb-4">
												<label htmlFor="password" className="block text-gray-700 font-bold mb-2">
													Password <span className="text-red-500">*</span>
												</label>
												<input
													type="password"
													id="password"
													className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
													placeholder="Enter your password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													autoComplete="current-password"
												/>
												{passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
											</div>
											<div className="mb-4">
												<Link to="/forgot-password" className="text-button">
													Forgot Password?
												</Link>
											</div>
											<div className="col-span-2 mb-4">
												<ReCAPTCHA
													sitekey="6LdqgH0qAAAAAH_U11rEQWl73Rm1f3clwQm0RvrT"
													onChange={handleRecaptchaChange}
												/>
												{errors.recaptcha && <p className="text-red-500 text-sm">{errors.recaptcha}</p>}
											</div>

											<div className="text-center mt-4">
												<button
													type="submit"
													className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-2 m-auto"
												>
													Sign in
													{loading ? <Spinner /> : null}
												</button>
											</div>
										</form>
										<div className="">
											<p className="text-center text-gray-500 mt-4">
												Don't have an account?{' '}
												<Link to={'/sign-up'} className="text-button font-bold">
													Sign up
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
			<Popup isOpen={isPopupOpen} onClose={handleClosePopup} title={'Error'} content={errorMessage} />
		</>
	);
}
