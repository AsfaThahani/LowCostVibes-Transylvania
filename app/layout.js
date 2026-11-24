import '@fontsource-variable/lexend';
import '@fontsource/afacad/600.css';
import './globals.css';

export const metadata = {
  title: 'Mysterious Vibes in Transylvania | LowCostVibes',
  description: 'Explore a three-night Romanian holiday with a complimentary Transylvania day trip.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        {children}
      </body>
    </html>
  );
}