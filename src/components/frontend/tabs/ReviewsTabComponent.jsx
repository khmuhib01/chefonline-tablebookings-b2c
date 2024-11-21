import React, {useState} from 'react';

export default function ReviewsTabComponent({details}) {
	const [selected, setSelected] = useState('Relevance');
	const [isOpen, setIsOpen] = useState(false);

	const options = ['Most recent', 'Hightest rated', 'Lowest rated'];

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelect = (option) => {
		setSelected(option);
		setIsOpen(false);
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col gap-3">
				<h2 className="text-3xl font-bold text-titleText leading-none">Reviews of {details?.data?.name}</h2>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-5">
					<div className="flex justify-end">
						<div className="flex-1 relative inline-block">
							<div
								className="flex justify-end items-center bg-transparent text-gray-700 rounded cursor-pointer"
								onClick={toggleDropdown}
							>
								<p className="text-sm text-bodyText">{selected}</p>
								<svg
									className="w-4 h-4 ml-2 text-bodyText"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</div>
							{isOpen && (
								<div className="absolute right-0 mt-2 min-w-[140px] bg-white rounded shadow-lg">
									{options.map((option, index) => (
										<div
											key={index}
											onClick={() => handleSelect(option)}
											className={`block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
												selected === option ? 'text-button' : 'text-gray-700'
											}`}
										>
											{option}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{details.data.reviews && details.data.reviews.length > 0 ? (
						details.data.reviews.map((review, index) => (
							<div key={index} className="p-4 border border-gray-200 rounded-lg">
								<p className="text-button text-xl font-semibold">
									{review.rating === 5
										? 'Excellent Service'
										: review.rating === 4
										? 'Good Service'
										: review.rating === 3
										? 'Average Service'
										: review.rating === 2
										? 'Bad Service'
										: '👎'}
								</p>
								<div className="flex items-center mt-2">
									<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											x="0px"
											y="0px"
											width="100%"
											height="100%"
											viewBox="0 0 48 48"
										>
											<circle fill-rule="evenodd" clip-rule="evenodd" fill="#BFDEE0" cx="24" cy="24" r="23"></circle>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												fill="#5A7A84"
												d="M24,16c-3.3077106,0-6,2.6914291-6,6s2.6922894,6,6,6s6-2.6914291,6-6S27.3077106,16,24,16"
											></path>
											<path
												fill-rule="evenodd"
												clip-rule="evenodd"
												fill="#335262"
												d="M27.9992676,30h-7.9985352C16.6865234,30,14,32.6780396,14,36.0032959v8.7140503C17.0238037,46.1795654,20.4160156,47,24,47s6.9761963-0.8204346,10-2.2826538v-8.7140503C34,32.6877441,31.3234863,30,27.9992676,30z"
											></path>
										</svg>
									</div>
									<p className="ml-3 text-titleText font-bold">{review?.guest_informaion?.first_name}</p>
								</div>
								<p className="mt-2 text-bodyText">{review.review}</p>
								<div className="mt-4 flex justify-between items-center">
									<div className="text-sm text-titleText">
										<p>{review.date}</p>
									</div>
									<div className="flex items-center">
										<p className="bg-button text-white px-2 py-1 rounded-lg">{review.rating}/5</p>
									</div>
								</div>
							</div>
						))
					) : (
						<p>No reviews available</p>
					)}
				</div>
			</div>
		</div>
	);
}
