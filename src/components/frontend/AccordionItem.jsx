import {UpArrow, DownArrow} from '../../ui-share/Icon';

const AccordionItem = ({title, icon, isOpen, onToggle, alwaysOpen, children}) => {
	return (
		<div className="">
			<button className="w-full text-left py-2 focus:outline-none" onClick={onToggle}>
				<div className="flex justify-between items-center">
					<span
						className={`flex items-center gap-2 font-bold capitalize ${
							alwaysOpen ? 'text-button' : isOpen ? 'text-button' : 'text-bodyText'
						}`}
					>
						{icon}
						{title}
					</span>
					<span>
						{!alwaysOpen && (
							<span>
								{isOpen ? (
									<UpArrow className="text-bodyText text-[20px]" />
								) : (
									<DownArrow className="text-bodyText text-[20px]" />
								)}
							</span>
						)}
					</span>
				</div>
			</button>
			{isOpen && <div className="py-4">{children}</div>}
		</div>
	);
};

export default AccordionItem;
