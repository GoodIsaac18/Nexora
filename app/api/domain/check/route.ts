import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const domain = searchParams.get('domain')

    if (!domain) {
      return NextResponse.json({ error: 'Domain parameter is required' }, { status: 400 })
    }

    // Simulate domain availability check
    // In production, you would use a domain availability API like:
    // - GoDaddy API
    // - Namecheap API
    // - Domainr API
    // - DNS lookup
    
    // For demo purposes, we'll simulate availability based on the domain name
    // Domains with common words are likely taken, unique ones might be available
    const commonWords = ['tech', 'hub', 'lab', 'pro', 'sys', 'net', 'works', 'studio']
    const domainLower = domain.toLowerCase()
    const hasCommonWord = commonWords.some(word => domainLower.includes(word))
    
    // Simulate: 30% chance of being available if it has common words, 70% otherwise
    const available = hasCommonWord ? Math.random() > 0.7 : Math.random() > 0.3

    // Add a small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      domain,
      available,
      message: available ? 'Domain is available' : 'Domain is already registered'
    })
  } catch (error) {
    console.error('Error checking domain:', error)
    return NextResponse.json({ error: 'Error checking domain availability' }, { status: 500 })
  }
}
