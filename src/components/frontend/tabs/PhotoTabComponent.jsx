import React from 'react';
import {appConfig} from './../../../AppConfig';

export default function PhotoTabComponent({details}) {
	// const imageBaseUrl = 'https://quandoo.chefonlinetest.co.uk/';

	const imageBaseUrl = appConfig.baseUrl;
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3">
				<h2 className="text-3xl font-bold text-titleText leading-none">Photos of {details?.data?.name}</h2>
				<p className="text-bodyText">{details?.data?.photo_description?.description}</p>
			</div>
			<div className="flex flex-col gap-2">
				{details?.data?.photo &&
				details.data.photo.length > 0 &&
				details.data.photo.some((photo) => photo.avatar !== null) ? (
					details.data.photo
						.filter((photo) => photo.avatar !== null)
						.map((photo) => (
							<img
								src={imageBaseUrl + photo.avatar}
								alt="rest_01"
								className="w-full max-h-[400px] object-cover"
								key={photo.id}
							/>
						))
				) : (
					<p>No photos available</p>
				)}
			</div>
		</div>
	);
}
