import React from 'react'
import { DarkModeIcon, LanguageIcon, LightModeIcon, LogoutIcon } from '../../../../public/icons/Svg'
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../../../store/slices/darkMode.slice';
import { setLoad } from '../../../store/slices/loader.slice';

export const Footer = () => {

    const darkMode = useSelector( (state) => state.darkMode );
    const dispatch = useDispatch();

    const logout = () => {
        dispatch(setLoad(false))
        sessionStorage.removeItem('authToken');
        window.location.reload()
    };

    const handleDarkMode = (status) => {
        dispatch(setDarkMode(status));
        localStorage.setItem('darkMode', status);
    };

    const sessionAuth = sessionStorage.getItem('authToken');

    return (
        <footer className="w-full flex justify-center pb-2">
            <div className="bg-gradient-to-t from-light-primary-500 dark:from-dark-primary-500 to-transparent clip-footer p-[2px] pt-0">
                <div className="px-16 py-2 clip-footer bg-light-secondary-700 dark:bg-dark-primary-700 dark:bg-[url(/img/overlay-pattern.png)] flex gap-6">
                    <button
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                        onClick={() =>
                            handleDarkMode(!darkMode)
                        }
                    >
                        {darkMode ? ( 
                            <LightModeIcon color={ darkMode ? "#00ffff" : "#292929"}/>
                        ) : (
                            <DarkModeIcon color={ darkMode ? "#00ffff" : "#292929"}/>
                        )}
                    </button>
                    <button title="Language">
                        <LanguageIcon color={ darkMode ? "#00ffff" : "#292929"}/>
                    </button>
                    {
                        sessionAuth && 
                            <button title="Logout" onClick={logout}>
                                <LogoutIcon color={ darkMode ? "#00ffff" : "#292929"}/>
                            </button>
                    }
                </div>
            </div>
        </footer>
    )
}
