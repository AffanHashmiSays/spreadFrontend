import { Metadata } from 'next';

import { PostViewSSR } from '@/components/posts/PostViewSSR';

import CategoryPageSSR from '@/page-components/CategoryPageSSR';
import { notFound } from 'next/navigation';

interface DynamicPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

// Fetch categories from API
async function fetchCategories() {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const response = await fetch(`${apiBaseUrl}/categories`, {
      next: { 
        revalidate: 300, // Cache for 5 minutes
        tags: ['categories'] 
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
      return [];
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

// Check if this is a valid category slug
async function isValidCategorySlug(slug: string): Promise<boolean> {
  const categories = await fetchCategories();
  return categories.some((cat: any) => cat.slug === slug);
}

// Fetch post data from API
async function fetchPostData(slug: string) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const response = await fetch(`${apiBaseUrl}/posts/slug/${slug}`, {
      next: { 
        revalidate: 600, // Cache for 10 minutes
        tags: ['posts', `post-${slug}`] 
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch post: ${response.status} ${response.statusText}`);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

// Check if this is a valid post slug
async function isValidPostSlug(slug: string): Promise<boolean> {
  const post = await fetchPostData(slug);
  return post !== null;
}

// Generate metadata based on whether it's a category or post
export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  
  // Hardcoded meta for 'politique' category
  if (categorySlug === 'politique') {
    return {
      title: 'Politique en France – Actualités & Analyses | SpreadTheWord',
      description: 'Suivez l’actualité politique en France : débats, réformes, élections et analyses claires. Des infos fiables et rapides sur SpreadTheWord.fr',
      keywords: 'politique, France, actualités, débats, réformes, élections, analyses, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Hardcoded meta for 'actualites' category
  if (categorySlug === 'actualites') {
    return {
      title: 'Actualités France & Monde – Infos Fiables | SpreadTheWord',
      description: 'Suivez l’actualité en direct : politique, économie, culture, tech et société. Des infos claires, rapides et fiables sur SpreadTheWord.fr.',
      keywords: 'actualités, France, monde, politique, économie, culture, tech, société, infos, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Hardcoded meta for 'divertissement' category
  if (categorySlug === 'divertissement') {
    return {
      title: 'Divertissement – Cinéma, Musique & Culture | SpreadTheWord',
      description: 'Découvrez l’actualité divertissement : cinéma, musique, séries, célébrités et culture pop. Tendances et infos fraîches sur SpreadTheWord.fr.',
      keywords: 'divertissement, cinéma, musique, séries, célébrités, culture pop, tendances, infos, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Hardcoded meta for 'economie' category
  if (categorySlug === 'economie') {
    return {
      title: 'Économie – Actualités & Analyses Financières | SpreadTheWord',
      description: 'Suivez l’actualité économique en France et à l’international : marchés, entreprises, emploi et finances. Infos claires et fiables sur SpreadTheWord.fr.',
      keywords: 'économie, actualités, analyses, finances, marchés, entreprises, emploi, France, international, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Hardcoded meta for 'monde' category
  if (categorySlug === 'monde') {
    return {
      title: 'Monde – Actualités Internationales & Analyses | SpreadTheWord',
      description: 'Suivez l’actualité internationale : politique, économie, société et culture. Analyses claires et infos fiables du monde entier sur SpreadTheWord.fr.',
      keywords: 'monde, actualités, internationales, analyses, politique, économie, société, culture, infos, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Hardcoded meta for 'sante' category
  if (categorySlug === 'sante') {
    return {
      title: 'Santé – Actualités Médicales & Bien-Être | SpreadTheWord',
      description: 'Suivez l’actualité santé : médecine, bien-être, prévention et innovations. Infos claires et fiables pour rester informé sur SpreadTheWord.fr.',
      keywords: 'santé, actualités, médicales, bien-être, médecine, prévention, innovations, infos, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Hardcoded meta for 'sci-tech' category
  if (categorySlug === 'sci-tech') {
    return {
      title: 'Science et Technologie – Innovations & Découvertes | SpreadTheWord',
      description: 'Suivez l’actualité science et technologie : innovations, recherche, IA, espace et tendances numériques. Infos claires et fiables sur SpreadTheWord.fr.',
      keywords: 'science, technologie, innovations, découvertes, recherche, IA, espace, tendances numériques, infos, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  
  if (categorySlug === 'sport') {
    return {
      title: 'Sport – Actualités & Résultats en Direct | SpreadTheWord',
      description: 'Suivez l’actualité sportive : football, basketball, tennis, compétitions internationales et résultats en direct. Infos fiables sur SpreadTheWord.fr.',
      keywords: 'sport, technologie, innovations, découvertes, recherche, IA, espace, tendances numériques, infos, SpreadTheWord',
      authors: [{ name: 'Votre Entreprise' }],
    };
  }
  // Check if this is a category first
  const isCategory = await isValidCategorySlug(categorySlug);
  if (isCategory) {
    // Get category data for metadata
    const categories = await fetchCategories();
    const category = categories.find((cat: any) => cat.slug === categorySlug);
    
    return {
      title: `${category?.name || categorySlug} - CRM Platform`,
      description: `Browse articles in the ${category?.name || categorySlug} category.`,
    };
  }
  
  // Check if this is a post
  const post = await fetchPostData(categorySlug);
  if (post) {
    // Use custom meta fields if available, otherwise fall back to post content
    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || post.excerpt || 'Read this article on our CRM platform.';
    const metaKeywords = post.metaKeywords || '';
    
    // Use only the environment variable, remove /api for frontend URLs
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    // Always use /{slug} structure for canonical URLs to prevent duplicate content
    const canonicalUrl = post.canonicalUrl || `${baseUrl}/${categorySlug}`;
    
    return {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords,
      
      // Open Graph
      openGraph: {
        title: post.ogTitle || metaTitle,
        description: post.ogDescription || metaDescription,
        type: 'article',
        url: canonicalUrl,
        siteName: 'CRM Platform',
        ...(post.metaImage && {
          images: [
            {
              url: post.metaImage,
              width: 1200,
              height: 630,
              alt: metaTitle,
            }
          ]
        }),
        ...(post.createdAt && { publishedTime: post.createdAt }),
        ...(post.updatedAt && { modifiedTime: post.updatedAt }),
        ...(post.authorId?.name && { authors: [post.authorId.name] }),
      },
      
      // Twitter
      twitter: {
        card: post.twitterCard || 'summary_large_image',
        title: post.twitterTitle || metaTitle,
        description: post.twitterDescription || metaDescription,
        ...(post.twitterImage && { images: [post.twitterImage] }),
      },
      
      // Additional meta tags
      alternates: {
        canonical: canonicalUrl,
      },
      
      // Robots - Allow indexing of posts from /{slug} route
      robots: {
        index: true, // Index posts from this route
        follow: true, // Still follow links
        googleBot: {
          index: true, // Index posts from this route
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      },
      
      // Additional meta tags using other
      other: {
        ...(post.focusKeyword && { 'article:tag': post.focusKeyword }),
        'article:author': post.authorId?.name || 'CRM Platform',
        'article:section': post.categoryIds?.[0]?.name || 'News',
        'og:locale': 'en_US',
        'og:site_name': 'CRM Platform',
        ...(post.readingTime && { 'article:reading_time': post.readingTime.toString() }),
      },
    };
  }
  
  // Neither category nor post found
  const title = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${title} - CRM Platform`,
    description: 'Page not found.',
  };
}

// Fetch category data for SSR
async function fetchCategoryData(categorySlug: string) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const [categoriesResponse, postsResponse, tagsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/categories`, {
        next: { 
          revalidate: 300, // Cache for 5 minutes
          tags: ['categories'] 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${apiBaseUrl}/posts/by-category/${categorySlug}`, {
        next: { 
          revalidate: 180, // Cache for 3 minutes
          tags: ['posts', `category-${categorySlug}`] 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${apiBaseUrl}/tags`, {
        next: { 
          revalidate: 600, // Cache for 10 minutes
          tags: ['tags'] 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ]);
    
    if (!categoriesResponse.ok || !postsResponse.ok || !tagsResponse.ok) {
      console.error('Failed to fetch category data');
      return null;
    }
    
    const [categories, posts, tags] = await Promise.all([
      categoriesResponse.json(),
      postsResponse.json(),
      tagsResponse.json()
    ]);
    
    // Find the category
    const category = categories.find((c: any) => c.slug === categorySlug && c.parentId === null);
    if (!category) {
      return null;
    }
    
    // Filter only published posts
    const publishedPosts = posts.filter((post: any) => post.status === 'published');
    
    // Filter posts to only include those with image_urls array (don't validate URLs yet)
    const postsWithImages = publishedPosts.filter((post: any) => 
      Array.isArray(post.image_urls) && post.image_urls.length > 0
    );
    
    return {
      posts: postsWithImages,
      categories,
      tags,
      category,
      subcategory: null
    };
  } catch (error) {
    console.error('Failed to fetch category data:', error);
    return null;
  }
}

// Fetch post data for SSR
async function fetchPostSSRData(slug: string) {
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const [postResponse, postsResponse, categoriesResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/posts/slug/${slug}`, {
        next: { 
          revalidate: 600, // Cache for 10 minutes
          tags: ['posts', `post-${slug}`] 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${apiBaseUrl}/posts`, {
        next: { 
          revalidate: 300, // Cache for 5 minutes
          tags: ['posts'] 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      fetch(`${apiBaseUrl}/categories`, {
        next: { 
          revalidate: 300, // Cache for 5 minutes
          tags: ['categories'] 
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ]);
    
    if (!postResponse.ok || !postsResponse.ok || !categoriesResponse.ok) {
      console.error('Failed to fetch post SSR data');
      return null;
    }
    
    const [post, posts, categories] = await Promise.all([
      postResponse.json(),
      postsResponse.json(),
      categoriesResponse.json()
    ]);
    
    // Filter only published posts
    const publishedPosts = (posts.data || []).filter((p: any) => p.status === 'published');
    
    return {
      post,
      posts: publishedPosts,
      categories
    };
  } catch (error) {
    console.error('Failed to fetch post SSR data:', error);
    return null;
  }
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { categorySlug } = await params;
  
  // Check if this is a category first
  const isCategory = await isValidCategorySlug(categorySlug);
  if (isCategory) {
    const categoryData = await fetchCategoryData(categorySlug);
    if (!categoryData) {
      notFound();
    }
    return <CategoryPageSSR initialData={categoryData} />;
  }
  
  // Check if this is a post
  const isPost = await isValidPostSlug(categorySlug);
  if (isPost) {
    const postSSRData = await fetchPostSSRData(categorySlug);
    if (!postSSRData) {
      notFound();
    }
    
    // Fetch post data for structured data
    const post = postSSRData.post;
    
    // Use only the environment variable, remove /api for frontend URLs
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
    
    return (
      <>
        {/* JSON-LD structured data using real post data */}
        {post && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.metaTitle || post.title,
                description: post.metaDescription || post.excerpt,
                author: {
                  '@type': 'Person',
                  name: post.authorId?.name || 'CRM Platform'
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'CRM Platform',
                  url: baseUrl
                },
                datePublished: post.createdAt,
                dateModified: post.updatedAt,
                url: post.canonicalUrl || `${baseUrl}/${categorySlug}`,
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': post.canonicalUrl || `${baseUrl}/${categorySlug}`
                },
                ...(post.metaImage && {
                  image: {
                    '@type': 'ImageObject',
                    url: post.metaImage,
                    width: 1200,
                    height: 630
                  }
                }),
                ...(post.categoryIds && post.categoryIds.length > 0 && {
                  articleSection: post.categoryIds.map((cat: any) => cat.name).filter(Boolean)
                }),
                ...(post.tagIds && post.tagIds.length > 0 && {
                  keywords: post.tagIds.map((tag: any) => tag.name).filter(Boolean).join(', ')
                }),
                ...(post.readingTime && {
                  timeRequired: `PT${post.readingTime}M`
                })
              })
            }}
          />
        )}
        
        <PostViewSSR initialData={postSSRData} />
      </>
    );
  }
  
  // Neither category nor post found
  notFound();
}
