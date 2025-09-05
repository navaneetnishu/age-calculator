import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    if (!query.trim()) {
      return NextResponse.json({
        celebrities: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        }
      });
    }

    // Get all categories
    const indexPath = join(process.cwd(), 'src', 'data', 'celebrities', 'index.json');
    const indexData = readFileSync(indexPath, 'utf-8');
    const categories = JSON.parse(indexData);

    let allCelebrities: any[] = [];
    const searchLower = query.toLowerCase();

    // Search across all categories
    for (const category of categories.categories) {
      try {
        const categoryPath = join(process.cwd(), 'src', 'data', 'celebrities', `${category.id}.json`);
        const categoryData = readFileSync(categoryPath, 'utf-8');
        const categoryInfo = JSON.parse(categoryData);
        
        // Filter celebrities by search query
        const matchingCelebrities = categoryInfo.celebrities.filter((celebrity: any) =>
          celebrity.name.toLowerCase().includes(searchLower) ||
          celebrity.profession?.toLowerCase().includes(searchLower) ||
          celebrity.nationality?.toLowerCase().includes(searchLower) ||
          celebrity.bio?.toLowerCase().includes(searchLower) ||
          celebrity.achievements?.some((achievement: string) => 
            achievement.toLowerCase().includes(searchLower)
          )
        );

        // Add category info to each celebrity
        matchingCelebrities.forEach((celebrity: any) => {
          celebrity.categoryInfo = {
            id: category.id,
            label: category.label,
            icon: category.icon
          };
        });

        allCelebrities = allCelebrities.concat(matchingCelebrities);
      } catch (error) {
        console.error(`Error reading category ${category.id}:`, error);
      }
    }

    // Sort results
    allCelebrities.sort((a, b) => {
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
    const total = allCelebrities.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCelebrities = allCelebrities.slice(startIndex, endIndex);

    return NextResponse.json({
      celebrities: paginatedCelebrities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      query
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
