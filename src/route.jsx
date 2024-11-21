import React from 'react';
import {Routes, Route} from 'react-router-dom';

// Layouts
import FrontendHomeLayout from './layouts/FrontendHomeLayout';

// Frontend Pages
import HomePage from './pages/HomePage';
import SearchResultPage from './pages/SearchResultPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import EditReservationPage from './pages/EditReservationPage';
import GuestRegisterPage from './pages/GuestRegisterPage';
import GuestLoginPage from './pages/GuestLoginPage';
import ProfilePage from './pages/ProfilePage';
import RegistrationSuccess from './pages/RegistrationSuccess';
import TestPage from './pages/TestPage';
import PageNotFound from './pages/PageNotFound';
import ForgotPassword from './pages/ForgotPassword';
import OtpVerification from './pages/OtpVerification';

// Route Guards
import GuestProtectedRoute from './utils/GuestProtectedRoute';
import RegistrationSuccessRoute from './utils/RegistrationSuccessRoute';
import ThankYouRoute from './utils/ThankYouRoute';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import ResetPassword from './pages/ResetPassword';

const AppRoutes = () => {
	return (
		<Routes>
			{/* Frontend Routes */}
			<Route path="/" element={<FrontendHomeLayout />}>
				<Route index element={<HomePage />} />
				<Route path="search-result/*" element={<SearchResultPage />} />
				<Route path="restaurant-details/:restaurantId" element={<RestaurantDetailsPage />} />
				<Route path="checkout" element={<CheckoutPage />} />
				<Route
					path="thank-you"
					element={
						<ThankYouRoute>
							<ThankYouPage />
						</ThankYouRoute>
					}
				/>
				<Route path="edit-reservation" element={<EditReservationPage />} />
				<Route path="test" element={<TestPage />} />
				<Route path="*" element={<PageNotFound />} />

				<Route path="sign-in" element={<GuestLoginPage />} />
				<Route path="sign-up" element={<GuestRegisterPage />} />

				<Route path="faq" element={<FaqPage />} />
				<Route path="privacy-policy" element={<PrivacyPolicyPage />} />
				<Route path="terms-and-conditions" element={<TermsAndConditionsPage />} />
				<Route path="contact" element={<ContactPage />} />
				<Route path="about-us" element={<AboutUsPage />} />

				{/* Protected routes for guest login */}
				<Route
					path="profile"
					element={
						<GuestProtectedRoute redirectTo="/sign-in">
							<ProfilePage />
						</GuestProtectedRoute>
					}
				/>

				<Route
					path="registration-success"
					element={
						<RegistrationSuccessRoute>
							<RegistrationSuccess />
						</RegistrationSuccessRoute>
					}
				/>

				<Route path="forgot-password" element={<ForgotPassword />} />
				<Route path="otp-verification" element={<OtpVerification />} />
				<Route path="reset-password" element={<ResetPassword />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
