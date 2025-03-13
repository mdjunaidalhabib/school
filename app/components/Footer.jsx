export default function Footer() {
  return (
    <div className="relative">
      <footer className="fixed bottom-0 right-0 left-0 bg-gray-900 text-white p-1 text-center">
        <p>© {new Date().getFullYear()} School Management System</p>
      </footer>
    </div>
  );
}
