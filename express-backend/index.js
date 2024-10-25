const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load the .env file

const app = express();
const PORT = process.env.PORT || 5050;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY // Use service role key here
  
);
console.log(process.env.SUPABASE_URL, 'supabase url');
console.log(process.env.SUPABASE_ANON_KEY, 'supabase anon key');


if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Supabase URL and Anon Key are required.');
}

// Middleware
app.use(cors({ origin: 'http://localhost:3000', methods: ['GET', 'POST', 'OPTIONS'], credentials: true }));
app.use(cookieParser());
app.use(express.json());


app.get('/auth/login', async (req, res) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback',
      },
    });

    if (error) {
      console.error('Error during login:', error.message);
      return res.status(400).json({ error: error.message });
    }

    res.redirect(data.url); // Redirect user to Google OAuth page
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/callback', async (req, res) => {
  // console.log(req.body, 'Request body from callback'); 
  // const access_token = req.body.access_token || req.headers['authorization']?.split(' ')[1]; 
  const access_token =
    req.body.access_token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

const refresh_token = req.body.refresh_token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

console.log(refresh_token, 'refresh token from callback - backend');
  // const { access_token } = req.body;
  if (!access_token) {
    return res.status(400).json({ error: 'No access token found.' });
  }

  const { data: user, error } = await supabase.auth.getUser(access_token);
  // console.log(user, 'user from callback - backend');

  if (error) {
    console.error('Error fetching user:', error.message);
    return res.status(401).json({ error: 'Unauthorized. Invalid access token.' });
  }

  res.cookie('auth_token', access_token, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.json({ user });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
