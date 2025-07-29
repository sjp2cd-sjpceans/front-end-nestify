import React, { Suspense, useState, useTransition } from 'react'
import { aiSearch } from '@nestify/services/api/ai/search'

type Listing = Record<string, any>

function createResource<T>(promise: Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending'
  let result: T
  let error: any
  const suspender = promise.then(
    res => {
      status = 'success'
      result = res
    },
    err => {
      status = 'error'
      error = err
    }
  )
  return {
    read(): T {
      if (status === 'pending') throw suspender
      if (status === 'error') throw error
      return result!
    }
  }
}

const ListingSkeleton: React.FC = () => (
  <div className="animate-pulse border border-gray-200 rounded-lg p-6 bg-white shadow-md space-y-4">
    <div className="h-6 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
  </div>
)

const SearchResults: React.FC<{ resource: ReturnType<typeof createResource<Listing[]>> }> = ({ resource }) => {
  const results = resource.read()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-6 shadow-lg bg-white hover:shadow-xl transition-shadow">
          {Object.entries(item).map(([k, v]) => (
            <div key={k} className="mb-2 flex">
              <span className="font-semibold w-32 capitalize">{k.replace(/_/g, ' ')}:</span>
              <span className="truncate">{String(v)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('')
  const [resource, setResource] = useState<ReturnType<typeof createResource<Listing[]>> | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    startTransition(() => {
      const promise = aiSearch(query)
      setResource(createResource<Listing[]>(promise))
    })
  }

  return (
    <div className="p-6 mx-auto px-8 max-w-screen-xl">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Real‑Estate AI Search</h1>

      <form 
        onSubmit={handleSubmit} 
        className="mb-8 flex space-x-4 max-w-[940px] w-full mx-auto"
      >
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. 3‑bed Makati ₱50k‑₱80k"
          className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium disabled:opacity-50 transition"
        >
          {isPending ? 'Searching…' : 'Search'}
        </button>
      </form>

      {resource && (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          }
        >
          <SearchResults resource={resource} />
        </Suspense>
      )}
    </div>
  )
}