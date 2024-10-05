---
title: '(번역) 웹 페이지가 로드되기 전에 더 빠르게 만드는 방법'
date: 2024-10-07 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [How to make your web page faster before it even loads](https://blog.sentry.io/how-to-make-your-web-page-faster-before-it-even-loads/)

![How to make your web page faster before it even loads](https://images.ctfassets.net/em6l9zw4tzag/7IY8azPCCAKcYeON3SxP9Z/676d38a28462d093dac6b757de25cad6/web-page-faster-hero.jpg?w=2520&h=945&q=50&fm=webp)

개발자로서(특히 프런트엔드 개발자로서), 우리는 일반적으로 웹 성능을 논할 때 브라우저 창에서 요소들이 나타나기 시작하는 시점과 콘텐츠를 소비하거나 페이지와 상호작용을 할 수 있게 되는 시점을 측정하는 맥락에서 이야기합니다. 예를 들어, 다음과 같은 핵심 웹 바이탈은 우리가 보고, 사용할 수 있고, 경험할 수 있는 것들에 대한 논의를 이끌어 줍니다.

- First Contentful Paint (FCP): 사용자가 페이지에 처음 진입한 시점부터 페이지의 어떤 부분의 콘텐츠가 렌더링 될 때까지의 시간을 측정합니다.
- Largest Contentful Paint (LCP): 페이지의 주요 콘텐츠가 로드된 시점을 나타냅니다.
- Interaction to Next Paint (INP): 웹 페이지가 사용자 입력에 얼마나 빠르게 반응하는지를 측정합니다.

이는 콘텐츠를 소비하거나 상호작용할 수 없으면 측정할 수 있는 경험 자체가 없다는 점에서 타당합니다. 하지만 웹 페이지의 첫 번째 바이트가 브라우저에 수신되기 전에는 어떤 일이 일어날까요? 이러한 이벤트를 측정하고, 웹 페이지와 애플리케이션이 더 빨리 로드되도록 최적화할 수 있을까요?

## Sentry Trace View에서 TTFB 이전의 이벤트를 어떻게 시각화할까요?

위 질문들은 Sentry의 [Trace View](https://docs.sentry.io/concepts/key-terms/tracing/trace-view/)를 보면서 떠올랐습니다. 여기서는 브라우저 창에 어떤 것이 렌더링되기 전에 발생하는 이벤트들이 캡처되고, `browser`스팬으로 표시됩니다. **캐시**, **DNS**, **연결**, **TLS/SSL**, **요청**, **응답** 등 6개의 스팬이 시간 순으로 등록됩니다.`response` 전 모든 이벤트는 웹 페이지나 리소스에 대한 요청부터 첫 번째 바이트의 응답이 도착하기까지의 시간을 측정하는 Time to First Byte (TTFB)보다 우선합니다.

> 각주: [스팬 프로퍼티](https://docs.sentry.io/concepts/search/searchable-properties/spans/)는 Sentry SDK에서 캡처한 기본 데이터 요소이며, 스팬 프로퍼티가 모여 트레이스를 구성합니다.

![image_1_Sentry_Trace_View](https://images.ctfassets.net/em6l9zw4tzag/3IF9VrCpQSqWkSXSpYOd8a/a66bccc0ae3a31184f5a9956ba405fc0/image_1_Sentry_Trace_View.png)

[Sentry](https://sentry.io/welcome/)가 브라우저 초기화 이전에 이러한 이벤트를 어떻게 캡처하는지 궁금하실 수 있습니다. 저도 그랬습니다! 해답은 [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)에 있습니다. 이 API는 웹 애플리케이션의 성능을 측정하는 웹 표준 집합으로, 특히 [Navigation Timing API](https://developer.mozilla.org/ko/docs/Web/API/Performance_API/Navigation_timing)는 `PerformanceEntry`라 불리는 이벤트가 발생할 때마다 브라우저에 굉장히 정교한 타임스탬프를 제공합니다.

흥미로운 점은 브라우저에서 Performance API에 직접 접근할 수 있다는 것입니다. 대부분의 성능 항목은 추가적인 코드 작성 없이 웹 페이지마다 기록됩니다. 지금 개발자 도구 콘솔을 열고 [window.performance](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance)를 입력해 보세요. 다음과 같은 내용을 확인할 수 있습니다(구문 분석을 쉽게 하기 위해 관련 타임스탬프를 그룹화하여 정렬했습니다).

```json
// https://whitep4nth3r.com에서 Tues 30 July에 캡처된 내용 @ 13.42
{
  "timing": {
    "navigationStart": 1722343304923,

    "redirectStart": 0,
    "redirectEnd": 0,

    "fetchStart": 1722343304928,

    "domainLookupStart": 1722343304928,
    "domainLookupEnd": 1722343304928,

    "connectStart": 1722343304928,
    "secureConnectionStart": 0,
    "connectEnd": 1722343304928,

    "requestStart": 1722343304988,

    "responseStart": 1722343304989,

    "unloadEventStart": 0,
    "unloadEventEnd": 0,

    "responseEnd": 1722343304998,

    "domInteractive": 1722343305161,
    "domContentLoadedEventStart": 1722343305161,
    "domContentLoadedEventEnd": 1722343305161,
    "domLoading": 1722343304996,
    "domComplete": 1722343305381,

    "loadEventStart": 1722343305381,
    "loadEventEnd": 1722343305381
  }
}
```

Sentry는 이러한 브라우저 스팬을 어떻게 채우나요? Performance API가 URL 요청 시점부터 타임스탬프와 함께 이 지표들을 기록하기 때문에, [Sentry 자바스크립트 SDK](https://docs.sentry.io/platforms/javascript/)는 초기화된 후 이 지표에 접근해, 페이지 로드 이전에 발생한 모든 이벤트 목록을 시간 순서대로 채우고, 이를 전체 추적과 함께 시각화할 수 있도록 Trace View에 스팬으로 전송합니다.

## 웹 페이지가 로드되기 전에 무슨 일이 일어날까요?

`window.performance`는 브라우저에서 웹 페이지 콘텐츠가 나타나기 전 발생하는 여러 이벤트를 들여다볼 수 있는 창(말장난의 의도가 분명합니다)을 제공합니다. 이는 [Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance) 객체를 반환하며, 이전 코드 예시에서 확인할 수 있듯이 [timingproperty](https://developer.mozilla.org/en-US/docs/Web/API/Performance/timing)를 포함하고 있습니다. 이는 코드 작성 없이 페이지 로드 시 브라우저에서 기록된 이벤트를 빠르게 확인할 수 있는 간단한 방법이지만, 이제 `Performance.timing` 속성은 더 이상 사용되지 않고 [PerformanceNavigationTiming API](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming)로 대체되었습니다(몇 가지 소폭 수정이 있었습니다).

아래의 [Navigation Timing Level 2 사양](https://www.w3.org/TR/navigation-timing-2/#processing-model) 다이어그램은 브라우저에서 탐색 요청이 발생한 순간부터 현재 문서의 로드 이벤트가 완료될 때까지 `PerformanceNavigationTiming` 이벤트가 기록되는 순서를 보여줍니다. 모든 이벤트가 매번 발생하지는 않지만, 이 순서는 우리가 `window.performance`를 통해 관찰한 것과 일치합니다.

![image_2_navigation_performance_timeline](https://images.ctfassets.net/em6l9zw4tzag/11nWmU9aak7RtVohpF3f8f/84ea19e410dceed8e7f5cddcec23757b/image_2_navigation_performance_timeline.png)

각각의 관련 이벤트 지표를 살펴보며 내부에서 어떤 일이 일어나는지, 그리고 Sentry가 특정 타임스탬프로부터 이를 어떻게 계산하여 Trace View의 브라우저 스팬을 채우는지 알아보겠습니다. 이를 통해 TTFB 이전의 웹 성능을 어떻게 최적화할 수 있는지 이해할 수 있기를 바랍니다.

### 브라우저 캐시

HTTP GET(예: 웹 페이지에 대한 표준 요청)을 통해 리소스를 가져오고 있다면, 브라우저는 먼저 HTTP 캐시를 확인합니다. `fetchStart`는 브라우저가 캐시를 확인하기 직전의 시간을 반환합니다. Sentry Trace View에서 캐시 스팬은 `fetchStart` 타임스탬프와 `domainLookupStart` 타임스탬프 간의 시간으로 계산됩니다.

Trace View에서 0이 아닌 캐시 스팬 값은 브라우저가 캐시에서 리소스를 가져오는 데 걸린 시간을 나타냅니다. 더 긴 캐시 스팬은 느리거나 오래된 브라우저를 사용하거나 브라우저 캐시를 자주 지우지 않는 사용자일 수 있습니다.

### 브라우저 DNS

다음 스팬은 DNS(Domain Name System) 조회 시간을 보고합니다. 사용자가 URL을 요청하면, DNS는 도메인을 데이터베이스에서 "조회"하여 IP 주소로 변환합니다. 총소요 시간은 `domainLookupStart` 타임스탬프 값에서 `domainLookupEnd` 타임스탬프 값을 뺀 값으로 계산됩니다.

### 브라우저 연결

이제 브라우저가 웹 서버에 연결하는 데 걸리는 시간을 측정할 차례입니다. 이는 "연결 협상(connection negotiation)"이라고 하며, `connectStart`(브라우저가 웹 서버로 연결을 시작하는 시점)와 `connectEnd`(웹 서버에 연결이 완료되는 시점) 간의 시간으로 측정됩니다.

### 브라우저 TLS/SSL

브라우저가 HTTPS를 사용하여 웹 서버에 연결하는 경우, `connectStart`와 `connectEnd` 사이에 `secureConnectionStart` 이벤트가 발생합니다. `secureConnectionStart`는 브라우저와 웹 서버가 TLS(Transport Layer Security) 협상을 통해 안전한 암호화 연결을 확인하는 메시지를 주고받는 시점을 나타냅니다. HTTPS가 사용되지 않거나 [HTTP 지속적 연결 상태](https://en.wikipedia.org/wiki/HTTP_persistent_connection)인 경우, `secureConnectionStart` 값은 `0`이 될 수 있습니다.

Sentry에서는 연결 이벤트와 TLS 이벤트가 별도의 스팬으로 보고됩니다. Trace View에서는 연결 이벤트가 시작되고 TLS 이벤트가 곧바로 시작되며, TLS 협상이 완료되면 연결 이벤트가 끝나는 것을 볼 수 있습니다. 이러한 이벤트 표현은 웹 서버 연결 또는 TLS 협상에 병목 현상이 있는지 독립적으로 확인하는 데 유용합니다.

![image_3_Sentry_Trace_View](https://images.ctfassets.net/em6l9zw4tzag/7hEwSobeWxNqZWp9vWj4p2/764663d4652675b7a1adaeef371a62d6/image_3_Sentry_Trace_View.png)

### 브라우저 요청

웹 서버와 (보안) 연결 후 브라우저는 `requestStart` 이벤트로 표시되는 리소스 요청을 공식적으로 시작합니다.

### 브라우저 응답

마지막으로, 브라우저는 콘텐츠의 첫 번째 바이트를 수신합니다. Sentry Trace View에서 TTFB(첫 바이트까지의 시간) 수직선이 여기에 표시됩니다.

![image_4_Sentry_Trace_View](https://images.ctfassets.net/em6l9zw4tzag/3uqIzPrdeWweVDrdH0qEhh/bc2bc9b24113bcdea710b4f77fdcaee7/image_4_Sentry_Trace_View.png)

## `PerformanceNavigationTiming` 이벤트를 더 빠르게 만들 수 있나요?

이제 웹 페이지의 첫 번째 바이트가 브라우저로 전달되기 전에 어떤 일이 일어나는지 이해했으니, 탐색 타임라인에서 발생하는 이벤트를 더 빠르게 할 수 있는지 알아보겠습니다.

### 브라우저 캐시 검색 이벤트를 더 빠르게 할 수 있나요?

자신의 애플리케이션 성능을 향상하고자 하는 개발자라면, 이 이벤트를 사용자 기반에서 더 빠르게 만들 수 있을지는 확실하지 않습니다. 하지만 개인 브라우저 캐시를 자주 관리함으로써, 이 이벤트를 **스스로** 더 빠르게 할 수는 있을 것입니다. 마치 Git 리포지토리에 변경 사항을 자주 커밋하듯이, 브라우저 캐시를 조금씩, 자주 지우는 것이 좋습니다.

### DNS 조회를 더 빠르게 할 수 있나요?

DNS 조회 속도는 여러 요인에 의해 영향을 받을 수 있습니다. 그중 몇 가지는 다음과 같습니다. (단, 이에 국한되는 것은 아닙니다.)

- **DNS 제공자의 인프라 규모**: 전 세계에 "POP(Point of Presence)"가 적을수록 지연 시간이 길어지고 조회 속도가 느려집니다.
- **POP의 위치**: 웹사이트 방문자가 DNS 서버에서 멀리 떨어져 있을 경우 DNS 조회 시간이 더 오래 걸립니다.
- **DNS 캐시 시간**: DNS는 만료될 때까지 캐시에서 제공됩니다. DNS 캐시 시간의 길이는 DNS 레코드에 지정된 TTL(Time to Live) 값에 의해 결정됩니다(이 레코드는 URL을 IP 주소로 연결합니다). TTL이 높을수록 브라우저가 각 요청마다 새로 DNS 조회를 할 필요가 줄어듭니다.

결국, DNS 조회 속도를 높이려면 대규모의 전 세계적으로 분산된 POP 네트워크를 갖춘 DNS 제공업체에 투자하는 것이 필요합니다. 대규모 엔터프라이즈 비즈니스에서 일하는 개발자라면 이미 이 부분이 처리되었을 가능성이 큽니다. 또한 자주 변경되지 않는 DNS 레코드에 대해 TTL 값을 최대한 높게 설정하는 것이 좋은 전략일 수 있습니다.

현재 작성 시점에서, 저의 개인 웹사이트의 DNS 레코드를 확인해 본 결과 TTL이 **5분**으로 설정되어 있었습니다. 이에 따라 DNS 캐시가 5분마다 만료되어 브라우저가 불필요하게 자주 새로운 DNS 조회를 수행하게 되었습니다. 제 웹사이트 URL을 새 서버로 변경할 일은 거의 없기 때문에, TTL을 60분으로 변경했습니다.

제 개인 웹사이트에서 진행한 5일간의 실험에서는 TTL을 변경한 후 Sentry에서 DNS 조회 시간이 0이 아닌 경우가 줄어든 것을 확인했습니다. 만약 당신의 웹사이트가 중요하지 않고 수익과도 관련이 없다면, DNS 조회를 빠르게 하는 방법으로 적절한 해결책이 될 수 있습니다. 다만, 메인 서버가 다운되어 백업 서버로 URL을 변경해야 할 경우, 전 세계 사용자가 변경 사항을 확인하기까지 최대 60분이 걸릴 수 있다는 점을 유의해야 합니다.

[Sematext](https://sematext.com/glossary/dns-lookup-time/#:~:text=The%20average%20DNS%20lookup%20time,is%20generally%20considered%20very%20good)에 따르면, "평균 DNS 조회 시간은 20ms에서 120ms 사이입니다. 이 범위 내에서 또는 그 이하의 값은 일반적으로 매우 우수한 것으로 간주합니다." 따라서 이와 같은 미세 최적화는 서버 다운 시 TTL이 60분으로 설정되었다는 것을 기억해야 하는 불편함을 감수할 만큼의 큰 효과가 없을 수 있습니다.

### 서드 파티 리소스의 DNS 조회를 개선하기 위한 `rel=”dns-prefetch”` 사용

대부분의 프런트엔드 웹사이트와 애플리케이션은 아마도 하나 이상의 서드 파티 리소스(다른 도메인의 리소스/이미지/파일/스크립트)를 불러오고 있을 것입니다. 각 도메인에 대한 요청에는 DNS 조회 이벤트가 포함됩니다. TTFB 이후, 즉 이 포스트에서 다루는 `PerformanceNavigationTimeline` 이벤트 이후에 서드 파티 리소스가 요청된다는 점은 주의할 필요가 있지만, `<link>` 태그에서 리소스를 요청할 때 속성 `rel="dns-prefetch"`와 관련 `href` 값을 사용하여 이러한 서드 파티 리소스의 DNS 조회를 더 빠르게 할 수 있습니다. 이 속성은 브라우저에 리소스의 원본에서 무언가를 가져와야 할 가능성이 높다는 힌트를 제공하며, 브라우저는 리소스가 공식적으로 요청되기 전에 해당 원본에 대한 DNS 해석을 미리 수행하여 사용자 경험을 개선할 수 있습니다. 예를 들어 Google에서 서드 파티 글꼴을 가져올 때 유용합니다.

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com/" />
```

페이지 로드 시 병렬로 요청되는 서드 파티 리소스가 얼마나 많은지에 따라, 특히 렌더링을 차단하는 리소스일 경우, `responseEnd` 이벤트 이후 브라우저에서 발생하는 이벤트 속도를 높이는 데 도움이 될 수 있습니다.

참고: 웹사이트의 최상위 도메인에서 가져온 리소스(즉, 자체 호스팅 리소스)에 대해서는 `dns-prefetch`를 사용하지 마세요. [MDN에서 dns-prefetch 사용에 대해 자세히 알아보세요.](https://developer.mozilla.org/en-US/docs/Web/Performance/dns-prefetch)

### 연결 및 TLS 협상 이벤트를 더 빠르게 할 수 있나요?

HTTPS를 사용하지 않는 건 어떠세요? 농담입니다. TLS 협상 시간에 대한 핵심은 2010년 구글이 Gmail을 HTTPS로 전환했을 때 이미 TLS가 ["더 이상 계산 비용이 많이 들지 않는다고"](https://hpbn.co/transport-layer-security-tls/#reduce-computational-costs) 선언했다는 것입니다. 2013년 출간된 [고성능 브라우저 네트워킹](https://hpbn.co/transport-layer-security-tls/#reduce-computational-costs)에서 Ilya Grigorik는 "웹 초기에는 'SSL 오프로드'를 수행하기 위해 추가 하드웨어가 필요했지만, 이제는 전용 하드웨어 없이도 CPU에서 직접 처리할 수 있다"고 설명했습니다.

2013년 Ilya가 제시한 한 가지 조언은 [TLS 세션 재개](https://hpbn.co/transport-layer-security-tls/#tls-session-resumption)를 최대한 활용하는 것입니다. 이는 "여러 연결 사이에 동일한 비밀키 데이터를 재사용하거나 공유하는 메커니즘"으로, 간단히 말해, 컴퓨터와 웹사이트가 서로를 기억하고 매번 암호화 키(비밀 암호)를 확인하는 과정을 거치지 않아도 되게 만드는 방식입니다. 이는 브라우징 속도를 더 빠르게 하고 계산 자원을 덜 사용하게 만듭니다.

서버에서 TLS 구현을 직접 책임지지 않는 이상 TLS 협상 속도를 최대한 빠르게 하는 것은 거의 99.999% 이미 처리된 상황일 것입니다. 하지만 `rel="dns-prefetch"`로 리소스에 대한 힌트를 제공할 수 있는 것처럼, `rel="preconnect"`를 사용하여 외부 리소스에 대한 링크에서도 유사한 작업을 수행할 수 있습니다. 이를 통해 TLS 협상의 일부 또는 전체를 미리 수행할 수 있습니다. 이 또한 `PerformanceNavigationTiming` 이벤트 이후에 발생하지만, 여전히 유용한 정보입니다.

### 브라우저 요청 및 응답 이벤트(TTFB)를 더 빠르게 할 수 있나요?

개발자 입장에서 Time to First Byte(`responseStart`)는 페이지 탐색 타임라인에서 가장 많이 통제할 수 있는 부분입니다. `requestStart`와 `responseStart` 이벤트 사이에 발생하는 모든 과정에 주의를 기울이고, 이를 효율적으로 최적화한다면 페이지 로딩 속도와 사용자 경험을 크게 개선할 수 있습니다.

다음은 웹사이트와 애플리케이션에서 조사해야 할 세 가지 사항입니다.

#### 요청 워터폴을 줄이거나 제거하세요

"요청 워터폴"은 리소스(코드, 데이터, 이미지, CSS 등)를 요청하기 위해 다른 리소스 요청이 완료되기를 기다리는 상황을 말합니다. `PerformanceNavigationTimeline`과 관련하여, `requestStart` 이벤트는 웹 페이지나 애플리케이션의 구조, 그리고 브라우저가 첫 번째 데이터 바이트를 받기 전에 발생하는 동기 이벤트의 수에 따라 `responseStart` 이벤트를 지연시킬 수 있습니다. 제 개인 웹사이트의 경우, 페이지 로드 속도가 지나치게 느려졌음을 감지한 후 문제를 조사했을 때, 각 페이지 로드마다 에지 서버로 다수의 왕복 요청을 수행하고 있음을 발견했습니다. 그 즉시 요청을 제거하고 필요한 데이터를 정적 페이지 빌드에 포함하는 방법을 선택하였고, 이를 통해 [TTFB를 약 80% 감소](https://blog.sentry.io/how-i-fixed-my-brutal-ttfb/)시켰습니다.

아마 여러분의 애플리케이션은`requestStart` 이벤트가 발생할 때 여러 데이터베이스 호출을 수행할 수 있습니다. 이러한 쿼리들이 반드시 순차적으로 이루어져야 하나요, 아니면 병렬로 처리될 수 있나요? 더 나아가, 단일 쿼리로 데이터베이스에서 필요한 모든 데이터를 가져올 수 있나요? 리액트를 주로 사용한다면, [리액트에서 페치 워터폴을 식별하는 방법](https://blog.sentry.io/how-to-identify-fetch-waterfalls-in-react/)에 대한 Lazar의 글을 확인해보세요.

더 나아가: 데이터베이스에 실시간 호출을 수행해야 하나요? 아니면 제 사례처럼 웹 페이지를 정적으로 빌드하여 `requestStart` 이후 CDN(콘텐츠 전송 네트워크)을 통해 빠르게 정적 HTML 페이지를 제공하는 방법은 어떨까요? 이 방식을 사용하면 페이지의 상호작용성을 향상시키며, 페이지 로드 후에도 클라이언트 측 자바스크립트로 새 데이터를 가져오는 것도 가능합니다.

#### 캐시, 캐시, 캐시

CDN을 사용하면 콘텐츠가 전 세계 에지 서버에 캐시 되어, 방문자와 물리적으로 더 가까운 서버에서 제공됩니다. 만약 웹사이트(또는 일부 페이지)가 개인화된 콘텐츠나 동적 콘텐츠를 제공하지 않는다면, 캐싱을 적극적으로 활용하는 것이 좋습니다. 캐싱은 전체 HTML 응답을 요청할 때마다 다시 생성할 필요 없이 저장된 데이터를 온디맨드로 제공할 수 있게 합니다. 최신 호스팅 솔루션을 사용해 웹사이트를 제공하는 프런트엔드 개발자로서 이러한 수준의 설정을 직접 다룰 필요가 없기에, 캐싱의 전문가라고 할 수는 없지만, 구글의 [첫 바이트까지의 시간 최적화](https://web.dev/articles/optimize-ttfb?hl=ko) 글에서 얻은 유용한 정보를 공유하겠습니다.

- 콘텐츠가 자주 업데이트되는 사이트라 할지라도 짧은 캐싱 시간이 성능에 상당한 이점을 가져다줄 수 있습니다. 캐싱 기간 동안 첫 번째 방문자만이 오리진 서버까지의 전체 지연을 경험하고, 그 이후의 모든 방문자는 에지 서버에 저장된 캐시 리소스를 재사용할 수 있기 때문입니다.

TLS 협상과 마찬가지로, 2024년의 프런트엔드 개발자로서는 우리가 신경 쓸 일이 많지 않습니다. 우리가 사용할 수 있는 도구들 덕분에 이 모든 것이 자동으로 처리되기 때문입니다. 그리고 최신 도구에 대해 말하자면, 많은 프런트엔드 프레임워크와 라이브러리가 이제 HTML 스트리밍을 대중에게 제공하고 있습니다.

#### HTML 스트리밍의 힘을 활용하세요

HTML 스트리밍은 서버가 한 번에 전체 HTML 문서를 제공하는 대신, HTML 문서를 부분적으로 제공하는 방식입니다. 브라우저는 이러한 HTML 조각을 수신하고 이를 파싱 하거나 렌더링 하여 웹 페이지가 더 빨리 로드되는 것처럼 보이게 할 수 있습니다. HTML 문서 전체를 `requestStart`와 `responseStart` 이벤트 사이에 기다리기보다 HTML 스트리밍을 통해 `responseStart` 이벤트가 더 일찍 발생하게 하여 TTFB를 줄일 수 있습니다.

리액트 생태계에서 일하면서 더 많은 것을 알고 싶다면, Lazar가 [리액트 서버 컴포넌트의 포렌식](https://blog.sentry.io/the-forensics-of-react-server-components/)에서 HTML 스트리밍에 대해 심층적으로 설명합니다.

## 아는 것이 곧 힘입니다

`PerformanceNavigationTiming`처럼 브라우저가 웹 페이지의 첫 번째 바이트 데이터를 수신하기 전에 어떤 일이 발생하는지 알려주는 데이터는 상당히 강력합니다. 그러나 진정한 힘은 이러한 데이터를 Sentry Trace View에서 맥락 속에 배치하는 데 있습니다. `PerformanceNavigationTiming` 이벤트와 문제를 시각화하고 추적할 수 있을 때, 우리는 이 타임라인의 느린 부분을 세부적으로 디버깅하고 가능한 경우 미세한 최적화를 수행할 수 있는 길을 열게 됩니다.

여러분의 웹 페이지와 애플리케이션이 이미 최적의 속도를 달성했다 하더라도, 이 글에서 유용한 정보 얻으셨기를 바랍니다. 아마도 DNS에 대해 새롭게 알게 된 지식으로 다음 멋진 파티에서 사람들을 깜짝 놀라게 할 수 있을 것입니다.

웹 사이트 성능 개선에 대해 더 알아보려면 다음 리소스를 참고하세요.

- [리액트에서 fetch 워터폴 식별 방법](https://blog.sentry.io/how-to-identify-fetch-waterfalls-in-react/)
- [백엔드 문제로 인한 느린 페이지 디버그 방법](https://blog.sentry.io/debugging-slow-pages-caused-by-slow-backends/)
- [백엔드 문제로 인한 낮은 LCP 점수 디버그 방법](https://blog.sentry.io/your-bad-lcp-score-might-be-a-backend-issue/)
- [병목 현상을 식별하기 위한 프로파일링 활용 방법](https://sentry.io/for/profiling/)

또한 성능 모니터링을 시작하는 데 문제가 있는 경우 언제든 [Discord](https://discord.com/invite/sentry), [GitHub](https://github.com/getsentry/sentry/discussions) 또는 [X](https://x.com/getsentry)에 연락할 수 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
