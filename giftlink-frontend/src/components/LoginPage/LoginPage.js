import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { AuthContext } from '../../context/AuthContext';

function LoginPage() {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${btoa(`${email}:${password}`)}`,
                    },
                    body: JSON.stringify({ email, password }),
                }
            );
            const data = await response.json();
            if (response.ok) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('name', data.firstName);
                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            {error && <p className="text-danger">{error}</p>}
            <input className="form-control mb-2" placeholder="Email"
                value={email} onChange={e => setEmail(e.target.value)} />
            <input className="form-control mb-2" type="password" placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} />
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
        </div>
    );
}

export default LoginPage;