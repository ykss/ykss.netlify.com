---
title: '(번역) 대규모 프런트엔드 프로젝트를 빌드하고 제공하기'
date: 2023-02-13 01:00:00
category: 'Translation'
draft: false
---

> 원문: [Building and delivering frontends at scale](https://frontendmastery.com/posts/building-and-serving-frontends-at-scale/)

> 프런트엔드 빌드 도구 및 기술의 진화에 대해 자세히 알아보며, 상호작용이 가능한 대규모의 프런트엔드 서비스를 제공하기 위한 도전 과제를 이해해 보세요.

웹은 정적 미디어의 모방에서 크로스 플랫폼 소프트웨어를 배포하는 지배적인 방식으로 발전했습니다.

웹과 밀접한 관계를 맺고 있는 Javascript 생태계는 소프트웨어가 전 세계를 잠식하며 계속해서 성장하고 있습니다.

이러한 빠르고 유기적인 성장은 혼란을 가져왔고 대규모의 대화형 애플리케이션을 제공할 때 문제를 불러 일으켰습니다.

웹은 매우 파편화되어 있습니다. 다양한 브라우저, 버전, 기능, 특징 및 버그를 가진 다양한 장치에서 실행됩니다.

시간이 지남에 따라, 우리는 이러한 차이를 표준화하고 생산 번들을 최적화하고 빠른 로컬 피드백 루프를 제공하는 많은 도구를 발전시켰습니다.

Javascript 생태계는 현재 파편화 피로를 해소하고 속도를 중시하며 구축된 차세대 빌드 도구의 부흥을 경험하고 있습니다.

한편, 이러한 도구 중 다수는 IE의 서비스 종료와 ES2015+에 대한 광범위한 지원으로 선택 사항이 되었습니다.

이 글에서는 프런트엔드 빌드 도구의 진화에 대해 자세히 살펴보겠습니다. Javascript를 중심으로 한 대규모 대화형 프런트엔드를 제공할 때 만나는 몇 가지 주요 과제를 이해할 것입니다.

마지막으로, 동적 번들링과 같은 고급 주제를 다루면서 프런트엔드 빌드 도구의 현재 상태와 그 도구가 해결하려는 문제에 대해 잘 이해하게 될 것입니다.

모든 애플리케이션의 기본 구성 요소인 간단한 모듈부터 여정을 시작하겠습니다.

## 모듈형 Javascript 둘러보기

오랫동안 웹 프런트엔드 코드를 모듈화 하는 기본적인 방법이 없었습니다. 복잡한 경험을 구축할수록 모듈의 필요성이 자명해졌습니다.

이러한 현상으로 인해 시간이 지나면서 공식적으로 지원하지 않는 많은 모듈 포맷들이 탄생하게 되었습니다.

간략한 개요를 살펴보겠습니다. 이렇게 하면 빌드 도구의 역할을 상황에 맞게 이해하는 데 도움이 될 것입니다.

### IIFE - 즉시 실행 함수 표현

스크립트는 전역 네임스페이스를 공유하므로 코드를 다른 파일로 분할하더라도 [확장 가능한 CSS의 진화](https://frontendmastery.com/posts/the-evolution-of-scalable-css/)에 설명된 충돌 위험이 있습니다.

IIFE는 일정 수준의 격리로 스코프를 생성하는 간단한 방법으로 시작했습니다.

```js
(function() {
  // 여기서 정의된 변수는
  // 함수의 클로저를 통해 캡슐화된 private 변수입니다.
})();
```

### CJS - Common JS

Node는 브라우저 외부에서 모듈을 표준화하려는 첫 번째 시도 중 하나인 CommonJS와 함께 생태계에 진입했습니다.

```js
const { foo, bar } = require('./baz');
class MyClass {}
module.exports = MyClass;
```

브라우저에 적합하지 않은 몇 가지 사항은 다음과 같습니다.

1. `require` 호출은 파일 시스템에서 동기적으로 모듈을 로드하고 평가합니다. 이는 로컬 또는 서버에서는 의미가 있습니다. 그러나 브라우저는 네트워크를 통해 코드를 로드하기 위해 URL에 의존하게 됩니다.

2. `require`에 대한 import 경로는 동적 문자열을 사용할 수 있습니다. 이는 코드 베이스를 분석하고 어떤 모듈이 특정 용도로 사용되는지 파악하는 것을 어렵게 하여 브라우저 번들에서 미사용 코드를 삭제하기 어렵게 만듭니다.

그런데도, 우리는 여전히 런타임에서 Javascript 모듈을 재사용하기를 원했습니다. [Browserify](https://browserify.org/)와 같은 초기 번들러는 CJS 모듈을 하나의 거대한 파일로 결합하여 브라우저로 전송할 수 있도록 합니다.

### AMD - 비동기 모듈 정의

서버를 위한 모듈 형식을 갖춘 것은 훌륭했지만, 브라우저를 위한 효율적인 것이 필요했습니다.

AMD는 브라우저 모듈 형식을 표준화하고, 명시적인 종속성 순서를 통해 병렬 비동기 로딩 문제를 해결하려고 시도했습니다.

[프런트엔드와 백엔드 분할](https://frontendmastery.com/posts/the-new-wave-of-javascript-web-frameworks/#the-frontend-backend-split) 초기에 많은 MVC 프런트엔드 프레임워크가 AMD를 사용하였고, AMD는 **RequireJS**라는 런타임 로더에 의존했습니다.

```js
// define은 종속성 배열과 팩토리 함수를 사용합니다.
define('myModule', ['dep1', 'dep2'], function(dep1, dep2) {
  // 반환 값으로 정의된 모듈
  return function() {};
});
```

### UMD - 범용 모듈 정의

UMD는 여러 환경에서 작동하도록 2013년에 만들어졌습니다.

UMD는 특정 프로퍼티의 존재 여부를 확인함으로써 런타임을 탐지하는 래핑 IIFE가 있으며, AMD 또는 CJS를 사용했습니다.

이를 통해 다양한 환경에서 호환성 문제에 대한 걱정 없이 모듈을 사용할 수 있었습니다.

UMD는 일반적으로 Webpack 또는 Rollup과 같은 번들러를 사용할 때 대체 모듈로 사용됩니다.

예를 들어, React와 같은 패키지는 IIFE로 감싸진 [UMD 모듈로 사용](https://unpkg.com/browse/react@18.2.0/umd/react.development.js)할 수 있습니다.

### ESM - EcmaScript 모듈

우리가 기다려온 공식 모듈 포맷은 ES2015 표준에서 함께 제공되었지만, 타이밍이 약간 늦었습니다.

ES 모듈은 이전 형식을 학습하고, Javascript 런타임의 확장된 범위를 인정하면서 두 가지 장점을 모두 제공했습니다.

ES 모듈에 관해 설명할 것이 많으므로, 주요 사항을 살펴보겠습니다.

- **Import는 정적**이므로 모듈 종속성 그래프를 만들 수 있습니다. 이렇게 하면 함축적인 순서 지정 및 사용되지 않는 코드 식별과 관련된 문제가 해결됩니다. 동적 import는 나중에 추가되었습니다.

- `strict mode`가 기본으로 활성화되어 **Javascript가 실행되는 방식을 업데이트**하고, 변수가 모듈에 스코프 됩니다. 이전에는 `this`가 전역 `window` 객체를 가리켰지만, 이제 `undefined`가 됩니다.

  이러한 변경 사항과 [최상위 수준 `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)은 `NPM`에 남아있는 많은 레거시 코드와의 호환성을 깨뜨렸습니다.

- **Javascript 처리 방식이 변경**되어, 네이티브 모듈은 Javascript 엔진에서 구현되어 브라우저에서 다운로드, 파싱, 실행 단계를 분리할 수 있게 되었습니다.

  네이티브 모듈이 아닌 경우, 이러한 단계는 일반적으로 중단 없이 한 번에 모두 발생합니다.

플랫폼에 따라 방식이 다르기 때문에, ESM 표준은 어떻게 코드가 로드되는지 정의하지 않습니다.

브라우저에서는 `type="module"` 속성과 함께 script 태그를 사용합니다. 이들은 기본적으로 `defer`를 사용합니다.

브라우저 외부에서는 파일 시스템에서 작동하는 노드 모듈 [해석 알고리즘](https://nodejs.org/api/esm.html#resolver-algorithm-specification)을 통해 이루어집니다. [Deno](https://deno.com/deploy)와 같은 차세대 Javascript 런타임은 플랫폼 차이를 매끄럽게 하는 것을 목표로 하고 익숙한 URL을 사용합니다.

또한 CJS 대신 ESM 모듈을 사용하려는 경우, 노드에 알려야 합니다. 이는 `.mjs` 파일 확장자를 사용하거나 package.json에서 `"type": "module"`을 설정하여 수행할 수 있습니다.

새로운 표준이 가져오는 일시적인 스플릿 브레인([split-brain](<https://en.wikipedia.org/wiki/Split-brain_(computing)>)) 현상에도 불구하고, ESM의 등장은 무질서한 Javascript가 강력한 크로스 플랫폼 언어로 유기적으로 성장하는 데 중요한 이정표입니다.

## 웹 번들링 해제

광범위한 ESM 지원 이전에 최신 구문이나 기능을 사용하려면 트랜스파일러와 폴리필의 도움이 필요했습니다.

오늘날 브라우저는 ES2015+에 대한 강력하고 [광범위한 지원](https://kangax.github.io/compat-table/es6/)을 통해 최신 Javascript를 기본적으로 작성할 수 있습니다.

이전에 툴 체인은 CDN에서 `jQuery`를 가져오는 간단한 URL이었습니다. 이제 [ESM.sh](https://esm.sh/), [Sky pack](https://www.skypack.dev/), [JSMPM](https://jspm.org/) 및 [unpkg](https://unpkg.com/)와 같은 최신 CDN은 URL을 통해 NPM에서 패키지를 제공합니다.

이를 통해 많은 사이트에서 다음에 살펴볼 빌드 도구의 대부분을 선택할 수 있습니다.

한 가지 문제는 `import { html } from 'lit-element'`와 같은 코드가 브라우저에서 작동하지 않는다는 것입니다. 이것이 Safari에서 볼 수 있는 [import maps](https://html.spec.whatwg.org/multipage/webappapis.html#import-maps)이 등장한 배경입니다.

Import map을 사용하면 브라우저가 가져올 수 있는 URL에 매핑되는 코드의 `from 'lit-element'`와 같은 기본 지정자(CJS 스타일에서 시작된)를 사용할 수 있습니다.

```js
  <script type="importmap">
    {
      imports: {
        'lit-element': 'https://unpkg.com/lit-element?module',
        'lit-html': 'https://unpkg.com/lit-html?module'
      }
    }
  </script>
```

따라서 많은 종류의 웹 사이트 및 애플리케이션을 위한 복잡한 빌드 도구가 필요하지 않습니다.

React 생태계에서 [Aleph](https://alephjs.org/docs) 및 [Ultra](https://ultrajs.dev/philosophy)와 같은 [Deno](https://deno.land/) 기반 프레임워크를 사용하면 빌드 도구 없이 서버에서 렌더링 된 React 애플리케이션을 만들 수 있습니다.

## 컴파일 대상으로서의 웹

플랫폼을 고수하고 제한 사항을 수용하는 것과 더 많은 유연성을 갖춘 추상화를 구축하는 것 사이에는 각각의 장단점이 있습니다. 그리고 어떤 시나리오에서 잘 작동한다고 해서 반드시 더 큰 규모에서 작동하는 것은 아닙니다.

종종 가장 유용한 추상화가 플랫폼으로 다시 흡수됩니다. 우리의 오랜 친구인 `jQuery` 좋은 예인데, 오늘날에는 [jQuery가 필요하지 않을 수 있습니다](https://youmightnotneedjquery.com/).

그러나 우리가 보았던 것처럼, 플랫폼은 타당한 이유로 사용자 영역 추상화보다 훨씬 더 느리게 움직입니다. 많은 사람들이 Typescript 또는 JSX와 같은 생산성 향상 기술에 익숙해졌습니다.

오늘날 작성하는 코드는 다른 쪽에서 인식할 수 없을 정도로 프레임워크에 의해 과하게 컴파일되고 최적화되고 변환됩니다. 항상 프로덕션 번들을 최적화하기 위한 컴파일 단계가 존재합니다.

이를 염두에 두고 우리가 여기까지 온 과정을 이해함으로써 프런트엔드 빌드 도구의 현재 상태를 파악해 보겠습니다.

### 태스크 러너

프런트엔드 도구의 초기 물결은 다양한 전처리 작업을 조정하는 "태스크 러너"라고 종종 불렸습니다.

이들은 [Grunt](https://gruntjs.com/) 및 [Gulp](https://gulpjs.com/)(그리고 이전의 `RequireJS` 및 `Closure Compiler`)와 같은 도구였습니다.

우리는 여기에 많은 시간을 보내지 않을 것입니다. 그러나 이것들은 프로덕션 번들링과 수동의 소스 순서가 필요했던 파일들의 연결 및 최적화를 처리하는 데 초기에 중요했습니다.

### Webpack

[Webpack](https://webpack.js.org/)은 대략 SPA가 떠오르기 시작했을 때, 번들링과 컴파일을 결합하여 등장했습니다.

Webpack과 결합된 [Babel](https://babeljs.io/blog/2016/12/07/the-state-of-babel#some-history)과 같은 트랜스파일러를 사용하면 ES2015 구문을 사용할 수 있게 해 주었고, 이 구문은 모든 브라우저가 이해할 수 있는 Javascript로 컴파일되었습니다. Javascript 기반 JSX와 함께 React의 인기는 이 컴파일 단계의 채택을 확고히 했습니다.

수동 소스 파일 순서와 비교할 때 Webpack은 엔트리 포인트부터 시작하여 정적 종속성 그래프를 작성하고 항목이 올바른 순서로 자동으로 로드되도록 합니다.

플러그인의 광범위한 생태계를 통해 코드를 변환하고 컴파일할 수 있었고, 이를 통해 어떻게 구축했는지에 대해 상당한 유연성과 실험을 가능하게 했습니다.

이를 통해 환경에 따라 다른 전략을 취할 수 있었습니다.

개발 모드에서는 변경 사항이 브라우저에 즉시 반영되는 것을 볼 수 있었습니다. 프로덕션에서는 요청 시 지연된 청크를 로드하여 최적화된 번들을 제공할 수 있습니다. 이 모든 성능과 유연성에 대한 비용은 복잡한 설정으로 인한 어려움이었습니다.

### Parcel

[Parcel](https://parceljs.org/)은 2017년 대규모 프로젝트에 존재하는 Webpack의 한계에 대한 대안으로 출시되었습니다.

Webpack은 규모가 커짐에 따라 빌드 시간이 길어지고 설정이 복잡해졌습니다. 최소한 한 명의 팀원이 운 좋게도 Webpack 설정 방식을 알고 있었다면 복잡해할 필요가 없었습니다.

대규모 조직에서, 느린 빌드 시간은 생산성을 저하시키는 주요 원인입니다. 이러한 맥락에서 Parcel은 설정이 필요 없는 빌드 도구로서 최상의 모범 사례가 내장되어 있어 대규모 프런트엔드 프로젝트에서 빌드 시간을 크게 줄여줬습니다.

또한 Rust 및 Go와 같은 시스템 수준 언어를 이용한 빌드 도구를 사용하기 시작했는데, Node보다 훨씬 좋은 성능을 보였습니다.

### ESbuild

[esbuilds](https://esbuild.github.io/faq/)의 주요 목적 중 하나는 Go로 처음부터 직접 개발하여 가능한 한 빠르고 가볍게 만드는 것이었습니다. 즉, 한 가지 일을 잘하는 데에 초점을 맞추었습니다.

Esbuild는 많은 부가 기능이 없는 고성능 미니멀 번들러입니다. 번들러로서의 역할을 매우 훌륭하고 빠르게 수행하는 것을 목표로 합니다.

Esbuild는 병렬 처리를 활용하고 가능한 한 유선형 구조로 구성하여 속도를 향상했습니다.

### Rollup

[Rollup](https://rollupjs.org/guide/en)은 사용하지 않는 코드가 제거되는 최적화된 번들을 생성하는 라이브러리 작성자들에게 인기를 얻었습니다. 플러그인으로 쉽게 확장할 수 있다는 장점도 있었습니다.

사용하지 않는 코드를 제거하는 것을 종종 **"트리 쉐이킹(tree-shaking)"**이라고 합니다. ES 모듈이 트리 쉐이킹에 어떻게 도움이 되는지 살펴보겠습니다.

- **Import는 정적**이므로 종속성 그래프를 만들 수 있으며 이는 중요한 요구 사항입니다. 우리가 보았듯이, `require`는 동적 문자열을 import 경로로 사용할 수 있기 때문에 프로그래밍 관점에서 어렵습니다.

- **ESM은 여러 exports를 허용**하므로 모듈을 사용하는 소비자가 사용하는 것을 쉽게 알 수 있습니다.

  이에 비해 CJS와 AMD는 단일 exports만 허용합니다. 해결 방법은 여러 속성이 있는 개체를 내보내는 것입니다.

  `_` 패키지를 사용한다고 가정해 보겠습니다. `memoize`와 같은 하나의 함수만 사용하더라도 번들러는 `_`의 어떤 부분을 사용하는지 확실히 알기 어렵기 때문에 모든 것이 포함됩니다.

  여기서 세밀한 점은 역사적으로 Babel과 같은 트랜스파일러가 ESM *구문*을 CommonJS로 트랜스 파일 한다는 것입니다.

  그래서 트리 쉐이크가 일어나는 것처럼 보일 수 있지만, 의도치 않게 번들 크기가 증가합니다.

  적절한 검사와 균형이 없으면 이러한 세밀한 문제가 보이지 않을 수 있습니다. 이에 대해서는 나중에 다룰 것입니다.

### Vite

[Vite](https://vitejs.dev/)는 네이티브 ESM의 이점을 활용하여 매우 빠른 속도를 가진 널리 사용되는 빌드 도구입니다.

**로컬 개발을 위해** **esbuild**를 사용하여 애플리케이션 종속성을 사전 번들링합니다. 그런 다음 번들되지 않은 애플리케이션 코드를 기본 ESM으로 제공합니다.

따라서 변경되지 않은 패키지에 대한 브라우저 캐싱을 활용하여 빠르게 재컴파일할 수 있습니다. 전체 종속성 그래프를 다시 계산하는 대신 변경된 파일만 다시 컴파일하면 됩니다.

**프로덕션 빌드의 경우** **Rollup**을 사용하여 트리쉐이킹을 쉽게 수행할 수 있으며, 지연 로딩과 일반적인 청크 분할을 통해 브라우저 캐싱을 최적화할 수 있습니다.

### Turbopack

[Turbopack](https://turbo.build/pack/docs/why-turbopack)은 Webpack의 후계자가 되는 것을 목표로 합니다. Rust에서 처음부터 다시 작성되어, 대규모 프로젝트에서 Webpack의 확장 문제를 해결하기 위해 만들어졌습니다.

로컬 개발을 위해 네이티브 브라우저 기능을 활용하는 Vite와 비교하여 Turbopack은 번들 접근 방식을 취하고 모듈이 로컬에서 변경될 때 재컴파일 단계를 고도로 최적화합니다.

특정 규모에서는 브라우저가 가능한 적은 네트워크 요청으로 필요한 코드를 수신할 수 있으면 더 빠른 경우가 있습니다. 다음 섹션에서 자세히 언급할 것입니다.

Turbopack은 또한 즉시 사용할 수 있는 [React 서버 컴포넌트](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html) 컴파일을 지원하며, [Next](https://nextjs.org/)를 사용하는 React 개발자를 위해 Vercel 생태계와 통합되어 있습니다.

## 최적의 코드 전달에 대한 문제

자세히 살펴볼 시간이 없지만, [Rome](https://rome.tools/), [Bun](https://bun.sh/) 및 [Deno](https://deno.land/)와 같은 통합 도구 체인을 제공하는 많은 도구가 있습니다.

하지만 한 걸음 물러서서, 프런트엔드 코드 제공의 몇 가지 주요 과제에 대한 이해를 확고히 해보겠습니다.

스펙트럼의 두 끝에서 시작하겠습니다.

- **개별 스크립트 다운로드**

  이 접근 방식의 장점은 단순성과 변경되지 않는 파일에 대한 브라우저 캐시의 활용입니다.

  수천 개의 개별 파일을 가진 대규모 애플리케이션에서는 브라우저의 동시 요청 제한에 따른 병목 현상이 발생하므로, 일정 규모에서는 문제가 발생합니다.

- **스크립트를 단일 청크로 결합**

이는 네트워크 요청 과부하 문제를 해결하고, 많은 소규모 애플리케이션에서는 매우 효율적인 접근 방식입니다.

그러나 다음과 같은 새로운 확장 문제가 발생합니다.

- 1. 변경할 때 캐시를 무효로 하도록 브라우저에 알려야 합니다.

  파일 콘텐츠에 기반한 고유한 식별자를 생성하기 위해 콘텐츠 해싱을 사용합니다. 따라서 파일이 변경되면, 파일 이름을 새 식별자와 함께 업데이트하고 브라우저는 새로운 버전을 다운로드합니다.

  이는 인기 있는 애플리케이션에 대해 사용자가 매일 동일한 코드를 지속해 다시 다운로드하고 실행한다는 의미입니다.

- 2. 최종 사용자가 즉시 필요하지 않은 많은 코드를 제공받게 됩니다.

이 두 극단의 양쪽 끝에서 **효율적인 네트워크 활용** 및 **캐시 최적화** 문제에 직면하게 됩니다.

실제로는 일반적으로 중간 지점이 있으며, 항상 그렇듯이 무엇을 만드느냐에 [따라 다릅니다](https://surma.dev/things/less-snakeoil/). 그러나 명심해야 할 몇 가지 원칙이 있습니다.

- 1. 언제 어떻게 코드를 로드합니까?

  최대한 빠르게 하기 위한 일반적인 지침으로, 현재 경험에 필요한 코드만 로드하고 나머지는 연기하는 것이 좋습니다.

  현재 경험이 로드된 후의 백그라운드에서 또는 사용자 상호 작용에서 추가 자원을 로드할 수 있습니다.

- 2. 얼마를 보내나요?

  코드는 제공하는 자산 중 가장 비싼 자산이며, 최고의 코드는 코드가 없는 것입니다. 이상적으로 가능한 한 적은 양만 보내는 것이 좋습니다. 애플리케이션 내의 특정 사용자 흐름에 따라 달라질 수 있습니다.

- 3. 언제 어떻게 코드를 실행합니까?

  네트워크를 통해 코드를 다운로드하는 것은 하나의 비용이지만, 해당 코드를 실행하는 것은 [Javascript의 실제 비용](https://v8.dev/blog/cost-of-javascript-2019)입니다. 다음 섹션에서 이 점을 다룹니다.

### Javascript 실행 제어

네트워크를 통해 코드를 다운로드하는 비용을 지불했습니다. 이제 핵심 과제는 코드를 브라우저가 언제 실행할지 최적화하는 것입니다.

두 가지 스펙트럼에 대해 이해해 봅시다.

- **즉시 실행**

  이것은 일반적으로 기본 동작입니다. 브라우저는 다운로드가 완료되자마자 Javascript를 실행하기 시작합니다.

  이에 따라 종종 단일 스레드를 가로막고, 사용자 입력을 방해하며, 사용자 경험과 관련이 없는 코드를 실행하게 됩니다.

- **적시 실행**

  이 접근 방식은 사용자 상호 작용에 따라 요청 시 코드를 실행합니다.

  이 아이디어는 종속성 평가와 같은 모듈 소비의 부작용으로 모듈의 최상위 수준에서 발생하는 모든 작업을 연기해야 합니다. 인라인 요구(inline-requires)를 사용하여 모듈을 가져오는 비용을 런타임에 처음 필요한 시점으로 옮길 수 있습니다.

  이 접근 방식에는 미묘한 차이가 있으며 상호 작용에 대한 응답으로 코드가 실행될 때 간헐적으로 시스템에 과부하가 걸리는 병목 현상이 발생할 수 있습니다.

두 형태 모두 극단적이면 최적이 아니며, [TTI](https://web.dev/tti/)와 [INP](https://web.dev/optimize-inp/) 사이에 장단점이 있습니다.

### 장단점 사이의 균형 맞추기

그렇다면 어떻게 불필요한 일을 미루는 원칙을 가장 잘 따를 수 있을까요?

대부분의 애플리케이션에서 [코드 분할](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting)을 통한 다운로드 지연과 JIT(Just-In-Time) 평가를 통한 실행 지연의 결합하는 것이 최적입니다. 그러나 스마트한 **사전 로딩** 및 **사전 평가**를 통해 간헐적인 병목 현상을 피해야 합니다.

- **낙관적 프리페치**

  이는 사용자 상호 작용 시 코드를 미리 가져오거나, 일반적인 사용자 경로를 이해하여 페이지 로드를 사전에 시작하는 아이디어입니다.

  일반적인 옵션은 브라우저 유휴 시간 동안 미리 가져오는 것입니다.

  [모듈 프리로드 디렉티브](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload)와 [링크 미리 가져오기](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ)와 같은 내장 API를 사용하기 때문에 이 작업은 더 쉬워지고 있습니다.

  또한 `<link href="/myroute" as="fetch" />`를 통한 `fetch`로 수행된 데이터 미리 가져오기도 이 아이디어에 포함됩니다.

  이렇게 하면 코드와 데이터가 브라우저에 의해 미리 다운로드되고, 캐시 된 경우 후속 페이지 전환이 매우 빨라질 수 있습니다.

  [Remix](https://remix.run/)와 같은 중첩된 라우팅이 있는 메타 프레임워크를 사용하는 이점 중 하나는 이러한 기술이 [프레임워크에 내장](https://github.com/remix-run/remix/blob/main/packages/remix-react/components.tsx#L518)되어 있어 편리하다는 것입니다.

  페이지 로드 시 모든 관련 코드를 미리 가져오지만, 필요할 때까지 실행을 연기하는 [Qwik](https://qwik.builder.io/)이 또 다른 예시입니다.

- **사전 평가 코드**

  코드의 다운로드가 끝난 후, 실행을 지연된 코드의 사전 평가에도 같은 전략이 적용됩니다.

  이를 달성하는 데 도움이 되는 일부 기본 요소는 [**isInputPending**](https://engineering.fb.com/2019/04/22/developer-tools/isinputpending-api/) 및 [**requestIdleCallback**](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)과 같은 API를 통해 제공됩니다.

서버 렌더링 SPA의 맥락에서 이러한 최적화는 점진적 및/또는 선택적 **"하이드레이션"** 개념과 관련이 있습니다.

점진적 하이드레이션은 다음에 다루어야 할 넓은 주제이며, [많은 도전적인 문제](https://www.builder.io/blog/why-progressive-hydration-is-harder-than-you-think)를 가지고 있습니다.

또 다른 위험을 감수하며, 대규모 프로젝트의 또 다른 핵심 요소에 주목해 봅시다.

### 종속성 관리 - 번들 확대 방지

우리는 **직접적인 의존성(direct dependencies)**을 가지고 있습니다. 이것들은 `package.json`에 명시하고 있는 의존성입니다.

그런 다음 우리는 직접 종속성의 종속성인 **전이적 의존성(transitive dependencies)**을 갖습니다.

대규모 코드 베이스에서 공통으로 발생하는 문제 중 하나는 **중복된 의존성(duplicated dependencies)**입니다. 즉, 같은 코드를 다른 버전으로 번들링하여 불필요한 번들이 발생하는 것입니다.

이는 감지하기 어려우며, 이를 관리하기 위한 도구 및 프로세스 없이는 인식하기 어렵습니다.

중복 제거 스크립트(de-duplicator scripts)가 도움이 될 수 있지만, 종속성이 많은 대규모 프로젝트의 경우 중복을 피하기 어렵습니다.

많은 종속성을 관리하는 것은 복잡하며, Javascript 생태계에서 고통스러운 측면 중 하나입니다. 다음은 대규모 프로젝트의 종속성 관리에 관한 실용적인 원칙입니다.

- 새로운 의존성을 추가하기 전에 철저한 비용 편익 분석을 수행하고, 어떤 결과가 초래되는지 파악해야 합니다.

- 빌드를 중단하고 풀 리퀘스트에 자동으로 표시되는 번들 크기 예상.

- 번들을 분석하여 전송되는 정보를 정확히 이해하는 능력.

종속성 관리 외에도 가장 큰 프런트엔드 프로젝트는 종종 **여러 버전의 코드**를 제공하는 문제를 가지고 있습니다.

이는 A/B 테스트를 실행과 다양한 위치의 다른 언어를 사용하는 특정 사용자 집단에 기능 플래그를 제공하는 것이 포함됩니다.

이러한 문제는 필요한 것만 전송한다는 단순한 원칙에 대한 어려움을 야기합니다.

이 문제를 해결하기 위해, 동적 번들링 및 모듈 연합의 개념을 탐색하여 마무리하겠습니다.

## 고급 동적 번들링

동적 번들링은 사용자가 상황에 따라 다른 코드를 제공받는다는 아이디어입니다.

예를 들어 애플리케이션 사용자 역할, 실험 그룹, 로케일 및 언어 설정, 브라우저 버전, 하드웨어 기능 등에 따라 적용될 수 있습니다. 정적인 종속성 그래프가 빌드 시간에 제한되는 것에 비해 동적 번들링은 더 많은 적용 가능성이 있습니다.

페이스북과 같은 대기업이 상황에 맞는 사용자 데이터를 사용하여 즉시 번들을 계산할 수 있는 내부 인프라를 어떻게 가지고 있는지 [Javascript 웹 프레임워크의 새로운 물결](https://frontendmastery.com/posts/the-new-wave-of-javascript-web-frameworks/)에서 간략하게 다루었습니다.

지역화, 기능 플래그 코드, 다양한 사용자 역할과 같은 복잡한 요구 사항이 있는 대화형 애플리케이션의 경우 최적의 페이로드를 제공하는 것이 가장 중요합니다.

또한 프런트엔드 빌드 도구의 복잡성이 극에 달하여 클라이언트-서버 간 긴밀한 관계가 필요하고 공개된 구현이 거의 없습니다.

### 모듈 연합

Webpack 5는 [모듈 연합](https://webpack.js.org/concepts/module-federation/) 아이디어를 개척했습니다. 동적으로 연결된 공유 라이브러리라고 생각할 수 있습니다. 런타임 시 독립적으로 빌드된 다른 번들에서 모듈을 가져올 수 있습니다.

정적 종속성 그래프에 동적 동작을 제공하고, 부분적으로는 [마이크로 프런트엔드](https://frontendmastery.com/posts/understanding-micro-frontends/)와 같은 아키텍처를 강화합니다.

모듈 연합은 위에서 설명한 많은 문제를 해결하는 것을 목표로 합니다. 대규모 라이브러리 업그레이드 롤 아웃, 공유 모듈의 대규모 리팩토링 또는 디자인 시스템 구성 요소를 최신 버전으로 업데이트하는 등의 작업을 수행합니다.

강력한 힘에는 큰 책임이 따른다는 것을 기억하는 것이 좋습니다. 동적인 상황에서, 예상치 못한 API 변경사항이나 혹은 그보다 더 나쁜 상황과 같은 새로운 문제가 발생할 가능성이 있습니다.

여러 언어로 번역해야 하는 대규모 대화형 프런트엔드의 예를 들어 보겠습니다.

모듈 연합을 사용하면 사용자의 로케일에 따라 동적으로 로드된 번역된 문자열을 독립적인 애플리케이션 간에 공유할 수 있습니다.

대부분의 번들러가 만든 정적 종속성 그래프를 사용하면 많은 장단점으로 인해 이 문제를 해결하기가 더 까다롭습니다.

일반적인 접근 방식은 각 로케일에 대해 별도의 번들을 생성하는 것입니다. 이렇게 하면 [빌드 시간을 크게 늘리고](https://www.etsy.com/fr/codeascraft/production-webpack-builds#Localization) 프런트엔드 빌드의 복잡성을 가중할 수 있습니다.

이는 매우 큰 프런트엔드에서만 직면하는 문제이며, 기술은 다소 빠르게 발전하고 있습니다.

## 결론

우리는 많은 배경을 다루었습니다. 험난한 역사와 오늘날에도 여전히 존재하는 파편화에도 불구하고 웹의 미래는 더욱 간소화되고 표준화될 것입니다.

새로운 런타임이 에지 작업자로 나타나면서 모든 Javascript 런타임에서 표준화된 API의 필요성이 그 어느 때보다 분명해졌으며 [WinterCG](https://wintercg.org/faq)와 같은 조직이 이러한 요구를 충족하는 것으로 보입니다.

IE11의 죽음, ESM 지원 및 에버그린 브라우저에 대한 지원은 많은 종류의 웹 사이트에서 프런트엔드 빌드 도구를 관리하는 시대가 끝날 수 있음을 의미합니다.

대규모 애플리케이션의 경우, 번들링 도구가 그 어느 때보다 빠르고 강력해졌습니다. 앞서 본 것처럼 대규모 프런트엔드가 직면한 일부 문제에 대해 많은 고급 기술을 제공합니다.

프런트엔드 아키텍처가 점차 분산됨에 따라 이러한 개념 중 많은 부분이 기본 모범 사례로 차세대 프레임워크 및 도구에 번들로 제공됩니다.

## 참조 및 추가 정보

- [The Third Age of Javascript](https://www.swyx.io/js-third-age/)
- [ES Modules a cartoon deep dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
- [Why Efficient Hydration in JavaScript Frameworks is so Challenging](https://dev.to/this-is-learning/why-efficient-hydration-in-javascript-frameworks-is-so-challenging-1ca3)
- [The performance baseline in 2023](https://infrequently.org/2022/12/performance-baseline-2023/)
- [Why I’m Optimistic About Javascript’s Future](https://leerob.substack.com/p/why-im-optimistic-about-javascripts)
- [Webpack 5 module federation a game changer to Javascript architecture](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669)
- [Everything you need to know about import maps](https://www.honeybadger.io/blog/import-maps/)
- [Enabling modern Javascript on NPM](https://jasonformat.com/enabling-modern-js-on-npm/)
- [Prerender pages in Chrome for instant page navigations](https://developer.chrome.com/blog/prerender-pages/)
- [Don’t fight the browser preload scanner](https://web.dev/preload-scanner/)

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(<https://kofearticle.substack.com/>)을 구독해주세요!
