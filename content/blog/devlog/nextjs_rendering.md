---
title: 'Next.js의 렌더링 방식 이해하기'
date: 2025-02-15 01:00:00
category: 'DevLog'
draft: false
---

Next.js 15에서는 Partial Prerendering을 지원하기 시작하면서, 제대로 사용하기 위해서는 렌더링 방식에 대한 이해가 더욱 중요해졌다. 어렴풋이는 알지만 헷갈리는 개념들이 있었는데, 이 글을 통해 Next.js가 어떻게 렌더링 방식을 구분하고 처리하는지 정리해보려고 한다.

## 1. Next.js의 렌더링 패턴 이해하기

Next.js는 상황에 따라 선택할 수 있는 다양한 렌더링 패턴을 제공한다. 각 패턴은 고유한 장점이 있으며, 적절한 상황에 맞게 선택하여 사용할 수 있다.

### 1.1 SSG (Static Site Generation)

빌드 시점에 HTML을 생성하는 방식으로, 모든 사용자에게 동일한 콘텐츠를 제공하는 정적 콘텐츠를 제공할 때 적합하다. `generateStaticParams`를 빌드 시점에 사용하여 정적 파라미터를 생성할 수 있다.

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }) {
  const post = await getPost(params.slug);
  return <BlogPost post={post} />;
}
```

**장점:**

- 빠른 페이지 로드
- 빌드 타임에 생성하여 런타임 서버 부하 최소화
- CDN 캐싱 용이

**적합한 사례:**

- 블로그 포스트
- 문서 페이지
- 제품 카탈로그

### 1.2 ISR (Incremental Static Regeneration)

정적 페이지를 주기적으로 재생성하는 방식으로, 데이터가 가끔 업데이트되는 경우에 적합하다. `revalidate` 옵션을 사용하여 주기적으로 재생성할 수 있다. 갱신은 특정 시간별로 갱신할 수도 있고, 태그 기반으로 갱신할 수도 있다.

```tsx
// app/products/[id]/page.tsx
export default async function Page({ params }) {
  const product = await fetch(`/api/products/${params.id}`, {
    next: {
      revalidate: 3600, // 1시간마다 재생성
      tags: ['product'], // 태그 기반 재검증 지원
      prefetch: true, // 프리페치 설정
    },
  });
  return <ProductPage product={product} />;
}

// 또는 아래와 같이 선언하여 재검증 주기를 선언할 수 있다.
export const revalidate = 60;
```

**장점:**

- SSG의 성능 이점 유지
- 주기적인 데이터 업데이트

**적합한 사례:**

- e커머스 제품 페이지
- 주기적으로 업데이트되는 블로그
- 실시간성이 크게 중요하지 않은 데이터 목록
- 자주 변경되지 않는 API 데이터를 보여주는 페이지

### 1.3 SSR (Server-Side Rendering)

요청마다 서버에서 페이지를 새로 생성하는 방식이다. 정적인 내용이라도 매 요청마다 서버에서 다시 렌더링한다는 점이 중요한 특징이다. 각 요청마다 서버에서 리액트 컴포넌트를 실행하고 HTML을 생성하여 클라이언트로 전송한다. 사용자는 자바스크립트가 완전히 로드되기 전에도 서버에서 생성된 HTML 콘텐츠를 볼 수 있지만, 이 시점에서는 버튼 클릭과 같은 상호작용은 불가능하다. 자바스크립트 번들이 로드되고 하이드레이션(hydration) 과정이 완료되면 페이지가 완전히 상호작용 가능한 상태가 된다. SEO에 유리하고 항상 최신 데이터를 보여줄 수 있다는 장점이 있다. 서버 컴포넌트에서 직접 데이터를 페칭하거나 `noStore()` 옵션을 사용하여 동적 렌더링을 구현할 수 있다.

```tsx
// app/dashboard/page.tsx
import { noStore } from 'next/cache';

