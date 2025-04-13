---
title: 'React Router의 useBlocker 훅을 통한 웹뷰 환경의 안드로이드 물리 버튼 뒤로 가기 처리'
date: 2025-04-14 01:00:00
category: 'DevLog'
draft: false
---

웹앱 개발에서 특히 안드로이드 웹뷰 환경을 다루다 보면 물리 뒤로 가기 버튼 처리가 까다로운 문제가 되곤 한다. 이 글에서는 이러한 문제 상황을 React Router의 `useBlocker` 훅을 활용해 안정적으로 해결하는 방법을 알아보려고 한다.

## 문제 상황: 안드로이드 웹뷰의 뒤로 가기 처리

일반적으로 안드로이드 웹뷰에서는 브라우저의 히스토리 스택을 기반으로 뒤로 가기를 처리한다. 사용자가 물리 뒤로 가기 버튼을 누르면 웹뷰는 히스토리 스택에서 이전 페이지로 이동하게 된다. 보통은 네이티브에서 아래와 같은 방식으로 물리 뒤로 가기 키에 대한 동작을 웹뷰의 히스토리 기반으로 처리하도록 한다.

```java
override fun onBackPressed() {
        if (webView.canGoBack()) {
            // 웹뷰 히스토리가 있으면 뒤로 가기
            webView.goBack()
        } else {
            // 히스토리가 없으면 기본 뒤로 가기 동작
            super.onBackPressed()
        }
    }
```

하지만 실제 서비스에서는 다음과 같은 경우에 단순 히스토리 기반 뒤로 가기가 아니라 커스텀 로직이 필요한 상황이 자주 발생한다.

1. **폼 작성 중 실수로 뒤로 가기를 눌렀을 때**: 사용자가 입력 중인 데이터가 손실될 수 있어 경고 확인이 필요한 경우
2. **결제 프로세스 진행 중일 때**: 사용자가 결제 프로세스를 임의로 중단하지 못하도록 제어해야 하는 경우
3. **특정 화면에서는 뒤로 가기 시 홈으로 이동해야 할 때**: 일반적인 히스토리 스택과 다른 내비게이션 흐름이 필요한 경우
4. **모달이 열려있을 때**: 뒤로 가기 시 페이지 이동이 아닌 모달을 닫아야 하는 경우

예시로 든 상황 외에도 서비스의 기획 요구사항에 따라 자연스러운 히스토리 동작이 아닌 커스텀한 동작이 필요한 케이스가 존재한다. 일반적으로 이런 상황에서 `popstate` 이벤트나 `history.pushState()`를 활용한 해결책이 많이 사용되었다. 기본 뒤로 가기 동작을 막고 이벤트 리스너를 통해 커스텀한 동작을 정의하는 방식이다.

```javascript
// 뒤로 가기 방지를 위한 기존 접근법 (불안정한 방식)
useEffect(() => {
  const preventGoBack = () => {
    // 사용자 정의 로직 실행
    history.pushState(null, '', location.href);
    alert('뒤로 가기가 비활성화되어 있습니다.');
  };

  history.pushState(null, '', location.href);
  window.addEventListener('popstate', preventGoBack);

  return () => window.removeEventListener('popstate', preventGoBack);
}, []);
```

하지만 이 방식은 여러 가지 문제점을 가지고 있다.

- **불안정한 동작**: 브라우저나 웹뷰 구현에 따라 일관되지 않게 작동할 수 있다. 뒤로 가기를 여러 번 누르는 경우 예상치 못한 동작이 발생할 수 있다.
- **무한 루프 위험**: 잘못 구현하면 popstate 이벤트가 계속 발생하는 무한 루프에 빠질 수 있다.
- **사용자 경험 저하**: 뒤로 가기가 아예 작동하지 않으면 사용자 경험이 나빠지게 된다.
- **브라우저 간 호환성 문제**: 브라우저마다 다른 동작을 보일 수 있다.

## React Router의 `useBlocker` 훅 소개

