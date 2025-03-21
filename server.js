import express from 'express';
import path from 'path';

const app = express();
const MYPORT = process.env.MYPORT || 8080;

console.log("Loaded environment variables:", process.env);

app.use(express.static('dist'));

app.get('/env.js', (req, res) => {
  const envVars = {
    VITE_API_BASE_URL: 'https://taxibee-backend-396785091400.europe-west4.run.app',
    VITE_EMAILJS_SERVICE_ID: 'service_l9r151p',
    VITE_EMAILJS_TEMPLATE_ID: 'template_96nm86r',
    VITE_EMAILJS_PUBLIC_KEY: '4UYlb6Y1yXFMNONjx',
  };
  res.type('.js');
  res.send(`window.__ENV__ = ${JSON.stringify(envVars)};`);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

// Explicitly listen on 0.0.0.0 so Cloud Run can route traffic correctly
app.listen(MYPORT, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${MYPORT}`);
});
