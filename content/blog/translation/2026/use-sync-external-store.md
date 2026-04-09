---
title: '(번역) useSyncExternalStore : 실전 리액트 개발을 위한 심층 해설'
date: 2026-04-13 09:30:00
category: 'Translation'
draft: false
---

> 원문: [useSyncExternalStore: Demystified for Practical React Development](https://www.epicreact.dev/use-sync-external-store-demystified-for-practical-react-development-w5ac0)

리액트의 `useSyncExternalStore`는 매일 쓰게 되는 훅은 아니지만, 필요할 때는 _정말로_ 필요한 훅입니다. 리액트가 제어하지 않는 외부 상태 관리 시스템이나 브라우저 API와 리액트 컴포넌트를 연결할 때 핵심적인 역할을 합니다. 안타깝게도 이 훅은 자주 오해를 받기도 합니다. 이번 글에서는 이러한 혼란을 해소하고, 실제 예시를 살펴보며, 가장 흔한 실수들을 짚어보겠습니다.

## useSyncExternalStore는 왜 존재하나요? "테어링(tearing)" 문제

리액트의 내장 상태(`useState`, `useReducer`)와 Context API는 리액트 *내부*에서 관리되는 데이터에 매우 적합합니다. 하지만 컴포넌트가 리액트의 *외부*에 있는 소스의 데이터를 표시해야 할 때는 어떻게 해야 할까요?

- **브라우저 API:** `navigator.onLine`(온라인 상태), `document.visibilityState`(페이지 가시성), `window.matchMedia`(미디어 쿼리)
- **서드파티 상태 관리 라이브러리:** 리액트의 동시성 기능을 고려하지 않고 설계된 구버전 Redux나 MobX, 또는 커스텀 스토어. (참고: Redux, Zustand, Jotai 같은 라이브러리의 최신 버전은 리액트 바인딩에 내부적으로 `useSyncExternalStore`를 사용합니다.)
- **전역 자바스크립트 변수나 커스텀 이벤트 시스템:** 리액트가 관리하지 않는 모든 가변 데이터 소스

`useSyncExternalStore` 이전에는 개발자들이 보통 `useEffect`와 `useState`를 사용해 이러한 외부 소스를 구독하고 로컬 컴포넌트 상태를 업데이트했습니다. 단순한 경우에는 잘 작동했지만, 리액트의 동시성 렌더링 기능과 충돌하는 문제가 발생할 수 있었습니다.

**동시성 렌더링**을 사용하면 리액트가 여러 UI 업데이트를 동시에 처리할 수 있습니다. 필요에 따라 렌더링 작업을 일시 중지하고, 재개하거나, 취소할 수 있습니다. 이를 통해 체감 성능이 크게 향상됩니다. 하지만 리액트가 컴포넌트 트리를 렌더링하는 도중에 외부 스토어가 변경되면, 서로 다른 컴포넌트가 외부 데이터의 서로 다른 버전을 읽을 수 있습니다. 이런 불일치를 **"테어링"**이라 부르는데, UI가 충돌하는 정보를 표시하면서 말 그대로 "찢어지는" 현상입니다.

`useSyncExternalStore`는 리액트가 직접 관리하는 동기적 방식으로 외부 스토어를 구독할 수 있게 해줌으로써 이 문제를 해결합니다. 동시 업데이트 중에도 렌더링 패스의 모든 컴포넌트가 동일하고 일관된 데이터 스냅샷을 보도록 보장하여 테어링을 방지합니다.

## API 살펴보기

```js
const synchronizedState = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot? // 선택
);
```

각 인자를 자세히 살펴보겠습니다.

- **`subscribe(callback)`:**

  - 외부 데이터 스토어에 대한 구독을 설정하는 함수입니다.
  - 리액트가 제공하는 `callback` 함수를 인자로 받습니다.
  - 외부 스토어의 데이터가 변경될 때마다 `subscribe` 함수는 반드시 이 `callback`을 호출해야 합니다. 이를 통해 리액트에 스토어가 변경되었고 리렌더링이 필요할 수 있다는 것을 알립니다.
  - 반드시 `unsubscribe` 함수를 반환해야 합니다. 리액트는 컴포넌트가 언마운트되거나 `subscribe` 함수 자체가 렌더링 사이에 변경될 때 이 정리 함수를 호출합니다.

- **`getSnapshot()`:**

  - 컴포넌트가 필요로 하는 스토어의 현재 데이터 스냅샷을 반환하는 함수입니다.
  - **순수(pure)**(사이드 이펙트 없음)하고 **동기적(synchronous)**(즉시 값을 반환)이어야 합니다. 스토어가 변경되지 않았더라도 리액트가 여러 번 호출할 수 있으므로, 빠르게 실행되어야 합니다.
  - 중요한 점은, 기저 데이터가 변경되지 않았다면 `getSnapshot`은 마지막 호출 때와 **동일한 참조 값**(객체나 배열인 경우) 또는 동일한 원시 값을 반환해야 한다는 것입니다. 이를 통해 리액트는 `Object.is` 비교를 사용해 리렌더링을 최적화할 수 있습니다. 자세한 내용은 아래 "자주 하는 실수" 섹션을 참조하세요.

- **`getServerSnapshot?()` (선택 사항):**
  - 이 함수는 서버 사이드 렌더링(SSR)과 클라이언트 사이드 하이드레이션(hydration)에만 필요합니다.
  - 서버에서 표시되어야 하는 데이터의 초기 스냅샷을 반환해야 합니다.
  - 외부 스토어가 클라이언트 전용인 경우(예: 서버에 없는 브라우저 API에 의존), 기본값이나 플레이스홀더를 제공할 수 있습니다.
  - 이 인자를 생략하고 SSR 환경에서 사용하면, 컴포넌트는 보통 하이드레이션 때까지 클라이언트에서 서스펜드 상태가 되거나, 서버에서 렌더링된 HTML이 초기 클라이언트 렌더링과 일치하지 않으면 리액트가 오류를 던질 수 있습니다.

## 예시: 온라인 상태 추적 (브라우저 API)

사용자의 브라우저가 온라인인지 추적하는 커스텀 훅 `useOnlineStatus`를 만들어보겠습니다.

```js
import { useSyncExternalStore } from 'react';

// 1. 컴포넌트 밖에서 getSnapshot 정의
// 외부 소스에서 현재 상태를 읽습니다.
function getOnlineStatusSnapshot() {
  return navigator.onLine;
}

// 2. 컴포넌트 밖에서 subscribe 정의
// 리스너를 등록하고, 변경 시 리액트가 넘긴 callback을 호출합니다.
function subscribeToOnlineStatus(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  // 정리(cleanup) 함수 반환
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

// 3. 커스텀 훅 만들기
export function useOnlineStatus() {
  // useSyncExternalStore로 동기 읽기와 테어링 방지
  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatusSnapshot,
    // SSR을 견고하게 하려면 getServerSnapshot을 넘기세요.
    () => true // 클라이언트가 온라인이라고 가정하거나, 합리적인 기본값
  );
  return isOnline;
}

// 컴포넌트에서 사용
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ 온라인' : '❌ 연결 끊김'}</h1>;
}
```

이 예시는 핵심 패턴을 보여줍니다. 안정적인 `subscribe`와 `getSnapshot` 함수가 외부 소스(`navigator.onLine`과 그 이벤트)와 상호작용합니다.

## 자주 하는 실수, 주의 사항, 그리고 올바른 사용법

`useSyncExternalStore`에 관한 많은 질문을 받았습니다. 가장 자주 받는 질문들을 정리했습니다.

### 1. "`useEffect` + `useState`를 쓰면 안 되나요?"

`useEffect`와 `useState`로 외부 스토어를 구독할 수 있지만, 이 패턴은 동시성 렌더링에서 테어링이 발생하기 쉽습니다. 리액트가 컴포넌트 렌더링을 일시 중지하는 사이 외부 스토어가 업데이트되면, 리액트는 오래된 데이터로 렌더링을 재개하거나 UI 전반에 걸쳐 불일치가 발생할 수 있습니다. `useSyncExternalStore`는 리액트의 렌더링 생명주기와 통합되도록 특별히 설계되어, 렌더링 패스 중 읽기가 동기적이고 일관되게 이루어집니다. **리액트 외부의 상태와 동기화해야 한다면, `useSyncExternalStore`가 올바르고 견고한 해결책입니다.**

### 2. "매 렌더링마다 `subscribe`나 `getSnapshot` 함수가 새로 생성됩니다!"

메모이제이션(memoization) 없이 컴포넌트나 커스텀 훅 내부에서 `subscribe`나 `getSnapshot`을 인라인으로 정의하면, 매 렌더링마다 새로운 함수가 생성됩니다.

```js
// ❌ 나쁨: 매 렌더마다 subscribe·getSnapshot이 새로 만들어짐
function MyComponentUsesStore() {
  // MyComponentUsesStore가 렌더될 때마다 이 함수들의 참조가 바뀜
  function subscribe(callback) {
    /* ... */
  }
  function getSnapshot() {
    /* ... */
  }
  const value = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

`useSyncExternalStore`가 _새로운_ `subscribe` 함수 인스턴스를 받으면, 스토어를 재구독합니다(먼저 이전 구독 해제 함수를 호출하고 새 subscribe를 호출합니다). 이는 비효율적이며, 완벽하게 처리하지 않으면 버그나 메모리 누수로 이어질 수 있습니다.

**해결책**

- **컴포넌트 외부에서 정의하기:** `useOnlineStatus` 예시처럼 정의합니다. 가장 간단하고 대체로 최선의 방법입니다.
- **`useCallback`으로 메모이제이션하기:** `subscribe`나 `getSnapshot` 함수가 props나 state에 의존하는 경우(예: 특정 문서를 구독하기 위한 ID), `useCallback`으로 감싸줍니다.

```js
// ✅ 좋음: subscribe와 getSnapshot이 안정적
function subscribeToStore(callback) {
  /* ... */
}
function getStoreSnapshot() {
  /* ... */
}

function MyComponentUsesStore() {
  const value = useSyncExternalStore(subscribeToStore, getStoreSnapshot);
  // ...
}

// ✅ 이것도 좋음 (props에 의존할 때, 예: storeId)
import { useCallback, useSyncExternalStore } from 'react';

function MyComponentUsesStore({ storeId }) {
  const subscribe = useCallback(
    callback => {
      return externalStoreAPI.subscribe(storeId, callback);
    },
    [storeId]
  );
  const getSnapshot = useCallback(() => {
    return externalStoreAPI.getSnapshot(storeId);
  }, [storeId]);
  const value = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

### 3. "`getSnapshot`이 너무 많이 호출됩니다!"

리액트는 렌더링 패스 중에 `getSnapshot`을 여러 번 호출할 수 있고, 리렌더링이 발생하지 않더라도 일관성을 검증하기 위해 호출할 수 있습니다. 이는 정상적인 동작입니다. 따라서 **`getSnapshot`은 반드시 다음 조건을 충족해야 합니다.**

- **빠르게:** 비용이 큰 연산을 피해야 합니다.
- **순수하게:** 사이드 이펙트가 없어야 합니다. 스코프 외부의 것을 수정하지 마세요.
- **일관되게:** 스냅샷과 관련된 기저 스토어 데이터가 변경되지 않았다면, `getSnapshot`은 정확히 동일한 값을 반환해야 합니다(`Object.is`를 사용한 객체/배열의 참조 동등성).

리액트는 `getSnapshot`의 반환값을 사용해 리렌더링이 필요한지 판단합니다. 데이터가 변경되지 않았는데도 매번 새로운 객체/배열 인스턴스를 반환하면 불필요한 리렌더링이 발생합니다(아래 실수 #8 참조).

### 4. "`useSyncExternalStore is not a function` 오류가 발생합니다."

이 오류는 거의 항상 리액트 18 미만 버전을 사용하고 있다는 의미입니다. `useSyncExternalStore`는 리액트 18에서 도입되었습니다. **해결책은** `react`와 `react-dom` 패키지를 `v18.0.0` 이상으로 업그레이드하는 것입니다.

### 5. "서버 사이드 렌더링(SSR)에서는 어떻게 사용하나요?"

외부 스토어가 서버에서 의미 있는 값을 제공할 수 있다면, 세 번째 인자인 `getServerSnapshot`을 **반드시** 제공해야 합니다. 제공하지 않으면 콘솔에 다음과 같은 오류가 표시됩니다.

```
Missing getServerSnapshot, which is required for server-rendered content. Will
revert to client rendering.
```

`getServerSnapshot` 사용 예시입니다.

```js
const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

`getServerSnapshot`은 서버에서 렌더링되어야 하는 스토어의 초기 상태를 반환해야 합니다. 예를 들어 `localStorage`와 동기화하는 경우(서버에는 존재하지 않음), `getServerSnapshot`은 `null`이나 기본값을 반환할 수 있습니다. 다만 이 경우 잘못된 콘텐츠가 잠깐 깜빡이는 현상이 발생할 수 있으므로, 이를 처리할 창의적인 디자인 방법을 고민해야 합니다(또는 더 좋은 방법으로, 쿠키나 서버 사이드 상태 관리 솔루션을 사용하세요).

`getServerSnapshot`을 생략하고 컴포넌트가 서버에서 렌더링되면, 리액트는 초기 클라이언트 사이드 렌더링(하이드레이션)이 서버에서 렌더링된 HTML과 일치하기를 기대합니다. 클라이언트에서 `getSnapshot()`이 서버에서 암묵적으로 렌더링된 것과 다른 값을 반환하면 하이드레이션 불일치 오류가 발생합니다. 훅을 사용하는 컴포넌트가 서버에서 서스펜드 상태가 되면(값을 가져올 수 없어서), 클라이언트에서도 `subscribe` 함수가 호출되고 클라이언트 사이드 스냅샷을 사용할 수 있을 때까지 하이드레이션 중에 서스펜드 상태가 됩니다.

### 6. "Next.js, Remix 같은 SSR 프레임워크에서도 사용할 수 있나요?"

네, 물론입니다! 이 훅은 이런 환경에서 외부 스토어를 안전하게 사용하는 데 필수적입니다.

- **스토어가 서버 호환 가능한 경우:** `getServerSnapshot`을 제공하세요.
- **스토어가 브라우저 전용인 경우**(예: `window.matchMedia`):
  - `getServerSnapshot`은 적절한 기본값을 반환해야 합니다(예: 미디어 쿼리는 `false`, `navigator.onLine`은 `true`).
  - 클라이언트 사이드 `getSnapshot`은 하이드레이션 시 실제 브라우저 값을 제공합니다. 리액트가 매끄러운 전환을 보장합니다.
  - `window.matchMedia` 예시입니다.
    ```js
    // 훅 안에서
    const getServerSnapshot = () => false; // 상황에 맞는 기본값
    // ...
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    ```
  - 또는, 적절한 서버 기본값이 없다면 컴포넌트를 클라이언트에서만 조건부로 렌더링하거나, `getServerSnapshot`을 제공하지 않고 하이드레이션 중 서스펜드 상태가 될 것으로 예상하는 경우 `<Suspense>`로 감싸는 방법도 있습니다.

### 7. "Redux, Zustand, Jotai, React Context 대신 언제 사용해야 하나요?"

흔히 혼동되는 부분입니다.

- **React Context:** prop drilling 없이 컴포넌트 트리 전반에 걸쳐 공유해야 하는 리액트 상태에 Context를 사용합니다. _리액트가 관리하는_ 상태를 위한 것입니다.
- **Redux, Zustand, Jotai 등:** 이 라이브러리들의 최신 버전은 동시성 렌더링과 외부 스토어 로직을 연결하기 위해 내부적으로 `useSyncExternalStore`를 사용합니다. 이 라이브러리를 사용하는 *개발자 입장*에서는 보통 제공되는 훅(`useSelector`, `useStore`)을 사용하고 `useSyncExternalStore`를 직접 호출하지 않습니다.

애플리케이션 개발자로서 `useSyncExternalStore`를 직접 사용하는 경우는 다음과 같습니다.

- **리액트를 인식하지 못하는 외부 스토어와 통합하는 경우:** 서드파티 바닐라 JS 라이브러리, 전역 변수, Web Worker, 또는 리액트 외부에서 상태를 관리하고 자체 리액트 바인딩이 없는 시스템.
- **브라우저 API를 직접 구독하는 경우:** `navigator.onLine`, `document.visibilityState`, `window.matchMedia` 등.
- **자체 상태 관리 라이브러리를 만드는 경우:** 새로운 상태 관리 솔루션을 개발한다면, `useSyncExternalStore`가 리액트의 동시성 기능과 호환되게 만드는 기본 빌딩 블록입니다.

즉, `useSyncExternalStore`는 Zustand 같은 라이브러리와 양자택일 관계가 아닙니다. 오히려 이 라이브러리들의 *구현 세부 사항*이거나, 특정 외부 데이터 소스와 인터페이스하는 데 해당 라이브러리가 적합하지 않을 때 직접 사용하는 도구입니다.

### 8. "`getSnapshot` 때문에 무한 루프나 불필요한 리렌더링이 발생합니다!"

리액트는 `Object.is()`를 사용해 이전 스냅샷과 `getSnapshot`이 반환하는 현재 스냅샷을 비교합니다. `getSnapshot`이 매번 새로운 객체나 배열 참조를 반환하면, 기저 데이터가 동일해도 리액트는 상태가 변경되었다고 판단해 리렌더링을 유발합니다.

```js
// 외부 스토어 (예시)
const myExternalStore = {
  _data: { user: { name: 'Alex', preferences: { theme: 'dark' } } },
  listeners: [],
  getData() {
    return this._data;
  },
  subscribe(listener) {
    /* ... */ return () => {
      /* ... */
    };
  },
  // ... _data를 갱신하고 리스너에 알리는 메서드들
};

// ❌ 나쁨: getSnapshot이 항상 새 객체를 반환
function getPreferencesSnapshot_Bad() {
  // 설정이 바뀌지 않아도 매번 새 객체 인스턴스
  return { ...myExternalStore.getData().user.preferences };
}

// ✅ 좋음: 데이터가 같으면 같은 객체 참조를 반환
// 스토어나 스냅샷 로직을 조금 더 똑똑하게 짜야 합니다.

// 옵션 1: 스토어가 선택용 불변 데이터를 직접 관리하는 경우
function getPreferencesSnapshot_Good_Immutable() {
  // myExternalStore.getData().user.preferences가 불변 객체이고,
  // 실제로 바뀔 때만 교체된다고 가정
  return myExternalStore.getData().user.preferences;
}

// 옵션 2: 파생 스냅샷을 수동으로 캐시
let lastKnownPreferences = myExternalStore.getData().user.preferences;
let cachedPreferencesSnapshot = { ...lastKnownPreferences };

function getPreferencesSnapshot_Good_Cached() {
  const currentPreferences = myExternalStore.getData().user.preferences;
  // 얕은 비교. 깊은 객체는 깊은 비교가 필요할 수 있음
  // 또는 중첩 변경 시 스토어가 currentPreferences 참조를 교체하도록 보장
  if (currentPreferences !== lastKnownPreferences) {
    cachedPreferencesSnapshot = { ...currentPreferences };
    lastKnownPreferences = currentPreferences;
  }
  return cachedPreferencesSnapshot;
}
```

**핵심은 참조 안정성입니다.** 데이터가 변경되지 않았다면, `getSnapshot`은 이전과 *정확히 동일한 객체 인스턴스*를 반환해야 합니다. 원시 값(문자열, 숫자, 불리언)이라면 불필요하게 재계산하지 않는 한 덜 문제가 됩니다.

## 보너스: 재사용 가능한 `useMediaQuery` 훅

미디어 쿼리를 위한 재사용 가능한 훅을 만드는 방법입니다. 쿼리가 변경될 수 있는 경우 `useCallback`을 사용해 `subscribe`와 `getSnapshot`을 안정적으로 유지합니다. 이 코드는 [Advanced React APIs](https://www.epicreact.dev/workshops/advanced-react-apis) Epic React 워크숍에서 가져왔습니다.

```ts
import { Suspense, useSyncExternalStore } from 'react';
import * as ReactDOM from 'react-dom/client';

export function makeMediaQueryStore(mediaQuery: string) {
  function getSnapshot() {
    return window.matchMedia(mediaQuery).matches;
  }

  function subscribe(callback: () => void) {
    const mediaQueryList = window.matchMedia(mediaQuery);
    mediaQueryList.addEventListener('change', callback);
    return () => {
      mediaQueryList.removeEventListener('change', callback);
    };
  }

  return function useMediaQuery() {
    return useSyncExternalStore(subscribe, getSnapshot);
  };
}

const useNarrowMediaQuery = makeMediaQueryStore('(max-width: 600px)');

function NarrowScreenNotifier() {
  const isNarrow = useNarrowMediaQuery();
  return isNarrow ? '좁은 화면입니다' : '넓은 화면입니다';
}

function App() {
  return (
    <div>
      <div>좁은 화면 여부:</div>
      <Suspense fallback="...로딩 중...">
        <NarrowScreenNotifier />
      </Suspense>
    </div>
  );
}

const root = ReactDOM.hydrateRoot(rootEl, <App />, {
  onRecoverableError(error) {
    if (String(error).includes('Missing getServerSnapshot')) return;
    console.error(error);
  },
});
```

참고로, `useMediaQuery` 예시에서 동시성 모드를 사용하지 않거나 이 특정 기능에서 테어링을 크게 신경 쓰지 않는 클라이언트 전용 시나리오라면 `useEffect`와 `useState`가 더 간단해 보일 수 있습니다. 하지만 `useSyncExternalStore`는 특히 SSR과 동시성 기능을 함께 사용할 때 가장 견고한 방법입니다. `hydrateRoot`를 사용하는 서버 렌더링을 가정하고 있음에도 `getServerSnapshot`을 제공하지 않은 것은, 서버에서 미디어 쿼리를 확인할 방법이 없기 때문입니다. 따라서 불필요한 오류 로깅을 방지하기 위해 `onRecoverableError` 핸들러를 추가합니다.

## 트러블슈팅 체크리스트

`useSyncExternalStore`를 디버깅할 때 확인할 사항입니다.

- **리액트 버전:** 리액트 18 이상을 사용하고 있나요?
- **안정적인 함수:** `subscribe`와 `getSnapshot` 함수가 안정적인가요(컴포넌트 외부에서 정의하거나 `useCallback`으로 메모이제이션)?
- **`getSnapshot` 순수성 & 성능:** `getSnapshot`이 빠르고 순수하며, 기저 데이터가 변경되지 않았다면 동일한 값 참조(`Object.is` true)를 반환하나요?
- **`subscribe` 정확성:** `subscribe`가 _스토어가 실제로 변경될 때만_ 리액트가 제공한 `callback`을 올바르게 호출하나요? 적절한 `unsubscribe` 함수를 반환하나요?
- **SSR:** SSR을 사용하는 경우 `getServerSnapshot` 함수를 제공했나요? 클라이언트에서 초기에 볼 수 있는 것과 일관된 값이나 안전한 기본값을 반환하나요?
- **외부 상태만:** 이 훅을 정말로 리액트 **외부**에 있는 상태에만 사용하고 있나요? 리액트 상태와 Context에는 각각의 메커니즘이 있습니다.

## 마무리

`useSyncExternalStore`는 동시성 시대에 리액트 컴포넌트를 외부 데이터 소스에 안전하게 연결하는 특화된 강력한 훅입니다. 이 훅의 목적(테어링 방지 및 일관된 읽기 보장)을 이해하고 이러한 모범 사례를 따른다면, 어떤 외부 상태 관리 시스템이나 브라우저 API와도 리액트를 자신 있게 통합할 수 있습니다.

- [`useSyncExternalStore` 공식 리액트 문서](https://react.dev/reference/react/useSyncExternalStore)
- 더 고급 패턴과 사용 사례를 알고 싶다면, Zustand나 Redux(v8 이상) 같은 라이브러리가 이 훅을 내부적으로 어떻게 활용하는지 살펴보는 것이 매우 유익합니다.

즐겁고 안전하게 동기화하세요! 더 고급 패턴과 사용 사례를 원한다면 [Advanced React APIs Epic React 워크숍](https://www.epicreact.dev/workshops/advanced-react-apis)을 확인해보세요!
