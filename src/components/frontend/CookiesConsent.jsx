import React, {useState, useEffect} from 'react';

const CookiesConsent = () => {
	const [showBanner, setShowBanner] = useState(false);

	useEffect(() => {
		// Check if user has already accepted cookies
		const consent = localStorage.getItem('cookiesConsent');
		if (!consent) {
			setShowBanner(true); // Show the banner if not accepted
		}
	}, []);

	const handleAcceptCookies = () => {
		localStorage.setItem('cookiesConsent', 'accepted');
		setShowBanner(false);
	};

	const handleDenyCookies = () => {
		localStorage.setItem('cookiesConsent', 'denied');
		setShowBanner(false);
	};

	if (!showBanner) return null; // Do not show the banner if it's already accepted or denied

	return (
		<div className="w-full bg-gray-900 text-white p-4 flex justify-between items-center z-50 fixed bottom-0">
			<p className="text-sm">
				We use cookies to improve your experience. By continuing to use our site, you accept our use of cookies.
			</p>
			<div className="flex gap-4">
				<button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" onClick={handleAcceptCookies}>
					Accept
				</button>
				<button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded" onClick={handleDenyCookies}>
					Deny
				</button>
			</div>
		</div>
	);
};

export default CookiesConsent;
