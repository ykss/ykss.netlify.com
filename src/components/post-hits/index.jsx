import React from 'react';

export const PostHits = ({ slug }) => (
  <a href="https://hits.seeyoufarm.com">
    <img
      src={`https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fykss.netlify.app${slug}&count_bg=%230069FF&title_bg=%23555555&icon=awesomelists.svg&icon_color=%23E7E7E7&title=view&edge_flat=false`}
    />
  </a>
);