React Router v6에서 소개된 `useBlocker` 훅은 위와 같은 문제를 더욱 안정적으로 해결할 수 있는 방법을 제공한다. 이 훅을 사용하면 사용자의 내비게이션을 조건부로 차단하고, 원하는 로직을 실행할 수 있다. 사용법은 쉽게 말하면 `useBlocker`의 반환 값이 `true`일 때 라우트 변경을 차단하고, `false`일 때 라우트 변경을 허용하는 것이다. 기본적인 사용 예시는 아래와 같다.

```javascript
import { useBlocker } from 'react-router-dom';

// 기본 사용법 - 라우트 변경 시 차단
const blocker = useBlocker(
  ({ currentLocation, nextLocation }) =>
    currentLocation.pathname !== nextLocation.pathname
);

// 위치와 액션 모두 활용하는 예시
const blocker = useBlocker(
  ({ currentLocation, nextLocation, historyAction }) => {
    // 뒤로 가기(POP) 액션일 때만 차단하는 조건
    if (historyAction === 'POP') {
      return true; // 뒤로 가기 막기
    }

    // 또는 특정 경로에서 특정 액션만 차단
    if (
      currentLocation.pathname === '/important-form' &&
      historyAction === 'POP'
    ) {
      return true; // 중요한 폼 페이지에서 뒤로 가기만 차단
    }

    // 그 외의 경우는 차단하지 않음
    return false;
  }
);
```

`useBlocker` 훅의 주요 특징은 다음과 같다.

1. **조건부 차단**: 현재 위치와 다음 위치를 비교하여 특정 조건에서만 내비게이션을 차단할 수 있다.
2. **내비게이션 유형 감지**: `POP`, `PUSH`, `REPLACE` 등 다양한 내비게이션 유형을 감지하고 각각에 맞는 처리가 가능하다.
3. **프로그래매틱 제어**: 차단 후 프로그래밍 방식으로 내비게이션을 계속하거나 취소할 수 있다.

위 특징들을 적절히 활용하면 안드로이드 웹뷰의 물리 뒤로 가기 버튼 동작도 안정적으로 제어할 수 있다.

## useBlocker를 활용한 실제 구현 사례

실제로 어떻게 활용할 수 있는지 몇 가지 예제를 통해 알아본다.

### 1. 폼 데이터 손실 방지

사용자가 폼 작성 중에 실수로 뒤로 가기를 눌렀을 때 데이터 손실을 방지하는 예제이다.

```jsx
import { useBlocker, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function FormPage() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isFormDirty, setIsFormDirty] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 폼이 변경되었을 때만 내비게이션 차단
  const blocker = useBlocker(
    ({ currentLocation, nextLocation, historyAction }) => {
      // POP 액션(뒤로 가기)일 때만 차단
      return isFormDirty && historyAction === 'POP';
    }
  );

  // 사용자 선택에 따른 처리
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm(
        '작성 중인 내용이 있습니다. 정말 페이지를 떠나시겠습니까?'
      );

      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsFormDirty(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // 폼 제출 처리
    setIsFormDirty(false);
    navigate('/success');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <button type="submit">제출</button>
    </form>
  );
}
```

### 2. 특정 경로의 내비게이션 커스터마이징

특정 페이지에서 뒤로 가기 시 히스토리 스택의 이전 페이지가 아닌 홈으로 이동하게 하는 예제이다.

```jsx
import { useBlocker, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function SpecialPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 뒤로 가기(POP) 액션만 차단
  const blocker = useBlocker(({ historyAction }) => historyAction === 'POP');

  // 뒤로 가기 차단 시 홈으로 리다이렉트
  useEffect(() => {
    if (blocker.state === 'blocked') {
      // 차단 리셋 후 홈으로 이동
      blocker.reset();
      navigate('/', { replace: true });
    }
  }, [blocker, navigate]);

  return (
    <div>
      <h1>특별 페이지</h1>
      <p>이 페이지에서 뒤로 가기를 누르면 홈으로 이동합니다.</p>
    </div>
  );
}
```

### 3. 모달이 열려있을 때 뒤로 가기 처리

모달이 열려있을 때 뒤로 가기 버튼을 누르면 모달을 닫도록 하는 예제이다:

