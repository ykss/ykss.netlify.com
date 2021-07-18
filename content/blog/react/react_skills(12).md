---
title: '리액트 다루는 기술 정리 (12) - 서버 사이드 렌더링'
date: 2021-07-18 01:00:00
category: 'React'
draft: false
---

UI를 서버에서 렌더링하는게 서버 사이드 렌더링이다. 리액트는 보통 클라이언트 사이드 렌더링을 하고 있다. 그래서 자바스크립트를 실행해야 화면이 보인다.

## 20.1.1 서버사이드렌더링의 장점

- 검색엔진 최적화(SEO)

검색엔진이 해당 웹 서비스의 페이지를 원활하게 수집할 수 있도록 한다.

- 초기 렌더링 개선

일반적으로 CSR을 하면 자바스크립트가 로딩될 때까지 사용자는 빈 화면을 보게된다. 하지만 SSR을 이용하면 JS가 로딩되기 전에도 HTML상에서 볼수 있는 콘텐츠가 있어서 사용자 경험이 향상된다.

## 20.1.2 서버사이드렌더링의 단점

- 서버 리소스 사용

많은 사용자가 동시에 접근 시 서버에 부하가 발생할 수 있다. 캐싱과 로드 밸런싱으로 성능 최적화를 해주어야 한다.

- 구조 복잡화

SSR을 사용하면 CSR보다 프로젝트 구조가 좀 더 복잡 해질 수 있다. Preload나 Code Spliting과 같은 부분들을 더 고려해야할 수 있다.

## 20.2 서버 사이드 렌더링 구현

엔트리(entry)는 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일이다. 기본적으로는 index.js를 엔트리 파일로 사용한다. 작성한 엔트리 파일을 웹팩으로 불러와서 빌드할 때는 서버 전용 환경 설정을 만들어 줘야 한다.

```jsx
// config/paths.js
// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(buildPath),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveModule(resolveApp, 'src/setupTests'),
  proxySetup: resolveApp('src/setupProxy.js'),
  appNodeModules: resolveApp('node_modules'),
  swSrc: resolveModule(resolveApp, 'src/service-worker'),
  ssrIndexJs: resolveApp('src/index.server.js'), // SSR 엔트리 추가
  ssrBuild: resolveApp('dist'), // 웹팩 처리 후 저장 경로
  publicUrlOrPath,
}
```

웹팩의 로더는 파일을 불러올 때 확장자에 맞게 필요한 처리를 해준다. 자바스크립트는 babel을 사용하여 트랜스파일링을 해 주고, CSS는 모든 CSS 코드를 결합해 주고, 이미지 파일은 다른 경로에 저장하고 해당 경로를 자바스크립트에서 참조할 수 있도록 해준다.

```jsx
const nodeExternals = require('webpack-node-externals')
const paths = require('./paths')
const webpack = require('webpack')
const getClientEnvironment = require('./env')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))

module.exports = {
  mode: 'production', // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
  entry: paths.ssrIndexJs, // 엔트리 경로
  target: 'node', // node 환경에서 실행 될 것이라는 것을 명시
  output: {
    path: paths.ssrBuild, // 빌드 경로
    filename: 'server.js', // 파일이름
    chunkFilename: 'js/[name].chunk.js', // 청크 파일이름
    publicPath: paths.publicUrlOrPath, // 정적 파일이 제공 될 경로
  },
  module: {
    rules: [
      {
        oneOf: [
          // 자바스크립트를 위한 처리
          // 기존 webpack.config.js 를 참고하여 작성
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo![path]',
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },

          // CSS 를 위한 처리
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            //  exportOnlyLocals: true 옵션을 설정해야 실제 css 파일을 생성하지 않습니다.
            loader: require.resolve('css-loader'),
            options: {
              exportOnlyLocals: true,
            },
          },
          // CSS Module 을 위한 처리
          {
            test: cssModuleRegex,
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              exportOnlyLocals: true,
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          // Sass 를 위한 처리
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  exportOnlyLocals: true,
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          // Sass + CSS Module 을 위한 처리
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: true,
                  exportOnlyLocals: true,
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          // url-loader 를 위한 설정
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              limit: 10000, // 원래는 9.76KB가 넘어가면 파일로 저장하는데
              // emitFile 값이 false 일땐 경로만 준비하고 파일은 저장하지 않습니다.
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // 위에서 설정된 확장자를 제외한 파일들은
          // file-loader 를 사용합니다.
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin(env.stringified), // 환경변수를 주입해줍니다.
  ],
}
```

