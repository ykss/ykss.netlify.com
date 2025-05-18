---
title: '(번역) React Labs: 뷰 트랜지션과 액티비티, 그리고 더 많은 것들'
date: 2025-05-22 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [React Labs: View Transitions, Activity, and more](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more)

React Labs 글에서는 현재 활발히 연구 및 개발 중인 프로젝트에 대해 작성합니다. 이번 글에서는 지금 바로 사용해 볼 수 있는 두 가지 새로운 실험적 기능과 현재 작업 중인 다른 영역에 대한 업데이트를 공유합니다.

> 참고
> React Conf 2025는 10월 7일부터 8일까지 네바다주 헨더슨에서 개최될 예정입니다!
>
> 이번 게시물에서 다루는 기능들에 대해 발표할 연사를 모집하고 있습니다. ReactConf에서 발표하고 싶으시다면 [이곳에서 신청](https://forms.reform.app/react-conf/call-for-speakers/)해 주세요(발표 제안서 제출은 필요하지 않습니다).
>
> 티켓, 무료 스트리밍, 후원 등 자세한 내용은 [React Conf 웹사이트](https://conf.react.dev/)를 참조하세요.

오늘, 테스트 준비가 완료된 두 가지 새로운 실험적 기능에 대한 문서를 공개하게 되어 기쁩니다.

- [뷰 트랜지션](#뷰-트랜지션)
- [액티비티](#액티비티)

또한, 현재 개발 중인 새로운 기능들에 대한 업데이트도 공유합니다.

- [리액트 성능 트래킹](#리액트-성능-트래킹)
- [컴파일러 IDE 확장](#컴파일러-ide-확장)
- [자동 이펙트 의존성](#자동-이펙트-의존성)
- [Fragment Refs](#fragment-refs)
- [동시 스토어](#동시-스토어)

# 새로운 실험적 기능들

뷰 트랜지션과 액티비티는 이제 `react@experimental`에서 테스트할 준비가 되었습니다. 이 기능들은 실제 프로덕션 환경에서도 테스트를 마쳤으며 안정적인 상태이지만, 피드백을 반영하여 최종 API는 변경될 수 있습니다.

가장 최신의 experimental 버전으로 리액트 패키지를 업그레이드하여 사용할 수 있습니다.

- `react@experimental`
- `react-dom@experimental`

이 기능들을 앱에서 어떻게 사용하는지 알아보려면 계속 읽어주세요. 또는 새로 발행된 문서를 확인해 보세요.

- `<ViewTransition>`: 전환(Transition)에 애니메이션을 활성화할 수 있는 컴포넌트입니다.
- `addTransitionType`: 전환의 이유를 지정할 수 있는 함수입니다.
- `<Activity>`: UI의 일부를 숨기거나 보여줄 수 있는 컴포넌트입니다.

## 뷰 트랜지션

리액트 뷰 트랜지션은 앱 내 UI 전환에 애니메이션을 쉽게 추가할 수 있게 해주는 새로운 실험적 기능입니다. 내부적으로, 이 애니메이션들은 대부분의 최신 브라우저에서 제공되는 새로운 `startViewTransition` API를 기반으로 작동합니다.

요소에 애니메이션을 적용하려면 새로운 `<ViewTransition>` 컴포넌트로 감싸세요.

```jsx
// "무엇"을 애니메이션 할지 정의합니다.
<ViewTransition>
  <div>animate me</div>
</ViewTransition>
```

이 컴포넌트를 사용하면 애니메이션이 활성화될 때 “무엇”에 애니메이션을 적용할지 선언적으로 정의할 수 있습니다.

“언제” 애니메이션을 적용할지는 다음 세 가지 트리거 중 하나를 사용하여 정의할 수 있습니다.

```jsx
// "언제" 애니메이션을 적용할지 정의합니다.

// 전환
startTransition(() => setState(...));

// 지연된 값
const deferred = useDeferredValue(value);

// 서스펜스
<Suspense fallback={<Fallback />}>
  <div>Loading...</div>
</Suspense>
```

기본적으로 이러한 애니메이션은 [뷰 트랜지션에 적용된 기본 CSS 애니메이션](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#customizing_your_animations)을 사용하며, 일반적으로 부드러운 크로스 페이드입니다. [뷰 트랜지션 가상 선택자](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using#the_view_transition_pseudo-element_tree)를 사용하여 “어떻게” 애니메이션을 적용할지 정의할 수 있습니다. 예를 들어, 모든 전환에 대한 기본 애니메이션을 변경하려면 `\*`을 사용할 수 있습니다.

```css
// "어떻게" 애니메이션을 적용할지 정의합니다.
::view-transition-old(*) {
  animation: 300ms ease-out fade-out;
}
::view-transition-new(*) {
  animation: 300ms ease-in fade-in;
}
```

`startTransition`, `useDeferredValue`, 또는 `Suspense` 폴백이 콘텐츠로 전환되는 등의 애니메이션 트리거로 인해 DOM이 업데이트되면, 리액트는 [선언적 휴리스틱](https://react.dev/reference/react/ViewTransition#viewtransition)을 사용하여 어떤 `<ViewTransition>` 컴포넌트를 애니메이션에 사용할지 자동으로 판단합니다. 이후 브라우저는 CSS에서 정의된 애니메이션을 실행합니다.

브라우저의 뷰 트랜지션 API에 익숙하고 리액트가 이를 어떻게 지원하는지 알고 싶다면, 문서의 ["`<ViewTransition>`은 어떻게 작동하나요?"](https://react.dev/reference/react/ViewTransition#how-does-viewtransition-work) 섹션을 참고하세요.

이 게시물에서는 뷰 트랜지션을 어떻게 사용하는지에 대한 몇 가지 예제를 살펴보겠습니다.

다음은 아무런 애니메이션이 적용되지 않은 앱의 예입니다.

- 동영상을 클릭하여 상세 정보를 봅니다.
- “뒤로 가기”를 클릭하여 피드로 돌아갑니다.
- 목록에서 검색하여 동영상을 필터링합니다.

<iframe src="https://codesandbox.io/embed/v82nqs?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="infallible-elgamal-v82nqs"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

> 참고
>
> 뷰 트랜지션은 CSS 및 JS 기반 애니메이션을 대체하지 않습니다.
>
> 뷰 트랜지션은 탐색, 확장, 열기, 재정렬과 같은 UI 전환에 사용되도록 설계되었습니다. 앱의 모든 애니메이션을 대체하기 위한 것이 아닙니다.
>
> 위의 예제 앱에서는 “좋아요” 버튼을 클릭하거나 Suspense 폴백의 반짝임에서 이미 애니메이션이 적용되어 있는 것을 확인할 수 있습니다. 이러한 경우는 특정 요소에 애니메이션을 적용하기 때문에 CSS 애니메이션에 적합한 사용 사례입니다.

### 내비게이션에 애니메이션 적용하기

우리 앱에는 Suspense를 지원하는 라우터가 포함되어 있으며, [페이지 전환은 이미 트랜지션으로 표시되어 있어](https://react.dev/reference/react/useTransition#building-a-suspense-enabled-router) `startTransition`을 사용하여 내비게이션이 수행됩니다.

```jsx
function navigate(url) {
  startTransition(() => {
    go(url);
  });
}
```

`startTransition`은 뷰 트랜지션 트리거이므로, 페이지 간 전환 시 애니메이션을 적용하기 위해 `<ViewTransition>`을 추가할 수 있습니다.

```jsx
// 무엇에 애니메이션을 적용할지
<ViewTransition key={url}>
  {url === '/' ? <Home /> : <TalkDetails />}
</ViewTransition>
```

`url`이 변경되면 `<ViewTransition>`과 새로운 라우트가 렌더링 됩니다. `<ViewTransition>`이 `startTransition` 내부에서 업데이트되었기 때문에 해당 `<ViewTransition>`이 애니메이션을 위해 활성화됩니다.

기본적으로 뷰 트랜지션은 브라우저의 기본 크로스 페이드 애니메이션을 포함합니다. 이를 예제에 적용하면, 페이지 간 이동 시마다 크로스 페이드 애니메이션이 발생하게 됩니다.

<iframe src="https://codesandbox.io/embed/gh7cfr?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="elegant-cori-gh7cfr"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

라우터가 이미 `startTransition`을 사용하여 경로를 업데이트하고 있기 때문에, `<ViewTransition>`을 한 줄 추가하는 것만으로 기본 크로스 페이드 애니메이션이 활성화됩니다.

이 방식이 어떻게 작동하는지 궁금하다면, 문서의 ["`<ViewTransition>`은 어떻게 작동하나요?"](https://react.dev/reference/react/ViewTransition#how-does-viewtransition-work)를 참고하세요.

> 참고
>
> `<ViewTransition>` 애니메이션 사용하지 않기
>
> 이 예제에서는 단순화를 위해 앱의 루트를 `<ViewTransition>`으로 감쌌지만, 이는 앱의 모든 전환에 애니메이션이 적용된다는 것을 의미하며, 예상치 못한 애니메이션이 발생할 수 있습니다.
>
> 이를 해결하기 위해, 각 페이지가 자체적으로 애니메이션을 제어할 수 있도록 라우트 자식 요소를 "none"으로 감쌉니다.
>
> ```jsx
> // Layout.js
> <ViewTransition default="none">{children}</ViewTransition>
> ```
>
> 실제로는, 내비게이션은 “enter”와 “exit” 프로퍼티 또는 Transition Types를 사용하여 구현하는 것이 좋습니다.

### 애니메이션 커스터마이징

기본적으로 `<ViewTransition>`은 브라우저의 기본 크로스 페이드를 포함합니다.

애니메이션을 커스터마이징하려면, `<ViewTransition>` 컴포넌트에 프로퍼티를 전달하여 어떤 애니메이션을 사용할지 지정할 수 있습니다. 이는 [`<ViewTransition>`이 어떻게 활성화되었는지](https://react.dev/reference/react/ViewTransition#props)에 따라 다릅니다.

예를 들어, `default` 크로스 페이드 애니메이션을 느리게 만들 수 있습니다.

```jsx
<ViewTransition default="slow-fade">
  <Home />
</ViewTransition>
```

그리고 CSS에서 [뷰 트랜지션 클래스](https://react.dev/reference/react/ViewTransition#view-transition-classes)를 사용하여 `slow-fade`를 정의합니다.

```css
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}

::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

이제 크로스 페이드가 더 느려집니다.

<iframe src="https://codesandbox.io/embed/t23t2l?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="objective-glade-t23t2l"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

`<ViewTransition>`의 스타일링에 대한 전체 가이드는 ["뷰 트랜지션 스타일링하기"](https://react.dev/reference/react/ViewTransition#styling-view-transitions) 문서를 참조하세요.

### 공유 요소 전환

두 페이지에 동일한 요소가 포함되어 있을 때, 해당 요소를 한 페이지에서 다음 페이지로 전환할 때 애니메이션을 적용하고 싶을 수 있습니다.

이를 위해 `<ViewTransition>`에 고유한 이름을 추가할 수 있습니다.

```jsx
<ViewTransition name={`video-${video.id}`}>
  <Thumbnail video={video} />
</ViewTransition>
```

이제 동영상 썸네일이 두 페이지 간에 애니메이션 됩니다.

<iframe src="https://codesandbox.io/embed/2r8fyy?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="fervent-babbage-2r8fyy"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

기본적으로 리액트는 전환 시에 활성화된 각 요소에 대해 고유한 이름을 자동으로 생성합니다(자세한 내용은 ["`<ViewTransition>`은 어떻게 작동하나요?"](https://react.dev/reference/react/ViewTransition#how-does-viewtransition-work) 참조). 리액트는 이름이 있는 `<ViewTransition>`이 제거되고 동일한 이름의 새 `<ViewTransition>`이 추가되는 전환을 감지하면, 공유 요소 전환을 활성화합니다.

자세한 내용은 ["공유된 요소에 애니메이션 적용하기"](https://react.dev/reference/react/ViewTransition#animating-a-shared-element) 문서를 참조하세요.

### 전환 원인에 따라 애니메이션 적용하기

때로는 전환이 어떻게 발생했는지에 따라 요소에 애니메이션을 다르게 적용하고 싶을 수 있습니다. 이러한 사용 사례를 위해, 전환의 원인을 지정할 수 있는 새로운 API인 `addTransitionType`을 추가했습니다.

```jsx {4,12}
function navigate(url) {
  startTransition(() => {
    // 전환 원인을 "nav forward"로 설정
    addTransitionType('nav-forward');
    go(url);
  });
}

function navigateBack(url) {
  startTransition(() => {
    // 전환 원인을 "nav backward"로 설정
    addTransitionType('nav-back');
    go(url);
  });
}
```

전환 유형을 사용하면 `<ViewTransition>`에 프로퍼티를 통해 사용자 정의 애니메이션을 제공할 수 있습니다. “6 Videos”와 “Back” 헤더에 공유 요소 전환을 추가해 보겠습니다.

```jsx {4-5}
<ViewTransition
  name="nav"
  share={{
    'nav-forward': 'slide-forward',
    'nav-back': 'slide-back',
  }}
>
  {heading}
</ViewTransition>
```

여기서 우리는 `share` 프로퍼티를 전달하여 전환 유형에 따라 어떻게 애니메이션을 적용할지 정의합니다. 전환이 `nav-forward`로부터 활성화되면 `slide-forward` 뷰 전환 클래스가 적용됩니다. `nav-back`에서 활성화되면 `slide-back` 애니메이션이 실행됩니다. 이 애니메이션을 CSS로 정의해 보겠습니다.

```css
::view-transition-old(.slide-forward) {
  /* 앞으로 슬라이드할 때, 이전 페이지는 왼쪽으로 밀려나야 합니다. */
  animation: ...;
}

::view-transition-new(.slide-forward) {
  /* 앞으로 슬라이드할 때, 새로운 페이지는 오른쪽에서 들어와야 합니다. */
  animation: ...;
}

::view-transition-old(.slide-back) {
  /* 뒤로 슬라이드할 때, 이전 페이지는 오른쪽으로 밀려나야 합니다. */
  animation: ...;
}

::view-transition-new(.slide-back) {
  /* 뒤로 슬라이드할 때, 새로운 페이지는 왼쪽에서 들어와야 합니다. */
  animation: ...;
}
```

이제 내비게이션 유형에 따라 썸네일과 함께 헤더에도 애니메이션을 적용할 수 있습니다.

<iframe src="https://codesandbox.io/embed/jk8kvn?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dazzling-field-jk8kvn"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### Suspense 경계 애니메이션 적용하기

Suspense 또한 뷰 트랜지션을 활성화합니다.

폴백에서 콘텐츠로의 전환에 애니메이션을 적용하려면, `<Suspense>`를 `<ViewTransition>`으로 감쌀 수 있습니다.

```jsx
<ViewTransition>
  <Suspense fallback={<VideoInfoFallback />}>
    <VideoInfo />
  </Suspense>
</ViewTransition>
```

이렇게 추가하면, 폴백이 콘텐츠에 크로스 페이드 됩니다. 동영상을 클릭하면 비디오 정보가 애니메이션 되며 나타나는 것을 볼 수 있습니다.

<iframe src="https://codesandbox.io/embed/f2th9g?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="musing-benji-f2th9g"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

또한 폴백에는 `exit` 애니메이션을, 콘텐츠에는 `enter` 애니메이션을 지정하여 커스텀 애니메이션을 제공할 수도 있습니다.

```jsx {3,8}
<Suspense
  fallback={
    <ViewTransition exit="slide-down">
      <VideoInfoFallback />
    </ViewTransition>
  }
>
  <ViewTransition enter="slide-up">
    <VideoInfo id={id} />
  </ViewTransition>
</Suspense>
```

CSS로 `slide-down`과 `slide-up`을 다음과 같이 정의합니다.

```css
::view-transition-old(.slide-down) {
  /_폴백을아래로슬라이드_/animation: ...;
}

::view-transition-new(.slide-up) {
  /_콘텐츠를위로슬라이드_/animation: ...;
}
```

이제 Suspense 콘텐츠가 폴백을 슬라이딩 애니메이션으로 대체합니다.

<iframe src="https://codesandbox.io/embed/snfmf2?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="intelligent-rain-snfmf2"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 리스트 애니메이션 적용하기

`<ViewTransition>`을 사용하면 항목 목록이 재정렬될 때 애니메이션을 적용할 수 있습니다. 예를 들어, 검색 가능한 항목 목록에서 사용할 수 있습니다.

```jsx {3,5}
<div className="videos">
  {filteredVideos.map(video => (
    <ViewTransition key={video.id}>
      <Video video={video} />
    </ViewTransition>
  ))}
</div>
```

<ViewTransition>을 활성화하려면 `useDeferredValue`를 사용할 수 있습니다.

```jsx {2}
const [searchText, setSearchText] = useState('');
const deferredSearchText = useDeferredValue(searchText);
const filteredVideos = filterVideos(videos, deferredSearchText);
```

이제 검색창에 입력할 때 항목에 애니메이션이 적용됩니다.

<iframe src="https://codesandbox.io/embed/7wr8s3?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="withered-microservice-7wr8s3"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 최종 결과

몇 개의 `<ViewTransition>` 컴포넌트와 몇 줄의 CSS만 추가하여 위의 모든 애니메이션을 최종 결과물에 포함할 수 있었습니다.

우리는 뷰 트랜지션에 대해 매우 기대하고 있으며, 여러분이 만들 수 있는 앱의 수준을 한 단계 끌어올릴 수 있을 것으로 생각합니다. 리액트의 실험적 채널에서 지금 바로 사용해 볼 수 있습니다.

느린 페이드를 제거하고, 최종 결과를 확인해 봅시다.

<iframe src="https://codesandbox.io/embed/njn4yc?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="focused-star-njn4yc"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

이 기능이 어떻게 작동하는지 더 궁금하다면, 문서의 ["`<ViewTransition>`은 어떻게 작동하나요?"](https://react.dev/reference/react/ViewTransition#how-does-viewtransition-work)를 참고하세요.

뷰 트랜지션이 어떻게 만들어졌는지에 대한 배경은 [@sebmarkbage](https://x.com/sebmarkbage)의 다음 이슈들을 확인해 보세요.(고마워요 Seb!)

- [#31975](https://github.com/facebook/react/pull/31975)
- [#32105](https://github.com/facebook/react/pull/32105)
- [#32041](https://github.com/facebook/react/pull/32041)
- [#32734](https://github.com/facebook/react/pull/32734)
- [#32797](https://github.com/facebook/react/pull/32797)
- [#31999](https://github.com/facebook/react/pull/31999)
- [#32031](https://github.com/facebook/react/pull/32031)
- [#32050](https://github.com/facebook/react/pull/32050)
- [#32820](https://github.com/facebook/react/pull/32820)
- [#32029](https://github.com/facebook/react/pull/32029)
- [#32028](https://github.com/facebook/react/pull/32028)
- [#32038](https://github.com/facebook/react/pull/32038)

## 액티비티

[이전 업데이트](https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022#offscreen)에서 컴포넌트를 시각적으로 숨기고 우선순위를 낮춰 UI 상태를 유지하면서도 언마운트하거나 CSS로 숨기는 것보다 성능 비용이 적은 API를 연구하고 있다고 공유했었습니다.

이제 그 API와 작동 방식을 공유할 준비가 되었으며, 실험적인 리액트 버전에서 테스트할 수 있습니다.

`<Activity>`는 UI의 일부를 숨기거나 표시할 수 있는 새로운 컴포넌트입니다.

```jsx
<Activity mode={isVisible ? 'visible' : 'hidden'}>
  <Page />
</Activity>
```

`<Activity>`가 `visible` 상태일 때는 일반적으로 렌더링 됩니다. `Activity`가 `hidden` 상태일 때는 언마운트되지만 상태는 저장되며, 화면에 보이는 항목보다 낮은 우선순위로 계속 렌더링 됩니다.

사용자가 사용하지 않는 UI 부분의 상태를 저장하거나, 다음에 사용할 가능성이 높은 부분을 미리 렌더링 하는 데 `Activity`를 사용할 수 있습니다.

위에서 다룬 뷰 트랜지션 예제를 개선해 보겠습니다.

> 참고
>
> 액티비티가 숨겨질 경우 이펙트는 마운트 되지 않습니다.
>
> `<Activity>`가 `hidden` 상태일 경우, 이펙트는 언마운트됩니다. 개념적으로 컴포넌트는 언마운트되지만, 리액트는 상태를, 나중을 위해 저장해 둡니다.
>
> 실제 사용에서는 ["여러분은 이펙트가 필요하지 않을 수 있습니다"](https://react.dev/learn/you-might-not-need-an-effect) 가이드를 따랐다면 예상대로 작동합니다. 문제가 될 수 있는 이펙트를 조기에 발견하려면 `<StrictMode>`를 추가하는 것을 추천합니다. 이것은 액티비티의 언마운트 및 마운트를 적극적으로 수행하여 예기치 않은 부작용을 잡아낼 수 있습니다.

### 액티비티로 상태 복원하기

사용자가 페이지를 벗어날 때 일반적으로 이전 페이지 렌더링을 중지합니다.

```jsx {6-7}
function App() {
  const { url } = useRouter();

  return (
    <>
      {url === '/' && <Home />}
      {url !== '/' && <Details />}
    </>
  );
}
```

하지만 이렇게 하면 사용자가 이전 페이지로 돌아왔을 때, 모든 이전 상태가 사라지게 됩니다. 예를 들어, `<Home />` 페이지에 `<input>` 필드가 있다면, 사용자가 페이지를 벗어났을 때 `<input>`이 언마운트되고 입력했던 모든 텍스트가 사라집니다.

액티비티를 사용하면 사용자가 페이지를 전환해도 상태를 유지할 수 있어, 다시 돌아왔을 때 이전 상태를 그대로 이어갈 수 있습니다. 이는 트리의 일부를 `<Activity>`로 감싸고 `mode`를 토글 함으로써 가능합니다.

```jsx {6-8}
function App() {
  const { url } = useRouter();

  return (
    <>
      <Activity mode={url === '/' ? 'visible' : 'hidden'}>
        <Home />
      </Activity>
      {url !== '/' && <Details />}
    </>
  );
}
```

이 변경을 통해 위에서 만든 뷰 트랜지션 예제를 개선할 수 있습니다. 이전에는 동영상을 검색하고 하나를 선택한 뒤 뒤로 돌아오면 검색 필터가 사라졌습니다. Activity를 사용하면 검색 필터가 복원되어 이전 상태 그대로 이어서 사용할 수 있습니다.

동영상을 검색하고 선택한 뒤, “뒤로”를 클릭해 보세요.

<iframe src="https://codesandbox.io/embed/szv5sf?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="dreamy-edison-szv5sf"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 액티비티를 활용한 프리렌더링

때때로 사용자가 곧 사용할 가능성이 있는 UI의 다음 부분을 미리 준비해 두고 싶을 수 있습니다. 이렇게 하면 사용자가 해당 UI를 사용할 준비가 되었을 때 이미 준비되어 있는 상태가 됩니다. 이는 특히 다음 라우트가 렌더링에 필요한 데이터를 Suspense로 대기해야 하는 경우에 유용합니다. 사용자 이동 전에 데이터를 미리 가져올 수 있도록 도와주기 때문입니다.

예를 들어, 현재 앱은 사용자가 동영상을 선택할 때마다 해당 동영상의 데이터를 로드하기 위해 대기해야 합니다. 이를 개선하기 위해 사용자가 이동할 때까지 모든 페이지를 숨겨진 `<Activity>`로 렌더링할 수 있습니다.

```jsx {2,5,8}
<ViewTransition>
  <Activity mode={url === '/' ? 'visible' : 'hidden'}>
    <Home />
  </Activity>
  <Activity mode={url === '/details/1' ? 'visible' : 'hidden'}>
    <Details id={id} />
  </Activity>
  <Activity mode={url === '/details/1' ? 'visible' : 'hidden'}>
    <Details id={id} />
  </Activity>
</ViewTransition>
```

이 업데이트를 통해 다음 페이지의 콘텐츠가 프리렌더링될 시간이 있다면, Suspense 폴백 없이 바로 애니메이션 되며 나타납니다. 동영상을 클릭해 보면, 상세 페이지에서 동영상 제목과 설명이 폴백 없이 즉시 렌더링되는 것을 확인할 수 있습니다.

<iframe src="https://codesandbox.io/embed/mxyglx?view=editor+%2B+preview&module=%2Fsrc%2FApp.js"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="pensive-waterfall-mxyglx"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### 서버 사이드 렌더링과 액티비티

서버 사이드 렌더링(SSR)을 사용하는 페이지에서 액티비티를 사용할 경우, 몇 가지 추가 최적화가 적용됩니다.

페이지의 일부가 `mode="hidden"`으로 렌더링되면, 해당 부분은 SSR 응답에 포함되지 않습니다. 대신 리액트는 액티비티 내부의 콘텐츠를 클라이언트에서 렌더링하도록 예약하며, 화면에 보이는 콘텐츠의 하이드레이션을 우선 처리합니다.

`mode="visible"`로 렌더링된 UI의 경우, 리액트는 액티비티 내부 콘텐츠의 하이드레이션 우선순위를 낮춥니다. 이는 Suspense 콘텐츠가 낮은 우선순위로 하이드레이션되는 방식과 유사합니다. 사용자가 해당 페이지와 상호작용을 하면, 필요한 경우 액티비티 내부의 하이드레이션을 우선 처리합니다.

이러한 기능은 고급 사용 사례이지만, 액티비티가 고려하고 있는 추가적인 이점을 보여줍니다.

### 액티비티의 미래 모드

앞으로는 액티비티에 더 많은 모드를 추가할 수 있습니다.

예를 들어, 흔히 사용되는 사례 중 하나는 모달을 렌더링 하는 것입니다. 이때 이전에 사용하던 "비활성" 페이지는 "활성" 모달 뒤에 여전히 보이게 됩니다. 하지만 "hidden" 모드는 이 경우에 적합하지 않습니다. 해당 콘텐츠는 보이지 않으며 SSR에도 포함되지 않기 때문입니다.

대신, 콘텐츠는 보이게 유지하고 SSR에도 포함되지만, 마운트는 해제되고 업데이트 우선순위는 낮게 유지하는 새로운 모드를 고려 중입니다. 이 모드는 또한 DOM 업데이트를 “일시 중지”해야 할 수 있습니다. 모달이 열려 있는 동안 백그라운드 콘텐츠가 업데이트되는 것은 산만할 수 있기 때문입니다.

또 다른 고려 중인 모드는 메모리 사용량이 과도할 경우, 숨겨진 액티비티의 상태를 자동으로 제거할 수 있는 기능입니다. 컴포넌트가 이미 언마운트된 상태이므로, 앱의 숨겨진 부분 중 가장 최근에 사용되지 않은 상태를 제거하는 것이 리소스를 과도하게 사용하는 것보다 나을 수 있습니다.

이러한 영역은 여전히 연구 중이며, 진전이 있을 때 더 많은 정보를 공유할 예정입니다. 현재 액티비티가 포함하는 기능에 대한 자세한 내용은 [이 문서를 참조하세요.](https://react.dev/reference/react/Activity)

# 개발 중인 기능들

현재 아래의 일반적인 문제들을 해결하기 위한 기능들도 개발 중입니다.

가능한 해결책들을 반복적으로 테스트하는 과정에서, 우리가 적용 중인 일부 잠재적 API를 PR을 통해 공유하게 될 수 있습니다. 단, 다양한 아이디어를 시도하면서 기능을 바꾸거나 제거하는 경우도 많다는 점을 유념해 주세요.

우리가 개발 중인 해결책이 너무 이른 시점에 공개되면 커뮤니티 내에서 혼란이 발생할 수 있습니다. 투명성과 혼란 방지 사이에서 균형을 맞추기 위해, 특정한 해결책을 공유하지 않고 현재 우리가 해결하고자 하는 문제에 대해서만 공유하고 있습니다.

이러한 기능이 개발되는 대로 블로그를 통해 문서와 함께 공개하여 직접 사용해 볼 수 있게 하겠습니다.

## 리액트 성능 트래킹

리액트 앱의 성능에 대한 더 많은 정보를 제공하기 위해 브라우저 API를 사용하여 성능 프로파일러에 [커스텀 트랙을 추가할 수 있는](https://developer.chrome.com/docs/devtools/performance/extension?hl=ko) 새로운 기능 세트를 개발 중입니다.

이 기능은 아직 진행 중이며, 실험적 기능으로 완전히 릴리스하기 위한 문서를 공개할 준비는 되어 있지 않습니다. 하지만 실험용 리액트 버전을 사용할 경우, 프로파일에 퍼포먼스 트랙이 자동으로 추가되는 것을 미리 사용해 볼 수 있습니다.

![performance tracks](https://react.dev/images/blog/react-labs-april-2025/perf_tracks_dark.png)

우리는 성능 문제나 일시 중단된 트리 간 작업이 항상 “연결”되지 않는 스케줄러 트랙 같은 알려진 몇 가지 이슈를 해결할 계획입니다. 그래서 아직 공개하기에는 준비가 덜 되어 있습니다. 또한 초기 사용자들로부터 피드백을 수집하여 트랙의 설계와 사용성을 개선하고 있습니다.

이러한 이슈들이 해결되면, 실험적인 문서를 공개하고 사용해 볼 수 있도록 안내할 예정입니다.

## 자동적인 이펙트 의존성

우리가 훅을 출시할 때는 세 가지 주요 목표가 있었습니다.

- **컴포넌트 간 코드 공유:** 훅은 렌더 프로퍼티나 고차 컴포넌트 같은 패턴을 대체하여 컴포넌트 계층을 변경하지 않고도 상태 기반 로직을 재사용할 수 있게 해 주었습니다.
- **라이프사이클이 아닌 함수 관점으로 사고:** 훅을 사용하면 라이프사이클 메서드에 따라 컴포넌트를 분리하는 대신, 관련된 기능(예: 구독 설정이나 데이터 가져오기)에 따라 작은 함수들로 나눌 수 있습니다.
- **사전 컴파일 지원:** 훅은 라이프사이클 메서드의 의도치 않은 성능 저하나 클래스의 제약 없이 사전 컴파일을 지원할 수 있도록 설계되었습니다.

훅은 출시 이후, *컴포넌트 간 코드 공유*에 성공적이었습니다. 이제 훅은 로직을 공유하는 데 가장 선호되는 방식이며, 렌더 프로퍼티나 고차 컴포넌트는 많이 사용되지 않습니다. 훅은 또한 클래스 컴포넌트에서는 불가능했던 빠른 새로고침 같은 기능을 지원하는 데에도 성공했습니다.

### 이펙트는 어렵다

안타깝게도, 일부 훅은 여전히 함수 관점이 아닌 라이프사이클 관점으로 이해하기 어렵습니다. 특히 이펙트는 이해하기 어렵고, 개발자들이 가장 많이 겪는 고충 중 하나입니다. 작년에는 이펙트가 어떻게 사용되고 있는지, 어떻게 하면 그 사용 방식을 단순화하고 이해하기 쉽게 만들 수 있을지 많은 시간을 들여 연구했습니다.

우리는 많은 경우, 이펙트가 실제로 필요하지 않은 상황에서 사용되고 있다는 것을 발견했습니다. [“여러분은 이펙트가 필요하지 않을 수 있습니다”](https://react.dev/learn/you-might-not-need-an-effect) 가이드는 이펙트가 적절하지 않은 많은 사례들을 다루고 있습니다. 하지만 이펙트가 적절한 문제에 사용되었을 때조차도, 클래스 컴포넌트의 라이프사이클보다 이해하기 더 어려운 경우가 많습니다.

이러한 혼란의 이유 중 하나는, 개발자들이 이펙트를 _컴포넌트_ 관점(즉, 라이프사이클처럼)에서 생각하기 때문이라고 우리는 생각합니다. 이펙트의 관점(즉, 이펙트가 무엇을 하는가)에서 생각하는 것이 아니라는 것이죠.

[문서에 나오는](https://react.dev/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective) 예제를 살펴봅시다.

```jsx
useEffect(() => {
  // roomId에 연결된 이펙트...
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    // ...연결 해제
    connection.disconnect();
  };
}, [roomId]);
```

많은 사용자들은 이 코드를 “마운트 시 roomId에 연결. `roomId`가 변경될 때마다 이전 연결을 해제하고 새로 연결”이라고 이해합니다. 하지만 이는 컴포넌트의 라이프사이클 관점에서 생각하는 방식이며, 이펙트를 올바르게 작성하려면 모든 라이프사이클 상태를 고려해야 하므로 어렵습니다. 따라서 이펙트가 클래스 라이프사이클보다 어렵다고 느껴지는 것은 자연스러운 일입니다.

### 의존성 없는 이펙트

이펙트의 관점에서 생각하는 것이 더 낫습니다. 이펙트는 컴포넌트의 라이프사이클에 대해 알지 못합니다. 단지 동기화를 시작하고 중지하는 방법을 설명할 뿐입니다. 사용자가 이런 방식으로 이펙트를 생각할 때, 작성이 더 쉬워지고 여러 번 시작되고 중단되어도 더 탄탄하게 작동합니다.

우리는 개발자들이 왜 컴포넌트 관점에서 이펙트를 생각하게 되는지를 연구했으며, 그 이유 중 하나는 의존성 배열이라고 생각합니다. 배열을 작성해야 하므로, 눈앞에 있는 이 배열이 “이 값들이 바뀔 때 이 작업을 하라”는 사고방식으로 유도하기 때문입니다.

훅을 출시할 때, 우리는 사전 컴파일로 훅을 더 쉽게 만들 수 있다는 것을 알고 있었습니다. 리액트 컴파일러를 사용하면 대부분의 경우 `useCallback`과 `useMemo`를 직접 작성하지 않아도 됩니다. 이펙트의 경우, 컴파일러가 의존성을 자동으로 삽입할 수 있습니다.

```jsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}); // 컴파일러가 의존성 삽입
```

이 코드에서는 리액트 Compiler가 의존성을 추론하고 자동으로 삽입해 주므로, 직접 보거나 작성할 필요가 없습니다. [IDE 확장](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more#compiler-ide-extension) 및 [`useEffectEvent`](https://react.dev/reference/react/experimental_useEffectEvent) 같은 기능을 통해 컴파일러가 삽입한 의존성을 CodeLens로 확인할 수 있어, 디버깅이나 최적화 시 도움이 됩니다. 이는 이펙트가 언제든지 실행되어 컴포넌트 또는 hook의 상태를 외부 상태와 동기화해야 한다는 올바른 사고방식을 강화합니다.

우리는 이러한 자동 의존성 삽입이 작성하기 쉬울 뿐 아니라, 이펙트가 “무엇을 하는가”에 집중하도록 도와주어 이해하기도 더 쉬워질 것으로 기대하고 있습니다.

## 컴파일러 IDE 확장

이번 주 초, 우리는 리액트 컴파일러 릴리스 후보를 [공유했으며](https://react.dev/blog/2025/04/21/react-compiler-rc), 앞으로 몇 달 안에 첫 번째 SemVer 안정 버전을 출시할 계획입니다.

리액트 컴파일러를 사용해 코드의 이해 및 디버깅을 개선할 수 있는 정보를 제공하는 방법도 탐색 중입니다. 우리가 실험 중인 아이디어 중 하나는 리액트 컴파일러를 기반으로 하는 새로운 실험적 LSP 기반 IDE 확장입니다. 이는 [Lauren Tan의 React Conf 강연](https://conf2024.react.dev/talks/5)에서 사용한 확장과 유사합니다.

이 IDE 확장은 컴파일러의 정적 분석을 활용하여 IDE에서 더 많은 정보, 제안, 최적화 기회를 제공할 수 있도록 합니다. 예를 들어, 리액트 규칙을 위반한 코드에 대한 진단, 컴포넌트나 훅이 컴파일러에 의해 최적화되었는지 표시하는 호버, [자동 삽입된 이펙트 의존성](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more#automatic-effect-dependencies)을 보여주는 CodeLens 등을 제공할 수 있습니다.

이 IDE 확장은 아직 초기 단계이며, 앞으로의 업데이트에서 진척 상황을 공유할 예정입니다.

## Fragment Refs

이벤트 처리, 위치 계산, 포커싱과 같은 많은 DOM API는 리액트에서 조합하기 어려운 경우가 많습니다. 이에 따라 개발자들은 종종 이펙트를 사용하거나 여러 Ref를 관리해야 하며, 리액트 19에서 제거된 `findDOMNode` 같은 API를 사용하게 됩니다.

우리는 하나의 요소가 아닌 여러 DOM 요소 그룹을 가리킬 수 있는 Fragment에 ref를 추가하는 기능을 탐색하고 있습니다. 이를 통해 여러 자식을 관리하는 작업이 더 간단해지고, DOM API를 호출할 때 더 조합성 높은 리액트 코드를 작성할 수 있을 것으로 기대합니다.

Fragment ref는 아직 연구 단계이며, 최종 API가 완성에 가까워졌을 때 더 많은 정보를 공유할 예정입니다.

## 제스처 애니메이션

우리는 뷰 트랜지션을 개선하여 스와이프 하여 메뉴를 열거나, 포토 캐러셀을 스크롤 하는 등의 제스처 애니메이션을 지원하는 방법도 연구 중입니다.

제스처는 여러 가지 이유로 새로운 도전을 줍니다.

- **제스처는 연속적입니다:** 스와이프 하는 동안 애니메이션은 손가락 위치와 시간에 따라 연동됩니다. 단순히 트리거하고 끝나는 애니메이션이 아닙니다.
- **제스처는 완료되지 않을 수 있습니다:** 손가락을 뗐을 때 애니메이션이 완료될 수도 있고, 원래 상태로 되돌아갈 수도 있습니다. (예: 메뉴를 반쯤만 연 경우)
- **제스처는 old와 new를 뒤집습니다:** 애니메이션 중에는 이전 페이지가 여전히 “활성화”되고 인터랙티브해야 합니다. 이는 브라우저의 뷰 트랜지션 모델(“old”는 스냅샷, “new”는 라이브 DOM)과 반대입니다.

우리는 잘 작동하는 접근 방식을 찾았다고 생각하며, 제스처 전환을 트리거할 수 있는 새로운 API를 도입할 수도 있습니다. 지금은 `<ViewTransition>` 제공에 집중하고 있으며, 제스처는 그 이후에 다시 다룰 예정입니다.

## 동시 스토어

리액트 18에서 동시 렌더링을 도입할 때, 외부 상태 저장소 라이브러리들이 리액트 상태나 컨텍스트 없이도 [동시 렌더링을 지원](https://github.com/reactwg/react-18/discussions/70)할 수 있도록 `useSyncExternalStore`도 함께 출시했습니다.

하지만 `useSyncExternalStore`는 트랜지션과 같은 동시 기능에서 빠져나오게 하고, 기존 콘텐츠에 Suspense 폴백을 보여주게 하므로 비용이 따릅니다.

리액트 19가 출시된 지금, 우리는 이 문제를 다시 살펴보고 있으며 use API를 사용하여 동시 외부 스토어에 완전히 지원하는 기본 기능으로 만들고자 합니다.

```jsx
const value = use(store);
```

우리의 목표는 외부 상태를 렌더 중에 찢김(tearing) 없이 읽을 수 있도록 하고, 리액트의 모든 동시성 기능과 완벽하게 연동되도록 하는 것입니다.

이 연구는 아직 초기 단계입니다. 새로운 API가 어떤 모습일지에 대해서는 더 진척되었을 때 공유할 예정입니다.

_이 글을 검토해 준 [Aurora Scharff](https://bsky.app/profile/aurorascharff.no), [Dan Abramov](https://bsky.app/profile/danabra.mov), [Eli White](https://x.com/Eli_White), [Lauren Tan](https://bsky.app/profile/no.lol), [Luna Wei](https://github.com/lunaleaps), [Matt Carroll](https://x.com/mattcarrollcode), [Jack Pope](https://www.jackpope.me/), [Jason Bonta](https://www.threads.com/@someextent), [Jordan Brown](https://github.com/jbrown215), [Jordan Eldredge](https://bsky.app/profile/capt.dev), [Mofei Zhang](https://www.threads.com/@z_mofei), [Sebastien Lorber](https://bsky.app/profile/sebastienlorber.com), [Sebastian Markbåge](https://bsky.app/profile/sebmarkbage.calyptus.eu), [Tim Yung](https://github.com/yungsters)에게 감사드립니다._

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
