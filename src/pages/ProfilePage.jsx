import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import {getReservationListByGuestId} from '../api';
import {appConfig} from '../AppConfig';
import PageTitle from '../components/PageTitle';

export default function ProfilePage() {
	const baseUrl = appConfig.baseUrl;
	const [activeTab, setActiveTab] = useState('reservations');
	const [allreservation, setAllreservation] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const storeGuestUser = useSelector((state) => state.guestUser);

	const pendingReservations = allreservation.filter((reservation) => reservation.status === 'pending');
	const completedReservations = allreservation.filter((reservation) => reservation.status === 'completed');
	const cancelledReservations = allreservation.filter((reservation) => reservation.status === 'cancelled');

	useEffect(() => {
		const fetchReservations = async () => {
			try {
				setIsLoading(true);
				const response = await getReservationListByGuestId(storeGuestUser?.guestUser?.uuid);
				setIsLoading(false);
				setAllreservation(response.data);
			} catch (error) {
				console.log('error', error);
			}
		};

		if (storeGuestUser?.guestUser?.uuid) {
			fetchReservations();
		}
	}, [storeGuestUser?.guestUser?.uuid]);

	console.log('cancelledReservations', cancelledReservations);
	console.log('pendingReservations', pendingReservations);
	console.log('allReservation', allreservation);

	const renderContent = () => {
		switch (activeTab) {
			case 'reservations':
				return (
					<>
						{/* Upcoming Reservations */}
						<div>
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Upcoming reservations ({pendingReservations.length})
							</h3>
							<div className="flex flex-col gap-3">
								{isLoading ? <p className="">Loading...</p> : null}
								{pendingReservations.length > 0 ? (
									pendingReservations.map((reservation) => (
										<div
											key={reservation.id}
											className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4"
										>
											<div className="flex-shrink-0 w-full md:w-[150px] h-[100px] md:h-auto">
												<img
													src={
														reservation.restaurant.avatar
															? `${baseUrl}/${reservation?.restaurant?.avatar}`
															: 'https://via.placeholder.com/150'
													}
													alt={reservation.restaurant.name || 'Restaurant'}
													className="h-full w-full object-cover rounded-lg"
												/>
											</div>
											<div className="flex-grow">
												<h4 className="font-semibold text-gray-800">
													{reservation.restaurant.name || 'Restaurant Name'}
												</h4>
												<p className="text-sm text-gray-600">
													{reservation.day}, {reservation.reservation_date} at{' '}
													{reservation.reservation_time.slice(0, 5)} for {reservation.number_of_people} people
												</p>
												<p className="text-sm text-gray-500">
													Reserved on {new Date(reservation.created_at).toLocaleDateString('en-US')}
													&bull; Reservation #{reservation.id}
												</p>
												<span className="bg-button text-white py-1 px-2 rounded text-xs capitalize">
													{reservation.status}
												</span>
											</div>
											{/* <div className="flex items-center gap-4">
												<button className="bg-red-500 text-white font-semibold py-1 px-4 rounded-md">Cancel</button>
											</div> */}
										</div>
									))
								) : (
									<p>No upcoming reservations</p>
								)}
							</div>
						</div>

						{/* Completed Reservations */}
						<div className="mt-10">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Past reservations ({completedReservations.length})
							</h3>
							<div className="flex flex-col gap-3">
								{completedReservations.length > 0 ? (
									completedReservations.map((reservation) => (
										<div
											key={reservation.id}
											className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4"
										>
											<div className="flex-shrink-0 w-full md:w-[150px] h-[100px] md:h-auto">
												<img
													src={
														reservation.restaurant.avatar
															? `${baseUrl}/${reservation.restaurant.avatar}`
															: 'https://via.placeholder.com/150'
													}
													alt={reservation.restaurant.name || 'Restaurant'}
													className="h-full w-full object-cover rounded-lg"
												/>
											</div>
											<div className="flex-grow">
												<h4 className="font-semibold text-gray-800">
													{reservation.restaurant.name || 'Restaurant Name'}
												</h4>
												<p className="text-sm text-gray-600">
													{reservation.day}, {reservation.reservation_date} at{' '}
													{reservation.reservation_time.slice(0, 5)} for {reservation.number_of_people} people
												</p>
												<p className="text-sm text-gray-500">
													Reserved on {new Date(reservation.created_at).toLocaleDateString('en-US')}
													&bull; Reservation #{reservation.id}
												</p>

												<span className="bg-button text-white py-1 px-2 rounded text-xs capitalize">
													{reservation.status}
												</span>
											</div>
											{/* Don't remove this code. This is for future use */}
											{/* <div className="flex items-center gap-4">
												<button className="bg-blue-500 text-white font-semibold py-1 px-4 rounded-md">
													Reserve again
												</button>
												<button className="bg-green-500 text-white font-semibold py-1 px-4 rounded-md">
													Leave a review
												</button>
											</div> */}
										</div>
									))
								) : (
									<p>No past reservations</p>
								)}
							</div>
						</div>

						{/* Cancelled Reservations */}
						<div className="mt-10">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">
								Cancelled reservations ({cancelledReservations.length})
							</h3>
							<div className="flex flex-col gap-3">
								{cancelledReservations.length > 0 ? (
									cancelledReservations.map((reservation) => (
										<div
											key={reservation.id}
											className="bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-4"
										>
											<div className="flex-shrink-0 w-full md:w-[150px] h-[100px] md:h-auto">
												<img
													src={
														reservation.restaurant.avatar
															? `${baseUrl}/${reservation.restaurant.avatar}`
															: 'https://via.placeholder.com/150'
													}
													alt={reservation.restaurant.name || 'Restaurant'}
													className="h-full w-full object-cover rounded-lg"
												/>
											</div>
											<div className="flex-grow">
												<h4 className="font-semibold text-gray-800">
													{reservation.restaurant.name || 'Restaurant Name'}
												</h4>
												<p className="text-sm text-gray-600">
													{reservation.day}, {reservation.reservation_date} at{' '}
													{reservation.reservation_time.slice(0, 5)} for {reservation.number_of_people} people
												</p>
												<p className="text-sm text-gray-500">
													Reserved on {new Date(reservation.created_at).toLocaleDateString('en-US')}
													&bull; Reservation #{reservation.id}
												</p>

												<span className="bg-button text-white py-1 px-2 rounded text-xs capitalize">
													{reservation.status}
												</span>
											</div>
											{/* Don't remove this code. This is for future use */}
											{/* <div className="flex items-center gap-4">
												<button className="bg-blue-500 text-white font-semibold py-1 px-4 rounded-md">
													Reserve again
												</button>
												<button className="bg-green-500 text-white font-semibold py-1 px-4 rounded-md">
													Leave a review
												</button>
											</div> */}
										</div>
									))
								) : (
									<p>No past reservations</p>
								)}
							</div>
						</div>
					</>
				);
			case 'profile':
				return (
					<div className="bg-white p-8 rounded-lg shadow-sm w-full border">
						<h3 className="text-lg font-semibold text-gray-700 mb-4">Your details</h3>
						<div className="flex flex-col md:flex-row gap-6">
							{/* Profile Picture */}
							<div className="flex-shrink-0">
								<div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mb-4">
									{/* Placeholder for user avatar */}
									<span className="text-4xl text-gray-400">📷</span>
								</div>
							</div>

							{/* Profile Details */}
							<div className="flex-grow">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-gray-700 font-bold mb-2">Email address</label>
										<p className="mt-1 text-gray-900">{storeGuestUser.guestUser.email}</p>
									</div>
									<div></div>

									<div>
										<label className="block text-gray-700 font-bold mb-2">First name</label>
										<input
											type="text"
											className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
											value={storeGuestUser.guestUser.first_name}
											readOnly
										/>
									</div>
									<div>
										<label className="block text-gray-700 font-bold mb-2">Last name</label>
										<input
											type="text"
											className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
											value={storeGuestUser.guestUser.last_name}
										/>
									</div>

									<div className="col-span-2">
										<label className="block text-gray-700 font-bold mb-2">Phone number</label>
										<div className="flex">
											<input
												type="tel"
												className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:shadow"
												placeholder="eg. 0123456789"
												value={storeGuestUser.guestUser.phone || ''}
											/>
										</div>
									</div>
								</div>

								<div className="mt-6">
									<button className="bg-gray-400 text-white font-bold py-2 px-4 rounded">Save changes</button>
								</div>
							</div>
						</div>

						{/* Change Password */}
						{/* <div className="mt-10">
							<h3 className="text-lg font-semibold text-gray-700 mb-4">Change your password</h3>
							<button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded">Change password</button>
						</div> */}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<PageTitle title="Profile" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10 min-h-screen">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col md:flex-row gap-8 w-full">
							{/* Sidebar */}
							<div className="w-full md:w-1/4">
								<div className="bg-white p-8 rounded-lg shadow-sm border">
									<div className="flex flex-col items-center gap-5">
										<div className="bg-gray-200 h-20 w-20 rounded-full flex items-center justify-center">
											{/* Placeholder for user avatar */}
											<span className="text-4xl text-gray-500">👤</span>
										</div>
										<h2 className="text-lg font-bold">Welcome, {storeGuestUser.guestUser.first_name}</h2>
									</div>
									<div className="mt-6">
										<nav className="flex flex-col gap-4">
											<Link
												to="#"
												className={`${activeTab === 'reservations' ? 'font-bold' : 'text-gray-700'}`}
												onClick={() => setActiveTab('reservations')}
											>
												Reservations
											</Link>
											<Link
												to="#"
												className={`${activeTab === 'profile' ? 'font-bold' : 'text-gray-700'}`}
												onClick={() => setActiveTab('profile')}
											>
												Profile
											</Link>
										</nav>
									</div>
								</div>
							</div>

							{/* Main Content */}
							<div className="w-full md:w-3/4">{renderContent()}</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
