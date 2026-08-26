import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Connecting to backend...');

  useEffect(() => {
    axios.get('http://localhost:8000/api/test')
      .then(response => setMessage(response.data.message))
      .catch(error => {
        console.error('Connection error:', error);
        setMessage('Failed to connect to backend.');
      });
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking System</h1>
        <p className="mt-4 text-lg font-medium text-blue-600">{message}</p>
      </div>
    </div>
  );
}

export default App;
