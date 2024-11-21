import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {People, Calendar, Time} from '../ui-share/Icon';
import ReservationComponent from '../components/frontend/ReservationComponent';
import PageTitle from '../components/PageTitle';

export default function EditReservationPage() {
	const navigator = useNavigate();

	const handReservationSubmit = () => {
		navigator('/thank-you');
	};

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);
	return (
		<>
			<PageTitle title="Edit reservation" description="Home Page Description" />
			<div className="bg-[#F7F8FA] py-10">
				<div className="container px-2">
					<div className="flex flex-col gap-16 w-full">
						<div className="flex flex-col gap-5">
							<h1 className="text-center text-2xl text-titleText font-bold">Your reservation is confirmed</h1>

							<div className="bg-white max-w-[600px] mx-auto rounded-lg shadow-lg w-full border">
								<div className="flex flex-col">
									<div className="flex justify-between items-center border-b py-2 px-4 gap-x-3">
										<h1 className="text-lg text-titleText font-bold">Pizzeria DIRETTO 2.0 - acqua e farina</h1>
										{/* <span className="text-button font-bold cursor-pointer" onClick={handleReservationEdit}>
										{isReservationEdit ? 'Cancel' : 'Edit'}
									</span> */}
									</div>
									<div>
										<div className="grid grid-cols-3">
											<div className="flex justify-center items-center gap-2 py-4">
												<People size={22} className="text-bodyText" />
												<span className="text-bodyText">2 people</span>
											</div>
											<div className="flex justify-center items-center gap-2 border-x py-4">
												<Calendar size={22} className="text-bodyText" />
												<span className="text-bodyText">3 July</span>
											</div>
											<div className="flex justify-center items-center gap-2 py-4">
												<Time size={22} className="text-bodyText" />
												<span className="text-bodyText">12:45 PM</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-3 bg-white max-w-[600px] mx-auto rounded-lg shadow-lg w-full border text-center p-5">
								<ReservationComponent />
								<button
									type="submit"
									className="w-full bg-button text-white py-2 rounded-lg hover:bg-buttonHover focus:outline-none focus:ring-2"
									onClick={handReservationSubmit}
								>
									Reservation submit
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
