import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

type responseData = {
    onResponse: (code: number, type: string) => void;
}

const Login: React.FC<responseData> = ({ onResponse }) => {
    const [cookies, setCookie] = useCookies(['AccessToken', 'RefreshToken', 'UserID']);

    const [formData, setFormData] = useState({
        emailAddress: '',
        password: '',
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { emailAddress, password } = formData;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailAddress,
                password: password,
            }),
        };
        await fetch('http://127.0.0.1:8000/api/authenticate', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                setCookie('AccessToken', data.accessToken);
                setCookie('RefreshToken', data.refreshToken);
                setCookie('UserID', data.userID);
            })
            .then(() => {
                onResponse(200, 'login');
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email Address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;