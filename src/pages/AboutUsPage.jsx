import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';

const AboutUsPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			{/* Banner Section */}
			<div
				className="relative bg-no-repeat bg-cover bg-center h-[400px]"
				style={{backgroundImage: 'url(/images/about-banner.jpg)'}}
			>
				<div className="absolute inset-0 bg-black opacity-50"></div>
				<div className="container h-full flex flex-col justify-center items-center">
					<h1 className="text-white text-5xl font-bold relative z-10">About Us</h1>
					<p className="text-white text-xl mt-4 relative z-10">Learn more about our mission, vision, and values.</p>
				</div>
			</div>

			{/* About Us Content Section */}
			<div className="container mx-auto py-16">
				<h2 className="text-4xl font-bold text-center mb-10">Our Story</h2>
				<div className="max-w-4xl mx-auto text-center text-gray-600">
					<p className="mb-6">
						Welcome to{' '}
						<Link to="/" className="text-button">
							TableBookings.com
						</Link>
						, your go-to platform for hassle-free restaurant reservations. Whether you’re planning a cosy dinner for two
						or a special celebration with friends, we make finding and booking the perfect table simple and convenient.
					</p>
					<p className="mb-6">
						At TableBookings.com, we believe dining out should be enjoyable from the moment you decide where to go.
						That’s why our user-friendly platform lets you browse a wide selection of top restaurants across the UK,
						view real-time availability, and secure your reservation in just a few clicks. No more waiting on hold or
						last-minute scrambling—just easy, seamless bookings at your fingertips.
					</p>
					<p className="mb-6">
						We’re passionate about connecting you with great dining experiences, whether you’re exploring new cuisines
						or sticking with your favourites. With TableBookings.com, you can reserve a table that suits your schedule
						and your taste, giving you more time to enjoy what matters most—fantastic food and great company.
					</p>
					<p className="mb-6">
						Discover dining made easy with{' '}
						<Link to="/" className="text-button">
							TableBookings.com
						</Link>{' '}
						your new way to reserve.
					</p>
				</div>
			</div>
		</>
	);
};

export default AboutUsPage;
