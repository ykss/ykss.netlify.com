import React, { useEffect } from 'react';
import { graphql } from 'gatsby';

import * as Elements from '../components/elements';
import { Layout } from '../layout';
import { Seo } from '../components/head';
import { PostTitle } from '../components/post-title';
import { PostDate } from '../components/post-date';
import { PostContainer } from '../components/post-container';
import { ScrollIndicator } from '../components/scroll-indicator';
import { SocialShare } from '../components/social-share';
import { SponsorButton } from '../components/sponsor-button';
import { Bio } from '../components/bio';
import { PostNavigator } from '../components/post-navigator';
import { RelatedPosts } from '../components/related-posts';
import { TableOfContents } from '../components/table-of-contents';
import { Disqus } from '../components/disqus';
import { Utterences } from '../components/utterances';
import {
  buildBlogPostingJsonLd,
  getRelatedPosts,
} from '../utils/post-recommendations';
import * as ScrollManager from '../utils/scroll';

import '../styles/code.scss';
import 'katex/dist/katex.min.css';

const BlogPostTemplate = ({ data, pageContext, location }) => {
  useEffect(() => {
    ScrollManager.init();
    return () => ScrollManager.destroy();
  }, []);

  const post = data.markdownRemark;
  const metaData = data.site.siteMetadata;
  const slug = pageContext.slug;
  const { title, comment, siteUrl, author, sponsor } = metaData;
  const { disqusShortName, utterances } = comment;
  const {
    title: postTitle,
    date,
    thumbnail,
    canonicalUrl,
    category,
    toc,
  } = post.frontmatter;
  const thumbnailSrc = thumbnail
    ? `${siteUrl}${thumbnail.childImageSharp.gatsbyImageData.images.fallback.src}`
    : undefined;
  const relatedPosts = getRelatedPosts(data.relatedPosts.edges, {
    slug,
    category,
  });

  return (
    <Layout location={location} title={title}>
      <ScrollIndicator />
      <PostTitle title={postTitle} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PostDate date={date} />
      </div>
      {toc !== false && <TableOfContents headings={post.headings} />}
      <PostContainer html={post.html} />{' '}
      {!!sponsor.buyMeACoffeeId && (
        <SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
      )}{' '}
      <Elements.Hr />
      <Bio />
      <RelatedPosts posts={relatedPosts} />
      <PostNavigator pageContext={pageContext} />{' '}
      {!!disqusShortName && (
        <Disqus
          post={post}
          shortName={disqusShortName}
          siteUrl={siteUrl}
          slug={pageContext.slug}
        />
      )}{' '}
      {!!utterances && <Utterences repo={utterances} />}{' '}
    </Layout>
  );
};

export default BlogPostTemplate;

export const Head = ({ data }) => {
  const post = data.markdownRemark;
  const siteMetadata = data.site.siteMetadata;
  const {
    title: postTitle,
    isoDate,
    thumbnail,
    canonicalUrl,
  } = post.frontmatter;
  const thumbnailSrc = thumbnail
    ? `${siteMetadata.siteUrl}${thumbnail.childImageSharp.gatsbyImageData.images.fallback.src}`
    : undefined;
  const postUrl = `${siteMetadata.siteUrl}${post.fields.slug}`;
  const jsonLd = buildBlogPostingJsonLd({
    author: siteMetadata.author,
    canonicalUrl,
    datePublished: isoDate,
    description: post.excerpt,
    image: thumbnailSrc,
    siteUrl: siteMetadata.siteUrl,
    title: postTitle,
    url: postUrl,
  });

  return (
    <>
      <Seo
        title={postTitle}
        description={post.excerpt}
        thumbnail={thumbnailSrc}
        canonicalUrl={canonicalUrl}
        siteMetadata={siteMetadata}
      />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
};

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        comment {
          disqusShortName
          utterances
        }
        sponsor {
          buyMeACoffeeId
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280)
      fields {
        slug
      }
      html
      headings {
        id
        value
        depth
      }
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        isoDate: date(formatString: "YYYY-MM-DD")
        category
        toc
        thumbnail {
          childImageSharp {
            gatsbyImageData(width: 600, layout: FIXED)
          }
        }
        canonicalUrl
      }
    }
    relatedPosts: allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        fields: { slug: { ne: null } }
        frontmatter: { title: { ne: "" }, category: { ne: null } }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            category
          }
        }
      }
    }
  }
`;
