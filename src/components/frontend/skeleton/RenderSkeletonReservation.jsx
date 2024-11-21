import React from 'react';

export default function RenderSkeletonReservation() {
	return (
		<div className="lg:col-span-4">
			<div className="bg-white p-2 rounded-md sticky top-[120px]">
				<div className="flex flex-col gap-3">
					<div className="h-64 bg-gray-200 rounded-md"></div>
					<div className="flex justify-center">
						<div className="h-12 bg-gray-200 rounded w-40"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
