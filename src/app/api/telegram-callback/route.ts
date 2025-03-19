import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const requiredParams = ['token', 'email', 'provider'];
  const missingParams = requiredParams.filter(param => !searchParams.get(param));
  
  if (missingParams.length > 0) {
    return NextResponse.json(
      { error: `Missing parameters: ${missingParams.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    if (!token || !email) {
      throw new Error('Missing authentication parameters');
    }

    // For Telegram WebView
    const htmlResponse = `
      <html>
        <head>
          <script src="https://telegram.org/js/telegram-web-app.js"></script>
          <script>
            window.onload = function() {
              Telegram.WebApp.ready();
              Telegram.WebApp.sendData(JSON.stringify({
                type: 'WEB3AUTH_SUCCESS',
                token: "${token}",
                email: "${email}"
              }));
              setTimeout(() => Telegram.WebApp.close(), 1000);
            }
          </script>
        </head>
        <body>
          <div>Authentication successful, closing...</div>
        </body>
      </html>
    `;

    return new Response(htmlResponse, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};