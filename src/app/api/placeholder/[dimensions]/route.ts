import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dimensions: string }> }
) {
  const { dimensions } = await params;
  const [width, height] = dimensions.split('x').map(Number);
  
  if (!width || !height || width > 2000 || height > 2000) {
    return new NextResponse('Invalid dimensions', { status: 400 });
  }

  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">
        ${width}x${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}
