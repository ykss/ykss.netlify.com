import React from 'react';
import PropTypes from 'prop-types';

export function Seo({
  description,
  lang = `en`,
  meta = [],
  keywords = [],
  siteMetadata,
  thumbnail = undefined,
  title,
  canonicalUrl = undefined,
}) {
  const metaDescription = description || siteMetadata.description;
  const metaTags = [
    {
      name: `description`,
      content: metaDescription,
    },
    {
      property: `og:title`,
      content: title,
    },
    {
      property: `og:description`,
      content: metaDescription,
    },
    {
      property: `og:type`,
      content: `website`,
    },
    {
      name: `twitter:card`,
      content: thumbnail ? `summary_large_image` : `summary`,
    },
    {
      name: `twitter:creator`,
      content: siteMetadata.author,
    },
    {
      name: `twitter:title`,
      content: title,
    },
    {
      name: `twitter:description`,
      content: metaDescription,
    },
  ]
    .concat(
      thumbnail
        ? [
            {
              property: `og:image`,
              content: thumbnail,
            },
            {
              name: `twitter:image`,
              content: thumbnail,
            },
          ]
        : []
    )
    .concat(
      keywords.length > 0
        ? {
            name: `keywords`,
            content: keywords.join(`, `),
          }
        : []
    )
    .concat(meta);

  return (
    <>
      <html lang={lang} />
      <title>{`${title} | ${siteMetadata.title}`}</title>
      {metaTags.map(tag => (
        <meta
          key={`${tag.name || tag.property}-${tag.content}`}
          {...tag}
        />
      ))}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </>
  );
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  siteMetadata: PropTypes.shape({
    author: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  thumbnail: PropTypes.string,
  title: PropTypes.string.isRequired,
  canonicalUrl: PropTypes.string,
};
