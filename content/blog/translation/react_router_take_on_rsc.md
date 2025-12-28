---
title: '(번역) 리액트 라우터의 리액트 서버 컴포넌트 접근 방식'
date: 2025-12-30 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [React Router's take on React Server Components](https://www.epicreact.dev/react-routers-take-on-react-server-components-4bj7q)

리액트 라우터(React Router)가 리액트 서버 컴포넌트 지원을 추가하고 있다는 사실을 알고 계셨나요? 아직은 실험적인 단계이지만, 곧 출시될 예정이며, 저는 리액트 라우터의 RSC 접근 방식이 정말 훌륭하다고 생각합니다. 여기서 알아두셔야 할 내용을 정리해 드리겠습니다.

## 리액트 서버 컴포넌트 활성화하기

첫 번째 단계는 리액트 라우터 앱에서 RSC를 활성화하는 것입니다. 이를 위해 두 개의 플러그인을 설치해야 합니다.

1. `@react-router/dev/vite`에 포함된 리액트 라우터 RSC 플러그인
2. `@vitejs/plugin-rsc`의 RSC 플러그인

아래는 `vite.config.ts`를 업데이트하는 방법입니다.

```tsx
import {
  reactRouter,
  // unstable_reactRouterRSC as reactRouterRSC,
} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
// import rsc from '@vitejs/plugin-rsc'
import { defineConfig } from 'vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    // reactRouter()를 다음으로 교체:
    // reactRouterRSC(),
    // rsc(),
    devtoolsJson(),
  ],
});
```

RSC가 동작하는 데 있어 핵심은 번들러와의 통합에 있습니다. 상당한 작업은 Vite 팀에서 담당하고 있으며, 리액트 라우터 팀 또한 중요한 기여를 하고 있습니다.

RSC를 활성화한 이후에는 루트 레이아웃에서 `Scripts` 컴포넌트를 제거해야 합니다. RSC에서는 해당 스크립트들이 자동으로 RSC 페이로드에 포함되기 때문입니다.

```tsx
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  // 이 Scripts import 제거
  // Scripts,
  ScrollRestoration,
} from 'react-router';

// ... 기타 코드 ...

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        {/* 이 Scripts 요소 제거 */}
        {/* <Scripts /> */}
      </body>
    </html>
  );
}
```

## 로더(loader)에서의 RSC

이제 RSC가 활성화되었으니, 무엇을 할 수 있을까요? 강력한 패턴 중 하나는 로더에서 단순한 데이터가 아니라 UI를 직접 반환하는 것입니다.

아래는 데이터를 반환하는 전통적인 로더 예시입니다.

```tsx
export async function loader() {
  const movies = await getMovies();
  return { movies };
}

export default function MoviesPage({ loaderData }: Route.ComponentProps) {
  const { movies } = loaderData;

  const moviesUI = movies.map(movie => (
    <MovieCard key={movie.id} movie={movie} />
  ));

  return (
    <main>
      {/* ... */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moviesUI}
      </div>
    </main>
  );
}
```

이 접근 방식의 문제는, 렌더링이 끝난 이후에는 더 이상 필요하지 않은 데이터를 클라이언트로 전송하고 있다는 점입니다. 즉, 불필요하게 데이터를 하이드레이션하고 있습니다.

RSC를 사용하면 로더에서 완성된 UI를 반환할 수 있습니다.

```tsx
export async function loader() {
  const movies = await getMovies();

  const moviesUI = movies.map(movie => (
    <MovieCard key={movie.id} movie={movie} />
  ));

  return { moviesUI };
}

export default function MoviesPage({ loaderData }: Route.ComponentProps) {
  const { moviesUI } = loaderData;

  return (
    <main>
      {/* ... */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moviesUI}
      </div>
    </main>
  );
}
```

이제 서버에서 원본 데이터 대신 UI만 바로 전송합니다. 이 방식은 CMS에서 데이터를 가져올 때 특히 유용한데, 데이터를 받아보기 전까지는 어떤 UI를 렌더링해야 할지 알 수 없기 때문입니다. 컴포넌트를 동적으로 로드하면서 로딩 스피너를 보여주거나, 모든 컴포넌트를 미리 다 로드하는 대신, 서버의 로더에서 필요한 UI를 결정하고 그 결과만 전송하면 됩니다. 덕분에 전송되는 데이터 양이 훨씬 줄어듭니다.

## RSC Routes

그런데 만약 전체 페이지가 서버 컴포넌트가 될 수 있다면, 굳이 로더를 사용할 필요가 있을까요? 전체 라우트를 서버 컴포넌트로 만들 수도 있습니다.

```tsx
import { MovieCard } from '#app/movie-card.tsx';
import { getMovies } from '#app/movies-data.ts';

export async function ServerComponent() {
  const movies = await getMovies();

  const moviesUI = movies.map(movie => (
    <MovieCard key={movie.id} movie={movie} />
  ));

  return (
    <main className="bg-background min-h-screen">
      {/* ... */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {moviesUI}
      </div>
    </main>
  );
}
```

여기서 주목하실 점은 default export가 아니라 `ServerComponent` 함수를 export 하고 있다는 것입니다. 이는 로더가 전혀 필요 없다는 뜻이며, 서버 컴포넌트이기 때문에 컴포넌트 내부에서 직접 데이터를 가져올 수 있습니다.

전체 UI는 서버에서 렌더링 되어 클라이언트로 전송되며, 인터랙션이 없기 때문에 하이드레이션도 발생하지 않습니다. 이로 인해 타입도 훨씬 단순해집니다. 로더 데이터 타입이 필요하지 않기 때문입니다.

## 증분 마이그레이션

리액트 라우터의 RSC 구현에서 가장 강력한 점 중 하나는 증분 마이그레이션이 가능하다는 점입니다. 중첩된 라우트가 있는 경우, 자식 경로는 클라이언트 경로일 수 있으며, 그 자식 경로는 서버 경로일 수 있습니다. 이들은 서로를 알 필요가 없습니다.

이는 대규모 애플리케이션에서 서로 다른 팀이 각기 다른 경로를 담당하는 경우, 한 팀이 자신들의 부분만 RSC 경로로 전환하기로 결정해도 나머지 애플리케이션은 변경할 필요가 없음을 의미합니다. 이로 인해 점진적 마이그레이션이 실제로 가능해지고 매우 강력해집니다.

즉, 대규모 애플리케이션에서 여러 팀이 각기 다른 라우트를 담당하고 있다면, 한 팀이 자신들의 영역만 RSC 라우트로 전환해도 앱 전체를 변경할 필요가 없습니다. 이는 점진적 마이그레이션을 실제로 가능하게 만들며, 매우 강력합니다.

## 서버 함수

리액트 라우터에는 항상 액션(actions)이 있었지만, 리액트는 이제 폼 액션(form actions)를 기본 기능으로 제공합니다. RSC를 사용하면 리액트의 폼 액션을 서버 함수와 함께 직접 사용할 수 있습니다.

아래는 서버 함수를 만드는 방법입니다.

```tsx
'use server';

export async function setIsFavorite(formData: FormData) {
  // API 호출 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 50));

  const movieId = Number(formData.get('id'));
  const isFavorite = formData.get('isFavorite') === 'true';
  // movie의 즐겨찾기 상태 업데이트
  const movie = movies.find(m => m.id === movieId);
  if (movie) {
    movie.isFavorite = isFavorite;
  }
}
```

`'use server'` 지시어는 이 모듈에서 export 된 항목들이 클라이언트에서 참조될 수 있음을 의미합니다. 폼 액션이 호출되면, 실제로는 서버에 RPC 호출을 보내 이 함수를 실행하게 됩니다.

그다음, 이 함수를 폼에서 직접 사용할 수 있습니다.

```tsx
<form action={setIsFavorite}>
  <input type="hidden" name="id" value={movie.id} />
  <input type="hidden" name="isFavorite" value={String(!movie.isFavorite)} />
  <button type="submit">
    {movie.isFavorite ? 'Favorite' : 'Not Favorite'}
  </button>
</form>
```

이것이 왜 멋질까요? 리액트 라우터에서는 모든 액션과 로더가 라우트에 연결되어 있습니다. 하지만 리액트의 폼 액션과 서버 함수를 사용하면, 라우트가 아니라 컴포넌트에 연결할 수 있습니다. 이 폼을 하나의 독립적인 컴포넌트로 만들어 상세 페이지, 카드, 채팅 기능 등 어디에서나 재사용할 수 있습니다.

RSC 이전의 리액트 라우터에서는 이를 위해 가장 가까운 라우트를 찾아야 했고, 해당 라우트마다 액션을 정의해야 했습니다. RSC를 사용하면 더 이상 그럴 필요가 없습니다. 컴포넌트가 자체적으로 데이터 로딩과 데이터 변경을 관리할 수 있습니다. 심지어 npm에 배포할 수도 있고, RSC를 지원하는 환경이라면 누구나 이 컴포넌트를 사용할 수 있습니다.

---

## 클라이언트 컴포넌트

물론 때로는 인터랙션이 필요합니다. 이때 사용하는 것이 클라이언트 컴포넌트입니다. `useState`나 `useEffect` 같은 훅을 사용한다면, 해당 컴포넌트를 클라이언트 컴포넌트로 표시해야 합니다.

```tsx
"use client";

import { Activity, useEffect, useState } from "react";
import { type Movie } from "#app/movies-data.ts";

export function MovieTrailer({ movie }: { movie: Movie }) {
  const [showTrailer, setShowTrailer] = useState(false);
  // ... 컴포넌트의 남은 부분
}
```

`'use client'` 지시어는 이 코드가 상태나 기타 클라이언트 사이드 로직을 포함하고 있으므로 브라우저로 전송되어야 한다는 것을 의미합니다. 서버 렌더링은 여전히 되지만, 인터랙션을 위해 클라이언트에도 코드가 전송됩니다.

정말 멋진 점은, 서버 컴포넌트 안에서 클라이언트 컴포넌트를 아무런 변경 없이 사용할 수 있다는 것입니다. 서버 컴포넌트는 클라이언트 컴포넌트의 존재를 알 필요가 없으며, 그냥 정상적으로 동작합니다.

## 이 기능은 누구에게 도움이 될까요?

로더에서의 RSC는 다양한 컴포넌트 조합이 가능한 대규모 타임라인 같은 것을 만들 때 매우 유용합니다. 데이터를 받아오기 전까지 어떤 컴포넌트를 렌더링해야 할지 알 수 없는 경우에 특히 적합합니다. 이런 경우에는 로더의 RSC나 RSC 라우트가 완벽한 선택입니다.

그 외의 경우에도, 편리하고 유용한 기능입니다. 다만 때로는 데이터와 템플릿을 함께 보내는 것이, 데이터와 템플릿을 분리해서 보내는 것보다 오히려 더 커질 수도 있다는 점은 언급하고 싶습니다. 이는 상황에 따라 다릅니다. 하지만 대부분의 경우, RSC와 RSC 라우트를 사용하는 것이 매우 합리적입니다.

리액트 라우터의 멋진 점은 완전히 전환할 필요가 없다는 것입니다. 정말 이점이 있다고 느끼는 부분부터 점진적으로 도입하실 수 있습니다. 또한 컴포넌트 내부에서 직접 데이터 로딩을 할 수 있어 타입도 훨씬 좋아지고, 서스펜스 경계(Suspense Boundary) 등도 함께 사용할 수 있습니다.

서버 함수는 데이터 로딩과 데이터 변경이 함께 필요한 컴포넌트가 있는 경우에 매우 유용합니다. 이제 이런 것들을 어디에나 배치하실 수 있습니다.

클라이언트 컴포넌트는 서버 컴포넌트를 사용할 때에만 의미가 있습니다. 만약 라우트나 컴포넌트를 서버 컴포넌트로 전환하지 않는다면, 클라이언트 컴포넌트를 사용할 일도 없습니다. 앱 전체가 여전히 클라이언트 컴포넌트일 것입니다. 하지만 RSC가 가고자 하는 방향이 맞다고 판단된다면, 클라이언트 컴포넌트는 필수적인 도구가 됩니다.

## 정적 빌드

마지막으로 한 가지 더 언급하고 싶은 점은, 서버 컴포넌트를 사용하면서도 리액트 라우터 앱을 정적 빌드로 만들 수 있다는 것입니다. 이는 리액트 서버 컴포넌트의 설계 일부입니다. 정적 환경에 배포하면서도 RSC의 일부 이점을 누릴 수 있습니다. 리액트 서버 컴포넌트를 사용하기 위해 반드시 런타임 서버가 필요한 것은 아니며, 빌드 서버가 서버의 역할을 할 수도 있습니다.

## 마무리

리액트 라우터의 리액트 서버 컴포넌트 구현은 정말 잘 만들어졌습니다. 다음을 지원합니다.

- 번들러에서의 RSC – Vite 플러그인을 통해 RSC 활성화
- 로더에서의 RSC – 데이터를 대신해 UI를 반환
- RSC 라우트 – 전체 라우트를 서버 컴포넌트로 구성
- 서버 함수 – `'use server'`와 함께 리액트의 폼 액션 사용
- 클라이언트 컴포넌트 – `'use client'`로 인터랙션이 필요한 컴포넌트 표시

이 모든 것이 리액트 라우터에서 지원되며, 점진적인 마이그레이션 경로 덕분에 대규모 애플리케이션을 다루는 팀에게 특히 강력합니다. 리액트 서버 컴포넌트가 특히 잘 맞는 사용 사례에서는, 이 점이 정말 훌륭하다고 생각합니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
