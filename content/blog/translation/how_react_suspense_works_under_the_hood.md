---
title: '(번역) 리액트 서스펜스의 내부 작동 원리: 프로미스를 던지기와 선언적 비동기 UI'
date: 2025-08-01 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [How React Suspense Works Under the Hood: Throwing Promises and Declarative Async UI](https://www.epicreact.dev/how-react-suspense-works-under-the-hood-throwing-promises-and-declarative-async-ui-plbrh)

## 도입: 리액트에서 비동기 UI가 어려운 이유

리액트에서 데이터를 가져오는 것은 쉽지만, 데이터를 기다리는 동안 사용자 경험을 처리하는 것은 쉽지 않습니다. 스피너, 로딩 상태, 에러 메시지 등은 종종 컴포넌트를 복잡하게 만들고, 유지보수를 어렵게 만듭니다. 리액트가 다른 부분처럼 비동기 UI도 선언적으로 처리할 수 있다면 얼마나 좋을까요?

그게 바로 리액트 서스펜스가 설계된 이유입니다. 이번에는 그 작동 원리를 깊이 들여다보며, 왜 이 기능이 똑똑한지, 그리고 어떻게 여러분의 비동기 UI를 단순화할 수 있는지 알아보겠습니다.

## 리액트 서스펜스란?

리액트 서스펜스는 비동기 데이터를 사용하는 컴포넌트에 대해 로딩 및 에러 상태를 선언적으로 지정할 수 있게 해주는 메커니즘입니다. 로딩 및 에러 상태를 직접 추적하는 대신, 컴포넌트 트리를 `<Suspense>`로 감싸기만 하면 나머지는 리액트가 처리해 줍니다.

놀라운 점은 서스펜스가 throw된 프로미스를 잡는 방식으로 작동한다는 것입니다 😱. 컴포넌트가 준비되지 않은 데이터에 접근하려고 하면, 해당 컴포넌트는 프로미스를 throw 합니다. 리액트는 이 프로미스를 catch 하여 렌더링을 잠시 멈추고, `<Suspense>`에 제공된 fallback UI를 표시합니다. 프로미스가 resolve되면, 리액트는 다시 렌더링을 시도합니다.

이런일이 가능한 이유는 자바스크립트에서 throw를 통해 함수의 실행을 동기적으로 멈출 수 있기 때문입니다. 리액트는 이 동작을 활용하여 데이터가 준비될 때까지 렌더링을 “일시정지”하는 것입니다.

## `use` 훅과 서스펜스의 관계

React 19 버전에서는 `use` 훅이 이 패턴의 핵심입니다. `await`을 사용하는 대신, 프로미스를 `use`에 전달하면, 준비된 경우 결괏값을 반환하고, 준비되지 않은 경우 프로미스를 throw 합니다.

```jsx
function PhoneDetails() {
  const details = use(phoneDetailsPromise);
  // 이 시점에서 details는 이미 준비되어 있습니다!
}
```

그렇다면 `phoneDetailsPromise`는 어디서 정의할까요? 이 프로미스는 렌더링 함수 바깥에서 생성해야, 렌더링될 때마다 매번 요청을 새로 보내는 것을 방지할 수 있습니다. 아래 예시를 보겠습니다.

```jsx
// 이 코드는 이벤트 핸들러 등에서 실행될 수 있으며,
// 클라이언트 컴포넌트의 본문 안에서는 실행하지 않아야 합니다.
// 서버 컴포넌트는 `use`를 사용할 수 없기 때문에 `fetch`를 직접 사용하면 됩니다.
const phoneDetailsPromise = fetch('/api/phone-details').then(res => res.json());
```

만약 프로미스가 아직 resolve되지 않았다면, `use`는 프로미스를 throw 하여 서스펜스를 트리거 합니다. resolve된 경우엔 값을 그대로 반환합니다.

## 에러 처리: 서스펜스와 에러 바운더리

프로미스가 reject되면, 리액트는 에러 바운더리를 찾아 그 fallback UI를 렌더링 합니다. 이렇게 하면 로딩 상태와 마찬가지로 에러 상태도 선언적으로 처리할 수 있습니다.

```jsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary fallback={<div>문제가 발생했습니다.</div>}>
      <Suspense fallback={<div>휴대전화 정보를 불러오는 중...</div>}>
        <PhoneDetails />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## 실전 예시: 간단한 서스펜스 기반 데이터 페처 만들기

이번에는 서스펜스를 활용한 간단한 데이터 페처를 직접 만들어 보겠습니다.

```jsx
let userPromise;
function fetchUser() {
  userPromise = userPromise ?? fetch('/api/user').then(res => res.json());
  return userPromise;
}

function UserInfo() {
  const user = use(fetchUser());
  return <div>안녕하세요, {user.name}님!</div>;
}

function App() {
  return (
    <Suspense fallback={<div>사용자 정보를 불러오는 중...</div>}>
      <UserInfo />
    </Suspense>
  );
}
```

`UserInfo` 안에서는 로딩 상태나 에러 상태를 직접 처리하지 않았다는 점에 주목해 주세요. 서스펜스와 에러 바운더리가 모든 처리를 맡아줍니다.

이 예제를 더 확장하여 매개변수를 추가하거나 캐시를 도입하는 것도 상상해 볼 수 있습니다. 이러한 심화 내용을 자세히 다루는 [Epic React Suspense 워크숍](https://www.epicreact.dev/workshops/react-suspense)에 함께하시면, `use` 훅의 구현을 처음부터 직접 만들어 보며 내부 동작 원리를 완전히 _이해하실_ 수 있습니다 😉

## 결론

이 패턴의 장점은 다음과 같습니다.

- **선언적(Declarative)**: 로딩/에러 상태 관리를 직접 하지 않아도 됩니다.

- **조합 가능(Composable)**: 데이터, 이미지, 코드 등 어떤 비동기 리소스와도 함께 쓸 수 있습니다.

- **확장 가능(Scalable)**: 서스펜스 경계를 중첩하여 세밀한 제어가 가능합니다.

- **미래 지향적(Future-proof)**: 클라이언트에서 비동기 UI를 처리하는 리액트의 “표준” 방식입니다.

리액트 서스펜스는 비동기 UI 처리에 매우 적합합니다. 프로미스를 “던지고(throw)”, `use` 훅을 사용하는 방식으로, 더욱 깔끔하고 선언적인 컴포넌트를 작성할 수 있습니다. 다음 프로젝트에서 꼭 사용해 보시고, 코드가 얼마나 간결해지는지 직접 경험해 보시기 바랍니다!

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
