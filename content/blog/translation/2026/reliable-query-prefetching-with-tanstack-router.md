---
title: '(번역) TanStack Router로 안정적인 쿼리 프리페칭하기'
date: 2026-09-17 09:30:00
category: 'Translation'
draft: false
---

> 원문: [Reliable query prefetching with tanstack router](https://tkdodo.eu/blog/reliable-query-prefetching-with-tanstack-router)

![TanStack Router로 안정적인 쿼리 프리페칭하기](https://tkdodo.eu/blog/_astro/chairs.BS4rheeq.jpg)

사진 제공 [Mario Heller](https://unsplash.com/@heller_mario)

TanStack Router

- [#1: TanStack Router의 아름다움](https://tkdodo.eu/blog/the-beauty-of-tan-stack-router)
- [#2: TanStack Router의 컨텍스트 상속](https://tkdodo.eu/blog/context-inheritance-in-tan-stack-router)
- [#3: TanStack Router와 Query](https://tkdodo.eu/blog/tan-stack-router-and-query)
- #4: TanStack Router로 안정적인 쿼리 프리페칭하기

이 시리즈의 [지난 글](https://tkdodo.eu/blog/tan-stack-router-and-query)에서 저는 TanStack Query와 함께 TanStack Router에서 데이터 패칭을 할 때, 제 생각에는 권장할 만한 패턴의 장점을 설명했습니다. 요약하자면 loader에서 가능한 한 빨리 fetch를 시작하는 동시에, loader를 이벤트 핸들러처럼 다뤄 컴포넌트가 `useSuspenseQuery`나 `useQuery`로 프로미스(promise)를 “집어 들 수” 있게 하는 방식입니다.

여기서 얻어야 할 결론은 가능하다면 컴포넌트는 스스로 데이터 패칭을 시작하지 않는 편이 좋다는 것입니다. 물론 이론적으로는 컴포넌트가 완전히 자기완결적이고, 자신만의 데이터 요구사항을 가지며, 렌더링될 때 자동으로 그것을 해결한다는 점이 훌륭합니다. 하지만 실제로 fetch하는 곳이 그곳뿐이라면, 우리는 1) 이상적으로 해야 할 시점보다 훨씬 늦게 fetch를 시작하고 있을 가능성이 높고, 2) suspense 사용 여부와 관계없이 [fetch 워터폴](https://tkdodo.eu/blog/seeding-the-query-cache#fetch-waterfalls)을 쉽게 만들 수 있습니다.

그래서 라우트 로더(route loader)가 해결책으로 등장합니다. 🎉 늘 그렇듯, 여기에도 비용은 있습니다.

## 커다란 어긋남

이 접근 방식의 큰 단점은 컴포넌트에서 하는 일을 두 번째 위치인 라우트 로더에 사실상 중복한다는 점입니다. 물론 중복이 세상의 끝은 아니며, 애플리케이션에 제공하는 UX를 생각하면 괜찮은 트레이드오프입니다. 하지만 애플리케이션이 커질수록 반드시 기억해야 할 정말 중요한 점이 하나 있습니다.

> 이 두 곳은 100% 동기화되어 있어야 합니다

보통 시간이 지날수록 이를 보장하기는 더 어려워집니다. 블로그 글에는 최소 예제가 좋지만, 최소 예제가 반드시 현실 세계를 반영하지는 않습니다. TanStack Router로 더 큰 애플리케이션을 만들면서, 우리는 이 “한계”를 꽤 빨리 마주했습니다. 여기에는 몇 가지 요인이 있었습니다.

1. 컴포넌트는 보통 `Route` 파일에 남아 있지 않습니다.

적어도 완전히는 아닙니다. `component: Dashboard`는 좋지만, `Dashboard`는 더 많은 컴포넌트로 구성될 가능성이 높고, 그 컴포넌트들도 라우트 API에 접근해야 합니다. TanStack Router에는 [`getRouteApi`](https://tanstack.com/router/latest/docs/framework/react/api/router/getRouteApiFunction#getrouteapi-returns)가 있으므로, 쉽게 별도 파일로 나누기 시작할 수 있습니다.

```tsx
const Route = getRouteApi('/dashboard/$dashboardId');

function DashboardContent() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(dashboardQueryOptions(params.dashboardId));
}
```

좋은 일입니다. 하지만 컴포넌트가 Query를 사용하는 방식을 바꿀 때, 라우트 로더도 함께 조정해야 한다고 바로 떠올리지 못할 수 있다는 뜻이기도 합니다.

2. 두 곳이 같지 않아도 에러가 나지 않습니다.

프리페칭 불일치를 돕기 위한 [Strict Mode](https://github.com/TanStack/query/discussions/8064)를 생각해본 적은 있지만, 지금은 그런 것이 없습니다. 그래서 실수로 서로 달라지기가 정말 쉽습니다.

이런 상황에서는 제품이 커지고 새 기능이 추가될수록, 컴포넌트에서 데이터를 fetch하는 방식만 바꿔도 두 가지 문제가 생길 수 있습니다. 실제로 필요하지 않은 데이터를 프리페치해서 라우트를 막을 수도 있고, 필요한 데이터를 위해 또 다른 fetch를 트리거해 워터폴 효과를 만들 수도 있습니다.

또한 컴포넌트에서 쿼리를 제거했지만 라우트 로더를 정리하지 않으면, 전혀 필요하지 않은 데이터를 불필요하게 프리페치하게 됩니다.

## 예시

Dashboard에 과거 날짜로 필터링하는 기능을 추가해, 특정 시점의 데이터와 위젯에 대한 과거 스냅샷(snapshot)을 가져오고 싶다고 가정해봅시다. 공유할 수 있어야 하므로 Dashboard 라우트에 선택적 `?asOf=YYYY-MM-DD` 쿼리 파라미터(query parameter)를 추가하고, 컴포넌트에서 이를 사용하겠습니다.

```tsx
const Route = getRouteApi('/dashboard/$dashboardId');

function DashboardContent() {
  const params = Route.useParams();
  const { asOf } = Route.useSearch();
  const { data } = useSuspenseQuery(
    dashboardQueryOptions(params.dashboardId, { asOf })
  );
}
```

이제 Dashboard를 로드하면 여전히 모든 것이 잘 동작하고, 검색 파라미터(search params)를 바꾸면 해당 스냅샷의 데이터도 보입니다. LGTM, 배포합시다. 🚢

버그가 무엇인지 이미 제가 스포일러했다고 생각합니다. 이제 Dashboard 라우트를 공유하면 우리는 다음 일을 하게 됩니다.

1. 라우트 로더에서 “오늘”의 데이터를 로드합니다. 라우트 로더에 `asOf` 파라미터를 반영하지 않았기 때문입니다.
2. 그 데이터를 사용할 수 있을 때까지 기다린 다음 컴포넌트를 렌더링합니다.
3. 이제 컴포넌트 안에서 `asOf` 파라미터가 있는 상태로 다시 fetch합니다.
4. `asOf`는 `QueryKey`의 일부가 되어야 하므로 완전히 새로운 Query가 생기고, 해당 데이터를 사용할 수 있을 때까지 컴포넌트는 다시 일시 중단(suspend)됩니다.
5. 그제야 정확한 데이터로 컴포넌트를 렌더링합니다.

이는 꽤 좋지 않습니다. 가장 흔한 사용 사례인 기능 추가를 제대로 하기 어렵게 만들고, 여기서 생기는 버그도 알아차리기 쉽지 않기 때문입니다. 실제로 우리가 만든 처음 몇 개의 라우트에서 이 문제를 겪었던 것 같습니다. 라우트 로더에서 `search`, `sortBy`, `sortDirection` 쿼리 파라미터를 선택적으로 받는 InfiniteQuery를 프리페치하고 있었거든요. 😔

정말 쉽게 저지를 수 있는 실수입니다. 그렇다면 어떻게 고칠 수 있을까요?

### 라우트 로더 고치기

우선 라우트 로더도 선택적 파라미터를 포함하도록 업데이트해야 할 것입니다. 이는 [`loaderDeps`](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#using-search-params-in-loaders)라는 추가 간접 계층으로 처리해야 합니다.

> **왜 loaderDeps일까요?**
>
> 경로 파라미터(path params)는 항상 loader에 주입됩니다. 경로가 바뀌었다면 다른 라우트로 내비게이션했다는 것이 분명하고, 그 라우트의 데이터를 로드해야 하기 때문입니다. 하지만 쿼리 파라미터(query params)는 이야기가 그만큼 명확하지 않습니다.
>
> 쿼리 파라미터는 라우트가 데이터를 fetch하는 방식과 아무 관련 없는 클라이언트 상태를 저장하는 데 자주 사용될 수 있습니다. _어떤_ 쿼리 파라미터가 바뀌든 loader를 다시 실행하고 싶지는 않을 것입니다. 그래서 조금 더 명시적으로, 로드되는 데이터를 고유하게 식별하는 데 어떤 쿼리 파라미터를 사용해야 하는지 loader에 알려줘야 합니다.

```tsx
export const Route = createFileRoute('/dashboard/$dashboardId')({
  validateSearch: type({ 'asOf?': 'string.date.iso' }).assert,
  loaderDeps: ({ search: { asOf } }) => ({ asOf }),
  loader: async ({ context, params, deps }) => {
    await context.queryClient.ensureQueryData(
      dashboardQueryOptions(params.dashboardId, deps)
    );
  },
  component: Dashboard,
});
```

이렇게 하면 증상은 해결됩니다. 이제 여러 불필요한 요청 없이 URL을 다시 공유할 수 있습니다. 하지만 근본 원인은 전혀 다루지 못합니다. 다음 라우트에서 같은 실수를 다시 할 가능성은 여전히 높습니다. 그런 일이 덜 일어나게 하려면 중복을 고쳐야 합니다.

### 중복 고치기

쿼리와 관련된 두 호출을 다시 비교해봅시다. 하나는 loader에 있고, 하나는 컴포넌트에 있습니다.

```tsx
// 로더
await context.queryClient.ensureQueryData(
  dashboardQueryOptions(params.dashboardId, deps)
);

// 컴포넌트
const { data } = useSuspenseQuery(
  dashboardQueryOptions(params.dashboardId, { asOf })
);
```

두 경우가 같은 쿼리 옵션(query options)을 공유한다는 것을 볼 수 있습니다. 유일한 차이는 그 옵션이 전달되는 함수입니다. 명령형 일회성 fetch에는 `ensureQueryData`가, 반응형 구독 설정에는 `useSuspenseQuery`가 사용됩니다.

우리의 경우 버그가 생긴 이유는 두 곳이 실제로 같은 옵션을 사용하지 않았기 때문입니다. 컴포넌트가 항상 loader와 같은 `queryOptions`에 의존한다면 서로 어긋날 수 없습니다. 그러니 옵션을 라우트 컨텍스트(Route Context)에 넣고 두 곳에서 모두 사용해봅시다.

### 라우트 컨텍스트

저는 이전에 [#2: TanStack Router의 컨텍스트 상속](https://tkdodo.eu/blog/context-inheritance-in-tan-stack-router)에서 라우트 컨텍스트에 대해 썼고, `beforeLoad`가 context를 수정할 수 있다고 말했습니다.

이는 사실이지만, `beforeLoad`는 모든 라우트 변경마다 실행되고 `loaderDeps`가 아니라 전체 `search`를 받습니다. 새롭고 현재는 문서화되지 않은 함수인 `context`는 이 문제를 해결하려 합니다. loader가 실행될 때만 실행되기 때문이고, 그래서 이 글에서 저는 이 함수를 사용합니다.

```tsx
export const Route = createFileRoute('/dashboard/$dashboardId')({
  validateSearch: type({ 'asOf?': 'string.date.iso' }).assert,
  loaderDeps: ({ search: { asOf } }) => ({ asOf }),
  context: ({ params, deps }) => ({
    dashboardQueryOptions: dashboardQueryOptions(params.dashboardId, deps),
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(context.dashboardQueryOptions);
  },
  component: Dashboard,
});

// 멀리 떨어진 다른 파일에서

const routeApi = getRouteApi('/dashboard/$dashboardId');

function DashboardContent() {
  const context = routeApi.useRouteContext();
  const { data } = useSuspenseQuery(context.dashboardQueryOptions);
}
```

여기서 몇 가지 일이 일어났습니다. 먼저 loader나 컴포넌트 안에서 더 이상 `params`나 `deps`에 의존하지 않습니다. 이제 `context` 함수가 그것들을 사용하는 유일한 곳이며, 이 함수의 일은 공유하려는 `queryOptions`를 만들고 context의 임의 키 아래에 넣는 것입니다.

그다음 loader는 `context`만 사용하고, 컴포넌트도 `Route.useRouteContext()`로 `context`만 사용합니다.

이 작은 간접 계층에는 많은 장점이 있습니다. 중복 제거 버그가 더 이상 생길 수 없을 뿐만 아니라, 컴포넌트가 프리페치된 쿼리를 사용할 때도 알 수 있습니다. 컴포넌트에서 사용을 제거하면 라우트 로더를 살펴보고 프리페치를 정리할 가능성도 훨씬 높아집니다.

그리고 context는 부모로부터 상속되기 때문에, 하위 라우트도 이 `queryOptions`를 알 수 있습니다. 예를 들어 루트 라우트 로더에서 사용자 데이터를 프리페치할 수 있습니다.

```tsx
export const Route = createRootRouteWithContext<RouteContext>()({
  validateSearch: type({ debug: `boolean=false` }).assert,
  context: () => ({
    userQueryOptions: queryOptions({
      queryKey: ['user'],
      queryFn: getUser,
    }),
  }),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(context.userQueryOptions);
  },
  component: Root,
});
```

그런 다음 Widgets에서도 사용할 수 있습니다.

```tsx
function Widget() {
  const { userQueryOptions, dashboardQueryOptions } = Route.useRouteContext();
}
```

어떤 부모가 만든 `queryOptions`든, 라우트 컨텍스트에 추가하기만 했다면 모두 보게 됩니다. 🎉

## 구독에 대한 마지막 참고

이 기능이 라우터에 들어왔을 때, 저는 컴포넌트가 무엇을 구독하는지 조금 걱정했습니다. 보셨듯이, 우리는 기본적으로 `useParams`와 `useSearch`에 대한 모든 구독을 `useRouteContext` 호출 하나로 바꿨습니다.

```tsx
function DashboardContent() {
  const params = Route.useParams();
  const { asOf } = Route.useSearch();
  const context = Route.useRouteContext();
}
```

라우트 컨텍스트도 지원하는 [세분화된 구독(fine-grained subscriptions)](https://tkdodo.eu/blog/the-beauty-of-tan-stack-router#fine-grained-subscriptions)이 있더라도, 함수가 들어 있어 구조적으로 공유할 수 없는 새 `queryOptions` 객체를 매 렌더링마다 받게 되지는 않을까요? 그리고 그러면 모든 것이 계속 리렌더링되지 않을까요?

안심하세요. 그렇지 않습니다. `context` 함수는 `params`나 `loaderDeps`가 바뀔 때만 실행됩니다. 따라서 `debug` 같은 관련 없는 검색 파라미터가 바뀌어도 라우트 컨텍스트를 구독하는 컴포넌트는 불필요하게 리렌더링되지 않습니다.

전체적으로 저는 컴포넌트가 라우트 로더가 프리페치하는 것과 실제로 같은 것을 소비하도록 보장하는 가장 좋고 확장성 있는 해결책이 이것이라고 생각합니다.

오늘은 여기까지입니다. 궁금한 점이 있다면 [Bluesky](https://bsky.app/profile/tkdodo.eu)로 편하게 연락하거나, 아래에 댓글을 남겨주세요. ⬇️

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
