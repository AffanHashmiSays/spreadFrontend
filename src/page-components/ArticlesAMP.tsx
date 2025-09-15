'use client';

import { Post, Category } from '../types/post';

const imageBaseUrl = 'https://spread.cemantix.net';

function getPostImage(post: Post): string | null {
  if (Array.isArray(post.image_urls) && post.image_urls.length > 0) {
    const imagePath = post.image_urls[0];
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${imageBaseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }
  return null;
}

function getExcerptFromContent(html: string, wordCount = 25): string {
  if (!html) return '';
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return text.split(/\s+/).slice(0, wordCount).join(' ') + (text.split(/\s+/).length > wordCount ? '...' : '');
}

// Chunk posts for magazine layout (similar to ArticlesSSR)
function chunkSections(arr: Post[], chunkSize: number, sliderSize: number) {
  const sections = [];
  let i = 0;
  while (i < arr.length) {
    const section = arr.slice(i, i + chunkSize);
    i += chunkSize;
    const slider = arr.slice(i, i + sliderSize);
    i += sliderSize;
    sections.push({ section, slider });
  }
  return sections;
}

// Helper to get sidebar headlines
function getSidebarStories(posts: Post[], startIdx: number): Post[] {
  return posts.slice(startIdx + 3, startIdx + 7);
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface ArticlesAMPProps {
  initialPosts: Post[];
  categories: Category[];
  initialPagination: Pagination;
}

export default function ArticlesAMP({ initialPosts, categories, initialPagination }: ArticlesAMPProps) {
  const posts = initialPosts || []; // Use static posts for faster rendering
  const pagination = initialPagination;
  // Remove state management for faster rendering

  // Removed infinite scroll for faster rendering
  const parentCategories = categories.filter(category => !category.parentId);
  
  // Apply magazine layout logic similar to ArticlesSSR
  const sections = chunkSections(posts, 3, 4);
  
  // Extract posts for different layout sections - Reduce above-the-fold content
  const mainStory = sections.length > 0 ? sections[0].section[0] : null;
  const secondaryStories = sections.length > 0 ? sections[0].section.slice(1, 2) : []; // Reduce from 3 to 2
  const sidebarStories = sections.length > 0 ? getSidebarStories(posts, 0).slice(0, 2) : []; // Reduce from 4 to 2
  const carouselPosts = sections.length > 0 ? sections[0].slider.slice(0, 1) : []; // Keep only 1
  
  // Modern 3-column layout posts (after first section)
  const modernStartIdx = 3 + 4; // skip first 3 (main+2) and 4 (carousel)
  const modernPosts = posts.slice(modernStartIdx, modernStartIdx + 11); // Use same as ArticlesSSR
  const leftLarge = modernPosts[0];
  const leftSmall = modernPosts.slice(1, 4); // Same as ArticlesSSR
  const centerXL = modernPosts[4];
  const centerSmall = modernPosts.slice(5, 7);
  const rightLarge = modernPosts[7];
  const rightSmall = modernPosts.slice(8, 11);
  
  // Posts after the modern 3-column layout (for infinite scroll)
  const afterModernIdx = modernStartIdx + modernPosts.length;
  const remainingPosts = posts.slice(afterModernIdx);


  return (
    <>
      {/* Critical CSS for AMP */}
      <style amp-custom>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }
        .header { background: #fff; border-bottom: 1px solid #e5e5e5; padding: 12px 0; position: sticky; top: 0; z-index: 100; }
        .header-content { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 20px; font-weight: 700; color: #333; text-decoration: none; }
        .menu-toggle { background: none; border: none; font-size: 18px; cursor: pointer; padding: 8px; }
        .nav-categories { background: #f8f9fa; border-bottom: 1px solid #e5e5e5; overflow-x: auto; padding: 12px 0; }
        .nav-list { display: flex; gap: 16px; white-space: nowrap; }
        .nav-item { color: #666; text-decoration: none; padding: 8px 12px; border-radius: 4px; font-size: 14px; }
        .nav-item.active, .nav-item:hover { color: #333; background: #fff; }
        .read-more { color: #0066cc; text-decoration: none; font-weight: 500; font-size: 14px; }
        .read-more:hover { text-decoration: underline; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content text-[#708238]">
            <a href="/" className="logo text-[#708238]">
              Spread The Word
            </a>
            <button 
              className="menu-toggle"
              role="button"
              tabIndex={0}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Using regular div for now */}
      <div id="sidebar" style={{ display: 'none' }}>
        <div className="sidebar-header">
          <span className="logo">Menu</span>
          <button 
            className="sidebar-close"
            role="button"
            tabIndex={0}
          >
            ✕
          </button>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li><a href="/">Accueil</a></li>
            {parentCategories.map(category => (
              <li key={category._id}>
                <a href={`/${category.slug}`}>{category.name}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Navigation Categories */}
      <nav className="nav-categories">
        <div className="nav-list bg-[#708238]">
          <a href="/" className="nav-item active">Tout</a>
          {parentCategories.slice(0, 8).map(category => (
            <a 
              key={category._id} 
              href={`/${category.slug}`} 
              className="nav-item"
            >
              {category.name}
            </a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        {/* Magazine Layout - Hero Section with Secondary Posts and Sidebar */}
        {mainStory && (
          <section style={{ marginBottom: '40px' }}>
            <div className="magazine-hero" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr',
              gap: '20px'
            }}>
              {/* Mobile: Stack vertically, Desktop: 2fr 1fr */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '20px'
              }}>
                {/* Main Story */}
                <article style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: '20px' }}>
                  {getPostImage(mainStory) && (
                    <amp-img
                      src={getPostImage(mainStory)!}
                      alt={mainStory.title}
                      width="400"
                      height="400"
                      layout="responsive"
                      fetchpriority="high"
                      style={{ 
                        borderRadius: '8px', 
                        marginBottom: '16px' 
                      }}
                    />
                  )}
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    margin: '0 0 12px 0',
                    color: '#333'
                  }}>
                    <a href={`/posts/${mainStory.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {mainStory.title}
                    </a>
                  </h1>
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#666',
                    margin: '0 0 16px 0'
                  }}>
                    {getExcerptFromContent(mainStory.content, 40)}
                  </p>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    marginBottom: '12px'
                  }}>
                    {new Date(mainStory.createdAt).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                  <a href={`/posts/${mainStory.slug}`} className="read-more">
                    Lire la suite
                  </a>
                </article>

                {/* Secondary Stories */}
                {secondaryStories.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '16px'
                  }}>
                    {secondaryStories.map(post => (
                      <article key={post._id || post.id} style={{
                        display: 'flex',
                        gap: '12px',
                        borderBottom: '1px solid #f0f0f0',
                        paddingBottom: '16px'
                      }}>
                        {getPostImage(post) && (
                          <amp-img
                            src={getPostImage(post)!}
                            alt={post.title}
                            width="120"
                            height="80"
                            layout="fixed"
                            style={{ 
                              borderRadius: '6px', 
                              flexShrink: '0' 
                            }}
                          />
                        )}
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            lineHeight: '1.4',
                            margin: '0 0 8px 0'
                          }}>
                            <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                              {post.title}
                            </a>
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#666',
                            margin: '0 0 8px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {getExcerptFromContent(post.content, 15)}
                          </p>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Headlines */}
              {sidebarStories.length > 0 && (
                <aside style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  marginTop: '20px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    color: '#333'
                  }}>
                    Dernières Nouvelles
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sidebarStories.map(post => (
                      <article key={post._id || post.id} style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ flex: '1', minWidth: '0' }}>
                          <h4 style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            lineHeight: '1.4',
                            margin: '0 0 4px 0'
                          }}>
                            <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                              {post.title}
                            </a>
                          </h4>
                          <p style={{
                            fontSize: '12px',
                            color: '#666',
                            margin: '0 0 4px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {getExcerptFromContent(post.content, 12)}
                          </p>
                          <div style={{ fontSize: '11px', color: '#999' }}>
                            {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short' 
                            })}
                          </div>
                        </div>
                        {getPostImage(post) && (
                          <amp-img
                            src={getPostImage(post)!}
                            alt={post.title}
                            width="60"
                            height="60"
                            layout="fixed"
                            style={{ 
                              borderRadius: '6px', 
                              flexShrink: '0' 
                            }}
                          />
                        )}
                      </article>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </section>
        )}

        {/* Featured Section */}
        {carouselPosts.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: '#333'
            }}>
              À la Une
            </h2>
            <div style={{
              width: '100%',
              height: '300px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              {carouselPosts.slice(0, 1).map(post => (
                <div key={post._id || post.id} style={{
                  position: 'relative',
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {getPostImage(post) && (
                    <amp-img
                      src={getPostImage(post)!}
                      alt={post.title}
                      width="400"
                      height="300"
                      layout="responsive"
                      style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '20px',
                    color: '#fff'
                  }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>
                      <a href={`/posts/${post.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>
                        {post.title}
                      </a>
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      margin: '0 0 8px 0',
                      opacity: '0.9'
                    }}>
                      {getExcerptFromContent(post.content, 15)}
                    </p>
                    <div style={{ fontSize: '12px', opacity: '0.8' }}>
                      {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Modern 3-Column Layout - Defer this section */}
        {false && leftLarge && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '24px'
            }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {leftLarge && (
                  <article style={{ marginBottom: '16px' }}>
                    {getPostImage(leftLarge) && (
                      <amp-img
                        src={getPostImage(leftLarge)!}
                        alt={leftLarge.title}
                        width="300"
                        height="250"
                        layout="responsive"
                        style={{ 
                          borderRadius: '8px', 
                          marginBottom: '12px' 
                        }}
                      />
                    )}
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>
                      <a href={`/posts/${leftLarge.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                        {leftLarge.title}
                      </a>
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '0 0 8px 0'
                    }}>
                      {getExcerptFromContent(leftLarge.content, 20)}
                    </p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(leftLarge.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </article>
                )}
                
                {leftSmall.map(post => (
                  <article key={post._id || post.id} style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid #f0f0f0',
                    paddingBottom: '12px'
                  }}>
                    {getPostImage(post) && (
                      <img
                        src={getPostImage(post)!}
                        alt={post.title}
                        style={{ 
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '6px', 
                          flexShrink: '0' 
                        }}
                      />
                    )}
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <h4 style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 4px 0',
                        lineHeight: '1.4'
                      }}>
                        <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                          {post.title}
                        </a>
                      </h4>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Center Column (Desktop only) */}
              {centerXL && (
                <div style={{ 
                  display: 'none',
                  flexDirection: 'column', 
                  gap: '16px'
                }}>
                  <article style={{ marginBottom: '16px' }}>
                    {getPostImage(centerXL) && (
                      <img
                        src={getPostImage(centerXL)!}
                        alt={centerXL.title}
                        style={{ 
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          borderRadius: '8px', 
                          marginBottom: '12px' 
                        }}
                      />
                    )}
                    <h2 style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>
                      <a href={`/posts/${centerXL.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                        {centerXL.title}
                      </a>
                    </h2>
                    <p style={{
                      fontSize: '16px',
                      color: '#666',
                      margin: '0 0 8px 0'
                    }}>
                      {getExcerptFromContent(centerXL.content, 25)}
                    </p>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                      {new Date(centerXL.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </article>
                  
                  {centerSmall.map(post => (
                    <article key={post._id || post.id} style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      borderBottom: '1px solid #f0f0f0',
                      paddingBottom: '12px'
                    }}>
                      {getPostImage(post) && (
                        <img
                          src={getPostImage(post)!}
                          alt={post.title}
                          style={{ 
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '6px', 
                            flexShrink: '0' 
                          }}
                        />
                      )}
                      <div style={{ flex: '1', minWidth: '0' }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          margin: '0 0 4px 0',
                          lineHeight: '1.4'
                        }}>
                          <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                            {post.title}
                          </a>
                        </h4>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Right Column (Desktop only) */}
              {rightLarge && (
                <div style={{ 
                  display: 'none',
                  flexDirection: 'column', 
                  gap: '16px'
                }}>
                  <article style={{ marginBottom: '16px' }}>
                    {getPostImage(rightLarge) && (
                      <img
                        src={getPostImage(rightLarge)!}
                        alt={rightLarge.title}
                        style={{ 
                          width: '100%',
                          height: 'auto',
                          maxHeight: '250px',
                          objectFit: 'cover',
                          borderRadius: '8px', 
                          marginBottom: '12px' 
                        }}
                      />
                    )}
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>
                      <a href={`/posts/${rightLarge.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                        {rightLarge.title}
                      </a>
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '0 0 8px 0'
                    }}>
                      {getExcerptFromContent(rightLarge.content, 20)}
                    </p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(rightLarge.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </article>
                  
                  {rightSmall.map(post => (
                    <article key={post._id || post.id} style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      borderBottom: '1px solid #f0f0f0',
                      paddingBottom: '12px'
                    }}>
                      {getPostImage(post) && (
                        <img
                          src={getPostImage(post)!}
                          alt={post.title}
                          style={{ 
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '6px', 
                            flexShrink: '0' 
                          }}
                        />
                      )}
                      <div style={{ flex: '1', minWidth: '0' }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          margin: '0 0 4px 0',
                          lineHeight: '1.4'
                        }}>
                          <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                            {post.title}
                          </a>
                        </h4>
                        <div style={{ fontSize: '12px', color: '#999' }}>
                          {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Simple list of remaining posts */}
        {posts.slice(3).length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              margin: '0 0 20px 0',
              color: '#333'
            }}>
              Plus d'articles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {posts.slice(3, 9).map(post => (
                <article key={post._id || post.id} style={{
                  display: 'flex',
                  gap: '12px',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '16px'
                }}>
                  {getPostImage(post) && (
                    <amp-img
                      src={getPostImage(post)!}
                      alt={post.title}
                      width="100"
                      height="80"
                      layout="fixed"
                      style={{ 
                        borderRadius: '6px', 
                        flexShrink: '0' 
                      }}
                    />
                  )}
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      lineHeight: '1.4',
                      margin: '0 0 8px 0'
                    }}>
                      <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                        {post.title}
                      </a>
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '0 0 8px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {getExcerptFromContent(post.content, 15)}
                    </p>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Hide complex layout, replace with simple one */}
        {false && remainingPosts.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {Array.from({ length: Math.ceil(remainingPosts.length / 11) }).map((_, i) => {
                const chunk = remainingPosts.slice(i * 11, (i + 1) * 11);
                const chunkLeftLarge = chunk[0];
                const chunkLeftSmall = chunk.slice(1, 4);
                const chunkCenterXL = chunk[4];
                const chunkCenterSmall = chunk.slice(5, 7);
                const chunkRightLarge = chunk[7];
                const chunkRightSmall = chunk.slice(8, 11);
                
                return (
                  <div key={`amp-chunk-${i}`} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '24px'
                  }}>
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {chunkLeftLarge && (
                        <article style={{ marginBottom: '16px' }}>
                          {getPostImage(chunkLeftLarge) && (
                            <img
                              src={getPostImage(chunkLeftLarge)!}
                              alt={chunkLeftLarge.title}
                              style={{ 
                                width: '100%',
                                height: 'auto',
                                maxHeight: '250px',
                                objectFit: 'cover',
                                borderRadius: '8px', 
                                marginBottom: '12px' 
                              }}
                            />
                          )}
                          <h3 style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: '0 0 8px 0',
                            lineHeight: '1.3'
                          }}>
                            <a href={`/posts/${chunkLeftLarge.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                              {chunkLeftLarge.title}
                            </a>
                          </h3>
                          <p style={{
                            fontSize: '14px',
                            color: '#666',
                            margin: '0 0 8px 0'
                          }}>
                            {getExcerptFromContent(chunkLeftLarge.content, 20)}
                          </p>
                          <div style={{ fontSize: '12px', color: '#999' }}>
                            {new Date(chunkLeftLarge.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                        </article>
                      )}
                      
                      {chunkLeftSmall.map(post => (
                        <article key={post._id || post.id} style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          borderBottom: '1px solid #f0f0f0',
                          paddingBottom: '12px'
                        }}>
                          {getPostImage(post) && (
                            <img
                              src={getPostImage(post)!}
                              alt={post.title}
                              style={{ 
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                borderRadius: '6px', 
                                flexShrink: '0' 
                              }}
                            />
                          )}
                          <div style={{ flex: '1', minWidth: '0' }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                              lineHeight: '1.4'
                            }}>
                              <a href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>
                                {post.title}
                              </a>
                            </h4>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              {new Date(post.createdAt).toLocaleDateString('fr-FR', { 
                                day: 'numeric', 
                                month: 'short' 
                              })}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Simple "Load More" link */}
        {posts.length >= 6 && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            borderTop: '1px solid #e5e5e5',
            marginTop: '20px'
          }}>
            <a 
              href="/" 
              style={{
                color: '#0066cc',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              Voir plus d'articles →
            </a>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#f8f9fa',
        padding: '40px 0',
        textAlign: 'center',
        marginTop: '60px',
        borderTop: '1px solid #e5e5e5'
      }}>
        <div className="container">
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            fontWeight: '600',
            color: '#333'
          }}>
            Spread The Word
          </p>
          <p style={{ 
            margin: '0', 
            fontSize: '14px', 
            color: '#666' 
          }}>
            © {new Date().getFullYear()} Tous droits réservés. 
            Version mobile optimisée.
          </p>
          <div style={{ marginTop: '16px' }}>
            <a 
              href="/" 
              style={{ 
                color: '#333', 
                textDecoration: 'none', 
                fontSize: '14px',
                marginRight: '16px'
              }}
            >
              Version complète
            </a>
            <a 
              href="/privacy" 
              style={{ 
                color: '#333', 
                textDecoration: 'none', 
                fontSize: '14px' 
              }}
            >
              Politique de confidentialité
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}