import React from 'react';
import { Typography, Card, CardContent, List, ListItem } from '@mui/material';

const URLStats = ({ urls }) => {
  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h5">URL Statistics</Typography>
        {urls.map((url, idx) => (
          <List key={idx}>
            <ListItem>
              <b>Short URL:</b>&nbsp;<a href={url.shortUrl}>{url.shortUrl}</a>
            </ListItem>
            <ListItem>
              <b>Created:</b>&nbsp;{url.creation}
            </ListItem>
            <ListItem>
              <b>Expires:</b>&nbsp;{url.expiry}
            </ListItem>
            <ListItem>
              <b>Clicks:</b>&nbsp;{url.clicks.length}
            </ListItem>
            {url.clicks.map((click, cidx) => (
              <ListItem key={cidx} sx={{ pl: 4 }}>
                🔹 {click.time} – {click.source}, {click.location}
              </ListItem>
            ))}
          </List>
        ))}
      </CardContent>
    </Card>
  );
};

export default URLStats;
