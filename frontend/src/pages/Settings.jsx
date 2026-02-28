import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import TopBar from '../components/TopBar';

const Settings = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <>
            <TopBar />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    Personal Settings
                </h1>

                <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Appearance</h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Toggle between light and dark themes. Currently: {theme}
                            </p>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;
