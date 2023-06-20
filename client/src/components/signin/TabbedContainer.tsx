import React, { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import Login from './Login';
import Signup from './Signup';
import 'bootstrap/dist/css/bootstrap.css';
import './TabbedContainer.scss';


const TabbedContainer: React.FC = () => {
    const { addToast } = useToasts();

    const handleResponse = (code: number, type: string) => {
        if (code === 200 && type === 'create') {
            addToast('Account created.', {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 5000,
            });
            handleTabChange('login');
        } else if (code === 400 && type === 'duplicate displayName') {
            addToast('Display name already in use.', {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 5000,
            });
        } else if (code === 400 && type === 'duplicate email') {
            addToast('Email already in use.', {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 5000,
            });
        }
    }

        const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

        const handleTabChange = (tab: 'login' | 'signup') => {
            setActiveTab(tab);
        };

        return (
            <div className="container">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card">
                        <div className="card-header">
                            <ul className="nav nav-tabs card-header-tabs tabs">
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
                            {activeTab === 'login' && <Login onResponse={handleResponse} />}
                            {activeTab === 'signup' && <Signup onResponse={handleResponse} />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default TabbedContainer;