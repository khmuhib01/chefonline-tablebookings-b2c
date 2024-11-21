import React, {useEffect} from 'react';

const PrivacyPolicyPage = () => {
	useEffect(() => {
		window.scrollTo(0, 0); // Scroll to the top of the page when the component mounts
	}, []);

	return (
		<>
			{/* Banner Section */}
			<div
				className="relative bg-no-repeat bg-cover bg-center h-[400px]"
				style={{backgroundImage: 'url(/images/privacy-banner.jpg)'}}
			>
				<div className="absolute inset-0 bg-black opacity-50"></div>
				<div className="container h-full flex flex-col justify-center items-center">
					<h1 className="text-white text-5xl font-bold relative z-10">Privacy Policy</h1>
					<p className="text-white text-xl mt-4 relative z-10">
						Your privacy is important to us. Learn how we handle your data.
					</p>
				</div>
			</div>

			{/* Privacy Policy Content */}
			<div className="container mx-auto py-16">
				<h2 className="text-4xl font-bold text-center mb-10">Our Commitment to Privacy</h2>
				<div className="max-w-3xl mx-auto flex flex-col gap-8">
					<section>
						<h3 className="text-2xl font-semibold">Information We Collect</h3>
						<p className="text-gray-600 mt-2">
							We collect information to provide better services to our users. This may include personal information like
							your name, email address, phone number, and payment details.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">How We Use Information</h3>
						<p className="text-gray-600 mt-2">
							The information we collect is used to improve our services, provide customer support, and communicate with
							you about our products and services.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">Information Sharing</h3>
						<p className="text-gray-600 mt-2">
							We do not share your personal information with companies, organizations, or individuals outside of our
							company unless one of the following circumstances applies: with your consent, for legal reasons, or to
							protect our users.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">Data Security</h3>
						<p className="text-gray-600 mt-2">
							We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or
							destruction of information we hold.
						</p>
					</section>
					<section>
						<h3 className="text-2xl font-semibold">Your Privacy Choices</h3>
						<p className="text-gray-600 mt-2">
							You can choose not to provide certain information to us, but this may result in you being unable to use
							certain features of our services.
						</p>
					</section>
				</div>
			</div>
		</>
	);
};

export default PrivacyPolicyPage;
