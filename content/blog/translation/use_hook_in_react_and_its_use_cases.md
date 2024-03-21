---
title: '(번역) 리액트의 use 훅과 사용 예제'
date: 2024-03-26 01:00:00
category: 'Translation'
draft: false
---

> 원문 : [use Hook in React and its use cases](https://reetesh.in/blog/use-hook-in-react-and-its-use-cases)

`use` 훅은 리액트 19 버전에 도입 될 새로운 훅입니다. **컨텍스트**와 **프로미스**로 작업할 때 매우 유용합니다.

`use` 훅과 다른 훅의 주요 차이점은 `use` 훅은 루프와 `if`와 같은 조건문 내에서 호출할 수 있다는 점입니다. 그러나 **함수** 컴포넌트나 **커스텀** 훅에서만 사용할 수 있다는 기본 컨셉은 다른 훅과 동일합니다.

서버 컴포넌트에서 데이터를 가져와 클라이언트 컴포넌트에 전달할 수 있는 RSC(리액트 서버 컴포넌트)가 등장했습니다. 여기서 `use` 훅이 중요한 역할을 합니다. `use` 훅을 사용하면 프로미스와 컨텍스트에서 값을 가져올 수 있습니다.

### use 훅의 중요한 포인트

- `use` 훅은 루프 및 조건문 내에서 호출할 수 있습니다.
- `use` 훅을 통해 프로미스 또는 컨텍스트에서 읽은 값을 반환할 수 있습니다.
- 서버 컴포넌트에서 데이터를 가져올 때는 use보다 async 및 await를 사용하는 것이 적합할 수 있습니다. async 및 await은 await가 호출된 시점부터 렌더링을 시작하는 반면, use는 데이터를 가져온 후 컴포넌트를 다시 렌더링합니다.

## use 훅을 사용하여 프로미스 처리하기

```jsx
// 서버 컴포넌트

import { fetchMessage } from './lib.js';
import { Message } from './message.js';

const App = () => {
  const messagePromise = fetchMessage();
  return <Message messagePromise={messagePromise} />;
};

export default App;
```

위 코드에서 볼 수 있듯이 서버 컴포넌트에서 메시지 데이터를 가져와 클라이언트 컴포넌트로 전달하고 있습니다. 이제 클라이언트 컴포넌트에서 `use` 훅을 사용하여 이 프로미스를 사용할 수 있습니다.

```jsx
// 클라이언트 컴포넌트(message.js)

'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Here is the message: {messageContent}</p>;
}
```

여기서는 `use` 훅을 사용하여 프로미스에서 메시지를 가져와 클라이언트 컴포넌트에서 사용하고 있습니다.

하지만 잠시만요! 여기서 여러분은 프로미스의 **로딩** 및 **에러** 상태는 어떻게 해야 할 지 궁금하실 겁니다. 여기서 `suspense`와 `error boundary`가 등장합니다.

클라이언트 컴포넌트를 `suspense`와 `error boundary`로 감싸서 **로딩** 및 **에러** 상태를 처리하면 됩니다.

```jsx
import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

const App = () => {
  const messagePromise = fetchMessage();

  return;
  <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
    <Suspense fallback={<p>Loading...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  </ErrorBoundary>;
};

export default App;
```

에러 처리에 `error boundary`를 사용하고 싶지 않다면 어떻게 해야 할까요? 리액트는 서버 컴포넌트에서 에러를 포착하여 클라이언트 컴포넌트로 전달하는 방법을 제공합니다.

```jsx
import { use, Suspense } from 'react';
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

const App = () => {
  const messagePromise = new Promise((resolve, reject) => {
    fetchMessage()
      .then(res => resolve(res))
      .catch(error => {
        resolve(error.message || 'Something went wrong');
      });
  });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
};

export default App;
```

## use 훅을 사용하여 컨텍스트 처리하기

지금까지는 **컨텍스트**에서 값을 가져오기 위해 `useContext`를 사용해야 했습니다. 하지만 이제 `use` 훅의 도움으로 클라이언트 컴포넌트에서 컨텍스트 값을 사용할 수 있습니다.

`use` 훅은 루프와 조건문 내에서 유연하게 사용할 수 있으므로 컨텍스트에서 값을 가져올 때는 `use` 훅을 사용하는 것이 좋습니다.

```jsx
// 컨텍스트 컴포넌트

'use client';

import { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState('Hello from context!');

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};
```

간단한 컨텍스트를 생성하고 컨텍스트에 값을 제공했습니다. 이제 클라이언트 컴포넌트에서 `use` 훅을 사용하여 이 컨텍스트 값을 사용할 수 있습니다.

```jsx
'use client';

import { AppContext } from '@/contexts/app-context';
import { use } from 'react';

const ContextExample = () => {
  const { state, setState } = use(AppContext);

  return (
    <div>
      <h1>{state}</h1>
      <button onClick={() => setState('Hello from context component!')}>
        Change
      </button>
    </div>
  );
};
export default ContextExample;
```

위에서 볼 수 있듯이 `use` 훅을 사용하여 컨텍스트에서 값을 가져오고 초깃값을 렌더링하고 있습니다. 또한 `setState`를 사용하여 컨텍스트의 값을 업데이트할 수도 있습니다.

이제 조건문에서 어떻게 사용할 수 있는지 바로 살펴보겠습니다.

```jsx
'use client';

import { AppContext } from '@/contexts/app-context';
import { use } from 'react';

const ContextExample = () => {
  const [active, setActive] = useState(false);
  const { state, setState } = use(AppContext);

  if (active) {
    return (
      <div>
        <h1>{state}</h1>
        <button onClick={() => setState('Hello from context component!')}>
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Click the button to activate the context</h1>
      <button onClick={() => setActive(true)}>Activate</button>
    </div>
  );
};

export default ContextExample;
```

여기서는 조건문 내에 `use` 훅을 사용하여 조건에 따라 다른 컴포넌트를 렌더링합니다.

## 결론

`use` 훅은 리액트 19에 도입될 RSC에서 중요한 역할을 할 것입니다. Next.JS 최신 버전에서는 이미 서버 컴포넌트로 데이터 페칭이 얼마나 간소화되었는지 살펴봤습니다.

또한 `use` 훅의 유연성 덕분에 더욱 역동적으로 사용할 수 있습니다. 컨텍스트와 프로미스를 다루는 데 매우 유용할 것입니다. 이 글의 전체 소스 코드는 [여기](https://github.com/Virous77/blog-projects/tree/main/use-hook)에서 확인할 수 있습니다.

이 글이 도움이 되셨기를 바랍니다. 질문이나 제안 사항이 있으면 아래에 언제든지 의견을 남겨 주세요. 여러분의 피드백은 감사히 받겠습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해 주세요!
