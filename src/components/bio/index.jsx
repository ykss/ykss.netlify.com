import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

import './index.scss';

export const Bio = () => {
  const data = useStaticQuery(bioQuery);
  const { author, social, introduction } = data.site.siteMetadata;

  return (
    <div className="bio">
      <div className="author">
        <div className="author-description">
          <GatsbyImage
            className="author-image"
            image={getImage(data.avatar)}
            alt={author}
            style={{
              borderRadius: `100%`,
            }}
          />
          <div className="author-name">
            <span className="author-name-prefix">Written by</span>
            <a
              href={
                'https://ykss.notion.site/Kyeongsang-Yu-a4ddc1935ee74a0aafbb311aa7f675e7'
              }
              className="author-name-content"
            >
              <span>@{author}</span>
            </a>
            <div className="author-introduction">{introduction}</div>
            <p className="author-socials">
              {social.github && (
                <a href={`https://github.com/${social.github}`}>GitHub</a>
              )}
              {social.instagram && (
                <a href={`https://www.instagram.com/${social.instagram}`}>
                  Instagram
                </a>
              )}
              {social.medium && (
                <a href={`https://medium.com/${social.medium}`}>Medium</a>
              )}
              {social.twitter && (
                <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>
              )}
              {social.facebook && (
                <a href={`https://www.facebook.com/${social.facebook}`}>
                  Facebook
                </a>
              )}
              {social.linkedin && (
                <a href={`https://www.linkedin.com/in/${social.linkedin}/`}>
                  LinkedIn
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile.png/" }) {
      childImageSharp {
        gatsbyImageData(width: 72, height: 72, layout: FIXED)
      }
    }
    site {
      siteMetadata {
        author
        introduction
        social {
          twitter
          github
          instagram
          medium
          facebook
          linkedin
        }
      }
    }
  }
`;

export default Bio;
