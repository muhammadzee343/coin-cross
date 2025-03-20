import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  return new NextResponse(
    `
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
    `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
