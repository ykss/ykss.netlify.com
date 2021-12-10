---
title: '[Redux] RTK Query 란?'
date: 2021-12-10 01:00:00
category: 'React'
draft: false
---

RTK Query는 데이터를 가져오고(fetching), 캐싱하는(caching) 강력한 도구이다. 데이터를 가져오고 캐싱하는 로직을 번거롭게 작성하지 않고 단순화시켜준다. RTK 쿼리는 Redux Tookit 패키지에 포함된 선택적 애드온이다.

## 1. RTK 쿼리 등장 배경

웹 애플리케이션에서 화면에 데이터를 보여주기 위해서 서버로 부터 데이터를 가져오고, 데이터를 업데이트하고, 업데이트된 데이터를 서버로 보내고, 클라이언트의 데이터를 캐싱하는 등 작업은 모두 필수적인 작업이 되고 있다.

- 스피너를 보여주려고 로딩 상태를 추적해야 한다.
- 같은 데이터를 가져오기 위해 중복된 요청을 보내지 말아야 한다.
- 사용자가 UI와 상호작용하고 있을 때 캐시 수명을 관리해야 한다.
- UI가 빠르다고 느껴지게 업데이트 과정을 최적화 해야한다.

하지만 위와 같은 과정들은 복잡해졌고, Redux에서는 위의 문제들을 해결할 수 있는 기능을 내장하고 있지 않다. 리덕스 툴킷이 등장하면서 로딩 상태와 요청 결과를 추적하기 위한 전체 요청 과정에서 액션을 디스패치하는 과정이 `createAsyncThunk API`가 생겨나면서 많이 추상화되었지만, 리액트 개발자들에게 여전히 데이터 가져오기와 캐싱하기는 문제로 남아있고, 그 부분은 상태 관리와는 완전히 다른 관심 주제이다.

## 2. RTK 쿼리의 특징

위와 같은 상황에서 여러가지 방식으로 해결책을 제시한 Apollo client, React Query, SWR 등의 영감을 받아서 RTK Query는 탄생했다. 하지만 이것들과는 다르게 API 디자인 방식에 독특한 접근법들을 추가했다. react-query나 swr과 다르게 모든 API의 정보를 한 곳에 정의하는 방식을 사용한다. 이렇게 한 곳에 모아두면서 API 요청 방식, 캐시 무효화, 애플리케이션 설정 등의 정보를 추적하는게 용이하기 때문이다.

- Redux Toolkit의 `createSlice`와 `createAsyncThunk API`위에 기능이 구현되어 있다.
- RTK Query의 기능은 모든 UI 레이어에서 사용될 수 있다.
- API 엔드포인트는 인자로부터 쿼리 파라미터를 생성하는 방식과 캐싱을 위해 응답을 변환하는 방식을 포함해서 미리 정의된다.
- RTK Query는 데이터를 가져오는 모든 과정을 캡슐화한 React Hooks를 생성할 수 있다. 이 Hooks는 컴포넌트에게 `data` 필드와 `isLoading` 필드를 제공해서 컴포넌트가 마운트되고 언마운트 되는 동안 캐싱된 데이터의 수명을 관리한다.
- RTK Query는 첫 데이터를 가져와서 웹 소켓 메시지를 통해 스트리밍되는 캐시 업데이트와 같은 유즈 케이스를 해결할 수 있는, cache entry lifecycle 옵션을 제공한다.
- OpenAPI와 GraphQL 스키마에서 API slice를 만드는 예제 코드를 제공한다.
- RTK Query는 완전히 TS 기반으로 작성되어 완벽한 TS 경험을 제공한다.

## 3. RTK Query API

RTK Query는 아래와 같은 API를 포함한다.

- `createApi()` : RTK 쿼리의 핵심으로 일련의 엔드포인트들로 부터 데이터를 검색할 방법을 표현하는 엔드포인트 집합을 정의한다. 해당 엔드포인트에서 데이터를 검색할 방법을 정하고, 어떻게 가져와서 변형할지를 설정할 수 있다. base URL 하나당 하나의 API slice와 같은 관습적 규칙에 따라 주로 애플리케이션 당 한 번 사용한다.
- `fetchBaseQuery()` : 요청을 단순화하기 위한 목적의 wrapper이다. 주로 `createApi` 내부에서 사용하도록 권장된다.
- `ApiProvider()` : Redux 저장소가 없는 경우에 `Provider` 처럼 사용 가능하다. Redux가 있는 경우 충돌이 발생할 수 있다.
- `setupListeners()` : `refetchOnMount`와 `refetchOnReconnect`를 사용할 수 있게 한다.

## 4. RTK Query 사용법

### 4-1. API slice 생성

