import React from 'react';
import { Link } from 'gatsby';

import './index.scss';

export const Header = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath;
  return (
    isRoot && (
      <div className='home-title'>
        <h1 className="home-header">
          <Link to={`/`} className="link">
            {title}
          </Link>
        </h1>
        <a href="https://hits.seeyoufarm.com">
          <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fykss.netlify.app&count_bg=%234474E7&title_bg=%23697274&icon=&icon_color=%23E7E7E7&title=visits&edge_flat=false" />
        </a>
      </div>
    )
  );
};
