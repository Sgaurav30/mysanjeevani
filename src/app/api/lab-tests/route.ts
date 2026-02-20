import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { LabTest } from '@/lib/models/LabTest';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const category = request.nextUrl.searchParams.get('category');
    const search = request.nextUrl.searchParams.get('search');
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');

    const query: any = { isActive: true };

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { testName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tests = await LabTest.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await LabTest.countDocuments(query);

    return NextResponse.json(
      {
        message: 'Lab tests fetched successfully',
        tests,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get lab tests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      testName,
      description,
      price,
      category,
      reportTime,
      sampleType,
      fasting,
      fastingHours,
    } = body;

    if (!testName || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const test = await LabTest.create({
      testName,
      description,
      price,
      category,
      reportTime,
      sampleType,
      fasting,
      fastingHours,
      homeCollectionAvailable: true,
      centerCollectionAvailable: true,
      isActive: true,
    });

    return NextResponse.json(
      {
        message: 'Lab test created successfully',
        test,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create lab test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
