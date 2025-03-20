import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token, email } = req.query;

  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <html>
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
        <script>
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.sendData(JSON.stringify({
            token: "${token}",
            email: "${email}"
          }));
          setTimeout(() => window.Telegram.WebApp.close(), 500);
        </script>
      </head>
    </html>
  `);
}