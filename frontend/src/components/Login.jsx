import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [response, setResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResponse(null);

        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', {
                email, password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = res.data;
            setResponse(data.message);
            console.log(data.message)
            localStorage.setItem('token', data.token); // Store token
            navigate('/task')
        } catch (error) {
            console.error("Login Failed", error)
            setResponse(error.response?.data?.message || "Login failed. Please try again.")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className='login-container'>
                <div className='login-card'>
                    <h1>Welcome Back</h1>
                    <p className='subtitle'>Login to manage your tasks efficiently</p>

                    <form onSubmit={handleLogin}>

                        <div className='form-group'>
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                placeholder='john@example.com'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name='password'
                                id='password'
                                placeholder='••••••••'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type='submit' className='submit-btn' disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>

                        {response && (
                            <div className={`response-message ${response.includes('failed') || response.includes('Failed') ? 'error' : 'success'}`}>
                                {response}
                            </div>
                        )}
                    </form>

                    <div className='footer-text'>
                        <p>Don't have an account? <Link to='/register'>Register here</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login