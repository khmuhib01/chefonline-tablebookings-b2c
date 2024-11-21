import React, {useEffect} from 'react';

const TermsAndConditionsPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			{/* Banner Section */}
			<div
				className="relative bg-no-repeat bg-cover bg-center h-[400px]"
				style={{backgroundImage: 'url(/images/terms-and-conditions.jpg)'}}
			>
				<div className="absolute inset-0 bg-black opacity-50"></div>
				<div className="container h-full flex flex-col justify-center items-center">
					<h1 className="text-white text-5xl font-bold relative z-10">Terms and Conditions</h1>
					<p className="text-white text-xl mt-4 relative z-10">
						Understand our terms and conditions before using our services.
					</p>
				</div>
			</div>

			{/* Terms and Conditions Content */}
			<div className="container mx-auto py-16">
				<h2 className="text-4xl font-bold text-center mb-10">Terms of Service</h2>
				<div className="max-w-3xl mx-auto flex flex-col gap-8">
					<section>
						<h3 className="text-2xl font-semibold">Introduction</h3>
						<p className="text-gray-600 mt-2">
							These terms and conditions outline the rules and regulations for the use of our website and services. By
							accessing this website, you accept these terms and conditions in full.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">License to Use</h3>
						<p className="text-gray-600 mt-2">
							Unless otherwise stated, we own the intellectual property rights for all material on the website. You may
							view and/or print pages from our website for your own personal use, subject to restrictions set in these
							terms and conditions.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">Acceptable Use</h3>
						<p className="text-gray-600 mt-2">
							You must not use our website in any way that causes, or may cause, damage to the website or impairment of
							the availability or accessibility of the website.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">User Content</h3>
						<p className="text-gray-600 mt-2">
							In these terms and conditions, “your user content” means material (including text, images, and
							audio-visual material) that you submit to our website. You grant us a worldwide, irrevocable,
							non-exclusive, royalty-free license to use, reproduce, and publish your user content.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">Limitations of Liability</h3>
						<p className="text-gray-600 mt-2">
							We will not be liable to you (whether under the law of contract, the law of torts, or otherwise) in
							relation to the contents of, or use of, or otherwise in connection with, this website.
						</p>
					</section>
				</div>
			</div>
		</>
	);
};

export default TermsAndConditionsPage;
