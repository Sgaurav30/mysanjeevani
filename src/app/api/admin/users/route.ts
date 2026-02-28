import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // This would typically fetch from your database
    // For now, returning mock structure
    const users = [
      {
        _id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        status: 'active',
        joinedDate: '2024-01-15',
        role: 'user',
      },
    ];

    const filteredUsers = status ? users.filter(u => u.status === status) : users;

    return NextResponse.json({ users: filteredUsers, total: filteredUsers.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.fullName || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // This would typically create a new user in database
    const newUser = {
      _id: Date.now().toString(),
      ...body,
      status: 'active',
      joinedDate: new Date().toISOString(),
    };

    return NextResponse.json({ user: newUser, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body._id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // This would typically update user in database
    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // This would typically delete user from database
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
