import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Doctor } from '@/lib/models/Doctor';

// GET /api/admin/doctors - list all doctors
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department') || '';
    const query: any = {};
    if (department) query.department = department;

    const doctors = await Doctor.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ doctors, total: doctors.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/doctors - add a new doctor
export async function POST(request: NextRequest) {
  try {
    const actorRole = request.headers.get('x-user-role');
    if (actorRole !== 'admin' && actorRole !== 'doctor') {
      return NextResponse.json(
        { error: 'Only admin or doctor can add doctor details' },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();
    const {
      name, email, phone, department, specialization,
      experience, qualification, bio, consultationFee,
      timeSlots, avatar,
    } = body;

    if (!name || !email || !department || !specialization || !consultationFee) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Doctor with this email already exists' }, { status: 409 });
    }

    const doctor = await Doctor.create({
      name, email, phone: phone || '', department, specialization,
      experience: experience || 0, qualification: qualification || '',
      bio: bio || '', consultationFee,
      timeSlots: timeSlots || [],
      avatar: avatar || '👨‍⚕️',
      isAvailable: true,
    });

    return NextResponse.json({ doctor, message: 'Doctor added successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
