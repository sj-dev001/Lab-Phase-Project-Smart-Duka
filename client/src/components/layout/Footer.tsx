export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold">Smart Duka</p>
        <p className="text-gray-400 mt-2">Connecting local vendors with customers</p>
        <p className="text-gray-500 text-sm mt-4">
          &copy; {new Date().getFullYear()} Smart Duka. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
