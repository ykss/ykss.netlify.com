import React, { useEffect } from 'react';
import { graphql } from 'gatsby';

import * as Elements from '../components/elements';
import { Layout } from '../layout';
import { Head } from '../components/head';
import { PostTitle } from '../components/post-title';
import { PostDate } from '../components/post-date';
import { PostContainer } from '../components/post-container';
import { SocialShare } from '../components/social-share';
import { SponsorButton } from '../components/sponsor-button';
import { Bio } from '../components/bio';
import { PostNavigator } from '../components/post-navigator';
import { Disqus } from '../components/disqus';
import { Utterences } from '../components/utterances';
import * as ScrollManager from '../utils/scroll';

import '../styles/code.scss';
import 'katex/dist/katex.min.css';

export default ({ data, pageContext, location }) => {
  useEffect(() => {
    ScrollManager.init();
    return () => ScrollManager.destroy();
  }, []);

  const post = data.markdownRemark;
  const metaData = data.site.siteMetadata;
  const slug = pageContext.slug;
  const { title, comment, siteUrl, author, sponsor } = metaData;
  const { disqusShortName, utterances } = comment;
  const { title: postTitle, date, thumbnail, canonicalUrl } = post.frontmatter;
  const thumbnailSrc = thumbnail
    ? `${siteUrl}${thumbnail.childImageSharp.fixed.src}`
    : undefined;

  return (
    <Layout location={location} title={title}>
      <Head
        title={postTitle}
        description={post.excerpt}
        thumbnail={thumbnailSrc}
        canonicalUrl={canonicalUrl}
      />{' '}
      <PostTitle title={postTitle} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PostDate date={date} />
      </div>
      <PostContainer html={post.html} />{' '}
      {!!sponsor.buyMeACoffeeId && (
        <SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
      )}{' '}
      <Elements.Hr />
      <Bio />
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

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
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
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        thumbnail {
          childImageSharp {
            fixed(width: 800) {
              src
            }
          }
        }
        canonicalUrl
      }
    }
  }
`;
