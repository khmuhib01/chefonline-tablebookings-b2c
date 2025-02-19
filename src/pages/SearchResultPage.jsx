import React, {useEffect, useRef, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {DownArrow} from '../ui-share/Icon';
import {useLocation} from 'react-router-dom';
import {getCategoryData, getRestaurantDataByPage} from '../api';
import {setCategories, setCategoriesLoading, setCategoriesError} from '../store/reducers/CategorySlice';
import PageTitle from '../components/PageTitle';
import RestaurantCard from '../components/frontend/RestaurantCard';
import FilteredByComponent from '../components/frontend/FilteredByComponent';
import {setSearchResult, setError} from '../store/reducers/SearchResultSlice';
import RenderSkeletonRestaurantCards from '../components/frontend/skeleton/RenderSkeletonRestaurantCards';
import RenderSkeletonFilteredBy from '../components/frontend/skeleton/RenderSkeletonFilteredBy';

export default function SearchResultPage() {
	const [filteredBy, setFilteredBy] = useState('Filtered by');
	const [isOpenFilteredBy, setIsOpenFilteredBy] = useState(false);
	const [selected, setSelected] = useState('Relevance');
	const [isOpen, setIsOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [loading, setLoading] = useState(false);

	const location = useLocation();
	const {error} = location.state || {};

	const dispatch = useDispatch();

	const searchResult = useSelector((state) => state.searchResult.searchResult);
	const {loading: searchResultLoading, errorMessage: searchResultError} = searchResult;

	const categoryState = useSelector((state) => state.category);
	const {categories, loading: categoryLoading, error: categoryError} = categoryState;

	const options = ['Relevance', 'Top rated', 'Most reviewed', 'Most expensive', 'Least expensive'];

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleSelect = (option) => {
		setSelected(option);
		setIsOpen(false);
		// Handle sorting or filtering based on selected option, if needed
	};

	const toggleFilteredBy = () => setIsOpenFilteredBy(!isOpenFilteredBy);

	useEffect(() => {
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
	}, [dispatch]);

	const handlePageChange = async (page) => {
		try {
			const response = await getRestaurantDataByPage(page);

			const data = response.data.data;
			const currentPage = response.data.current_page;
			const lastPage = response.data.last_page;

			dispatch(setSearchResult({data, currentPage, totalPages: lastPage}));
			setCurrentPage(page);
		} catch (error) {
			dispatch(setError(error.message));
		}
	};

	const dropdownRef = useRef(null);
	const filteredByRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
			if (filteredByRef.current && !filteredByRef.current.contains(event.target)) {
				setIsOpenFilteredBy(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			<PageTitle title="Search Result | Table Bookings" description="Search Result Page Description" />

			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
						<div className="lg:block hidden md:col-span-3">
							<div className="sticky top-[120px]">
								{categoryLoading ? (
									<RenderSkeletonFilteredBy />
								) : (
									<FilteredByComponent items={categories} error={categoryError} />
								)}
							</div>
						</div>

						<div className="md:col-span-9 col-span-12">
							<div className="flex flex-col gap-3">
								<div className="flex justify-between lg:justify-end bg-white rounded-md shadow py-2">
									<div className="flex-1 relative lg:hidden block w-full" ref={filteredByRef}>
										<div className="flex items-center bg-transparent py-2 px-4 rounded cursor-pointer">
											<p className="text-sm text-bodyText" onClick={toggleFilteredBy}>
												{filteredBy}
											</p>
											<DownArrow size={16} className="ml-1 text-bodyText" />
										</div>
										{isOpenFilteredBy && (
											<div className="absolute left-0 mt-2 w-[250px] lg:w-full bg-white rounded shadow-lg z-[1000]">
												{categoryLoading ? (
													<RenderSkeletonFilteredBy />
												) : (
													<FilteredByComponent items={categories} error={categoryError} />
												)}
											</div>
										)}
									</div>

									<div className="flex-1 relative inline-block" ref={dropdownRef}>
										<div className="flex justify-end items-center bg-transparent text-gray-700 py-2 px-4 rounded cursor-pointer">
											<p className="text-sm text-bodyText" onClick={toggleDropdown}>
												{selected}
											</p>
											<DownArrow size={16} className="ml-1 text-bodyText" />
										</div>
										{isOpen && (
											<div className="absolute right-0 mt-2 min-w-[140px] bg-white rounded shadow-lg z-[1000]">
												{options.map((option, index) => (
													<div
														key={index}
														onClick={() => handleSelect(option)}
														className={`block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
															selected === option ? 'text-button' : 'text-gray-700'
														}`}
													>
														{option}
													</div>
												))}
											</div>
										)}
									</div>
								</div>
								{searchResultLoading || categoryLoading ? (
									<RenderSkeletonRestaurantCards />
								) : (
									<>
										<div className="flex flex-col gap-5">
											{error ? (
												<div className="flex flex-col gap-5">
													<h1 className="text-center text-2xl text-titleText font-bold leading-none">
														{error.message}
													</h1>
												</div>
											) : (
												searchResult.data &&
												searchResult.data.map((restaurant) => (
													<RestaurantCard key={restaurant.id} restaurant={restaurant} />
												))
											)}
										</div>

										{/* Pagination */}
										<div className="flex justify-center">
											{[...Array(searchResult.totalPages).keys()].map((page) => (
												<button
													key={page}
													className={`px-3 py-1 mx-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 ${
														page + 1 === currentPage ? 'bg-red-500 text-white' : ''
													}`}
													onClick={() => handlePageChange(page + 1)}
												>
													{page + 1}
												</button>
											))}
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
