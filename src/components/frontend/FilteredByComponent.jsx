import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {setCuisine, toggleOnlineBooking} from './../../store/reducers/filtersSlice';
import {Cross} from '../../ui-share/Icon';
import {
	setSearchResult,
	setError,
	clearSearchResult,
	setSearchResultError,
	setSearchResultLoading,
} from '../../store/reducers/SearchResultSlice';
import {getRestaurantData} from '../../api';

const FilteredByComponent = ({items, loading, error}) => {
	const [showAll, setShowAll] = useState(false);
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectRestaurant, setRestaurant] = useState([]);

	const dispatch = useDispatch();
	const [restaurants, setRestaurants] = useState('');
	const [postCode, setPostCode] = useState('');
	const onlineBooking = useSelector((state) => state.filters.onlineBooking);
	const restaurantsList = useSelector((state) => state.searchResult.searchResult);

	useEffect(() => {
		if (selectedItems.length > 0) {
			const newSelectRestaurant = [];
			selectedItems.forEach((cuisine) => {
				cuisine.restaurants.forEach((singleItem) => {
					if (!newSelectRestaurant.some((item) => item.id === singleItem.id)) {
						newSelectRestaurant.push(singleItem);
					}
				});
			});
			setRestaurant(newSelectRestaurant);
			dispatch(setCuisine(selectedItems));
		} else {
			setRestaurant([]); // Clear selectRestaurant when selectedItems is empty
			dispatch(setCuisine([]));
			// Clear cuisine when selectedItems is empty
		}
		if (selectedItems.length === 0 && selectRestaurant.length === 0) {
			handleFindButtonClick();
		}
	}, [selectedItems, dispatch]);

	useEffect(() => {
		if (selectRestaurant.length > 0) {
			dispatch(clearSearchResult());
			dispatch(setSearchResult({data: selectRestaurant, currentPage: 1, totalPages: 1}));
		} else {
			dispatch(clearSearchResult());
			handleFindButtonClick();
		}
	}, [selectRestaurant, dispatch]);

	const toggleCheckbox = (cuisine) => {
		setSelectedItems((prevSelectedItems) =>
			prevSelectedItems.find((item) => item.id === cuisine.id)
				? prevSelectedItems.filter((item) => item.id !== cuisine.id)
				: [...prevSelectedItems, cuisine]
		);
	};

	const handleFindButtonClick = async () => {
		dispatch(setSearchResultLoading());
		const response = await getRestaurantData(restaurants, postCode, 10); // Example function, replace with actual API call
		const data = response.data.data;
		const currentPage = response.data.current_page;
		const lastPage = response.data.last_page;
		dispatch(clearSearchResult());
		dispatch(setSearchResult({data: data, currentPage: currentPage, totalPages: lastPage}));
	};

	const handleClearAll = () => {
		setSelectedItems([]);
		if (onlineBooking) {
			dispatch(toggleOnlineBooking());
		}
		setShowAll(false);
	};

	const initialItems = Array.isArray(items) ? items.slice(0, 5) : [];
	const displayedItems = showAll ? items : initialItems;

	return (
		<div className="px-5 bg-white rounded-md">
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-5 py-3">
					<div className="flex justify-between items-center">
						<h4 className="text-[#4D5565] font-bold">Filtered by:</h4>
						<span className="underline text-sm cursor-pointer text-[#4D5565]" onClick={() => handleClearAll()}>
							Clear All
						</span>
					</div>

					<div className="flex flex-wrap gap-2">
						{selectedItems.map((item) => (
							<p key={item.id} className="bg-red-200 px-2 py-1 rounded text-sm text-red-500 flex items-center group">
								Cuisine: <span className="font-bold">{item.name}</span>
								<Cross size={16} className="ml-1 group-hover:cursor-pointer" onClick={() => toggleCheckbox(item)} />
							</p>
						))}

						{onlineBooking && (
							<p className="bg-red-200 px-2 py-1 rounded text-sm text-red-500 flex items-center group">
								Cuisine: <span className="font-bold">Booking</span>
								<Cross
									size={16}
									className="ml-1 group-hover:cursor-pointer"
									onClick={() => dispatch(toggleOnlineBooking())}
								/>
							</p>
						)}
					</div>
				</div>

				<span className="h-[1px] bg-gray-200"></span>

				<div className="flex flex-col gap-5 py-3">
					<div className="flex justify-between items-center">
						<h4 className="text-[#4D5565] font-bold">Cuisine</h4>
					</div>

					{loading && <p>Loading...</p>}
					{error && <p>Error: {error}</p>}
					<div className="flex flex-col gap-2">
						{displayedItems.map((cuisine) => (
							<div key={cuisine.id} className="flex gap-2 items-center">
								<input
									type="checkbox"
									id={`checkbox-${cuisine.id}`}
									checked={selectedItems.some((item) => item.id === cuisine.id)}
									onChange={() => (cuisine.restaurants?.length > 0 ? toggleCheckbox(cuisine) : null)}
									className="h-3 w-3 cursor-pointer"
								/>
								<label htmlFor={`checkbox-${cuisine.id}`} className="flex items-center cursor-pointer gap-2 w-full">
									<span className="text-bodyText flex items-center gap-2">
										{cuisine.name} ({cuisine?.restaurants?.length})
									</span>
								</label>
							</div>
						))}
						<span className="underline text-sm cursor-pointer text-[#4D5565]" onClick={() => setShowAll(!showAll)}>
							{showAll ? 'Show Less' : 'Show All'}
						</span>
					</div>
				</div>

				<span className="h-[1px] bg-gray-200"></span>

				<div className="flex flex-col gap-5 py-3">
					<div className="flex justify-between items-center">
						<h4 className="text-[#4D5565] font-bold">Bookable online</h4>
						<label className="flex items-center cursor-pointer">
							<div className="relative">
								<input
									type="checkbox"
									checked={onlineBooking}
									onChange={() => dispatch(toggleOnlineBooking())}
									className="sr-only"
								/>
								<div className={`block w-10 h-6 rounded-full ${onlineBooking ? 'bg-button' : 'bg-gray-300'}`}></div>
								<div
									className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
										onlineBooking ? 'transform translate-x-full' : ''
									}`}
								></div>
							</div>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilteredByComponent;
