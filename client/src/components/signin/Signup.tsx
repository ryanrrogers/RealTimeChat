import React, {  useState } from 'react';

const Signup = () => {

    interface FormData {
        emailAddress: string;
        displayName: string;
        firstName: string;
        lastName: string;
        password: string;
    }

    const [formData, setFormData] = useState({
        emailAddress: '',
        displayName: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { emailAddress, displayName, firstName, lastName, password } = formData;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                displayName: displayName,
                firstName: firstName,
                lastName: lastName,
                email: emailAddress,
                password: password
            })
        }
        let response = await fetch("http://127.0.0.1:8000/api/users/post", requestOptions);
        console.log(response);
        
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((prevFormData: FormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor='email' className="form-label">
                    Email Address
                </label>
                <input type="email" className="form-control" id="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor='displayName' className="form-label">
                    Display Name
                </label>
                <input type="text" className="form-control" id="displayName" name="displayName" value={formData.displayName} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor='firstName' className="form-label">
                    First Name
                </label>
                <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor='lastName' className="form-label">
                    Last Name
                </label>
                <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor='password' className="form-label">
                    Password
                </label>
                <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-primary">Signup</button>
        </form>
    );
}

export default Signup;