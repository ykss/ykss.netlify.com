---
title: '(번역) 리액트 네이티브의 새로운 아키텍처가 출시되었습니다'
date: 2024-12-23 09:30:00
category: 'Translation'
draft: false
---

![react native](https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Freactnative.dev%2Fimg%2Flogo-share.png&is_viewed=1)

> 원문 : [New Architecture is here](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)

새로운 아키텍처가 기본으로 포함된 리액트 네이티브 0.76을 이제 npm에서 사용할 수 있습니다!

[0.76 릴리스 블로그 게시물](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture)에서 이번 버전에 포함된 주요 변경 사항 목록을 공유했습니다. 이번 게시물에서는 새로운 아키텍처 개요와 이 아키텍처가 리액트 네이티브의 미래를 어떻게 변화시키는지를 설명합니다.

새로운 아키텍처는 [Suspense](https://react.dev/blog/2022/03/29/react-v18#new-suspense-features), [Transitions](https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions), [자동 배치](https://react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching), [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)를 포함한 최신 리액트 기능을 완벽하게 지원합니다. 또한, 새로운 [네이티브 모듈](https://reactnative.dev/docs/next/turbo-native-modules-introduction) 및 [네이티브 컴포넌트](https://reactnative.dev/docs/next/fabric-native-components-introduction) 시스템을 통해 브릿지를 사용하지 않고도 네이티브 인터페이스에 직접 액세스하여 타입 안전한 코드를 작성할 수 있습니다.

이 릴리스는 2018년부터 리액트 네이티브를 완전히 새로 설계하려는 노력의 결과이며, 대부분의 앱이 점진적으로 마이그레이션 할 수 있도록 특별히 신경 썼습니다. 2021년에는 커뮤니티와 협력하여 리액트 생태계 전체가 원활하게 업그레이드할 수 있도록 [새로운 아키텍처 작업 그룹](https://github.com/reactwg/react-native-new-architecture/)을 만들었습니다.

대부분의 앱은 기존 릴리스와 동일한 수준의 노력으로 리액트 네이티브 0.76을 채택할 수 있습니다. 가장 인기 있는 리액트 네이티브 라이브러리들은 이미 새로운 아키텍처를 지원합니다. 또한, 기존 아키텍처를 대상으로 하는 라이브러리와의 역호환성을 보장하는 자동 상호 운용성 레이어가 포함되어 있습니다.

지난 몇 년간 개발을 거치며 팀은 새로운 아키텍처에 대한 비전을 공개적으로 공유해 왔습니다. 놓쳤다면 다음 발표들을 확인해 보세요.

- [React Native EU 2019 - The New React Native](https://www.youtube.com/watch?v=52El0EUI6D0&ab_channel=CallstackEngineers)
- [React Conf 2021 - React 18 Keynote](https://www.youtube.com/watch?v=FZ0cG47msEk)
- [App.js 2022 - 새로운 리액트 네이티브 아키텍처를 OSS 커뮤니티에 도입하기](https://www.youtube.com/watch?v=Q6TkkzRJfUo)
- [React Conf 2024 - Day 2 Keynote](https://www.youtube.com/watch?v=Q5SMmKb7qVI&ab_channel=ReactConf)

## 새로운 아키텍처란 무엇인가요?

새로운 아키텍처는 리액트 네이티브를 구성하는 주요 시스템을 완전히 재설계한 것으로, 컴포넌트 렌더링 방식, 자바스크립트 추상화와 네이티브 추상화 간 통신 방식, 스레드 간 작업 스케줄링 방식이 포함됩니다. 대부분의 사용자는 이러한 내부 시스템 작동 방식을 신경 쓰지 않아도 되지만, 이 변화는 성능 개선과 새로운 기능을 제공합니다.

이전 아키텍처에서는 리액트 네이티브가 네이티브 플랫폼과 비동기 브릿지를 통해 통신했습니다. 컴포넌트를 렌더링하거나 네이티브 함수를 호출하려면, 함수 호출을 직렬화하고 브릿지를 통해 비동기로 처리해야 했습니다. 이 아키텍처의 장점은 모든 작업이 백그라운드 스레드에서 수행되기 때문에 업데이트를 렌더링하거나 네이티브 모듈 함수 호출을 처리하는 동안 메인 스레드가 차단되지 않는다는 것입니다.

그러나 사용자는 상호작용에 대한 즉각적인 피드백이 네이티브 앱처럼 느껴지기를 기대합니다. 즉, 일부 업데이트는 사용자 입력에 반응하여 동기식으로 렌더링 되어야 하고, 진행 중인 렌더링이 중단될 수도 있음을 의미합니다. 하지만, 기존 아키텍처는 비동기식 업데이트만 가능했기 때문에 비동기식 업데이트와 동기식 업데이트를 모두 허용하도록 아키텍처를 다시 작성해야 했습니다.

또한 기존 아키텍처에서는 브릿지를 통한 함수 호출 직렬화가 잦은 업데이트나 큰 객체를 처리할 때 병목 현상이 크게 발생했습니다. 이에 따라 앱이 60FPS 이상을 안정적으로 달성하기 어려웠습니다. 또한, 동기화 문제도 있었습니다. 자바스크립트와 네이티브 레이어가 동기화되지 않으면 이를 동기적으로 조정할 수 없어 목록에 빈 공간이 표시되거나 중간 상태 렌더링으로 인해 UI가 갑자기 변경되는 등의 버그가 발생했습니다.

마지막으로, 기존 아키텍처는 기본 계층 구조를 사용하여 UI의 단일 복사본을 유지하고 그 복사본을 제자리에서 변경했기 때문에 레이아웃은 단일 스레드에서만 계산할 수 있었습니다. 이에 따라 사용자 입력과 같은 긴급한 업데이트를 처리할 수 없었고, 레이아웃 효과를 읽어 툴팁의 위치를 업데이트하는 등 레이아웃을 동기적으로 읽을 수 없었습니다.

이 모든 문제는 리액트의 동시(concurrent) 기능을 적절히 지원하는 것을 불가능하게 만들었습니다. 이러한 문제를 해결하기 위해 새로운 아키텍처는 네 가지 주요 요소를 포함합니다.

- 새로운 네이티브 모듈 시스템
- 새로운 렌더러
- 이벤트 루프
- 브릿지 제거

새로운 모듈 시스템을 통해 리액트 네이티브 렌더러는 네이티브 레이어에 동기적으로 액세스할 수 있으므로 이벤트 처리, 업데이트 예약, 레이아웃 읽기를 비동기적이거나 동기적으로 수행할 수 있습니다. 또한, 새로운 네이티브 모듈은 기본적으로 지연 로딩되므로 앱 성능이 크게 향상됩니다.

새로운 렌더러는 여러 스레드에서 진행 중인 여러 트리를 처리할 수 있으므로 리액트는 메인 스레드 또는 백그라운드 스레드에서 여러 동시성 업데이트 우선순위를 처리할 수 있습니다. 이를 통해 UI가 더욱 응답성이 좋아지고 끊김이 없는 경험을 제공합니다.

새로운 이벤트 루프는 자바스크립트 스레드의 작업을 잘 정의된 순서로 처리할 수 있습니다. 이를 통해 리액트는 렌더링을 중단하고 이벤트를 처리하여 긴급한 사용자 이벤트가 더 낮은 우선순위의 UI 전환보다 우선하도록 할 수 있습니다. 이벤트 루프는 웹 사양과도 일치하므로 마이크로 태스크, `MutationObserver`, `IntersectionObserver`와 같은 브라우저 기능도 지원할 수 있습니다.

마지막으로 브릿지를 제거함으로써 자바스크립트와 네이티브 런타임 간 직접 통신할 수 있어 작업 전환 비용이 최소화됩니다. 이에 따라 오류 리포팅, 디버깅이 개선되고 정의되지 않은 동작으로 인한 충돌이 줄어듭니다.

새로운 아키텍처는 이제 프로덕션에서 사용할 준비가 되었습니다. 메타의 페이스북 앱과 기타 제품에서 이미 대규모로 사용 중이며, [Quest 기기용](https://engineering.fb.com/2024/10/02/android/react-at-meta-connect-2024/) 페이스북 및 인스타그램 앱 개발에서도 성공적으로 활용되었습니다.

[Expensify](https://blog.swmansion.com/sunrising-new-architecture-in-the-new-expensify-app-729d237a02f5?gi=add0b8a54987)와 [Kraken](https://blog.kraken.com/product/engineering/how-kraken-fixed-performance-issues-via-incremental-adoption-of-the-react-native-new-architecture)과 같은 파트너들은 이미 몇 달 동안 새로운 아키텍처를 사용해 성공적인 결과를 얻었습니다. [BlueSky](https://github.com/bluesky-social/social-app/releases/tag/1.92.0-na-rc.2)의 최신 릴리스도 확인해 보세요.

### 새로운 네이티브 모듈

새로운 네이티브 모듈 시스템은 자바스크립트와 네이티브 플랫폼 간 통신 방식을 완전히 재설계한 것으로, C++로 작성되어 다음과 같은 새로운 기능을 제공합니다.

- 동기적 네이티브 런타임 액세스
- 자바스크립트와 네이티브 코드 간 타입 안전성
- 플랫폼 간 코드 공유
- 기본적으로 지연 로딩 지원

새로운 네이티브 모듈 시스템에서는 이제 비동기 브릿지를 사용할 필요 없이 자바스크립트 인터페이스(JSI)를 통해 자바스크립트와 네이티브 레이어가 서로 동기적으로 통신할 수 있습니다. 즉, 이제 사용자 정의 네이티브 모듈에서 함수를 동기적으로 호출하고 값을 반환한 다음 해당 값을 다른 네이티브 모듈 함수에 다시 전달할 수 있습니다.

이전 아키텍처에서는 네이티브 함수 호출의 응답을 처리하려면 콜백을 제공해야 했고, 반환된 값은 직렬화할 수 있어야 했습니다.

```js
// ❌ 네이티브 모듈에서 동기화 콜백
nativeModule.getValue(value => {
  // ❌ v값은 네이티브 객체를 참조할 수 없음
  nativeModule.doSomething(value);
});
```

새 아키텍처에서는 네이티브 함수에 대한 동기식 호출을 수행할 수 있습니다.

```js
// ✅ 네이티브 모듈의 동기 응답
const value = nativeModule.getValue();

// ✅ 값은 네이티브 객체를 참조할 수 있음
nativeModule.doSomething(value);
```

새로운 아키텍처를 사용하면 마침내 자바스크립트/타입스크립트 API에서 액세스 하면서 C++ 네이티브 구현의 모든 기능을 활용할 수 있습니다. 새로운 모듈 시스템은 [C++로 작성된 모듈](https://reactnative.dev/docs/next/the-new-architecture/pure-cxx-modules)을 지원하므로 모듈을 한 번만 작성하면 Android, iOS, Windows, macOS를 포함한 모든 플랫폼에서 작동합니다. C++로 모듈을 구현하면 보다 세분화된 메모리 관리와 성능 최적화가 가능합니다.

또한 [Codegen](https://reactnative.dev/docs/next/the-new-architecture/what-is-codegen)을 사용하면 모듈에서 자바스크립트 계층과 네이티브 계층 간에 강력한 타입 안전 계약을 정의할 수 있습니다. 경험상 크로스 플랫폼 앱에서 발생하는 가장 일반적인 크래시 원인 중 하나는 경계 간 타입 오류입니다. Codegen은 이러한 문제를 해결하고 보일러플레이트 코드를 자동으로 생성해 줍니다.

마지막으로 모듈은 이제 지연 로딩됩니다. 즉, 애플리케이션이 시작될 때가 아니라 실제로 필요할 때 메모리에 로드됩니다. 이를 통해 앱 시작 시간이 단축되고 애플리케이션이 복잡해져도 성능이 유지됩니다.

[react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)와 같은 인기 있는 라이브러리는 이미 새로운 네이티브 모듈로 마이그레이션 하여 이점을 누리고 있습니다.

> “새로운 네이티브 모듈 시스템 덕분에 `react-native-mmkv`의 설정, 자동 링크 및 초기화 과정이 크게 단순화되었습니다. 새로운 아키텍처 덕분에 `react-native-mmkv`는 이제 순수 C++ 네이티브 모듈로, 모든 플랫폼에서 작동할 수 있습니다. 새로운 Codegen은 MMKV에 완전한 타입 안전성을 부여하여 오래된 `NullPointerReference` 문제를 null 안전성을 강제 적용함으로써 해결했습니다. 또한 네이티브 모듈 함수를 동기적으로 호출할 수 있어 사용자 지정 JSI 액세스를 새로운 네이티브 모듈 API로 대체할 수 있었습니다.” - `react-native-mmkv`의 개발자 [Marc Rousavy](https://x.com/mrousavy)

### 새로운 렌더러

우리는 네이티브 렌더러를 완전히 새로 작성하여 여러 가지 이점을 추가했습니다.

- 업데이트는 다른 우선순위로 다른 스레드에서 렌더링 될 수 있습니다.
- 레이아웃을 동기적으로 읽을 수 있으며 여러 스레드에서 액세스 할 수 있습니다.
- 렌더러는 C++로 작성되어 모든 플랫폼에서 공유됩니다.

업데이트된 네이티브 렌더러는 뷰 계층 구조를 불변 트리 구조로 저장합니다. 즉, UI가 직접 변경될 수 없는 방식으로 저장되어 스레드에서 안전하게 업데이트를 처리할 수 있습니다. 이를 통해 여러 진행 중인 트리를 처리할 수 있으며, 각각은 사용자 인터페이스의 다른 버전을 나타냅니다. 결과적으로, UI를 차단하지 않고 백그라운드에서 업데이트를 렌더링할 수 있으며(예: 전환 중), 사용자 입력에 응답하여 메인 스레드에서 렌더링 할 수도 있습니다.

여러 스레드를 지원함으로써 리액트는 낮은 우선순위 업데이트를 중단하고 사용자 입력과 같은 긴급 업데이트를 렌더링 한 다음 필요할 때 낮은 우선순위 업데이트를 다시 시작할 수 있습니다. 새로운 렌더러는 레이아웃 정보를 동기적으로 읽을 수 있으며 여러 스레드에서 읽을 수 있습니다. 이를 통해 낮은 우선순위 업데이트의 백그라운드 계산과 툴팁 재배치와 같은 동기적 읽기를 지원합니다.

마지막으로 렌더러를 C++로 다시 작성함으로써 모든 플랫폼에서 동일한 코드를 실행할 수 있습니다. 이는 iOS, Android, Windows, macOS 및 리액트 네이티브가 지원하는 기타 플랫폼에서 일관된 렌더링 기능을 제공하며, 각 플랫폼에 대해 별도로 구현할 필요가 없습니다.

이러한 변경은 ["다중 플랫폼 비전(Many Platform Vision)"](https://reactnative.dev/blog/2021/08/26/many-platform-vision)을 향한 중요한 단계입니다. 예를 들어, 뷰 평탄화(View Flattening)는 깊은 레이아웃 트리를 피하기 위한 Android 전용 최적화였습니다. 공유 C++ 코어가 있는 새로운 렌더러는 [이 기능을 iOS에도 제공](https://github.com/reactwg/react-native-new-architecture/discussions/110)합니다. 이 최적화는 자동으로 이루어지며 추가 설정이 필요하지 않습니다.

이러한 변경 사항으로 리액트 네이티브는 이제 Suspense 및 Transition과 같은 동시(concurrent) 리액트 기능을 완벽하게 지원하여 사용자 입력에 빠르게 반응하는 복잡한 사용자 인터페이스를 지연, 끊김 또는 시각적 점프 없이 쉽게 구축할 수 있습니다. 향후 이러한 새로운 기능을 활용하여 FlatList 및 TextInput과 같은 기본 컴포넌트에 대한 더 많은 개선 사항을 제공할 예정입니다.

[Reanimated](https://docs.swmansion.com/react-native-reanimated/)과 같은 인기 라이브러리는 이미 새로운 렌더러의 이점을 활용하고 있습니다.

> “현재 개발 중인 Reanimated 4는 새로운 렌더러와 직접 작동하는 새로운 애니메이션 엔진을 도입하여 애니메이션을 처리하고 레이아웃을 여러 스레드에서 관리할 수 있습니다. 새로운 렌더러의 설계 덕분에 수많은 우회 방법에 의존하지 않고 이러한 기능을 구축할 수 있습니다. 또한 C++로 구현되고 플랫폼 간에 공유되기 때문에 Reanimated의 큰 부분은 한 번 작성되어 플랫폼별 문제를 최소화하고 코드베이스를 줄이며 플랫폼 채택을 간소화할 수 있습니다.” - [Reanimated](https://docs.swmansion.com/react-native-reanimated/)의 개발자 [Krzysztof Magiera](https://x.com/kzzzf)

### 이벤트 루프

새로운 아키텍처는 이 [RFC](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0744-well-defined-event-loop.md)에서 설명된 대로 잘 정의된 이벤트 루프 처리 모델을 구현할 수 있도록 했습니다. 이 RFC는 [HTML 표준](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)에 설명된 사양을 따르며 리액트 네이티브가 자바스크립트 스레드에서 작업을 수행하는 방식을 설명합니다.

잘 정의된 이벤트 루프를 구현하면 리액트 네이티브와 리액트 DOM 간의 간극을 줄일 수 있습니다. 이제 리액트 네이티브 애플리케이션의 동작이 리액트 DOM 애플리케이션의 동작과 더 유사해져 한 번 학습하면 어디서나 코드를 작성하기가 더 쉬워집니다.

이벤트 루프는 리액트 네이티브에 여러 가지 이점을 제공합니다.

- 렌더링을 중단하고 이벤트 및 작업을 처리하는 기능
- 웹 사양과의 더 긴밀한 연계
- 더 많은 브라우저 기능 지원을 위한 기반 마련

리액트는 이벤트 루프를 통해 업데이트와 이벤트의 순서를 예측 가능하게 관리할 수 있습니다. 이를 통해 낮은 우선순위 업데이트를 긴급 사용자 이벤트로 중단하고 새 렌더러를 사용해 이러한 업데이트를 독립적으로 렌더링 할 수 있습니다.

이벤트 루프는 타이머와 같은 이벤트 및 작업의 동작을 웹 사양과 일치하도록 조정하여 리액트 네이티브가 웹에서 익숙한 방식으로 작동하도록 하고 리액트 DOM과 리액트 네이티브 간의 코드 공유를 개선합니다.

이는 마이크로태스크(microtasks), `MutationObserver` 및 `IntersectionObserver`와 같은 웹 표준 브라우저 기능의 구현도 가능하게 합니다. 이러한 기능은 아직 리액트 네이티브에서 사용할 수 없지만, 향후 지원할 수 있도록 작업 중입니다.

마지막으로, 이벤트 루프와 새로운 렌더러의 변경사항들은 레이아웃을 동기적으로 읽을 수 있게 지원하여, 리액트 네이티브가 `useLayoutEffect`를 제대로 지원할 수 있게 되었습니다. 이를 통해 레이아웃 정보를 동기적으로 읽고 같은 프레임 내에서 UI를 업데이트할 수 있습니다. 이로써 사용자에게 표시되기 전에 요소들의 위치를 정확하게 지정할 수 있게 되었습니다.

자세한 내용은 [useLayoutEffect 문서](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here#uselayouteffect)를 참조하세요.

### 브릿지 제거

새로운 아키텍처에서는 리액트 네이티브의 브릿지 종속성을 완전히 제거하고 JSI(JavaScript Interface)를 사용하여 자바스크립트와 네이티브 코드 간 직접적이고 효율적인 통신을 구현했습니다.

![브릿지 다이어그램](https://reactnative.dev/assets/images/0.76-bridge-diagram-a653d794d04871e5b7a026e35d8edf03.png)

브릿지를 제거하면 초기화 과정이 생략되어 앱 시작 시간이 빨라집니다. 예를 들어, 이전 아키텍처에서는 자바스크립트에 전역 메서드를 제공하기 위해 시작 시 자바스크립트에서 모듈을 초기화해야 했고, 이로 인해 앱 시작 시간에 약간의 지연이 발생했습니다.

```js
// ❌ 느린 초기화
import { NativeTimingModule } from 'NativeTimingModule';
global.setTimeout = timer => {
  NativeTimingModule.setTimeout(timer);
};

// App.js
setTimeout(() => {}, 100);
```

새 아키텍처에서는 C++에서 메서드를 직접 바인딩할 수 있습니다.

```c++
// ✅ C++에서 직접적인 초기화
runtime.global().setProperty(runtime, "setTimeout", createTimer);
```

```js
// App.js
setTimeout(() => {}, 100);
```

이번 재설계를 통해 특히 앱 시작 시 발생하는 자바스크립트 충돌에 대한 오류 보고를 개선하고 정의되지 않은 동작으로 인한 충돌을 줄입니다. 충돌이 발생할 경우 새로운 [리액트 네이티브 개발자 도구](https://reactnative.dev/docs/next/react-native-devtools)가 디버깅을 간소화하고 새로운 아키텍처를 지원합니다.

브릿지는 새 아키텍처로의 점진적인 마이그레이션을 지원하기 위해 이전 버전과의 호환성을 유지하기 위해 남아 있습니다. 향후 브릿지 코드는 완전히 제거될 예정입니다.

### 점진적 마이그레이션

대부분의 앱은 다른 릴리스와 동일한 노력으로 0.76으로 업그레이드할 수 있습니다.

0.76으로 앱을 업그레이드하면 새로운 아키텍처와 React 18이 기본적으로 활성화됩니다. 그러나 동시성 기능을 사용하고 새로운 아키텍처의 모든 이점을 얻으려면 앱과 라이브러리를 새 아키텍처를 완벽하게 지원하도록 점진적으로 마이그레이션 해야 합니다.

처음 업그레이드 후 앱은 자동 상호 운용성 레이어를 사용하여 기존 아키텍처와 함께 새로운 아키텍처에서 실행됩니다. 대부분의 앱에서는 변경 없이 작동하지만, 상호 운용성 레이어는 사용자 정의 Shadow Node 또는 동시성 기능을 지원하지 않는 등 [알려진 제한사항](https://github.com/reactwg/react-native-new-architecture/discussions/237)이 있습니다.

동시성 기능을 사용하려면 앱이 [리액트의 규칙(Rules of React)](https://react.dev/reference/rules)을 따르고 [Concurrent 리액트](https://react.dev/blog/2022/03/29/react-v18#what-is-concurrent-react)를 지원하도록 업데이트해야 합니다. 자바스크립트 코드를 리액트 18과 그 의미 체계에 맞게 마이그레이션 하려면 [리액트 18 업그레이드 가이드](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)를 참조하세요.

전체적인 전략은 기존 코드를 손상하지 않고 앱을 새로운 아키텍처에서 실행하도록 설정하는 것입니다. 이후 앱을 원하는 속도로 점진적으로 마이그레이션 할 수 있습니다. 모든 모듈을 새로운 아키텍처로 마이그레이션 한 새로운 화면에서는 동시성 기능을 즉시 사용할 수 있습니다. 기존 화면에서는 동시성 기능을 추가하기 전에 일부 문제를 해결하고 모듈을 마이그레이션 해야 할 수 있습니다.

우리는 가장 인기 있는 리액트 네이티브 라이브러리와 협력하여 새로운 아키텍처 지원을 보장했습니다. 현재 850개 이상의 라이브러리가 이미 호환되었으며, 주간 다운로드 수가 20만 회 이상인 모든 라이브러리(다운로드된 라이브러리의 약 10%)가 포함됩니다. 새로운 아키텍처와의 라이브러리 호환성은 [reactnative.directory](https://reactnative.directory/) 웹사이트에서 확인할 수 있습니다.

![리액트 네이티브 디렉터리](https://reactnative.dev/assets/images/0.76-directory-85387cf0da638f887bbf996c39db432d.png)

업그레이드에 대한 자세한 내용은 아래 [업그레이드 방법](#how-to-upgrade)을 참조하세요.

## 새로운 기능

새로운 아키텍처는 리액트 18, 동시성 기능 및 리액트 네이티브의 `useLayoutEffect`를 완벽하게 지원합니다. 리액트 18 기능의 전체 목록은 [리액트 18 블로그 게시물](https://react.dev/blog/2021/12/17/react-conf-2021-recap#react-18-and-concurrent-features)을 참조하세요.

### 전환(Transitions)

전환은 리액트 18에서 긴급 업데이트와 긴급하지 않은 업데이트를 구분하는 새로운 개념입니다.

- **긴급 업데이트(Urgent updates)**: 입력, 클릭과 같이 직접적인 상호작용을 반영합니다.
- **전환 업데이트(Transition updates)**: UI를 한 뷰에서 다른 뷰로 전환합니다.

긴급 업데이트는 물리적 객체의 동작 방식에 대한 우리의 직관과 일치하도록 즉각적인 반응이 필요합니다. 반면, 전환 업데이트는 사용자가 모든 중간 상태를 화면에서 볼 것으로 기대하지 않기 때문에 더 유연하게 처리할 수 있습니다. 새로운 아키텍처에서는 리액트 네이티브가 긴급 업데이트와 전환 업데이트를 별도로 렌더링 할 수 있습니다.

일반적으로 최상의 사용자 경험을 제공하려면 하나의 사용자 입력이 긴급 업데이트와 비긴급 업데이트 모두를 트리거해야 합니다. ReactDOM과 유사하게, `press`나 `change`와 같은 이벤트는 긴급 이벤트로 처리되어 즉시 렌더링됩니다. 또한, 입력 이벤트 내에서 `startTransition` API를 사용하여 리액트에 어떤 업데이트가 "전환"으로 처리되어 백그라운드에서 연기될 수 있는지를 지정할 수 있습니다.

```javascript
import { startTransition } from 'react';

// 긴급 업데이트: 슬라이더 값을 표시
setCount(input);

// 전환으로 상태 업데이트 표시
startTransition(() => {
  // 전환 업데이트: 결과 표시
  setNumberOfTiles(input);
});
```

긴급 이벤트와 전환을 분리하면 사용자 인터페이스가 더 반응적으로 되고, 사용자 경험이 더욱 직관적으로 됩니다.

다음은 전환을 지원하지 않는 이전 아키텍처와 전환을 지원하는 새로운 아키텍처의 비교입니다. 각 타일이 단순한 배경색 뷰가 아니라 이미지를 포함한 복잡한 컴포넌트라고 상상해 보세요. `useTransition`을 **사용하면** 앱이 업데이트로 인해 과부하 되거나 뒤처지는 것을 방지할 수 있습니다.

![transitions을 지원하지 않는 경우](https://reactnative.dev/img/new-architecture/without-transitions.gif)

#### **이전**: 전환으로 표시하지 않고 타일을 렌더링 합니다

![transitions을 지원하는 경우](https://reactnative.dev/img/new-architecture/with-transitions.gif)

#### **이후**: 진행 중인 렌더링을 중단하는 트랜지션이 있는 타일을 렌더링 하여 오래된 상태의 렌더링을 중단합니다.

자세한 내용은 [동시성 렌더러 및 기능 지원](https://reactnative.dev/docs/0.75/the-new-architecture/landing-page#support-for-concurrent-renderer-and-features)을 참조하세요.

### 자동 배치(Automatic Batching)

새로운 아키텍처로 업그레이드하면 리액트 18의 자동 배치 기능을 사용할 수 있습니다.

자동 배치은 리액트가 렌더링 시 더 많은 상태 업데이트를 하나로 묶어 중간 상태의 렌더링을 방지합니다. 이를 통해 리액트 네이티브는 개발자가 추가 코드를 작성할 필요 없이 더 빠르고 지연이 적은 상태로 작동합니다.

![레거시 렌더러](https://reactnative.dev/img/new-architecture/legacy-renderer.gif)

#### **이전**: 레거시 렌더러로 빈번한 상태 업데이트를 렌더링 했습니다.

![리액트 18 렌더러](https://reactnative.dev/img/new-architecture/react18-renderer.gif)

#### **이후**: 자동 일괄 처리로 빈번한 상태 업데이트를 렌더링 합니다.

이전 아키텍처에서는 더 많은 중간 상태가 렌더링 되었으며, 슬라이더가 멈추더라도 UI가 계속 업데이트되었습니다. 새로운 아키텍처에서는 자동 배치 덕분에 중간 상태가 적게 렌더링 되고 렌더링이 훨씬 빨리 완료됩니다.

자세한 내용은 [동시성 렌더러 및 기능 지원](https://reactnative.dev/docs/0.75/the-new-architecture/landing-page#support-for-concurrent-renderer-and-features)을 참조하세요.

### useLayoutEffect

이벤트 루프와 동기적으로 레이아웃을 읽을 수 있는 기능을 기반으로, 새로운 아키텍처에서는 리액트 네이티브에 `useLayoutEffect`에 대한 적절한 지원을 추가했습니다.

이전 아키텍처에서는 `onLayout` 이벤트(비동기)로 뷰의 레이아웃 정보를 읽어야 했습니다. 따라서 레이아웃을 읽고 업데이트할 때까지 최소 한 프레임 동안 잘못된 레이아웃이 표시되어 툴팁이 잘못된 위치에 표시되는 등의 문제가 발생했습니다.

```js
// ❌ 커밋 후 비동기 onLayout
const onLayout = React.useCallback(event => {
  // ❌ 레이아웃을 읽기 위한 비동기 콜백
  ref.current?.measureInWindow((x, y, width, height) => {
    setPosition({ x, y, width, height });
  });
}, []);

// ...
<ViewWithTooltip onLayout={onLayout} ref={ref} position={position} />;
```

새로운 아키텍처에서는 `useLayoutEffect` 내에서 레이아웃 정보를 동기적으로 액세스할 수 있으므로 이러한 문제가 해결됩니다.

```javascript
// ✅ 커밋동안 동기 layout effect
useLayoutEffect(() => {
  // ✅ 레이아웃을 읽기 위한 동기 호출
  const rect = ref.current?.getBoundingClientRect();
  setPosition(rect);
}, []);

// ...
<ViewWithTooltip ref={ref} position={position} />;
```

이 변경을 통해 레이아웃 정보를 동기적으로 읽고 동일한 프레임에서 UI를 업데이트할 수 있으며, 사용자에게 요소가 표시되기 전에 정확한 위치로 배치할 수 있습니다.

![비동기 onLayout](https://reactnative.dev/img/new-architecture/async-on-layout.gif)

#### 이전 아키텍처에서는 레이아웃을 `onLayout`에서 비동기적으로 읽었기 때문에 툴팁의 위치가 지연되었습니다.

![동기 useLayoutEffect](https://reactnative.dev/img/new-architecture/sync-use-layout-effect.gif)

#### 새 아키텍처에서는 레이아웃을 `useLayoutEffect`에서 동기식으로 읽어서 표시하기 전에 툴팁 위치를 업데이트할 수 있습니다.

자세한 내용은 [동기적 레이아웃 및 효과 문서](https://reactnative.dev/docs/0.75/the-new-architecture/landing-page#synchronous-layout-and-effects)를 참조하세요.

### Suspense 완전 지원

Suspense를 사용하면 아직 표시 준비가 되지 않은 컴포넌트 트리의 일부에 대해 선언적으로 로딩 상태를 지정할 수 있습니다.

```jsx
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

몇 년 전 제한된 버전의 Suspense를 도입했으며 리액트 18에서는 완전한 지원이 추가되었습니다. 그러나 지금까지 리액트 네이티브는 Suspense에 대한 동시성 렌더링을 지원하지 않았습니다.

새로운 아키텍처는 리액트 18에 도입된 Suspense를 완벽하게 지원합니다. 이제 리액트 네이티브에서 Suspense를 사용해 컴포넌트의 로딩 상태를 관리할 수 있으며, 로딩 상태가 표시되는 동안 중단된 콘텐츠는 백그라운드에서 렌더링됩니다. 이는 사용자 입력이 표시된 콘텐츠에 더 높은 우선순위를 부여하여 더욱 원활한 사용자 경험을 제공합니다.

자세한 내용은 [리액트 18의 Suspense RFC](https://github.com/reactjs/rfcs/blob/main/text/0213-suspense-in-react-18.md)를 참조하세요.

## 업그레이드 방법

0.76으로 업그레이드하려면 [릴리스 포스트](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture#upgrade-to-076)의 단계를 따르세요. 이번 릴리스는 리액트 18로도 업그레이드되므로 [리액트 18 업그레이드 가이드](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)를 함께 참조해야 합니다.

대부분의 앱은 기존 아키텍처와의 상호 운용성 레이어 덕분에 이러한 단계만으로 새로운 아키텍처로 업그레이드할 수 있습니다. 그러나 새로운 아키텍처의 모든 이점을 활용하고 동시성 기능을 사용하려면 새로운 네이티브 모듈 및 네이티브 컴포넌트 API를 지원하도록 사용자 정의 네이티브 모듈 및 네이티브 컴포넌트를 마이그레이션 해야 합니다.

사용자 정의 네이티브 모듈을 마이그레이션 하지 않으면 공유 C++ 코드, 동기 메서드 호출, Codegen을 통한 타입 안전성 등의 이점을 누릴 수 없습니다. 네이티브 컴포넌트를 마이그레이션 하지 않으면 동시성 기능을 사용할 수 없습니다. 모든 네이티브 컴포넌트와 네이티브 모듈을 가능한 한 빨리 새로운 아키텍처로 마이그레이션 하는 것을 권장합니다.

> 참고:
> 향후 릴리스에서는 상호 운용성 레이어가 제거되며, 모든 모듈은 새로운 아키텍처를 지원해야 합니다.

### 앱

앱 개발자는 새로운 아키텍처를 완전히 지원하려면 라이브러리, 사용자 지정 네이티브 컴포넌트 및 사용자 지정 네이티브 모듈을 업그레이드하여 새 아키텍처를 완벽하게 지원해야 합니다.

리액트 네이티브 팀은 가장 인기 있는 라이브러리와 협력하여 새로운 아키텍처 지원을 보장했습니다. 새로운 아키텍처와의 라이브러리 호환성은 [reactnative.directory](https://reactnative.directory/) 웹사이트에서 확인할 수 있습니다.

앱에서 사용하는 라이브러리가 아직 호환되지 않은 경우 다음을 시도할 수 있습니다.

- 라이브러리에 이슈를 열고 작성자에게 새로운 아키텍처로 마이그레이션해 달라고 요청합니다.
- 라이브러리가 유지 관리되지 않는 경우, 동일한 기능을 갖춘 대체 라이브러리를 고려하세요.
- 해당 라이브러리가 마이그레이션 될 때까지 [새로운 아키텍처 비활성화](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here#opt-out)를 선택할 수 있습니다.

사용자 정의 네이티브 모듈이나 네이티브 컴포넌트가 있는 경우, [상호 운용성(interop) 레이어](https://github.com/reactwg/react-native-new-architecture/discussions/135) 덕분에 대부분의 경우 문제없이 작동할 것으로 예상됩니다. 하지만, 새로운 아키텍처를 완벽하게 지원하고 동시성 기능을 적용하기 위해서는 새로운 네이티브 모듈과 네이티브 컴포넌트 API로 업그레이드하는 것을 권장합니다.

다음 가이드를 따라 모듈과 컴포넌트를 새로운 아키텍처로 마이그레이션 하세요.

- [네이티브 모듈](https://reactnative.dev/docs/next/turbo-native-modules-introduction)
- [네이티브 컴포넌트](https://reactnative.dev/docs/next/fabric-native-components-introduction)

### 라이브러리

라이브러리 유지 관리자는 먼저 자신의 라이브러리가 상호 운용성 레이어와 함께 작동하는지 테스트해야 합니다. 작동하지 않는 경우 [새로운 아키텍처 작업 그룹(New Architecture Working Group)](https://github.com/reactwg/react-native-new-architecture/)에 이슈를 열어 문제를 보고하세요.

새로운 아키텍처를 완전히 지원하려면 가능한 한 빨리 라이브러리를 새로운 네이티브 모듈 및 네이티브 컴포넌트 API로 마이그레이션 하는 것이 좋습니다. 이를 통해 라이브러리 사용자는 새로운 아키텍처의 모든 이점을 누리고 동시성 기능을 지원할 수 있습니다.

다음 가이드를 참조하여 모듈과 컴포넌트를 새로운 아키텍처로 마이그레이션 할 수 있습니다.

- [네이티브 모듈](https://reactnative.dev/docs/next/turbo-native-modules-introduction)
- [네이티브 컴포넌트](https://reactnative.dev/docs/next/fabric-native-components-introduction)

### 새로운 아키텍처 비활성화(Opt-out)

새로운 아키텍처가 애플리케이션에서 제대로 작동하지 않는 경우, 다시 활성화할 준비가 될 때까지 비활성화 옵션을 사용할 수 있습니다.

다음 단계에 따라 새로운 아키텍처를 비활성화하세요.

- Android의 경우에는 `android/gradle.properties` 파일을 수정하고 `newArchEnabled` 플래그를 끕니다.

```js
-newArchEnabled = true + newArchEnabled = false;
```

- iOS의 경우에는 다음 명령어를 실행하여 종속성을 다시 설치하세요.

```bash
RCT_NEW_ARCH_ENABLED=0 bundle exec pod install
```

## 감사 인사

새로운 아키텍처를 오픈 소스 커뮤니티에 제공하는 것은 수년간의 연구와 개발을 거친 대규모 프로젝트였습니다. 이 결과를 달성하는 데 도움을 준 현재와 과거의 모든 리액트 팀원들에게 감사의 말씀을 전하고 싶습니다.

또한 이를 위해 협력해 주신 모든 파트너사에게도 깊은 감사를 드립니다. 특히 다음과 같은 분들께 감사의 말씀을 전하고 싶습니다.

- [Expo](https://expo.dev/), 새 아키텍처를 조기에 채택하고 가장 인기 있는 라이브러리를 마이그레이션 하는 작업을 지원한 것에 대해 감사드립니다.
- [Software Mansion](https://swmansion.com/), 생태계의 중요한 라이브러리를 유지하고, 새 아키텍처로 조기에 마이그레이션 하고, 다양한 문제를 조사하고 해결하는 데 도움을 주신 모든 분께 감사드립니다.
- [Callstack](https://www.callstack.com/), 생태계의 중요한 라이브러리를 유지 관리하고, 새 아키텍처로 조기에 마이그레이션 하고, 커뮤니티 CLI 작업을 지원해 준 것에 대해 감사드립니다.
- [Microsoft](https://opensource.microsoft.com/), `react-native-windows` 및 `react-native-macos`를 위한 새로운 아키텍처 구현을 추가하고 다른 여러 개발자 도구에 추가해주신 점에 감사드립니다.
- [Expensify](https://www.expensify.com/), [Kraken](https://www.kraken.com/), [BlueSky](https://bsky.app/), [Brigad](https://www.brigad.co/), 새 아키텍처의 도입을 선도하고 다양한 문제를 보고하여 다른 모든 사용자를 위해 문제를 해결할 수 있도록 도와주신 것에 대해 감사의 말씀을 전합니다.
- 새로운 아키텍처를 테스트하고, 일부 문제를 수정하고, 불명확한 문제에 대한 질문을 열어 문제를 해결함으로써 새로운 아키텍처에 기여한 모든 독립 라이브러리 유지 관리자와 개발자에게 감사의 마음을 전합니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
