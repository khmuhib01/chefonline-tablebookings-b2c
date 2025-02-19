import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PageTitle from '../components/PageTitle';
import SearchComponent from '../components/frontend/SearchComponent';
import {homeBannerImage} from '../ui-share/Image';
import {clearCurrentReservation} from '../store/reducers/reservationSlice';
import {getAllRestaurants, getRemoveReservation, fetchTopRestaurantListApi} from '../api';
import {setCategories, setCategoriesLoading, setCategoriesError} from '../store/reducers/CategorySlice';
import {setSearchResult, setError, clearSearchResult} from '../store/reducers/SearchResultSlice';
import {appConfig} from '../AppConfig';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import {Comments} from '../ui-share/Icon';
import {Link} from 'react-router-dom';

const HomePage = () => {
	const searchResult = useSelector((state) => state.searchResult.searchResult);
	const {loading: searchResultLoading, errorMessage: searchResultError} = searchResult;

	const [activeCategory, setActiveCategory] = useState('');

	const dispatch = useDispatch();
	const storeReservationId = useSelector((state) => state.reservations.currentReservation.reservation_id);
	const storeReservationUUID = useSelector((state) => state.reservations.currentReservation.reservation_uuid);
	const categoryState = useSelector((state) => state.category);
	const {categories, loading: categoryLoading, error: categoryError} = categoryState;
	const [currentPage, setCurrentPage] = useState(1);
	const [restaurantData, setRestaurantData] = useState([]);
	const [topRestaurantData, settopRestaurantData] = useState([]);
	const [isReservationRemoved, setIsReservationRemoved] = useState(false);
	const imageBaseUrl = appConfig.baseUrl;

	useEffect(() => {
		dispatch(clearCurrentReservation());
		fetchRestaurantList();
		fetchTopRestaurantList();
		if (storeReservationId != null) {
			removeReservation();
		}
		const fetchData = async () => {
			try {
				dispatch(setCategoriesLoading());
				const response = await getCategoryData();
				dispatch(setCategories(response.data));
			} catch (error) {
				dispatch(setCategoriesError(error.message));
			}
		};
	}, []);

	// Scroll to the top of the page when the component mounts
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// ✅ Prevent duplicate API calls by tracking state
	// const removeReservation = async () => {
	// 	try {
	// 		if (!storeReservationUUID) {
	// 			return;
	// 		}

	// 		const responseRemovedReservation = await getRemoveReservation(storeReservationUUID);

	// 		if (responseRemovedReservation?.status === true) {
	// 			setIsReservationRemoved(true); // ✅ Set state to prevent duplicate calls
	// 		} else {
	// 			console.warn('Reservation removal response was unexpected:', responseRemovedReservation);
	// 		}
	// 	} catch (error) {
	// 		if (error.response && error.response.status === 404) {
	// 			console.warn('Reservation not found, skipping removal.');
	// 			setIsReservationRemoved(true); // ✅ Mark as removed even if 404 to prevent re-tries
	// 		} else {
	// 			console.error('Error removing reservation:', error);
	// 		}
	// 	}
	// };

	const removeReservation = async () => {
		try {
			if (!storeReservationUUID) {
				const responseRemovedReservation = await getRemoveReservation(storeReservationUUID);
				if (responseRemovedReservation?.status === true) {
					setIsReservationRemoved(true); // ✅ Set state to prevent duplicate calls
				} else {
					console.warn('Reservation removal response was unexpected:', responseRemovedReservation);
				}
			}
		} catch (error) {
			console.error('Error removing reservation:', error);
		}
	};

	// const settings = {
	// 	dots: true,
	// 	infinite: false,
	// 	speed: 500,
	// 	slidesToShow: 4,
	// 	slidesToScroll: 4,
	// 	initialSlide: 0,
	// 	responsive: [
	// 		{
	// 			breakpoint: 1024,
	// 			settings: {
	// 				slidesToShow: 3,
	// 				slidesToScroll: 3,
	// 				infinite: true,
	// 				dots: true,
	// 			},
	// 		},
	// 		{
	// 			breakpoint: 600,
	// 			settings: {
	// 				slidesToShow: 2,
	// 				slidesToScroll: 2,
	// 				initialSlide: 2,
	// 			},
	// 		},
	// 		{
	// 			breakpoint: 480,
	// 			settings: {
	// 				slidesToShow: 1,
	// 				slidesToScroll: 1,
	// 			},
	// 		},
	// 	],
	// };

	const fetchRestaurantList = async () => {
		try {
			const response = await getAllRestaurants();

			if (response?.data?.data) {
				setRestaurantData(response.data.data); // Ensure the response structure is correct
			} else {
				console.error('Unexpected response structure:', response);
			}
		} catch (error) {
			console.error('Error fetching restaurant list:', error);
		}
	};

	const fetchTopRestaurantList = async () => {
		try {
			const response = await fetchTopRestaurantListApi();

			if (response?.data?.data) {
				settopRestaurantData(response.data.data); // Ensure the response structure is correct
			} else {
				console.error('Unexpected response structure:', response);
			}
		} catch (error) {
			console.error('Error fetching restaurant list:', error);
		}
	};

	const filterByCategory = async (categoryId) => {
		console.log('categoryId', categoryId);
		try {
			const response = await getAllRestaurants();
			const filteredData = response.data.data.filter((item) => {
				return String(item.category) === String(categoryId);
			});
			if (filteredData.length === 0) {
				console.warn(`No data found for categoryId: ${categoryId}`);
			}
			setActiveCategory(categoryId);
			setRestaurantData(filteredData);
		} catch (error) {
			console.error('Error fetching restaurants:', error);
		}
	};

	useEffect(() => {
		if (storeReservationUUID && !isReservationRemoved) {
			removeReservation();
		}
	}, [storeReservationUUID]); // ✅ Only runs when UUID changes

	useEffect(() => {
		if (searchResult.data.length > 0) {
			dispatch(clearSearchResult());
		}
	}, []);

	return (
		<>
			<PageTitle title="Book a table | Table Bookings" description="Home Page Description" />

			<div
				className="h-[80vh] bg-no-repeat bg-cover bg-center px-5"
				style={{backgroundImage: `url(${homeBannerImage})`}}
			>
				<div className="container h-full">
					<div className="flex flex-col justify-center items-center gap-y-16 h-full">
						<div className="flex flex-col gap-y-5 items-center justify-center">
							<h1 className="text-center text-[50px] sm:text-[70px] md:text-[65px] font-bold leading-none text-primary capitalize">
								Indulge in a culinary delight
							</h1>
							<h4 className="text-[18px] sm:text-[20px] md:text-[20px] font-bold leading-none text-primary">
								Book – Go – Eat
							</h4>
						</div>
						<div className="max-w-[300px] w-full">
							<SearchComponent />
						</div>
					</div>
				</div>
			</div>

			<div className="container px-5">
				<div className="flex flex-col gap-20 py-20">
					<div className="w-[100%] md:w-[60%] m-auto">
						<div className="bg-red-200 rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8">
							<div>
								<h2 className="text-2xl font-bold text-gray-800 mb-2">Hungry to dine out?</h2>
								<p className="text-xl text-gray-800 mb-6">Book a restaurant via the app!</p>

								<div className="flex gap-4">
									<a href="#" class="inline-block">
										<img
											src="https://assets-www.web-dev.euwest1.aws.quandoo.com/12.286.1/static/media/en.61d9b27b.svg"
											alt="Download on the App Store"
											className="h-10"
										/>
									</a>
									<a href="#" className="inline-block">
										<img
											src="https://assets-www.web-dev.euwest1.aws.quandoo.com/12.286.1/static/media/en.ef651593.svg"
											alt="Get it on Google Play"
											className="h-10"
										/>
									</a>
								</div>
							</div>

							<div>
								<img src="https://qcm.imgix.net/hp_app_banner.png" alt="App on phone" className="w-48" />
							</div>
						</div>
					</div>

					<div className="">
						<div className="flex flex-col">
							<h2 className="text-4xl font-bold text-center mb-4 leading-none">
								Discover International Delights Near You!
							</h2>
							<p className="text-center text-lg text-gray-500 mb-6 leading-none">
								Craving international flavours? Discover them right in your city
							</p>
						</div>

						<div className="flex  justify-center space-x-4 mb-6 overflow-x-auto px-4 w-full">
							{categories &&
								[...categories]
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((category) => (
										<button
											key={category.id}
											className={`px-4 py-2 font-semibold text-sm rounded-full uppercase ${
												activeCategory === category.id ? 'bg-button text-white' : 'text-gray-500 hover:bg-gray-200'
											} whitespace-nowrap`} // Ensures buttons do not break into new lines
											onClick={() => filterByCategory(category.id)}
										>
											{category.name}
										</button>
									))}
						</div>
						<div className="flex justify-center px-4 w-full mb-6">
							{restaurantData.length > 0 ? (
								<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full">
									{restaurantData.map((restaurant, index) => (
										<Link to={`/restaurant-details/${restaurant.uuid}`} key={index}>
											<div
												key={index}
												className="flex flex-col text-center items-center gap-4 p-4 bg-white shadow-md rounded-md hover:shadow-lg transition duration-300 ease-in-out"
											>
												<img
													src={
														restaurant?.avatar
															? `${imageBaseUrl}${restaurant.avatar}`
															: 'https://via.placeholder.com/150'
													}
													alt={restaurant?.name || 'Restaurant Image'}
													className="w-28 h-28 object-cover rounded-full"
												/>
												<div className="flex-1">
													<h3 className="text-lg font-bold mb-1 h-[65px]">
														{restaurant?.name || 'Unknown Restaurant'}
													</h3>
													<p className="text-gray-500 text-sm mb-2">{restaurant?.category_list?.name || 'N/A'}</p>
													<div className="flex flex-wrap gap-2 mt-2">
														{restaurant?.label_tags?.map((tag, tagIndex) => (
															<span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-[12px] rounded">
																{tag?.name || 'N/A'}
															</span>
														))}
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							) : (
								<div className="">
									<p className="text-center text-lg font-semibold">No restaurants available.</p>
								</div>
							)}
						</div>
					</div>

					{/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
						<div>
							<h2 className="text-4xl font-bold leading-none">
								Explore local gems! Your next favorite restaurant is just around the corner!
							</h2>
							<p className="text-lg text-gray-600 mb-6">Discover and book your perfect table nearby!</p>
							<button className="px-4 py-2 bg-button text-white rounded-md hover:bg-buttonHover focus:outline-none gap-2 flex items-center justify-center">
								Discover restaurants
							</button>
						</div>
						<div className="space-y-8">
							{topRestaurantData.map((restaurant, index) => (
								<div key={index} className="flex flex-col md:flex-row md:items-center gap-4">
									<img
										src={restaurant?.avatar ? `${imageBaseUrl}${restaurant.avatar}` : 'https://via.placeholder.com/150'}
										alt={restaurant?.name || 'Restaurant Image'}
										className="w-28 h-28 object-cover rounded-lg"
									/>
									<div className="flex-1">
										<h3 className="text-lg font-bold">{restaurant.name}</h3>
										<p className="text-gray-500 text-sm">{restaurant.location}</p>

										<p className="text-green-500 font-bold text-sm">
											{restaurant?.category_list?.name}{' '}
											<span className="text-gray-500">({Math.round(restaurant?.avg_rating || 0)} reviews)</span>
										</p>
										<div className="flex gap-2 mt-2">
											{restaurant.label_tags.map((tag, index) => (
												<span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-[12px] rounded">
													{tag.name}
												</span>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="space-y-8">
							{topRestaurantData.length > 1 ? (
								topRestaurantData.reverse().map((restaurant, index) => (
									<div key={index} className="flex flex-col md:flex-row md:items-center gap-4">
										<img
											src={
												restaurant?.avatar ? `${imageBaseUrl}${restaurant.avatar}` : 'https://via.placeholder.com/150'
											}
											alt={restaurant?.name || 'Restaurant Image'}
											className="w-28 h-28 object-cover rounded-lg"
										/>
										<div className="flex-1">
											<h3 className="text-lg font-bold">{restaurant.name}</h3>
											<p className="text-gray-500 text-sm">{restaurant.location}</p>

											<p className="text-green-500 font-bold text-sm">
												{restaurant?.category_list?.name}{' '}
												<span className="text-gray-500">({Math.round(restaurant?.avg_rating || 0)} reviews)</span>
											</p>
											<div className="flex gap-2 mt-2">
												{restaurant.label_tags.map((tag, index) => (
													<span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-[12px] rounded">
														{tag.name}
													</span>
												))}
											</div>
										</div>
									</div>
								))
							) : (
								<>
									<div className="flex flex-col md:flex-row md:items-center gap-4"></div>
									<div className="border border-gray-300 bg-gray-100 text-gray-600 p-6 rounded-lg shadow-md">
										<p className="text-center text-lg font-semibold">No restaurants available.</p>
									</div>
								</>
							)}
						</div>
					</div> */}
				</div>
			</div>
		</>
	);
};

export default HomePage;
