---
title: '(번역) 2024 리액트 라이브러리'
date: 2024-01-29 01:00:00
category: 'Translation'
draft: false
---

> 원문 : [React Libraries for 2024](https://www.robinwieruch.de/react-libraries/)

리액트는 꽤 오랫동안 사용되어 왔습니다. 그동안 컴포넌트 기반 라이브러리를 중심으로 다양하고 방대한 생태계를 발전시켜 왔습니다. 다른 프로그래밍 언어나 라이브러리, 프레임워크를 사용하던 개발자들은 종종 리액트를 사용한 웹 애플리케이션을 만들기 위한 **모든 라이브러리**를 파악하는 데 어려움을 겪을 수 있습니다.

핵심적으로, 리액트는 [함수 컴포넌트](https://www.robinwieruch.de/react-function-component/)를 사용하여 컴포넌트 중심의 사용자 인터페이스를 생성할 수 있게 해 줍니다. 리액트는 로컬 상태, 사이드 이펙트, 그리고 성능 최적화를 위한 [리액트 훅](https://www.robinwieruch.de/react-hooks/)과 같은 내장 솔루션을 제공합니다. 결국, 함수(컴포넌트 및 훅)만을 사용해서 UI를 만들고 있는 셈입니다.

> 계속 읽기 : [리액트 트렌드](https://www.robinwieruch.de/react-trends/)

이제 리액트 애플리케이션에 사용할 수 있는 라이브러리에 대해 자세히 알아봅시다.

## 목차

- [새로운 리액트 프로젝트 시작하기](#%EC%83%88%EB%A1%9C%EC%9A%B4-%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0)
- [리액트를 위한 패키지 매니저](#%EB%A6%AC%EC%95%A1%ED%8A%B8%EB%A5%BC-%EC%9C%84%ED%95%9C-%ED%8C%A8%ED%82%A4%EC%A7%80-%EB%A7%A4%EB%8B%88%EC%A0%80)
- [리액트 상태 관리](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC)
- [리액트 데이터 페칭](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%8E%98%EC%B9%AD)
- [리액트 라우터를 통한 라우팅](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%9D%BC%EC%9A%B0%ED%84%B0%EB%A5%BC-%ED%86%B5%ED%95%9C-%EB%9D%BC%EC%9A%B0%ED%8C%85)
- [리액트 CSS 스타일링](#%EB%A6%AC%EC%95%A1%ED%8A%B8-css-%EC%8A%A4%ED%83%80%EC%9D%BC%EB%A7%81)
- [리액트 UI 라이브러리](#%EB%A6%AC%EC%95%A1%ED%8A%B8-ui-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC)
- [리액트 애니메이션 라이브러리](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%95%A0%EB%8B%88%EB%A9%94%EC%9D%B4%EC%85%98-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC)
- [리액트 시각화 & 차트 라이브러리](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%8B%9C%EA%B0%81%ED%99%94--%EC%B0%A8%ED%8A%B8-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC)
- [리액트 폼 라이브러리](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%8F%BC-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC)
- [리액트 타입 검사](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%83%80%EC%9E%85-%EA%B2%80%EC%82%AC)
- [리액트 코드 구조](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BD%94%EB%93%9C-%EA%B5%AC%EC%A1%B0)
- [리액트 인증](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%9D%B8%EC%A6%9D)
- [리액트 백엔드](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%B0%B1%EC%97%94%EB%93%9C)
- [리액트 데이터베이스](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4)
- [리액트 호스팅](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%98%B8%EC%8A%A4%ED%8C%85)
- [리액트 테스팅](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%85%8C%EC%8A%A4%ED%8C%85)
- [리액트 불변 데이터 구조](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%B6%88%EB%B3%80-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EA%B5%AC%EC%A1%B0)
- [리액트 국제화](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B5%AD%EC%A0%9C%ED%99%94)
- [리액트 리치 텍스트 편집기](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%A6%AC%EC%B9%98-%ED%85%8D%EC%8A%A4%ED%8A%B8-%ED%8E%B8%EC%A7%91%EA%B8%B0)
- [리액트 결제](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B2%B0%EC%A0%9C)
- [리액트 시간](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%8B%9C%EA%B0%84)
- [리액트 데스크톱 애플리케이션](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%8D%B0%EC%8A%A4%ED%81%AC%ED%86%B1-%EC%95%A0%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98)
- [리액트 파일 업로드](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%ED%8C%8C%EC%9D%BC-%EC%97%85%EB%A1%9C%EB%93%9C)
- [리액트 메일](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%A9%94%EC%9D%BC)
- [드래그 앤 드롭](#%EB%93%9C%EB%9E%98%EA%B7%B8-%EC%95%A4-%EB%93%9C%EB%A1%AD)
- [리액트 모바일 개발](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%AA%A8%EB%B0%94%EC%9D%BC-%EA%B0%9C%EB%B0%9C)
- [리액트 VR/AR](#%EB%A6%AC%EC%95%A1%ED%8A%B8-vrar)
- [리액트 디자인 프로토타이핑](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%94%94%EC%9E%90%EC%9D%B8-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9D%B4%ED%95%91)
- [리액트 컴포넌트 문서화](#%EB%A6%AC%EC%95%A1%ED%8A%B8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-%EB%AC%B8%EC%84%9C%ED%99%94)

## 새로운 리액트 프로젝트 시작하기

리액트 초보자에게 가장 먼저 떠오르는 질문은 리액트 프로젝트를 설정하는 방법입니다. 선택할 수 있는 도구는 많습니다. 리액트 커뮤니티에서 가장 인기 있는 도구는 다양한 라이브러리(예: 리액트)+옵트인 타입스크립트 조합으로 프로젝트를 생성할 수 있는 [Vite](https://vitejs.dev/)입니다. Vite는 [놀라운 성능](https://twitter.com/rwieruch/status/1491093471490412547)을 보여줍니다.

> 계속 읽기 : [웹 사이트 및 웹 애플리케이션에 대해 자세히 알아보기](https://www.robinwieruch.de/web-applications/)

이미 리액트에 익숙하다면 가장 인기 있는 (메타) 프레임워크 중 하나인 [Next.js](https://nextjs.org/)를 Vite 대신 선택할 수 있습니다. 이 프레임워크는 리액트를 기반으로 구축되었으므로 [리액트의 기본 사항](https://www.roadtoreact.com/)에 대해 알고 있어야 합니다. 이 분야에서 인기 있는 대안은 [Remix](https://remix.run/)입니다.

> 계속 읽기 : [라이브러리 또는 프레임워크로서 리액트를 배우는 방법](https://www.robinwieruch.de/learning-react/)

Next.js는 처음에는 서버 사이드 렌더링(웹 애플리케이션)에 사용되었지만, 다른 렌더링 패턴에 이어 정적 사이트 생성(SSG)에도 사용할 수 있습니다. Next.js에 가장 최근에 추가된 것은 2023년부터 리액트 컴포넌트를 클라이언트에서 서버로 이동하여 패러다임 전환에 기여하는 리액트 서버 컴포넌트입니다.

정적 콘텐츠를 위한 최고의 성능을 염두에 둔 프레임워크를 찾고 있다면, 프레임워크에 구애받지 않고 리액트와 함께 사용할 수 있는 [Astro](https://astro.build/)를 확인해 보세요. 이 프레임워크는 컴포넌트 생성에 리액트와 같은 프레임워크가 사용되더라도 브라우저에 HTML과 CSS만 전송합니다. 이러한 컴포넌트가 인터렉티브해질 경우에만 클라이언트에서 필요한 자바스크립트를 요청합니다.

> 계속 읽기 : [리액트 프로젝트를 시작하는 방법](https://www.robinwieruch.de/react-starter/)

Vite와 같은 도구가 어떻게 작동하는지 이해하고 싶다면 직접 [리액트 프로젝트를 세팅](https://www.robinwieruch.de/minimal-react-webpack-babel-setup/)해 보세요. 자바스크립트가 포함된 HTML 프로젝트로 시작하여 지원 도구(예: Webpack, Babel)와 함께 리액트를 직접 추가할 수 있습니다. 특히 Vite가 Webpack의 계승자가 되었기 때문에 일상적인 작업에서 꼭 다뤄야 하는 것은 아니지만, 기본 도구에 대해 알아가는 것은 훌륭한 학습 경험이 될 것입니다.

리액트의 베테랑이고 새로운 것을 시도해보고 싶다면 [Nitro](https://nitro.unjs.io/) 또는 [Waku](https://github.com/dai-shi/waku)를 확인해 보세요. 후자는 Zustand의 개발자가 만든 것으로, 리액트 서버 컴포넌트를 지원합니다.

### 추천

- 클라이언트 사이드 렌더링 리액트 애플리케이션을 위한 Vite
- 서버 사이드 렌더링 리액트 애플리케이션을 위한 Next.js
- 정적 사이드에서 생성된 리액트 애플리케이션을 위한 Astro
- 선택적 학습 경험: [리액트 프로젝트 처음부터 만들어보기](https://www.robinwieruch.de/minimal-react-webpack-babel-setup/)

## 리액트를 위한 패키지 매니저

자바스크립트 생태계(즉, 리액트)에서 라이브러리(의존성, 노드 패키지)를 설치하는 데 가장 널리 사용되는 패키지 관리자는 [npm](https://www.npmjs.com/)으로, 모든 Node.js 설치와 함께 제공되기 때문입니다. 하지만 [yarn](https://yarnpkg.com/)과 [pnpm](https://pnpm.io/)도 훌륭한 대안이며, 특히 후자는 더 큰 성능 향상을 제공합니다.

> 계속 읽기 : [웹 개발을 위한 Mac 설정](https://www.robinwieruch.de/mac-setup-web-development/)

서로 의존하거나 공통된 사용자 정의 UI 컴포넌트 세트를 공유하는 여러 개의 리액트 애플리케이션을 만드는 경우 모노레포라는 개념을 확인해 볼 수 있습니다. 앞서 언급한 모든 패키지 관리자는 자체 작업 공간 기능을 사용하여 모노레포를 생성할 수 있지만, 개인적으로는 yarn 또는 pnpm을 사용하는 것이 가장 좋은 개발자 경험이었습니다. [Turborepo](https://turbo.build/)와 같은 모노레포 파이프라인 도구와 함께 사용하면 완벽한 모노레포 경험이 될 것입니다.

> 계속 읽기 : [모노레포 설정](https://www.robinwieruch.de/javascript-monorepos/)

### 추천

- 하나의 패키지 관리자를 선택하고 그것만 사용하세요.
  - 기본적이고 가장 널리 사용되는 -> npm
  - 성능은 향상되었지만, 상당히 새롭고 대중적이지 않은 -> pnpm
- 모노레포가 필요한 경우, Turborepo를 확인하세요(튜토리얼을 보세요).

## 리액트 상태 관리

리액트에는 로컬 상태를 관리하기 위한 두 가지 내장 훅, 즉 [useState](https://www.robinwieruch.de/react-usestate-hook/)와 [useReducer](https://www.robinwieruch.de/react-usereducer-hook/)가 있습니다. 상태를 전역적으로 관리해야 하는 경우, [리액트의 내장된 useContext 훅](https://www.robinwieruch.de/react-usecontext-hook/)을 사용하여 [프롭](https://www.robinwieruch.de/react-pass-props-to-component/)을 사용하지 않고도 프롭을 최상위 컴포넌트에서 하위 컴포넌트로 터널링 할 수 있습니다. 이로써 프롭 드릴링 문제를 피할 수 있습니다.

> 계속 읽기 : [언제 useState 와 useReducer를 사용해야 하는지 알아보기](https://www.robinwieruch.de/react-usereducer-vs-usestate/)

리액트의 useState/useReducer 훅을 사용하여 컴포넌트에 함께 배치하거나, 리액트의 useContext 훅과 결합하여 전역적으로 관리할 수도 있습니다. 세 가지 리액트 훅을 통해 개발자는 강력한 상태 관리를 리액트에서 구현할 수 있습니다.

> 계속 읽기 : [useState/useReducer를 useContext와 결합하는 방법 알아보기](https://www.robinwieruch.de/react-state-usereducer-usestate-usecontext/)

공유되거나, 전역 상태에 리액트의 컨텍스트를 너무 자주 사용한다면, [Zustand](https://github.com/pmndrs/zustand)를 꼭 확인해 보세요. 이를 사용하면 스토어에 연결된 모든 리액트 컴포넌트에서 읽고 수정할 수 있는 전역 애플리케이션 상태를 관리할 수 있습니다.

Zustand가 커뮤니티에서 사실상 표준이 되었다고 말하지만, 상태 관리 라이브러리가 필요하다면 여전히 가장 인기 있는 상태 관리 라이브러리인 Redux를 빼놓을 수 없을 것입니다. 저는 Zustand의 단순성을 좋아하기 때문에 Redux를 지난 몇 년간의 개인적인 프리랜서 프로젝트에서 사용하지는 않았지만, Redux와 함께 제공되는 오래된 리액트 애플리케이션을 많이 찾을 수 있습니다.

> 계속 읽기 : [Redux 튜토리얼(Redux Toolkit 제외)](https://www.robinwieruch.de/react-redux-tutorial/)

Redux를 사용하신다면 [Redux Toolkit](https://redux-toolkit.js.org/)도 꼭 확인해 보세요. 그리고 상태 머신에 관심이 있다면 [XState](https://github.com/statelyai/xstate) 또는 [Zag](https://github.com/chakra-ui/zag)를 확인해 보세요. 전역 스토어가 필요하지만 Zustand나 Redux가 마음에 들지 않는다면 [Jotai](https://github.com/pmndrs/jotai), [Recoil](https://github.com/facebookexperimental/Recoil) 또는 [Nano Stores](https://github.com/nanostores/nanostores)와 같은 다른 인기 있는 로컬 상태 관리 솔루션을 확인해 보세요.

### 추천

- 같은 위치에 있거나 공유된 상태의 경우, useState/useReducer (튜토리얼 참조)
- _작은_ 전역 상태의 경우, useContext의 선택적 사용 (튜토리얼 참조)
- _많은_ 전역 상태의 경우 Zustand(또는 다른 대체 도구) 사용

## 리액트 데이터 페칭

UI의 상태는 리액트 내장 훅으로도 충분하지만, 원격 데이터(즉, 데이터 페칭)에 대한 상태 관리(캐싱)에 관해서는 [TanStack Query](https://tanstack.com/query/latest)(이전의 React Query)와 같은 전용 데이터 페칭 라이브러리를 사용하는 것을 권장합니다.

TanStack Query 자체는 상태 관리 라이브러리로 간주되지 않지만, 주로 API에서 원격 데이터를 가져오는 데 사용되기 때문에 원격 데이터의 모든 상태 관리(예: 캐싱, 낙관적 업데이트)를 대신 처리해 줍니다.

> 계속 읽기 : [TanStack Query가 내부에서 어떻게 작동하는지 알아보기](https://www.robinwieruch.de/react-hooks-fetch-data/)

TanStack Query는 REST API를 사용하도록 설계되었습니다. 하지만 요즘은 [GraphQL](https://www.roadtographql.com/)도 지원합니다. 그러나 리액트 프런트엔드를 위한 보다 전용적인 GraphQL 라이브러리를 찾고 있다면 인기 있는 [Apollo Client](https://www.apollographql.com/docs/react/)나 가벼운 [urql](https://formidable.com/open-source/urql/) 또는 Facebook에서 제공하는 [Relay](https://github.com/facebook/relay) 중 하나를 확인해 보세요.

> 계속 읽기 : [로컬 및 원격 데이터에 대한 리액트 상태에 관한 모든 것](https://www.robinwieruch.de/react-state/)

이미 Redux를 사용 중이고 Redux에서 통합 상태 관리와 함께 데이터 페칭을 추가하려는 경우, TanStack Query를 추가하는 대신 데이터 페칭을 Redux에 깔끔하게 통합하는 [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)를 확인해 볼 수 있습니다.

마지막으로, 프런트엔드와 백엔드(둘 다 타입스크립트)를 제어하는 경우, 엔드투엔드 타입 안전한 API를 위해 [tRPC](https://trpc.io/)를 확인해 보세요. 저는 지난 1년 동안 이 도구를 사용해 왔는데 생산성 향상과 DX에 엄청난 도움이 되었습니다. TanStack Query와 결합하여 데이터 페칭과 관련된 모든 기능을 사용할 수 있으며, 동시에 타입이 지정된 함수를 사용하여 프런트엔드에서 백엔드를 호출할 수 있습니다.

> 계속 읽기 : [E2E 타입 안전성을 갖춘 첫 번째 tRPC 애플리케이션 만들기](https://www.robinwieruch.de/react-trpc/)

### 추천

- TanStack Query(REST API 또는 GraphQL API)
  - axios 또는 [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)와 결합
- Apollo Client(GraphQL API)
- 긴밀하게 결합된 클라이언트-서버 아키텍처를 위한 tRPC
- 선택적 학습 경험: [TanStack Query의 작동 방식 알아보기](https://www.robinwieruch.de/react-hooks-fetch-data/)

## 리액트 라우터를 통한 라우팅

Next.js와 같은 리액트 프레임워크는 이미 라우팅이 처리되어 있습니다. 그러나 프레임워크 없이 클라이언트 측 렌더링에만 리액트를 사용하는 경우(예: SSR이 없는 Vite), 가장 강력하고 인기 있는 라우팅 라이브러리는 [React Router](https://reactrouter.com/en/main)입니다. 완전한 타입스크립트 지원을 염두에 둔 새로운 대안으로 [TanStack Router](https://tanstack.com/router/v1)가 있습니다.

> 계속 읽기 : [React Router 사용법 알아보기](https://www.robinwieruch.de/react-router/)

리액트 라우터와 함께 리액트에서 클라이언트 측 라우팅을 사용하는 경우, 라우트 수준에서 코드 분할을 도입하는 것은 그리 어려운 일이 아닙니다. 이런 종류의 최적화를 도입하는 경우, `React.lazy()`를 `@loadable/component`로 대체할 수 있습니다.

> 계속 읽기 : [React Router로 지연 로딩 배우기](https://www.robinwieruch.de/react-router-lazy-loading/)

리액트 프로젝트에 라우터를 도입하기 전에, 이제 막 리액트를 배우기 시작했을 때, [리액트의 조건부 렌더링](https://www.robinwieruch.de/conditional-rendering-react/)을 먼저 사용해 볼 수 있습니다. 라우팅을 대체하는 것은 아니지만, 페이지 수준에서 컴포넌트를 교체하는 것이 어떻게 작동하는지 엿볼 수 있습니다.

### 추천

- 가장 인기 있는 라이브러리는 React Router
- 요즘 떠오르는 것은 TanStack Router
  - 주로 최고 수준의 TS 지원 때문입니다.

## 리액트 CSS 스타일링

리액트의 스타일링/CSS에 대한 많은 옵션과 훨씬 더 많은 의견이 있기 때문에 여기 한 섹션에 모든 것을 담는 것만으로는 충분하지 않습니다. 이 주제에 대해 더 자세히 알아보고 모든 옵션에 대해 알고 싶다면 다음 가이드를 확인하세요.

> 계속 읽기 : [리액트 CSS 스타일링(종합 튜토리얼)](https://www.robinwieruch.de/react-css-styling/)

리액트 초보자는 JSX에서 스타일 객체를 사용하여 인라인 스타일과 기본 CSS로 시작해도 괜찮습니다. 하지만 실제 애플리케이션에는 거의 사용하지 않는것이 좋습니다.

```jsx
const Headline = ({ title }) => <h1 style={{ color: 'blue' }}>{title}</h1>;
```

인라인 스타일은 리액트의 JSX에서 자바스크립트로 스타일을 동적으로 추가하는 데 사용할 수 있지만, 외부 CSS 파일은 리액트 애플리케이션의 나머지 스타일을 모두 담을 수 있습니다.

```jsx
import './Headline.css';

const Headline = ({ title }) => (
  <h1 className="headline" style={{ color: 'blue' }}>
    {title}
  </h1>
);
```

애플리케이션의 크기가 커지면 다른 스타일링 방법을 확인할 수 있습니다.

먼저, 여러 _CSS-in-CSS_ 솔루션 중 하나인 CSS Module을 살펴볼 것을 권장합니다. CSS Module을 사용하면 CSS를 컴포넌트와 함께 배치된 모듈로 캡슐화할 수 있습니다. 이는 스타일이 다른 컴포넌트로 실수로 유출되는 것을 방지합니다.

```jsx
import styles from './style.module.css';

const Headline = ({ title }) => <h1 className={styles.headline}>{title}</h1>;
```

두 번째로, 리액트를 위한 많은 _CSS-in-JS_ 솔루션 중 하나인 Styled Components를 소개하고자 합니다(더 이상 권장하지 않습니다). 이 접근 방식은 [Styled-Components](https://www.robinwieruch.de/react-styled-components/)(또는 [emotion](https://emotion.sh/docs/introduction)과 같은 대안)라는 라이브러리를 통해 제공되는데, 이 라이브러리는 자바스크립트로 생성된 스타일링을 같은 파일의 리액트 컴포넌트 옆 또는 같은 위치에 있는 파일에 배치합니다.

```jsx
import styled from 'styled-components';

const BlueHeadline = styled.h1`
  color: blue;
`;

const Headline = ({ title }) => <BlueHeadline>{title}</BlueHeadline>;
```

> 계속 읽기 : [Styled Components 모범 사례](https://www.robinwieruch.de/styled-components/)

셋째, 가장 인기 있는 _Utility-First-CSS_ 솔루션으로 [Tailwind CSS](https://tailwindcss.com/)를 추천하고 싶습니다. 이 솔루션은 사전 정의된 CSS 클래스와 함께 제공됩니다. 이를 통해 개발자의 효율성을 높이고 리액트 애플리케이션의 디자인 시스템을 간소화할 수 있지만, 모든 클래스를 알아야 하고 많은 CSS 클래스의 장황한 인라이닝이 필요하다는 단점이 있습니다.

```jsx
const Headline = ({ title }) => <h1 className="text-blue-700">{title}</h1>;
```

CSS-in-CSS를 선택할지, Utility-First-CSS를 선택할지는 사용자에게 달려 있습니다. 최근의 추세는 Tailwind CSS를 사용한 Utility-First-CSS입니다. CSS-in-JS 솔루션은 서버 측 환경과 관련된 문제로 인해 더 이상 인기가 없습니다. 마지막으로 한 가지 힌트를 드리자면, 리액트에서 className을 조건부로 적용하려면 [clsx](https://github.com/lukeed/clsx)와 같은 유틸리티 라이브러리를 사용하세요.

### 추천

- Utility-First-CSS (가장 인기 있음)
  - 예: Tailwind CSS
- CSS-in-CSS
  - 예: CSS Modules
- CSS-in-JS(개인적으로는 서버 사이드 환경에서의 성능 및 기타 문제로 인해 런타임 CSS-in-JS를 더 이상 권장하지 않습니다.)
  - 예: Styled Components 또는 Facebook의 [StyleX](https://stylexjs.com/)
- [CSS-in-TS](https://github.com/andreipfeiffer/css-in-js)(타입스크립트 및 서버 사이드 렌더링 지원)

## 리액트 UI 라이브러리

초보자라면 재사용 가능한 컴포넌트를 처음부터 만들어 보는 것은 좋은 학습 경험이 될 것입니다. [드롭다운](https://www.robinwieruch.de/react-dropdown/), [셀렉트](https://www.robinwieruch.de/react-select/), [라디오 버튼](https://www.robinwieruch.de/react-radio-button/), [체크박스](https://www.robinwieruch.de/react-checkbox/)등 무엇이든 언젠가 이러한 UI 컴포넌트를 직접 만드는 방법을 알게 될 것입니다.

하지만 모든 컴포넌트를 직접 만들 리소스가 없다면 동일한 디자인 시스템, 기능 및 접근성 규칙을 공유하는 사전에 구축된 많은 컴포넌트에 접근할 수 있는 UI 라이브러리를 사용하는것이 좋습니다.

- [Material UI(MUI)](https://mui.com/material-ui/)(여전히 프리랜서 프로젝트에서 가장 인기 있음)
- [Mantine UI](https://mantine.dev/) (2022년에 가장 인기 있음)
- [Chakra UI](https://chakra-ui.com/) (2021년에 가장 인기 있음)
- [NextUI](https://nextui.org/) (React Aria 기반)
- [Park UI](https://park-ui.com/) (Ark UI 기반)

하지만 최근의 트렌드는 헤드리스 UI 라이브러리를 선호하는 추세입니다. 헤드리스 라이브러리는 스타일링 없이 제공되지만, 최신 컴포넌트 라이브러리에 필요한 모든 기능과 접근성을 갖추고 있습니다. 대부분 Tailwind와 같은 유틸리티 우선 CSS 솔루션과 함께 사용됩니다.

- [shadcn/ui](https://ui.shadcn.com/) (2023년에 가장 있기 있음)
- [Radix](https://www.radix-ui.com/)
- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [Catalyst](https://tailwindcss.com/blog/introducing-catalyst)
- [Daisy UI](https://daisyui.com/)
- [Headless UI](https://headlessui.com/)
- [Tailwind UI](https://tailwindui.com/) (무료가 아님)
- [Ark UI](https://ark-ui.com/) (Chakra UI의 제작자가 개발함)

다른 UI 라이브러리과 비교했을 때, 인기가 덜 한 것으로 보입니다.

- [Ant Design](https://ant.design/)
- [Semantic UI](https://react.semantic-ui.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Reactstrap](https://reactstrap.github.io/?path=/story/home-installation--page)

이러한 모든 UI 라이브러리에는 자체 컴포넌트가 포함되어 있지만, 각 컴포넌트를 하나의 UI 컴포넌트에 중점을 둔 라이브러리만큼 강력하게 만들 수는 없습니다. 예를 들어, [react-table-library](https://react-table-library.com/)를 사용하면 리액트에서 강력한 테이블 컴포넌트를 만들 수 있는 동시에, 이를 UI 라이브러리와 결합할 수 있는 테마(예: Material UI)도 제공할 수 있습니다.

## 리액트 애니메이션 라이브러리

웹 애플리케이션의 모든 애니메이션은 CSS로 시작합니다. 결국 CSS 애니메이션만으로는 요구 사항을 충족시키기 어렵다는 것을 알게 될 것입니다. 보통 개발자들은 그럴 때 리액트 컴포넌트로 애니메이션을 구현할 수 있는 [React Transition Group](https://reactcommunity.org/react-transition-group/)을 살펴봅니다. 리액트를 위한 다른 잘 알려진 애니메이션 라이브러리는 다음과 같습니다.

- [Framer Motion](https://www.framer.com/motion/) (가장 추천)
- [react-spring](https://github.com/pmndrs/react-spring)
- [react-motion](https://github.com/chenglou/react-motion)
- [react-move](https://github.com/sghall/react-move)

## 리액트 시각화 & 차트 라이브러리

차트를 처음부터 직접 만들고 싶다면 [D3](https://d3js.org/)를 사용하는 것 외에는 방법이 없습니다. 멋진 차트를 만드는 데 필요한 모든 것을 제공하는 저수준 시각화 라이브러리이기 때문입니다. 그러나 D3를 배우는 것은 완전히 다른 모험이기 때문에, 많은 개발자가 유연성 대신 모든 기능을 제공하는 리액트 차트 라이브러리를 선택합니다. 인기 있는 솔루션은 다음과 같습니다.

- [Recharts](https://recharts.org/en-US/) (개인적인 추천)
  - 즉시 사용 가능한 차트
  - 뛰어난 구성
  - 선택적 구성 기능으로 인한 커스터마이징
- [visx](https://github.com/airbnb/visx)
  - 고수준 추상화보다 낮은 수준의 D3에 더 가까움
  - 가파른 학습 곡선
- 즉시 사용 가능한 차트가 더 많지만, 커스터마이징이 더 어려움
  - [Victory](https://formidable.com/open-source/victory/)
  - [nivo](https://nivo.rocks/)
  - [react-chartjs](https://github.com/reactchartjs/react-chartjs-2)

## 리액트 폼 라이브러리

리액트에서 가장 많이 사용되는 폼 라이브러리는 [React Hook Form](https://react-hook-form.com/)입니다. 유효성 검사(가장 많이 사용되는 통합은 [zod](https://github.com/colinhacks/zod)), 양식 제출, 양식 상태 관리 등 필요한 모든 것이 포함되어 있습니다. 대안으로 [Formik](https://github.com/jaredpalmer/formik)과 [React Final Form](https://final-form.org/react)이 있습니다. 리액트 UI 라이브러리를 사용하는 경우 이러한 라이브러리 중 하나와 어떻게 통합되는지 확인해 보세요.

> 계속 읽기 : [리액트에서 폼을 사용하는 방법](https://www.robinwieruch.de/react-form/)

### 추천

- React Hook Form
  - 유효성 검사를 위한 zod 통합

## 리액트 타입 검사

리액트는 [PropTypes](https://legacy.reactjs.org/docs/typechecking-with-proptypes.html)라는 내부 프롭 유효성 검사 기능을 제공합니다. PropTypes를 사용하면 리액트 컴포넌트에 대한 프롭를 정의할 수 있습니다. 잘못된 타입의 프롭이 컴포넌트에 전달될 때마다 오류 메시지가 표시됩니다.

```jsx
import PropTypes from 'prop-types';

const List = ({ list }) => (
  <div>
    {list.map(item => (
      <div key={item.id}>{item.title}</div>
    ))}
  </div>
);

List.propTypes = {
  list: PropTypes.array.isRequired,
};
```

그러나 PropTypes는 더 이상 리액트에 포함되지 않습니다. 저는 사용을 추천하지 않지만, 역사적인 이유로 여전히 여기에 남겨두고 있습니다.

업계 표준은 리액트 애플리케이션에서 타입스크립트를 사용하는 것입니다. 요즘 타입스크립트 없이 새로 시작하는 리액트 프로젝트는 거의 없으므로 여러분도 이에 익숙해져야 합니다.

```tsx
type Item = {
  id: string;
  title: string;
};

type ListProps = {
  list: Item[];
};

const List = ({ list }: ListProps) => (
  <div>
    {list.map(item => (
      <div key={item.id}>{item.title}</div>
    ))}
  </div>
);
```

요즘은 [타입스크립트](https://www.typescriptlang.org/)가 대세입니다. 타입이 지정된 양식 유효성 검사, API 유효성 검사(예: tRPC 사용 시)등을 위해 타입스크립트를 넘어서고 싶다면 [Zod](https://github.com/colinhacks/zod)를 확인해 보세요.

### 추천

- 타입이 지정된 자바스크립트가 필요한 경우, 타입스크립트를 사용합니다.

## 리액트 코드 구조

통일되고 일반적인 코드 스타일을 유지하고 싶다면 리액트 프로젝트에서 [ESLint](https://eslint.org/)를 사용하세요. ESLint와 같은 린터는 특정 코드 스타일을 강제합니다. 예를 들어, 인기 있는 스타일 가이드(예: [에어비앤비 스타일 가이드](https://www.npmjs.com/package/eslint-config-airbnb))를 따르도록 ESLint에서 요구사항으로 설정할 수 있습니다. 또한 [IDE/편집기에 ESLint](https://www.robinwieruch.de/vscode-eslint/)를 통합하면 모든 실수를 표시해 줍니다.

> 계속 읽기 : [리액트 파일/폴더 구조(종합 튜토리얼)](https://www.robinwieruch.de/react-folder-structure/)

통합된 코드 형식을 사용하려면 리액트 프로젝트에서 [Prettier](https://github.com/prettier/prettier)를 사용하세요. 몇 가지 옵션만 설정할 수 있는 독단적인 코드 포맷터입니다. 파일을 저장할 때마다 코드 포맷을 지정하도록 [편집기나 IDE에 통합](https://www.robinwieruch.de/how-to-use-prettier-vscode/)할 수 있습니다. Prettier는 ESLint를 대체하지는 않지만, ESLint와 [잘 통합](https://www.robinwieruch.de/prettier-eslint/)됩니다.

2024년에 떠오르는 스타는 아마도 [Biome](https://biomejs.dev/)(이전의 Rome)이 될 것입니다. ESLint와 Prettier는 설정이나 특히 상호 작용 측면에서 가장 선호되는 도구는 아닙니다. 하지만 모든 웹 개발자의 일상 업무에 반드시 필요합니다. Biome은 빠른(Rust 기반) 올인원 툴체인을 제공함으로써 Prettier와 ESLint의 대안이 되고자 합니다.

### 추천

- ESLint + Prettier
- Biome도 사용해 보세요.

## 리액트 인증

리액트 애플리케이션에서 가입, 로그인, 로그아웃과 같은 기능을 갖춘 인증을 도입하고 싶을 수 있습니다. 비밀번호 재설정 및 비밀번호 변경 기능과 같은 기능도 종종 필요합니다. 이러한 기능들은 리액트를 넘어 백엔드 애플리케이션이 이러한 기능을 관리하기 때문에 중요합니다.

> 계속 읽기 : [React Router로 인증을 준비하는 방법](https://www.robinwieruch.de/react-router-authentication/)

가장 좋은 학습 경험은 인증 기능이 있는 백엔드 애플리케이션(예: [GraphQL 백엔드](https://www.robinwieruch.de/graphql-apollo-server-tutorial/))을 직접 구현하는 것입니다. 그러나 인증에는 많은 보안 위험과 많은 사람이 알지 못하는 세부 사항이 수반되므로, 시중에 나와 있는 많은 인증/백엔드 서비스 솔루션 중 하나를 사용하는것이 좋습니다.

- [Lucia](https://github.com/lucia-auth/lucia)
  - 매우 흥미로운 오픈소스 프로젝트
  - 어떠한 서드파티 서비스에도 독립적이게 만들어줍니다.
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Clerk](https://clerk.com/)
- [AuthKit](https://www.authkit.com/)
- [NextAuth](https://next-auth.js.org/)
- [Firebase Auth](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial/)
- [Auth0](https://auth0.com/)
- [AWS Cognito](https://aws.amazon.com/ko/cognito/)

## 리액트 백엔드

리액트를 서버로 이동시키는 강력한 추세가 있기 때문에 리액트 프로젝트의 가장 자연스러운 환경은 Next.js, Astro 또는 Remix와 같은 메타 프레임워크일 것입니다.

만약 다양한 이유로 JS/TS는 사용할 수 있지만 풀스택 프레임워크를 사용할 수 없다면, [tRPC](https://trpc.io/) 또는 [Hono](https://hono.dev/)를 확인해 보셔야 합니다. 구식이지만 여전히 인기 있는 [Express](https://expressjs.com/)를 기반으로 하는 Node 백엔드도 언급할 만합니다. 다른 대안으로는 [Fastify](https://fastify.dev/)나 [Nest](https://nestjs.com/)가 있습니다.

## 리액트 데이터베이스

리액트와 직접적으로 관련이 있는 것은 아니지만, 요즘 풀스택 리액트 애플리케이션이 인기를 얻고 있기 때문에 리액트는 그 어느 때보다 데이터베이스 계층과 가까워졌습니다. Next.js 애플리케이션을 개발하는 동안, 대부분 데이터베이스 ORM을 다루게 될 가능성이 높습니다. 요즘 가장 인기 있는 ORM은 [Prisma](https://www.prisma.io/)입니다. 최근 유행하는 대안은 [Drizzle ORM](https://orm.drizzle.team/)입니다. 더 많은 대안으로는 [Kysely](https://kysely.dev/)와 [database-js](https://github.com/planetscale/database-js)(PlanetScale에만 해당)가 있습니다.

데이터베이스 선택에 있어서는 Supabase(또는 Firebase)가 유효한 데이터베이스 제공업체입니다. PostgreSQL을 사용하는 Supabase는 자체 호스팅하거나 유료 서비스로 사용할 수 있습니다. 서버리스 데이터베이스를 제공하는 인기 있는 대안으로는 [PlanetScale](https://planetscale.com/)(개인적 추천), [Neon](https://neon.tech/), [Xata](https://xata.io/)가 있습니다.

> 계속 읽기 : [웹 개발 트렌드](https://www.robinwieruch.de/web-development-trends/)

## 리액트 호스팅

리액트 애플리케이션을 다른 웹 애플리케이션처럼 배포하고 호스팅할 수 있습니다. 완전한 제어를 원한다면 [Digital Ocean](https://m.do.co/c/fb27c90322f3)과 같은 것을 선택할 수 있습니다. 누군가 대신 모든 것을 처리해주길 원한다면 [Netlify](https://www.netlify.com/)나 [Vercel](https://vercel.com/ykss-projects) (특히 Next.js의 경우)이 인기 있는 솔루션입니다.

이미 Firebase/Supabase와 같은 서드파티 백엔드 서비스를 사용하고 있다면, 해당 서비스가 호스팅도 제공하는지 확인해 볼 수 있습니다. 다른 인기 있는 호스팅 제공자로는 [Render](https://render.com/), [Fly.io](https://fly.io/), [Railway](https://railway.app/), 또는 더 직접적인 AWS/Azure/Google Cloud/Hetzner 등이 있습니다.

## 리액트 테스팅

만약 리액트에서의 테스트에 대해 깊게 알고 싶다면 ["리액트에서 컴포넌트를 테스트하는 방법"](https://www.robinwieruch.de/react-testing-tutorial/)을 읽어보세요. 핵심은 리액트 애플리케이션을 테스트하는 근간은 [Jest](https://github.com/jestjs/jest)와 같은 테스트 프레임워크입니다. Jest는 테스트 러너, 어설션 라이브러리, 스파이, 모킹, 스텁 기능 등을 제공합니다. 포괄적인 테스트 프레임워크에서 필요한 모든 것을 제공합니다. 만약 Vite의 팬이라면 Jest 대안으로 [Vitest](https://vitest.dev/)를 확인해 보세요.

최소한으로, [react-test-renderer](https://www.npmjs.com/package/react-test-renderer)를 사용하여 테스트 프레임워크에서 리액트 컴포넌트를 렌더링 할 수 있습니다. 이것만으로도 Vitest 또는 [Jest와 함께 스냅샷 테스트](https://www.robinwieruch.de/react-testing-jest/)를 수행하기에 충분합니다. 스냅샷 테스트는 다음과 같은 방식으로 동작합니다. 테스트를 실행하면 리액트 컴포넌트의 렌더링된 DOM 요소에 대한 스냅샷이 생성됩니다. 특정 시점에서 다시 테스트를 실행하면 이전 스냅샷과의 차이점으로 사용되는 또 다른 스냅샷이 생성됩니다. 차이가 있으면 테스트 프레임워크에서 오류가 발생하며 스냅샷을 수용하거나 컴포넌트를 조정해야 합니다.

결국에는 [React Testing Library (RTL)](https://www.robinwieruch.de/react-testing-library/)를 사용하게 될 것입니다. 이는 테스트 프레임워크 환경 내에서 널리 사용되며, 리액트를 위한 포괄적인 테스팅 라이브러리입니다. RTL을 사용하면 컴포넌트를 렌더링하고 HTML 요소에서 이벤트를 시뮬레이션할 수 있습니다. 그 후에는 어설션을 위해 테스트 프레임워크가 사용됩니다.

리액트 E2E 테스트를 위한 도구를 찾고 있다면, [Playwright](https://playwright.dev/)와 [Cypress](https://www.robinwieruch.de/react-testing-cypress/)가 가장 인기 있는 선택지입니다.

### 추천

- 단위/통합: Vitest + React Testing Library(가장 인기 있음)
- 스냅샷 테스트: Vitest
- E2E 테스트: Playwright 또는 Cypress

## 리액트 불변 데이터 구조

바닐라 자바스크립트는 데이터 구조를 불변인 것처럼 처리할 수 있는 다양한 내장 도구를 제공합니다. 하지만 불변의 데이터 구조를 강제해야 할 필요성을 느낀다면, 가장 많이 사용되는 도구는 [Immer](https://github.com/immerjs/immer)입니다.

## 리액트 국제화

[리액트 애플리케이션의 국제화(i18n)](https://www.robinwieruch.de/react-internationalization/)에 대해 생각할 때, 번역뿐만 아니라 복수화, 날짜 및 통화 형식, 그리고 기타 여러 사항들도 고려해야 합니다. 이를 다루기 위한 가장 인기 있는 라이브러리들은 다음과 같습니다.

- [FormatJS](https://github.com/formatjs/formatjs)
- [react-i18next](https://github.com/i18next/react-i18next)
- [Lingui](https://lingui.dev/)

## 리액트 리치 텍스트 편집기

리액트의 리치 텍스트 편집기에 관해서는 아래 후보만 떠올릴 수 있습니다.

- [Plate](https://platejs.org/)
- [Lexical](https://github.com/facebook/lexical)
- [Slate.js](https://www.slatejs.org/examples/richtext)

## 리액트 결제

가장 일반적인 결제 공급자는 Stripe와 PayPal입니다. 둘 다 리액트에 손쉽게 통합될 수 있습니다. 다음은 [작동하는 Stripe Checkout과 리액트 통합 예제](https://github.com/rwieruch/react-express-stripe)입니다.

- [PayPal](https://developer.paypal.com/docs/checkout/)
- Stripe
  - [React Stripe Elements](https://github.com/stripe/react-stripe-js)
  - [Stripe Checkout](https://stripe.com/docs/payments/checkout)

## 리액트 시간

리액트 애플리케이션이 날짜, 시간 및 시간대를 많이 다루는 경우, 이러한 요소들을 관리해 주는 라이브러리를 도입할 수 있습니다. 여기 몇 가지 옵션들입니다.

- [date-fns](https://github.com/date-fns/date-fns)
- [Day.js](https://github.com/iamkun/dayjs)
- [Luxon](https://github.com/moment/luxon/)

## 리액트 데스크톱 애플리케이션

[Electron](https://www.electronjs.org/)과 [Tauri](https://github.com/tauri-apps/tauri)는 크로스 플랫폼 데스크톱 애플리케이션을 개발하기 위한 주요 프레임워크입니다.

## 리액트 파일 업로드

- [react-dropzone](https://react-dropzone.js.org/)

## 리액트 메일

- [react-email](https://react.email/) (개인적인 추천)
- [Mailing](https://www.mailing.run/)
- [mjml](https://mjml.io/)

## 드래그 앤 드롭

개인적으로 [react-beautiful-dnd의 후속 버전](https://github.com/hello-pangea/dnd)을 사용해 봤는데, 정말 좋았습니다. 훨씬 많은 유연성과 옵션을 제공하지만 학습 곡선이 다소 가파른 비용이 있는 인기 있는 대안으로는 [dnd kit](https://dndkit.com/)이 있습니다. 이 분야의 또 다른 대안으로는 [react-dnd](https://github.com/react-dnd/react-dnd)가 있습니다.

## 리액트 모바일 개발

리액트를 웹에서 모바일로 가져오는 가장 일반적인 해결책은 여전히 [React Native](https://reactnative.dev/)입니다. React Native 애플리케이션을 만들기 위한 가장 인기 있는 프레임워크는 [Expo](https://www.robinwieruch.de/react-native-expo/)입니다. 웹과 모바일에서 통일된 컴포넌트가 필요하다면 [Tamagui](https://tamagui.dev/)를 확인해보는 것이 좋습니다.

> 계속 읽기 : [React Native에서 탐색 배우기](https://www.robinwieruch.de/react-native-navigation/)

## 리액트 VR/AR

리액트를 사용하여 가상 현실(VR)이나 증강 현실(AR)로 뛰어들 수 있습니다. 솔직히 말해서, 이러한 라이브러리 중 어느 것도 사용한 적은 없고 대부분이 초기 단계(실험적)에 있지만 AR/VR에서 리액트를 다룰 때 제가 알고 있는 몇 가지 라이브러리는 다음과 같습니다.

- [react-three-fiber](https://github.com/pmndrs/react-three-fiber) (인기 있는 3D 라이브러리이지만, VR 사례도 보았습니다.)
- [react-360](https://facebook.github.io/react-360/)
- [aframe-react](https://github.com/supermedium/aframe-react)

## 리액트 디자인 프로토타이핑

UI/UX 배경을 가지고 있다면, 새로운 리액트 컴포넌트, 레이아웃 또는 UI/UX 개념을 빠르게 프로토타이핑할 수 있는 도구를 사용하고 싶을 것입니다. 개인적으로는 [Figma](https://www.figma.com/)를 사용합니다. 대략적이고 가벼운 스케치에는 [Excalidraw](https://excalidraw.com/)를 선호하며, 어떤 사람들은 [tldraw](https://www.tldraw.com/)를 선호하기도 합니다.

## 리액트 컴포넌트 문서화

컴포넌트에 대한 문서 작성을 담당하는 경우, 다양하고 깔끔한 리액트 문서화 도구가 있습니다. 저는 많은 프로젝트에서 [Storybook](https://storybook.js.org/)을 사용해 왔고, 이에 대해 중립적인 의견을 가지고 있습니다. 다른 솔루션에 대해서도 좋은 얘기를 들었습니다.

- [Docusaurus](https://github.com/facebook/docusaurus)
- [Docz](https://github.com/doczjs/docz)
- [Styleguidist](https://github.com/styleguidist/react-styleguidist)
- [React Cosmos](https://reactcosmos.org/)

결국 리액트 생태계는 리액트를 위한 프레임워크로 볼 수 있지만, 그 핵심은 리액트를 통해 유연성을 유지합니다. 이는 어떤 라이브러리를 선택할 것인지에 대해 충분한 정보를 바탕으로 스스로 결정할 수 있는 유연한 프레임워크라는 것을 의미합니다. 소규모로 시작하여 특정 문제를 해결하기 위한 라이브러리만 추가할 수 있습니다. 반대로 리액트만으로 충분한 경우, 다른 라이브러리 없이 사용하여 가볍게 유지할 수 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해 주세요!
