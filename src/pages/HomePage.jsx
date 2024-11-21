import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PageTitle from '../components/PageTitle';
import SearchComponent from '../components/frontend/SearchComponent';
import {homeBannerImage} from '../ui-share/Image';
import {clearCurrentReservation} from '../store/reducers/reservationSlice';
import {getAllRestaurants, getRemoveReservation, fetchTopRestaurantListApi} from '../api';
import {setCategories, setCategoriesLoading, setCategoriesError} from '../store/reducers/CategorySlice';
import {setSearchResult, setError} from '../store/reducers/SearchResultSlice';
import {appConfig} from '../AppConfig';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import {Comments} from '../ui-share/Icon';

const HomePage = () => {
	const searchResult = useSelector((state) => state.searchResult.searchResult);
	const {loading: searchResultLoading, errorMessage: searchResultError} = searchResult;

	const [activeCategory, setActiveCategory] = useState('');

	const dispatch = useDispatch();
	const storeReservationId = useSelector((state) => state.reservations.currentReservation.reservation_id);
	const categoryState = useSelector((state) => state.category);
	const {categories, loading: categoryLoading, error: categoryError} = categoryState;
	const [currentPage, setCurrentPage] = useState(1);
	const [restaurantData, setRestaurantData] = useState([]);
	const [topRestaurantData, settopRestaurantData] = useState([]);
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

	const removeReservation = async () => {
		try {
			const responseRemovedReservation = await getRemoveReservation(storeReservationId);
			return responseRemovedReservation;
		} catch (error) {
			console.error('Error removing reservation:', error);
		}
	};

	const settings = {
		dots: true,
		infinite: false,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 4,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	// const fetchTopRestaurantList = async () => {
	// 	try {
	// 		const response = await getTopReviewAllRestaurants();
	// 		console.log('API Response:', response.data.data);
	// 		setRestaurantData(response.data.data);
	// 	} catch (error) {
	// 		console.error('Error fetching restaurants:', error);
	// 	}
	// };

	const fetchRestaurantList = async () => {
		try {
			const response = await getAllRestaurants();
			console.log('Full API Response:', response); // Debug the full response

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
			console.log('Full API Response:', response); // Debug the full response

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
			console.log('API Response:', response.data.data);
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

	const nearByRestaurantData = [
		{
			name: 'Ristorante Piperno',
			location: 'Centro Storico area',
			cuisine: 'Roman',
			priceRange: '€€€€',
			rating: '5.2/6',
			reviews: 613,
			tags: ['Romantic', 'Family-friendly', 'Good for groups'],
			image: 'https://qul.imgix.net/10743789-351f-4217-8e78-68556cc1a767/509827_sld.jpg?auto=format&w=781',
		},
		{
			name: 'Ristorante Pizzeria Gaudi',
			location: 'Salario area',
			cuisine: 'Pizza',
			priceRange: '€€€',
			rating: '5.0/6',
			reviews: 293,
			tags: ['Family-friendly', 'Good for groups'],
			image: 'https://qul.imgix.net/664bf1d0-97b1-49e4-85a0-70adfafab396/533393_sld.jpg?auto=format&w=781',
		},
		{
			name: 'Babette',
			location: 'Centro Storico area',
			cuisine: 'Roman',
			priceRange: '€€€€',
			rating: '5.7/6',
			reviews: 124,
			tags: ['Romantic', 'Family-friendly', 'Good for groups'],
			image: 'https://qul.imgix.net/a0e7bf3f-106c-42d0-b903-c382790ca5c4/609323_sld.jpg?auto=format&w=781',
		},
	];

	return (
		<>
			<PageTitle title="Book a table | Table Booking" description="Home Page Description" />

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
					{/*<div className="flex flex-col gap-10">
						<div className="">
							<h2 className="text-4xl text-center font-bold leading-none">Discover London’s Top Dining Spots</h2>
						</div>
						<div className="flex flex-col gap-2 items-center">
							<h2 className="text-2xl font-bold leading-none">Book a table at top local restaurants.</h2>
							<p className="text-bodyText text-xl leading-none">Dine at London’s favourites – your table awaits</p>
						</div>
						 <div className="slider-container">
							<Slider {...settings}>
								{restaurantData.map((restaurant, index) => (
									<div key={index} className="pr-4">
										{' '}
										<div className="rounded-lg overflow-hidden">
											<img src={restaurant.image} alt={restaurant.name} className="h-[200px] w-full object-cover" />
											<h3 className="text-lg font-bold">{restaurant.name}</h3>
											<div className="flex justify-between items-center">
												<div className="">
													<p className="text-sm bodyText">{restaurant.location}</p>
													<p className="text-sm bodyText font-bold">{restaurant.cuisine}</p>
												</div>

												<div className="flex flex-col items-end mt-2">
													<span className="text-green-500 font-bold">{restaurant.rating}</span>
													<div className="flex items-center gap-2">
														<Comments color="#9ca3af " />
														<span className="text-gray-400 text-sm">{restaurant.reviews}</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</Slider>
						</div> 
					</div>*/}

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
								[...categories] // Creates a shallow copy of the array to avoid modifying the original
									.sort((a, b) => a.name.localeCompare(b.name)) // Sorts categories alphabetically by name
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
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
									{restaurantData.map((restaurant, index) => (
										<div key={index} className="flex flex-col text-center items-center gap-4 p-4">
											<img
												src={
													restaurant?.avatar ? `${imageBaseUrl}${restaurant.avatar}` : 'https://via.placeholder.com/150'
												}
												alt={restaurant?.name || 'Restaurant Image'}
												className="w-28 h-28 object-cover rounded-full"
											/>
											<div className="flex-1">
												<h3 className="text-lg font-bold mb-1">{restaurant?.name || 'Unknown Restaurant'}</h3>
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
									))}
								</div>
							) : (
								<div className="">
									<p className="text-center text-lg font-semibold">No restaurants available.</p>
								</div>
							)}
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
						<div>
							<h2 className="text-4xl font-bold leading-none">
								Explore local gems! Your next favorite restaurant is just around the corner!
							</h2>
							<p className="text-lg text-gray-600 mb-6">Discover and book your perfect table nearby!</p>
							{/* <button className="px-4 py-2 bg-button text-white rounded-md hover:bg-buttonHover focus:outline-none gap-2 flex items-center justify-center">
								Discover restaurants
							</button> */}
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
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;
