"use client"

import { useState } from 'react';
import { PasscodeAPI } from '../services/api'; // Adjust path to your API file
import { toast } from 'react-toastify';

const GeneratePasscodeForm = () => {
  const [role, setRole] = useState('editor');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedCode('');

    try {
      const response = await PasscodeAPI.create({ role });
      setGeneratedCode(response.data.code);
      toast.success('Passcode generated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error generating passcode.', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Generate Passcode</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="admin">Admin</option>
            <option value="publisher">Publisher</option>
            <option value="editor">Editor</option>
            <option value="participant">Participant</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Passcode'}
        </button>
      </form>
      {generatedCode && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-center font-semibold">
            Generated Passcode: <span className="text-blue-600">{generatedCode}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GeneratePasscodeForm;