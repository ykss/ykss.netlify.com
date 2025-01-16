---
title: 'History API vs React Router: 웹뷰 오버레이 컴포넌트(드로어, 바텀시트, 모달)의 뒤로가기 처리'
date: 2025-01-18 01:00:00
category: 'DevLog'
draft: false
---

## 배경

웹뷰 기반 하이브리드 앱에서는 네이티브와 웹의 상호작용이 매우 중요하다. 특히 뒤로가기와 같은 기본적인 네비게이션 동작은 사용자 경험에 직접적인 영향을 미치는 요소이다.

최근 진행 중인 프로젝트는 네이티브 앱 내에서 대부분의 페이지가 웹뷰로 되어있는 서비스이다. 네이티브 앱과 웹뷰 조합의 서비스에서는 여러 가지 고려해야 할 사항이 많지만, 뒤로 가기에 대한 처리가 꼭 필요하다.
일반적으로는 뒤로 가기 버튼이나, 특정 CTA를 통해서 페이지 라우팅을 제어할 수 있지만, 안드로이드의 경우 물리 뒤로 가기 버튼이 존재하기 때문에 이 부분에 대한 고려가 필요하다. (iOS의 경우, 뒤로 가기 버튼이나 스와이프 제스처로 뒤로 가기를 수행한다.)

가장 자연스러운 해결 방법은 아래와 같이 웹뷰의 히스토리가 존재하면 브라우저의 뒤로 가기, 즉 `history.back()`을 수행하고, 히스토리가 없다면 안드로이드의 기본적인 물리 뒤로 가기 동작을 수행하도록 하는 것이다. (안드로이드 코드에 대해서는 무지하기 때문에, 아래 코드는 참고 정도만 하는 게 좋다.)

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

보통 이렇게만 해도 물리 뒤로 가기 버튼을 눌렀을 때, 웹뷰의 히스토리대로 동작하기 때문에 큰 플로우상에는 문제가 없다! 그럼 문제해결! 이라고 생각했지만, 여러 가지 예외 사항이 존재한다. 그중에서도 이 글에서는 드로어, 바텀시트, 모달과 같은 기존 화면 위에 등장하는 오버레이(overlay) UI 컴포넌트가 물리 뒤로가기 키로 닫히지 않고 이전 페이지로 돌아가는 부분에 대해 다룰 것이다.

## 문제사항

기본적으로 오버레이 UI 컴포넌트는 바깥 영역을 클릭하거나, 닫기 버튼을 통해서도 닫히기 때문에 별다른 히스토리 조작이 필요하지 않을 수 있다. 하지만 물리적인 뒤로 가기 키가 존재하는 안드로이드 환경에서는 물리 키를 통해서도 드로어나 바텀시트가 닫히도록 구현해야 웹뷰 환경에서 사용자에게 네이티브 앱과 같은 사용자 경험을 줄 수 있다.

그래서 물리 뒤로 가기 키에 대해서 위와 같이 웹뷰의 히스토리 기반으로 동작하는 상황에서는 오버레이 UI 컴포넌트가 열릴 때마다 히스토리를 쌓아줄 수 있어야, 네이티브 앱과 같은 동작을 할 수 있었다. 이를 해결하기 위한 첫 번째 시도로 브라우저의 History API를 사용하는 방식을 적용해 보았다.

## History API를 통한 구현

