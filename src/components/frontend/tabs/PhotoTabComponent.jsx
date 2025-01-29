import React from 'react';
import {appConfig} from './../../../AppConfig';
import {PhotoProvider, PhotoView} from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function PhotoTabComponent({details}) {
	const imageBaseUrl = appConfig.baseUrl;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3">
				<h2 className="text-3xl font-bold text-titleText leading-none">Photos of {details?.data?.name}</h2>
				<p className="text-bodyText">{details?.data?.photo_description?.description}</p>
			</div>

			{/* Photo Gallery with Photo Viewer */}
			<PhotoProvider>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{details?.data?.photo &&
					details.data.photo.length > 0 &&
					details.data.photo.some((photo) => photo.avatar !== null) ? (
						details.data.photo
							.filter((photo) => photo.avatar !== null)
							.map((photo) => (
								<PhotoView key={photo.id} src={imageBaseUrl + photo.avatar}>
									<img
										src={imageBaseUrl + photo.avatar}
										alt="restaurant_photo"
										className="w-full h-40 object-cover rounded-md cursor-pointer"
									/>
								</PhotoView>
							))
					) : (
						<p>No photos available</p>
					)}
				</div>
			</PhotoProvider>
		</div>
	);
}
