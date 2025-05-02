
import { Helmet } from 'react-helmet';
import React from 'react';

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
  const siteUrl = window.location.origin;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  const metaDescription = description || 'Serviços de manutenção, reparos e instalações profissionais';
  const metaImageUrl = imageUrl || `${siteUrl}/placeholder.svg`;

  return (
    <Helmet>
      {/* Título básico */}
      <title>{title}</title>
      <meta name="description" content={metaDescription} />

      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImageUrl} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImageUrl} />

      {/* Artigo específicas metas */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Tags do artigo */}
      {tags && tags.length > 0 && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
    </Helmet>
  );
};

export default SEOMetaTags;
