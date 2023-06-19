import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import './TabbedContainer.css';

function TabbedContainer() {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

    const handleTabChange = (tab: 'login' | 'signup') => {
        setActiveTab(tab);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-center mt-5 align-items-center">
                <div className="card">
                    <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('login')}
                                >
                                    Login
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('signup')}
                                >
                                    Sign Up
                                </button>
                            </li>
                        </ul>
                    </div>
                    <div className="card-body">
                        {activeTab === 'login' && <Login />}
                        {activeTab === 'signup' && <Signup />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TabbedContainer;