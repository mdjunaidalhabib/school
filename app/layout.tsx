import "./globals.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import QueryProvider from "./components/QueryProvider"; // Import QueryProvider

export const metadata = {
  title: "School Management System",
  description: "A complete school management solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <QueryProvider>
          <Header />
          <div className="flex flex-1 pt-5">
            <Sidebar />
            <main className="flex-1 p-5 ml-64">{children}</main>
          </div>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
