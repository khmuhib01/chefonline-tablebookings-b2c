import React, {useEffect} from 'react';
import {Outlet} from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

export default function FrontendHomeLayout({children}) {
	return (
		<div className="overflow-x-hidden">
			<Header />

			<div className="mt-[80px]">
				{children}
				<Outlet />
			</div>

			<Footer />
		</div>
	);
}
