"use client";
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function Home() {
  const [link, setLink] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic
    console.log('GitHub link submitted:', link);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label
              htmlFor="github-link"
              className="text-lg font-semibold text-gray-800 dark:text-gray-100"
            >
              GitHub Repository Link
            </Label>
            <div className="relative mt-2">
              <GitHubLogoIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                id="github-link"
                type="url"
                placeholder="https://github.com/username/repo"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 focus:outline-none transition-all"
              />
            </div>
          </div>

          {link && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Entered link: {link}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
