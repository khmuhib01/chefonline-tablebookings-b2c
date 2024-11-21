import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import PageTitle from '../components/PageTitle';

export default function RegistrationSuccess() {
	const navigate = useNavigate();

	const storeGuestUserInfo = useSelector((state) => state.guestUser);

	const handleLogin = () => {
		navigate('/sign-in');
		localStorage.removeItem('registrationStatus');
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);
	return (
		<>
			<PageTitle title="Registration Success" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold leading-none">
								{storeGuestUserInfo.guestUser.message}
							</h1>

							<div className="flex flex-col gap-3 bg-white max-w-[600px] mx-auto rounded-lg shadow-lg w-full border text-center p-5">
								<h2 className="text-xl font-bold text-titleText leading-none capitalize">
									Thanks,{' '}
									{storeGuestUserInfo?.guestUser?.data?.first_name +
										' ' +
										storeGuestUserInfo?.guestUser?.data?.last_name}
								</h2>
								<p className="text-bodyText">
									We sent a confirmation email to {storeGuestUserInfo?.guestUser?.data?.email}. please check your mail
								</p>
								<div className="flex items-center gap-3">
									<button
										type="button"
										className="w-full bg-button text-white py-2 rounded-lg hover:bg-buttonHover focus:outline-none focus:ring-2"
										onClick={handleLogin}
									>
										Sign in now
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
