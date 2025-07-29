import React from 'react';
import { useState } from 'react'
import { aiSearch } from '@nestify/api/ai/search'

const SearchPage: React.FC = () => {
  
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Record<string, any>[]>([])
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await aiSearch(query)
      setResults(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Real‑Estate AI Search</h1>

      <form onSubmit={onSubmit} className="mb-5 flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. 3‑bed Makati ₱50k‑₱80k"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="space-y-4">
        {results.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            {Object.entries(item).map(([k, v]) => (
              <div key={k} className="mb-1">
                <span className="font-semibold">{k}:</span> {String(v)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

}
