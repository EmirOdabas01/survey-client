import { AuthProvider } from "@/features/auth/context/auth-context";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div style={{ display: "flex" }}>
            <div>login</div>
            <div>Register</div>
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
