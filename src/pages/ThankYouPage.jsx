import React, {useContext, useEffect} from 'react';
import {Calendar, People, Time} from '../ui-share/Icon';
import {useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {clearCurrentReservation, setReservationId} from '../store/reducers/reservationSlice';
import {formatTime} from '../utils/conversions';
import PageTitle from '../components/PageTitle';
import {AuthContextGuest} from '../context/AuthContextGuest';

export default function ThankYouPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const storeGuestName = useSelector((state) => state.reservations.currentReservation.user_name);
	const storeReservationId = useSelector((state) => state.reservations.currentReservation.reservation_id);
	const storeUserEmail = useSelector((state) => state.reservations.currentReservation.user_email);
	const storeReservationMessage = useSelector((state) => state.reservations.currentReservation.reservation_message);
	const storeRestaurantName = useSelector((state) => state.reservations.currentReservation.rest_name);
	const storePerson = useSelector((state) => state.reservations.currentReservation.person);
	const storeDate = useSelector((state) => state.reservations.currentReservation.date);
	const storeStartTime = useSelector((state) => state.reservations.currentReservation.start_time);
	const storeEndTime = useSelector((state) => state.reservations.currentReservation.end_time);

	const storeGuestID = useSelector((state) => state.reservations.currentReservation.user_id);
	const storeReservationID = useSelector((state) => state.reservations);

	const {isAuthenticated} = useContext(AuthContextGuest);

	const handleEditReservationSubmit = () => {
		// Ensure the navigation happens after any necessary cleanup or async operations
		navigate('/edit-reservation');
	};

	const handleHomeSubmit = () => {
		// Ensure the navigation happens after any necessary cleanup or async operations
		navigate('/');
		dispatch(clearCurrentReservation());
		localStorage.removeItem('reservationComplete');
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			<PageTitle title="Thank You" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold leading-none">{storeReservationMessage}</h1>

							<div className="flex flex-col gap-3 bg-white max-w-[600px] mx-auto rounded-lg shadow-lg w-full border text-center md:p-8 px-3 py-4">
								<h2 className="text-xl font-bold text-titleText leading-none capitalize">
									Thanks for your reservation
								</h2>

								{isAuthenticated ? (
									<p className="text-bodyText">Please check your email for your reservation details.</p>
								) : (
									<p className="text-bodyText">
										Please check your email for your reservation details. You must activate your account to make future
										reservations.
									</p>
								)}
								<div className="flex items-center gap-3">
									<button
										type="button"
										className="w-full bg-button text-white py-2 rounded-lg hover:bg-buttonHover"
										onClick={handleHomeSubmit}
									>
										Go To Home
									</button>
								</div>
							</div>

							<div className="bg-white max-w-[600px] mx-auto rounded-lg shadow-lg w-full border">
								<div className="flex flex-col">
									<div className="flex justify-between items-center border-b py-2 px-4 gap-x-3">
										<h1 className="text-lg text-titleText font-bold">{storeRestaurantName}</h1>
									</div>
									<div>
										<div className="grid grid-cols-3">
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
