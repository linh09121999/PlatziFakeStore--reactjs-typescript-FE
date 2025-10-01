import React from 'react'

const Page404: React.FC = () => {
  return (
    <div className="h-[100vh] flex items-center justify-center bg-black/40 text-white">
      <div className="text-center grid gap-4">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-xl mb-4">Page Not Found</p>
        <a href="/" className="border border-white px-6 py-2 rounded-[20px] hover:bg-white hover:text-black transition">Go Home</a>
      </div>
    </div>
  )
}

export default Page404
