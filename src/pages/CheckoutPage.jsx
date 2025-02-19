import React, {useContext, useEffect, useState} from 'react';
import {People, Calendar, Time, Mobile, Timer} from '../ui-share/Icon';
import ReservationComponent from '../components/frontend/ReservationComponent';
import {redirect, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
	setReservation_message,
	setUserID,
	setUserName,
	setUserEmail,
	clearCurrentReservation,
} from '../store/reducers/reservationSlice';
import {postGuestRegister, getGuestReservation, getRemoveReservation} from '../api';
import {formatTime} from '../utils/conversions';
import Popup from '../ui-share/Popup';
import {AuthContextGuest} from '../context/AuthContextGuest';
import PageTitle from '../components/PageTitle';
import Spinner from '../ui-share/Spinner';

export default function CheckoutPage() {
	const [email, setEmail] = useState('');
	const [userPhone, setUserPhone] = useState('');
	const [userFirstName, setUserFirstName] = useState('');
	const [userLastName, setUserLastName] = useState('');
	const [userSpecialRequest, setUserSpecialRequest] = useState('');
	const [userPromoCode, setUserPromoCode] = useState('');
	const [reservationComplete, setReservationComplete] = useState(false);
	const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
	const [timeLeftPopup, setTimeLeftPopup] = useState(300);
	const [isReservationEdit, setIsReservationEdit] = useState(false);

	const [getGuestReservationState, setGuestReservationState] = useState('');

	const [firstNameError, setFirstNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');

	const [loading, setLoading] = useState(false);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isTimerPaused, setIsTimerPaused] = useState(false);

	const [errorMessage, setErrorMessage] = useState('');
	const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);

	const {isAuthenticated} = useContext(AuthContextGuest);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const storeReservationUUId = useSelector((state) => state.reservations.currentReservation.reservation_uuid);
	const storeResId = useSelector((state) => state.reservations.currentReservation.res_id);
	const storeRestaurantName = useSelector((state) => state.reservations.currentReservation.rest_name);
	const storeStartTime = useSelector((state) => state.reservations.currentReservation.start_time);
	const storeEndTime = useSelector((state) => state.reservations.currentReservation.end_time);
	const storeDate = useSelector((state) => state.reservations.currentReservation.date);
	const storeDay = useSelector((state) => state.reservations.currentReservation.day);
	const storePerson = useSelector((state) => state.reservations.currentReservation.person);
	const storeReservationMessage = useSelector((state) => state.reservations.currentReservation.reservation_message);

	const storeReservation = useSelector((state) => state.reservations.currentReservation);
	const storeUser = useSelector((state) => state.guestUser);

	const handleReservationEdit = () => {
		setIsReservationEdit(!isReservationEdit);
	};

	const handleOpenPopup = () => {
		setIsPopupOpen(true);
	};

	const handleOpenErrorPopup = () => {
		setIsErrorPopupOpen(true);
	};

	const handleActivate = () => {
		removeReservation(storeReservationUUId);
		setIsErrorPopupOpen(false);
		navigate('/sign-in');
	};

	const handleReservationSubmit = async () => {
		let isValid = true;

		// Start loader
		setLoading(true);

		// Form validation
		if (!isAuthenticated) {
			if (!userFirstName) {
				setFirstNameError('First name is required.');
				isValid = false;
			} else {
				setFirstNameError('');
			}

			if (!userLastName) {
				setLastNameError('Last name is required.');
				isValid = false;
			} else {
				setLastNameError('');
			}

			if (!userPhone) {
				setPhoneError('Phone number is required.');
				isValid = false;
			} else if (!/^\d{11}$/.test(userPhone)) {
				setPhoneError('Phone number must be 11 digits.');
				isValid = false;
			} else {
				setPhoneError('');
			}

			if (!email) {
				setEmailError('Email is required.');
				isValid = false;
			} else if (!/\S+@\S+\.\S+/.test(email)) {
				setEmailError('Email address is invalid.');
				isValid = false;
			} else {
				setEmailError('');
			}

			if (!isValid) {
				setLoading(false); // Stop loader if validation fails
				return;
			}
		}

		try {
			if (isAuthenticated) {
				await makeReservation(storeUser.guestUser.id);
			} else {
				const guestData = {
					first_name: userFirstName,
					last_name: userLastName,
					phone: userPhone,
					email: email,
					params: 'create',
					register_type: 'reservation',
				};

				const responsePostGuestRegister = await postGuestRegister(guestData);
				setGuestReservationState(responsePostGuestRegister);

				if (responsePostGuestRegister.status === false && responsePostGuestRegister?.data?.status === 'inactive') {
					setErrorMessage(responsePostGuestRegister.message);
					handleOpenErrorPopup();
					return;
				} else if (responsePostGuestRegister.status === false && responsePostGuestRegister?.data?.status === 'active') {
					setErrorMessage(responsePostGuestRegister.message);
					handleOpenErrorPopup();
					return;
				}

				if (responsePostGuestRegister.status === false) {
					setErrorMessage('An error occurred. Please try again.');
					handleOpenErrorPopup();
					return;
				}

				const guestId = responsePostGuestRegister.data.id;
				const guestName = `${responsePostGuestRegister.data.first_name} ${responsePostGuestRegister.data.last_name}`;
				const guestEmail = responsePostGuestRegister.data.email;

				// Clear form fields
				setEmail('');
				setUserFirstName('');
				setUserLastName('');
				setUserPhone('');
				setUserSpecialRequest('');
				setUserPromoCode('');

				// Update Redux state
				dispatch(setUserID(guestId));
				dispatch(setUserName(guestName));
				dispatch(setUserEmail(guestEmail));

				await makeReservation(guestId);
			}
		} catch (error) {
			console.error('Error during reservation submission:', error);
		} finally {
			setLoading(false); // Stop loader after async operations
		}
	};

	const makeReservation = async (guestId) => {
		console.log('userSpecialRequest', userSpecialRequest);
		// return;
		try {
			const responseGetReservation = await getGuestReservation(
				storeReservationUUId,
				guestId,
				'pending',
				storeResId,
				storeStartTime,
				storeEndTime,
				storeDate,
				storeDay,
				storePerson,
				userSpecialRequest
			);
			dispatch(setReservation_message(responseGetReservation.message));
			setReservationComplete(true);
			localStorage.setItem('reservationComplete', 'completed');
		} catch (error) {
			console.error('Error making reservation:', error);
		}
	};

	useEffect(() => {
		if (reservationComplete) {
			navigate('/thank-you');
		}
	}, [reservationComplete, navigate]);

	const handleRegister = () => {
		navigate('/sign-up');
	};

	useEffect(() => {
		const timer = setInterval(() => {
			if (!isTimerPaused) {
				// Only decrement time if the timer is not paused
				setTimeLeft((prevTime) => {
					if (prevTime <= 1) {
						clearInterval(timer);
						setIsErrorPopupOpen(false);
						setIsPopupOpen(true);
						setIsTimerPaused(true); // Pause the timer
						return 0;
					}
					return prevTime - 1; // Decrement time
				});
			}
		}, 1000);

		return () => clearInterval(timer); // Cleanup timer on component unmount
	}, [isTimerPaused, storeReservationUUId]);

	const handleNewReservation = () => {
		removeReservation(storeReservationUUId);
		navigate(`/restaurant-details/${storeResId}`);
	};

	const handleContinueReservation = () => {
		setTimeLeft(300); // Restart the timer
		setIsTimerPaused(false); // Unpause the timer
		setIsPopupOpen(false); // Close the popup
	};

	// Prevent browser tab close and reload
	const removeReservation = async (uuid) => {
		try {
			const responseRemovedReservation = await getRemoveReservation(uuid);
			// navigate(`/restaurant-details/${storeResId}`);
		} catch (error) {
			console.error('Error removing reservation:', error);
		}
	};

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (storeReservationUUId != null) {
				// Attempt to remove the reservation; async completion is not guaranteed
				removeReservation(storeReservationUUId);
			}
			dispatch(clearCurrentReservation());

			// Message for modern browsers; may not be displayed
			const message = 'If you leave, your reservation will be canceled. Are you sure?';
			event.returnValue = message; // Standard way to set the message
			return message; // For some browsers
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		// Clean up event listener on component unmount
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [storeReservationUUId, dispatch]);

	// For Timer time formatter
	const formatTimer = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	const handleResendEmail = () => {
		navigate('/resend-mail', {state: {email}});
	};

	const handleLoginButton = () => {
		removeReservation(storeReservationUUId);
		navigate('/sign-in');
	};

	// Handle the reservation popup timer
	useEffect(() => {
		let timer;
		if (isPopupOpen) {
			timer = setInterval(() => {
				setTimeLeftPopup((prevTime) => {
					if (prevTime <= 1) {
						clearInterval(timer);
						setIsPopupOpen(false);
						removeReservation(storeReservationUUId);
						return 0;
					}
					return prevTime - 1;
				});
			}, 1000);
		}

		return () => clearInterval(timer);
	}, [isPopupOpen]);

	return (
		<>
			<PageTitle title="Checkout | Table Bookings" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">{storeReservationMessage}</h1>

							<div
								className={`flex items-center justify-between max-w-[600px] mx-auto rounded w-full py-3 px-2 ${
									timeLeft < 120 ? 'bg-red-200' : 'bg-green-200'
								}`}
							>
								<div className={`text-${timeLeft < 120 ? 'red' : 'green'}-600 flex items-center gap-2`}>
									<Timer size={20} />
									<p>Hurry! Your table will only be available for the next...</p>
								</div>
								<div className={`text-${timeLeft < 120 ? 'red' : 'green'}-600 font-bold text-xl`}>
									{formatTimer(timeLeft)}
								</div>
							</div>

							<div className="bg-white max-w-[600px] mx-auto rounded-lg shadow-lg w-full border">
								<div className="flex flex-col">
									<div className="flex justify-between items-center py-2 px-4 gap-x-3">
										<h1 className="text-lg text-titleText font-bold">{storeRestaurantName}</h1>
										<span className="text-button font-bold cursor-pointer" onClick={handleReservationEdit}>
											{isReservationEdit ? 'Cancel' : 'Edit'}
										</span>
									</div>
									{isReservationEdit ? (
										<div className="py-2 px-2">
											<ReservationComponent />
										</div>
									) : null}
									<div className="grid grid-cols-3 border-t">
										<div className="flex sm:flex flex-col justify-center items-center py-4">
											<People size={22} className="text-bodyText" />
											<span className="text-bodyText">{storePerson} people</span>
										</div>
										<div className="flex sm:flex flex-col justify-center items-center border-x py-4">
											<Calendar size={22} className="text-bodyText" />
											<span className="text-bodyText">{storeDate}</span>
											<span className="text-bodyText">(dd/mm/yyyy)</span>
										</div>
										<div className="flex sm:flex flex-col justify-center items-center py-4">
											<Time size={22} className="text-bodyText" />
											<span className="text-bodyText sm:block hidden">
												{storeStartTime ? formatTime(storeStartTime) : '00.00'} -{' '}
												{storeEndTime ? formatTime(storeEndTime) : '00.00'}
											</span>
											<span className="text-bodyText">30 min</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">Complete your reservation</h1>
							<div className="max-w-[600px] mx-auto rounded-md w-full">
								<div className="flex flex-col gap-5">
									{!isAuthenticated && (
										<div className="bg-white md:p-8 px-3 py-4 rounded-lg shadow-lg w-full border">
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
														value={userFirstName}
														onChange={(e) => setUserFirstName(e.target.value)}
														required
													/>
													<span className="text-red-500 text-xs">{firstNameError}</span>
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
														value={userLastName}
														onChange={(e) => setUserLastName(e.target.value)}
														required
													/>
													<span className="text-red-500 text-xs">{lastNameError}</span>
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
													placeholder="eg. mailto:user@example.com"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													required
												/>
												<span className="text-red-500 text-xs">{emailError}</span>
											</div>
											<div className="mb-4">
												<label htmlFor="phoneNumber" className="block text-gray-700 font-bold mb-2">
													Phone number <span className="text-red-500">*</span>
												</label>
												<input
													type="tel"
													id="phoneNumber"
													className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
													placeholder="eg. 0123456789"
													value={userPhone}
													onChange={(e) => setUserPhone(e.target.value)}
													required
												/>
												<span className="text-red-500 text-xs">{phoneError}</span>
											</div>
											<div className="text-center mt-4">
												<p className="text-bodyText hover:underline cursor-pointer" onClick={handleRegister}>
													or use an account
												</p>
											</div>
										</div>
									)}

									<div className="bg-white md:p-8 px-3 py-4 rounded-lg shadow-lg w-full border">
										<h3 className="text-center text-gray-700 font-bold mb-6">Optional</h3>
										<div className="mb-4">
											<label htmlFor="specialRequest" className="block text-gray-700 font-bold mb-2">
												Special request?
											</label>
											<textarea
												type="text"
												id="specialRequest"
												placeholder="E.g. table preference, space for a stroller..."
												className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
												value={userSpecialRequest}
												onChange={(e) => setUserSpecialRequest(e.target.value)}
											/>
										</div>
										{/* <div className="mb-4">
											<label htmlFor="promoCode" className="block text-gray-700 font-bold mb-2">
												Promo code
											</label>
											<input
												type="text"
												id="promoCode"
												className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
												value={userPromoCode}
												onChange={(e) => setUserPromoCode(e.target.value)}
											/>
										</div> */}
										<div className="text-center mt-6">
											<button
												type="submit"
												className="w-full bg-button text-white py-2 rounded-lg hover:bg-buttonHover flex justify-center items-center gap-2"
												onClick={handleReservationSubmit}
											>
												Reserve now {loading && <Spinner />}
											</button>
										</div>
										<div className="text-center mt-4 text-gray-600">
											By making a reservation, you confirm that you have read and accepted the{' '}
											<a href="#" className="text-blue-600 underline">
												terms of use
											</a>{' '}
											and the{' '}
											<a href="#" className="text-blue-600 underline">
												privacy policy
											</a>{' '}
											of the website.
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
				title="Reservation Alert"
				content={
					<div>
						<h1 className="text-center mb-5">
							Your reservation time is over. Would you like to continue your reservation or make a new one?
						</h1>
						<div className="flex justify-center items-center gap-3">
							<button
								onClick={handleContinueReservation}
								className="bg-button text-white py-2 rounded-lg hover:bg-buttonHover block px-2"
							>
								Continue Reservation
							</button>
							<button
								onClick={handleNewReservation}
								className="bg-button text-white py-2 rounded-lg hover:bg-buttonHover block px-2"
							>
								Make New Reservation
							</button>
						</div>
						{/* Show the countdown timer in the popup */}
						<div className="text-center mt-4 font-bold text-red-500">Time Left: {formatTimer(timeLeftPopup)}</div>
					</div>
				}
			/>

			<Popup
				isOpen={isErrorPopupOpen}
				title="Alert"
				content={
					<div className="flex flex-col justify-center items-center">
						<h1 className="mb-5">{errorMessage}</h1>

						<div className="flex justify-center gap-3">
							<button
								className="bg-button text-white py-2 rounded-lg hover:bg-buttonHover block px-2 w-[100px]"
								onClick={handleActivate}
							>
								Ok
							</button>
							{getGuestReservationState.status === false && getGuestReservationState?.data?.status === 'inactive' && (
								<button
									className="border border-button text-button py-2 rounded-lg hover:bg-buttonHover hover:text-white block px-2"
									onClick={handleResendEmail}
								>
									Resend Activation Email
								</button>
							)}

							{getGuestReservationState.status === false && getGuestReservationState?.data?.status === 'active' && (
								<button
									className="border border-button text-button py-2 rounded-lg hover:bg-buttonHover hover:text-white block px-2"
									onClick={handleLoginButton}
								>
									Login
								</button>
							)}
						</div>
					</div>
				}
			/>
		</>
	);
}