RTK Query는 Redux Toolkit 패키지 설치 과정에 함께 설치되기 때문에 따로 설치할 필요는 없다. 아래와 같이 `import`하여 사용할 수 있다. 보통 애플리케이션이 사용하는 base URL 하나 당 API slice 하나를 두는 편이다. `/api/plans`, `/api/users`로 부터 데이터를 가져오고 싶다면 `/api/`를 base URL로 하는 API slice 하나만 만들면 된다. 그리고 `endpoints`에 `plans`와 `users`를 정의하면 된다. 이렇게하면 엔드포인트들 사이 `tag`를 통해 자동으로 데이터 다시 가져오기를 할 수 있다.

```typescript
import { createApi } from '@reduxjs/toolkit/query'

/* React에 특화된 엔트리 포인트입니다.
   정의된 엔드포인트에 따라 자동으로 Hooks를 생성합니다. */
import { createApi } from '@reduxjs/toolkit/query/react'
```

그리고 서버의 base URL과 상호작용하도록 API slice를 정의하면 된다.

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Player } from './types'

// base URL과 사용하기로 예상되는 엔드포인트들을 정의합니다.
export const playerApi = createApi({
  reducerPath: 'playerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://playerapi.co/api/v2/' }),
  endpoints: builder => ({
    getPlayerByName: builder.query<Player, string>({
      query: name => `player/${name}`,
    }),
  }),
})

// 함수형 컴포넌트에서 사용할 수 있도록 Hooks를 내보냅니다.
// 정의된 엔드포인트들을 기반으로 자동으로 생성됩니다.
export const { useGetPlayerByNameQuery } = playerApi
```

### 4-2. 저장소 구성하기

API slice는 Redux slice 리듀서와 구독 수명을 관리하는 커스텀 미들웨어를 자동 생성하고 포함한다. 둘 모두를 Redux 저장소에 저장해야 한다.

```typescript
import { configureStore } from '@reduxjs/toolkit'
// React를 사용 중일 경우, '@reduxjs/toolkit/query/react'로부터 import해도 됩니다.
import { setupListeners } from '@reduxjs/toolkit/query'
import { playerApi } from './services/player'

export const store = configureStore({
  reducer: {
    // 자동으로 생성된 Redux slice 리듀서
    [playerApi.reducerPath]: playerApi.reducer,
  },
  // RTK Query의 캐싱, 캐시 무효화, 폴링 등을 포함한
  // 여러 유용한 기능들을 활성화하는 api 미들웨어
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(playerApi.middleware),
})

// setupListeners()는 선택 사항이지만, refetchOnFocus/refetchOnReconnect를 위해서는 필수적으로 사용해야 합니다.
setupListeners(store.dispatch)
```

### 4-3. Provider로 애플리케이션 감싸기

```typescript
import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './App'
import store from './app/store'

const rootElement = document.getElementById('root')
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
```

### 4-4. 컴포넌트에서 Hooks 사용하기

API slice로부터 자동 생성된 React Hooks를 컴포넌트 파일에 import해서 필요한 파라미터와 Hooks를 호출해서 사용해야 한다.

```typescript
import { useGetPlayerByNameQuery } from './services/player'

export default function App() {
  // Hooks를 사용하면 자동으로 데이터를 가져오고 쿼리로부터 얻은 값을 반환합니다.
  const { data, error, isLoading } = useGetPlayerByNameQuery('kante')
  // 각각의 Hooks는 생성된 엔드포인트 아래에서도 접근 가능합니다:
  // const { data, error, isLoading } = playerApi.endpoints.getPlayerByName.useQuery('kante');

  return (
    <div className="App">
      {error ? (
        <>앗, 오류가 발생했습니다.</>
      ) : isLoading ? (
        <>로딩중...</>
      ) : data ? (
        <>
          <h3>{data.species.name}</h3>
          <img src={data.sprites.front_shiny} alt={data.species.name} />
        </>
      ) : null}
    </div>
  )
}
```

요청을 만들고 난 뒤, 다양한 방법을 통해 해당 요청에 대해 상태를 추적할 수 있다. `data`, `status`, `error` 값을 확인해서 어떤 UI를 렌더링할지 결정할 수 있따. 추가로 `useQuery` Hook은 가장 최근 요청에 대한 `isLoading`, `isFetching`, `isSuccess`, `isError` 등과 같은 유용한 boolean 값을 제공한다. 여기서 RTK Query는 자동으로 컴포넌트 마운트 과정에서 데이터를 가져오고 파라미터가 바뀔 때마다 데이터를 다시 가져오고, 결과로 `{data, isFetching}` 값을 제공하고 이 값이 바뀔 떄마다 컴포넌트를 리렌더링 한다.

## 정리

기본적으로 RTK Query가 무엇인지 알아보고, 어떤 방식으로 사용할 수 있는지 알아 보았다. 구체적으로 Query에서 어떤 Hooks를 사용하고, 어떻게 사용하는지에 대해서와 React-query나 SWR 등과 어떤 차이점이 있는지는 다음 포스트에서 알아가보자.

---

출처

1. [RTK 쿼리 핸드북](https://raejoonee.gitbook.io/rtk-query/rtk-query)
