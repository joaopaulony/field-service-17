
import React, { useEffect } from 'react';

interface SEOMetaTagsProps {
  title: string;
  description?: string;
  imageUrl?: string;
  canonicalUrl?: string;
  type?: 'article' | 'website';
  publishedTime?: string;
  tags?: string[];
}

const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title,
  description,
  imageUrl,
  canonicalUrl,
  type = 'website',
  publishedTime,
  tags
}) => {
  useEffect(() => {
    // Update the document title
    document.title = title;
    
    // Helper function to create or update meta tags
    const setMetaTag = (name: string, content: string, property?: string) => {
      let element = document.querySelector(property 
        ? `meta[property="${property}"]` 
        : `meta[name="${name}"]`
      ) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    // Get common values
    const siteUrl = window.location.origin;
    const metaDescription = description || 'Serviços de manutenção, reparos e instalações profissionais';
    const metaImageUrl = imageUrl || `${siteUrl}/placeholder.svg`;
    const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
    
    // Set basic meta tags
    setMetaTag('description', metaDescription);
    
    // Set Open Graph tags
    setMetaTag('og:type', type, 'og:type');
    setMetaTag('og:title', title, 'og:title');
    setMetaTag('og:description', metaDescription, 'og:description');
    setMetaTag('og:image', metaImageUrl, 'og:image');
    if (fullCanonicalUrl) {
      setMetaTag('og:url', fullCanonicalUrl, 'og:url');
    }
    
    // Set Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', metaDescription);
    setMetaTag('twitter:image', metaImageUrl);
    
    // Article specific tags
    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, 'article:published_time');
    }
    
    // Handle article tags
    if (tags && tags.length > 0) {
      // Remove existing article tags
      document.querySelectorAll('meta[property="article:tag"]').forEach(tag => {
        tag.remove();
      });
      
      // Add new article tags
      tags.forEach(tag => {
        const element = document.createElement('meta');
        element.setAttribute('property', 'article:tag');
        element.setAttribute('content', tag);
        document.head.appendChild(element);
      });
    }
    
    // Handle canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (fullCanonicalUrl) {
      if (!canonicalElement) {
        canonicalElement = document.createElement('link');
        canonicalElement.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalElement);
      }
      canonicalElement.setAttribute('href', fullCanonicalUrl);
    } else if (canonicalElement) {
      canonicalElement.remove();
    }
    
    // Cleanup function to remove tags when component unmounts
    return () => {
      // We don't remove the tags on unmount to maintain SEO across page navigations
      // But we could if desired
    };
  }, [title, description, imageUrl, canonicalUrl, type, publishedTime, tags]);
  
  // This component doesn't render anything visible
  return null;
};

export default SEOMetaTags;
