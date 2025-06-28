import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import URLShortener from './components/URLShortener';
import URLStats from './components/URLStats';
import { Container } from '@mui/material';
import './App.css';


// Redirection component for short URLs
const Redirector = ({ urls }) => {
  const { code } = useParams();
  const navigate = useNavigate();

  const found = urls.find((u) => u.shortcode === code);

  if (found) {
    found.clicks.push({
      time: new Date().toLocaleString(),
      location: 'Unknown',
      source: 'App',
    });

    // Persist updated click data to localStorage
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));

    window.location.href = found.longUrl;
  } else {
    navigate('/');
  }

  return null;
};

function App() {
  // Load from localStorage on first render
  const [shortenedUrls, setShortenedUrls] = useState(() => {
    const saved = localStorage.getItem('shortenedUrls');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
  }, [shortenedUrls]);

  return (
    <Router>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <URLShortener
                  onShortened={(data) => setShortenedUrls([...shortenedUrls, ...data])}
                />
                <URLStats urls={shortenedUrls} />
              </>
            }
          />
          <Route path="/:code" element={<Redirector urls={shortenedUrls} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
