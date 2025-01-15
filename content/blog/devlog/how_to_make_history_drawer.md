---
title: '웹뷰 환경에서 History 스택을 활용한 오버레이 컴포넌트(바텀시트, 드로어, 모달) 제어 구현하기'
date: 2025-01-17 01:00:00
category: 'DevLog'
draft: true
---

## 도입

최근 진행 중인 프로젝트는 네이티브 앱 기반으로 대부분의 페이지가 웹뷰로 되어있는 웹뷰 중심의 서비스이다. 네이티브 앱와 웹뷰 조합의 서비스에서는 여러가지 고려해야할 사항이 많지만, 뒤로가기에 대한 처리가 꼭 필요하다.
일반적으로는 뒤로가기 버튼이나, 특정 CTA를 통해서 페이지 라우팅을 제어할 수 있지만, 안드로이드의 경우 물리 뒤로가기 버튼이 존재하기 때문에 이 부분에 대한 고려가 필요하다.

그래서 제일 자연스러운 방법으로는 아래와 같이 웹뷰의 히스토리가 존재하면 브라우저의 뒤로가기, 즉 `history.back()`을 수행하고, 히스토리가 없다면 안드로이드의 기본적인 물리 뒤로가기 동작을 수행하도록 하는 것이다. (안드로이드 코드에 대해서는 무지하기 때문에, 아래 코드는 참고정도만 하는게 좋다.)

```java
override fun onBackPressed() {
        if (webView.canGoBack()) {
            // 웹뷰 히스토리가 있으면 뒤로가기
            webView.goBack()
        } else {
            // 히스토리가 없으면 기본 뒤로가기 동작
            super.onBackPressed()
        }
    }
```

보통을 이렇게만해도 물리 뒤로가기 버튼을 눌렀을 때, 웹뷰의 히스토리대로 동작하기 때문에 큰 플로우상에는 문제가 없다! 그럼 문제해결! 이라고 생각했지만, 여러가지 예외사항이 존재한다. 그 중에서 이 글에서는 드로어, 바텀시트, 모달과 같은 기존 화면 위에 등장하는 오버레이(overlay) UI 컴포넌트가 물리 뒤로가기 키로 닫히지 않고 이전 페이지로 돌아가는 부분에 대해 다룰 것이다.

기본적으로 오버레이 UI 컴포넌트는 바깥 영역을 클릭하거나, 닫기 버튼을 통해서도 닫히기 때문에 별다른 히스토리 조작이 필요하지 않을 수 있다. 하지만 물리적인 뒤로가기 키가 존재하는 안드로이드 환경에서는 물리 키를 통해서도 드로어나 바텀시트가 닫히도록 구현해야 사용자게에 네이티브 앱과 같은 사용자 경험을 줄 수 있다.

그래서 물리 뒤로가기 키에 대해서 위와 같이 웹뷰의 히스토리 기반으로 동작하는 상황에서는 오버레이 UI 컴포넌트가 열릴 때마다 히스토리를 쌓아줄 수 있어야, 네이티브 앱과 같은 동작을 할 수 있었다. 그래서 첫 번째로 시도한 방식이 브라우저의 History API를 사용하는 방식이었다.

## History API를 통한 구현