```jsx
import { useBlocker } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PageWithModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달이 열려있을 때만 내비게이션 차단
  const blocker = useBlocker(
    ({ historyAction }) => isModalOpen && historyAction === 'POP'
  );

  // 뒤로 가기 시 모달 닫기
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setIsModalOpen(false);
      blocker.reset();
    }
  }, [blocker]);

  return (
    <div>
      <h1>메인 페이지</h1>
      <button onClick={() => setIsModalOpen(true)}>모달 열기</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>모달 제목</h2>
            <p>모달 내용...</p>
            <button onClick={() => setIsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. 결제 프로세스 보호

결제 프로세스 중에 사용자가 실수로 뒤로 가기를 누르는 것을 방지하는 예제이다:

```jsx
import { useBlocker, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function PaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState('preparing'); // preparing, processing, completed, failed
  const navigate = useNavigate();

  // 결제 중일 때만 내비게이션 차단
  const blocker = useBlocker(({ historyAction }) => {
    return paymentStatus === 'processing' && historyAction === 'POP';
  });

  // 결제 중 뒤로 가기 처리
  useEffect(() => {
    if (blocker.state === 'blocked') {
      alert('결제가 진행 중입니다. 페이지를 떠날 수 없습니다.');
      blocker.reset();
    }
  }, [blocker]);

  const startPayment = () => {
    setPaymentStatus('processing');

    // 결제 프로세스 시뮬레이션
    setTimeout(() => {
      setPaymentStatus('completed');
      // 결제 완료 후 자동으로 결과 페이지로 이동
      navigate('/payment-success');
    }, 3000);
  };

  return (
    <div>
      <h1>결제 페이지</h1>
      {paymentStatus === 'preparing' && (
        <button onClick={startPayment}>결제 시작</button>
      )}

      {paymentStatus === 'processing' && (
        <div>
          <p>결제가 진행 중입니다. 잠시만 기다려주세요...</p>
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  );
}
```

## 사용 시 고려 사항

`useBlocker`를 활용할 때 다음 사항들을 고려해야 한다.

1. **사용자 경험**: 내비게이션을 무작정 차단하기보다는 사용자에게 선택권을 제공하는 것이 좋다. 확인 다이얼로그를 통해 사용자가 계속 진행할지 선택할 수 있게 해야 한다.

2. **상태 관리**: `blocker.state`가 변경될 때마다 적절한 처리가 필요하다. `useEffect`를 활용하여 상태 변화를 감지하고 처리해야 한다.

3. **조건 설정**: 모든 내비게이션을 차단하기보다 `historyAction`과 `currentLocation`, `nextLocation`을 활용하여 필요한 경우에만 차단하는 것이 바람직하다.

4. **웹뷰 통합**: 안드로이드 웹뷰에서 사용할 때는 웹뷰의 특성을 고려해야 한다. 웹뷰와 네이티브 앱 간 통신이 필요한 경우 추가 설정이 필요할 수 있다.

## 결론

안드로이드 웹뷰 환경에서 물리 뒤로 가기 버튼을 처리하는 것은 웹 개발에서 까다로운 문제 중 하나이다. React Router의 `useBlocker` 훅은 이 문제를 해결하기 위한 안정적이고 선언적인 방법을 제공한다.

`popstate` 이벤트나 `history.pushState()`를 직접 조작하는 방식은 브라우저 호환성 문제와 예측하기 어려운 동작으로 인해 운영 환경에서는 권장되지 않지만 `useBlocker`는 React Router의 공식 API로서 안정적인 동작을 보장하며, 다양한 내비게이션 시나리오를 우아하게 처리할 수 있다.

복잡한 웹앱을 개발할 때 `useBlocker`를 활용하여 사용자 경험을 향상하고, 데이터 손실을 방지하며, 안정적인 내비게이션 흐름을 구현할 수 있다. 특히 안드로이드 웹뷰 환경에서 물리 버튼의 뒤로 가기를 처리할 때 유용하게 활용될 수 있는 방법이라고 생각한다.

---

> 혹시 이 글의 내용 중 잘못된 부분이 있거나 추가적인 질문이 있으면 댓글로 남겨주시기를 바랍니다.
