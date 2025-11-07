import DashNav from "@/components/dashNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <DashNav />
        {children}
      </body>
    </html>
  );
}
