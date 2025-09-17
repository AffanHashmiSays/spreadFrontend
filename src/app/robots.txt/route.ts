export async function GET() {
  try {
    const backendUrl = 'https://be.spreadtheword.fr/';
    const response = await fetch(`${backendUrl}/robots.txt`);

    if (!response.ok) {
      throw new Error('Failed to fetch robots.txt');
    }

    const txt = await response.text();

    return new Response(txt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    return new Response('Error generating robots.txt', { status: 500 });
  }
}

