import React, {useEffect, useState} from 'react';
import AccordionItem from '../components/frontend/AccordionItem';

const FaqPage = () => {
	const [openIndex, setOpenIndex] = useState(0); // Initial state with the first accordion open

	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	// Sample FAQ data
	const faqData = [
		{
			title: 'What is your return policy?',
			content:
				'You can return any item within 30 days of purchase as long as it is unused and in its original packaging.',
		},
		{
			title: 'Do you offer free shipping?',
			content: 'Yes, we offer free shipping for orders over €50.',
		},
		{
			title: 'How can I track my order?',
			content: 'Once your order has been shipped, you will receive an email with a tracking number.',
		},
		{
			title: 'Can I change my shipping address?',
			content: 'Yes, you can change your shipping address before the order is shipped by contacting customer support.',
		},
	];

	const handleToggle = (index) => {
		// If the clicked accordion is already open, close it. Otherwise, open it and close others.
		setOpenIndex(openIndex === index ? -1 : index);
	};

	return (
		<>
			{/* Banner Section */}
			<div
				className="relative bg-no-repeat bg-cover bg-center h-[400px]"
				style={{backgroundImage: 'url(/images/faq-banner.jpg)'}}
			>
				<div className="absolute inset-0 bg-black opacity-50"></div>
				<div className="container h-full flex flex-col justify-center items-center">
					<h1 className="text-white text-5xl font-bold relative z-10">Frequently Asked Questions</h1>
					<p className="text-white text-xl mt-4 relative z-10">
						Find answers to common questions about our products and services.
					</p>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="container mx-auto py-16">
				<h2 className="text-4xl font-bold text-center mb-10">Common Questions</h2>
				<div className="max-w-2xl mx-auto flex flex-col gap-5">
					{faqData.map((item, index) => (
						<AccordionItem
							key={index}
							title={item.title}
							isOpen={openIndex === index} // Keep the clicked accordion open, close others
							onToggle={() => handleToggle(index)}
							icon={<span>Q{index + 1}</span>} // Example Icon for FAQ
						>
							<p className="text-gray-600">{item.content}</p>
						</AccordionItem>
					))}
				</div>
			</div>
		</>
	);
};

export default FaqPage;
