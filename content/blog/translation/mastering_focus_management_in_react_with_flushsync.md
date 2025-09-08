---
title: '(번역) 리액트에서 `flushSync`로 포커스 관리 마스터하기'
date: 2025-09-15 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [Mastering Focus Management in React with `flushSync`](https://www.epicreact.dev/mastering-focus-management-in-react-with-flush-sync-f5b38)

포커스 관리는 문제가 생기기 전까지는 잘 인지하지 못하는 부분입니다. 하지만 한 번이라도 문제가 발생하면 앱이 어색하게 동작하거나, 접근성이 떨어지거나, 혹은 아예 잘못된 것처럼 느껴질 수 있습니다. 오늘은 포커스 관리를 제대로 할 수 있게 도와주지만, 잘 알려지지 않은 리액트 API인 [`flushSync`](https://react.dev/reference/react-dom/flushSync)에 대해 말씀드리겠습니다.

## 리액트에서 포커스 관리가 까다로운 이유

리액트는 DOM을 빠르고 똑똑하게 업데이트합니다. `setShow(true)`와 같은 상태 업데이트 함수를 호출하면 리액트는 즉시 리렌더링하지 않고, 이벤트 핸들러가 끝난 뒤 한 번에 상태 업데이트를 처리합니다. 성능상으로는 좋지만, 상태 변경 _직후에_ DOM과 상호작용해야 할 때 문제가 생길 수 있습니다.

예를 들어 보겠습니다.

```jsx
function MyComponent() {
  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(true)}>Show</button>
      {show ? <input /> : null}
    </div>
  );
}
```

여기서 인풋이 나타나자마자 포커스를 주고 싶다고 해봅시다. 아마 아래와 같이 작성할 겁니다.

```jsx
function MyComponent() {
  const inputRef = useRef < HTMLInputElement > null;
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          setShow(true);
          inputRef.current?.focus(); // 아마 작동하지 않을 겁니다!
        }}
      >
        Show
      </button>
      {show ? <input ref={inputRef} /> : null}
    </div>
  );
}
```

하지만 이건 동작하지 않습니다! 이유는 `setShow(true)`를 호출했을 때 리액트는 업데이트를 *예약*할 뿐, 핸들러가 끝나기 전까지는 적용하지 않기 때문입니다. 따라서 인풋이 DOM에 존재하기도 전에 포커스를 시도하게 됩니다.

## setTimeout이나 requestAnimationFrame을 쓰면 안 되나요?

저 역시 경력 초창기에는 포커스 호출을 `setTimeout`이나 `requestAnimationFrame`으로 감싸서 해결하려 했습니다. 가끔은 잘 되지만, 가끔은 안 됐습니다. 브라우저나 기기, 앱의 다른 동작 상황에 따라 달라졌습니다. 따라서 이 방법은 신뢰할 수 없었고 임시방편에 불과했습니다.

```tsx
onClick={() => {
  setShow(true)
  setTimeout(() => {
    inputRef.current?.focus()
  }, 10) // 🤞
}}
```

하지만 이건 그냥 운에 맡기는 겁니다. 매직 넘버에 의존하거나 브라우저가 빨리 업데이트해 주길 기대하는 건 좋은 방법이 아닙니다. 우리는 확실히 보장된 방법이 필요합니다.

## `flushSync`의 등장

`react-dom`의 [`flushSync`](https://react.dev/reference/react-dom/flushSync)는 이런 상황을 위한 탈출구입니다. 리액트에게 “성능을 위해 배치 업데이트를 하는 걸 알지만, 이번 업데이트는 _지금 당장_ 처리해야 해”라고 알려주는 역할을 합니다. `flushSync` 콜백 안에서 발생한 상태 업데이트는 즉시 적용되어, 콜백이 끝날 때 DOM이 최신 상태가 됩니다.

예시는 다음과 같습니다.

```tsx
import { flushSync } from 'react-dom';

function MyComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState(false);

  return (
    <div>
      <button
        onClick={() => {
          flushSync(() => {
            setShow(true);
          });
          inputRef.current?.focus();
        }}
      >
        Show
      </button>
      {show ? <input ref={inputRef} /> : null}
    </div>
  );
}
```

이제 버튼을 클릭하면 인풋이 즉시 나타나고 자동으로 포커스를 받습니다. 더 이상 임시방편도, 운에 맡기는 일도 없습니다. 안정적인 포커스 관리가 가능해집니다.

## 실전 예시: EditableText

[Epic React 고급 리액트 API 워크숍](https://www.epicreact.dev/workshops/advanced-react-apis)의 예시를 보겠습니다. [Ryan Florence](https://x.com/ryanflorence)님께서 제공해 주신 컴포넌트인데요, `<EditableText />`라는 컴포넌트는 사용자가 텍스트를 인라인으로 수정할 수 있게 해 줍니다. 버튼을 누르면 인풋으로 바뀌고, 제출하거나 블러 되거나 ESC 키를 누르면 다시 버튼으로 돌아갑니다. 우리가 원하는 동작은 다음과 같습니다.

- 수정이 시작되면 인풋에 포커스를 주고 텍스트를 선택합니다.

- 수정이 끝나면(제출, 블러, 또는 ESC키) 버튼으로 포커스를 돌려줍니다.

구현은 다음과 같습니다.

```tsx
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

function EditableText({
  initialValue = '',
  fieldName,
  inputLabel,
  buttonLabel,
}: {
  initialValue?: string;
  fieldName: string;
  inputLabel: string;
  buttonLabel: string;
}) {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return edit ? (
    <form
      onSubmit={event => {
        event.preventDefault();
        flushSync(() => {
          setValue(inputRef.current?.value ?? '');
          setEdit(false);
        });
        buttonRef.current?.focus();
      }}
    >
      <input
        required
        ref={inputRef}
        type="text"
        aria-label={inputLabel}
        name={fieldName}
        defaultValue={value}
        onKeyDown={event => {
          if (event.key === 'Escape') {
            flushSync(() => {
              setEdit(false);
            });
            buttonRef.current?.focus();
          }
        }}
        onBlur={event => {
          flushSync(() => {
            setValue(event.currentTarget.value);
            setEdit(false);
          });
          buttonRef.current?.focus();
        }}
      />
    </form>
  ) : (
    <button
      aria-label={buttonLabel}
      ref={buttonRef}
      type="button"
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef.current?.select();
      }}
    >
      {value || 'Edit'}
    </button>
  );
}
```

이 접근법은 사용자가 얼마나 빠르게 UI와 상호작용하든, 포커스가 항상 기대한 대로 정확하게 유지되도록 보장합니다.

## 키보드 접근성: 일부 사용자만을 위한 것이 아닙니다

왜 이렇게까지 포커스를 신경 써야 할까요? 이유는 키보드 접근성이 모든 사람에게 중요하기 때문입니다. 장애로 인해 키보드에 의존하하는 사람들도 있지만, 단순히 키보드를 선호하는 많은 파워 유저(저와 아마 이 글을 읽는 분들 포함)들도 존재 합니다. 포커스 관리가 깨지면 키보드 내비게이션이 답답하거나 불가능해집니다. 올바른 포커스 관리는 다음과 같은 경험을 제공합니다.

- 편집 가능한 텍스트에 탭으로 들어왔을 때, 엔터 키를 누르거나 클릭하면 인풋에 포커스가 가고 텍스트가 선택됩니다.

- 편집을 마치면(제출, 블러, ESC키) 다시 버튼에 포커스가 돌아가, 계속해서 탭으로 UI를 탐색할 수 있다.

이런 디테일이 앱을 모든 사용자에게 즐겁게 만드는 요소입니다.

## `flushSync`를 언제 사용해야 할까요?

- **포커스 관리**: 상태 업데이트 이후에만 존재하는 요소로 포커스를 옮겨야 할 때

- **서드파티 통합**: DOM이 즉시 업데이트 되기를 기대하는 브라우저 API 또는 다른 라이브러리의 동작을 리액트 업데이트를 즉시 동기화해야 할 때 (예: `onbeforeprint`)

하지만 주의하셔야 합니다! [`flushSync`](https://react.dev/reference/react-dom/flushSync)는 성능 최적화 측면에서 손해를 보는 선택입니다. 꼭 필요한 경우에만, 정말 즉각적인 DOM 업데이트가 필요할 때만 사용해야 합니다. 대부분의 경우 리액트의 기본 비동기 업데이트 방식으로 충분합니다.

## 마치며

포커스 관리는 미묘하지만 접근 가능하고 즐거운 리액트 앱을 만드는 데 매우 중요한 부분입니다. `flushSync`는 리액트의 일반적인 업데이트 흐름에서 벗어나 _지금 당장_ 무언가를 실행해야 할 때 사용할 수 있는 강력한 도구입니다. 현명하게 사용하시면, 사용자는 확실히 더 나은 경험을 하게 될 것입니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
