# Production Caching Configuration

When you're ready for production, replace the `cache: 'no-store'` with proper caching:

```javascript
// For posts (change frequently)
fetch(`${apiBaseUrl}/posts`, { 
  next: { revalidate: 300 } // 5 minutes
})

// For categories/tags (change less frequently)  
fetch(`${apiBaseUrl}/categories`, { 
  next: { revalidate: 3600 } // 1 hour
})

// For individual posts
fetch(`${apiBaseUrl}/posts/slug/${slug}`, { 
  next: { revalidate: 1800 } // 30 minutes
})
```

This will give you the performance benefits of caching while still keeping content reasonably fresh. 