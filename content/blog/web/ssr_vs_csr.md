---
title: 'SSR vs CSR, SPA vs MPA'
date: 2021-2-2 15:40:00
category: 'Web'
draft: false
---

최근 리액트를 공부하면서 `SPA`에 대해서 공부하게 되면서 자연스럽게, 서버 사이드 렌더링과 클라이언트 사이드 렌더링 등 개념에 대해서 확실히 알고 넘어가야겠다는 생각이 들었다. 그래서 보통 이런 개념을 쌓을 때는 서로 비교하면서 공부하는 것이 효율적이기 때문에 SSR과 CSR의 특징을 서로 비교하면서 알아보려고 한다.

## 1. SSR(Server-Side Rendering)이란?

SSR은 서버 사이드 렌더링을 말한다. 쉽게 말해서 서버에서 사용자에게 보여줄 페이지들을 모두 구성해서 보여주는 방식이다. SSR을 사용했을 때, 모든 데이터가 준비되어 연결된 서비스 페이지를 클라이언트에게 바로 보여준다. 그렇기 때문에 서버에서 해야할 일들이 굉장히 많아지고, 자연스럽게 CSR에 비해서 페이지를 구성하는 속도는 상대적으로 늦다. 하지만 사용자에게 완결된 콘텐츠를 보여주는 관점으로 볼 때는 오히려 CSR보다 빠르다고 할 수 있다. 거기에 SEO(Search Engine Optimization)에도 CSR보다는 SSR이 더 효율적이다.

![SSR](https://d2.naver.com/content/images/2020/06/ssr.png)

### 1-1. SSR의 장점

- SSR을 사용하면 프론트엔트와 백엔드를 완전히 분리해서 생산성을 높일 수 있다. SSR을 구축하면 페이지가 온전히 프론트엔드 부분에 존재하므로 불필요한 커뮤니케이션이 줄어 든다. 백엔드에서는 API 개발과 데이터 활용에 집중 할 수 있다.
- 처음에는 해당하는 페이지만 받아오면 되기때문에 초기 로딩 속도가 빠를 수 있다.
- JS파일을 불러오고 렌더링 작업이 완료되지 않아도 사용자가 콘텐츠를 이용할 수 있다.

### 1-2. SSR의 단점

- 서버 인프라 구축/운영이 필요하다. 요즘은 가상화가 있어서 상대적으로 부담이 적어졌다.
- 매번 페이지를 이동할 때마다 새로고침되어 사용자 UX가 상대적으로 떨어질 수 있다.

## 2. CSR(Client-Side Rendering)이란?

CSR은 클라이언트 사이드 렌더링으로 서버에서 하는 일을 조금 줄여서 클라이언트 사이드(브라우저)에서도 처리하는 방식이다. 그렇기 때문에 CSR은 SSR에 비해서 초기 페이지의 속도는 빠르다. 하지만 서비스에서 필요한 데이터를 계속해서 추가로 요청하고 재구성 하는 방식이기 때문에, 페이지 완료시점으로 볼 때는 SSR보다 느리다.

![CSR](https://d2.naver.com/content/images/2020/06/csr.png)

### 2-1. CSR의 장점

- 초기 로딩 후 클라이언트 단에서 렌더링을 하기때문에 빠르다.
- 서버에 요청하는 횟수가 적기 떄문에 서버 부담이 덜하다.
- 필요한 부분만 다시 읽어들이기 때문에 빠른 상호작용이 가능하다.

### 2-2. CSR의 단점

- 페이지 로드 이후 동적으로 콘텐츠를 생성해서 콘텐츠를 빠르게 소비하는 사용자의 요구 사항을 충족시키기 어렵다.
- SSR에 비해서 SEO(Search Engine Optimization)이 효율적이지 않다.
- HTML과 Static 파일들이 로드될 때까지 기다려야 한다. 브라우저에서 렌더링해야 해서 초기 구동 속도가 상대적으로 느리다.
- SSR에서는 서버측에서 세션으로 사용자 정보를 관리하는데 반해, CSR에서는 쿠키 말고는 사용자 정보를 저장할 공간이 없다.

## 3. SPA(Single Page Application) vs MPA(Multi Page Application)

SPA는 한 개의 페이지로 이루어진 단일 페이지 애플리케이션으로, 현재의 페이지를 동적으로 작성함으로써 새로운 페이지를 받아오지 않고 사용자와 소통하는 웹 애플리케이션이다. 연속되는 페이지 간의 사용자 경험을 향상시키고, 웹 애플리케이션이 데스크톱 애플리케이션처럼 동작하도록 도와준다. SPA의 세부적인 특징은 다음과 같다.

- 사용자와 소통에 따라 동적으로 작성되며 사용자에게 친화적이다.
- 이전에 서버에서만 이루어졌던 부분을 프론트엔드와 백엔드로 분리함으로써 효율적인 개발이 가능하다.
- 가상 DOM을 이용한다.
- 초기 렌더링 후, 데이터만 필요할 떄 요청하여 상대적으로 서버 요청 빈도가 적다.

![SPA](https://d2.naver.com/content/images/2020/06/step1.png)
위와 같이 이렇게 프론트와 백을 분리 시킬 수 있다.

MPA는 여러 페이지로 이루어진 어플리케이션이다. 서버로 부터 완전한 페이지를 받아오고, 이후에 데이터가 추가되거나 변경되거나 할 때는 다른 완전한 페이지로 이동한다. MPA는 일반적으로 SSR에 가깝다고 할 수 있다.

## 4. SPA == CSR ?

쉽게 말하면, 둘은 같다고 비교하기에 적합한 대상은 아니다. SPA와 MPA, CSR과 SSR같은 경우는 비교대상으로, 페이지를 여러개 쓰는지 하나만 쓰는지와 렌더링을 클라이언트에서 하는지 서버에서 하는지로 나뉘어 비교될 수 있지만 SPA와 CSR은 적절한 비교 대상은 아니다. SPA는 단일 페이지에서 렌더링을 바꿔가며 하기 위해 CSR방식을 사용한 것이고, MPA에서는 동적이지 않은 페이지를 상황에 맞게 클라이언트에 제공하기 위해서 SSR방식을 택한 것이다.

SPA라고 해서 무조건 CSR만 적용하는 것은 아니고 SSR을 적용하기도 하는 경우가 있다. 특히 SEO(Search Engine Optimization)의 경우 SSR이 뛰어나기 때문에 사용하기도 한다. SPA에 SSR을 쉽게 적용하기 위해서 최근에는 서버 사이드렌더링을 제공하는 `Next.js`와 같은 것을 이용하기도 한다. 다음에는 `Next.js`에 대해서도 공부하여 포스트해볼 것이다.

---

> 참고 글

1. [SPA 그리고 SSR과 CSR](https://velog.io/@ru_bryunak/SPA-%EC%82%AC%EC%9A%A9%EC%97%90%EC%84%9C%EC%9D%98-SSR%EA%B3%BC-CSR)
2. [어서 와, SSR은 처음이지?](https://d2.naver.com/helloworld/7804182)
3. [CSR, SSR, SPA, MPA?](https://medium.com/%EC%95%84%EB%AA%BD%EC%86%8C%ED%94%84%ED%8A%B8%EC%9B%A8%EC%96%B4/csr-ssr-spa-mpa-ede7b55c5f6f)