브라우저에서는 브라우저의 히스토리를 제어하기 위해 [History API](https://developer.mozilla.org/ko/docs/Web/API/History)를 제공하는데, `pushState`, `replaceState`와 같은 메서드를 통해 페이지를 이동하지 않고도 히스토리 스택을 쌓을 수 있다. 그렇기 때문에 오버레이 컴포넌트가 `open` 될 때, `pushState` (혹은 상황에 따라 `replaceState`)를 통해 새로운 히스토리를 쌓고 컴포넌트를 닫을 때, `history.back()`을 통해 쌓았던 히스토리를 제거하는 방식을 적용해볼 수 있다.

하지만 `history.back()`이 컴포넌트의 닫기 버튼 또는 브라우저의 뒤로가기를 통해 발생했을 때, 오버레이 컴포넌트의 상태 또한 변경해줘야 한다. 그렇기 때문에 브라우저 뒤로가기 시 컴포넌트의 상태를 히스토리와 동기화 하기 위해 [`popstate`](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event) 이벤트를 통해서 뒤로가기 동작이 일어났을 때 발생시킬 이벤트 핸들러를 등록하는 방식을 사용해야 한다.

위의 방식을 적용하면 아래 예시와 같이 구현해볼 수 있다.

```tsx
function useOverlayHistory(id: string) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 히스토리 상태와 컴포넌트 상태 동기화
      setIsOpen(event.state?.overlayId === id);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [id]);

  const open = useCallback(() => {
    history.pushState({ overlayId: id }, '');
    setIsOpen(true);
  }, [id]);

  const close = useCallback(() => {
    history.back();
  }, []);

  return { isOpen, open, close };
}

function Drawer() {
  const { isOpen, open, close } = useOverlayHistory('main-drawer');

  return (
    <>
      <button onClick={open}>메뉴 열기</button>

      {isOpen && (
        <div className="drawer">
          <button onClick={close}>닫기</button>
          // some contents
        </div>
      )}
    </>
  );
}
```

## History API를 통한 방식의 한계점

위와 같이 구현했을 때, 원하는 동작과 비슷하게 동작하도록 구현은 가능하나 실제로 적용해서 테스트해보았을 때는 예상치 못한 동작들이 많이 발생했다. 항상 일관된 동작을 보장하는 것이 아니라, 간헐적으로는 라우팅이 의도치 않은 방향으로 이루어졌다. 같은 액션에 대해 일관적인 동작을 하지 않는 것은 사용자 입장에서도 매우 좋지 못한 경험이고, 운영 측면에서도 리스크를 지니고 있는 것이다.

주로 발생한 문제는 두 가지로 아래와 같다.

1. 히스토리 스택의 불일치

오버레이 컴포넌트를 열고 닫을 때마다 히스토리 스택이 의도와 다르게 쌓이는 경우가 존재했다. 특히 여러 컴포넌트를 연속해서 열거나, 반복해서 여는 동작에서 많이 재현되었다.

2. 상태 동기화 문제

`popstate` 이벤트가 발생하는 시점과 실제 상태의 업데이트 시점이 불일치하는 케이스가 발생했다. 빠르게 여러 번 뒤로가기를 하는 경우, 상태가 꼬이는 경우가 발생되었다.

결국 History API를 사용할 경우 맟딱뜨리는 한계점은 컴포넌트의 상태와 브라우저 히스토리의 상태를 동기화해줘야 하는 점이었다. 동작에 대해 정확한 예측이 불가하다는 부분은 크리티컬한 이슈였다.

## React Router를 통한 구현

React Router는 일반적인 리액트 애플리케이션에서 라우팅을 구현하기 위한 표준 라이브러리이다. 위에서 맟딱뜨린 History API의 한계점을 해결하기 위한 방법이 History API를 활용해 구현된 React Router라는게 어쩌면 모순적으로 보일 수 있지만, React Router는 불안정한 History API를 더 안정적으로 사용할 수 있게 하는 도구라고 말할 수 있다.

---

3. React Router를 활용한 해결 방안

   - navigate의 state를 활용한 드로어 상태 관리
   - useDrawerHistory 훅 구현 설명
   - 실제 사용 예시

4. 확장 가능성

   - 모달, 바텀시트 등 다른 UI 요소에 적용
   - 주의사항 및 고려사항

5. 결론

   History API: 수동으로 React 상태와 history 상태를 동기화

   ```tsx
      // 상태 업데이트가 두 곳에서 발생
   setIsOpen(true);  // React 상태
   history.pushState(...);  // 브라우저 상태
   ```

- React Router의 navigate를 통해 History API를 더 안정적으로 사용하는 방법
  React Router: location 상태를 통한 자동 동기화
  React Router: React의 렌더링 사이클과 통합

React Router의 navigate가 더 안정적인 이유는:
React의 상태 관리 시스템과 더 잘 통합됨
히스토리 스택 관리가 더 예측 가능함
상태 업데이트의 타이밍이 React의 생명주기와 동기화됨
레이스 컨디션 발생 가능성이 낮음

가장 큰 장점은 히스토리 관리의 복잡성을 React Router가 제공하는 안정적인 API를 통해 추상화할 수 있다는 점입니다.
React Router가 "마법"을 부리거나 History API보다 "더 좋은" 무언가를 제공해서가 아니라, React 생태계 안에서 History API를 더 잘 활용하도록 추상화했기 때문입니다.

이를 추상화한 커스텀 훅 구현

```ts
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useDrawerHistory(id: string) {
  const location = useLocation();
  const navigate = useNavigate();

  const INITIAL_DRAWERS = new Set<string>([]);

  const getOpenDrawers = useCallback(() => {
    return location.state?.openDrawers || INITIAL_DRAWERS;
  }, [location]);

  const open = useCallback(() => {
    const openDrawers = getOpenDrawers();
    openDrawers.add(id);
    navigate(location.pathname + location.search, { state: { openDrawers } });
  }, [getOpenDrawers, id, navigate, location.pathname, location.search]);

  const isOpen = useMemo(() => getOpenDrawers().has(id), [getOpenDrawers, id]);

  const close = useCallback(() => {
    if (isOpen) {
      navigate(-1);
    }
  }, [isOpen, navigate]);

  return {
    isOpen,
    open,
    close,
  };
}
```

```tsx
function MyDrawer() {
  const { isOpen, open, close } = useDrawerHistory('my-drawer');

  return (
    <>
      <button onClick={open}>드로어 열기</button>
      {isOpen && <Drawer onClose={close}>드로어 내용</Drawer>}
    </>
  );
}
```

```tsx
// 여러 드로어를 동시에 관리하는 경우에도 안정적
function MultipleDrawers() {
  const drawer1 = useDrawerHistory('drawer1');
  const drawer2 = useDrawerHistory('drawer2');

  return (
    <>
      {drawer1.isOpen && <Drawer1 onClose={drawer1.close} />}
      {drawer2.isOpen && <Drawer2 onClose={drawer2.close} />}
    </>
  );
}
```

웹뷰 환경에서 네이티브 같은 경험이 필요할 때
복잡한 다중 레이어 UI를 관리해야 할 때
브라우저의 뒤로 가기 동작과 긴밀한 통합이 필요할 때

---

> 피드백은 언제나 환영합니다! 혹시 이 글에 제가 잘못 이해한 부분이 있다면 댓글로 남겨주시면 확인 후 수정토록 하겠습니다!
