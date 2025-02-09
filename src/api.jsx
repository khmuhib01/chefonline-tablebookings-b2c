import axios from 'axios';
const baseURL = 'https://apiservice.tablebookings.co.uk/api/v1/';
// const baseURL = 'https://quandoo.chefonlinetest.co.uk/api/v1/';
import {getGuestToken, getToken} from './utils/storage';

const api = axios.create({
	baseURL,
	maxRedirects: 5,
});

const getRestaurantData = async (name, post_code, per_page) => {
	try {
		const {data} = await api.get(`/user/search-restaurant`, {
			params: {name, post_code, per_page},
		});
		return data;
	} catch (error) {
		console.error('Error fetching restaurant data:', error);
		throw error;
	}
};

const getRestaurantDataByPage = async (page) => {
	try {
		const {data} = await api.get(`/user/search-restaurant?page=${page}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant data:', error);
		throw error;
	}
};

const getCategoryData = async () => {
	try {
		const {data} = await api.get('/user/category');
		return data;
	} catch (error) {
		console.error('Error fetching category data:', error);
		throw error;
	}
};

const getAllRestaurants = async () => {
	try {
		const {data} = await api.get('/user/restaurant');
		return data;
	} catch (error) {
		console.error('Error fetching restaurant data:', error);
		throw error;
	}
};

const fetchTopRestaurantListApi = async () => {
	try {
		const {data} = await api.get('/user/restaurant-top-review');
		return data;
	} catch (error) {
		console.error('Error fetching restaurant data:', error);
		throw error;
	}
};

const getRestaurantDetails = async (id) => {
	try {
		const {data} = await api.get(`/user/restaurant-single-info/${id}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant details:', error);
		throw error;
	}
};

const getRestaurantAvailableDate = async (id, date, day) => {
	try {
		const {data} = await api.get(`/user/restaurant-single-info/${id}?date=${date}&day=${day}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant availability:', error);
		throw error;
	}
};

const getGuestReservationId = async (params, startTime, endTime, date, day, status, rest_id, people, uuid) => {
	try {
		const {data} = await api.get(
			`/user/reservation/reservation-time-hold?params=${params}&start_time=${startTime}&end_time=${endTime}&date=${date}&day=${day}&status=${status}&rest_uuid=${rest_id}&number_of_people=${people}&uuid=${uuid}`
		);
		return data;
	} catch (error) {
		console.error('Error fetching guest reservation data:', error);
		throw error;
	}
};

const postGuestRegister = async (data) => {
	try {
		const {data: response} = await api.post('/user/guest-register', data);
		return response;
	} catch (error) {
		console.error('Error registering guest:', error);
		throw error;
	}
};

const getGuestReservation = async (
	reservationUUid,
	guestId,
	status,
	restUUId,
	startTime,
	endTime,
	date,
	day,
	numberOfPeople,
	userSpecialRequest
) => {
	console.log('userSpecialRequest..........api', userSpecialRequest);
	try {
		const {data} = await api.get(
			`/user/reservation/reservation-book?reservation_uuid=${reservationUUid}&guest_id=${guestId}&status=${status}&rest_uuid=${restUUId}&start_time=${startTime}&end_time=${endTime}&date=${date}&day=${day}&number_of_people=${numberOfPeople}&noted=${userSpecialRequest}`
		);

		console.log('Data', data);
		return data;
	} catch (error) {
		console.error('Error fetching guest reservation:', error);
		throw error;
	}
};

const getRemoveReservation = async (reservationUUId) => {
	try {
		const {data} = await api.get(`/user/reservation/reservation-removed?reservation_uuid=${reservationUUId}`);
		return data;
	} catch (error) {
		console.error('Error removing reservation:', error);
		throw error;
	}
};

const postUserLogin = async (data) => {
	try {
		const {data: response} = await api.post('/user/login', data);
		return response;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

const postGuestLogin = async (data) => {
	try {
		const {data: response} = await api.post('/user/guest-login', data);
		return response;
	} catch (error) {
		console.error('Error logging in:', error);
		throw error;
	}
};

const postForgotPassword = async (data) => {
	try {
		const {data: response} = await api.post(`user/forget-password?email=${data}`);
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const otpVerify = async (email, otp) => {
	try {
		const {data: response} = await api.post(`user/verify-otp?email=${email}&otp=${otp}`);
		return response;
	} catch (error) {
		console.error('Error fetching restaurant search:', error);
		throw error;
	}
};

const resetPassword = async (email, password) => {
	try {
		const {data: response} = await api.post(`user/password-update?email=${email}&password=${password}`);
		return response;
	} catch (error) {
		console.error('Error fetching reset password:', error);
		throw error;
	}
};

const guestContactUs = async (data) => {
	try {
		const {data: response} = await api.post('/user/contact-us', data);
		return response;
	} catch (error) {
		console.error('Error fetching contact us:', error);
		throw error;
	}
};

/* Backend */

const postUserLogout = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/logout', data, {headers});
		return response;
	} catch (error) {
		console.error('Error logging out:', error);
		throw error;
	}
};

const postGuestLogout = async (data) => {
	const token = getGuestToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/secure/guest-logout', data, {headers});
		return response;
	} catch (error) {
		console.error('Error logging out:', error);
		throw error;
	}
};

const getReservationListByGuestId = async (guestId) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.get(`/user/reservation/reservation-info/${guestId}`, {headers});
		return response;
	} catch (error) {
		console.error('Error fetching reservation list:', error);
		throw error;
	}
};

const getGuestReservationInfo = async (restaurantId) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=info`, {
			headers,
		});
		return data;
	} catch (error) {
		console.error('Error fetching guest reservation info:', error);
		throw error;
	}
};

const getCheckIn = async (restaurantId, reservationId, checkInTime) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=checkin&checkin_time=${checkInTime}&uuid=${reservationId}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking in:', error);
		throw error;
	}
};

const getCheckedOut = async (restaurantId, reservationId, checkedOut) => {
	const token = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data} = await api.get(
			`secure/restaurant/reservation-for-restaurant?rest_uuid=${restaurantId}&params=checkout&uuid=${reservationId}&checkout_time=${checkedOut}`,
			{
				headers,
			}
		);
		return data;
	} catch (error) {
		console.error('Error checking out:', error);
		throw error;
	}
};


const restaurantMenuImageOrPdf = async (data) => {
	const token = getToken();
	const headers = {
		'Content-Type': 'multipart/form-data',
		Authorization: `Bearer ${token}`,
	};

	try {
		const {data: response} = await api.post('/user/menus-photo-upload', data, {headers});
		return response;
	} catch (error) {
		console.error('Error creating restaurant:', error);
		throw error;
	}
};

const postResendEmail = async (email) => {
	try {
		const {data: response} = await api.post(`/user/resend-email?email=${email}`);
		return response;
	} catch (error) {
		console.error('Error Resend Email:', error);
		throw error;
	}
};

export {
	api,
	getRestaurantData,
	getCategoryData,
	getRestaurantDataByPage,
	getRestaurantDetails,
	getRestaurantAvailableDate,
	getGuestReservationId,
	postGuestRegister,
	getGuestReservation,
	postUserLogin,
	postUserLogout,
	postGuestLogin,
	postGuestLogout,
	getGuestReservationInfo,
	getCheckIn,
	getCheckedOut,
	getRemoveReservation,
	getReservationListByGuestId,
	getAllRestaurants,
	postForgotPassword,
	otpVerify,
	resetPassword,
	fetchTopRestaurantListApi,
	guestContactUs,
	restaurantMenuImageOrPdf,
	postResendEmail,
};
