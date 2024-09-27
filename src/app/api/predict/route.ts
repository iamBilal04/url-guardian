// page.tsx file

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`http://localhost:5000/predict/${encodeURIComponent(url)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch prediction from backend')
    }

    const data = await response.json(); // Use .json() to parse JSON response
    return NextResponse.json(data); // Return the data from the backend
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred while fetching the prediction' }, { status: 500 })
  }
}
