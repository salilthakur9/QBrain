import React, { useState } from 'react';

const AuthModal = ({ closeModal, handleLoginSuccess }) => {
  // State to toggle between Login and Register views
  const [isLoginView, setIsLoginView] = useState(true);

  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    const url = isLoginView ? 'http://localhost:8081/api/auth/login' : 'http://localhost:8081/api/auth/register';
    const body = isLoginView ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'An error occurred.');
      }

      if (isLoginView) {
        const data = await response.json();
          localStorage.setItem("token", data.token);
        handleLoginSuccess(data.token); // Pass the token up to App.jsx
      } else {
        // Automatically switch to login view after successful registration
        alert('Registration successful! Please log in.');
        setIsLoginView(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
      {/* Modal content */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center mb-6">{isLoginView ? 'Login' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button type="submit" className="w-full bg-sky-500 text-white p-3 rounded font-semibold hover:bg-sky-600">
            {isLoginView ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLoginView(!isLoginView)} className="text-sky-400 hover:underline">
            {isLoginView ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;