오버레이 컴포넌트의 뒤로 가기 처리를 위해 브라우저의 [History API](https://developer.mozilla.org/ko/docs/Web/API/History)를 활용할 수 있다. History API는 브라우저의 히스토리를 프로그래밍 방식으로 제어할 수 있게 해주는 웹 표준 API이다.
History API의 `pushState`, `replaceState`와 같은 메서드를 이용하면 페이지를 이동하지 않고도 히스토리 스택을 쌓을 수 있다. 그렇기 때문에 오버레이 컴포넌트가 `open` 될 때, `pushState` (혹은 상황에 따라 `replaceState`)를 통해 새로운 히스토리를 쌓고 컴포넌트를 닫을 때, `history.back()`을 통해 쌓았던 히스토리를 제거하는 방식을 적용해 볼 수 있다.

> 참고 : `pushState`는 새로운 히스토리 엔트리를 추가하는 반면, `replaceState`는 현재 히스토리 엔트리를 대체한다. 오버레이 컴포넌트의 경우 일반적으로 `pushState`를 사용하지만, 특정 상황(예: 모달 내에서 다른 모달로 전환되는 경우)에서는 `replaceState`를 사용하는 것이 더 적절할 수 있다.

하지만 `history.back()`이 컴포넌트의 닫기 버튼 또는 브라우저의 뒤로가기를 통해 발생했을 때, 오버레이 컴포넌트의 상태 또한 변경해 줘야 한다. 그렇기 때문에 브라우저 뒤로가기 시 컴포넌트의 상태를 히스토리와 동기화하기 위해 [`popstate`](https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event) 이벤트를 통해서 뒤로가기 동작이 일어났을 때 발생시킬 이벤트 핸들러를 등록하는 방식을 사용해야 한다.

위의 방식을 적용하여 아래 예시와 같이 훅을 구현해 볼 수 있다.

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

위와 같이 구현했을 때, 원하는 동작과 비슷하게 동작하도록 구현은 가능하나 실제로 적용해서 테스트해 보았을 때는 예상치 못한 동작들이 많이 발생했다. 항상 일관된 동작을 보장하는 것이 아니라, 간헐적으로는 라우팅이 의도치 않은 방향으로 이루어졌다. 같은 액션에 대해 일관적인 동작을 하지 않는 것은 사용자 입장에서도 매우 좋지 못한 경험이고, 운영 측면에서도 리스크를 지니고 있다.

주로 발생한 문제는 두 가지로 아래와 같다.

1. 히스토리 스택의 불일치

오버레이 컴포넌트를 여닫을 때마다 히스토리 스택이 의도와 다르게 쌓이는 경우가 존재했다. 특히 여러 컴포넌트를 연속해서 열거나, 반복해서 여는 동작에서 많이 재현되었다.

2. 상태 동기화 문제

`popstate` 이벤트가 발생하는 시점과 실제 상태의 업데이트 시점이 불일치하는 케이스가 발생했다. 빠르게 여러 번 뒤로 가기를 하는 경우, 상태가 꼬이는 경우가 발생하였다.

결국 History API를 사용할 경우 맞닥뜨리는 한계점은 컴포넌트의 상태와 브라우저 히스토리의 상태를 동기화해줘야 하는 점이었다. 내가 정확하게 동작하도록 구현하지 못한 것일 수 있지만, 케이스에 따라 예측 불가한 동작이 발생하는 부분은 애플리케이션의 안정성을 해치는 매우 크리티컬한 이슈라고 할 수 있다.

## React Router를 통한 구현

React Router는 일반적인 리액트 애플리케이션에서 라우팅을 구현하기 위한 표준 라이브러리이다. 위에서 맞닥뜨린 History API의 한계점을 해결하기 위한 방법이 History API를 활용해 구현된 React Router라는 것이 어쩌면 이상하게 여겨질 수 있다. 하지만 React Router는 History API를 추상화하여 리액트 환경에서 더 예측 가능하고 안정적으로 사용할 수 있게 해주는 도구이다.

아래는 React Router의 `useNavigate`와 `useLocation`를 통해 여러 드로어를 히스토리를 쌓으며 제어할 수 있도록 구현한 훅이다. 성능 관련 고려 사항이나 에러 처리에 대한 부분은 각자 상황에 맞게 추가하면 좋다.

```ts
import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const INITIAL_DRAWERS = new Set<string>([]);

export function useDrawerHistory(id: string) {
  const location = useLocation();
  const navigate = useNavigate();

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

이 훅에서는 드로어의 오픈 여부를 `useLocation`의 `state`에 Set으로 관리되는 드로어 ID 목록을 통해 추적하고, 드로어를 닫을 땐 `navigate(-1)`을 통해 최근에 추가된 드로어의 ID를 제거하고 히스토리를 이전으로 돌린다.

이 방식을 사용하면 드로어뿐만 아니라, 모달과 바텀시트에도 활용할 수 있다. 또한 바텀시트 위에 또 다른 바텀시트가 뜨는 경우에도 바텀시트마다 다른 id를 지정하여 각 바텀시트의 오픈 여부를 브라우저의 히스토리와 연결하여 안정적으로 관리할 수 있다. 즉, 여러 바텀시트를 사용하는 경우 히스토리 스택에 따라 순서대로 닫는 것도 가능하다. 아래는 여러 드로어(또는 바텀시트)를 관리하는 예시이다.

```tsx
function MultipleDrawers() {
  // 여러 드로어를 동시에 관리하는 경우에도 안정적이다.
  const drawer1 = useDrawerHistory('drawer1');
  const drawer2 = useDrawerHistory('drawer2');

  return (
    <>
      {/* 드로어를 여는 버튼들 */}
      <div className="button-group">
        <button onClick={drawer1.open}>첫 번째 메뉴</button>
        <button onClick={drawer2.open}>두 번째 메뉴</button>
      </div>

      {/* 드로어 컴포넌트들 */}
      {drawer1.isOpen && (
        <Drawer1 onClose={drawer1.close} title="첫 번째 메뉴">
          <nav>
            <ul>
              <li>홈</li>
              <li>프로필</li>
              <li>설정</li>
            </ul>
          </nav>
        </Drawer1>
      )}

      {drawer2.isOpen && (
        <Drawer2 onClose={drawer2.close} title="두 번째 메뉴">
          <div>
            <h3>알림</h3>
          </div>
        </Drawer2>
      )}
    </>
  );
}
```

## 결론

사실 React Router가 어떠한 "마법"을 부려서 History API보다 더 좋은 무언가를 제공한 것이 아니라, 리액트 생태계 안에서 History API를 더 잘 활용할 수 있도록 추상화한 것이다. 결과적으로 브라우저의 History API를 직접 사용하는 방식에 비해 React Router를 통해 구현하면 리액트의 렌더링 사이클에 맞게 설계되었기 때문에 리액트와 더 잘 통합될 수 있고, location의 상태를 통해 더욱 손쉽게 상태를 동기화할 수 있기 때문에 히스토리의 스택을 예측할 수 있고 더 안정적으로 관리할 수 있다. 나도 동료분의 코드를 통해 인사이트를 얻었는데, 혹시 웹뷰 환경에서 네이티브와 같은 물리 키 제어 경험을 주는 것이 필요하거나, 복잡한 다중 레이어 UI를 히스토리 스택과 연동해야 하는 경우, 이 글의 내용이 도움이 된다면 좋을 것 같다.

---

> 전적으로 제 이해의 기준으로 작성했기 때문에 잘못된 내용이 있을 수 있습니다. 제가 잘못 알고 있는 내용이 있다면 댓글로 남겨주시면 확인하도록 하겠습니다!
