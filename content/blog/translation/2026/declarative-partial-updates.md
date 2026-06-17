---
title: '(번역) 선언적 부분 업데이트'
date: 2026-06-19 09:30:00
category: 'Translation'
draft: false
---

> 원문: [declarative partial updates](https://developer.chrome.com/blog/declarative-partial-updates)

웹은 시작 당시의 정적, 문서 중심 매체에서 오래전에 벗어났습니다. 현대적이고 풍부한 웹 앱은 소통, 구매, 다양한 콘텐츠 소비, 복잡한 일상 관리 등 수많은 이유로 모든 사람이 사용합니다.

HTML은 모든 발전에도 불구하고 콘텐츠가 준비된 시점이나 사용자가 소비하는 시점과 관계없이 여전히 위에서 아래로 순서대로 전달됩니다. CSS로 콘텐츠 순서를 바꿀 수 있지만 접근성 측면에서 상당한 부작용이 발생할 수 있습니다. 자바스크립트는 다양한 API로 DOM을 조작하여 이 제약에서 어느 정도 벗어나지만, HTML에 연결하려면 장황한 구문이나 DOM 트리 구성이 필요한 경우가 많습니다.

웹은 클라이언트-서버 특성상 성능이 매우 중요하지만, HTML의 순서대로 전달되는 특성을 우회하기 위해 최적이 아닌 선택을 하는 경우가 많아 성능이 저하됩니다. 전체 페이지가 준비될 때까지 기다리거나 컴포넌트를 비동기 방식으로 전달하기 위해 무거운 프레임워크를 사용하는 것이 그 예입니다. 자바스크립트 프레임워크의 인기는 웹 개발자들이 웹의 기원인 엄격한 문서 중심 멘탈 모델보다 컴포넌트 기반 모델을 선호한다는 것을 보여줍니다.

Chrome 팀은 이 문제를 고민해 왔으며, 웹 플랫폼에 [선언적 부분 업데이트(Declarative Partial Updates)](https://github.com/WICG/declarative-partial-updates)라는 이름의 새로운 기능을 개발해 왔습니다.

두 가지 새로운 API 세트로 HTML을 보다 비선형적인 방식으로 더 쉽게 전달할 수 있습니다. HTML 문서 내에서 순서에 구애받지 않거나, 새로운 자바스크립트 API를 활용하여 기존 문서에 HTML을 동적으로 삽입하는 방식 모두 지원합니다. Chrome 148부터 `chrome://flags/#enable-experimental-web-platform-features` 플래그를 사용하여 개발자 테스트를 진행할 수 있습니다. 폴리필도 제공되어 아직 지원하지 않는 브라우저에서도 이 새로운 API를 바로 사용할 수 있습니다.

웹 플랫폼에 추가된 이 기능들은 다른 브라우저 공급업체와 표준화 기관의 긍정적인 피드백을 바탕으로 표준화가 진행 중입니다. 관련 표준은 이 새로운 API를 포함하도록 업데이트되고 있습니다.

## 비순서 스트리밍

첫 번째 변경 사항은 `<template>` HTML 요소와 처리 명령어(processing instruction) 자리표시자를 사용하는 새로운 [비순서 스트리밍 API(out-of-order streaming APIs)](https://github.com/WICG/declarative-partial-updates/blob/main/patching-explainer.md)입니다.

```html
<div><?marker name="placeholder"></div>

...

<template for="placeholder"> Here is some <em>HTML content</em>! </template>
```

[처리 명령어](https://developer.mozilla.org/docs/Web/API/ProcessingInstruction)는 XML에서 오랫동안 존재해 왔지만, HTML에서는 주석으로 처리되어 무시되었습니다. 이 새로운 API는 그 동작을 바꿔 HTML에 처리 명령어를 도입합니다. 브라우저가 `<?marker name="placeholder">` 처리 명령어를 만나면 이전처럼 즉시 아무 동작도 하지 않지만, 나중에 참조할 수 있도록 기록해 둡니다.

[`<template>` 요소](https://developer.mozilla.org/docs/Web/HTML/Reference/Elements/template)는 `name` 속성으로 해당 처리 명령어를 찾아 콘텐츠를 교체합니다. 파싱이 완료된 후 DOM은 다음과 같습니다.

```html
<div>Here is some <em>HTML content</em>!</div>
```

교체를 위한 `<?marker>` 외에도, 템플릿이 처리되기 전에 임시 자리표시자 콘텐츠를 표시할 수 있는 `<?start>`와 `<?end>` 범위 마커도 있습니다.

```html
<div>
  <?start name="another-placeholder">
  Loading…
  <?end>
</div>

...

<template for="another-placeholder">
  Here is some <em>HTML content</em>!
</template>
```

`<template>`이 파싱될 때까지 `Loading…`이 표시되다가 새 콘텐츠로 교체됩니다.

템플릿 안에 처리 명령어를 포함하여 여러 번의 업데이트를 허용할 수도 있습니다.

```html
<ul id="results">
  <?start name="results">
  Loading…
  <?end>
</ul>

...

<template for="results">
  <li>Result One</li>
  <?marker name="results">
</template>
...

<template for="results">
  <li>Result Two</li>
  <?marker name="results">
</template>
...
```

파싱 후 생성되는 HTML은 다음과 같습니다.

```html
<ul id="results">
  <li>Result One</li>
  <li>Result Two</li>
  <?marker name="results">
</ul>
```

나중에 문서에 `<template for="results">`가 추가될 경우에 대비해 마지막에 처리 명령어가 남아 있습니다.

### 데모

다음 영상은 스트리밍 HTML로 구현한 기본 사진 앨범 애플리케이션입니다.

![비순서 스트리밍으로 구현된 사진 앨범 데모](https://developer.chrome.com/blog/declarative-partial-updates/image/patching-photo-album-poster.jpg)

비순서 스트리밍으로 구현된 사진 앨범 데모 ([소스](https://github.com/GoogleChromeLabs/web-perf-demos/blob/main/patching-demos/photo-album-server.js))

초기 레이아웃 이후 상태와 사진이 모두 HTML로 스트리밍됩니다.

### 사용 사례

스트리밍 HTML과 결합된 이 비순서 패치 HTML에는 다양한 사용 사례가 있습니다.

- **아일랜드 아키텍처(island architecture).** Astro와 같은 프레임워크가 대중화한 일반적인 패턴인 [아일랜드 아키텍처](https://jasonformat.com/islands-architecture/)로, 컴포넌트가 정적 HTML 위에서 독립적으로 하이드레이션됩니다. `<template for>` API를 사용하면 정적 콘텐츠를 HTML에서 직접 유사한 방식으로 처리할 수 있습니다. 자바스크립트 프레임워크도 이를 활용하여 더 인터랙티브한 아일랜드를 만들거나 컴포넌트를 처리할 수 있습니다.
- **준비된 콘텐츠 전달.** 아일랜드 아키텍처 덕분에 데이터베이스 조회처럼 추가 처리가 필요한 콘텐츠를 기다리지 않고, 준비되는 즉시 콘텐츠를 스트리밍할 수 있습니다. 많은 플랫폼이 스트리밍 HTML을 지원하지만 HTML의 순서 특성 때문에 콘텐츠가 지연되거나 복잡한 자바스크립트 DOM 조작에 의존하는 경우가 많습니다. 이제 기다리는 동안 정적 콘텐츠를 먼저 전달하고, 비용이 많이 드는 콘텐츠는 HTML 스트림 끝에 연결할 수 있습니다.
- **페이지 로드 성능에 최적인 순서로 HTML 전달.** 한 단계 더 나아가, 콘텐츠가 준비된 경우에도 순서를 변경할 수 있습니다. 예를 들어 메가 메뉴는 페이지가 인터랙티브해질 때까지 사용자가 볼 수 없는 많은 HTML을 포함하는 일반적인 탐색 기능입니다. 이 큰 HTML 덩어리는 HTML 문서 뒤쪽에 배치하여 초기 페이지 로드에 필요한 더 중요한 HTML을 우선시할 수 있습니다. HTML에서 순서는 더 이상 제약이 아닙니다.

몇 가지 예시에 불과하며, 개발자들이 이 새로운 API를 어떻게 활용할지 기대됩니다.

### 제한 사항 및 주의점

API에는 몇 가지 제한 사항과 주의할 점이 있습니다.

- `<template for>`는 보안상의 이유로 동일한 부모 요소 내의 처리 명령어만 업데이트할 수 있습니다. `<body>` 요소에 직접 `<template for>`를 추가하면 `<head>`를 포함한 전체 문서에 접근할 수 있습니다.
- `<?end>` 처리 명령어는 선택 사항이며, 생략하면 `<?start>` 요소와 포함 요소의 끝 사이에 있는 콘텐츠가 교체됩니다.
- `<template for>`가 스트리밍을 시작한 후 처리 명령어를 이동하면 새 콘텐츠가 기존 위치로 계속 스트리밍되는 등 예기치 않은 결과가 발생할 수 있습니다.
- `setHTML`이나 `innerHTML` 같은 메서드로 `<template for>`를 동적으로 삽입할 때, 파싱 시 템플릿의 "부모"는 중간 문서 프래그먼트(document fragment)입니다. 따라서 이 메서드로 HTML을 삽입해도 기존 DOM을 수정할 수 없으며 패치는 프래그먼트 내부에서 제자리에 발생합니다. 반면 곧 다룰 `streamHTMLUnsafe` 같은 메서드로 스트리밍할 때는 중간 프래그먼트가 없으므로 템플릿이 기존 콘텐츠를 교체할 수 있습니다.

### 향후 추가될 수 있는 기능

현재 검토 중인 향후 추가 기능은 다음과 같습니다.

- **클라이언트 측 인클루드(client side includes).** 예를 들어 `<template for="footer" patchsrc="/partials/footer.html">`와 같은 방식입니다.
- **일괄 처리(batching).** 클라이언트 측 프래그먼트 인클루드를 확장하여 여러 업데이트가 동시에 발생하도록 일괄 처리를 지원할 수 있습니다.
- **변경되지 않는 콘텐츠 덮어쓰기 방지.** 콘텐츠 리비전 번호나 버전 관리로 구현할 수 있습니다. 콘텐츠를 초기화하는 대신 라우트 변경이나 다른 업데이트 사이에서도 상태를 유지할 수 있습니다.
- **패치 중 새니타이징(sanitizing).** 예를 들어 `<template for=icon safe><svg id="from-untrusted-source">...</svg></template>`와 같은 방식입니다.

### 폴리필

Chrome 팀은 다른 브라우저에 이 기능이 도입되기 전에도 바로 사용할 수 있도록 [`template-for-polyfill`을 출시했으며](https://github.com/GoogleChromeLabs/template-for-polyfill) [npm에서 사용 가능합니다](https://www.npmjs.com/package/template-for-polyfill).

브라우저의 HTML 파서를 직접 업데이트할 수 없어 [몇 가지 제한 사항](https://github.com/GoogleChromeLabs/template-for-polyfill#limitations)이 있지만, 가장 일반적인 사용 사례는 모두 지원합니다. 다른 브라우저에서도 계속 테스트해야 합니다.

## 새로운 HTML 삽입 및 스트리밍 메서드

모든 콘텐츠를 HTML로 전달할 수는 없습니다. Chrome이 이 영역에서 진행하는 작업의 두 번째 부분은 자바스크립트로 콘텐츠를 업데이트하는 과정을 더 쉽게 만드는 것입니다.

자바스크립트로 기존 문서에 HTML을 동적으로 삽입하는 방법은 이미 여러 가지가 있습니다.

- `setHTML`
- `setHTMLUnsafe`
- `innerHTML` 및 `outerHTML` setter
- `createContextualFragment`
- `insertAdjacentHTML`

그러나 이 API들은 모두 개발자가 항상 인지하지 못할 수 있는 미묘한 차이와 다른 동작 방식을 가지고 있습니다.

- 새 콘텐츠가 덮어쓰기되는지, 아니면 추가되는지
- `<script>` 태그를 이스케이프하는 등 잠재적으로 위험한 HTML을 새니타이징(sanitizing)하는지
- 그렇지 않다면 `<script>`를 실행해야 하는지
- TrustedTypes와 어떻게 작동하는지

솔직히 이 API들을 보고 각각에 대한 질문에 자신 있게 답할 수 있는 개발자는 거의 없을 것입니다.

큰 제한 사항은 [HTML 스트리밍을 허용해야 한다는 요청](https://github.com/whatwg/html/issues/2142)이 있었음에도 불구하고, 미리 알고 있는 완전한 HTML 세트에만 사용할 수 있다는 점입니다. 실질적으로 콘텐츠를 바로 스트리밍할 수 있다는 HTML의 강점에도 불구하고, 삽입 전에 전체 콘텐츠를 다운로드해야 합니다. 페이로드를 분할하거나 `document.write` 같은 임시방편의 사용 중단된 메서드를 활용하여 제한적으로 우회할 수 있지만, 이 방법들도 자체적인 문제를 야기합니다.

### 새로운 정적 및 스트리밍 API 세트

Chrome은 기존 `setHTML`과 `setHTMLUnsafe`를 정리하고 스트리밍 기능을 도입하는 [새로운 API 모음](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md)을 제안했습니다.

기존 HTML 앞뒤에 콘텐츠를 삽입하는 메서드와 함께 설정하거나 대체하는 메서드가 있습니다. 각 메서드에는 스트리밍 버전이 있습니다.

| 동작                              | 정적                              | 스트리밍                          |
| --------------------------------- | --------------------------------- | --------------------------------- |
| 요소의 HTML 콘텐츠 설정           | `setHTML(html, options);`         | `streamHTML(options);`            |
| 전체 요소를 이 HTML로 교체        | `replaceWithHTML(html, options);` | `streamReplaceWithHTML(options);` |
| 요소 앞에 HTML 추가               | `beforeHTML(html, options);`      | `streamBeforeHTML(options);`      |
| 요소의 첫 번째 자식으로 HTML 추가 | `prependHTML(html, options);`     | `streamPrependHTML(options);`     |
| 요소의 마지막 자식으로 HTML 추가  | `appendHTML(html, options);`      | `streamAppendHTML(options);`      |
| 요소 뒤에 HTML 추가               | `afterHTML(html, options);`       | `streamAfterHTML(options);`       |

_새로운 삽입 및 스트리밍 메서드_

곧 다룰 `Unsafe` 버전도 있습니다. `Unsafe` 버전까지 포함하면 많아 보일 수 있지만, 일관된 명명 규칙 덕분에 앞서 언급한 서로 관련 없는 메서드들에 비해 각 메서드의 기능을 훨씬 명확하게 파악할 수 있습니다.

정적 버전은 새 HTML을 DOM 문자열 인수로 받으며 선택적 옵션도 지정할 수 있습니다.

```js
const newHTML = '<p>This is a new paragraph</p>';
const contentElement = document.querySelector('#content-to-update');

contentElement.setHTML(newHTML);
```

스트리밍 버전은 `getWriter()`와 함께 [Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API)와 연동하여 작동합니다.

```js
const contentElement = document.querySelector('#content-to-update');
const writer = contentElement.streamHTMLUnsafe().getWriter();

// Example stream of updating content
while (true) {
  await writer.write(`<p>${++i}</p>`);
  await new Promise(resolve => setTimeout(resolve, 1000));
}

writer.close();
```

fetch 응답에서 [파이프 체인(pipe chains)](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#pipe_chains)을 활용할 수도 있습니다.

```js
const contentElement = document.querySelector('#content-to-update');

const response = await fetch('/api/content.html');

response.body
  .pipeThrough(new TextDecoderStream())
  .pipeTo(contentElement.streamHTMLUnsafe());
```

중간 `TextDecoderStream()` 단계 없이 직접 스트리밍할 수 있는 [편의 메서드도 추가할 계획](https://chromestatus.com/feature/5146752165478400)입니다.

`options` 인수를 사용하면 커스텀 `sanitizer`를 지정할 수 있으며, 기본값은 `default`로 [기본 새니타이저 설정](https://developer.mozilla.org/docs/Web/API/HTML_Sanitizer_API/Default_sanitizer_configuration)을 사용합니다.

```js
const newHTML = '<p>This is a new paragraph</p>';
const contentElement = document.querySelector('#content-to-update');

// Only allows basic formatting
const basicFormattingSanitzer = new Sanitizer({
  elements: ['em', 'i', 'b', 'strong'],
});

contentElement.setHTML(newHTML, { sanitizer: basicFormattingSanitzer });
```

### "안전하지 않은" 메서드

각 API의 "안전하지 않은(unsafe)" 버전도 있습니다.

| 동작                              | 정적                                    | 스트리밍                                |
| --------------------------------- | --------------------------------------- | --------------------------------------- |
| 요소의 HTML 콘텐츠 설정           | `setHTMLUnsafe(html,options);`          | `streamHTMLUnsafe(options);`            |
| 전체 요소를 이 HTML로 교체        | `replaceWithHTMLUnsafe(html, options);` | `streamReplaceWithHTMLUnsafe(options);` |
| 요소 앞에 HTML 추가               | `beforeHTMLUnsafe(html, options);`      | `streamBeforeHTMLUnsafe(options);`      |
| 요소의 첫 번째 자식으로 HTML 추가 | `prependHTMLUnsafe(html, options);`     | `streamPrependHTMLUnsafe(options);`     |
| 요소의 마지막 자식으로 HTML 추가  | `appendHTMLUnsafe(html, options);`      | `streamAppendHTMLUnsafe(options);`      |
| 요소 뒤에 HTML 추가               | `afterHTMLUnsafe(html, options);`       | `streamAfterHTMLUnsafe(options);`       |

_"안전하지 않은" 삽입 및 스트리밍 메서드_

"안전하지 않은" 메서드들은 기본적으로 새니타이저를 비활성화하며(원하는 경우 커스텀 새니타이저 지정 가능), 기본값이 `false`인 선택적 `runScripts` 옵션으로 스크립트 실행도 허용할 수 있습니다.

`setHTML`과 마찬가지로 `setHTMLUnsafe`는 기존 메서드이지만, 스크립트 실행과 함께 사용할 수 있도록 `runScripts` 옵션 매개변수가 추가되었습니다.

```js
const newHTML = `<p>This is a new paragraph</p>
                 <script src=script.js></script>`;
const contentElement = document.querySelector('#content-to-update');

contentElement.setHTMLUnsafe(newHTML, { runScripts: true });
```

메서드 이름의 "안전하지 않은(unsafe)"이라는 표현은 사용하지 말라는 뜻이 아니라, 잠재적 위험과 스크립트를 새니타이징하거나 제한하는 방법을 상기시키기 위한 것입니다.

얼마나 "안전하지 않은지"는 입력의 신뢰도에 따라 다릅니다. `Unsafe` 정적 메서드는 모두 DOM 문자열 또는 `TrustedHTML`을 `html` 인수로 받으며 새니타이저를 사용할 수도 있습니다. 다만 `runScripts`의 목적 자체가 스크립트 실행을 허용하는 것이므로 기본적으로 새니타이저가 사용되지 않습니다.

### 사용 사례

이 새로운 API들은 일관된 이름과 옵션으로 기존 페이지에 HTML을 더 쉽게 추가할 수 있게 해줍니다. 스트리밍 API는 새 콘텐츠가 모두 준비될 때까지 기다리지 않아도 되는 성능상의 이점을 제공합니다.

사용 사례는 다음과 같습니다.

- **단일 페이지 앱에서 대용량 콘텐츠 업데이트의 동적 스트리밍.** 앞서 언급했듯이, 현재 SPA(단일 페이지 앱, Single Page App)의 큰 단점은 초기 HTML 로드의 스트리밍 특성을 활용할 수 없다는 것이었습니다. 이제는 가능합니다!
- **HTML 바닥글과 같은 공통 콘텐츠 삽입.** 자바스크립트 API를 사용하면 모든 페이지에 반복해서 포함하는 대신 파셜 파일을 불러와 페이지에 삽입하여 캐싱의 이점을 누릴 수 있습니다. 다만 자바스크립트 실행에 의존하므로 초기 로드에서 표시되지 않는 콘텐츠에만 사용해야 합니다.

몇 가지 예시에 불과하며, 여러분이 어떤 아이디어를 내놓을지 기대됩니다!

### 제한 사항 및 주의점

이 새로운 API들에도 몇 가지 제한 사항과 주의할 점이 있습니다.

- Trusted Types API와 스트리밍을 통합하려면 모든 HTML 설정 작업에 새니타이저를 주입할 수 있는 새로운 `createParserOptions` 메서드를 사용해야 합니다. 신뢰할 수 있는 타입 통합에 관한 자세한 내용은 [설명자를 참고하세요](https://github.com/WICG/declarative-partial-updates/blob/main/dynamic-markup-revamped-explainer.md#trusted-types-integration).
- `<template for>`와 마찬가지로, 스트리밍 중인 요소를 이동하면 예기치 않은 결과나 스트림 오류가 발생할 수 있습니다.
- `streamHTMLUnsafe`는 기본 문서에 추가될 때 `<template for>` 명령어를 처리하고 `defer` 스크립트를 스트림 끝까지 지연하는 등 여러 면에서 기본 파서와 더 유사하게 동작합니다.

### 폴리필

Chrome 팀은 다른 브라우저에 이 기능이 도입되기 전에도 바로 사용할 수 있도록 [`html-setters-polyfill`을 출시했으며](https://github.com/GoogleChromeLabs/html-setters-polyfill) [npm에서 사용 가능합니다](https://www.npmjs.com/package/html-setters-polyfill).

이 폴리필은 스트리밍을 지원하지 않으며, 완료될 때까지 버퍼링한 후 적용합니다. 기능 자체보다는 API 형태에 대한 폴리필에 가깝습니다.

안전한 콘텐츠 설정은 `setHTML`과 Safari에서 지원하지 않는 [Sanitizer API](https://developer.mozilla.org/docs/Web/API/HTML_Sanitizer_API)에 의존합니다.

## 이 두 가지를 함께 사용하기

두 가지 별개의 API지만, 함께 사용할 때 진정한 효과를 발휘합니다. 새로운 `<template for>` 요소를 HTML로 스트리밍하면 DOM에 대한 별도의 자바스크립트 참조 없이도 콘텐츠의 여러 부분을 동적으로 업데이트할 수 있습니다.

기본적인 SPA 방식의 페이지 로드는 처리 명령어가 포함된 개요 페이지를 로드한 다음, 각 새 페이지의 템플릿을 HTML 하단으로 스트리밍하여 해당 처리 명령어에 삽입하는 방식으로 구현할 수 있습니다.

두 API 모두 더 많은 가능성과 사용 사례가 있으니, (제한된!) 상상력에 제약을 받지 마세요. 부분 업데이트를 더 쉽게 관리할 수 있게 함으로써 보일러플레이트 코드를 줄이고, 업데이트를 단순화하며, 웹의 새로운 잠재력을 열어줄 것입니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
