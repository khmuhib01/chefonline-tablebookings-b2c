import React from 'react';
import {Tag, Map, WebLink, Phone, Time} from './../../../ui-share/Icon';
import {Link} from 'react-router-dom';

export default function AboutTabComponent({details}) {
	const getDayName = () => {
		const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
		const today = new Date();
		return days[today.getDay()];
	};

	const convertTo12HourFormat = (time) => {
		const [hour, minute] = time.split(':');
		const hourNumber = parseInt(hour, 10);
		const period = hourNumber >= 12 ? 'PM' : 'AM';
		const adjustedHour = hourNumber % 12 || 12;
		return `${adjustedHour}:${minute} ${period}`;
	};

	const todayDayName = getDayName();
	const todaySlots = details?.data?.aval_slots?.[todayDayName] || [];

	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col gap-3">
				<h3 className="text-3xl font-bold text-titleText">About {details?.data?.name || 'Restaurant name'}</h3>
				<p className="text-bodyText">{details?.data?.description || 'Restaurant description'}</p>
			</div>
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<div className="flex">
						<Tag size={25} className="text-bodyText" />
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{details?.data?.about_label_tags?.length > 0 ? (
							details.data.about_label_tags.map((tag, index) => (
								<span key={index} className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full uppercase">
									{tag?.name || 'N/A'}
								</span>
							))
						) : (
							<span className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full uppercase">N/A</span>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-3">
				<div className="flex md:flex-row flex-col gap-10">
					<div className="flex-1">
						<div className="flex-col space-y-5">
							<div className="flex items-center gap-4">
								<WebLink size={25} className="text-bodyText" />

								{details?.data?.website ? (
									<Link
										to={details.data.website}
										target="_blank"
										className="underline font-bold text-bodyText w-52 hover:text-titleText"
									>
										Website
									</Link>
								) : (
									<span className="font-bold text-bodyText w-52 cursor-not-allowed">No Website Available</span>
								)}
							</div>
							<div className="flex items-center gap-4">
								<Phone size={25} className="text-bodyText" />
								<Link
									to={'tel:' + details?.data?.phone}
									className="underline font-bold text-bodyText w-52 hover:text-titleText"
								>
									{details?.data?.phone || 'N/A'}
								</Link>
							</div>
							<div className="flex items-center gap-4">
								<Map size={25} className="text-bodyText" />
								<Link
									to={'https://www.google.com/maps/search/' + details?.data?.address}
									target="_blank"
									className="underline font-bold text-bodyText w-52 hover:text-titleText"
								>
									{details?.data?.address || 'N/A'}
								</Link>
							</div>
						</div>
					</div>
					<div className="flex-1">
						<div className="flex flex-col gap-2">
							<div className="flex justify-between mb-2">
								<div className="flex items-center gap-2">
									<Time size={20} className="text-button" />
									<span className="text-button font-bold">Open today</span>
								</div>
								{todaySlots.length > 0 ? (
									<span className="text-bodyText font-bold">{`Opens at ${convertTo12HourFormat(
										todaySlots[0].slot_start
									)}`}</span>
								) : (
									<span className="text-bodyText font-bold">Closed</span>
								)}
							</div>
							<ul>
								{Object.keys(details?.data?.aval_slots || {}).length > 0 ? (
									Object.entries(details.data.aval_slots).map(([day, slots]) => (
										<li key={day} className="mb-4">
											<div className="flex justify-between">
												<span className="font-bold text-bodyText capitalize">{day}</span>
												<div>
													{slots.map((slot, index) => (
														<span key={index} className="block text-right text-bodyText">
															{`${convertTo12HourFormat(slot.slot_start)} - ${convertTo12HourFormat(slot.slot_end)}`}
														</span>
													))}
												</div>
											</div>
										</li>
									))
								) : (
									<li className="mb-2">
										<div className="flex justify-between">
											<span className="font-bold text-bodyText">No available slots</span>
										</div>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
