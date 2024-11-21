import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {MdOutlineLocationSearching} from 'react-icons/md';
import {useDispatch, useSelector} from 'react-redux';
import {setLocation, setFindRestaurant} from './../../store/reducers/locationSlice';

export default function SearchComponent() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useSelector((state) => state.location.location);
	const findRestaurant = useSelector((state) => state.location.findRestaurant);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const path = useLocation();

	const handleNearbyMeClick = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const {latitude, longitude} = position.coords;
					const coordinates = [latitude.toString(), longitude.toString()];
					dispatch(setLocation(coordinates));
					setDropdownVisible(false);
					navigate(`search-result?location=${coordinates.join(',')}&findRestaurant=${findRestaurant}`);
				},
				(error) => {
					console.error('Error obtaining location', error);
					alert('Unable to obtain your location. Please try again.');
				}
			);
		} else {
			alert('Geolocation is not supported by your browser.');
		}
	};

	useEffect(() => {
		if (path.pathname === '/') {
			dispatch(setFindRestaurant(''));
			dispatch(setLocation('London'));
		} else {
			setDropdownVisible(false);
		}
	}, [path, dispatch]);

	return (
		<div className="flex flex-col md:flex-row gap-x-5 md:gap-y-0 gap-y-3 items-center justify-center">
			<input
				type="text"
				placeholder="Find restaurants or cuisines"
				className="px-4 py-2 sm:w-[300px] w-full border border-gray-300 rounded-md focus:outline-none focus:shadow"
				value={findRestaurant}
				onChange={(e) => dispatch(setFindRestaurant(e.target.value))}
			/>

			{/* Location input with dropdown */}
			<div
				className="w-full sm:w-auto"
				onMouseLeave={() => setDropdownVisible(false)}
				onFocus={() => setDropdownVisible(true)}
			>
				<div className="relative">
					<input
						type="text"
						value={Array.isArray(location) ? location.join(', ') : location}
						onFocus={() => setDropdownVisible(true)}
						readOnly
						className="px-4 py-2 sm:w-[300px] w-full border border-gray-300 rounded-md focus:outline-none focus:rounded-b-none focus:shadow"
						style={dropdownVisible ? {borderBottomLeftRadius: 0, borderBottomRightRadius: 0} : null}
					/>
					<div className="absolute right-2 top-2.5 border-l pl-2">
						<MdOutlineLocationSearching
							className="w-5 h-5 text-gray-400"
							onClick={() => setDropdownVisible(!dropdownVisible)}
						/>
					</div>
					{dropdownVisible && (
						<div className="absolute w-full bg-white border-gray-300 border-b border-l border-r z-10 rounded-b-md">
							<div className="p-2">
								<button
									onClick={handleNearbyMeClick}
									className="flex items-center space-x-2 p-2 hover:bg-gray-100 w-full text-left"
								>
									<MdOutlineLocationSearching className="w-5 h-5 text-gray-400" />
									<span>Near me</span>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Find button */}
			<button
				className="px-4 py-2 bg-button text-white rounded-md hover:bg-buttonHover focus:outline-none"
				onClick={() => navigate(`search-result?location=${location}&findRestaurant=${findRestaurant}`)}
			>
				Find
			</button>
		</div>
	);
}
