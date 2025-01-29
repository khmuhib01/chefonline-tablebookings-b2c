import React from 'react';
import {appConfig} from '../../../AppConfig';
import {PhotoProvider, PhotoView} from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

export default function MenuTabComponent({details, files}) {
	const imageBaseUrl = appConfig.baseUrl;

	// Filter files for images and PDFs
	const menuImage = files?.find(
		(file) =>
			file.image.toLowerCase().endsWith('.png') ||
			file.image.toLowerCase().endsWith('.jpg') ||
			file.image.toLowerCase().endsWith('.jpeg')
	);
	const menuPdf = files?.find((file) => file.image.toLowerCase().endsWith('.pdf'));

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3">
				<h2 className="text-3xl font-bold text-titleText">Menu from {details?.data?.name}</h2>
				<p className="text-bodyText">{details?.data?.menu_description?.description}</p>
			</div>

			{/* Menu Image and PDF Cards */}

			<div className="flex gap-5">
				{/* Menu Image Card with Photo Viewer */}
				{menuImage ? (
					<div className="w-64 h-40 bg-white rounded-md shadow-md flex flex-col items-center justify-center p-3">
						<div className="w-full h-28 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
							<PhotoProvider>
								<PhotoView src={`${imageBaseUrl}/${menuImage.image}`}>
									<img
										src={`${imageBaseUrl}/${menuImage.image}`}
										alt="Menu"
										className="w-full h-full object-cover rounded-md cursor-pointer"
									/>
								</PhotoView>
							</PhotoProvider>
						</div>
						<p className="text-sm text-gray-700 mt-2">Click to view</p>
					</div>
				) : null}

				{/* PDF Card */}
				{menuPdf ? (
					<div className="w-64 h-40 bg-white rounded-md shadow-md flex flex-col items-center justify-center p-3">
						<div className="w-full h-28 bg-gray-300 rounded-md flex items-center justify-center">
							<a
								href={`${imageBaseUrl}/${menuPdf.image}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 font-semibold underline"
							>
								View PDF
							</a>
						</div>
						<p className="text-sm text-gray-700 mt-2">Download Menu PDF</p>
					</div>
				) : null}
			</div>

			{/* Menu Highlights Section */}
			<div className="flex flex-col gap-5 bg-[#232833] rounded-md px-5 py-7">
				<h3 className="text-white text-2xl font-bold leading-none">Menu highlights</h3>
				<div className="flex flex-col gap-5 w-full">
					{details?.data?.categories && details.data.categories.length > 0 ? (
						details.data.categories.map((item, index) => (
							<div key={index} className="flex flex-col gap-3">
								<div className="flex gap-3">
									{/* Category Name */}
									<div className="flex flex-col gap-3 w-full">
										<p className="text-white text-xl font-bold">{item.name}</p>
										{item?.menus?.map((menu, index) => (
											<div key={index} className="flex flex-col sm:pl-5 ml-5">
												<div className="flex justify-between items-center">
													<h4 className="text-white font-bold">{menu.name}</h4>
													<p className="text-white font-bold">
														{menu.symbol}
														{menu.price}
													</p>
												</div>
												<p className="text-slate-400 italic">{menu.description}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						))
					) : (
						<p className="text-white">No menu found</p>
					)}
				</div>
			</div>
		</div>
	);
}
