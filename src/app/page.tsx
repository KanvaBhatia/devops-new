"use client";
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GitHubLogoIcon } from '@radix-ui/react-icons'

export default function Home() {
  const [link, setLink] = useState('')
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="github-link" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          GitHub Repository Link
        </Label>
        <div className="relative">
          <GitHubLogoIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            id="github-link"
            type="url"
            placeholder="https://github.com/username/repo"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
        {link && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Entered link: {link}
          </p>
        )}
      </div>
    </div>
  )
}