import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Vendor } from '@/lib/models/Vendor';

// GET vendor products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const vendorId = request.nextUrl.searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID required' },
        { status: 400 }
      );
    }

    const products = await Product.find({ vendorId }).populate('vendorId', 'vendorName rating');

    return NextResponse.json(
      {
        message: 'Products retrieved',
        products,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching products:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST - Add product
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { vendorId, name, description, price, category, stock, image, ...otherFields } = body;

    if (!vendorId || !name || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify vendor exists and is verified
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (vendor.status !== 'verified') {
      return NextResponse.json(
        { error: 'Your vendor account is not verified' },
        { status: 403 }
      );
    }

    // Create product
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      vendorId,
      vendorName: vendor.vendorName,
      vendorRating: vendor.rating,
      ...otherFields,
    });

    return NextResponse.json(
      {
        message: 'Product added successfully',
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding product:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to add product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { productId, vendorId, ...updateData } = body;

    if (!productId || !vendorId) {
      return NextResponse.json(
        { error: 'Product ID and Vendor ID required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const product = await Product.findById(productId);
    if (!product || product.vendorId.toString() !== vendorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    return NextResponse.json(
      {
        message: 'Product updated successfully',
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating product:', error.message);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Remove product
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const vendorId = searchParams.get('vendorId');

    if (!productId || !vendorId) {
      return NextResponse.json(
        { error: 'Product ID and Vendor ID required' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId);
    if (!product || product.vendorId.toString() !== vendorId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(productId);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting product:', error.message);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
