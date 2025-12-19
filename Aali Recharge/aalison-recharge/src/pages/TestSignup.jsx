import { useState } from 'react';

const TestSignup = () => {
  const [result, setResult] = useState('');

  const testDirectAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Direct Test',
          email: 'direct@test.com',
          phoneNumber: '7777777777',
          password: 'direct123'
        }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Test Signup API</h2>
      <button onClick={testDirectAPI} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Test Direct API Call
      </button>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
        {result}
      </pre>
    </div>
  );
};

export default TestSignup;