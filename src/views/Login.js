import React, { useState } from 'react'
import { auth } from '../firebase/firebase-config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const isAdmin = email.includes('genlinkaustin@gmail.com')
      localStorage.setItem('isAdmin', isAdmin)
      navigate('/')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1e4b]">
      <div className="max-w-md w-full space-y-8 p-10 bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl border border-white/10">
        <div className="space-y-4">
          <h2 className="text-center text-4xl font-bold text-white tracking-tight">Welcome Back!</h2>
          <p className="text-center text-gray-300 text-sm">Please log into your account.</p>
        </div>
        {error && <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Email Address"
            />
          </div>
          <div className="space-y-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#132657] transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-300 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login