import React, {useEffect, useState} from 'react';
import PageTitle from '../components/PageTitle';
import AboutTabComponent from '../components/frontend/tabs/AboutTabComponent';
import MenuTabComponent from '../components/frontend/tabs/MenuTabComponent';
import PhotoTabComponent from '../components/frontend/tabs/PhotoTabComponent';
import ReviewsTabComponent from '../components/frontend/tabs/ReviewsTabComponent';
import ReservationComponent from '../components/frontend/ReservationComponent';
import {useNavigate, useParams} from 'react-router-dom';
import {getRestaurantDetails} from '../api';
import {appConfig} from '../AppConfig';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import CustomButton from '../ui-share/CustomButton';
import {useSelector, useDispatch} from 'react-redux';
import {getGuestReservationId, restaurantMenuImageOrPdf} from '../api';
import {
	setReservation_message,
	setReservationId,
	setReservationUUID,
	setResId,
	setResName,
} from '../store/reducers/reservationSlice';
import {formatDate} from '../utils/conversions';
import RenderSkeletonContent from '../components/frontend/skeleton/RenderSkeletonContent';
import RenderSkeletonReservation from '../components/frontend/skeleton/RenderSkeletonReservation';

export default function RestaurantDetailsPage() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [activeTab, setActiveTab] = useState('About');
	const [restaurantDetails, setRestaurantDetails] = useState({});
	const [loading, setLoading] = useState(true);

	const [files, setFiles] = useState([]);

	const {restaurantId} = useParams();
	const imageBaseUrl = appConfig.baseUrl;

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const storePerson = useSelector((state) => state.reservations.currentReservation.person);
	const storeDay = useSelector((state) => state.reservations.currentReservation.day);
	const storeDate = useSelector((state) => state.reservations.currentReservation.date);
	const storeResId = useSelector((state) => state.reservations.currentReservation.res_id);
	const storeStartTime = useSelector((state) => state.reservations.currentReservation.start_time);
	const storeEndTime = useSelector((state) => state.reservations.currentReservation.end_time);

	const storeReservation = useSelector((state) => state.reservations.currentReservation);

	const fetchGuestReservationId = async () => {
		try {
			const response = await getGuestReservationId(
				'create',
				storeStartTime,
				storeEndTime,
				storeDate,
				storeDay,
				'hold',
				storeResId,
				storePerson
			);

            console.log('response...................reserve now', response);
			dispatch(setReservationId(response.data.id));
			dispatch(setReservationUUID(response.data.uuid));
			dispatch(setReservation_message(response.message));
			return response;
		} catch (error) {
			console.error('Error fetching guest reservation ID:', error);
		}
	};

	const fetchRestaurantDetails = async () => {
		try {
			const response = await getRestaurantDetails(restaurantId);
			setRestaurantDetails(response);
			dispatch(setResId(response.data.uuid));
			dispatch(setResName(response.data.name));
		} catch (error) {
			console.error('Error fetching restaurant details:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchMenuFile = async () => {
		const data = {
			rest_uuid: restaurantId,
			params: 'info',
		};

		try {
			const response = await restaurantMenuImageOrPdf(data);
			setFiles(response.data);
		} catch (error) {
			console.error('Error fetching restaurant details:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRestaurantDetails();
		fetchMenuFile();
	}, [restaurantId]);

	useEffect(() => {
		// Check if restaurantDetails has been set and is not empty
		if (Object.keys(restaurantDetails).length > 0) {
			setIsLoaded(true);
		}
	}, [restaurantDetails]);

	const handleReserveTable = () => {
		fetchGuestReservationId();
		navigate('/checkout');
	};

	const renderContent = () => {
		switch (activeTab) {
			case 'About':
				return <AboutTabComponent details={restaurantDetails} />;
			case 'Menu':
				return <MenuTabComponent details={restaurantDetails} files={files} />;
			case 'Photos':
				return <PhotoTabComponent details={restaurantDetails} />;
			case 'Reviews':
				return <ReviewsTabComponent details={restaurantDetails} />;
			default:
				return null;
		}
	};

	const calculateReviewStats = () => {
		// Ensure restaurantDetails and its nested properties are defined
		const reviews = restaurantDetails?.data?.reviews ?? [];

		// Extract and filter out invalid ratings
		const reviewRatings = reviews.map((review) => review?.rating).filter((rating) => rating != null); // Exclude undefined or null ratings

		// Calculate total number of reviews and sum of ratings
		const totalReviews = reviewRatings.length;
		const sumOfRatings = reviewRatings.reduce((acc, rating) => acc + rating, 0);

		// Calculate average rating, if there are any valid reviews
		const averageRating = totalReviews > 0 ? sumOfRatings / totalReviews : 0;

		// Format the average rating to show only whole numbers or decimals as needed
		const formattedAverageRating =
			averageRating % 1 === 0
				? averageRating.toFixed(0) // Remove decimals if it's a whole number
				: averageRating.toFixed(2); // Show two decimal places otherwise

		return {
			totalReviews,
			sumOfRatings,
			averageRating: formattedAverageRating,
		};
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	const {totalReviews, averageRating} = calculateReviewStats();

	return (
		<>
			<PageTitle title="Menu and Prices | Table Bookings" description="Search Result Page Description" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
						<div className="lg:col-span-8">
							{loading ? (
								<RenderSkeletonContent />
							) : isLoaded ? (
								<div className="bg-white p-2 rounded-md">
									<div className="flex flex-col gap-10">
										{/* rest info */}
										<div className="flex flex-col gap-3">
											<div className="flex justify-between items-center">
												<div className="flex-grow">
													<div className="">
														<h1 className="text-3xl flex-grow text-titleText font-bold test-css">
															{restaurantDetails.data?.name || 'Restaurant Name'}
														</h1>
													</div>
													{/* <div className="">
														<p className="text-sm text-bodyText">
															Dishes priced around:
															<span className="font-bold">€{calculateAroundPrice()}</span>
														</p>
													</div> */}
												</div>
												{/* Don't delete. This is for the rating */}

												{/* <div className="flex-shrink-0 flex flex-col items-center justify-center">
													<div className="text-white bg-button font-semibold rounded-full px-3 py-1">
														{averageRating}/<span className="text-[14px]">5</span>
													</div>
													<div className="text-gray-500 text-sm">{totalReviews} reviews</div>
												</div> */}
											</div>
											<div className="">
												<div className="w-full h-full">
													<LazyLoadImage
														src={
															restaurantDetails.data?.avatar
																? `${imageBaseUrl}${restaurantDetails.data.avatar}`
																: '/images/null-image.webp'
														}
														alt="restaurant-image"
														className="w-full max-h-[500px] object-cover rounded-md"
														effect="blur"
														afterLoad={() => {
															setIsLoaded(true);
														}}
														wrapperClassName="h-full w-full"
													/>
												</div>
											</div>
										</div>
										<div className="w-full">
											{/* Tabs */}
											<div className="flex justify-between items-center border-b border-gray-100 bg-white">
												<div className="flex items-center gap-8">
													{['About', 'Menu', 'Photos'].map((tab) => (
														<div
															key={tab}
															className={`cursor-pointer flex flex-col gap-1 border-b-[4px] ${
																activeTab === tab ? 'border-button text-button' : 'border-transparent text-bodyText'
															}`}
															onClick={() => setActiveTab(tab)}
														>
															<h3 className="text-[16px] font-bold py-2">{tab}</h3>
														</div>
													))}
												</div>
											</div>

											{/* Content */}
											<div className="mt-4">{renderContent()}</div>
										</div>
									</div>
								</div>
							) : null}
						</div>
						<div className="lg:col-span-4">
							<div className="bg-white p-2 rounded-md sticky top-[120px]">
								<div className="flex flex-col gap-3">
									{loading ? (
										<RenderSkeletonReservation />
									) : isLoaded ? (
										<>
											<ReservationComponent />
											<CustomButton
												text="Reserve now"
												onClick={handleReserveTable}
												className="bg-button text-white px-4 py-2 rounded-md hover:bg-buttonHover"
											/>
										</>
									) : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
