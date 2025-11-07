import './globals.css';

export const metadata = {
  title: 'Piano Teacher App',
  description: 'Aprende piano en tu navegador con tu teclado MIDI'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="YQRsFuAu9kLLD9W473-R49ZQyvsYI7rhe6cfmgxsOvs" />
      </head>
      <body>{children}</body>
    </html>
  );
}
