import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [response, setResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResponse(null);

        try {
            const res = await axios.post('http://localhost:3000/api/auth/register', {
                name, email, password
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = res.data;
            setResponse(data.message);
            console.log(data.message)
        } catch (error) {
            console.error("Registration failed", error)
            setResponse(error.response?.data?.message || "Registration failed. Please try again.")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='register-container'>
            <div className='register-card'>
                <h1>Create Account</h1>
                <p className='subtitle'>Join our task manager today</p>

                <form onSubmit={handleRegister}>
                    <div className='form-group'>
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            placeholder='John Doe'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                        {isLoading ? 'Creating Account...' : 'Register Now'}
                    </button>

                    {response && (
                        <div className='response-message'>
                            {response}
                        </div>
                    )}
                </form>

                <div className='footer-text'>
                    <p>Already have an account? <Link to='/login'>Login here</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register