export default async function Page() {
  noStore(); // 캐싱 비활성화
  const data = await fetch('/api/stats', {
    cache: 'no-store',
    next: { tags: ['dynamic-data'] },
  });
  return <Dashboard data={data} />;
}
```

**장점:**

- 항상 최신 데이터 제공
- 사용자별 맞춤 콘텐츠
- SEO 지원
- 초기 렌더링된 컨텐츠 빠른 표시 (FCP 개선)
- 자바스크립트 비활성화 환경에서도 기본 컨텐츠 표시 가능
- 보안에 민감한 로직을 서버에서 처리 가능

**적합한 사례:**

- 실시간 데이터 대시보드
- 개인화된 피드나 타임라인
- 실시간 검색 결과
- 쇼핑몰 장바구니

### 1.4 CSR (Client-Side Rendering)

초기에 빈 HTML을 받아 브라우저에서 자바스크립트로 페이지를 렌더링하는 방식이다. 초기 로딩은 느리지만, 이후 페이지 전환이나 상호작용이 매우 빠르다. 서버 부하가 적고 클라이언트에서 풍부한 상호작용을 구현할 수 있다.

```tsx
'use client';

import { useState, useEffect } from 'react';

export function RealTimeChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://api.example.com');
    ws.onmessage = event => setData(JSON.parse(event.data));
    return () => ws.close();
  }, []);

  return data ? <Chart data={data} /> : <Loading />;
}
```

**장점:**

- 풍부한 클라이언트 상호작용 가능
- 실시간 데이터 업데이트 용이
- 서버 요청 감소 (초기 로드 이후)
- SPA 방식의 부드러운 페이지 전환
- 앱과 같은 사용자 경험
- 서버 로직 의존도 감소

**단점:**

- 초기 로딩 시간이 김
- SEO에 불리
- 자바스크립트 필수
- 빈 HTML로 인한 초기 화면 깜빡임

**적합한 사례:**

- 복잡한 인터랙션이 필요한 관리자 대시보드
- 실시간 채팅
- 데이터 시각화/차트
- 드래그 앤 드롭 인터페이스
- 실시간 협업 도구

## 2. Next.js 15의 새로운 렌더링 기능

### 2.1 Partial Prerendering

Next.js 14에서 실험적으로 도입된 Partial Prerendering은 페이지의 일부를 정적으로 생성하고 나머지를 동적으로 렌더링할 수 있게 한다. 예를 들어 쇼핑몰 페이지에서 정적 콘텐츠(레이아웃, 헤더, 푸터 등)는 빌드 시점에 생성되어 CDN에 캐시되고, 동적 콘텐츠(사용자별 추천 상품, 장바구니 정보 등)의 경우는 fallback 컴포넌트를 보여주다가 병렬로 로드하며 스트리밍한다. 즉, 빌드 시점에 Suspense 경계를 기준으로 정적인 부분과 동적인 부분을 자동으로 구분하여 처리한다. 이는 페이지 로드 속도를 향상시키고 사용자 경험을 개선하는 데 도움이 된다.

먼저 Partial Prerendering을 사용하기 위해서는 next.config.js에서 아래와 같이 설정해야 한다.

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental',
  },
}

export default nextConfig
```

그리고 아래와 같이 동적인 부분을 Suspense로 감싸서 구분할 수 있도록 한다.

```tsx
// app/products/page.tsx
import { Suspense } from 'react';
import { ProductList, ProductSkeleton } from './components';

export default function Page() {
  return (
    <>
      {/* 정적 셸 - 빌드 시 생성 */}
      <h1>제품 목록</h1>
      <div className="layout">
        {/* 동적 콘텐츠 - 병렬로 로드 */}
        <Suspense fallback={<ProductSkeleton />}>
          <ProductList />
        </Suspense>
        <Suspense fallback={<ProductSkeleton />}>
          <RecommendedProducts />
        </Suspense>
      </div>
    </>
  );
}
```

특징:

- 개발자가 Suspense를 사용하여 동적인 영역 구분
- 동적 콘텐츠 스트리밍
- 라우트 핸들러에서도 지원
- 실험적 기능으로 명시적 활성화 필요

