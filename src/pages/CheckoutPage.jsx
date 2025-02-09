import React, {useContext, useEffect, useState} from 'react';
import {People, Calendar, Time, Mobile, Timer} from '../ui-share/Icon';
import ReservationComponent from '../components/frontend/ReservationComponent';
import {useNavigate} from 'react-router-dom';
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
	const [isReservationEdit, setIsReservationEdit] = useState(false);

	const [firstNameError, setFirstNameError] = useState('');
	const [lastNameError, setLastNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');

	const [loading, setLoading] = useState(false);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [isTimerPaused, setIsTimerPaused] = useState(false); // New state for managing timer pause

	const {isAuthenticated} = useContext(AuthContextGuest);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const storeReservationUUId = useSelector((state) => state.reservations.currentReservation.reservation_uuid);
	const storeReservationId = useSelector((state) => state.reservations.currentReservation.reservation_id);
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

	console.log('storeReservation', storeReservation);

	const handleReservationEdit = () => {
		setIsReservationEdit(!isReservationEdit);
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
					first_name: userFirstName || storeUser.first_name,
					last_name: userLastName || storeUser.last_name,
					phone: userPhone || storeUser.phone,
					email: email || storeUser.email,
					params: 'create',
				};

				const responsePostGuestRegister = await postGuestRegister(guestData);
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

	/* 	const handleReservationSubmit = async () => {
		let isValid = true;

		if (!isAuthenticated) {
			if (!userFirstName) {
				setFirstNameError('First name is required.');
				isValid = false;
			} else {
				setFirstNameError('');
			}

			// Validate last name
			if (!userLastName) {
				setLastNameError('Last name is required.');
				isValid = false;
			} else {
				setLastNameError('');
			}

			// Validate phone number
			if (!userPhone) {
				setPhoneError('Phone number is required.');
				isValid = false;
			} else if (!/^\d{11}$/.test(userPhone)) {
				setPhoneError('Phone number must be 10 digits.');
				isValid = false;
			} else {
				setPhoneError('');
			}

			// Validate email
			if (!email) {
				setEmailError('Email is required.');
				isValid = false;
			} else if (!/\S+@\S+\.\S+/.test(email)) {
				setEmailError('Email address is invalid.');
				isValid = false;
			} else {
				setEmailError('');
			}

			// If any validation fails, stop the function
			if (!isValid) {
				return;
			}
		}

		if (isAuthenticated) {
			await makeReservation(storeUser.guestUser.id);
		} else {
			const guestData = {
				first_name: userFirstName || storeUser.first_name,
				last_name: userLastName || storeUser.last_name,
				phone: userPhone || storeUser.phone,
				email: email || storeUser.email,
				params: 'create',
			};

			try {
				const responsePostGuestRegister = await postGuestRegister(guestData);
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

				// Complete the reservation with the guest ID
				await makeReservation(guestId);
			} catch (error) {
				console.error('Error during reservation submission:', error);
			}
		}
	}; */

	const makeReservation = async (guestId) => {
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
				storePerson
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
						setIsPopupOpen(true);
						setIsTimerPaused(true); // Pause the timer
						removeReservation(); // Call async function
						return 0;
					}
					return prevTime - 1; // Decrement time
				});
			}
		}, 1000);

		// Define async function
		const removeReservation = async () => {
			try {
				const responseRemovedReservation = await getRemoveReservation(storeReservationId);
				return responseRemovedReservation;
			} catch (error) {
				console.error('Error removing reservation:', error);
			}
		};

		return () => clearInterval(timer); // Cleanup timer on component unmount
	}, [isTimerPaused, storeReservationId]);

	const handleNewReservation = () => {
		navigate(`/restaurant-details/${storeResId}`);
	};

	const handleContinueReservation = () => {
		setTimeLeft(10); // Restart the timer
		setIsTimerPaused(false); // Unpause the timer
		setIsPopupOpen(false); // Close the popup
	};

	// Prevent browser tab close and reload

	const removeReservation = async (id) => {
		try {
			const responseRemovedReservation = await getRemoveReservation(id);
			return responseRemovedReservation;
		} catch (error) {
			console.error('Error removing reservation:', error);
		}
	};

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			if (storeReservationId != null) {
				// Attempt to remove the reservation; async completion is not guaranteed
				removeReservation(storeReservationId);
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
	}, [storeReservationId, dispatch]);

	// For Timer time formatter
	const formatTimer = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			<PageTitle title="Checkout" description="Home Page Description" />
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
												<div className="flex">
													<div className="flex items-center bg-gray-200 px-3 rounded-l-lg border border-r-0 ">
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
														value={userPhone}
														onChange={(e) => setUserPhone(e.target.value)}
														required
													/>
													<span className="text-red-500 text-xs">{phoneError}</span>
												</div>
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
											<input
												type="text"
												id="specialRequest"
												placeholder="E.g. table preference, space for a stroller..."
												className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
												value={userSpecialRequest}
												onChange={(e) => setUserSpecialRequest(e.target.value)}
											/>
										</div>
										<div className="mb-4">
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
										</div>
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
				title="Alert"
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
					</div>
				}
			/>
		</>
	);
}
