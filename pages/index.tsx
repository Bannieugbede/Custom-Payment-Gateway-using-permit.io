import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('user123');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (action: string) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/payment/process', {
        userId,
        amount: parseFloat(amount),
        action,
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <h1 className="text-center">Payment Gateway</h1>

        {/* User ID Input */}
        <div className="mb-4">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={loading}
            placeholder="Enter user ID"
            className="transition-all duration-200"
          />
        </div>

        {/* Role Select */}
        <div className="mb-4">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            className="transition-all duration-200"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label htmlFor="amount">Amount ($)</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            placeholder="Enter amount"
            className="transition-all duration-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4 mb-6">
          <button
            onClick={() => handlePayment('pay')}
            disabled={loading || !amount}
            className="btn-primary flex-1 transition-all duration-200 hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h-8z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Pay Now'
            )}
          </button>
          <button
            onClick={() => handlePayment('refund')}
            disabled={loading || !amount}
            className="btn-secondary flex-1 transition-all duration-200 hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h-8z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              'Refund'
            )}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={
              message.includes('success')
                ? 'message-success animate-fade-in'
                : 'message-error animate-fade-in'
            }
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}