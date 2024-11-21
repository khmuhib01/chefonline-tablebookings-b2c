import React from 'react';

export default function RenderSkeletonRestaurantCards() {
	return (
		<div className="flex flex-col gap-3">
			{[...Array(5).keys()].map((index) => (
				<div key={index} className="animate-pulse">
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="animate-pulse flex space-x-4">
							<div className="rounded-full bg-gray-300 h-12 w-12"></div>
							<div className="flex-1 space-y-4 py-1">
								<div className="h-4 bg-gray-300 rounded w-3/4"></div>
								<div className="h-3 bg-gray-300 rounded w-1/2"></div>
								<div className="h-3 bg-gray-300 rounded w-3/4"></div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
