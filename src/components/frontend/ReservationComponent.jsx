import React, {useEffect, useState} from 'react';
import {People, Calendar, Time} from './../../ui-share/Icon';
import {useDispatch, useSelector} from 'react-redux';
import {
	setPerson,
	setDate,
	setDay,
	setResId,
	setStartTime,
	setEndTime,
	setReservationId,
	setReservation_message,
} from './../../store/reducers/reservationSlice';
import {getRestaurantAvailableDate, getGuestReservationId} from '../../api';
import Loader from '../Loader';
import {formatDate, formatDateAndDay, formatTime} from '../../utils/conversions';
import AccordionItem from './AccordionItem';
import {DayPicker, getDefaultClassNames} from 'react-day-picker';
import 'react-day-picker/style.css';
import {useLocation} from 'react-router-dom';

const ReservationComponent = () => {
	const [openIndex, setOpenIndex] = useState(2);
	const [selectedPerson, setSelectedPerson] = useState(null);
	const [selectedDate, setSelectedDate] = useState();
	const [availableTimes, setAvailableTimes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const defaultClassNames = getDefaultClassNames();
	const path = useLocation();

	const today = formatDate(new Date());
	const tomorrow = formatDate(new Date(Date.now() + 86400000));

	const storePerson = useSelector((state) => state.reservations.currentReservation.person);
	const storeDay = useSelector((state) => state.reservations.currentReservation.day);
	const storeDate = useSelector((state) => state.reservations.currentReservation.date);
	const storeStartTime = useSelector((state) => state.reservations.currentReservation.start_time);
	const storeEndTime = useSelector((state) => state.reservations.currentReservation.end_time);
	const storeReservationId = useSelector((state) => state.reservations.currentReservation.reservation_id);
	const storeReservationUUID = useSelector((state) => state.reservations.currentReservation.reservation_uuid);
	const storeResId = useSelector((state) => state.reservations.currentReservation.res_id);

	const storeReservation = useSelector((state) => state.reservations.currentReservation);

	const [selectedOldDate, setOldSelectedDate] = useState();
	const [storeOldPerson, setStoreOldPerson] = useState();
	const [storeOldStartTime, setStoreOldStartTime] = useState();

	useEffect(() => {
		if (storeResId) {
			dispatch(setResId(storeResId));
		}
	}, [storeResId, dispatch]);

	useEffect(() => {
		if (selectedDate) {
			const {formattedDate, dayOfWeek} = formatDateAndDay(selectedDate);
			dispatch(setDay(dayOfWeek));
			dispatch(setDate(formattedDate));
		}
	}, [selectedDate, dispatch]);

	useEffect(() => {
		fetchAvailableTimes();
	}, [storeDate, storeDay, storeResId, storeReservationId, storeResId]);

	const fetchAvailableTimes = async () => {
		try {
			setIsLoading(true);
			const data = await getRestaurantAvailableDate(storeResId, storeDate, storeDay);
			setAvailableTimes(data.available_slots);
		} catch (error) {
			console.error('Error fetching restaurant availability:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (path.pathname !== '/checkout') {
			if (availableTimes.length > 0) {
				const {start, end} = availableTimes[0];
				dispatch(setStartTime(start));
				dispatch(setEndTime(end));
			}
		}
	}, [availableTimes, dispatch]);

	const handleDateChange = (newValue) => {
		setSelectedDate(newValue);
	};

	const handlePersonClick = (person) => {
		setSelectedPerson(person);
		dispatch(setPerson(person));
	};

	const handleTimeClick = async (start_time, end_time) => {
		if (path.pathname === '/checkout') {
			if (storeReservationId != null) {
				const fetchGuestReservationResponse = await getGuestReservationId(
					'update',
					start_time,
					end_time,
					storeDate,
					storeDay,
					'hold',
					storeResId,
					storePerson,
					storeReservationUUID
				);
				dispatch(setStartTime(fetchGuestReservationResponse.data.start));
				dispatch(setEndTime(fetchGuestReservationResponse.data.end));
				dispatch(setReservationId(fetchGuestReservationResponse.data.uuid));
				dispatch(setReservation_message(fetchGuestReservationResponse.message));
			}
		} else {
			dispatch(setStartTime(start_time));
			dispatch(setEndTime(end_time));
		}
		setStoreOldStartTime(start_time); // Store the old start time
	};

	const handleToggle = (index) => {
		setOpenIndex((prevIndex) => (prevIndex === index ? -1 : index));
	};

	const getDayDisplay = () => {
		if (storeDate === today) {
			return 'Today';
		} else if (storeDate === tomorrow) {
			return 'Tomorrow';
		} else {
			return storeDate;
		}
	};

	useEffect(() => {
		if (storeDate) {
			const [day, month, year] = storeDate.split('/').map(Number);
			const date = new Date(year, month - 1, day);
			setOldSelectedDate(date);
		}
		setStoreOldPerson(storePerson);
		setStoreOldStartTime(storeStartTime);
	}, [storeDate, storePerson, storeStartTime]);

	return (
		<div className="flex flex-col gap-2">
			<AccordionItem
				title={`Person (${storePerson})`}
				icon={<People style={{fontSize: '20px'}} />}
				isOpen={openIndex === 0}
				onToggle={() => handleToggle(0)}
			>
				<div className="flex flex-col gap-3">
					<div className="flex justify-center items-center flex-wrap gap-3 max-h-[350px] overflow-auto p-2 custom-scrollbar">
						{Array.from({length: 50}, (_, i) => i + 1).map((item) => (
							<span
								key={item}
								className={`text-sm text-bodyText hover:bg-gray-300 hover:text-black shadow-md h-[40px] w-[40px] flex justify-center items-center px-2 py-1 rounded-full cursor-pointer ${
									selectedPerson === item
										? 'bg-button text-white'
										: storeOldPerson === item
										? 'bg-button text-white'
										: 'bg-white text-black'
								}`}
								onClick={() => handlePersonClick(item)}
							>
								{item}
							</span>
						))}
					</div>
				</div>
			</AccordionItem>

			<AccordionItem
				title={`Date ${getDayDisplay()}`} // Update accordion title to show selected date
				icon={<Calendar style={{fontSize: '20px'}} />}
				isOpen={openIndex === 1}
				onToggle={() => handleToggle(1)}
			>
				<DayPicker
					mode="single"
					selected={selectedOldDate ? selectedOldDate : selectedDate}
					onSelect={handleDateChange}
					classNames={{
						today: `border-amber-500`, // Add a border to today's date
						selected: `bg-button text-white font-bold rounded-full`, // Highlight the selected day
						calendar: `${defaultClassNames.calendar} shadow-lg p-5`, // Add a shadow to the calendar
						chevron: `${defaultClassNames.chevron} fill-button`, // Change the color of the chevron
					}}
					disabled={{
						before: new Date(), // Disable all dates before today
					}}
					showWeekNumber
					showOutsideDays
				/>
			</AccordionItem>

			<AccordionItem
				title={`Time (${storeStartTime ? formatTime(storeStartTime) : '00.00'} - ${
					storeEndTime ? formatTime(storeEndTime) : '00.00'
				})`}
				icon={<Time style={{fontSize: '20px'}} />}
				isOpen={true} // Always open the third accordion
				alwaysOpen={true}
				onToggle={() => handleToggle(2)}
			>
				<div className="flex flex-col gap-5">
					<div className="flex justify-start items-between flex-wrap gap-3 max-h-[350px] overflow-auto custom-scrollbar py-2">
						{isLoading ? (
							<Loader /> // Display loader while fetching data
						) : availableTimes?.length > 0 ? (
							availableTimes?.map((item) => (
								<span
									key={item.start}
									className={`text-sm text-bodyText hover:bg-gray-300 hover:text-black shadow-md flex justify-start items-center px-2 py-2 rounded-full cursor-pointer ${
										(storeStartTime === item.start && storeEndTime === item.end) ||
										(selectedOldDate && storeOldStartTime === item.start)
											? 'bg-button text-white'
											: 'bg-white text-black'
									}`}
									onClick={() => handleTimeClick(item.start, item.end)}
								>
									{`${formatTime(item.start)} - ${formatTime(item.end)}`}
								</span>
							))
						) : (
							<span className="text-sm text-bodyText">No more times available</span>
						)}
					</div>
				</div>
			</AccordionItem>
		</div>
	);
};

export default ReservationComponent;
