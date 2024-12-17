import React, {useState, useEffect} from 'react';
import {otpVerify, postForgotPassword} from '../api'; // Ensure APIs for OTP and password reset exist.
import {Link, useNavigate} from 'react-router-dom';
import Spinner from '../ui-share/Spinner';
import Popup from '../ui-share/Popup';
import PageTitle from '../components/PageTitle';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [emailError, setEmailError] = useState('');
	const [otpError, setOtpError] = useState('');
	const [loading, setLoading] = useState(false);
	const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');
	const [otpVerified, setOtpVerified] = useState(false); // Tracks OTP verification status
	const navigate = useNavigate();

	console.log('email', email);

	const handleOpenOtpPopup = () => {
		setIsOtpPopupOpen(true);
	};

	const handleCloseOtpPopup = () => {
		setIsOtpPopupOpen(false);
		setOtpVerified(false); // Reset OTP status when popup closes
	};

	const validateEmail = () => {
		if (!email) {
			setEmailError('Email is required.');
			return false;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			setEmailError('Email address is invalid.');
			return false;
		}
		setEmailError('');
		return true;
	};

	const validateOtp = () => {
		if (!otp) {
			setOtpError('OTP is required.');
			return false;
		} else if (otp.length !== 6) {
			setOtpError('OTP must be 6 digits.');
			return false;
		}
		setOtpError('');
		return true;
	};

	const handleSendOtp = async () => {
		if (!validateEmail()) return;

		try {
			setLoading(true);
			const response = await postForgotPassword(email);

			console.log('Response:', response); // Log the API response

			if (response.status === true) {
				setPopupMessage('OTP has been sent to your email.');
				handleOpenOtpPopup();
			} else {
				setPopupMessage('Failed to send OTP. Please try again.');
			}
		} catch (error) {
			console.error('Error:', error); // Log any potential errors
			setPopupMessage('An error occurred. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();

		if (!validateOtp()) return;

		console.log('otp', otp);

		try {
			setLoading(true);
			const response = await otpVerify(email, otp);

			console.log('Response otpverify:', response); // Log the API response

			if (response.status === true) {
				setOtpVerified(true);
				setPopupMessage('OTP verification successful. Please choose a new password.');
			} else {
				setPopupMessage('Invalid OTP. Please try again.');
			}
		} catch (error) {
			console.error('Error:', error); // Log any potential errors
			setPopupMessage(response.data.message);
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = () => {
		navigate('/reset-password', {state: {email}}); // Redirect to reset password page
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to top on page load
	}, []);

	return (
		<>
			<PageTitle title="Forgot Password" description="Reset your password" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">Forgot your password?</h1>
							<p className="text-center text-gray-500">
								Enter your email address and we will send OTP to verify your account.
							</p>
							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="flex flex-col gap-5">
									<div className="bg-white p-8 rounded-lg shadow-lg w-full border">
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
												onChange={(e) => {
													setEmail(e.target.value);
												}}
											/>

											{emailError && <span className="text-red-500 text-xs">{emailError}</span>}
										</div>

										<div className="text-center mt-4">
											<button
												className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-2 m-auto"
												onClick={handleSendOtp}
											>
												Send OTP
												{loading ? <Spinner /> : null}
											</button>
										</div>

										<div className="mt-4 text-center">
											<Link to="/sign-in" className="text-button">
												Back to Login
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* OTP Input Popup */}
			<Popup
				isOpen={isOtpPopupOpen}
				onClose={handleCloseOtpPopup}
				title={'Enter OTP'}
				content={
					<form onSubmit={handleVerifyOtp} className="">
						<div className="mb-4 text-left">
							{popupMessage && <p className="text-green-500 text-xs mb-2">{popupMessage}</p>}

							{!otpVerified && ( // Show input field only if OTP is not verified
								<>
									<input
										type="text"
										id="otp"
										className="min-w-[300px] px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow block"
										placeholder="Enter 6-digit OTP"
										value={otp}
										onChange={(e) => setOtp(e.target.value)}
										maxLength={6}
									/>
									{otpError && <span className="text-red-500 text-xs">{otpError}</span>}
								</>
							)}
						</div>

						<div className="text-center mt-4">
							{!otpVerified && ( // Hide Verify button if OTP is verified
								<button
									type="submit"
									className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-2 m-auto"
									onClick={handleVerifyOtp}
								>
									Verify OTP
									{loading ? <Spinner /> : null}
								</button>
							)}
						</div>

						{otpVerified && ( // Show Change Password button only if OTP is verified
							<div className="text-center mt-4">
								<button
									className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 m-auto"
									onClick={handleChangePassword}
								>
									Change Password
								</button>
							</div>
						)}
					</form>
				}
			></Popup>
		</>
	);
}
