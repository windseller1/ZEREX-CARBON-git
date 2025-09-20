import { NextRequest, NextResponse } from 'next/server'
import { registerUser, registerSchema } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Register user
    const user = await registerUser(validatedData)
    
    return NextResponse.json({
      success: true,
      user,
      message: 'User registered successfully'
    })
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
