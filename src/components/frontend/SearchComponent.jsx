import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import InputField from './../../ui-share/InputField';
import {
	setSearchResult,
	setError,
	setSearchResultError,
	setSearchResultLoading,
} from '../../store/reducers/SearchResultSlice';
import {getRemoveReservation, getRestaurantData} from '../../api';
import Spinner from '../../ui-share/Spinner';
import {clearCurrentReservation} from '../../store/reducers/reservationSlice';

export default function SearchComponent() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [input, setInput] = useState(''); // Single input for both restaurant and postcode
	const [inputError, setInputError] = useState('');
	const [loading, setLoading] = useState(false);

	const storeReservationUUId = useSelector((state) => state.reservations.currentReservation.reservation_uuid);
	console.log('storeReservationUUId', storeReservationUUId);

	const handleInputChange = (e) => {
		setInput(e.target.value);
		setInputError('');
	};

	const handleFindButtonClick = async (e) => {
		if (e) e.preventDefault();

		// console.log('Input:', input);

		// Reset previous errors
		setInputError('');
		dispatch(clearCurrentReservation());

		//don't delete
		// if (storeReservationUUId !== null) {
		// 	removeReservation();
		// }

		//const valid_postcode_exp = /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]?[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/i;
		const validPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

		// Check if the input is a valid postcode
		const isPostcode = validPostcodeRegex.test(input.trim());

		// Variables to hold the search parameters
		let restaurantName = '';
		let postcode = '';

		if (isPostcode) {
			postcode = input.trim(); // Assign postcode if valid
		} else {
			restaurantName = input.trim(); // Otherwise, assume it's a restaurant name
		}

		try {
			dispatch(setSearchResultLoading());
			setLoading(true);

			// Fetch restaurant data using API
			const response = await getRestaurantData(restaurantName, postcode, 10);
			setLoading(false);

			if (!response.data.data.length) {
				// Show "not found" error
				setInputError('Restaurant not found');
				dispatch(setError('Restaurant not found'));
			} else {
				const data = response.data.data;
				const currentPage = response.data.current_page;
				const lastPage = response.data.last_page;

				dispatch(setSearchResult({data, currentPage, totalPages: lastPage}));

				// Navigate with appropriate query parameters
				navigate(`search-result?name=${encodeURIComponent(restaurantName)}&post_code=${encodeURIComponent(postcode)}`);
			}
		} catch (error) {
			setLoading(false);
			dispatch(setError(error.response ? error.response.data : error.message));
			dispatch(setSearchResultError(error.response ? error.response.data : error.message));

			// Navigate to search result page with error in the state
			navigate(`search-result?name=${encodeURIComponent(restaurantName)}&post_code=${encodeURIComponent(postcode)}`, {
				state: {error: error.response ? error.response.data : error.message},
			});
		} finally {
			setLoading(false);
		}
	};

	// This function can now be triggered by both button click and pressing Enter
	// const handleFindButtonClick = async (e) => {
	// 	// Prevent the default form submission behavior on Enter key press
	// 	if (e) e.preventDefault();

	//     console.log('imput', input);
	// 			return;

	// 			// Reset any previous errors
	// 			setInputError('');
	// 			dispatch(clearCurrentReservation());

	// 			if (storeReservationUUId != null) {
	// 				removeReservation();
	// 			}

	// 			const valid_postcode_exp = '/^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]?[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/i';

	// 	// Variables to hold the restaurant name and postcode for query parameters
	// 	let restaurantName = '';
	// 	let postcode = '';

	// 	// Check if the input is a valid postcode or a restaurant name
	// 	if (isLondonPostcode(input)) {
	// 		postcode = input;
	// 	} else {
	// 		restaurantName = input;
	// 	}

	// 	try {
	// 		dispatch(setSearchResultLoading());
	// 		setLoading(true);

	// 		// Pass the appropriate values in the API call
	// 		const response = await getRestaurantData(restaurantName, postcode, 10);
	// 		setLoading(false);

	// 		if (response.data.data.length === 0) {
	// 			// If no data is found, show the "not found" message
	// 			setInputError('Restaurant not found');
	// 			dispatch(setError('Restaurant not found'));
	// 		} else {
	// 			const data = response.data.data;
	// 			const currentPage = response.data.current_page;
	// 			const lastPage = response.data.last_page;

	// 			dispatch(setSearchResult({data: data, currentPage: currentPage, totalPages: lastPage}));

	// 			// Construct the URL with the appropriate parameters
	// 			navigate(`search-result?name=${encodeURIComponent(restaurantName)}&post_code=${encodeURIComponent(postcode)}`);
	// 		}
	// 	} catch (error) {
	// 		// Handle error and stop loading
	// 		setLoading(false);
	// 		dispatch(setError(error.response ? error.response.data : error.message));
	// 		dispatch(setSearchResultError(error.response ? error.response.data : error.message));

	// 		// Navigate to search result page with error in the state
	// 		navigate(`search-result?name=${encodeURIComponent(restaurantName)}&post_code=${encodeURIComponent(postcode)}`, {
	// 			state: {error: error.response ? error.response.data : error.message},
	// 		});
	// 	} finally {
	// 		// Ensure loading is stopped regardless of success or failure
	// 		setLoading(false);
	// 	}
	// };

	const removeReservation = async () => {
		try {
			const responseRemovedReservation = await getRemoveReservation(storeReservationUUId);
			return responseRemovedReservation;
		} catch (error) {
			console.error('Error removing reservation:', error);
		}
	};

	// Post code validation
	const isLondonPostcode = (postcode) => {
		// Regular expression for London postcodes
		const londonPostcodeRegex = /^(E|EC|N|NW|SE|SW|W|WC)(\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/i;

		// Test the postcode string against the regex
		return londonPostcodeRegex.test(postcode);
	};

	// Add key press handler for Enter key
	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleFindButtonClick(e); // Trigger the Find button click when Enter is pressed
		}
	};

	return (
		<form
			onSubmit={handleFindButtonClick}
			className="flex flex-col md:flex-row gap-x-2 md:gap-y-0 gap-y-3 items-center justify-center"
		>
			<InputField
				className={'w-full sm:w-[300px]'}
				placeholder={'Enter a restaurant name or postcode'}
				value={input}
				onChange={handleInputChange}
				onKeyPress={handleKeyPress} // Add keypress listener here
				type={'text'}
				error={inputError}
			/>
			<button
				className="px-4 py-2 bg-button text-white rounded-md hover:bg-buttonHover focus:outline-none gap-2 w-full flex items-center justify-center"
				disabled={loading}
				onClick={handleFindButtonClick}
			>
				Find
				{loading ? <Spinner /> : null}
			</button>
		</form>
	);
}
