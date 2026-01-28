import { AuthProvider } from "@/features/auth/context/auth-context";
import { Navbar } from "@/shared/components/navbar";
import "./globals.css";

export const metadata = {
  title: "Survey App",
  description: "Create and participate in surveys",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <AuthProvider>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>

            <footer
              style={{
                backgroundColor: "#1e293b",
                color: "#94a3b8",
                padding: "24px",
                textAlign: "center",
                fontSize: "14px",
              }}
            >
              <p style={{ margin: 0 }}>
                © {new Date().getFullYear()} Survey App. All rights reserved.
              </p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
