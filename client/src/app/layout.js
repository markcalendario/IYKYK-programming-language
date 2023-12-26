import "../styles/fontawesome/css/all.min.css";
import "../styles/main.scss";

export const metadata = {
  title: "IYKYK Portal",
  description: "If You Know, You Know Programming Language"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
