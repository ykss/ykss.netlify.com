import React, { useEffect } from 'react';
import { graphql } from 'gatsby';

import * as Elements from '../components/elements';
import { Layout } from '../layout';
import { Seo } from '../components/head';
import { PostTitle } from '../components/post-title';
import { PostMeta } from '../components/post-meta';
import { PostContainer } from '../components/post-container';
import { ScrollIndicator } from '../components/scroll-indicator';
import { SocialShare } from '../components/social-share';
import { SponsorButton } from '../components/sponsor-button';
import { PostFooterActions } from '../components/post-footer-actions';
import { TableOfContents } from '../components/table-of-contents';
import { Disqus } from '../components/disqus';
import { Utterences } from '../components/utterances';
import {
  buildBlogPostingJsonLd,
  getRelatedPosts,
} from '../utils/post-recommendations';
import { getPostBadges } from '../utils/post-badges';
import { getPostReadingMeta } from '../utils/post-reading';
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
  const hasComments = !!disqusShortName || !!utterances;
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
  const { readingTimeText } = getPostReadingMeta({
    wordCount: post.wordCount.words,
  });
  const badges = getPostBadges({
    category,
    wordCount: post.wordCount.words,
  });
  const postUrl = `${siteUrl}${slug}`;
  const feedbackUrl = `https://github.com/ykss/ykss.netlify.com/issues/new?title=${encodeURIComponent(
    `[피드백] ${postTitle}`
  )}&body=${encodeURIComponent(`포스트: ${postUrl}\n\n피드백 내용을 적어주세요.`)}`;

  return (
    <Layout location={location} title={title}>
      <ScrollIndicator />
      <PostTitle title={postTitle} />
      <PostMeta
        date={date}
        readingTimeText={readingTimeText}
        hasComments={hasComments}
        badges={badges}
      />
      {toc !== false && <TableOfContents headings={post.headings} />}
      <PostContainer html={post.html} slug={slug} />{' '}
      {!!sponsor.buyMeACoffeeId && (
        <SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
      )}{' '}
      <Elements.Hr />
      <PostFooterActions
        feedbackUrl={feedbackUrl}
        hasComments={hasComments}
        pageContext={pageContext}
        relatedPosts={relatedPosts}
      />
      {hasComments && (
        <section id="post-comments" className="post-comments">
          {!!disqusShortName && (
            <Disqus
              post={post}
              shortName={disqusShortName}
              siteUrl={siteUrl}
              slug={pageContext.slug}
            />
          )}{' '}
          {!!utterances && <Utterences repo={utterances} />}{' '}
        </section>
      )}
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
      wordCount {
        words
      }
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
