import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read the categories index file
    const indexPath = join(process.cwd(), 'src', 'data', 'celebrities', 'index.json');
    const indexData = readFileSync(indexPath, 'utf-8');
    const categories = JSON.parse(indexData);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error reading categories index:', error);
    return NextResponse.json(
      { error: 'Failed to load categories' },
      { status: 500 }
    );
  }
}
