import './globals.css';
import ScreenSizeWarning from '../components/ui/ScreenSizeWarning';
import Script from 'next/script';

export const metadata = {
  title: 'Piano Teacher App',
  description: 'Aprende piano en tu navegador con tu teclado MIDI'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="YQRsFuAu9kLLD9W473-R49ZQyvsYI7rhe6cfmgxsOvs" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-JY3TPFQHM4" strategy="afterInteractive" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-JY3TPFQHM4');
            `,
          }}
        />
      </head>
      <body>
        <ScreenSizeWarning>
          {children}
        </ScreenSizeWarning>
      </body>
    </html>
  );
}