import React, {createContext, useState, useEffect} from 'react';
import {postGuestLogout} from '../api';

export const AuthContextGuest = createContext();

const AuthProviderGuest = ({children}) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [guest, setGuest] = useState(null);
	const [guestToken, setGuestToken] = useState(null);

	useEffect(() => {
		const storedGuest = localStorage.getItem('guest');
		const storedGuestToken = localStorage.getItem('guestToken');

		if (storedGuest && storedGuestToken) {
			setGuest(JSON.parse(storedGuest));
			setGuestToken(storedGuestToken);
			setIsAuthenticated(true);
		}
	}, []);

	const login = (guestData) => {
		const {data, token} = guestData;
		setGuest(data);
		setGuestToken(token);
		setIsAuthenticated(true);
		localStorage.setItem('guest', JSON.stringify(data));
		localStorage.setItem('guestToken', token);
	};

	const logout = async () => {
		if (!guest?.uuid) return;

		try {
			await postGuestLogout({uuid: guest.uuid, token: guestToken});
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
			clearAuthData();
		}
	};

	const clearAuthData = () => {
		setIsAuthenticated(false);
		setGuest(null);
		setGuestToken(null);
		localStorage.removeItem('guest');
		localStorage.removeItem('guestToken');
	};

	return (
		<AuthContextGuest.Provider value={{isAuthenticated, guest, guestToken, login, logout}}>
			{children}
		</AuthContextGuest.Provider>
	);
};

export default AuthProviderGuest;
