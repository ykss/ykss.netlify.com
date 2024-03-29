---
title: '(번역) 리액트 모범 사례 다시 생각하기'
date: 2023-04-17 02:00:00
category: 'Translation'
draft: false
---

> 원문: [Rethinking React best practices](https://frontendmastery.com/posts/rethinking-react-best-practices/)

> 클라이언트 측 뷰 라이브러리에서 애플리케이션 아키텍처에 이르기까지 리액트의 진화에 대해 자세히 알아보세요.

## 도입

10년 전, 리액트는 클라이언트가 렌더링하는 SPA의 세계에 대한 모범 사례를 바꿔놓았습니다.

오늘날 리액트 도입률은 최고조에 달하고 있으며, 비판과 회의론도 지속적으로 제기되고 있습니다.

리액트 18은 리액트 서버 컴포넌트(RSC)와 함께 "뷰" 역할만을 수행하는 라이브러리로 여겨졌던 클라이언트 측 MVC 패턴에서 크게 벗어나고 있습니다. 이러한 변화는 리액트의 발전 과정에서 상당히 중요한 단계로 볼 수 있습니다.

이 글에서는 리액트 라이브러리에서 리액트 아키텍처로 진화한 리액트의 진화를 이해할 것입니다.

안나 카레니나 법칙에 따르면, "모든 행복한 가정은 서로 닮아 있고, 불행한 가정은 저마다 다른 이유로 불행하다"라고 합니다.

먼저 리액트의 핵심 제약 조건과 이를 관리하기 위한 과거의 접근 방식을 이해하는 것으로 시작하겠습니다. 이후에는 만족스러운 리액트 애플리케이션이 공통으로 가지고 있는 기본 패턴과 원칙을 살펴봅니다.

마지막에는 Remix와 Next 13 앱 디렉토리와 같은 리액트 프레임워크에서 발견되는 변화하는 멘탈 모델을 이해하게 될 것입니다.

지금까지 우리가 해결하려고 했던 근본적인 문제를 이해하는 것부터 시작하겠습니다. 이를 통해 서버, 클라이언트, 번들러가 긴밀하게 통합된 상위 프레임워크를 활용하라는 리액트 코어 팀의 권고를 맥락에 맞게 이해하는 데 도움이 될 것입니다.

## 어떤 문제를 해결하고 있습니까?

소프트웨어 엔지니어링에는 일반적으로 **기술적 문제**와 **인적 문제**라는 두 가지 유형의 문제가 있습니다.

아키텍처를 이러한 문제를 관리하는 데 도움이 되는 적절한 제약 조건을 찾는 과정으로써 생각하는 것도 한 가지 방법입니다.

인적 문제를 해결하는 올바른 제약 조건이 없다면 더 많은 사람이 협업할수록 시간이 지날수록 더 복잡하고 오류가 발생하기 쉬우며 더 위험한 변경이 이루어집니다. 기술적인 문제를 관리하기 위한 적절한 제약 조건이 없으면 일반적으로 더 많이 배포할수록 최종 사용자 경험은 더 나빠지게 됩니다.

이러한 제약 조건은 궁극적으로 복잡한 시스템을 구축하고 상호 작용하는 인간으로서 가장 큰 제약 조건인 **제한된 시간과 주의력**을 관리하는 데 도움이 됩니다.

### 리액트와 인적 문제

인적 문제를 해결하는 것은 높은 영향력을 발휘합니다. 제한된 시간과 주의력으로 개인, 팀, 조직의 생산성을 확장할 수 있습니다.

팀은 빠르게 출시할 수 있는 시간과 자원이 제한되어 있습니다. 개인으로서 우리는 많은 양의 복잡성을 머릿속에 담아두는 데 한계가 있습니다.

우리의 대부분의 시간은 무슨 일이 일어나고 있는지, 무언가를 변경하거나 추가하는 가장 좋은 방법은 무엇인지 파악하는 데 소비됩니다. 사람들은 머릿속을 전체 시스템으로 가득 채우지 않고도 작업할 수 있어야 합니다.

리액트의 성공 요인 중 가장 큰 부분은 당시의 기존 해결책에 비해 이러한 제약을 얼마나 잘 관리했는지에 있습니다. 이를 통해 팀은 선언적으로 다시 구성할 수 있고 단방향 데이터 흐름으로 "그냥 작동"할 수 있는 분리된 컴포넌트를 병렬로 구축할 수 있었습니다.

컴포넌트 모델과 일반적인 패턴에서 벗어나는 전략(escape hatch)을 통해 명확한 경계 뒤에 남아있는 레거시 시스템과 통합의 복잡성을 추상화할 수 있었습니다. 그러나 이러한 분리와 컴포넌트 모델의 영향 중 하나는, 나무만 보고 숲의 큰 그림을 놓치기 쉽다는 점입니다.

### 리액트 및 기술적 문제

또한 리액트는 당시의 기존 해결책에 비해 복잡한 상호작용 기능을 더 쉽게 구현할 수 있었습니다.

선언적 모델 덕분에 n-ary 트리 데이터 구조가 생성되고, 이 데이터 구조는 **react-dom**과 같은 플랫폼별 렌더러에 공급됩니다. 팀이 확장되고 상용 패키지를 사용하게 되면서 이 트리 구조는 매우 빠르게 깊어지는 경향이 있었습니다.

2016년 리팩터링 된 이후, 리액트는 최종 사용자 하드웨어에서 처리해야 하는 크고 깊은 트리를 최적화하는 기술적 문제를 적극적으로 대응해 왔습니다.

화면 반대편에 있는 사용자 역시 시간과 주의력이 제한되어 있습니다. 기대치는 높아지지만, 집중할 수 있는 시간은 줄어들고 있습니다. 사용자는 프레임워크, 렌더링 아키텍처 또는 상태 관리에 신경 쓰지 않습니다. 사용자는 그저 불편함 없이 필요한 작업을 수행하기를 원합니다. 또 다른 제약 조건은 사용자가 생각하게 만들지 말고 빠르게 처리해야 한다는 것입니다.

아래에서 살펴보겠지만, 차세대 리액트(및 리액트 계열) 프레임워크에서 권장하는 많은 모범 사례는 오로지 클라이언트 CPU에서만 처리되는 깊은 트리를 처리할 때의 영향을 완화해 줍니다.

## 프런트엔드의 갈라진 흐름 돌아보기

지금까지 기술 업계는 서비스의 중앙 집중화 vs 분산화, 가벼운 클라이언트 vs 무거운 클라이언트와 같은 다양한 축에서 진자처럼 움직여 왔습니다.

무거운 데스크톱 클라이언트에서 웹의 등장으로 가벼운 클라이언트로, 그리고 모바일 컴퓨팅과 SPA의 등장으로 다시 무거운 클라이언트로 전환했습니다. 오늘날 리액트의 지배적인 멘탈 모델은 이 무거운 클라이언트 측 접근 방식에 뿌리를 두고 있습니다.

이러한 변화는 [프런트엔드와 백엔드 분리 과정](https://frontendmastery.com/posts/the-new-wave-of-javascript-web-frameworks/#the-frontend-backend-split)에서 클라이언트로 마이그레이션 하면서 CSS, 인터렉션 디자인, HTML, 접근성 패턴에 정통한 "프런트엔드 전면" 개발자와 "프런트엔드 후면" 개발자 사이에 [양극화를 가져왔습니다](https://css-tricks.com/the-great-divide/).

리액트 생태계에서는 "프런트엔드를 위한 백엔드" 스타일 코드의 상당 부분이 서버로 다시 이동하면서 두 세계의 장점을 조화시키기 위해 진자가 그 중간 어딘가에서 흔들리고 있습니다.

## "MVC 패턴의 뷰"에서 애플리케이션 아키텍처까지

대규모 조직에서는 엔지니어의 일부가 아키텍처 모범 사례를 구축하는 플랫폼 파트에서 일합니다.

이러한 개발자는 나머지 개발자가 제한된 시간과 주의를 집중하여 큰 성과를 내는 일에 집중할 수 있도록 지원합니다.

시간과 주의력의 제약을 받으면 가장 쉬운 방법을 기본값으로 설정하게 되는 경우가 많습니다. 따라서 우리는 우리를 올바른 길로 이끌어주고 [성공의 구렁텅이에 쉽게 빠뜨리는](https://blog.codinghorror.com/falling-into-the-pit-of-success/) 이러한 긍정적인 제약을 원합니다.

이러한 성공의 큰 부분은 최종 사용자 디바이스에서 불러와 실행해야 하는 코드의 양을 줄이는 것입니다. **필요한 것만 다운로드하고 실행하는 것**을 원칙으로 합니다. 클라이언트 전용 패러다임에 갇혀 있으면 이 원칙을 지키기가 어렵습니다. 번들에는 메인 스레드에서 실행될 수 있는 데이터 페칭, 처리, 포맷팅 라이브러리(예: **moment**)가 포함되게 됩니다.

이는 리액트의 **단방향 데이터 흐름이 서버까지 확장되어** MPA의 단순한 요청-응답 멘탈 모델과 SPA의 상호작용이 결합한 Remix나 Next와 같은 프레임워크에서 변화하고 있습니다.

## 서버로 돌아가는 여정

이제 그동안 클라이언트 전용 패러다임에 적용했던 최적화를 이해해 보겠습니다. 더 나은 성능을 위해 서버를 다시 도입해야 했습니다. 이러한 맥락은 서버가 일급 시민이 되기 위해 진화하는 리액트 프레임워크를 이해하는 데 도움이 됩니다.

다음은 클라이언트 렌더링 프런트엔드(스크립트 태그가 많은 빈 HTML 페이지)를 제공하는 간단한 접근 방식입니다.

![클라이언트 렌더링 접근 방식](https://frontendmastery.com/_astro/simple_CSR.cf234c3f_Z1CckRU.png)

이 접근 방식의 장점은 빠른 [TTFB](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_first_byte), 간단한 운영 모델, 분리된 백엔드입니다. 이 조합은 리액트의 프로그래밍 모델과 결합하여 많은 사람의 문제를 단순화합니다.

하지만 모든 작업을 사용자 하드웨어에 맡기기 때문에 기술적인 문제가 빠르게 발생합니다. 모든 것이 다운로드되고 실행될 때까지 기다렸다가 클라이언트에서 가져와야만 유용한 내용을 표시할 수 있습니다.

코드가 추가되는 공간은 한계가 있습니다. 신중한 성능 관리가 없으면 애플리케이션이 현저하게 느려지는 결과를 초래할 수 있습니다.

### 서버 사이드 렌더링으로의 진입

서버로 돌아가는 첫 번째 단계는 이러한 느린 시작 시간을 해결하기 위한 것이었습니다.

초기 문서 요청에 빈 HTML 페이지로 응답하는 대신, 즉시 서버에서 데이터를 가져온 다음 컴포넌트 트리를 HTML로 렌더링하여 응답했습니다.

클라이언트가 렌더링하는 SPA의 맥락에서 SSR은 자바스크립트가 로드되는 동안 초기에 빈 흰색 화면 대신 최소한 무언가를 표시하는 트릭과 같습니다.

![서버 사이드 렌더링 접근 방식](https://frontendmastery.com/_astro/SSR_with_hydration.1a26d94b_Z1dSxcG.png)

SSR은 특히 콘텐츠가 많은 페이지의 체감 성능을 개선할 수 있습니다. 하지만 [운영 비용](https://arkwright.github.io/scaling-react-server-side-rendering.html)이 발생하고, [TTI](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_interactive)가 더 밀려나면서 상호작용이 많은 페이지의 사용자 경험이 저하될 수 있습니다.

이를 "불쾌한 계곡"이라고 하는데, 사용자가 페이지에서 콘텐츠를 보고 상호 작용을 시도하지만 메인 스레드가 잠겨 있는 상태입니다. 문제는 여전히 **자바스크립트 코드가 너무 많다는 것**입니다.

### 속도에 대한 필요성 - 더 많은 최적화

그러므로 SSR은 속도를 높일 수는 있지만 확실한 해결책은 아닙니다.

서버에서 렌더링 하고 클라이언트에서 리액트가 이를 이어받으면 모든 것을 다시 수행하여 두 번 작업하는 내재적인 비효율성이 있습니다.

TTFB가 느리면 브라우저는 어떤 애셋을 다운로드할 것인지 알기 위해 문서 요청 후 **head**를 받기까지 인내심을 갖고 기다려야 합니다.

바로 이 지점에서 **스트리밍(streaming)**이 등장하여 **병렬성(parallelism)**을 강화합니다.

ChatGPT가 전체 응답이 완료될 때까지 스피너를 표시한다면 어떻게 될지 생각해 볼 수 있습니다. 대부분 사람은 기능이 고장 났다고 생각하고 탭을 닫을 것입니다. 그래서 우리는 데이터와 콘텐츠를 완료되는 대로 브라우저로 스트리밍 하여 가능한 한 빨리 표시합니다.

동적 페이지에 대한 스트리밍은 서버에서 가능한 한 빨리 페칭를 시작하고 동시에 브라우저에서 애셋 다운로드를 시작하도록 하는 방법으로, 모두 동시에 진행됩니다. 이는 데이터가 포함된 HTML을 전송하기 전에 데이터를 모두 페칭하고 모든 렌더링이 완료될 때까지 기다리는 위의 이전 다이어그램보다 훨씬 빠릅니다.

> 스트리밍에 대해 더 자세히 알아보기
>
> 이 스트리밍 기술은 스트리밍 데이터를 지원할 수 있는 백엔드 서버 스택 또는 에지 런타임에 따라 달라집니다.
>
> HTTP/2에서는 여러 요청과 응답을 동시에 전송할 수 있는 기능인 HTTP 스트림이 사용되며, HTTP/1에서는 데이터를 더 작은 개별 청크로 전송할 수 있는 **Transfer-Encoding: chunked** 메커니즘이 사용됩니다.
>
> 최신 브라우저에는 읽기 가능한 스트림으로 가져오기 응답을 사용할 수 있는 [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)가 내장되어 있습니다.
>
> 응답의 body 속성은 읽기 가능한 스트림으로, 클라이언트가 서버에서 사용할 수 있게 되는 데이터를 한 청크씩 받을 수 있도록 합니다. 모든 청크가 완전히 다운로드될 때까지 기다리지 않아도 됩니다.
>
> 이 방식을 사용하려면 서버에서 스트리밍 응답을 전송하고 클라이언트에서 다시 읽을 수 있는 기능을 설정해야 하므로 [클라이언트와 서버 간의 긴밀한 협업이 필요](https://github.com/remix-run/remix/blob/main/docs/guides/streaming.md)합니다.
>
> 캐싱 고려 사항, HTTP 상태 코드 및 오류 처리, 최종 사용자 환경의 실제 표시 등 스트리밍에는 주목할 만한 몇 가지 세밀한 부분들이 있습니다. 레이아웃 이동과 빠른 TTFB 사이에는 트레이드오프가 있습니다.

지금까지는 클라이언트가 렌더링한 트리를 서버에서 빠르게 가져오는 동시에 HTML을 일찍 플러시 하여 데이터와 애셋의 다운로드를 동시에 병렬 처리함으로써 시작 시간을 개선했습니다.

이제 데이터 페칭 및 변경에 대해 알아보겠습니다.

### 데이터 페칭 제약 조건

"모든 것이 컴포넌트"인 계층적 컴포넌트 트리의 한 가지 제약 조건은 노드가 가져오기 시작, 로딩 상태 관리, 이벤트 응답, 렌더링과 같은 여러 가지 책임을 가진다는 점입니다.

이는 일반적으로 **무엇을 가져올지 파악하기 위해 트리를 탐색**해야 한다는 것을 의미합니다.

초창기에는 SSR로 초기 HTML을 생성하려면 서버에서 [트리를 수동으로 탐색](https://twitter.com/dan_abramov/status/1021548632619790336)해야 하는 경우가 많았습니다. 이를 위해서는 모든 데이터 종속성을 수집하기 위해 리액트 내부를 들여다보고 트리를 탐색하면서 순차적으로 가져오는 작업이 필요했습니다.

클라이언트에서 이 "렌더링 후 불러오기" 순서는 레이아웃 이동에 따라 로딩 스피너가 나타났다 사라지기를 반복하게 합니다. 트리를 순회하면 순차적으로 네트워크 워터폴로 이어집니다.

따라서 다운로드할 내용을 파악하기 위해 매번 트리를 위에서 아래로 탐색할 필요 없이 **데이터와 코드를 병렬로 가져올 수 있는** 방법이 필요합니다.

### Relay 이해하기

Relay의 원리와 Facebook에서 이러한 문제를 어떻게 대규모로 해결했는지 이해해 보면 많은 도움이 됩니다. 이러한 개념은 이후에 보게 될 패턴을 이해하는 데에도 도움이 될 것입니다.

- **컴포넌트에는 데이터 종속성이 함께 있습니다.**

  Relay에서 컴포넌트는 데이터 종속성을 GraphQL 조각으로 선언적으로 정의합니다.

  코로케이션을 지원하는 React Query와 가장 큰 차이점은 **컴포넌트가 데이터를 페칭하는 작업을 직접 수행하지 않는다**는 점입니다.

- 빌드 시간 동안 트리 탐색이 발생합니다.

  Relay 컴파일러는 트리를 통해 각 컴포넌트의 데이터 요구 사항을 수집하고 최적화된 GraphQL 쿼리를 생성합니다.

  일반적으로 이 쿼리는 런타임에 **경로 바운더리(또는 특정 진입점)에서 실행**되므로 컴포넌트 코드와 데이터를 가능한 한 빨리 병렬로 로드할 수 있습니다.

코로케이션은 가장 중요한 아키텍처 원칙 중 하나인 코드를 삭제할 수 있는 기능을 지원합니다. 컴포넌트를 제거하면 해당 데이터 요구 사항도 제거되어 쿼리에 더 이상 포함되지 않습니다.

Relay는 리소스를 가져올 때 큰 트리 데이터 구조를 처리하는 것과 관련된 많은 트레이드오프 문제를 완화합니다.

그러나 이는 다소 복잡할 수 있으며, 성능을 유지하면서 DX 속성을 조정하기 위해 GraphQL, 클라이언트 측 런타임 및 고성능 컴파일러가 필요합니다.

나중에 더 넓은 환경에서 리액트 서버 컴포넌트가 어떻게 비슷한 패턴을 따르는지 살펴보겠습니다.

### 차선책

이 모든 작업을 수행하지 않고 데이터와 코드를 가져올 때 트리를 탐색하지 않는 다른 방법은 무엇일까요?

바로 Remix나 Next와 같은 프레임워크에서 볼 수 있는 서버의 **중첩 경로(nested routes)** 가 여기에 해당합니다.

일반적으로 컴포넌트의 초기 데이터 종속성은 URL에 매핑될 수 있습니다. 여기서 URL의 중첩된 세그먼트는 컴포넌트 하위 트리에 매핑됩니다. 이 매핑을 통해 프레임워크는 특정 URL에 필요한 데이터와 컴포넌트 코드를 미리 식별할 수 있습니다.

예를 들어 Remix에서는 하위 트리가 상위 경로와 독립적으로 자체 데이터 요구 사항을 가질 수 있으며, 컴파일러는 중첩된 경로가 병렬로 로드되도록 보장합니다.

또한 이러한 캡슐화는 독립적인 하위 경로에 대해 별도의 오류 경계를 제공함으로써 성능 저하를 점진적으로 완화할 수 있습니다. 또한 프레임워크가 URL을 확인하여 데이터와 코드를 미리 로드할 수 있으므로 SPA 전환이 빨라집니다.

### 더 많은 병렬화

**서스펜스**, **동시(concurrent) 모드**, **스트리밍**이 지금까지 살펴본 데이터 불러오기 패턴을 어떻게 개선하는지 자세히 살펴보겠습니다.

서스펜스를 사용하면 데이터를 사용할 수 없을 때 하위 트리가 로딩 UI를 표시하도록 하고, 데이터가 준비되면 렌더링을 다시 시작할 수 있습니다.

이는 동기식 트리에서 비동기성을 선언적으로 표현할 수 있는 기본 요소입니다. 이를 통해 리소스 가져오기와 렌더링을 동시에 병렬화할 수 있습니다.

스트리밍에서 보았듯이 렌더링이 완료될 때까지 기다릴 필요 없이 더 빨리 전송을 시작할 수 있습니다.

Remix에서는 이 패턴이 경로 수준 데이터 로더의 **defer** 함수로 표현됩니다.

```js
// Remix API는 중첩된 로더가 병렬로 로드되는 경로 경계에서
// 데이터를 페칭하는 것을 권장합니다.
export function loader ({ params }) {
	// 데이터 페칭을 시작하지만 렌더링을 막지는 않기 때문에 중요하지 않습니다.
	const productReviewsPromise = fetchReview(params.id)
	// 데이터가 있는 페이지를 표시하는데 중요하기 때문에 기다립니다.
	const product = await fetchProduct(params.id)

	return defer({ product, productReviewsPromise })
}

export default function ProductPage() {
	const { product, productReviewsPromise }  = useLoaderData()
	return (
		<>
			<ProductView product={product}>
			<Suspense fallback={<LoadingSkeleton />}>
				<Async resolve={productReviewsPromise}>
					{reviews => <ReviewsView reviews={reviews} />}
				</Async>
			</Suspense>
		</>
	)
}
```

Next의 RSC는 중요한 데이터를 기다릴 수 있는 서버의 비동기 컴포넌트를 사용하여 유사한 데이터 페칭 패턴을 제공합니다.

```js
// 서버 컴포넌트에서 유사한 패턴의 예시 입니다.
export default async function Product({ id }) {
	// 데이터 가져오기를 시작하지만 렌더링을 막지는 않기 때문에 중요하지 않습니다.
	const productReviewsPromise = fetchReview(id)
	// 기다리면서 렌더링을 막기 때문에 중요한 부분입니다.
	const product = await fetchProduct(id)
	return (
		<>
			<ProductView product={product}>
			<Suspense fallback={<LoadingSkeleton />}>
				{/* use() 훅으로 내부의 프로미스를 언래핑합니다. */}
				<ReviewsView data={productReviewsPromise} />
			</Suspense>
		</>
	)
}
```

여기서 중요한 원칙은 가능한 한 빨리 서버에서 데이터를 페칭하는 것입니다. 데이터 소스에 가까운 로더와 RSC를 사용하는 것이 가장 이상적입니다.

불필요한 대기를 피하기 위해 덜 중요한 데이터를 스트리밍하여 페이지가 단계적으로 로드될 수 있도록 하며, 이는 서스펜스를 통해 쉽게 이루어집니다.

RSC 자체에는 경로 경계에서 데이터 불러오기를 촉진하는 고유한 API가 없습니다. 따라서 신중하게 구조화하지 않으면 순차적인 네트워크 워터폴이 발생할 수 있습니다.

따라서 프레임워크는 모범 사례를 내재화하면서, 더 많은 유연성을 제공함과 동시에 잠재적인 오류나 보안 취약점 가능성(foot-gun)을 최소화하기 위해 균형을 유지해야 합니다.

> 번역자 주 : foot-gun은 말 그대로 발에 대포를 맞추듯이 프로그래머가 실수로 발생시킬 수 있는 잠재적인 오류 및 보안 취약점을 의미합니다. 이는 프레임워크가 개발자에게 제공하는 자유로움과 유연성이 높아질수록 발생할 가능성도 높아집니다.

RSC를 데이터에 가깝게 배포하면 클라이언트 사이드 워터폴에 비해 순차적 워터폴의 영향이 크게 줄어든다는 점에 주목할 필요가 있습니다.

이러한 패턴을 강조하는 것은 RSC가 URL을 특정 컴포넌트에 매핑할 수 있는 라우터와 더 높은 수준의 프레임워크 통합해야 한다는 점을 강조합니다.

RSC에 대해 자세히 알아보기 전에 잠시 시간을 내어 나머지 부분을 이해해 보겠습니다.

### 데이터 변형

클라이언트 전용 패러다임에서 원격 데이터를 관리하는 일반적인 패턴은 일종의 표준화된 저장소(예: Redux store) 내부에서 이루어집니다.

이 모델에서 변형(mutation)은 종종 메모리에서 클라이언트 캐시를 최적으로 업데이트한 다음 네트워크 요청을 보내 서버의 원격 상태를 업데이트합니다.

이를 수동으로 관리하려면 지금까지 많은 보일러 플레이트가 필요했고, [The new wave of React state management](https://frontendmastery.com/posts/the-new-wave-of-react-state-management/#the-rise-of-purpose-built-libraries-to-solve-the-remote-state-management-problem)에서 살펴보았던 모든 예외 케이스에서 오류가 발생하기 쉬웠습니다.

Hook의 등장으로 이러한 모든 예외 케이스에 특화된 [Redux RTK](https://redux-toolkit.js.org/rtk-query/overview) 및 [React Query](https://tanstack.com/query/v3/)와 같은 도구가 등장했습니다.

이러한 문제를 처리하기 위해서는 코드를 외부로 전송하고, 리액트 컨텍스트를 통해 값이 전파되어야 함을 의미합니다. 이러한 방식은 트리를 탐색하는 동안 비효율적인 순차적 입출력 작업이 쉽게 발생할 수 있어서 주의가 필요합니다.

**그렇다면 리액트의 단방향 데이터 흐름이 서버까지 확장되면 이 기존 패턴은 어떻게 바뀔까요?**

이 "프런트엔드 후면" 스타일 코드의 상당 부분이 실제 백엔드로 이동합니다.

아래는 [Remix의 데이터 흐름](https://remix.run/blog/remix-data-flow)에서 가져온 이미지로, 프레임워크가 MPA(다중 페이지 애플리케이션) 아키텍처에서 볼 수 있는 요청-응답 모델을 향해 변화하고 있음을 보여줍니다.

이러한 변화는 모든 것을 클라이언트에서 처리하는 모델에서 벗어나 서버가 더 중요한 역할을 하는 모델로 전환하는 것입니다.

![remix의 데이터 흐름](https://frontendmastery.com/_astro/remix-data-flow.226defa0_Z2so8Sq.png)

이 전환에 대해 더 자세히 알아보려면 [웹의 다음 전환](https://www.epicweb.dev/the-webs-next-transition)을 참조하세요.

이 패턴은 실험적인 "서버 액션 함수"를 통해 RSC에도 확장됩니다. 리액트의 단방향 데이터 흐름이 서버로 확장되는 경우, 요청-응답 모델이 점진적으로 향상된 형태로 단순화됩니다.

클라이언트에서 코드를 분리할 수 있다는 것도 이 접근 방식의 좋은 장점입니다. 하지만 가장 큰 장점은 데이터 관리 멘탈 모델을 단순화하여 기존의 많은 클라이언트 코드를 간소화할 수 있다는 점입니다.

## 리액트 서버 컴포넌트 이해하기

지금까지 우리는 순전히 클라이언트 측 접근 방식을 최적화하기 위한 방법으로 서버를 활용했습니다. 오늘날 리액트의 멘탈 모델은 사용자 컴퓨터에서 실행되는 클라이언트 렌더링 트리에 깊이 뿌리를 두고 있습니다.

RSC(React Server Components)는 서버를 단순한 최적화 방법이 아니라 일급 시민(first-class citizen)으로 소개합니다. 리액트는 강력한 외부 레이어를 갖추어 백엔드가 컴포넌트 트리에 내장될 수 있도록 진화합니다.

이러한 아키텍처의 변화는 리액트 애플리케이션이 무엇이며 어떻게 배포되는지에 대한 기존의 멘탈 모델에 많은 변화를 가져옵니다.

가장 뚜렷한 두 가지 효과는 우리가 지금까지 언급해 온 최적화된 데이터 로딩 패턴의 제공과 자동 코드 분할입니다.

[대규모 프론트엔드 구축 및 제공](https://frontendmastery.com/posts/building-and-serving-frontends-at-scale/#dependency-management---avoiding-bundle-bloat)의 후반부에서는 종속성 관리, [국제화](https://www.smashingmagazine.com/2023/03/internationalization-nextjs-13-react-server-components/), 최적화된 A/B 테스트와 같은 대규모에서 발생하는 주요 문제에 대해 다루었습니다.

클라이언트 측 환경으로 한정될 경우 이러한 문제들은 대규모 환경에서 최적화하기 어려울 수 있습니다. 리액트 18의 많은 기능과 함께 RSC(React Server Components)는 프레임워크가 이러한 문제를 해결하기 위해 사용할 수 있는 일련의 기본 요소를 제공합니다.

멘탈 모델의 한 가지 획기적인 변화는 **클라이언트 컴포넌트가 서버 컴포넌트를 렌더링할 수 있다**는 사실입니다.

RSCs(React Server Components)를 사용하면 컴포넌트 트리 전체에 걸쳐 연결되어 있는 모습을 시각화하는 데 유용합니다. 클라이언트 컴포넌트가 클라이언트 측 상호작용을 제공하기 위해 삽입되는 "구멍(holes)"이 있습니다.

![rsc](https://frontendmastery.com/_astro/RSC-tree.b2ef914d_1neAXO.png)

컴포넌트 트리 아래로 서버를 확장하면 불필요한 코드 전송을 피할 수 있기 때문에 강력합니다. 또한 사용자 하드웨어와 달리 서버 리소스를 훨씬 더 많이 제어할 수 있습니다.

트리의 뿌리는 서버에 심겨 있고, 줄기는 네트워크를 가로질러 확장되며, 잎은 사용자 하드웨어에서 실행되는 클라이언트 컴포넌트로 푸시됩니다.

이 확장된 모델에서는 컴포넌트 트리의 직렬화 경계를 인식해야 하며, 이는 **'use client'** 지시문으로 표시됩니다.

또한 RSC가 클라이언트 컴포넌트의 **자식**이나 슬롯을 통과하여 필요한 만큼 트리 깊숙한 곳까지 렌더링할 수 있도록 컴포지션을 익히는 것이 중요하다는 점을 다시 한번 강조합니다.

## 서버 액션 함수

프런트엔드 영역을 서버로 마이그레이션 하면서 많은 혁신적인 아이디어가 모색되고 있습니다. 이러한 아이디어는 클라이언트와 서버의 원활한 통합의 미래를 엿볼 수 있습니다.

클라이언트 측 라이브러리인 GraphQL이나 런타임에 비효율적인 워터폴에 대한 걱정 없이 컴포넌트와의 코로케이션의 이점을 얻을 수 있다면 어떨까요?

**서버 함수**의 예는 리액트 계열의 메타프레임워크인 [Qwik city](https://www.builder.io/blog/qwik-city-server-functions#data-fetching-ecosystem/)에서 볼 수 있습니다. 비슷한 아이디어가 [리액트](https://github.com/facebook/react/pull/26124)(Next) 및 [Remix](https://github.com/remix-run/remix/discussions/5383)에서 탐구되고 논의되고 있습니다.

[Wakuwork](https://github.com/dai-shi/wakuwork) 레퍼지토리는 데이터 변형을 위한 리액트 서버 "액션 함수"를 구현하기 위한 PoC(개념 증명)도 제공합니다.

모든 실험적 접근 방식과 마찬가지로 고려해야 할 장단점이 있습니다. 클라이언트-서버 통신과 관련해서는 보안, 오류 처리, 최적 업데이트, 재시도 및 경쟁 조건에 대한 우려가 있습니다. 이러한 문제는 프레임워크에서 관리하지 않으면 해결되지 않는 경우가 많다는 것을 알게 되었습니다.

또한 이 탐구에서는 최고의 DX와 결합된 최고의 UX를 구현하려면 내부적으로 복잡성을 증가시키는 고도화된 컴파일러 최적화가 수반되는 경우가 많다는 사실을 강조합니다.

## 결론

> "소프트웨어는 사람들이 무언가를 성취할 수 있도록 도와주는 도구일 뿐입니다. 하지만 많은 프로그래머가 이를 이해하지 못합니다. 전달되는 가치에 집중하고 도구의 세부 사항에 지나치게 집중하지 마세요 - John Carmack"

리액트 생태계가 클라이언트 전용 패러다임을 넘어 진화함에 따라, 우리 아래와 위에 놓인 추상화를 이해하는 것이 중요합니다.

우리가 작업하는 근본적인 제약 조건을 명확하게 이해하면 더 나은 정보에 기반한 절충안을 만들 수 있습니다.

진자가 흔들릴 때마다 우리는 다음 라운드의 반복에 활용할 수 있는 새로운 지식과 경험을 얻습니다. 이전 접근 방식의 장점은 여전히 유효합니다. 언제나 그렇듯이 장단점이 있습니다.

다행스러운 점은 프레임워크가 점점 더 많은 수단을 제공하여 개발자가 특정 상황에 맞게 세밀하게 절충점을 찾을 수 있도록 지원하고 있다는 점입니다. 이 절충점은 최적화된 사용자 경험과 최적화된 개발자 경험이 결합되는 지점이며, SPA의 복잡한 모델과 MPA의 단순한 모델이 하이브리드로 결합되는 지점입니다.

## 참조

- [An historical reference of React criticism](https://www.zachleat.com/web/react-criticism/)
- [Thinking in Relay](https://relay.dev/docs/principles-and-architecture/thinking-in-relay/)
- [React server components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Rendering on the web](https://web.dev/rendering-on-the-web/)
- [Code Extraction: The Silent Web Revolution](https://www.builder.io/blog/module-extraction-the-silent-web-revolution)
- [React Labs](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [Application Holotypes: A Guide to Architecture Decisions](https://jasonformat.com/application-holotypes/)
- [Progressively enhance for a more resilient web](https://jjenzz.com/progressively-enhance-for-a-more-resilient-web)
- [Clean code horrible performance](https://www.computerenhance.com/p/clean-code-horrible-performance)

<br/>

---

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(<https://kofearticle.substack.com/>)을 구독해주세요!
