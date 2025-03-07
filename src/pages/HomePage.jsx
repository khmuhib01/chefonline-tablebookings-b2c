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
import {Link} from 'react-router-dom';
import Slider from 'react-slick';

// Sample Images (Replace with actual URLs)
const sliderImages = [
	'/images/offers/ads01.jpg',
	'/images/offers/ads02.jpg',
	'/images/offers/ads03.jpg',
	'/images/offers/ads04.jpg',
];

const settings = {
	dots: false, // Show navigation dots
	infinite: true, // Infinite loop scrolling
	speed: 500, // Transition speed
	slidesToShow: 3, // Number of images visible at once
	slidesToScroll: 1, // Number of images to scroll
	autoplay: true, // Enable autoplay
	autoplaySpeed: 3000, // Time interval for autoplay
	gap: 10,
	responsive: [
		{
			breakpoint: 1024, // Tablets
			settings: {
				slidesToShow: 2,
			},
		},
		{
			breakpoint: 600, // Mobile Devices
			settings: {
				slidesToShow: 1,
			},
		},
	],
};

const HomePage = () => {
	const dispatch = useDispatch();
	const searchResult = useSelector((state) => state.searchResult.searchResult);
	const {loading: searchResultLoading, errorMessage: searchResultError} = searchResult;

	const storeReservationId = useSelector((state) => state.reservations.currentReservation.reservation_id);
	const storeReservationUUID = useSelector((state) => state.reservations.currentReservation.reservation_uuid);

	const categoryState = useSelector((state) => state.category);
	const {categories, loading: categoryLoading, error: categoryError} = categoryState;

	const [activeCategory, setActiveCategory] = useState('');
	const [filteredRestaurants, setFilteredRestaurants] = useState([]);
	const [restaurantData, setRestaurantData] = useState([]);
	const [topRestaurantData, setTopRestaurantData] = useState([]);
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
		fetchData();
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const removeReservation = async () => {
		try {
			if (!storeReservationUUID) {
				const responseRemovedReservation = await getRemoveReservation(storeReservationUUID);
				if (responseRemovedReservation?.status === true) {
					setIsReservationRemoved(true);
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
				setRestaurantData(response.data.data);
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
				setTopRestaurantData(response.data.data);
			} else {
				console.error('Unexpected response structure:', response);
			}
		} catch (error) {
			console.error('Error fetching restaurant list:', error);
		}
	};

	const filterByCategory = async (categoryId) => {
		try {
			const response = await getAllRestaurants();
			const filteredData = response.data.data
				.filter((item) => String(item.category) === String(categoryId))
				.slice(0, 16);

			setActiveCategory(categoryId);
			setFilteredRestaurants(filteredData);
		} catch (error) {
			console.error('Error fetching restaurants:', error);
		}
	};

	useEffect(() => {
		if (storeReservationUUID && !isReservationRemoved) {
			removeReservation();
		}
	}, [storeReservationUUID]);

	useEffect(() => {
		if (searchResult.data.length > 0) {
			dispatch(clearSearchResult());
		}
	}, []);

	useEffect(() => {
		if (categories && categories.length > 0) {
			const sortedCategories = [...categories].sort((a, b) => b.count - a.count);
			setActiveCategory(sortedCategories[0]?.id);
			filterByCategory(sortedCategories[0]?.id);
		}
	}, [categories]);

	return (
		<>
			<PageTitle title="Book a table | Table Bookings" description="Home Page Description" />
			<div
				className="h-[80vh] bg-no-repeat bg-cover bg-center px-5"
				style={{backgroundImage: `url(${homeBannerImage})`}}
			>
				<div className="container h-full flex flex-col justify-center items-center gap-y-16">
					<h1 className="text-center text-[50px] font-bold leading-none text-primary capitalize">
						Indulge in a culinary delight
					</h1>
					<h4 className="text-[20px] font-bold leading-none text-primary">Book – Go – Eat</h4>
					<div className="max-w-[300px] w-full">
						<SearchComponent />
					</div>
				</div>
			</div>

			<div className="w-full bg-gray-200">
				<div className="container px-10 py-10">
					<Slider {...settings}>
						{sliderImages.map((image, index) => (
							<div key={index}>
								<img src={image} alt={`Offer ${index + 1}`} className="w-[95%] h-auto rounded-md m-auto" />
							</div>
						))}
					</Slider>
				</div>
			</div>

			<div className="container px-5 py-20">
				<h2 className="text-4xl font-bold text-center mb-4">Discover International Delights Near You!</h2>
				<p className="text-center text-lg text-gray-500 mb-6">
					Craving international flavours? Discover them right in your city
				</p>

				{/* Category Buttons */}
				<div className="flex justify-center space-x-4 mb-6 overflow-x-auto px-4 w-full">
					{categories &&
						[...categories]
							.sort((a, b) => b.count - a.count)
							.map((category, index) => (
								<button
									key={category.id}
									className={`px-4 py-2 font-semibold text-sm rounded-full uppercase whitespace-nowrap ${
										activeCategory === category.id ? 'bg-button text-white' : 'text-gray-500 hover:bg-gray-200'
									} ${index === 0 ? 'border-2 border-red-500' : ''}`}
									onClick={() => filterByCategory(category.id)}
								>
									{category.name}
								</button>
							))}
				</div>

				{/* Restaurant List (Limited to 16) */}
				<div className="flex justify-center px-4 w-full mb-6">
					{filteredRestaurants.length > 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 w-full">
							{filteredRestaurants.map((restaurant, index) => (
								<Link to={`/restaurant-details/${restaurant.uuid}`} key={index}>
									<div className="flex flex-col text-center items-center gap-4 p-4 bg-white shadow-md rounded-md hover:shadow-lg transition duration-300">
										<img
											src={
												restaurant.avatar ? `${imageBaseUrl}${restaurant.avatar}` : 'https://via.placeholder.com/150'
											}
											alt={restaurant.name || 'Restaurant Image'}
											className="w-28 h-28 object-cover rounded-full"
										/>
										<h3 className="text-lg font-bold mb-1 h-[65px]">
											{restaurant.name.length > 20 ? `${restaurant.name.slice(0, 20)}...` : restaurant.name}
										</h3>
									</div>
								</Link>
							))}
						</div>
					) : (
						<p className="text-center text-lg font-semibold">No restaurants available.</p>
					)}
				</div>
			</div>
		</>
	);
};

export default HomePage;
