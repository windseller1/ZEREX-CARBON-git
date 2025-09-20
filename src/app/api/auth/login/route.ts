import { NextRequest, NextResponse } from 'next/server'
import { loginUser, loginSchema } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Login user
    const result = await loginUser(validatedData)
    
    return NextResponse.json({
      success: true,
      ...result,
      message: 'User logged in successfully'
    })
  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
