import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return (
    <div className="site-container flex min-h-[60vh] flex-col items-center justify-center pt-24 pb-16 text-center">
      <p className="mb-2 text-sm text-gray-500">404 / NOT FOUND</p>
      <h1 className="mb-4 text-3xl font-semibold">This page is unavailable.</h1>
      <Link
        href="/"
        className="rounded-md border border-gray-400 px-5 py-2 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-darkHover"
      >
        Return home
      </Link>
    </div>
  );
}
