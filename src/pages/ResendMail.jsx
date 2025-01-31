import React, {useState, useEffect} from 'react';
import {postResendEmail} from '../api'; // Ensure API exists for resending email
import {Link} from 'react-router-dom';
import Spinner from '../ui-share/Spinner';
import Popup from '../ui-share/Popup';
import PageTitle from '../components/PageTitle';
import {useLocation} from 'react-router-dom';

export default function ResendMail() {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [loading, setLoading] = useState(false);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [popupMessage, setPopupMessage] = useState('');

	const location = useLocation();
	const emailFromState = location.state?.email || '';

	const handleOpenPopup = () => setIsPopupOpen(true);
	const handleClosePopup = () => setIsPopupOpen(false);

	const validateEmail = () => {
		if (!email) {
			setEmailError('Email is required.');
			return false;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			setEmailError('Invalid email format.');
			return false;
		}
		setEmailError('');
		return true;
	};

	const handleSendEmail = async () => {
		if (!validateEmail()) return;

		try {
			setLoading(true);
			const response = await postResendEmail(email);

			console.log('response', response);

			if (response.status === true) {
				setPopupMessage(response.message);
				handleOpenPopup();
			} else {
				setPopupMessage(response.message);
				handleOpenPopup();
			}
		} catch (error) {
			console.error('Error:', error);
			setPopupMessage('An error occurred. Try again.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		setEmail(emailFromState);
	}, []);

	return (
		<>
			<PageTitle title="Resend Verification Email" description="Get a new verification email" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">Resend Verification Email</h1>
							<p className="text-center text-gray-500">Enter your email address to receive a new verification link.</p>

							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="flex flex-col gap-5">
									<div className="bg-white p-8 rounded-lg shadow-lg w-full border">
										<div className="mb-4">
											<label htmlFor="email" className="block text-gray-700 font-bold mb-2">
												Email Address <span className="text-red-500">*</span>
											</label>
											<input
												type="email"
												id="email"
												className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
												placeholder="eg. user@example.com"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
											{emailError && <span className="text-red-500 text-xs">{emailError}</span>}
										</div>

										<div className="text-center mt-4">
											<button
												className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded flex items-center gap-2 m-auto"
												onClick={handleSendEmail}
											>
												Resend Email
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

			{/* Confirmation Popup */}
			<Popup
				isOpen={isPopupOpen}
				onClose={handleClosePopup}
				title="Email Sent"
				content={
					<div className="text-center">
						<p className="">{popupMessage}</p>
						<div className="mt-4">
							<button
								className="bg-button hover:bg-buttonHover text-white font-bold py-2 px-4 rounded"
								onClick={handleClosePopup}
							>
								OK
							</button>
						</div>
					</div>
				}
			/>
		</>
	);
}
