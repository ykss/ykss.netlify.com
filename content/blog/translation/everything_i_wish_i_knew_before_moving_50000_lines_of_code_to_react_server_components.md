---
title: '(번역) 50,000줄의 코드를 React 서버 컴포넌트로 옮기기 전에 알았더라면 좋았을 것들'
date: 2023-09-07 01:00:00
category: 'Translation'
draft: false
---

> 원문: [Everything I wish I knew before moving 50,000 lines of code to React Server Components](https://www.mux.com/blog/what-are-react-server-components)

React 서버 컴포넌트는 많습니다. 우리는 최근에 [문서를 재정비](https://www.mux.com/blog/the-building-blocks-of-great-docs)하고 [Mux를 리브랜딩](https://www.mux.com/blog/rebranding-during-a-recession)했으며, 그 과정에서 [mux.com](https://www.mux.com/)과 [docs.mux.com](https://docs.mux.com/?_gl=1*15054gb*_ga*MjEyOTAwMDE2OS4xNjkzNjQxMjEw*_ga_D3BFYPQXX7*MTY5MzY1NDM5MS4yLjEuMTY5MzY1NDg3MS4wLjAuMA..)을 모두 서버 컴포넌트로 옮겼습니다. 그렇기 때문에 제가 여기서 하는 말을 믿으셔도 됩니다. 서버 컴포넌트로 전환하는 것은 충분히 가능하고, 그렇게 무섭지 않으며 아마도 그만한 가치가 있을 것입니다.

다음 질문에 답하면서 그 이유를 설명해 드리겠습니다. [서버 컴포넌트가 중요한 이유는 무엇](https://www.mux.com/blog/what-are-react-server-components#how-did-we-get-here)이며, [어떤 장점이 있나요?](https://www.mux.com/blog/what-are-react-server-components) [좋지 않은 점은 무엇인가요?](https://www.mux.com/blog/what-are-react-server-components) [서버 컴포넌트를 어떻게 사용](https://www.mux.com/blog/what-are-react-server-components#how-do-i-use-react-server-components)하고, [어떻게 점진적으로 도입](https://www.mux.com/blog/what-are-react-server-components#how-do-i-incrementally-adopt-react-server-components-in-a-real-life-codebase)하며, [어떤 종류의 고급 패턴을 사용](https://www.mux.com/blog/what-are-react-server-components#did-someone-say-advanced-patterns)하여 제어해야 할까요? 이 모든 과정이 끝나면 [React 서버 컴포넌트를 사용해야 하는지 여부](https://www.mux.com/blog/what-are-react-server-components#so-should-i-use-react-server-components)와 효과적으로 사용하는 방법에 대해 꽤 잘 알 수 있을 것입니다.

## 어떻게 여기까지 왔을까요?

React 서버 컴포넌트를 이해하는데 좋은 방법 중 하나는 서버 컴포넌트가 해결하려는 문제를 이해하는 것입니다. 거기서부터 시작해 볼까요?

오래 전에는 PHP와 같은 기술을 사용해 서버에서 웹사이트를 생성했습니다. 이는 비밀번호를 이용해 데이터를 가져오고, 클라이언트가 가벼운 HTML 페이지를 손쉽게 받을 수 있도록 대형 컴퓨터에서 CPU 집약적인 작업을 처리하는데 유용했습니다.

![클라이언트가 웹사이트를 요청하면 서버는 HTML을 렌더링하고 전송하는 방식으로 응답합니다. 아주 간단합니다.](https://cdn.sanity.io/images/2ejqxsnu/production/046d564924aa4fdc1013975736507361a496706d-1456x824.png?w=1200&q=75&fit=clip&auto=format)

그러다 궁금해지기 시작했습니다. 더 빠른 응답과 더 많은 상호 작용을 원한다면 어떻게 해야 할까요? 사용자가 어떤 행동을 취할 때마다 쿠키를 서버로 다시 전송하고 서버가 완전히 새로운 페이지를 생성하도록 해야 할까요? 대신 클라이언트가 그 작업을 수행하도록 하면 어떨까요? 모든 렌더링 코드를 자바스크립트로 클라이언트에 전송하면 됩니다!

이를 CSR(Client Side Rendering,클라이언트 측 렌더링) 또는 SPA(Single Page Application, 단일 페이지 애플리케이션)라고 하는데, [이전에는 나쁜 방법으로 여겨졌습니다.](https://begin.com/blog/posts/2023-02-21-why-does-everyone-suddenly-hate-single-page-apps) 물론 간단하고 많은 이점이 있습니다! 실제로 오랫동안 React 팀은 [create-react-app](https://create-react-app.dev/)이라는 도구를 통해 이 방법을 기본 접근법으로 권장했습니다. 대시보드와 같이 자주 바뀌고 상호작용이 많은 페이지의 경우 이 정도면 충분할 것입니다. 하지만 검색 엔진이 페이지를 읽도록 하고 싶은데 검색 엔진이 자바스크립트를 실행하지 않는다면 어떻게 해야 할까요? 서버에서 보안을 유지해야 하는 경우에는 어떻게 해야 할까요? 사용자 디바이스의 전력이 낮거나 연결 상태가 좋지 않은 경우(많은 사용자가 그렇듯이)에는 어떻게 해야 할까요?

![클라이언트 측 렌더링에서는 웹사이트를 렌더링 하는 데 필요한 자바스크립트가 클라이언트로 전송됩니다.](https://cdn.sanity.io/images/2ejqxsnu/production/b2ccdda0374ea977e7da44c39c5e1d51f903b3d3-1456x1154.png?w=1200&q=75&fit=clip&auto=format)

![이후 탐색 시 클라이언트는 이미 렌더링 코드가 있으므로 서버와 통신할 필요가 없으므로 반응형 전환이 이루어집니다.](https://cdn.sanity.io/images/2ejqxsnu/production/450e9ff0f14022f2fb428a3832125378811f5d23-1456x1004.png?w=1200&q=75&fit=clip&auto=format)

서버 측 렌더링(SSR)과 정적 사이트 생성(SSG)이 바로 이 지점에서 등장했습니다. [Next.js](https://nextjs.org/)나 [Gatsby](https://www.gatsbyjs.com/)와 같은 도구는 SSR과 SSG를 사용하여 서버에서 페이지를 생성한 후 HTML과 자바스크립트를 클라이언트로 전송합니다. 두 가지 장점을 모두 누릴 수 있었습니다. 클라이언트는 해당 HTML을 즉시 표시하여 사용자에게 볼거리를 제공할 수 있습니다. 그런 다음 JS가 로드되면 사이트가 멋지고 인터랙티브해집니다. 보너스로 멋진 점은 검색 엔진이 해당 HTML을 읽을 수 있습니다.

![서버 측 렌더링에서는 클라이언트가 즉시 볼 수 있는 HTML과 후속 페이지를 렌더링 하는 데 필요한 자바스크립트가 전송됩니다. 자바스크립트를 로드하고 하이드레이트 하는 데 시간이 오래 걸립니다.](https://cdn.sanity.io/images/2ejqxsnu/production/7a07f638868e9ccd15d109fab1e706fd9da7a537-1456x1096.png?w=1200&q=75&fit=clip&auto=format)

![CSR에서와 마찬가지로 후속 탐색에서 SSR는 다음 페이지를 표시하는 데 필요한 모든 렌더링 코드가 있으므로 전환이 빠릅니다.](https://cdn.sanity.io/images/2ejqxsnu/production/d3c68081c9af040f62e732b4b0c7c8cf50af5b83-1456x1004.png?w=1200&q=75&fit=clip&auto=format)

이 방식은 실제로 꽤 좋습니다! 하지만 여전히 해결해야 할 몇 가지 문제가 있습니다. 첫 번째로, 대부분의 SSR/SSG 접근 방식은 페이지를 생성하는 데 사용된 모든 자바스크립트를 클라이언트로 전송하고, 클라이언트는 이 모든 것을 다시 실행하여 방금 로드된 자바스크립트와 해당 HTML을 결합합니다. (참고로 이 결합을 하이드레이션이라고 하는데, 이 분야에서 많이 볼 수 있는 용어입니다). 그 모든 자바스크립트를 전송하고 실행해야 할까요? 하이드레이션을 위해 모든 렌더링 작업을 굳이 중복해야 할까요?

두 번째로, 서버 측 렌더링에 시간이 오래 걸리면 어떨까요? 많은 코드를 실행하거나 느린 데이터베이스 호출을 기다리는 중일 수도 있습니다. 그러면 사용자는 계속 기다리며 짜증이 나게됩니다.

바로 이때 React 서버 컴포넌트가 등장합니다.

## React 서버 컴포넌트란 무엇인가요? 어떤 용도로 사용할 수 있을까요?

React 서버 컴포넌트(RSC)는 당연히 클라이언트가 아닌 서버에서 실행되는 React 컴포넌트입니다. 하지만 '무엇'보다 '왜'가 훨씬 더 흥미롭습니다. 왜 RSC가 필요할까요? RSC를 지원하는 프레임워크는 SSR에 비해 두 가지 큰 장점이 있습니다.

첫째, RSC를 지원하는 프레임워크는 코드가 실행되는 위치를 정의할 수 있는 방법을 제공합니다. 즉, 옛날 PHP 시절처럼 서버*에서만* 실행해야 하는 것과 클라이언트에서 실행해야 하는 것(SSR처럼)을 정의할 수 있습니다. 이를 각각 서버 컴포넌트와 클라이언트 컴포넌트라고 합니다. 코드가 실행되는 위치를 명시할 수 있으므로 클라이언트에 보내는 자바스크립트 양을 줄일 수 있어 번들 크기가 작아지고 하이드레이션 과정에서의 작업량을 줄일 수 있습니다.

![인터랙티브 컴포넌트(녹색)는 클라이언트로 전송되는 반면 정적 컴포넌트(파란색)는 서버에 남아 있습니다.](https://cdn.sanity.io/images/2ejqxsnu/production/9721215af7c629ef054e00a765f98a331656efee-1456x880.png?w=1200&q=75&fit=clip&auto=format)

RSC 기반 프레임워크의 두 번째 장점은 서버 컴포넌트의 경우 _컴포넌트 내에서 직접_ 데이터를 가져올 수 있다는 것입니다. 데이터 가져오기가 완료되면 서버 컴포넌트는 해당 데이터를 클라이언트로 *스트리밍*할 수 있습니다.

이 새로운 데이터 페칭 방식은 두 가지 측면에서 변화를 가져옵니다. 첫 번째로 이제 React에서 데이터를 불러오는 것이 훨씬 더 쉬워졌습니다. 모든 서버 컴포넌트는 노드 라이브러리를 사용하거나 우리가 모두 잘 알고 있는 `fetch` 함수를 사용해 직접 데이터를 불러올 수 있습니다. 사용자 컴포넌트는 사용자 데이터를, 동영상 컴포넌트는 동영상 데이터를 가져올 수 있습니다. 더 이상 라이브러리를 사용하거나 복잡한 로딩 상태를 관리([react-query](https://tanstack.com/query/v3/)는 여전히 사랑합니다.)하기 위해 `useEffect`를 사용할 필요가 없으며, 페이지 수준에서 `getServerSideProps`로 많은 데이터를 가져온 다음 필요한 컴포넌트로 일일이 내려 보내지 않아도 됩니다.

두 번째로, 앞서 언급한 문제를 해결합니다. 데이터베이스 호출이 느린가요? 응답을 기다릴 필요 없이 느린 컴포넌트가 준비되면 클라이언트로 전송하기만 하면 됩니다. 사용자는 그 동안 사이트의 나머지 부분을 즐길 수 있습니다.

![이 서버 컴포넌트는 자체 데이터를 직접 가져와서 준비가 되면 스트리밍합니다.](https://cdn.sanity.io/images/2ejqxsnu/production/453e68deb5faa8fc744571fde66048773c8d65ca-1456x880.gif?w=1200&q=75&fit=clip&auto=format)

보너스 라운드를 준비했습니다. 폼 제출과 같은 사용자의 클라이언트 작업에 대한 응답으로 서버에서 데이터를 가져와야 한다면 어떻게 해야 할까요? 이 경우에도 방법이 있습니다. 클라이언트가 서버로 데이터를 전송하면 서버는 데이터를 가져오는 등의 작업을 수행한 후 초기 데이터를 스트리밍 한 것처럼 응답을 클라이언트로 다시 스트리밍 할 수 있습니다. 이 양방향 통신은 _엄밀히 말해_ React 서버 컴포넌트가 아니라 [React Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations#actions)이지만, 같은 기반 위에 구축되어 있고 밀접하게 연관되어 있습니다. 하지만 여기서는 React 액션에 대해서는 많이 다루지 않겠습니다. [다음 블로그 포스팅](https://www.mux.com/blog/what-are-react-server-actions)을 위해 남겨둬야 할 내용입니다.

## React 서버 컴포넌트의 *단점*은 무엇인가요?

지금까지는 꽤 장밋빛 그림을 그렸습니다. RSC가 CSR과 SSR보다 훨씬 낫다면 왜 사용하지 않을까요? 저도 같은 궁금증을 가지고 있었는데, 이 글의 제목에서 알 수 있듯이 실제로 문제가 있다는 것을 어렵게 알게 되었습니다. 사실 몇 가지가 있습니다. 다음은 React 서버 컴포넌트로 마이그레이션 할 때 가장 많은 시간을 할애했던 세 가지 부분입니다.

### 현재는 CSS in JS를 사용할 수 없습니다

현재로서는 [서버 컴포넌트에서 CSS-in-JS가 작동하지 않는 것](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-7-styling)으로 밝혀졌습니다. 이 점이 아쉬웠습니다. [styled-components](https://styled-components.com/)에서 [Tailwind CSS](https://tailwindcss.com/)로 전환하는 것이 RSC 전환의 가장 큰 부분이었지만, [수고할 만한 가치가 있었다고 생각합니다.](https://www.mux.com/blog/the-building-blocks-of-great-docs#tailwind-css)

따라서 CSS-in-JS에 올인했다면 할 일이 좀 많을 수도 있습니다. 그래도 더 나은 것으로 마이그레이션할 수 있는 좋은 기회인 것은 분명합니다.

### 서버 컴포넌트에서 React Context가 작동하지 않습니다

[React Context](https://react.dev/learn/passing-data-deeply-with-context)는 [클라이언트 컴포넌트*에서만*](https://nextjs.org/docs/app/building-your-application/rendering#rendering-third-party-context-providers-in-server-components) 접근할 수 있습니다. 서버 컴포넌트 간에 props를 사용하지 않고 데이터를 공유하려면 아마도 일반적인 [모듈](https://nextjs.org/docs/app/building-your-application/rendering#sharing-data-between-server-components)을 사용해야 할 것입니다.

그리고 여기에 중요한 핵심이 있습니다. 어떤 종류의 데이터를 React 애플리케이션의 하위 트리로 제한하고 싶다면, 서버 컴포넌트에는 이를 위한 훌륭한 메커니즘이 없습니다. (제가 틀렸다면 바로잡아 주세요. 그렇다면 이 부분은 정말 놓친 것입니다.)

이것은 저희의 문서 사이트에서는 큰 문제가 되지 않았습니다. React Context를 많이 사용한 곳도 상호작용이 많았고, 어쨌든 클라이언트에 제공해야 하는 부분이었기 때문입니다. 예를 들어 검색 경험은 컴포넌트 트리 전체에 걸쳐 `queryString` 및 `isOpen`과 같은 상태를 공유합니다.

하지만 마케팅 사이트에서는 이 점이 정말 중요했습니다. 마케팅 사이트에는 테마를 공유하는 영역이 있습니다. 예를 들어, 아래 스크린샷에서 사전 푸터(pre-footer)의 각 컴포넌트는 배경이 녹색임을 인지해야 어두운 녹색 테두리를 사용한다는 것을 알게 됩니다. 일반적으로는 Context를 사용하여 해당 테마 상태를 공유하려고 했겠지만, 이것들은 주로 정적 컴포넌트이며, 서버 컴포넌트에 이상적인 후보이기 때문에 Context를 사용할 수 없었습니다. [CSS 사용자 정의 프로퍼티](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)에 의존하여 이 문제를 해결했습니다(아마도 데이터 문제가 아니라 스타일링 문제이므로 이것이 더 나은 방법이었을 것입니다). 하지만 다른 개발자들의 경우에는 이렇게 운이 좋지 않을 수도 있습니다.

![이 섹션의 각 컴포넌트는 녹색 테마를 사용해야 합니다. 서버 컴포넌트에서 React Context를 사용할 수 없기 때문에 CSS 사용자 정의 프로퍼티를 사용했습니다.](https://cdn.sanity.io/images/2ejqxsnu/production/7db034d9dfa4cd72fc5619842f31602f3971bfba-2912x840.png?w=1200&q=75&fit=clip&auto=format)

### 솔직히 모든 것을 한꺼번에 머릿속에 담아두는 것은 어렵습니다

기본적으로 RSC는 코드가 실행되는 위치와 데이터 가져오기 방식에 대해 더 많은 유연성을 제공합니다. **유연성에는 복잡성이 수반됩니다**. 어떤 도구도 이 [복잡성을 완전히 덮을 수](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/)는 없으므로 언젠가는 개발자가 이 복잡성을 이해하고 직면하여 다른 개발자와 소통해야 합니다.

새로운 개발자가 우리의 코드 베이스를 처음 접할 때마다 이러한 질문이 제기되었습니다. "서버에서 무엇이 실행되고 있나요? 클라이언트에서는 무엇이 실행되고 있나요?" 모든 PR에는 실수로/불필요하게 클라이언트로 전달된 내용에 대한 피드백이 있었습니다. 종종 콘솔 로그를 추가하여 서버 또는 클라이언트에서 어느 쪽이 로깅을 하는지 확인했습니다. 그리고 [캐싱](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)의 복잡성은 말할 것도 없습니다.

이 문제는 연습과 안정적인 패턴을 통해 나아졌습니다. 이제 React 서버 컴포넌트를 어떻게 사용 할 지, 점진적 마이그레이션은 어떻게 할 지, 읽기 어려운 스파게티 코드 덩어리를 만들지 _않고_, 까다로운 작업을 수행하려면 어떻게 해야 할지에 대에 이야기해보죠.

## React 서버 컴포넌트는 어떻게 사용하나요?

아직 흥미로우신가요? 장점보다 단점이 더 크다고 생각하시나요? 좋아요! 이제 기본적인 것부터 시작해서 자세히 알아봅시다.

> 이 글을 쓰는 시점에 프로덕션 환경에서 사용할 수 있는 유일한 RSC 구현은 Next.js 13의 새로운 [앱 디렉터리](https://nextjs.org/docs/app)입니다. 자체 RSC 프레임워크를 구현할 수도 있지만, 그렇게 하는 개발자라면 이 블로그 포스팅을 읽지 않으실 것입니다. 어쨌든, 여기에 몇 가지 참고 사항은 Next.js와 약간 관련이 있을 수 있습니다.

### 서버 컴포넌트

서버 컴포넌트의 개념적 모델은 복잡할 수 있지만 구문은 매우 간단합니다. 기본적으로 Next.js 13의 새 [앱 디렉터리](https://nextjs.org/docs/app)에 작성하는 모든 컴포넌트는 서버 컴포넌트가 됩니다. 즉, 기본적으로 페이지의 어떤 코드도 클라이언트로 전송되지 않습니다.

```js
// 기본적인 서버 컴포넌트
function Description() {
  return (
    <p>
      이 코드 중 어떤 것도 클라이언트로 전송되지 않습니다. HTML만 전송됩니다!
    </p>
  );
}
```

해당 서버 컴포넌트에 비동기 작업을 추가하면 데이터를 가져올 수 있습니다! 그 모습은 다음과 같습니다.

```jsx
// 데이터 가져오기 기능이 있는 서버 컴포넌트
async function getVideo(id) {
  const res = await fetch(`https://api.example.com/videos/${id}`);
  return res.json();
}

async function Description({ videoId }) {
  const video = await getVideo(userId);
  return <p>{video.description}</p>;
}
```

RSC의 힘을 제대로 발휘할 수 있는 마지막 요소가 하나 더 있습니다. 느린 데이터 페치로 인해 기다리는 데 시간을 허비하고 싶지 않다면, 서버 컴포넌트를 `React.Suspense`로 감싸면 됩니다. React는 클라이언트에게 로딩 폴백(fallback)을 표시하고, 서버가 데이터 불러오기를 완료하면 결과를 클라이언트로 스트리밍 합니다. 그러면 클라이언트는 로딩 폴백을 전체 컴포넌트로 대체할 수 있습니다.

아래 예시에서는 클라이언트에 "댓글 로딩 중" 및 "관련 동영상 로딩 중"이라는 메시지가 표시됩니다. 댓글 가져오기가 완료되면 서버는 `<Comments />` 컴포넌트를 렌더링 하고 렌더링 된 컴포넌트를 클라이언트로 스트리밍 하며, 관련 동영상도 마찬가지로 스트리밍합니다.

```js
// 데이터 가져오기 및 스트리밍 기능이 있는 서버 컴포넌트
import { Suspense }  from 'react'

async function VideoSidebar({ videoId }) {
  return (
    <Suspense fallback={<p>댓글 로딩 중...</p>}>
      <Comments videoId={videoId} />
    </Suspense>
    <Suspense fallback={<p>관련 동영상 로딩 중...</p>}>
      <RelatedVideos videoId={videoId} />
    </Suspense>
  )
}
```

`React.Suspense`를 도입하면 데이터가 준비되었을 때 스트리밍하는 것 이상의 이점이 있습니다. 또한 React는 Suspense 바운더리를 활용하여 사용자 상호작용에 따라 앱의 특정 부분에 우선적으로 하이드레이션을 적용할 수 있습니다. 이를 선택적 하이드레이션이라고 하며 이는 [전문가](https://www.youtube.com/watch?v=Q98l5o1y3ao&ab_channel=RealWorldReact)에게 맡기는 것이 더 나을 것입니다.

### 클라이언트 컴포넌트

이제 클라이언트에서 실행해야 하는 코드가 있다고 가정해 봅시다. 예를 들어, `onClick` 리스너가 있거나 `useState`에 저장된 데이터에 대해 반응해야 하는 코드가 있을 수 있습니다.

컴포넌트는 두 가지 방법 중 하나로 배포됩니다. 첫 번째로 파일 상단에 `"use client"`를 추가하면 해당 모듈이 클라이언트로 전송되어 사용자 상호 작용에 응답할 수 있습니다.

```js
// 기본적인 클라이언트 컴포넌트
'use client';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);

  return <button onClick={increment}>The count is {count}</button>;
}
```

컴포넌트가 클라이언트로 전송되는 두 번째 방법은 클라이언트 컴포넌트에서 컴포넌트를 _임포트하는_ 경우입니다. 즉, 컴포넌트를 `"use client"`로 표시하면 해당 컴포넌트가 클라이언트로 전송될 뿐만 아니라 _해당 컴포넌트가 임포트하는 모든 컴포넌트도 클라이언트로 전송됩니다._

(그럼 서버 컴포넌트가 클라이언트 컴포넌트의 하위 컴포넌트가 될 수 없다는 뜻인가요? 아니요, 하지만 조금 복잡합니다. 나중에 자세히 설명하겠습니다.)

도움이 된다면 이렇게 생각하면 됩니다. `"use client"`는 번들러에게 *이것*이 클라이언트/서버 경계임을 알리는 것입니다. 도움이 되지 않는다면 마지막 문장은 무시하세요.

### 라이브러리가 클라이언트 컴포넌트를 지원하지 않는다면 어떻게 해야 하나요?

위의 두 번째 방법을 활용해 일반적인 문제를 해결할 수 있습니다. 사용하고 싶은 라이브러리가 아직 React 서버 컴포넌트를 지원하지 않아서 `"use client"` 지시어가 없다고 가정해 봅시다. 만약 해당 라이브러리가 클라이언트에 제공되고 싶다면, 라이브러리가 포함된 클라이언트 컴포넌트를 가져오면 클라이언트에도 제공될 것입니다.

```jsx
// 라이브러리를 클라이언트 컴포넌트로 변환하기
'use client';

// 이 라이브러리는 클라이언트 컴포넌트에서 불러와지므로,
// 이 또한 클라이언트 컴포넌트가 됩니다.
import MuxPlayer from '@mux/mux-player-react';

function ClientMuxPlayer(props) {
  return <MuxPlayer {...props} />;
}
```

![다른 클라이언트 컴포넌트에서 라이브러리를 가져와서 클라이언트 컴포넌트로 변환할 수 있습니다.](https://cdn.sanity.io/images/2ejqxsnu/production/e97b11cfc084862ddcdc6d9bbf9b450d1267ef62-896x752.png?w=1200&q=75&fit=clip&auto=format)

### 클라이언트 컴포넌트는 언제 사용해야 하나요?

한 걸음 물러나 살펴보죠.

서버 컴포넌트는 용감한 새로운 React 세계입니다. 데이터를 가져오고 클라이언트에 보내지 않아도 되는 값비싼 코드(예를 들어 블로그 포스트의 텍스트를 렌더링 하거나 코드 블록을 구문 강조 표시하는 등)를 실행하는 데 유용합니다. 가능하다면 코드를 서버 컴포넌트로 남겨두어 클라이언트 번들이 커지는 것을 방지해야 합니다.

클라이언트 컴포넌트는 여러분이 잘 알고 애용하는 React입니다. 서버 측에서 렌더링 될 수 있으며, 클라이언트로 전송되어 하이드레이션 되고 실행됩니다. 클라이언트 컴포넌트는 사용자 입력에 반응하거나 시간에 따라 상태를 변경하고자 할 때 유용합니다.

전체 앱이 클라이언트 컴포넌트로 만들어졌다면 과거의 SSR 프레임워크와 똑같이 작동할 것입니다. 따라서 앱 전체를 한 번에 서버 컴포넌트로 전환해야 한다는 부담감을 느끼지 마세요! 가장 큰 이점을 얻을 수 있는 부분부터 점진적으로 도입하면 됩니다. 이제 점진적인 도입에 대하여 말해보겠습니다.

## 실제 코드베이스에서 React 서버 컴포넌트를 점진적으로 도입하려면 어떻게 해야 하나요?

이 부분에서 사람들은 "깔끔하네요! 하지만 작업이 너무 많아 보이고 코드베이스 전체를 다시 작성할 시간이 없어요."라고 말합니다. 그럴 필요가 없습니다. 다음은 대부분의 코드를 서버 컴포넌트로 가져올 때 사용한 3단계 가이드입니다.

1. 앱의 루트에 `"use client"` 지시문을 추가합니다.
2. 지시문을 렌더링 트리에서 가능한 아래로 이동시킵니다.
3. 성능 문제가 생긴다면 고급 패턴을 채택합니다.

위 내용에 대해 자세히 살펴보겠습니다.

### 1. 앱의 루트에 `"use client"` 지시문을 추가합니다

네. 이게 전부입니다. Next.js 13을 사용하는 경우 최상위 `page.jsx`로 이동하여 상단에 `"use client"`를 붙여 넣으세요. 페이지가 이전과 똑같이 작동하지만 이제 서버 컴포넌트의 세계에 도전할 준비가 되었습니다!

```jsx
// video/page.jsx
'use client';

export default function App() {
  <>
    <Player />
    <Title />
  </>;
}
```

![앱의 루트에 "use client"를 추가하면 앱이 클라이언트 컴포넌트로 변환됩니다. 이제 SSR 애플리케이션처럼 작동합니다.](https://cdn.sanity.io/images/2ejqxsnu/production/0f786fb579619ba251ed71264d54e79da96ba7f7-896x528.png?w=1200&q=75&fit=clip&auto=format)

서버 사이드 데이터 페칭이 있나요? 클라이언트 컴포넌트에서는 그렇게 할 수 없으므로 서버 컴포넌트를 추가하겠습니다. 서버 컴포넌트를 클라이언트 컴포넌트의 부모로 추가해 봅시다. 이 서버 컴포넌트는 데이터 페칭을 수행하여 페이지로 전달합니다. 그 모습은 다음과 같습니다.

```jsx
// video/page.jsx
/**
  * 여기서 우리가 하는 일은 서버에서 데이터를 가져와서,
  * 그 데이터를 클라이언트 컴포넌트에 전달하는 것입니다.
  */
import VideoPageClient from './page.client.jsx'

// 이것은 예전에는 getServerSideProps였습니다.
async function fetchData() {
  const res = await fetch('https://api.example.com')
  return await res.json()
}

export default async function FetchData() {
  const data = await fetchData()
  {/* 페이지의 콘텐츠를 이 클라이언트 컴포넌트로 옮겼습니다. */}
  const <VideoPageClient data={data} />
}

export default Page
```

```jsx
// video/page.client.jsx
/**
 * 데이터 페칭을 제외한 전체 앱이 여기에 있습니다.
 */
'use client';

export default function App({ data }) {
  <>
    <Player videoId={data.videoId} />
    <Title content={data.title} />
  </>;
}
```

![데이터를 가져올 수 있도록 서버 컴포넌트를 앱의 부모로 추가합니다.](https://cdn.sanity.io/images/2ejqxsnu/production/b8664cdc623ebfb61024066a410ceff83e8de017-896x752.png?w=1200&q=75&fit=clip&auto=format)

### 2. 지시문을 렌더링 트리에서 가능한 한 아래로 이동시킵니다

다음으로, `"use client"` 지시문을 최상위 컴포넌트에서 각 자식 컴포넌트로 이동합니다. 이 예제에서는 `<Client />` 컴포넌트에서 `<Player />` 및 `<Title />` 컴포넌트로 이동하겠습니다.

```jsx
// video/Player.jsx
'use client';
import MuxPlayer from '@mux/mux-player-react';

function Player({ videoId }) {
  return <MuxPlayer streamType="on-demand" playbackId={videoId} />;
}
```

```jsx
// video/Title.jsx
'use client';

function Title({ content }) {
  return <h1>{content}</h1>;
}
```

!["use client" 지시문을 컴포넌트 트리에서 더 아래로 이동합니다.](https://cdn.sanity.io/images/2ejqxsnu/production/f7c2ebc75510d0b2618bac342767f81ba7b1e9ed-896x752.png?w=1200&q=75&fit=clip&auto=format)

그리고 반복합니다! 단, `<Player />`와 `<Title />` 모두 `"use client"` 지시문을 밀어 넣을 수 있는 자식이 없으므로 제거하겠습니다!

`<Title />`은 클라이언트 측 코드가 필요하지 않고 순수한 HTML로 제공할 수 있기 때문에 아무런 문제가 없습니다. 반면에 `<Player />`는 오류를 발생시킵니다.

![Player 컴포넌트는 사용자 상호작용에 의존하므로 "use client" 지시어가 필요합니다.](https://cdn.sanity.io/images/2ejqxsnu/production/bc19ec4c724108875fb6fe39ded569748c374bcb-1999x1251.png?w=1200&q=75&fit=clip&auto=format)

좋습니다. 여기까지입니다. `"use client"`를 `<Player />` 컴포넌트에서 복원하여 이 오류를 해결하고 마무리하겠습니다.

![앱의 최종 상태입니다.](https://cdn.sanity.io/images/2ejqxsnu/production/fb06d7b8fa80e92742a5dab2cef463172357da27-896x752.png?w=1200&q=75&fit=clip&auto=format)

보셨나요? 나쁘지 않습니다. 앱을 서버 컴포넌트로 옮겼습니다. 이제 새 컴포넌트를 추가하고 기존 컴포넌트를 리팩토링할 때 서버 컴포넌트를 염두에 두고 작성할 수 있습니다. 그리고 `<Title />`을 번들에 포함하지 않음으로써 번들 크기를 약간 줄였습니다!

### 3. 성능 문제가 생긴다면 고급 패턴을 채택합니다

대부분의 경우 1단계와 2단계로 충분합니다. 하지만 성능 문제를 발견했다면 RSC 전환을 통해 얻을 수 있는 몇 가지 개선 사항이 여전히 있습니다.

예를 들어, [저희 문서 사이트를 RSC로 마이그레이션 할 때](https://www.mux.com/blog/the-building-blocks-of-great-docs) 두 가지 패턴을 활용하여 더 큰 이점을 얻을 수 있었습니다. 첫 번째는 앞서 설명한 것처럼 느린 데이터 가져오기를 스트리밍 하기 위해 주요 서버 컴포넌트를 `Suspense`로 래핑하는 것이었습니다. 전체 앱은 [CMS](https://en.wikipedia.org/wiki/Content_management_system)에서 제공되는 변경 로그 사이드바를 제외하고는 정적으로 생성됩니다. 해당 사이드바를 Suspense로 감싸면 나머지 앱은 CMS 가져오기가 해결될 때까지 기다릴 필요가 없습니다. 그 외에도, 내부적으로 Suspense/스트리밍을 사용하는 Next.js 13의 `loading.js` 규칙을 활용했습니다.

두 번째로 적용한 최적화는 구문 강조 표시 기능인 [Prism](https://prismjs.com/)과 같은 대규모 라이브러리가 서버에 계속 유지되도록 클라이언트 및 서버 컴포넌트를 창의적으로 재배치하는 것이었습니다. 클라이언트 및 서버 컴포넌트를 창의적으로 재배치하는 것에 대해 말해보겠습니다.

## 누군가 고급 패턴이라고 말했나요?

### 클라이언트 컴포넌트와 서버 컴포넌트를 어떻게 혼합하나요?

앞서 클라이언트 컴포넌트에서 가져온 컴포넌트는 그 자체로 클라이언트 컴포넌트가 된다고 설명했습니다. 그렇다면 서버 컴포넌트를 클라이언트 컴포넌트의 하위 컴포넌트로 만들려면 어떻게 해야 할까요? 간단히 말해서, **서버 컴포넌트를 가져오는 대신 자식이나 props로 전달하면 됩니다.** 서버 컴포넌트는 서버에서 렌더링 되고, 직렬화되어 클라이언트 컴포넌트로 전송됩니다.

제 생각에는 이 부분이 이 모든 RSC 문제에서 가장 이해하기 어려운 부분입니다. 실습을 통해 더 쉽게 이해할 수 있습니다. 잘못된 방법부터 몇 가지 예를 살펴보겠습니다.

```jsx
// 클라이언트 및 서버 컴포넌트를 혼합하지 않는 방법
'use client';

// 클라이언트 컴포넌트에서 가져온 모든 것이 클라이언트 컴포넌트가 되므로
// 이것은 잘못된 것입니다!
import ServerComponentB from './ServerComponentB.js';

function ClientComponent() {
  return (
    <div>
      <button onClick={onClickFunction}>Button</button>
      {/*  클라이언트 컴포넌트에서 가져와졌기 때문에 클라이언트 컴포넌트가 됩니다. */}
      <ServerComponentB />
    </div>
  );
}
```

![클라이언트 컴포넌트에서 가져오는 모든 것이 클라이언트 컴포넌트가 됩니다. 이것을 원치 않았을 수도 있습니다.](https://cdn.sanity.io/images/2ejqxsnu/production/a44b47b18d6b94eac3ad208f7d11a7b00b37d803-896x752.png?w=1200&q=75&fit=clip&auto=format)

클라이언트 컴포넌트에서 `ServerComponent`를 가져와서 `ServerComponent`를 클라이언트로 전송했습니다. 이 작업을 제대로 수행하려면 가장 가까운 서버 컴포넌트(이 경우 `ServerPage`)로 한 단계 올라가서 작업을 수행해야 합니다.

```jsx
// 클라이언트 및 서버 컴포넌트를 혼합하는 방법
import ClientComponent from './ClientComponent.js';
import ServerComponentB from './ServerComponentB.js';

/**
 * 클라이언트 컴포넌트와 서버 컴포넌트를 혼합하는 첫 번째 방법은
 * 서버 컴포넌트를 클라이언트 컴포넌트에
 * 자식 컴포넌트로 전달하는 것입니다.
 */
function ServerComponentA() {
  return (
    <ClientComponent>
      <ServerComponentB />
    </ClientComponent>
  );
}

/**
 * 클라이언트 컴포넌트와 서버 컴포넌트를 혼합하는 두 번째 방법은
 * 서버 컴포넌트를 클라이언트 컴포넌트에
 * prop으로 전달하는 것입니다.
 */
function ServerPage() {
  return <ClientComponent content={<ServerComponentB />} />;
}
```

![클라이언트 컴포넌트가 서버 컴포넌트를 직접 가져오지 않고 자식이나 prop으로 받으면 ServerComponentB는 서버 컴포넌트로 유지됩니다.](https://cdn.sanity.io/images/2ejqxsnu/production/1158841db01c52936d6dcf130255ddce8d7580cb-896x752.png?w=1200&q=75&fit=clip&auto=format)

### 파일의 절반을 서버 컴포넌트로, 절반을 클라이언트 컴포넌트로 만들 수 있나요?

아니요! 하지만 컴포넌트 기능의 일부가 서버에 유지되기를 원할 때 자주 사용하는 패턴이 있습니다. `<CodeBlock />` 컴포넌트를 만든다고 가정해 봅시다. 구문 강조 표시 기능을 서버에 유지하여 대용량 라이브러리를 제공할 필요가 없지만, 사용자가 여러 코드 예제 사이를 전환할 수 있도록 일부 클라이언트 기능도 원할 수 있습니다. 먼저 컴포넌트를 두 개로 나눕니다. `CodeBlock.server.js`와 `CodeBlock.client.js`입니다. 서버 컴포넌트는 클라이언트 컴포넌트를 가져옵니다. (이름은 아무렇게나 지을 수 있지만, 간단하게 하기 위해 `.server`와 `.client`를 사용했습니다.)

```jsx
// components/CodeBlock/CodeBlock.server.js

import Highlight from 'expensive-library'
import ClientCodeBlock from './CodeBlock.client.js'
import { example0, example1, example2 } from './examples.js'

function ServerCodeBlock() {
  return (
    <ClientCodeBlock
      // prop으로 전달하기 때문에 서버 전용으로 유지됩니다.
      renderedExamples={[
        <Highlight code={example0.code} language={example0.language} />,
        <Highlight code={example1.code} language={example1.language} />,
        <Highlight code={example2.code} language={example2.language} />
      ]}
    >
  )
}

export default ServerCodeBlock
```

```jsx
// components/CodeBlock/CodeBlock.client.js

'use client';
import { useState } from 'react';

function ClientCodeBlock({ renderedExamples }) {
  // 상태 및 onClick 리스너에 반응해야 하므로
  // 클라이언트 컴포넌트여야 합니다.
  const [currentExample, setCurrentExample] = useState(1);

  return (
    <>
      <button onClick={() => setCurrentExample(0)}>Example 1</button>
      <button onClick={() => setCurrentExample(1)}>Example 2</button>
      <button onClick={() => setCurrentExample(2)}>Example 3</button>
      {renderedExamples[currentExample]}
    </>
  );
}

export default ClientCodeBlock;
```

이제 두 가지 컴포넌트가 생겼으니 깔끔한 파일 구조로 쉽게 사용할 수 있도록 만들어 봅시다. 이 두 파일을 `CodeBlock`이라는 폴더에 넣고 다음과 같은 `index.js` 파일을 추가해 보겠습니다:

```jsx
// components/CodeBlock/index.js

export { default } from './CodeBlock.server.js';
```

이제 모든 컨슈머는 `import CodeBlock from 'components/CodeBlock.js'을 통해 클라이언트 및 서버 컴포넌트를 불러올 수 있으며, 클라이언트 및 서버 컴포넌트는 투명하게 유지됩니다.

### 혼란스럽습니다. 내 코드가 서버에서 실행되고 있는지 어떻게 확인할 수 있나요?

솔직히 처음에는 개발 중에 코드에 `console.log`를 추가하고 해당 로그가 서버에서 나오는지 웹 브라우저에서 나오는지를 확인했습니다. 처음에는 이것으로 충분했지만 결국 더 나은 방법을 찾았습니다.

서버 컴포넌트가 번들에 포함되지 않도록 더욱 확실하게 하고 싶다면 [`server-only` 패키지](https://www.npmjs.com/package/server-only)를 가져올 수 있습니다. 이 방법은 대용량 라이브러리나 비밀 키가 포함되지 않아야 할 곳에 포함되지 않도록 하려는 경우에 특히 유용합니다(Next.js를 사용하는 경우 실수로 환경 변수를 전송하는 것을 [방지할 수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser) 있습니다).

`server-only`를 사용하면 *가독성과 유지보수성*이라는 또 다른 미묘하지만, 의미 있는 이점이 있었습니다. 파일 상단에 `server-only`가 표시되면 유지 관리자는 컴포넌트 트리의 전체 개념적 모델을 기억하지 않고도 해당 파일이 실행 중인 위치를 정확히 알 수 있습니다.

## 그렇다면 React 서버 컴포넌트를 사용해야 할까요?

결국 React 서버 컴포넌트는 공짜가 아닙니다. CSS-in-JS나 React Context를 둘러싼 문제만 있는 것이 아닙니다. 서버에서 실행되는 것과 클라이언트에서 실행되는 것의 이해, [하이드레이션 이해](https://www.joshwcomeau.com/react/the-perils-of-rehydration/), 인프라 비용 발생, 코드 복잡성 관리(특히 클라이언트 컴포넌트와 서버 컴포넌트를 혼합할 때)와 같은 복잡성도 추가됩니다. 복잡성의 모든 측면은 버그가 침투할 수 있는 또 다른 표면을 추가하고 코드의 유지 관리성을 떨어뜨립니다. 프레임워크는 이러한 복잡성을 줄여주지만, 완전히 제거하지는 못합니다.

RSC를 도입할지 여부를 결정할 때는 이러한 비용과 더 작은 번들 크기 및 빠른 실행과 같은 이점을 비교하여 SEO에 큰 영향을 미칠 수 있습니다. 또는 복잡한 데이터가 많은 사이트를 최적화하는 데 사용할 수 있는 고급 데이터 로딩 패턴을 고려할 수도 있습니다. [Reactathon 강연](https://www.youtube.com/watch?v=TJOiXyVKExg&list=PLRvKvw42Rc7MoxLVE_9qM24NAjqDdbBJc&index=5&ab_channel=RealWorldReact)에서 같은 질문에 대한 답을 찾으려 했던 [Jeff Escalante](https://twitter.com/jescalan)는 이 다이어그램을 통해 그 해답을 제시했습니다.

![](https://cdn.sanity.io/images/2ejqxsnu/production/fa65f50f67153f795fdbfad5a7e4907508ed22c0-1999x1125.png?w=1200&q=75&fit=clip&auto=format)

여러분의 팀이 정신적 부담을 감당할 준비가 되어 있고, 성능상의 이점을 누릴 가치가 있다면 RSC가 적합할 수 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
