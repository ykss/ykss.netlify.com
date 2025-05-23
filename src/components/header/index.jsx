import React from 'react';
import { Link } from 'gatsby';

import './index.scss';

export const Header = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath;
  return (
    isRoot && (
      <div className="home-title">
        <h1 className="home-header">
          <Link to={`/`} className="link">
            {title}
          </Link>
        </h1>
      </div>
    )
  );
};