위 환경설정을 사용하여 웹팩으로 프로젝트를 빌드하려면 빌드 스크립트가 필요하다.

```jsx
process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

process.on('unhandledRejection', err => {
  throw err
})

require('../config/env')
const fs = require('fs-extra')
const webpack = require('webpack')
const config = require('../config/webpack.config.server')
const paths = require('../config/paths')

function build() {
  console.log('Creating server build...')
  fs.emptyDirSync(paths.ssrBuild)
  let compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(stats.toString())
    })
  })
}

build()
```

위 빌드 스크립트를 실행하면 빌드가 가능하다. `node scripts/build.server.js` 와 같이 빌드 스크립트를 실행할 수 있다.

서버 사이드 렌더링을 처리하려면 서버가 필요한데, 보통 node.js에서는 Express 프레임워크를 주로 사용한다. Express를 사용하면 추후 정적 파일들을 호스팅할 때 쉽게 구현 가능하다. 그리고 사용률도 제일 높다.

```jsx
// 서버코드
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import express from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'

const app = express()

const serverRender = (req, res, next) => {
  const context = {}
  const jsx = (
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  )
  const root = ReactDOMServer.renderToString(jsx)
  res.send(root)
}

app.use(serverRender)

app.listen(5000, () => {
  console.log('Running on http://localhost:5000')
})
```

여기서 `StaticRouter` 컴포넌트는 서버 사이드 렌더링에 주로 사용되는 라우터이다. props로 넣어주는 location 값에 따라 라우팅을 해준다. 그리고 context props는 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정해줄 수 있다.

## 20.3 데이터 로딩

데이터 로딩이 서버 사이드 렌더링에서는 까다로운 문제인데, API 요청을 의미한다. 일반적으로는 API를 요청하고 응답을 받아서 리액트 state 혹은 리덕스 스토어에 넣으면 자동으로 리렌더링하기 때문에 큰 걱정은 없다. 하지만 서버의 경우에는 문자열 형태로 렌더링하기 때문에 자동으로 리렌더링 되지 않는다. 대신 renderToString 함수를 한 번 더 호출 해주어야 한다. 게다가 서버에서는 라이프사이클 메서드도 사용할 수 없다. 그래서 redux-thunk랑 rudux-saga 미들웨어를 통해 API를 호출하는 환경에서 서버 사이드 렌더링 할 수 있다.

## 20.4 PreloadContext

서버 사이드 렌더링 할때는 useEffect나 componentDidMount에서 설정한 작업이 호출되지 않는다. 렌더링 전에 API 요청한 후에 스토어에 데이터를 담아 줘야 한다. 서버 환경에서 처리하려면 클래스형 컴포넌트에서는 constructor에서, 함수형에서는 render 함수 자체에서 처리해야 한다. 그리고 요청 후 응답이 올 때까지 대기하고 다시 렌더링 해야한다.

```jsx
import { createContext, useContext } from 'react'

const PreloadContext = createContext(null)
export default PreloadContext

export const Preloader = ({ resolve }) => {
  const preloadContext = useContext(PreloadContext)
  if (!preloadContext) return null
  if (preloadContext.done) return null

  preloadContext.promises.push(Promise.resolve(resolve()))
  return null
}
```

PreloadContext는 서버 사이드 렌더링 과정에서 처리할 잘 업들을 실행하고, 만약 기다려야 하는 Promise가 있으면 수집한다. 그리고 모든 프로미스 수집 후 해당 프로미스가 모두 끝나고 나면 다시 렌더링한다. Preloader 컴포넌트는 resolve라는 함수를 props를 받아서 컴포넌트가 렌더링될 때 서버환경에서 다시 resolve() 함수를 호출한다.

## 20.5 서버 사이드 렌더링의 환경 구축을 위한 대안

### 20.5.1 Next.js

Next.js라는 리액트 프레임워크를 이용하면 최소한의 설정으로 간단하게 처리할 수 있다. 하지만 리액트 라우터와 호환되지 않는다는 단점이 있다. Next.js는 파일 시스템에 기반하여 라우트를 설정하여 컴포넌트 파일의 경로와 파일 이름으로 라우트를 설정해준다. 코드 스플리팅, 데이터 로딩, 서버 사이드 렌더링을 가장 쉽게 적용하는 방법이기도 하다.

### 20.5.2 Razzle

Next.js처럼 서버 사이드 렌더링을 할 수 있게 해주는 도구이고 프로젝트 구성이 CRA와 매우 유사하다. 그리고 Next.js와 달리 리액트 라우터와도 잘 호환된다.

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
