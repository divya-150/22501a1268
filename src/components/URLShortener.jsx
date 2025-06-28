import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { logEvent } from '../logger';

function generateShortCode() {
  return Math.random().toString(36).substring(2, 7);
}

const URLShortener = ({ onShortened }) => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '', error: '' }]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '', error: '' }]);
    }
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleShorten = () => {
    const results = urls.map((entry) => {
      if (!validateUrl(entry.longUrl)) {
        entry.error = 'Invalid URL';
        return entry;
      }
      const validity = parseInt(entry.validity);
      if (entry.validity && (isNaN(validity) || validity < 1)) {
        entry.error = 'Invalid validity';
        return entry;
      }
      const shortcode = entry.shortcode || generateShortCode();
      const expiry = new Date(Date.now() + (validity || 30) * 60000);
      const shortUrl = `${window.location.origin}/${shortcode}`;

      logEvent(`Created short URL: ${shortUrl}`);

      return {
        ...entry,
        error: '',
        shortUrl,
        shortcode,
        expiry: expiry.toLocaleString(),
        creation: new Date().toLocaleString(),
        clicks: [],
      };
    });

    setUrls(results);
    onShortened(results.filter((r) => !r.error));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">URL Shortener</Typography>
        {urls.map((url, idx) => (
          <Grid container spacing={2} sx={{ mt: 1 }} key={idx}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="Long URL"
                value={url.longUrl}
                onChange={(e) => handleChange(idx, 'longUrl', e.target.value)}
                error={!!url.error}
                helperText={url.error}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Validity (min)"
                value={url.validity}
                onChange={(e) => handleChange(idx, 'validity', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                label="Custom Shortcode"
                value={url.shortcode}
                onChange={(e) => handleChange(idx, 'shortcode', e.target.value)}
              />
            </Grid>
          </Grid>
        ))}
        <Button sx={{ mt: 2, mr: 2 }} variant="outlined" onClick={addField}>Add URL</Button>
        <Button sx={{ mt: 2 }} variant="contained" onClick={handleShorten}>Shorten</Button>
      </CardContent>
    </Card>
  );
};

export default URLShortener;