### 2.2 스트리밍과 서스펜스

위에서 언급한 Partial Prerendering을 사용하기 위해서는 React Suspense를 활용한 스트리밍이 필요하다. 이는 큰 페이지를 작은 청크로 나누어 점진적으로 로드할 수 있게 한다. 이는 초기 페이지 로드 시간을 크게 단축하고, 사용자 경험을 개선한다.

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { Loading } from './loading';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Suspense fallback={<Loading />}>
        <UserProfile />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}
```

각 컴포넌트는 독립적으로 로드되며, 준비되는 대로 화면에 표시된다. 이는 특히 데이터 페칭이 필요한 컴포넌트에서 유용하다.

## 3. 렌더링 제어와 구성

### 3.1 데이터 패칭과 렌더링 동작

Next.js는 다음과 같은 경우에 자동으로 라우트를 동적 렌더링으로 처리하여, 매 요청마다 새로운 페이지를 생성한다.

1. **동적 함수 사용시**

   - `cookies()`, `headers()`, `searchParams` 등의 동적 함수 사용
   - `useSearchParams()`, `usePathname()` 등의 클라이언트 훅 사용

2. **데이터 페칭 시 동적 렌더링이 필요한 경우**

Next.js가 자동으로 해당 라우트를 동적 렌더링으로 처리하여, 매 요청마다 새로운 페이지를 생성한다.

```tsx
// 동적 데이터
fetch('https://api.example.com/data', { cache: 'no-store' });

// 동적 데이터 (매 요청마다 재검증)
fetch('https://api.example.com/data', { next: { revalidate: 0 } });
```

반면, 다음의 경우에는 정적 렌더링(SSG)으로 처리된다.

1. **빌드 타임 데이터 페칭**

```tsx
// 기본값 - 정적 렌더링
fetch('https://api.example.com/data');

// ISR - 지정된 시간마다 재검증
fetch('https://api.example.com/data', { next: { revalidate: 3600 } });

// On-demand Revalidation (태그 및 경로 기반 재검증)
revalidateTag('product');
revalidatePath('/products');
```

### 3.2 라우트 구성

라우트 세그먼트 단위로 렌더링 동작을 제어할 수 있다.

```tsx
// app/[dynamic]/layout.tsx
export const dynamic = 'force-dynamic'; // 항상 동적 렌더링
export const revalidate = 60; // 60초마다 재검증
export const fetchCache = 'force-cache'; // 강제 캐싱

export default function Layout({ children }) {
  return <div>{children}</div>;
}

// app/api/submit/route.ts (POST 메서드의 경우 동적 API 요청)
export async function POST(request: Request) {
  const data = await request.json();
  const res = await fetch('https://api.example.com/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return Response.json(await res.json());
}
```

## 결론

Next.js 15의 렌더링 시스템은 Partial Prerendering을 통해 더욱 강력해졌고, 다양한 렌더링 방식을 제공하고 있다. 하지만 어떤 렌더링 방식이 항상 최선이 될 수는 없다. 그렇기 때문에 각 상황과 목적에 맞추어 적절한 렌더링 방식을 선택하는 것이 가장 중요하다.

성능 최적화를 위해서는 가능한 한 많은 콘텐츠를 정적으로 생성하고, 동적 콘텐츠는 적절한 단위로 분할하여 스트리밍하는 것이 좋다. 또한 데이터 요청의 캐싱 전략을 신중히 선택하고, 컴포넌트 레벨에서의 최적화도 고려해야 한다. Next.js의 다양한 렌더링 패턴을 이해하고 적절히 활용한다면, 성능과 사용자 경험 모두를 만족시키는 웹 애플리케이션을 구축할 수 있을 것이다.

---

> 피드백은 언제나 환영합니다! 혹시 이 글에 제가 잘못 이해한 부분이 있다면 댓글로 남겨주시면 확인 후 수정토록 하겠습니다!
