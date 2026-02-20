import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    // Set a timeout for the entire request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const body = await request.json();
      const { email, password, fullName, phone } = body;

      // Validation
      if (!email || !password || !fullName) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Password validation (minimum 6 characters)
      if (password.length < 6) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Connect to DB with timeout handling
      await connectDB();

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        clearTimeout(timeoutId);
        return NextResponse.json(
          { error: 'User already exists with this email' },
          { status: 409 }
        );
      }

      // Hash password
      const hashedPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex');

      // Create user in MongoDB
      const newUser = await User.create({
        fullName,
        email,
        phone: phone || '',
        password: hashedPassword,
        role: 'user',
        isVerified: false,
      });

      // Return success response (without password)
      const userResponse = {
        id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
        isVerified: newUser.isVerified,
      };

      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          message: 'User created successfully',
          user: userResponse,
          token: crypto.randomUUID(),
        },
        { status: 201 }
      );
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error('Signup error:', error.message);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
