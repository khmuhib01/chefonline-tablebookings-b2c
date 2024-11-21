import React from 'react';
import Skeleton from './../../../ui-share/Skeleton';

export default function RenderSkeletonFilteredBy() {
	return (
		<div className="px-5 bg-white rounded-md">
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-5 py-3">
					<div className="flex justify-between items-center">
						<Skeleton width="60px" height="20px" />
						<Skeleton width="60px" height="20px" />
					</div>

					<div className="flex flex-wrap gap-2">
						{[...Array(3)].map((_, index) => (
							<Skeleton key={index} width="80px" height="30px" className="rounded" />
						))}
					</div>
				</div>

				<span className="h-[1px] bg-gray-200"></span>

				<div className="flex flex-col gap-5 py-3">
					<div className="flex justify-between items-center">
						<Skeleton width="60px" height="20px" />
					</div>

					<div className="flex flex-col gap-2">
						{[...Array(5)].map((_, index) => (
							<div key={index} className="flex gap-2 items-center">
								<Skeleton width="20px" height="20px" className="rounded" />
								<Skeleton width="80px" height="20px" />
							</div>
						))}
						<Skeleton width="60px" height="20px" />
					</div>
				</div>

				<span className="h-[1px] bg-gray-200"></span>

				<div className="flex flex-col gap-5 py-3">
					<div className="flex justify-between items-center">
						<Skeleton width="60px" height="20px" />
						<Skeleton width="40px" height="20px" />
					</div>
				</div>
			</div>
		</div>
	);
}
