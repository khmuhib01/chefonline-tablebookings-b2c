import React from 'react';
import {logoImage} from '../ui-share/Image';
import {Link, NavLink} from 'react-router-dom';
import {FooterFacebook, FooterLinkedin, FooterTwitter} from '../ui-share/Icon';
import CookiesConsent from '../components/frontend/CookiesConsent';

export default function Footer() {
	return (
		<>
			<div className="bg-[#232833] py-20">
				<div className="container px-5 flex flex-col gap-y-10">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-16 h-full">
						<div className="flex flex-col gap-y-3">
							<h3 className="text-primary text-[18px] font-bold uppercase">About</h3>
							<ul>
								<li className="flex flex-col gap-y-2 text-bodyText font-bold">
									<NavLink to="/about-us" className={('hover:text-primary', 'hover:underline')}>
										About Us
									</NavLink>
									<NavLink to="/contact" className={('hover:text-primary', 'hover:underline')}>
										Contact
									</NavLink>
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-y-3">
							<h3 className="text-primary text-[18px] font-bold uppercase">Quick Links</h3>
							<ul>
								<li className="flex flex-col gap-y-2 text-bodyText font-bold">
									<NavLink to="/faq" className={('hover:text-primary', 'hover:underline')}>
										Faq
									</NavLink>
									<NavLink to="/privacy-policy" className={('hover:text-primary', 'hover:underline')}>
										Privacy Policy
									</NavLink>
									<NavLink to="/terms-and-conditions" className={('hover:text-primary', 'hover:underline')}>
										Terms & Conditions
									</NavLink>
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-y-3">
							<h3 className="text-primary text-[18px] font-bold uppercase">APPS</h3>
							<ul>
								<li className="flex flex-col gap-y-2 text-bodyText font-bold">
									<NavLink to="#" className={('hover:text-primary', 'hover:underline')}>
										<img
											className="h-10"
											src="https://assets-www.web-dev.euwest1.aws.quandoo.com/12.286.1/static/media/en.ef651593.svg"
											alt=""
										/>
									</NavLink>
									<NavLink to="#" className={('hover:text-primary', 'hover:underline')}>
										<img
											className="h-10"
											src="https://assets-www.web-dev.euwest1.aws.quandoo.com/12.286.1/static/media/en.61d9b27b.svg"
											alt=""
										/>
									</NavLink>
								</li>
							</ul>
						</div>
						<div className="flex flex-col gap-y-3">
							<h3 className="text-primary text-[18px] font-bold uppercase">SOCIAL</h3>
							<ul>
								<li className="flex gap-x-5 font-bold">
									<NavLink to="#">
										<div className="bg-white h-10 w-10 rounded-full flex justify-center items-center">
											<FooterFacebook />
										</div>
									</NavLink>
									<NavLink to="#">
										<div className="bg-white h-10 w-10 rounded-full flex justify-center items-center">
											<FooterLinkedin />
										</div>
									</NavLink>
									<NavLink to="#">
										<div className="bg-white h-10 w-10 rounded-full flex justify-center items-center">
											<FooterTwitter />
										</div>
									</NavLink>
								</li>
							</ul>
						</div>
					</div>
					<div className="w-full flex flex-col gap-2">
						<Link to="/">
							<img src={logoImage} alt="footer logo" className="" />
						</Link>
						<p className="text-bodyText text-[14px]">
							©{new Date().getFullYear()} TableBookings. All rights reserved{' '}
							<Link
								to="https://tablebookings.co.uk/"
								target="_blank"
								rel="noreferrer"
								className="text-primary hover:underline"
							>
								tablebookings.co.uk{' '}
							</Link>
						</p>
					</div>
				</div>
			</div>
			<CookiesConsent />
		</>
	);
}
