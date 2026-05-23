export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="text-lg font-black">Smart Duka</p>
          <p className="mt-1 text-slate-400">Connecting local vendors with customers</p>
        </div>
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Smart Duka. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
