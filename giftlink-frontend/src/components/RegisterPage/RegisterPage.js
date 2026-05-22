import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [error, setError]         = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/register`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, email, password }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            {error && <p className="text-danger">{error}</p>}
            <input className="form-control mb-2" placeholder="First Name"
                value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input className="form-control mb-2" placeholder="Last Name"
                value={lastName} onChange={e => setLastName(e.target.value)} />
            <input className="form-control mb-2" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)} />
            <input className="form-control mb-2" type="password" placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-primary" onClick={handleRegister}>Register</button>
        </div>
    );
}

export default RegisterPage;