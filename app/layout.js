import './globals.css';

export const metadata = {
  title: 'Piano Teacher App',
  description: 'Aprende piano en tu navegador con tu teclado MIDI'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
