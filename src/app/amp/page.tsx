import { Metadata } from 'next';
import { headers } from 'next/headers';
import ArticlesAMP from '@/page-components/ArticlesAMP';

// AMP metadata
export async function generateMetadata(): Promise<Metadata> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const res = await fetch(`${apiBaseUrl}/meta-tags/home`, { next: { revalidate: 60 } });
    const json = await res.json();
    const data = json.data || {};
    
    return {
      title: data.title || 'Spread The Word - AMP',
      description: data.description || '',
      other: {
        // AMP specific meta tags
        'format-detection': 'telephone=no',
        'amp-script-src': 'sha384-allowed',
        'amp-experiment-opt': 'true'
      }
    };
  } catch (error) {
    return {
      title: 'Spread The Word - AMP',
      description: 'Fast mobile experience for Spread The Word news and articles',
    };
  }
}

// Server-side data fetching optimized for AMP
async function fetchAMPData() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const [postsResponse, categoriesResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/posts?page=1&limit=6`, { // Reduce to 6 posts for faster initial load
        next: { 
          revalidate: 300, // 5 minutes cache for AMP
          tags: ['posts'] 
        },
        headers: {
          'User-Agent': 'NextJS-AMP/1.0',
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${apiBaseUrl}/categories`, { 
        next: { 
          revalidate: 600, // 10 minutes cache
          tags: ['categories'] 
        },
        headers: {
          'User-Agent': 'NextJS-AMP/1.0',
          'Content-Type': 'application/json'
        }
      }),
    ]);

    const [postsData, categoriesData] = await Promise.all([
      postsResponse.ok ? postsResponse.json() : { data: [], pagination: {} },
      categoriesResponse.ok ? categoriesResponse.json() : [],
    ]);

    // Normalize data from paginated response
    const normalizedPosts = postsData?.data || [];
    const normalizedCategories = Array.isArray(categoriesData) ? categoriesData : 
                               (categoriesData?.data ? categoriesData.data : 
                               (categoriesData?.categories ? categoriesData.categories : []));

    const publishedPosts = normalizedPosts.filter((post: any) => post.status === 'published');
    
    // Filter posts to only include those with image_urls array
    const postsWithImages = publishedPosts.filter((post: any) => 
      Array.isArray(post.image_urls) && post.image_urls.length > 0
    );
    
    return {
      posts: postsWithImages,
      categories: normalizedCategories,
      pagination: postsData?.pagination || { currentPage: 1, totalPages: 1 },
    };
  } catch (error) {
    console.error('AMP: Error fetching data:', error);
    return {
      posts: [],
      categories: [],
      pagination: { currentPage: 1, totalPages: 1 },
    };
  }
}

export default async function AMPPage() {
  const { posts, categories, pagination } = await fetchAMPData();
  
  // Get the main story image for preloading
  const mainStory = posts.length > 0 ? posts[0] : null;
  const mainImageUrl = mainStory && Array.isArray(mainStory.image_urls) && mainStory.image_urls.length > 0 
    ? mainStory.image_urls[0].startsWith('http') 
      ? mainStory.image_urls[0] 
      : `https://spread.cemantix.net${mainStory.image_urls[0].startsWith('/') ? '' : '/'}${mainStory.image_urls[0]}`
    : null;
  
  return (
    <>
      {/* Preload main story image */}
      {mainImageUrl && (
        <link rel="preload" as="image" href={mainImageUrl} fetchPriority="high" />
      )}
      <ArticlesAMP initialPosts={posts} categories={categories} initialPagination={pagination} />
    </>
  );
}