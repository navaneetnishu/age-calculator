import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    
    // Validate category parameter
    if (!category || category.includes('..') || category.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid category parameter' },
        { status: 400 }
      );
    }

    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    
    // Read the specific category file
    const categoryPath = join(process.cwd(), 'src', 'data', 'celebrities', `${category}.json`);
    const categoryData = readFileSync(categoryPath, 'utf-8');
    const categoryInfo = JSON.parse(categoryData);
    let celebrities = categoryInfo.celebrities;

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      celebrities = celebrities.filter((celebrity: any) =>
        celebrity.name.toLowerCase().includes(searchLower) ||
        celebrity.profession?.toLowerCase().includes(searchLower) ||
        celebrity.nationality?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    celebrities.sort((a: any, b: any) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (sortBy === 'birthDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });

    // Apply pagination
    const total = celebrities.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCelebrities = celebrities.slice(startIndex, endIndex);

    const response = NextResponse.json({
      category: categoryInfo.category,
      label: categoryInfo.label,
      icon: categoryInfo.icon,
      celebrities: paginatedCelebrities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

    // Add caching headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
    response.headers.set('ETag', `"${category}-${page}-${limit}"`);
    
    return response;
  } catch (error) {
    console.error(`Error reading category:`, error);
    return NextResponse.json(
      { error: 'Category not found' },
      { status: 404 }
    );
  }
}
