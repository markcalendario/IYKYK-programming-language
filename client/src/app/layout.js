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
