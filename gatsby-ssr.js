const React = require('react')
const metaConfig = require('./gatsby-meta-config')

exports.onRenderBody = ({ setHeadComponents }) => {
  if (process.env.NODE_ENV !== 'production' || !metaConfig.ad) {
    return
  }

  setHeadComponents([
    <script
      key="google-adsense-loader"
      async
      src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    />,
    <script
      key="google-adsense-init"
      dangerouslySetInnerHTML={{
        __html: `
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${metaConfig.ad}",
            enable_page_level_ads: true
          });
        `,
      }}
    />,
  ])
}
