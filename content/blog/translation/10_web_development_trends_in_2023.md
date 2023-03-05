---
title: '(번역) 2023년 웹 개발 트렌드 10가지'
date: 2023-03-06 01:00:00
category: 'Translation'
draft: false
---

> 원문: [10 Web Development Trends in 2023](https://www.robinwieruch.de/web-development-trends/)

제 주관적인 의견으로는 웹 개발 환경이 몇 년(2016~2021년) 동안 발전이 더뎠지만, 작년부터 다시 많은 주목을 받기 시작했습니다. (이 글의 이미지를 가져온 [State of JS](https://2022.stateofjs.com/en-US/)도 참조하세요.) 이 글에서는 제가 본 새로운 웹 개발 트렌드 중 웹 개발자들 사이에서 계속 관심을 불러일으킬 것으로 예상되는 트렌드와 내년에도 기대되는 트렌드를 짚어보고자 합니다. 바로 시작해 보겠습니다.

![javascript ecosystem change fast](https://www.robinwieruch.de/static/39a17065820d9f2fc9af4b7e66b5ae88/a9a89/trends.webp)

## (메타) 프레임워크

단일 페이지 애플리케이션(SPA)과 각각의 프레임워크(예: React.js, Vue.js, Svelte.js)는 어느 정도 선풍적인 인기를 끌며 수년 동안 사용되어 왔습니다. 그러나 이러한 솔루션 위에 메타 프레임워크가 등장하면서 애플리케이션이 클라이언트 측(CSR)에서 서버 측 렌더링(SSR)으로 전환하는 분명한 추세를 볼 수 있습니다. 요즘은 자바스크립트 프레임워크로 작업할 때 SSR을 많이 사용합니다.

![experience over time](https://www.robinwieruch.de/static/85f884f5f2ad84223cb8b6477c14e081/a9a89/frontend-frameworks.webp)

[Next.js](https://nextjs.org/)라는 가장 인기 있는 메타 프레임워크는 React.js 기반으로 제공됩니다. React 핵심 개발자인 앤드류 클락(Andrew Clark)은 2022년에 ["진정한 React 18 출시"](https://twitter.com/acdlite/status/1549853625673023488)라고 말했는데, 이 버전에는 React 팀이 라이브러리의 하위 수준에서 기본 토대로서 제공하는 모든 요소(예: Suspense, 스트리밍 SSR)가 포함되기 때문입니다. Vercel(Next.js의 개발사)과 React.js 핵심 팀은 모두 긴밀하게 협력하여 훌륭한 개발자 경험을 제공하고 있습니다.

많은 개발자가 Next.js와 React.js의 밀접한 관계를 우려의 시선으로 바라보고 있지만, 최근 Shopify가 인수한 [Remix](https://remix.run/)와 같은 React.js의 대안도 있습니다. Remix는 React.js를 메타 프레임워크로 전환하는 데 있어 다른 접근 방식을 취하지만(예: 웹 표준을 일급 객체로 사용), 경쟁 관계에 있는 두 프레임워크 간에는 중첩 라우팅 같은 공통된 기능도 있습니다.

Next.js는 이미 현대의 SSR 분야에서 확고한 위치를 차지하고 있으며 많은 프런트엔드 개발자를 풀스택 개발자로 자연스럽게 전환시켰습니다. 하지만 다른 프레임워크에도 관심을 가져야합니다. 최근 1.0 릴리스에서 Vercel의 지원을 받는 ([Svelte.js](https://svelte.dev/) 로 만들어진)[SvelteKit](https://kit.svelte.dev/)와 React.js에 비해 향상된 DX를 제공하는 ([Solid.js](https://www.solidjs.com/) 로 만들어진) [SolidStart](https://start.solidjs.com/getting-started/what-is-solidstart)가 있습니다.

## 애플리케이션 및 렌더링 패턴

지난 10년(2010~2020년)은 Knockout.js, Ember.js를 시작으로 Angular.js, React.js, Vue.js에 이르기까지 [클라이언트 측 렌더링(CSR)](https://www.robinwieruch.de/web-applications/)을 사용하는 단일 페이지 애플리케이션(SPA)이 주를 이루었다면, 최근 몇 년 동안은 메타 프레임워크를 사용하는 서버 측 렌더링(SSR)에 대한 관심이 높아지고 있습니다. 이전(2005~2010년)부터 다중 페이지 애플리케이션(MPA)에 자바스크립트(예: jQuery, MooTools, Dojo.js)를 활용한 SSR을 사용해 왔기 때문에 겉으로 보기에는 이 주기가 다시 끝나고 있는 것처럼 보입니다. 그러나 이전에는 Java(예: JSP) 또는 이후 Ruby on Rails가 SSR에 사용되었지만, 이번에는 자바스크립트를 사용한다는 점에서 다릅니다. 몇 년 동안 Next.js가 이러한 트렌드를 주도해 왔지만, SvelteKit과 같은 다른 메타 프레임워크가 그 뒤를 따라잡고 있습니다.

SSR은 두 패턴이 완전히 다른 용도로 사용되지만, 완벽한 성능을 위해 꽤 오랫동안 정적 사이트 생성(SSG)과 경쟁해 왔습니다. (Next.js vs [Gatsby.js](https://www.gatsbyjs.com/) 참조) 후자의 패턴은 정적 콘텐츠(예: 블로그와 같은 웹사이트)에 사용되는 반면, 전자는 동적 콘텐츠(예: 웹 애플리케이션)에 사용됩니다. [SEO](https://en.wikipedia.org/wiki/Search_engine_optimization)가 관련성이 있다면 SSR과 SSG 모두 의미가 있을 수 있습니다. 그러나 매우 동적인 콘텐츠나 인증이 필요한 사용자 중심 콘텐츠가 필요한 경우, 개발자는 배포 전에 한번 빌드해야 하는 정적인 SSG를 선택할 수 없습니다. 요즘에는 SSR(서버의 개별 데이터로 요청에 따라 on-demand 빌드) 또는 CSR(클라이언트에서 개별 데이터의 on-demand 페칭) 중에서 결정해야 합니다.

![애플리케이션 패턴](https://www.robinwieruch.de/static/43a28a3144412b4b20200b30054633f1/a9a89/application-rendering-patterns.webp)

하지만 CSR, SSR, SSG는 렌더링 기술의 최신 트렌드는 아닙니다. 몇 년 전 성능 최적화에 대한 트렌드가 SSR과 SSG로 시작되었지만, 증분 정적 재생성(ISR)과 Streaming SSR과 같은 보다 세밀한 렌더링 기법이 등장했습니다. 전자는 전체 웹사이트를 리빌드 하는 대신 페이지 단위(예: 60초마다 페이지 X를 리빌드)로 웹사이트를 정적으로 리빌드 할 수 있기 때문에 SSG를 발전시켰습니다. 또한 On-demand 재검증이라고도 하는 On-demand ISR은 애플리케이션에 노출된 API를 통해 리빌드를 트리거하는 데 사용할 수 있습니다. (예: CMS 데이터가 업데이트될 때)

반면에 Streaming SSR은 서버 측 렌더링의 단일 스레드 병목 현상을 최적화합니다. 일반적인 SSR은 렌더링 된 콘텐츠를 클라이언트에 한 번에 전송하기 위해 데이터가 서버에서 대기해야 하지만, Streaming SSR을 사용하면 개발자가 애플리케이션을 청크로 분할하여 서버에서 클라이언트로 점진적으로 병렬 전송할 수 있습니다.

지난 몇 년 동안 렌더링 패턴은 SPA/MPA에서 SSG와 SSR을 사용하여 매우 단순했습니다. 하지만 요즘에는 좀 더 정교한 버전이 유행하고 있습니다. ISR과 SSR Streaming뿐만 아니라 클라이언트에서 일부 컴포넌트만 하이드레이션할 수 있는 부분 하이드레이션(예: React Server Components), 하이드레이션 순서를 더 세밀하게 제어할 수 있는 프로그레시브 하이드레이션, MPA에서 격리된 애플리케이션이나 컴포넌트를 위한 아일랜드 아키텍처(예: [Astro](https://astro.build/)), 하이드레이션 대신 재개 가능성 사용(예: Qwik City 메타 프레임워크와 [Qwik](https://qwik.builder.io/)) 등도 요즘 유용한 접근 방식이 되고 있습니다.

## 엣지에서 서버리스

SSR 및 SSG와 같은 렌더링 기술은 브라우저에서 원활한 사용자 경험을 제공한다는 목표 하에 성능에 의해 구동되기 때문에 엣지에서의 서버리스 트렌드와 밀접한 관련이 있습니다. 기본적으로 사용자에게 더 빠른 웹사이트와 웹 애플리케이션을 제공하려는 욕구가 엣지에서의 서버리스에 대한 관심을 불러일으켰습니다.

하지만 처음부터 다시 살펴보겠습니다. 서버리스 함수, 서버리스 컴퓨팅(예: AWS 람다) 또는 클라우드 함수(예: Google/Firebase 클라우드 함수)로도 알려진 서버리스는 몇 년 전부터 클라우드 컴퓨팅의 큰 트렌드였습니다. 서버리스는 여전히 실행 중인 (원격) 서버를 의미하지만, 개발자는 서버 및 관련 작업(예: On-demand 인프라 확장)을 관리할 필요가 없습니다. 대신 클라우드 공급자가 처리하는 단일 기능을 서버리스 기능으로 배포하기만 하면 됩니다.

서버리스 기능은 애플리케이션 서버를 한 곳(또는 몇 곳)의 데이터센터에 배포하는 대신 전 세계 수십 개의 데이터센터에 있을 수 있기 때문에 또 다른 이점을 제공합니다. 완벽한 환경이라면 서버리스 함수는 사용자와 가장 가까운 곳에서 실행될 것이며, 이는 클라이언트-서버 왕복 시간이 가장 짧아져 사용자 경험이 개선된다는 것을 의미하기 때문입니다. 서버리스 기능을 가능한 한 사용자와 가까운 곳에 배포하는 것을 엣지 컴퓨팅과 엣지 기능이라는 용어로 표현했습니다.

많은 클라우드 제공업체(예: Cloudflare Workers의 Cloudflare, Vercel의 Edge Network, Deno의 Deno Deploy 등)가 이 분야에서 경쟁하고 있으며, 모두가 최종 사용자를 위한 최상의 TTI(Time to Interactive) 경험을 위해 최적화하고 있습니다. 엣지 기능은 최종 사용자와의 연결이 짧기 때문에 SSG/SSR 콘텐츠를 더 빠르게 제공할 뿐만 아니라 결과를 사용자에게 더 가깝게 캐시 할 수도 있습니다.

하지만 성능도 중요하지만, 엣지 컴퓨팅을 통해 비용 절감과 같은 다른 이점도 얻을 수 있습니다. 예를 들어, 클라이언트와 서버 간에 전송되는 모든 데이터(여기서는 엣지 기능)를 메인 데이터 센터에서 계산할 필요가 없는 경우가 많습니다. IoT에서는 메인 데이터센터로 전송되는 관련 없는 데이터(예: 프레임당 변경 사항이 없는 비디오 녹화)가 많은데, 이를 엣지에서 간단히 필터링할 수 있습니다. 결국 엣지 기능은 시작에 불과합니다.

## 데이터베이스 르네상스

서버리스(엣지)의 등장으로 데이터베이스도 르네상스를 경험하고 있습니다. 서버리스 함수를 사용하면 하나의 연결을 유지하는 서버가 하나도 없고 데이터베이스에 1:1로 연결되는 서버리스 함수가 많기 때문에 개발자는 너무 많은 데이터베이스 연결을 개방하는 문제에 빠르게 직면하게 됩니다. [연결 풀링(Connection Pooling)](https://en.wikipedia.org/wiki/Connection_pool)이 이 문제에 대한 해결책이었지만, 직접 처리하거나 외부 서비스를 통해 처리해야 했습니다.

서버리스 데이터베이스 분야에서 인기 있는 제품으로는 데이터베이스 분기, 스키마 디핑(diffing), 강력한 검색/분석/인사이트 등의 다양한 기능을 제공하는 [PlanetScale](https://planetscale.com/)(MySql), [Neon](https://neon.tech/)(PostgreSQL), [Xata](https://xata.io/)(PostgreSQL)가 있습니다. 전 세계적인 서버리스 서비스의 경우, 엣지 캐싱 또는 분산형 읽기 전용 데이터베이스를 제공하여 데이터를 사용자에게 더 가깝게 이동시켜 지연 시간을 최소화합니다.

외부 서비스가 데이터베이스뿐만 아니라 애플리케이션까지 배포해야 하는 경우, [Fly.io](https://fly.io/)는 모든 것을 하나의 플랫폼에 패키지화합니다. 이는 단순히 데이터베이스를 넘어 많은 움직임이 일어나는 모든 곳에 적용됩니다. Heroku의 후속 제품인 [Railway](https://railway.app/)는 기술 스택을 배포하기 위한 서비스형 플랫폼(PaaS)에 필요한 모든 것을 제공합니다. 서비스 체인을 서비스형 백엔드(BaaS)로 한 단계 업그레이드하고 싶다면 애플리케이션/데이터베이스 호스팅, 인증, 엣지 기능이 포함된 [Supabase](https://supabase.com/)를 통해 Firebase를 대체할 수 있는 오픈 소스 대안을 얻을 수 있습니다.

## 자바스크립트 런타임

이 모든 것은 2009년 컨퍼런스에서 Ryan Dahl이 Node.js를 [발표](https://www.youtube.com/watch?v=ztspvPYybIY&ab_channel=stri8ted)하면서 시작되었습니다. 브라우저에서 자바스크립트를 분리하여 서버에서 사용할 수 있도록 하는 실험으로 시작된 이 프로젝트는 지난 10년간 자바스크립트의 성공 스토리를 이끈 가장 큰 원동력 중 하나가 되었습니다. 기본적으로 Ryan Dahl은 브라우저 자체가 아닌 크롬에서 구현한 V8이라는 자바스크립트 엔진을 Node.js에 사용했습니다. 따라서 Chrome 브라우저와 Node.js는 모두 동일한 자바스크립트 엔진을 사용하지만 상호 작용하기 위한 자체 자바스크립트 런타임(예: 브라우저 API 대 노드 API)이 있습니다.

10년 후 Ryan Dahl은 개발자에게 브라우저 API, 타입스크립트 및 표준 라이브러리와 유사한 환경을 즉시 사용할 수 있는 더 안전하고 빠른 환경을 제공하겠다는 약속과 함께 Node의 후속 버전으로 Deno를 [발표](https://www.youtube.com/watch?v=M3BM9TB-8yA&ab_channel=JSConf)했습니다. 하지만 V8에서도 실행되는 [Deno](https://deno.land/)는 오늘날 수많은 자바스크립트 런타임 중 하나에 불과합니다.

경쟁이 치열한 엣지 기능의 영역에서 많은 클라우드 제공업체는 자체 인프라(예: Cloudflare)에 최적화되는 자체 자바스크립트 런타임(예: Cloudflare Workers)을 구현합니다. 따라서 Deno의 비즈니스 모델도 [Deno Deploy](https://deno.com/deploy)와 Just-in-time 에지 렌더링 SSR 프레임워크(개념 증명하기 위해 시작된) [Deno Fresh](https://fresh.deno.dev/)를 통해 클라우드 제공업체가 되고 있습니다. 최근 가장 빠른 자바스크립트 런타임을 위한 경쟁에서 [Bun](https://bun.sh/)(자바스크립트 코어 엔진에서 실행되고 Zig로 구현됨)과 같은 클라우드 제공업체의 독립 솔루션이 또 다른 인기를 얻었습니다.

예리한 사람이라면 서로 다른 런타임으로 인해 자바스크립트 환경에 많은 파편화가 있음을 다시 한 번 알 수 있을 것입니다. 문제가 발생하면 수년간 브라우저에서 파편화된 자바스크립트 지원으로 인해 겪었던 것과 같은 상황에 처하게 되지만, 이번에는 서버에서 모든 자바스크립트가 서로 다른 클라우드 제공업체에 배포될 때 런타임에 따라 동일하게 지원되지 않을 수 있습니다. 따라서 모든 이해관계자(예: Deno, Vercel, Cloudflare)는 각자의 자바스크립트 런타임 간의 API 상호운용성을 위해 협력하기 위해 [WinterCG](https://wintercg.org/)에 합류했습니다.

## 모노레포

과거에 모노레포는 하나의 버전 관리 저장소에서, 여러 개의 작은 프로젝트를 하나의 프로젝트로 관리하는 대규모 애플리케이션에 주로 사용되었습니다. 이러한 각각의 작은 프로젝트는 개별 애플리케이션(예: SPA, MPA)에서 재사용할 수 있는 패키지(예: 함수, 컴포넌트, 서비스)에 이르기까지 무엇이든 될 수 있습니다. 프로젝트를 결합하는 관행은 공유 코드 베이스라고 불렸던 2000년 초반으로 거슬러 올라갑니다.

하지만 오늘날 모노레포는 대규모 애플리케이션에만 국한된 것이 아니라 소규모 애플리케이션과 오픈 소스 프로젝트에도 유용하게 활용되고 있습니다. 예를 들어, 한 회사에서 공유 UI 컴포넌트, 공유 디자인 시스템(예: 재사용할 수 있는 공통 디자인), 각 도메인에 일반적으로 사용되는 유틸리티 기능 등 다양한 패키지를 모노레포에 저장할 수 있습니다.

이러한 패키지는 다양한 애플리케이션에서 가져올 수 있습니다. 이러한 공유 패키지를 모두 사용하는 실제 애플리케이션(예: 클라이언트 측 렌더링이 있는 app.mywebsite.com)은 공유 디자인 시스템 패키지만 사용하고, SEO를 염두에 둔 홈/제품/랜딩 페이지(예: 서버 측 렌더링 또는 정적 사이트 생성이 있는 mywebsite.com)는 공유 UI 컴포넌트 및 공유 디자인 시스템 패키지를 사용하는 기술 문서 페이지(예: docs.mywebsite.com)는 공유 디자인 시스템 패키지를 사용하는 식입니다.

![모노레포](https://www.robinwieruch.de/static/6bfa40a792699acd5938ff1cdcaad84b/a9a89/monorepos.webp)

Vercel에 인수된 [Turborepo](https://turbo.build/)는 자바스크립트/타입스크립트에서 다시 한 번 [모노레포 열풍](https://www.robinwieruch.de/javascript-monorepos/)을 불러일으켰습니다. Turborepo를 사용하면 팀은 모노레포 내에서 모든 애플리케이션과 패키지에 대한 빌드 파이프라인을 생성할 수 있습니다. 주목할 점은 파이프라인 내에서 로컬 머신이나 클라우드에 있는 빌드를 팀 간에 캐싱할 수 있다는 점입니다. Turborepo는 npm/yarn/pnpm 워크스페이스(종속성 관리) 및 [변경 집합](https://github.com/changesets/changesets)(버전 관리)과 같은 다른 중요한 모노레포 도구와 결합하여 올해 주목해야 할 도구 체인이 될 것입니다.

Turborepo의 경쟁자로는 [Nx](https://nx.dev/), [Rush](https://rushjs.io/), 한동안 유지보수되지 않다가 [Nx의 회사 Nrwl에 인수된](https://blog.nrwl.io/lerna-is-dead-long-live-lerna-61259f97dbd9) [Lerna](https://lerna.js.org/)가 있습니다.

## 유틸리티 우선 CSS

개발자들에게 호불호가 갈리는 [Tailwind CSS](https://tailwindcss.com/)는 유틸리티 우선 CSS의 대표 주자입니다. 개발자 중 한쪽에서는 UI 코드가 장황해 보인다는 이유로 싫어하지만, 다른 한쪽에서는 뛰어난 개발자 경험(DX)으로 인해 좋아하기도 합니다. 개발자는 프로젝트에서 한 번만 설정하면 미리 정의된 CSS를 HTML에서 바로 사용할 수 있습니다.

하지만 최근 서버 측 렌더링(SSR)이 부상하면서 유틸리티 우선 CSS에 대한 찬반양론은 종식될 수 있습니다. 지난 몇 년 동안 [Styled Components](https://styled-components.com/)(SC) 및 [Emotion](https://emotion.sh/docs/introduction)과 같은 CSS-in-JS 솔루션은 최신 컴포넌트 기반 웹 애플리케이션의 스타일을 지정하는 데 널리 사용되어 왔습니다. 그러나 SSR의 주된 목표 중 하나가 성능이라면 CSS-in-JS는 번들 크기 증가(SC는 12.7kB, Emotion은 7.9kB), 더 중요한 것은 DOM에 삽입하기 전에 CSS 직렬화로 인한 런타임 오버헤드 등 부정적인 영향을 미칩니다.

따라서 개발자들이 사전 정의된 UI 컴포넌트(예: [DaisyUI](https://daisyui.com/components/))와 결합된 유틸리티 우선 CSS(예: Tailwind CSS, [UnoCSS](https://github.com/unocss/unocss)), [CSS Modules](https://github.com/css-modules/css-modules)과 같이 널리 사용되는 다른 대안 또는 제로 런타임/컴파일 타임 CSS-in-JS(예: [vanilla-extract](https://github.com/vanilla-extract-css/vanilla-extract), [linaria](https://github.com/callstack/linaria), [astroturf](https://github.com/astroturfcss/astroturf), [compiled](https://github.com/atlassian-labs/compiled))와 같은 SSR 친화적인 솔루션으로 이전하는 것을 볼 수 있을 것입니다.

## 타입스크립트를 통한 엔드 투 엔드 타입 안전성

자바스크립트에서 타입스크립트로의 진화는 멈출 수 없습니다. 웹 개발의 이러한 대규모 마이그레이션에서 풀스택 애플리케이션을 위한 E2E 타입 안전성은 확실히 중요한 트렌드입니다. 이 개념의 구현은 타입화된 엔티티(예: `type User`, `type BlogPost`)를 서버에서 클라이언트 애플리케이션으로 연결하는 데 필요한 통신 계층(API)과 밀접한 관련이 있습니다.

클라이언트-서버 통신을 위한 웹 개발의 일반적인 용도로 사용되는 것은 [REST](https://www.robinwieruch.de/node-express-server-rest-api/)와 [GraphQL](https://graphql.org/)입니다. 두 가지 모두 REST용 [OpenAPI](https://en.wikipedia.org/wiki/OpenAPI_Specification) 및 GraphQL용 [GraphQL 코드 제네레이터](https://github.com/dotansimha/graphql-code-generator)와 함께 사용하여 프론트엔드 애플리케이션을 위한 타입화된 스키마 파일을 생성할 수 있습니다.

그러나 REST/GraphQL을 대체하여 사용할 수 있는 타입 안전성 API로 새롭게 떠오르고 있는 [tRPC](https://trpc.io/)가 있습니다. 프론트엔드와 백엔드가 코드를 공유하는 타입스크립트 모노레포에서 작업하는 경우, tRPC를 사용하면 타입 스키마를 중간 생성하지 않고도 백엔드에서 프론트엔드 애플리케이션으로 모든 타입을 내보낼 수 있습니다. 이후 프론트엔드에서는 실제 클라이언트-서버 통신을 활성화하기 위해 내부적으로 HTTP로 연결된 타입화된 함수를 사용하여 백엔드의 API를 호출할 수 있습니다. 전반적인 추세는 애플리케이션의 엣지에서 타입 안전성을 제공하는 tRPC, [Zod](https://zod.dev/), [Prisma](https://www.prisma.io/), [TanStack Router](https://tanstack.com/router)와 같은 풀스택 애플리케이션에 이러한 타입 안전성 솔루션을 더 많이 사용하는 방향으로 확실히 이동하고 있습니다.

## 빌드 도구

몇 년 동안 React 생태계에서는 [create-react-app](https://create-react-app.dev/)(CRA)이 지배적이었습니다. 초보자에게는 더 이상 [React 설정이 포함된 사용자 정의 Webpack](https://www.robinwieruch.de/minimal-react-webpack-babel-setup/)을 구성할 필요 없이 바로 사용할 수 있는 React 스타터 프로젝트가 제공되었기 때문에 당시에는 작은 혁명이었습니다. 하지만 작년 한 해 동안 Webpack은 빠르게 구식이 되었습니다.

![빌드 도구](https://www.robinwieruch.de/static/77b2844fca1822f6a081d2c710339e6b/a9a89/build-tools.webp)

[Vite](https://vitejs.dev/)는 스타터 프로젝트를 만드는 데 널리 사용되는 모든 프레임워크(예: React.js)와 함께 작동하기 때문에 단일 페이지 애플리케이션(SPA)에 관한 한 블록의 새로운 주자입니다. Vue.js의 창시자 Evan You가 구현한 이 프레임워크는 차세대 프런트엔드 도구로 불립니다. 다른 자바스크립트 번들러에 비해 Go로 작성되어 경쟁 제품(예: Webpack)보다 종속성을 10~100배 빠르게 번들링하는 [esbuild](https://esbuild.github.io/)에서 그 강력한 성능을 얻을 수 있습니다.

Vite의 생태계는 [Vitest](https://vitest.dev/)(Jest의 대체 테스트 도구)와 같은 추가 기능으로 번창하고 있지만, Vercel의 [Turbopack](https://turbo.build/pack)과 같은 다른 경쟁자가 최근에 등장했습니다. 터보팩은 웹팩의 창시자인 Tobias Koppers가 주도적으로 개발했기 때문에 웹팩의 후계자로 불립니다. Next.js는 여전히 웹팩을 사용하고 있고, 터보팩은 같은 회사에서 개발했기 때문에 향후에는 Next.js와 터보팩이 완벽한 조화를 이룰 것으로 예상할 수 있습니다.

## AI 주도 개발

AI가 결국 개발자의 일자리를 빼앗을까요? 아직 이 질문에 대한 답은 없지만, 2022년에는 AI 기반 개발이 현실이 될 것입니다. [GitHub Copilot](https://github.com/features/copilot)이 출시되면서 개발자는 선호하는 IDE에서 AI 프로그래머와 짝을 이룰 수 있게 되었습니다. 코드를 작성하거나 코딩하려는 내용을 설명하는 코멘트를 작성하는 것만큼이나 간단하며, GitHub Copilot은 구현 세부 사항을 가장 잘 이해할 수 있도록 자동으로 완성해줍니다.

하지만 여기서 멈추지 않습니다. OpenAI의 [ChatGPT](https://openai.com/blog/chatgpt/)는 프로그래밍 작업까지도 처리하는 더욱 일반적인 언어 모델입니다. ChatGPT에 자유 형식의 질문을 할 수 있지만 코딩 작업도 수행할 수 있습니다. 이미 많은 개발자가 ChatGPT를 스택 오버플로우를 대체하여 사용하고 있습니다. 많은 상황에서 ChatGPT는 검색 엔진 대용으로 사용했을 때 유용한 답변을 제공했습니다(항상 완벽한 답변은 아닙니다). 후자는 개발 관련 콘텐츠뿐만 아니라 많은 SEO 스팸을 처리해야 하므로 현재로서는 ChatGPT가 실행할 수 있는 대안으로 간주합니다.

하지만 '현재로서는' 이라는 점이 중요합니다. 인공지능이 만든 콘텐츠가 월드와이드웹에 해를 끼칠 가능성 또한 존재합니다. 이전에는 수동으로 생성된 SEO 콘텐츠가 이미 문제가 되었다면, ChatGPT로 자동 생성된 SEO 콘텐츠를 더 많이 생성하는 것을 막을 수 있는 사람은 아무도 없습니다. ChatGPT는 결국 자체적으로 생성된 콘텐츠를 학습하게 될까요?

---

잊어버리고 싶지 않은 몇 가지 주목할 만한 내용이 있지만 앞서 언급한 트렌드에 포함되지는 않았습니다. 자바스크립트/CSS/HTML로 구현된 데스크톱 애플리케이션을 위한 Electron의 대안으로 [Tauri](https://tauri.app/), E2E 테스트를 위한 Cypress의 대안으로 [Playwright](https://playwright.dev/), 차세대 터미널로 [Warp](https://www.warp.dev/)와 [Fig](https://fig.io/), 반응형 디자인을 위한 CSS 미디어 쿼리의 대안으로 [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries), 마지막으로 자바스크립트 없이 대화형 사용자 인터페이스를 만들기 위한 강화된 HTML로 [htmx](https://htmx.org/)를 꼽을 수 있습니다. 여기서는 요약만 했으니 직접 확인해 보세요!

아무쪼록 웹 개발 생태계의 현 상황에 대한 훌륭한 요약이 되었기를 바랍니다. 제 글이 마음에 드셨다면 아래에서 제 뉴스레터를 구독해 주세요. 또한 올해에는 이러한 기술 중 몇 가지에 대해 더 많은 글을 쓸 계획이므로 해당 기술 중 하나에서 일하고 계신다면 저에게 연락을 주시면 함께 협업할 수 있을 것입니다.
