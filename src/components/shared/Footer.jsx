import React from 'react'
import { CloudDownload, DarkModeOutlined, GitHub, LightModeOutlined, LinkedIn } from '@mui/icons-material';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { setDark } from '../../store/slices/dark.slice';
import { landingThunk } from '../../store/slices/landing.slice';
import { Link } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import { CV } from './CV';

const WHATSAPP_PATH = "M476.9 161.1C435 119.1 379.2 96 319.9 96C197.5 96 97.9 195.6 97.9 318C97.9 357.1 108.1 395.3 127.5 429L96 544L213.7 513.1C246.1 530.8 282.6 540.1 319.8 540.1L319.9 540.1C442.2 540.1 544 440.5 544 318.1C544 258.8 518.8 203.1 476.9 161.1zM319.9 502.7C286.7 502.7 254.2 493.8 225.9 477L219.2 473L149.4 491.3L168 423.2L163.6 416.2C145.1 386.8 135.4 352.9 135.4 318C135.4 216.3 218.2 133.5 320 133.5C369.3 133.5 415.6 152.7 450.4 187.6C485.2 222.5 506.6 268.8 506.5 318.1C506.5 419.9 421.6 502.7 319.9 502.7zM421.1 364.5C415.6 361.7 388.3 348.3 383.2 346.5C378.1 344.6 374.4 343.7 370.7 349.3C367 354.9 356.4 367.3 353.1 371.1C349.9 374.8 346.6 375.3 341.1 372.5C308.5 356.2 287.1 343.4 265.6 306.5C259.9 296.7 271.3 297.4 281.9 276.2C283.7 272.5 282.8 269.3 281.4 266.5C280 263.7 268.9 236.4 264.3 225.3C259.8 214.5 255.2 216 251.8 215.8C248.6 215.6 244.9 215.6 241.2 215.6C237.5 215.6 231.5 217 226.4 222.5C221.3 228.1 207 241.5 207 268.8C207 296.1 226.9 322.5 229.6 326.2C232.4 329.9 268.7 385.9 324.4 410C359.6 425.2 373.4 426.5 391 423.9C401.7 422.3 423.8 410.5 428.4 397.5C433 384.5 433 373.4 431.6 371.1C430.3 368.6 426.6 367.2 421.1 364.5z";

const iconClass = clsx(
  "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1",
  "flex items-center justify-center aspect-square",
);

// Rendered only when the setting has a value: an empty key means the link was
// cleared from the admin, and an anchor pointing nowhere is worse than none.
const SocialLink = ({ url, title, children }) => {
  if (!url) return null;
  return (
    <Tooltip title={title} placement="top">
      <Link target="_blank" className={iconClass} to={url}>
        {children}
      </Link>
    </Tooltip>
  );
};

const Landing = () => {

	const dark = useSelector((state) => state.dark);
	const settings = useSelector((state) => state.landing.settings);
	const dispatch = useDispatch();

	const handleDark = (status) => {
	  localStorage.setItem('dark', status);
	  dispatch(setDark(status));
	};

	// The footer shows on every landing page but only Home loads the settings,
	// so the social links would be missing everywhere else.
	React.useEffect(() => {
	  if (!settings.profile_name) dispatch(landingThunk());
	}, []);

 // return null

  return (
    <footer className="flex justify-center items-center pt-2">
      <div className="flex justify-center items-center gap-2">
        <CV.Landing />
        <SocialLink url={settings.contact_whatsapp} title="WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={24} height={24} fill="currentColor">
            <path d={WHATSAPP_PATH} />
          </svg>
        </SocialLink>
        <SocialLink url={settings.contact_linkedin} title="LinkedIn">
          <LinkedIn />
        </SocialLink>
        <SocialLink url={settings.contact_github} title="Github">
          <GitHub />
        </SocialLink>

        <button onClick={() => handleDark(!dark)} className={clsx(
          "hover:text-light-primary-500/50 hover:dark:text-dark-primary-500 p-1",
          "flex items-center justify-center aspect-square",
          "cursor-pointer"
        )}>
          {dark ? <LightModeOutlined /> : <DarkModeOutlined />}
        </button>          

      </div>

    </footer>
  )
}


const Footer = { Landing }

export default Footer;