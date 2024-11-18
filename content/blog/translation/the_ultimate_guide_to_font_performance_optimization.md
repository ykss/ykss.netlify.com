---
title: '(번역) 폰트 성능 최적화를 위한 궁극적인 가이드'
date: 2024-11-19 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [The Ultimate Guide to Font Performance Optimization](https://www.debugbear.com/blog/website-font-performance)

폰트 성능 최적화는 웹사이트의 폰트 로딩 속도를 높이고 더 부드럽게 렌더링 되도록 하는 다양한 웹 개발 기법을 말합니다. 이러한 최적화에는 신중한 폰트 선택, 성능이 우수한 폰트 포맷 사용, 자체 호스팅, 최적화된 `@font-face` 선언, 폰트 디스플레이 전략 등이 포함됩니다.

웹사이트에 표시되는 폰트를 최적화하면 페이지 로딩 속도가 빨라지고 사용자 경험이 향상되며, [코어 웹 바이탈(Core Web Vitals)](https://www.debugbear.com/docs/metrics/core-web-vitals) 같은 성능 지표에서도 긍정적인 결과를 얻을 수 있습니다.

그러나 폰트 성능을 개선하려고 하면 미적인 부분이나 창의성을 희생해야 하는 경우가 많습니다. 이는 고유한 브랜드 정체성을 만들어 내는데 어려움을 줄 수 있기 때문에 커스텀 타이포그래피를 사용할 때는 특히 신중해야 합니다.

## 웹 세이프 폰트와 웹 폰트의 차이점

폰트 성능 최적화의 기술적 세부사항으로 들어가기 전에, 우선 폰트 용어에서 중요한 사항인 웹 세이프 폰트와 웹 폰트의 차이점을 살펴보겠습니다.

이 두 폰트는 모두 디지털 폰트 파일입니다. 하지만...

#### 웹 세이프 폰트는 사용자의 컴퓨터에 설치되어 있습니다

웹 세이프 폰트는 시스템 폰트와 [동의어로 잘못 사용](https://fonts.google.com/knowledge/glossary/system_font_web_safe_font)되기도 하지만, 대부분의 운영 체제에 미리 설치된 폰트를 말합니다. 덕분에 브라우저가 웹에서 폰트 파일이나 관련 CSS를 다운로드할 필요가 없어 페이지 로딩 시간과 LCP, INP 등의 성능 지표가 향상됩니다.

시스템 폰트는 웹 세이프 폰트의 일부로, 운영 체제에서 UI 요소를 표시할 때 사용됩니다. 만약 웹사이트에서 시스템 폰트를 사용한다면(방법은 아래에서 참조) 사용자에게 익숙한 느낌을 제공할 수 있습니다.

웹 세이프 폰트의 가장 큰 단점은 많은 경우 디자인이 [평범해 보이고 지나치게 자주 사용된다는 점](https://practicaltypography.com/system-fonts.html)입니다. 웹사이트에 더 독창적이고 기억에 남는 느낌을 제공하려면 커스텀 웹 폰트를 사용하는 것이 좋습니다.

#### 웹 폰트는 인터넷에서 다운로드되어야 합니다

웹 폰트는 대부분의 사용자의 운영 체제에 기본 설치되어 있지 않은 커스텀 폰트입니다. 브라우저는 폰트 파일과 관련된 CSS 파일을 인터넷에서 다운로드해야 합니다. 이러한 웹 폰트는 Google의 CDN 같은 서드파티 도메인에 호스팅하거나 자체 도메인에 호스팅할 수도 있습니다.

웹 폰트은 인터넷에서 다운로드해야 하므로 웹 세이프 글꼴보다 브라우저에서 로드하는 데 시간이 오래 걸립니다. 하지만 다양한 성능 최적화 기술을 적용해 로딩 시간을 충분히 단축할 수 있습니다. 이에 대한 방법은 아래에서 살펴보겠습니다.

웹 폰트는 웹사이트의 디자인과 분위기를 더욱 향상할 수 있지만, 이를 위해서는 상당한 디자인 감각이 요구됩니다. 그렇지 않다면, 폰트가 올바르게 선정되지 못해 웹 세이프 폰트를 사용했을 때보다 웹사이트의 디자인이 오히려 저하될 수 있습니다.

## 커스텀 타이포그래피가 중요하지 않다면 웹 세이프 폰트를 사용하세요

성능 관점에서 보면 웹 세이프 폰트만 사용하는 것이 최적의 선택입니다. 아래에서는 브라우저가 로컬 폰트를 로드하는 여러 상황과 로컬에서 사용할 수 있는 폰트를 사용하면서 디자인 자유도를 유지하는 방법을 살펴보겠습니다.

#### 폰트 패밀리를 지정하지 않으면 어떻게 될까요?

CSS에서 폰트 패밀리를 지정하지 않으면 브라우저는 사용자의 기본 설정에서 지정한 기본 폰트를 사용합니다. 예를 들어, 구글 크롬에서는 기본 브라우저 폰트(표준 폰트)를 폰트 설정 페이지(`chrome://settings/fonts`)에서 찾을 수 있습니다.

![구글 크롬 사용자 설정의 기본 글꼴](https://www.debugbear.com/assets/images/customize-fonts-google-chrome-2e765ba9d50baacff8f0565148dac07c.png)

#### 일반 폰트(Generic Font) 이름만 사용하면 어떻게 될까요?

CSS Font Module Level 4 웹 표준에 따르면, `font-family` 속성의 값으로 사용할 수 있는 다섯 가지의 일반 폰트 이름이 있으며, 각각의 정확한 정의를 위한 미리 정의된 특성들이 있습니다. 자세한 내용은 ([문서를 참고하세요](https://www.w3.org/TR/css-fonts-4/#generic-font-families)).

- `serif`
- `sans-serif`
- `monospace`
- `cursive`
- `fantasy`

예를 들어, 다음과 같은 CSS 규칙을 사용해 로컬에서 사용할 수 있는 serif 폰트를 로드할 수 있습니다.

```css
body {
  font-family: serif;
}
```

일반 폰트 이름은 브라우저 종류 및 버전, 운영 체제, 로컬에 설치된 폰트, 사용자 기본 설정, 웹사이트에서 사용된 유니코드 범위 등 다양한 요소에 따라 서로 다른 폰트로 매핑됩니다. 예를 들어, Windows 10의 Firefox 브라우저에서는 `sans-serif`와 `fantasy`가 모두 Arial로 매핑될 수 있습니다.

다음은 Windows 10에서 크롬 브라우저가 동일한 텍스트를 5가지 일반 글꼴로 렌더링 하는 방법의 예시입니다. (_사용 중인 플랫폼에서 사용되는 일반 글꼴을 확인하려면 다른 브라우저에서 [데모를 열거나](https://www.annalytic.com/generic-fonts-test/) [소스 코드를 다운로드](https://github.com/azaleamollis/generic-fonts-test/)하세요._)

![5개의 일반 글꼴 이름으로 나란히 렌더링된 텍스트](https://www.debugbear.com/assets/images/generic-font-names-chrome-a34d1c31973736282e6e8448cf31bf32.png)

결국 `font-family` 선언에 일반 폰트 이름만 사용하면, 웹사이트가 다양한 플랫폼에서 비슷하게 보이지만, 모든 사용자에게 동일한 미적 느낌을 제공하지는 않을 것입니다.

#### 웹 세이프 폰트 스택을 추가하는 방법

폰트 스택은 주요 폰트가 사용 불가능할 때를 대비해 한두 개 이상의 대체 폰트를 정의한 목록입니다. 브라우저는 네트워크 또는 사용자의 기기에서 사용 가능한 첫 번째 폰트를 로드합니다. CSS는 `font-family` 속성에 폰트 스택을 할당하여 한 가지 폰트 대신 여러 폰트를 사용할 수 있게 해 줍니다.

```css
div {
  font-family: Arial, Verdana, sans-serif;
}
```

타이포그래피에 대한 더 많은 제어를 원하면서도 커스텀 웹 폰트를 다운로드하고 싶지 않은 경우, 기본 폰트 매핑보다 독창적인 외형을 제공하는 웹 세이프 폰트 스택을 지정할 수 있습니다. 이를 통해 동일한 운영 체제를 사용하는 웹사이트 방문자들에게 동일한 폰트를 표시할 가능성이 높아집니다.

지원하고자 하는 운영 체제에 대한 폰트 가용성을 수동으로 확인하거나, Windows와 Mac 시스템의 웹 세이프 폰트 스택을 제공하는 [CSSFontStack 컬렉션](https://www.cssfontstack.com/)에서 미리 정의된 `font-family` 선언을 사용할 수 있습니다.

웹 세이프 폰트 스택을 생성할 때는 기본적으로 사용하고자 하는 주요 폰트를 지정한 후, 지원하고자 하는 모든 운영 체제를 커버할 수 있도록 유사한 대체 폰트를 추가한 다음, 가장 잘 맞는 일반 폰트 이름으로 선언을 마무리하세요.

예를 들어, CSSFontStack는 [Book Antiqua](https://www.cssfontstack.com/Book-Antiqua) 폰트에 대해 다음과 같은 `font-family` 규칙을 권장합니다(모든 대체 폰트도 웹 세이프 폰트임에 유의하세요).

```css
body {
  font-family: Book Antiqua, Palatino, Palatino Linotype, Palatino LT STD, Georgia,
    serif;
}
```

#### 각 운영 체제의 시스템 폰트 로드 방법

앞서 언급했듯이, 웹사이트에 시스템 폰트를 로드하면 사용자에게 친숙한 느낌을 줄 수 있으며, 이는 웹 애플리케이션의 대시보드와 같은 특정 페이지에서 사용자 경험을 향상시킬 수 있습니다.

다음 `font-family` 규칙은 Mac, Windows, Linux 운영 체제의 시스템 폰트를 포함하며, 이는 깃허브와 같은 인기 웹 애플리케이션에서 사용됩니다.

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
}
```

또한 [system-ui](https://www.w3.org/TR/css-fonts-4/#valdef-font-family-system-ui) 값을 사용할 수도 있습니다. 이를 통해 사용자의 운영 체제에서 시스템 폰트를 로드할 수 있으며, 이는 [모든 최신 브라우저에서 지원](https://caniuse.com/font-family-system-ui)됩니다.

```css
body {
  font-family: system-ui;
}
```

## 웹 폰트를 사용하려면 두 개 이상의 폰트 패밀리를 로드하지 마세요

브랜드 디자인에 커스텀 타이포그래피가 중요하고 웹사이트에 웹 폰트를 사용하기로 결정한 경우, 일반적으로 페이지에 두 개 이상의 웹 폰트 패밀리를 사용하지 않는 것이 좋습니다. 이는 페이지 용량 증가와 느린 페이지 로딩 시간과 같은 성능 저하를 방지하기 위함입니다.

예를 들어, 아래의 페이지([라이브 버전 참조](https://www.annalytic.com/demos/multiple-web-fonts-test/))는 5개의 커스텀 폰트 패밀리를 다운로드합니다. 디버그베어(DebugBear)가 생성한 요청 워터폴을 보면, 페이지 렌더링이 다섯 개의 폰트 파일이 모두 다운로드될 때까지 차단됨을 알 수 있습니다.

![5개의 커스텀 글꼴을 다운로드하는 데모 워터폴 요청하기](https://www.debugbear.com/assets/images/five-web-fonts-waterfall-8041f01a026cd94c9826fa182dba193c.png)

또한, 대체 폰트가 커스텀 폰트로 교체될 때 예상치 못한 레이아웃 변화가 발생할 수 있으며, 이는 [누적 레이아웃 이동(Cumulative Layout Shift)](https://www.debugbear.com/docs/metrics/cumulative-layout-shift) 결과에 영향을 줄 수 있습니다. 아래 데모를 테스트하려면 [무료 웹사이트 속도 테스트](https://www.debugbear.com/test/website-speed) 도구를 열고 `https://www.annalytic.com/demos/multiple-web-fonts-test/` URL을 테스트해 보세요.

![5개의 커스텀 글꼴을 다운로드하는 데모에 대한 CLS 분석](https://www.debugbear.com/assets/images/five-web-fonts-cls-ccd6ad8346d00b33d11254aea5bef870.png)

## 웹 폰트를 자체 호스팅하세요

웹 폰트를 자체 도메인에 호스팅(자체 호스팅)하면 페이지 속도를 높일 수 있습니다.

웹 폰트를 자체 호스팅하려면 다음을 수행해야 합니다.

- 서버에 폰트 파일을 업로드합니다.
- CSS에 관련된 [`@font-face`](https://developer.mozilla.org/ko/docs/Web/CSS/@font-face) 선언을 추가합니다(아래에서 최적화 방법을 설명하겠습니다).

웹 폰트를 자체 호스팅함으로써 얻을 수 있는 성능 향상은 다음과 같은 요인에서 비롯됩니다.

- 외부 서버에 연결할 필요가 없습니다.(예: Google Font를 다운로드하려면 폰트 파일용과 CSS용으로 [두 번의 외부 연결](https://www.debugbear.com/blog/http-server-connections)이 필요) 이는 [Time To First Byte(TTFB)](https://www.debugbear.com/docs/metrics/time-to-first-byte)를 단축시킵니다.
- `@font-face` 선언을 최적화할 수 있습니다(방법은 아래에서 확인할 수 있습니다).
- 폰트는 정적 자산이므로, 이를 글로벌 [콘텐츠 전송 네트워크(CDN)](https://www.debugbear.com/blog/cdn)에서 다운로드하여 대기 시간을 줄일 수 있습니다(오늘날 대부분의 CDN은 자체 도메인을 사용하도록 허용합니다).

자체 호스팅 웹 폰트의 또 다른 장점은 방문자의 IP 주소가 제3자에게 공유되지 않는다는 점에서 개인 정보 보호에 유리하다는 것입니다.

과거에는 자체 호스팅이 빠른 서버나 CDN에 접근할 수 없는 웹사이트에 [권장되지 않았으나](https://web.dev/articles/font-best-practices?hl=ko#using_self-hosted_fonts), 최근에는 HTTP 아카이브의 [Web Almanac 2022](https://almanac.httparchive.org/en/2022/fonts#hosting)에 따르면 *"[캐시 파티셔닝](https://developer.chrome.com/blog/http-cache-partitioning?hl=ko) 도입 이후로 호스팅 서비스 사용이 더 이상 성능 이점을 제공하지 않는다"*고 언급되어, 현재는 웹 폰트의 자체 호스팅이 보편적으로 권장됩니다.

웹 성능상의 이점에도 불구하고, 웹 글꼴을 직접 호스팅하는 것이 항상 가능하지는 않습니다. 이는 라이선스 제한 때문인데, 예를 들어 Adobe Fonts의 경우가 그렇습니다. 물론 비용을 지불할 의사가 있다면 일부 해결 방법이 존재합니다.

#### Adobe Fonts를 자체 호스팅하는 방법

Adobe Fonts는 다운로드 및 자체 호스팅이 공식적으로 불가능하지만, ['Font licensing' 페이지](https://helpx.adobe.com/fonts/using/font-licensing.html#web-host)에서는 "자체 호스팅보다 CDN이 훨씬 성능이 우수하고 확장 가능하다"고 주장하고 있습니다.

하지만, Adobe Originals 프로그램(Type Network와 같은 [리셀러](https://www.adobe.com/products/type/fonts-by-adobe.html)가 판매)을 통해 라이선스를 구입하면 일부 Adobe Fonts를 자체 호스팅 할 수 있습니다. Adobe Fonts에는 [깃허브에서 다운로드할 수 있는 오픈 소스 폰트](https://github.com/adobe-fonts)도 포함되어 있으며, 이를 다운로드한 후 `@font-face` 규칙을 CSS에 추가하면 자체 호스팅이 가능합니다.

Adobe Fonts는 서드파티 제공업체의 폰트([타입 파운드리(Type Foundry)](https://fonts.adobe.com/foundries)라고 함)도 포함하고 있습니다. 서드파티 공급업체의 라이선스에서 허용하는 경우 일부 폰트를 자체 호스팅 할 수 있습니다.

예를 들어, Google Fonts는 Adobe 사용자가 사용할 수 있는 408개의 글꼴 패밀리를 [Adobe 글꼴에서 파운드리로 관리](https://fonts.adobe.com/foundries/google)하고 있으며, 모두 오픈 소스 라이선스를 사용하여 구글 네트워크에서 다운로드할 경우 자체 호스팅이 가능합니다. 예를 들어, Baloo Bhaina 2 폰트는 [Adobe Fonts](https://fonts.adobe.com/fonts/baloo-bhaina-2)와 [Google Fonts](https://fonts.google.com/specimen/Baloo+Bhaina+2) 모두에서 제공되며, [SIL 오픈 폰트 라이선스](https://opensource.org/license/ofl-1-1)로 출시되어 [npm 패키지](https://www.npmjs.com/package/@fontsource/baloo-bhaina-2) 등 다른 소스에서도 다운로드할 수 있습니다.

#### Google Fonts를 자체 호스팅하는 방법

[Mario Ranftl](https://mranftl.com/)이 만든 [Google Web Fonts Helper](https://gwfh.mranftl.com/fonts) 도구를 사용하면 자체 호스팅된 Google Fonts를 웹사이트에 쉽게 추가할 수 있습니다. 이 도구는 필요한 모든 `@font-face` 규칙을 생성하며, 폰트 파일을 WOFF2 형식으로 변환해 줍니다(아래에서 WOFF2에 대해 자세히 살펴보겠습니다).

Google Web Fonts Helper는 웹사이트에서 사용하고자 하는 스타일과 문자 세트를 선택하여 다운로드할 수 있습니다.

![Google Web Fonts Helper, Roboto, 글꼴 스타일 및 문자 세트 포함](https://www.debugbear.com/assets/images/google-web-fonts-helper-roboto-d26c9c9eb7440409d60ce12bdd575da9.png)

CSS에 추가해야 하는 `@font-face` 규칙을 복사할 수도 있습니다.

페이지 하단에서 ZIP 파일로 폰트 파일을 다운로드할 수 있으며, 다운로드가 완료되면 압축을 풀고 서버에 업로드하세요.

![Google Web Fonts Helper, ZIP 다운로드](https://www.debugbear.com/assets/images/google-web-fonts-helper-css-download-9a5df0f9b3e01040e0a696cdddd8e5a1.png)

## 자체 호스팅 웹 폰트를 WOFF2 포맷으로 변환하기

현재 [WOFF2(Web Open Font Format, 버전 2)](https://www.w3.org/TR/WOFF2/)는 가장 성능이 우수한 폰트 압축 형식입니다. [WOFF1보다 평균 압축률이 26.61% 높으며](https://www.w3.org/TR/WOFF20ER/#appendixA), 덜 효율적인 GZIP 대신 브로틀리(Brotli) 압축을 사용하기 때문입니다([GZIP과 브로틀리의 차이점을 참고하세요](https://www.debugbear.com/blog/http-compression-gzip-brotli)).

WOFF2 포맷이 널리 사용되고 있지만, 여전히 TTF, EOT, OTF 또는 WOFF1과 같은 덜 효율적인 형식으로만 폰트를 다운로드할 수 있는 경우가 많습니다. 예를 들어 공식 `fonts.google.com`에서 폰트를 다운로드할 경우 여전히 TTF(트루타입 폰트) 형식으로 제공됩니다.

WOFF2는 [모든 최신 브라우저에서 지원](https://caniuse.com/woff2)되므로 WOFF2 형식의 폰트 파일만 호스팅하면 됩니다. [Web Almanac 2022](https://almanac.httparchive.org/en/2022/fonts#performance)는 이를 *"다른 모든 것은 잊어버리세요"*라고 표현했는데, 이는 과거에는 다른 브라우저를 위해 여러 포맷으로 폰트를 제공해야 했던 때를 의미합니다.

폰트를 `.woff2` 형식으로 변환하려면 [CloudConvert의 WOFF2 변환기](https://cloudconvert.com/woff2-converter)와 같은 변환 도구를 사용할 수 있습니다. 또는 앞서 설명한 Google Web Fonts Helper를 사용하면 기본적으로 WOFF2 파일을 다운로드할 수 있습니다.

## 코어 웹 바이탈을 위한 `@font-face` 선언 최적화

사이트에서 웹 폰트를 자체 호스팅할 때, CSS에 각 폰트 파일에 대한 `@font-face` 선언을 추가해야 하며, 이를 통해 폰트 이름, 위치 및 기타 특성을 정의합니다.

`@font-face` at-rule에는 필수 및 선택 디스크립터가 있습니다. 필수 디스크립터로는 폰트 이름과 URL을 정의하며, 선택 디스크립터로는 문자 세트, 로딩 방식, 크기 등의 속성을 지정할 수 있습니다.

#### `@font-face` 선언의 필수 디스크립터

커스텀 폰트를 정의하려면 `font-family`와 `src` 디스크립터를 다음과 같이 `@font-face` 선언에 추가해야 합니다.

```css
@font-face {
  font-family: 'Anonymous Pro';
  src: url('fonts/anonymous-pro-v21-latin-regular.woff2') format('woff2');
}
```

여러 폰트 스타일을 사용하는 경우 각 파일에 대해 `@font-face` 선언을 각각 추가해야 합니다.

[Anonymous Pro](https://gwfh.mranftl.com/fonts/anonymous-pro?subsets=latin) 패밀리 예시입니다. 정규 스타일과 이탤릭 스타일을 모두 다운로드하려면 다음과 같이 [`font-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-style)과 [`font-weight`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight) 디스크립터도 추가해 지원되는 굵기와 스타일 값을 지정합니다.

```css
@font-face {
  font-family: 'Anonymous Pro';
  font-style: normal;
  font-weight: 400;
  src: url('/fonts/anonymous-pro-v21-latin-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Anonymous Pro';
  font-style: italic;
  font-weight: 400;
  src: url('../fonts/anonymous-pro-v21-latin-italic.woff2') format('woff2');
}
```

#### 웹 폰트는 언제 다운로드될까요?

`@font-face` 선언의 성능 영향 중 중요한 점은 서버에 다운로드 요청을 보내지 **않는다**는 것입니다.

웹 폰트는 페이지에서 사용될 때에만 다운로드됩니다.

예를 들어 Anonymous Pro 폰트를 `font-family` 속성을 사용해 `<body>` 태그에 할당하면 브라우저는 `<body>` 요소를 렌더링하기 전에 해당 HTTP 요청만 서버로 전송합니다(파싱 단계에서는 `@font-face` 선언이 적용되지 않음).

```css
body {
  font-family: 'Anonymous Pro', monospace;
}
```

위의 `font-family` 규칙은 일반 폰트 파일(`anonymous-pro-v21-latin-regular.woff2`)만 다운로드하며 이탤릭체 폰트는 다운로드하지 않습니다.

반면, 다음 코드는 이탤릭체 폰트 파일(`anonymous-pro-v21-latin-italic.woff2`)만 다운로드하고 일반 폰트는 다운로드하지 않습니다.

```css
body {
  font-family: 'Anonymous Pro', monospace;
  font-style: italic;
}
```

아래 크롬 개발자 도구의 **네트워크** 탭에서 확인할 수 있는 증거입니다(후자의 예시에서 볼 수 있듯이 일반 글꼴 파일은 다운로드되지 않았습니다).

![Anonymous Pro 이탤릭체 다운로드](https://www.debugbear.com/assets/images/anonymous-pro-italic-download-19247c454e5c9a18245b7d94aee91432.png)

두 폰트 파일 모두를 다운로드하려면, 아래와 같이 CSS에서 각각 참조해야 합니다.

```css
body {
  font-family: 'Anonymous Pro', monospace;
}
h1 {
  font-style: italic;
}
```

#### 폰트 성능을 향상시키는 선택적 디스크립터

`@font-face` 선언의 다음 선택 디스크립터들은 폰트 성능을 향상시키는 데 도움이 됩니다. 아래에서 각 디스크립터에 대해 자세히 설명하겠습니다.

| 디스크립터      | 웹 성능 이점                                                 | 향상되는 성능 지표 |
| --------------- | ------------------------------------------------------------ | ------------------ |
| `unicode-range` | 지정된 문자가 페이지에 사용될 때만 폰트 파일 다운로드        | FCP, LCP           |
| `local()`       | 사용자가 폰트를 로컬에 설치했는지 확인 후 설치된 폰트를 사용 | TTFB, FCP, LCP     |
| `font-display`  | 브라우저가 사용할 대체(fallback) 전략 정의                   | CLS                |
| `size-adjust`   | 주요 폰트와 대체 폰트의 크기 조정                            | CLS                |

#### 1. `unicode-range` 디스크립터

[`unicode-range`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range) 디스크립터는 특정 폰트 파일에서 사용하고자 하는 문자를 지정할 수 있습니다. HTML에 `unicode-range`로 정의된 문자가 포함되지 않은 경우 폰트 파일은 다운로드되지 않습니다.

아래의 CSS 코드로 이 동작을 테스트할 수 있습니다. 아래 `unicode-range` 설명자는 단일 유니코드 문자(스마일 이모지)를 정의했습니다. `<body>` 태그 내에 스마일 이모지가 없으면 커스텀 폰트는 다운로드되지 않고, 일반 `monospace`가 대체 폰트로 사용됩니다.

```css
@font-face {
  font-family: 'Anonymous Pro';
  font-style: italic;
  font-weight: 400;
  unicode-range: U+1F642; /* 스마일 이모지 */
  src: url('/fonts/anonymous-pro-v21-latin-italic.woff2') format('woff2');
}
body {
  font-family: 'Anonymous Pro', monospace;
  font-style: italic;
}
```

`unicode-range` 디스크립터는 여러 유니코드 값, 와일드카드 범위 등으로 정의할 수 있습니다([문서에서 문법 참조](https://www.w3.org/TR/css-fonts-4/#descdef-font-face-unicode-range)).

##### 폰트 서브세팅의 두 가지 방향

위의 코드 예제에서 보여준 `unicode-range` 디스크립터를 사용하는 방식이 하나의 서브세팅 방법입니다. 즉, WOFF2 폰트 파일을 생성해 서버에 업로드한 후 브라우저는 페이지에서 지정된 유니코드 문자가 사용되는 경우에만 해당 파일을 다운로드합니다.

또한 폰트 파일 자체를 서브세팅할 수도 있습니다. 예를 들어, Google Web Fonts Helper에서 특정 문자 세트를 선택하면 선택한 문자 세트만 포함된 서브세팅된 폰트 파일이 생성됩니다.

예를 들어, [Anonymous Pro 폰트의 그리스 문자와 라틴 문자 세트](https://gwfh.mranftl.com/fonts/anonymous-pro?subsets=greek,latin)를 선택하면, `anonymous-pro-v21-greek_latin-regular.woff2` 파일이 다운로드되며 그리스 및 기본 라틴 문자만 포함하고, 키릴 및 확장 라틴 문자는 포함되지 않습니다.

![Anonymous Pro 그리스 문자와 라틴 문자 세트](https://www.debugbear.com/assets/images/anonymous-pro-latin-greek-7ae2d6600e707367524d810ea57a475b.png)

웹사이트에서 사용하는 문자만 포함된 서브세팅 폰트 파일을 생성하면 성능을 더욱 개선할 수 있습니다(예: 로고에만 사용하는 디스플레이 글꼴에 좋은 솔루션이 될 수 있습니다). 이를 위해 [Peter Müller](https://mntr.dk/)가 만든 [subfont](https://github.com/Munter/subfont)와 같은 도구를 사용할 수 있습니다.

일부 폰트 라이선스는 서브세팅을 허용하지 않을 수 있지만, 대부분의 Google Fonts가 사용하는 SIL 오픈 폰트 라이선스는 이를 지원합니다. [Jeff Frankl](https://frankl.org/)가 제작한 [subsetting.xyz](https://subsetting.xyz/) 사이트에서 다른 폰트 라이선스 정보를 확인할 수 있습니다.

#### 2. `local()` 함수

`local()` 함수는 `@font-face` 선언의 필수 [`src`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src) 디스크립터의 선택적 값으로, 사용자의 기기에 폰트가 설치되어 있는지 확인해 웹 대신 로컬 폰트 파일을 사용할 수 있습니다.

`src` 디스크립터는 여러 값을 가질 수 있으므로 `local()`과 `url()` 함수를 조합하여 사용할 수 있습니다.

```css
@font-face {
  font-family: 'Anonymous Pro';
  font-style: normal;
  font-weight: 400;
  src: local('Anonymous Pro Regular'),
    /* Full name */ local('AnonymousPro-Regular'), /* PostScript name */
      url('/fonts/anonymous-pro-v21-latin-regular.woff2') format('woff2');
}
```

`local()` 선언은 반드시 `url()` 함수 전에 와야 합니다. 브라우저가 로컬 파일을 찾으면 온라인 파일에 대한 [HTTP 요청](https://www.debugbear.com/blog/http-server-connections)을 보내지 않기 때문입니다. 폰트 파일의 전체 이름과 [PostScript](https://en.wikipedia.org/wiki/PostScript) 이름을 모두 추가하는 것이 권장됩니다(PostScript는 Adobe 프로그램에서 사용하는 페이지 설명 언어로 사용자의 기기에 폰트를 설치할 수 있습니다).

폰트의 로컬 이름을 알 수 없는 경우, [Viktor Nübel](https://viktornuebel.com/)이 제작한 [FontDrop! 앱](https://fontdrop.info/)과 같은 폰트 뷰어 도구를 사용해 네이밍 테이블에서 `fullName`과 `postScriptName` 값을 확인할 수 있습니다.

![fullName과 postScriptName](https://www.debugbear.com/assets/images/fullname-postscriptname-c9236439db30e1a7f3fe89c0206bcb49.png)

#### 3. `font-display` 디스크립터

[`font-display`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) 디스크립터는 브라우저가 웹 폰트를 다운로드할 때까지 사용자가 보게 될 텍스트 스타일을 결정하는 네 가지 기본 폰트 표시 전략을 중 하나를 선택할 수 있도록 합니다.

안타깝게도, 현재 존재하는 폰트 표시 전략 중 어느 것도 완벽한 전략은 없어서 어느 정도는 성능이나 미적 감각(또는 둘 다)을 희생해야 합니다.

웹 폰트를 사용할 때 기본적으로 다음 세 가지 표시 문제 중 하나를 선택해야 합니다.

- **FOIT(Flash Of Invisible Text)** – 웹 폰트가 다운로드될 때까지 텍스트가 보이지 않게 처리됩니다.
- **FOUT(Flash Of Unstyled Text)** – 웹 폰트가 다운로드될 때까지 대체 폰트로 텍스트가 표시됩니다.
- **웹 글꼴이 표시되지 않습니다.** - 웹 폰트가 제 때 도착하지 않으면, 브라우저는 대체 폰트를 영구적으로 표시합니다(이 전략을 사용할 때 브라우저는 사용자의 네트워크 연결에서 다운로드 시간을 미리 계산하므로 웹 폰트를 요청하지 않는 경우가 종종 발생합니다).

FOIT와 FOUT는 모두 예상치 못한 레이아웃 이동을 초래할 수 있으며, 이를 방지하려면 웹 폰트와 대체 폰트의 크기를 일치시키는 것이 중요합니다(나중에 방법을 살펴보겠습니다).

font-display 디스크립터는 다음과 같은 값을 가질 수 있으며, 각 값은 고유한 폰트 표시 전략을 나타냅니다(각 전략에는 **블록 기간(block period)**과 **교체 기간(swap period)**이 있으며, 블록 기간에는 폰트 렌더링이 중단되고, 교체 기간에는 대체 폰트가 웹 폰트로 전환됩니다).

- **`block`**:

  - **블록 기간**: 짧음(_브라우저 공급업체는 [CSS 폰트 모듈 표준](https://www.w3.org/TR/css-fonts-4/#font-display-desc)에 따라 3초를 권장합니다_)
  - **교체 기간**: 무한
  - **장점**: 커스텀 폰트를 사용할 수 있습니다(3초는 상당히 긴 블록 기간이므로 사용자가 대체 폰트를 볼 가능성이 적습니다).
  - **단점**: FOIT 및 예상치 못한 레이아웃 이동이 발생할 수 있습니다(대체 글꼴은 보이지 않는 텍스트의 크기를 계산하는 데 사용됩니다).
  - **권장 대상**: 맞춤형 타이포그래피가 중요한 경우, 또는 로고용 표시 폰트와 같이 짧은 텍스트 문자열이나 페이지 하단의 텍스트 블록에 적합합니다.

- **`swap`**:

  - **블록 기간**: 매우 짧음(_100ms 이하 권장_)
  - **교체 기간**: 무한
  - **장점**: 텍스트가 대체 폰트로 조기에 렌더링되며 이후에 커스텀 폰트로 전환됩니다.
  - **단점**: FOUT 및 예상치 못한 레이아웃 이동이 발생할 수 있습니다.
  - **권장 대상**: 커스텀 타이포그래피가 중요하고 긴 텍스트 블록에 적합합니다.

- **`optional`**:

  - **블록 기간**: 매우 짧음(_100ms 이하 권장_)
  - **교체 기간**: 0
  - **장점**: 텍스트가 웹 폰트 또는 대체 폰트로 조기에 렌더링되며, FOUT나 FOIT 현상이 없고 예상치 못한 레이아웃 이동이 발생하지 않습니다.
  - **단점**: 100ms 내에 웹 폰트가 도착하지 않으면 커스텀 폰트가 표시되지 않습니다.
  - **권장 대상**: 긴 텍스트 블록(예: `<body>` 텍스트)에서 성능이 우선이고 커스텀 타이포그래피가 중요하지 않은 경우 권장됩니다.

- **`fallback`**:

  - **블록 기간**: 매우 짧음(_100ms 이하 권장_)
  - **교체 기간**: 짧음(3초 권장)
  - **장점**: 커스텀 폰트가 3초 안에 도착(선택 사항에서 제공하는 100ms와 달리)할 가능성이 높아 표시될 확률이 높습니다.
  - **단점**: FOUT 및 예상치 못한 레이아웃 이동이 발생할 수 있습니다(하지만 swap 전략보다는 가능성이 적습니다).
  - **권장 대상**: 긴 텍스트 블록(예: `<body>` 텍스트)에서 커스텀 타이포그래피가 중요할 때 성능과 미감을 조화시킬 수 있습니다.

- **`auto`**:

  - **블록 기간**: 해당 없음
  - **교체 기간**: 해당 없음
  - **장점**: 해당 없음
  - **단점**: 해당 없음
  - **권장 대상**: 기본값으로, 브라우저의 내장된 표시 전략을 사용합니다(보통 블록 전략과 동일합니다).

[좋은 CLS(누적 레이아웃 이동) 결과](https://www.debugbear.com/docs/metrics/cumulative-layout-shift)를 얻으려면, 긴 텍스트 블록에는 `optional`이나 `fallback` 전략을 사용하세요.

```css
@font-face {
  font-display: optional;
  font-family: 'Anonymous Pro';
  font-style: normal;
  font-weight: 400;
  src: local('Anonymous Pro Regular'), local('AnonymousPro-Regular'),
    url('/fonts/anonymous-pro-v21-latin-regular.woff2') format('woff2');
}
```

다양한 폰트 표시 전략의 작동 방식에 대해 자세히 알아보려면, [웹 폰트로 인한 레이아웃 이동을 해결하는 방법](https://www.debugbear.com/blog/web-font-layout-shift)에 대한 글을 참고하세요.

#### 4. `size-adjust` 디스크립터

[`size-adjust`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust) 디스크립터는 `@font-face` 선언에 새로 추가된 항목이며, 최신 버전의 모든 [브라우저에서 이미 지원](https://caniuse.com/mdn-css_at-rules_font-face_size-adjust)됩니다. 이 디스크립터를 사용하면 웹 폰트와 대체 폰트의 크기를 맞춰 교체 기간 동안 발생할 수 있는 레이아웃 이동을 방지할 수 있습니다.

크기 조정은 중요합니다. 서로 다른 font face의 [글리프(glyph)](https://developer.mozilla.org/en-US/docs/Glossary/Glyph)는 종종 약간 다른 너비와 높이를 가지므로, 큰 텍스트 블록은 화면에서 차지하는 영역이 달라져 폰트가 전환될 때 예상치 못한 레이아웃 이동을 초래할 수 있습니다.

`size-adjust` 디스크립터는 글리프의 윤곽을 늘리거나 줄이는 배율을 퍼센트 값으로 지정합니다. 웹 폰트와 대체 폰트의 정확한 크기를 비교하여 배율을 수동으로 계산하거나, [Brian Louis Ramirez](https://screenspan.net/)의 [Fallback Font Generator](https://screenspan.net/fallback)와 같은 도구를 통해 계산할 수 있습니다.

아래는 Anonymous Pro 웹 폰트와 Courier New 대체 폰트의 크기를 조정하는 방법을 보여줍니다.

먼저 `size-adjust`를 100%(기본값)로 설정하고 두 폰트가 동일한 공간을 차지하는지 확인합니다(텍스트 블록 주위의 사각형을 비교해야 하며, 이는 예상치 못한 레이아웃 이동을 방지하기 위해 조정되어야 합니다).

![Fallback Font Generator UI](https://www.debugbear.com/assets/images/fallback-font-adjust-size-100-90ea6e2e4e77b3a9a744d57d9fee422f.png)

위에서 볼 수 있듯이 커스텀 폰트(녹색)가 대체 폰트(노란색)보다 약간 작으므로 `size-adjust` 값을 증가시켜 두 사각형이 동일한 공간을 차지하도록 설정했습니다.

113%에서 크기가 일치했습니다(`size-adjust` 값을 짧고 긴 텍스트 문자열 모두로 테스트하는 것이 좋습니다).

![Fallback Font Generator로 폰트 사이즈 조정](https://www.debugbear.com/assets/images/fallback-font-adjust-size-adjusted-f0965098d8e0d328780cfb98f8730ff6.png)

`size-adjust` 디스크립터가 포함된 `@font-face` 선언은 다음과 같습니다(`<body>` 태그에서는 `size-adjust`가 제대로 작동하도록 대체 폰트의 순서를 지정해야 합니다).

```css
@font-face {
  font-display: fallback;
  font-family: 'Anonymous Pro';
  font-style: normal;
  font-weight: 400;
  size-adjust: 113%;
  src: local('Anonymous Pro Regular'), local('AnonymousPro-Regular'),
    url('/fonts/anonymous-pro-v21-latin-regular.woff2') format('woff2');
}

body {
  font-family: 'Anonymous Pro', 'Courier New', monospace;
}
```

`@font-face` 선언에는 웹 폰트와 대체 폰트의 크기를 더욱 세밀하게 조정할 수 있는 세 가지 선택적 디스크립터도 있습니다.

이러한 디스크립터 없이도 CLS(누적 레이아웃 이동)를 위해 웹 폰트를 최적화할 수 있지만, 더 매끄러운 전환 구간을 제공하고 싶다면 이를 사용하는 것도 고려할 수 있습니다(이 디스크립터는 앞서 언급한 대체 폰트 생성기 도구에서도 제공되지만, 사파리 브라우저에서는 아직 지원되지 않음을 유의해야 합니다).

- [`ascent-override`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override) – 글리프의 베이스라인 위의 높이를 증가 또는 감소시킬 백분율 값을 지정합니다.
- [`descent-override`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/descent-override) – 글리프의 베이스라인 아래 높이를 증가 또는 감소시킬 백분율 값을 지정합니다.
- [`line-gap-override`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/line-gap-override) – 줄 간격을 증가 또는 감소시킬 백분율 값을 지정합니다.

## `@font-face` 규칙을 페이지 `<head>` 섹션에 인라인하세요

폰트를 가능한 빨리 다운로드하려면 HTML 페이지의 `<head>` 섹션에 `@font-face` 규칙을 [중요한 CSS](https://unused-css.com/blog/improving-perceived-speed-with-critical-css/)의 일부로 인라인하세요.

중요한 두 가지 사항은 아래와 같습니다.

1. 페이지에 여러 `@font-face` 선언이 있는 경우, 가장 중요한 폰트부터 시작해 요청 우선순위를 높이세요(예: `<body>` 태그에 사용된 커스텀 폰트).
2. 앞서 언급했듯이 `@font-face` 선언은 서버에 요청을 보내지 않습니다. 다운로드 프로세스를 시작하려면 페이지에 `font-family` 규칙을 정의해 참조해야 합니다.

아래는 인라인된 최소화된 `@font-face` 선언의 코드 예입니다. `<body>` 태그에 폰트 패밀리 규칙이 추가되어 HTTP 요청이 시작됩니다(코드는 [Minifier.org](https://minifier.org/)에서 최소화되었습니다).

```html
<style>
  @font-face {
    font-display: optional;
    font-family: 'Anonymous Pro';
    font-style: normal;
    font-weight: 400;
    size-adjust: 113%;
    src: local('Anonymous Pro Regular'), local('AnonymousPro-Regular'),
      url(/fonts/anonymous-pro-v21-latin-regular.woff2) format('woff2');
  }
  body {
    font-family: 'Anonymous Pro', 'Courier New', monospace;
  }
</style>
```

## 자체 호스팅이 어려울 때 웹 폰트 다운로드 최적화하기

커스텀 폰트를 제공하는 가장 좋은 방법은 자체 호스팅이지만, 일부 상황에서는 자체 호스팅이 어려울 수 있습니다.

여기서는 구글이나 Adobe의 CDN에서 웹 폰트를 다운로드할 경우 웹 성능을 개선하는 방법을 설명합니다.

#### 자체 호스팅이 어려운 경우 Google Fonts를 최적화하는 방법

구글은 자체 호스팅이 아닌 CDN을 통해 웹 폰트를 다운로드할 경우 성능 및 코어 웹 바이탈을 최적화할 수 있는 여러 옵션을 제공합니다.

살펴보기 전에 기본 설정을 살펴보겠습니다.

#### 구글의 CDN에서 웹 폰트를 다운로드할 때 일어나는 일

아래 코드는 Anonymous Pro 폰트의 일반 및 이탤릭 스타일을 구글의 CDN에서 다운로드하려면 Google Fonts에서 제공하는 기본 코드입니다(HTML 페이지의 `<head>` 섹션에 추가해야 합니다).

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital@0;1&display=swap"
  rel="stylesheet"
/>
```

위 코드는 두 개의 WOFF2 파일(일반 및 이탤릭 스타일)과 Anonymous Pro 폰트가 지원하는 네 가지 문자 세트(키릴, 그리스, 라틴 확장, 라틴) 각각에 대한 CSS 파일(`@font-face` 규칙 여덟 개)을 다운로드합니다. _굵은 글씨체와 굵은 이탤릭 스타일도 다운로드하려면 CSS에 총 16개의 `@font-face` 규칙이 추가됩니다._

![개발자 도구를 통해 살펴본 CDN을 통해 로드한 Anonymous Pro 폰트](https://www.debugbear.com/assets/images/anonymous-pro-from-cdn-in-chrome-d2da317078627f0c089e9b3cfcb6688c.png)

특히 라틴 문자 집합만 사용하려는 경우 코드의 양이 과도하게 많습니다.

#### 웹 폰트 다운로드를 최적화하는 방법

현재 불필요한 문자 세트의 `@font-face` 규칙을 제거할 방법은 없지만(_이때 *`text`* URL 매개변수를 사용하면 가능합니다_), "최상의" 해결책은 필요한 스타일만 요청하는 것입니다(_예: 굵은 이탤릭체가 필요 없으면 URL에서 이를 제외하세요_).

구글의 CDN에서 다운로드한 WOFF2 폰트 파일은 `unicode-range` [디스크립터를 지원하는 최신 브라우저](https://caniuse.com/font-unicode-range)에서 자동으로 최적화됩니다. 이 브라우저는 페이지에서 필요한 문자 세트를 감지해 해당 부분만 요청합니다(예: 그리스어 또는 키릴 문자 세트가 페이지에 없으면 WOFF2 파일에서 해당 글리프는 제외됩니다). 과거에는 [`subset` 매개변수를 사용해 이를 처리](https://developers.google.com/fonts/docs/getting_started?hl=ko#specifying_script_subsets)했으나, 이제는 구형 브라우저 지원이 아닌 경우 필요하지 않습니다.

최신 브라우저에서는 `subset`이 무시되므로, 현재 웹 성능을 개선하기 위해 두 가지 선택적 URL 매개변수만 사용할 수 있습니다:

- `display` – 이는 `@font-face` 선언의 `font-display` 디스크립터와 동일합니다. 기본값은 `display=swap`이지만, `display=fallback`이나 `display=optional`로 변경해 누적 레이아웃 이동 결과를 개선할 수 있습니다.
- `text` – 지정된 텍스트에 사용된 문자만 포함하도록 폰트를 세분화합니다(예: `text=YourBrand`).

예를 들어, 아래의 `<link>` 요소는 `fallback` 표시 전략을 사용하며 "YourBrand" 텍스트에 포함된 문자만 다운로드합니다.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital@0;1&text=YourBrand&display=fallback"
  rel="stylesheet"
/>
```

다음은 서브셋된 WOFF2 파일의 모습입니다(앞서 언급한 FontDrop! 앱에서 가져왔습니다.) 보시다시피, 요청한 글리프만 포함되어 있습니다(대문자와 소문자도 구분합니다).

![text URL 매개변수를 사용하여 서브셋된 Anonymous Pro 폰트](https://www.debugbear.com/assets/images/anonymous-pro-text-fontdrop-96c8946fb27a04c1649b5b01cafe81a4.png)

흥미롭게도 `text` 매개변수를 사용하면 다운로드한 CSS 파일에는 요청된 글리프에 속하는 문자 집합(일반 및 이탤릭 스타일) 두 가지 `@font-face` 선언만 포함됩니다.

![서브셋된 폰트 파일의 font-face 선언](https://www.debugbear.com/assets/images/anonymous-pro-text-devtools-ae417d5a4e145a41bed5f06298918d6a.png)

이제 구글 API가 불필요한 `@font-face` 선언을 방지하기 위해 모든 라틴 문자를 `text` 매개변수에 할당하는 것이 좋을지 궁금할 수 있습니다.

기술적으로 가능하지만, 이 경우 CSS 파일에는 `@font-face` 선언이 두 개만 포함됩니다.

URL 매개변수는 알파벳과 숫자만 허용하므로 따옴표나 느낌표와 같은 특수 문자는 추가할 수 없습니다(추가하면 브라우저에서 무시됩니다). 따라서 이런 문자가 페이지에 있는 경우(가능성이 높습니다), 브라우저는 대체 폰트로 해당 문자를 로드합니다. 결과적으로 텍스트 블록이 '약간' 이상해 보이며 브라우저는 웹 폰트와 대체 폰트 모두를 로드하게 됩니다.

따라서 전반적으로 권장하지 않습니다(성능 향상 효과도 크지 않을 것입니다). 그래도 이 작업을 수행하려는 경우 사용해야 하는 코드는 다음과 같습니다.

```html
<link
  href="https://fonts.googleapis.com/css2?family=Anonymous+Pro:ital@0;1&text=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&display=fallback"
  rel="stylesheet"
/>
```

#### 사전 연결(Preconnect) 링크로 폰트 렌더링 속도 높이기

구글의 CDN에서 Google Fonts를 다운로드할 때 추가해야 할 두 가지 `<link>` 요소는 CSS 파일용 `fonts.googleapis.com` 및 WOFF2 파일용 `fonts.gstatic.com`에 대한 사전 연결(preconnect) 링크입니다.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

사전 연결(preconnect)은 페이지 렌더링 과정에서 외부 도메인과의 HTTP 연결을 미리 설정해 필요할 때 즉시 사용할 수 있도록 하는 [리소스 힌트](https://www.debugbear.com/blog/resource-hints-rel-preload-prefetch-preconnect)입니다. 구글의 CDN에 미리 연결하면 폰트 로딩 속도를 높일 수 있습니다.

두 번째 `<link>` 태그에는 [CORS 연결](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)을 통해 폰트 파일을 요청할 수 있도록 [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) 속성도 포함됩니다.

#### Google Fonts를 미리 로드하는 것이 좋을까요?

폰트 렌더링 속도를 더 높이기 위해 서버와의 사전 연결 후 가장 중요한 폰트 파일을 미리 로드하는 것도 고려할 수 있습니다. Preload는 리소스 파일을 사전에 다운로드할 수 있게 하는 리소스 힌트입니다.

웹 폰트를 미리 로드하는 것은 약간 논란의 여지가 있는데, 일부 개발자는 페이지에서 10개의 폰트 파일을 미리 로드하기도 하기 때문입니다. 구글의 web.dev 문서에서도 [너무 많은 웹 폰트를 미리 로드하는 것을 권장하지 않습니다.](https://web.dev/articles/font-best-practices?hl=ko#be_cautious_when_using_preload_to_load_fonts) 이는 _“다른 리소스를 로드하는 데 사용할 브라우저 리소스를 차지하기 때문”입니다._

하지만 페이지에서 가장 많이 사용하는 폰트 파일 한두 개를 미리 로드하는 것은 페이지 로드 시간을 단축하는 데 도움이 됩니다.

예를 들어, `<body>` 텍스트와 제목에 사용하는 폰트 파일을 미리 로드하는 것이 좋습니다. 아래의 코드 스니펫은 Anonymous Pro 폰트의 일반 및 굵은 스타일을 미리 로드합니다(`<head>` 섹션의 preconnect 힌트 아래에 추가하세요).

```html
<!-- Anonymous Pro Regular -->
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/anonymouspro/v21/rP2Bp2a15UIB7Un-bOeISG3pHls29Q.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Anonymous Pro Bold -->
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/anonymouspro/v21/rP2cp2a15UIB7Un-bOeISG3pFuAT4C7c7Q.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

WOFF2 파일의 URL을 가져오려면, 개발자 도구의 **네트워크** 탭을 열고 사이트를 로드한 후 목록에서 폰트를 찾아 **헤더** 탭에서 URL을 복사합니다.

![크롬 개발자도구의 네트워크 탭에서의 WOFF2 파일 URL](https://www.debugbear.com/assets/images/anonymous-pro-font-file-urls-644f43e965625aac8ae34aca6c286a1c.png)

#### 자체 호스팅이 어려울 때 Adobe Fonts를 최적화하는 방법

웹사이트에 Adobe Fonts를 추가하려면 Adobe Fonts 웹사이트에서 [웹 프로젝트를 생성](https://helpx.adobe.com/fonts/using/add-fonts-website.html#Createawebproject)해야 합니다.

다음은 Adobe 웹 프로젝트에서 핵심 웹 바이탈 및 기타 성능 지표를 위해 Adobe 폰트를 최적화하는 데 사용할 수 있는 Adobe의 가이드입니다.

- [폰트 표시 전략 사용자 지정](https://helpx.adobe.com/fonts/using/font-display-settings.html)
- [필요한 문자 세트를 선택](https://helpx.adobe.com/fonts/using/language-support-subsetting.html)한 후 [동적 서브세팅 사용](https://helpx.adobe.com/fonts/using/dynamic-subsetting.html)

또한 다음과 같은 방법으로 Adobe 서버에 미리 연결하는 것도 좋습니다.

```html
<link rel="preconnect" href="https://use.typekit.net" crossorigin />
<link rel="preconnect" href="https://p.typekit.net" crossorigin />
```

Adobe Fonts가 하나의 서버에서만 다운로드되면(레거시 서비스의 하위 도메인은 `use.typekit.net`, 새 웹 폰트 서비스의 하위 도메인은 `p.typekit.net`), 해당 preconnect 힌트만 추가하세요(브라우저 개발자 도구 또는 DebugBear 앱에서 확인 가능합니다).

Google Fonts와 마찬가지로 폰트 서버에 미리 연결한 후 가장 중요한 폰트 파일을 미리 로드하는 것이 좋습니다(앞서 언급한 코드 스니펫을 사용할 수 있으며 URL만 변경하면 됩니다).

## 일반적인 웹 성능 최적화 모범 사례 구현하기

웹사이트에서 폰트를 최적화하는 것은 성능과 미적 요소 사이의 적절한 균형을 찾는 것이 중요합니다. 이는 좋은 사용자 경험을 제공하는 데 필수적이지만, 충분하지 않습니다.

빠르게 로드되는 폰트를 제공하려면 다음과 같은 웹 성능 모범 사례 중 하나 이상을 구현하는 것이 좋습니다.

- CSS 파일에 코드 분할을 적용하고 사용하지 않는 CSS를 제거합니다. 이 방법은 페이지에서 다운로드되는 폰트 수를 줄일 수 있습니다(폰트 파일은 HTTP 요청을 시작하려면 CSS 코드에 참조되어야 합니다).
- [HTTP/3 네트워크 프로토콜](https://www.debugbear.com/blog/http3-quic-protocol-guide)을 지원합니다. 이는 다운로드 속도를 높일 수 있습니다.
- 폰트를 포함한 정적 리소스를 [CDN](https://www.debugbear.com/blog/cdn)에서 다운로드합니다.
- 캐싱을 구현하세요. 이는 일반적으로 웹 호스트나 CDN 제공자가 자동으로 수행하지만, 수동으로 처리해야 하는 경우 폰트 파일에 대한 만료 기간이 긴 캐싱 헤더를 사용하세요.

최상의 결과를 얻기 위해서는 웹 성능 분석 도구(예: DebugBear)를 사용해 가장 중요한 페이지를 모니터링하면 고유한 성능 문제와 병목 현상을 감지하고 수정할 수 있습니다.

DebugBear로 성능 분석을 시작하는 방법에는 세 가지가 있으며 모두 무료입니다.

- 웹사이트에서 [무료 속도 테스트](https://www.debugbear.com/test/website-speed)를 실행합니다.
- 실제 웹사이트의 자세한 성능 데이터를 보여주는 [인터랙티브 데모](https://www.debugbear.com/project/25972)를 사용해 봅니다.
- [14일 무료 체험판](https://www.debugbear.com/signup)에 가입합니다(신용 카드는 필요 없습니다).

무료 체험을 통해 전 세계 여러 위치에서 시뮬레이션(또는 실험실) 테스트를 설정하고 HTML에 경량 실사용자 모니터링(RUM) 스크립트를 추가해 실제 사용자가 매일 웹사이트에서 겪는 성능 문제를 파악할 수 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
