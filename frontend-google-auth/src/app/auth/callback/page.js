'use client'; // This ensures this code runs on the client side
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // Extract the access token from the URL fragment
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    console.log(accessToken, '-------- accessToken -------');

    if (accessToken) {
      console.log('Access Token:', accessToken);

      // Send the access token to the backend
      fetch(`http://localhost:5050/auth/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${accessToken}`,
          // 'Access-Control-Allow-Origin': '*',
          // 'Access-Control-Allow-Credentials': 'true',
          // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          // 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        credentials: 'include', // Include cookies in the request
        body: JSON.stringify({ access_token: accessToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('User Data:', data);
          router.push('/'); // Redirect to home or dashboard
        })
        .catch((error) => console.error('Error:', error));
    } else {
      console.error('No access token found in the URL fragment.');
      router.push('/'); // Redirect to home if no token
    }
  }, [router]);

  return <p>Processing authentication, please wait...</p>;
}
