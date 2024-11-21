import React from 'react';

export default function RenderSkeletonContent() {
	return (
		<div className="bg-white p-2 rounded-md animate-pulse">
			<div className="flex flex-col gap-10">
				{/* rest info skeleton */}
				<div className="flex flex-col gap-3">
					<div className="flex justify-between items-center">
						<div className="flex-grow">
							<div className="h-8 bg-gray-200 rounded w-3/4"></div>
							<div className="flex items-center gap-1 mt-2">
								<div className="h-6 bg-gray-200 rounded w-1/4"></div>
								<div className="h-6 bg-gray-200 rounded w-1/4"></div>
								<div className="h-6 bg-gray-200 rounded w-1/4"></div>
							</div>
							<p className="text-sm text-bodyText mt-2">
								<span className="h-6 bg-gray-200 rounded w-1/4 block"></span>
							</p>
						</div>
						<div className="flex-shrink-0 flex flex-col items-center justify-center">
							<div className="h-8 bg-gray-200 rounded-full px-3 py-1 w-16"></div>
							<div className="bg-gray-200 rounded-full px-3 py-2 mt-2 w-10"></div>
						</div>
					</div>
					<div className="h-[500px] bg-gray-200 rounded-md"></div>
				</div>
				{/* mobile reservation button skeleton */}
				<div className="lg:hidden flex flex-col gap-2">
					<div className="h-6 bg-gray-200 rounded w-1/2"></div>
					<div className="flex items-center gap-3 w-full">
						<div className="h-10 bg-gray-200 rounded w-1/2"></div>
						<div className="h-10 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>
				{/* tabs skeleton */}
				<div className="w-full">
					<div className="flex justify-between items-center bg-white">
						<div className="flex items-center gap-8">
							{['About', 'Menu', 'Photos', 'Reviews'].map((tab) => (
								<div
									key={tab}
									className={`cursor-pointer flex flex-col gap-1 border-b-[4px] border-transparent text-bodyText`}
									onClick={() => setActiveTab(tab)}
								>
									<div className="h-6 bg-gray-200 rounded w-16"></div>
								</div>
							))}
						</div>
						<div className="bg-gray-200 text-white px-4 py-1 rounded-md sm:block hidden">
							<div className="h-10 bg-gray-200 rounded w-24"></div>
						</div>
					</div>
					<div className="mt-4">
						<div className="h-96 bg-gray-200 rounded-md"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
