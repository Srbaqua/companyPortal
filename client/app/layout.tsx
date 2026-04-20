export const metadata = {
  title: "Company Suggestion Portal",
  description: "Suggest companies without seeing the hidden list"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}