import React from 'react';

export default function MenuTabComponent({details}) {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3">
				<h2 className="text-3xl font-bold text-titleText">Menu from {details?.data?.name}</h2>
				<p className="text-bodyText">{details?.data?.menu_description?.description}</p>
			</div>
			<div className="flex flex-col gap-5 bg-[#232833] rounded-md px-5 py-7">
				<h3 className="text-white text-2xl font-bold leading-none">Menu highlights</h3>
				<div className="flex flex-col gap-5 w-full">
					{details?.data?.categories && details.data.categories.length > 0 ? (
						details.data.categories.map((item, index) => (
							<div key={index} className="flex flex-col gap-3">
								<div className="flex gap-3">
									{item.name === 'PAPADAM' ? (
										<div className="w-7 h-7 text-white">
											<svg width="100%" height="100%" viewBox="0 0 32 34" xmlns="http://www.w3.org/2000/svg">
												<title>PAPADAM Icon</title>
												<g fill="currentColor" fillRule="evenodd">
													<path d="M12.274 2.344C9.15 2.344 6.4 3.401 4.4 5.401 2.028 7.774.982 11.204 1.455 15.06c.48 3.913 2.463 7.786 5.581 10.905 3.119 3.118 6.992 5.1 10.905 5.58 3.855.475 7.285-.572 9.658-2.945 2.373-2.373 3.419-5.803 2.946-9.658-.48-3.913-2.463-7.786-5.581-10.905-3.119-3.118-6.992-5.1-10.905-5.58a14.624 14.624 0 0 0-1.785-.112zm7.458 30.592c-.636 0-1.286-.04-1.947-.12-4.195-.516-8.334-2.628-11.654-5.947C2.811 23.549.7 19.41.185 15.215-.337 10.96.839 7.154 3.496 4.496 6.154 1.84 9.96.662 14.215 1.185c4.195.515 8.334 2.627 11.654 5.946 3.32 3.32 5.431 7.459 5.946 11.654.522 4.255-.654 8.061-3.311 10.719-2.245 2.245-5.31 3.432-8.772 3.432z"></path>
													<path d="M8.844 6.3c-.758 0-1.66.39-2.376 1.107-.585.585-.968 1.292-1.078 1.99-.098.623.038 1.156.384 1.502.346.346.88.482 1.502.384.698-.11 1.405-.493 1.99-1.078C10.4 9.07 10.718 7.47 9.96 6.713c-.28-.28-.673-.413-1.116-.413zm-1.957 6.294c-.797 0-1.5-.272-2.018-.79-.643-.643-.907-1.569-.743-2.607.152-.963.662-1.92 1.437-2.695 1.653-1.654 4.032-1.965 5.302-.694 1.27 1.27.959 3.649-.694 5.302-.775.774-1.732 1.285-2.695 1.437a3.77 3.77 0 0 1-.59.047z"></path>
												</g>
											</svg>
										</div>
									) : (
										<div className="w-7 h-7 text-white">
											<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
												<title>Default Icon</title>
												<g stroke="currentColor" fill="none" fillRule="evenodd">
													<path d="M3.4 15.9l3.9 15.6h16.4l3.9-15.6M12.5 31.5l-1-8M18.5 31.5l1-8"></path>
													<path d="M25 5.6c-.8 0-1.5.2-2.2.5-1.3-2.7-4.1-4.6-7.3-4.6s-6 1.9-7.3 4.6c-.7-.3-1.5-.5-2.2-.5C3 5.6.5 8 .5 11.1c0 3 2.4 5.5 5.5 5.5 1.3 0 2.6-.5 3.5-1.3 1.5 1.6 3.6 2.7 6 2.7s4.5-1 6-2.7c1 .8 2.2 1.3 3.5 1.3 3 0 5.5-2.4 5.5-5.5S28.1 5.6 25 5.6zM25.5 10.5l-1-1M6.5 11.5l-1-1M13.5 7.5l1-1M18.5 12.5v-1"></path>
												</g>
											</svg>
										</div>
									)}
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
