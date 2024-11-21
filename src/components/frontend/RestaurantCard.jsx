import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {appConfig} from '../../AppConfig';
import {nullImage} from '../../ui-share/Image';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const RestaurantCard = ({restaurant}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const imageBaseUrl = appConfig.baseUrl;
	const image = restaurant.avatar ? `${imageBaseUrl}${restaurant.avatar}` : nullImage;

	return (
		<Link
			to={`/restaurant-details/${restaurant.uuid}`}
			className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden md:items-center"
		>
			<div className="flex-shrink-0 w-full md:w-[250px] h-[200px]">
				<LazyLoadImage
					className={`h-full w-full object-cover ${isLoaded ? '' : 'blur'}`}
					src={image}
					alt={restaurant.name || 'Restaurant Image'}
					effect="blur"
					afterLoad={() => {
						setIsLoaded(true);
					}}
					wrapperClassName="h-full w-full" // Ensures the wrapper div has full height and width
				/>
			</div>
			<div className="flex-grow md:border-r border-r-none border-gray-200 p-3">
				<div className="flex flex-col gap-3">
					<h2 className="font-bold text-[#4D5565] leading-none">{restaurant.name}</h2>
					<div className="flex flex-col gap-1">
						<p className="text-bodyText text-sm">{restaurant.address}</p>
						<p className="text-bodyText text-sm">
							<span className="font-bold">{restaurant.category_list?.name || 'N/A'}</span> restaurant
						</p>
					</div>
					<div className="flex flex-wrap gap-2">
						{restaurant.label_tags && restaurant.label_tags.length > 0 ? (
							restaurant.label_tags.map((tag, index) => (
								<span key={index} className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full capitalize">
									{tag?.name ? tag.name : 'N/A'}
								</span>
							))
						) : (
							<span className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded-full capitalize">N/A</span>
						)}
					</div>
				</div>
			</div>
			<div className="flex-shrink-0 flex flex-col items-center justify-center px-10 py-3 border-t md:border-t-0 border-gray-200">
				{restaurant.reviews && restaurant.reviews.length > 0 ? (
					<>
						<div className="text-white bg-button font-semibold rounded-full px-3 py-1">
							{restaurant.reviews[0].rating}/<span className="text-[14px]">5</span>
						</div>
						<div className="text-gray-500 text-sm">{restaurant.reviews.length} reviews</div>
					</>
				) : (
					<>
						<div className="text-white bg-button font-semibold rounded-full px-3 py-1">
							0/<span className="text-[14px]">5</span>
						</div>
						<div className="text-gray-500 text-sm">No reviews</div>
					</>
				)}
			</div>
		</Link>
	);
};

export default RestaurantCard;
