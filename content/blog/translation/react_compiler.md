---
title: '(번역) 리액트 컴파일러 v1.0'
date: 2025-10-28 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1)

리액트 팀은 새로운 업데이트를 공유하게 되어 매우 기쁩니다.

1. 리액트 컴파일러 1.0이 오늘부터 사용 가능합니다.
2. 컴파일러 기반 린트 규칙이 `eslint-plugin-react-hooks`의 `recommended` 및 `recommended-latest` 프리셋에 포함되었습니다.
3. 점진적 도입 가이드를 게시했으며, Expo, Vite, Next.js 팀과 협력하여 신규 앱에서 컴파일러를 활성화한 상태로 시작할 수 있도록 했습니다.

---

오늘 저희는 컴파일러의 첫 번째 안정화 버전을 출시합니다. 리액트 컴파일러는 리액트와 리액트 네이티브 모두에서 작동하며, 재작성(rewrite) 없이 컴포넌트와 훅을 자동으로 최적화합니다. 이 컴파일러는 Meta의 주요 앱들에서 충분히 테스트 되었으며, 완전히 프로덕션 환경에 적합합니다.

[리액트 컴파일러](https://react.dev/learn/react-compiler)는 자동 메모이제이션을 통해 리액트 앱을 최적화하는 빌드 타임 도구입니다. 작년, 저희는 리액트 컴파일러의 [첫 베타 버전](https://react.dev/blog/2024/10/21/react-compiler-beta-release)을 공개했고, 훌륭한 피드백과 기여를 많이 받았습니다. 컴파일러를 도입한 사용자들이 보여준 성과([Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33)와 [Wakelet](https://github.com/reactwg/react-compiler/discussions/52)의 사례 연구 참조)에 매우 고무되었으며, 더 많은 리액트 커뮤니티 사용자들에게 이 컴파일러를 제공하게 되어 기쁩니다.

이번 릴리스는 거의 10년에 걸친 거대한 복잡한 엔지니어링 노력의 결실입니다. 리액트 팀의 컴파일러 탐구는 2017년 [Prepack](https://github.com/facebookarchive/prepack)으로 시작되었습니다. 비록 해당 프로젝트는 결국 중단되었지만, 이 과정에서 많은 교훈을 얻었으며, 이는 향후 컴파일러를 염두에 두고 설계된 훅의 설계에 큰 영향을 주었습니다. 2021년, [Xuan Huang](https://x.com/Huxpro)은 새로운 리액트 컴파일러의 [첫 번째 버전](https://www.youtube.com/watch?v=lGEMwh32soc)을 시연했습니다.

비록 이 첫 번째 버전은 이후 완전히 다시 작성되었지만, 초기 프로토타입은 이 문제가 해결 가능한 문제라는 자신감을 주었고, 대안적인 컴파일러 아키텍처가 저희가 원하던 메모이제이션 특성을 정확히 구현할 수 있음을 보여주었습니다. [Joe Savona](https://x.com/en_JS), [Sathya Gunasekaran](https://x.com/_gsathya), [Mofei Zhang](https://x.com/zmofei), [Lauren Tan](https://x.com/potetotes)은 첫 번째 재 작성을 진행하며, 컴파일러의 아키텍처를 제어 흐름 그래프(CFG) 기반 고수준 중간 표현(HIR)으로 전환했습니다. 이는 훨씬 더 정밀한 분석과 타입 추론을 가능하게 했습니다. 이후 컴파일러의 많은 주요 부분이 여러 번 다시 작성되었으며, 각 재작성 작업은 이전 시도에서 얻은 교훈을 반영했습니다. 또한 [리액트 팀](https://react.dev/community/team)의 여러 구성원들이 큰 기여를 해주셨습니다.

이번 안정 버전은 그 첫걸음입니다. 컴파일러는 앞으로도 계속 진화하고 개선될 것이며, 리액트의 향후 10년 이상을 이끌 새로운 기반이 될 것으로 기대합니다.

지금 바로 [빠른 시작](https://react.dev/learn/react-compiler)으로 이동하시거나, React Conf 2025의 주요 내용을 아래에서 확인하실 수 있습니다.

> 리액트 컴파일러는 어떻게 작동하나요?
>
> 리액트 컴파일러는 자동 메모이제이션을 통해 컴포넌트와 훅을 최적화하는 최적화 컴파일러입니다. 현재는 Babel 플러그인으로 구현되어 있지만, Babel과 대부분 분리되어 있으며, Babel이 제공하는 추상 구문 트리(AST)를 자체의 새로운 HIR로 변환하여 여러 컴파일러 단계를 거칩니다. 이를 통해 리액트 코드의 데이터 흐름과 변경 가능성을 정밀하게 분석할 수 있습니다. 이러한 분석 덕분에 렌더링 시 사용되는 값을 세밀하게 메모이제이션할 수 있으며, 수동 메모이제이션으로는 불가능한 조건부로 메모이제이션하는 것도 가능합니다.
>
> ```tsx {7}
> import { use } from 'react';
>
> export default function ThemeProvider(props) {
>   if (!props.children) {
>     return null;
>   }
>   // 컴파일러는 조건부 return 이후의 코드도 메모이제이션할 수 있습니다.
>   const theme = mergeTheme(props.theme, use(ThemeContext));
>   return <ThemeContext value={theme}>{props.children}</ThemeContext>;
> }
> ```
>
> _이 예시는 [리액트 컴파일러 플레이그라운드](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA)에서 확인하실 수 있습니다._
>
> 자동 메모이제이션 외에도, 리액트 컴파일러는 리액트 코드에 대한 검증 단계를 수행합니다. 이러한 단계들은 [리액트의 규칙(Rules of React)](https://react.dev/reference/rules)을 반영하며, 데이터 흐름과 가변성에 대한 컴파일러의 이해를 바탕으로 규칙이 위반된 지점을 진단합니다. 이러한 진단은 리액트 코드 내의 잠재적인 버그를 찾아내는 데 유용하며, 주로 `eslint-plugin-react-hooks`를 통해 표면화됩니다.
>
> 컴파일러가 코드를 어떻게 최적화하는지 더 알고 싶으시다면 [플레이그라운드](https://playground.react.dev/#N4Igzg9grgTgxgUxALhASwLYAcIwC4AEwBUYCBAvgQGYwQYEDkMCAhnHowNwA6AdvwQAPHPgIATBNVZQANoWpQ+HNBD4EAKgAsEGBAAU6ANzSSYACix0sYAJRF+BAmmoFzAQisQbAOjha0WXEWPntgRycCFjxYdT45WV51Sgi4NTBCPB09AgBeAj0YAHMEbV0ES2swHyzygBoSMnMyvQBhNTxhPFtbJKdo2LcIpwAeFoR2vk6hQiNWWSgEXOBavQoAPmHI4C9ff0DghD4KLZGAenHJ6bxN5N7+ChA6kDS+ajQilHRsXEyATyw5GI+gWRTQfAA8lg8Ko+GBKDQ6AxGAAjVgohCyAC0WFB4KxLHYeCxaWwgQQMDO4jQGW4-H45nCyTOZ1JWECrBhagAshBJMgCDwQPNZEKHgQwJyae8EPCQVAwZDobC7FwnuAtBAAO4ASSmFL48zAKGksjIFCAA)를 방문해 주세요.

## 리액트 컴파일러 사용 방법

컴파일러를 설치하려면 아래 명령을 사용하세요.

npm

```bash
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

pnpm

```bash
pnpm add --save-dev --save-exact babel-plugin-react-compiler@latest
```

yarn

```bash
yarn add --dev --exact babel-plugin-react-compiler@latest
```

이번 안정 버전과 함께, 저희는 리액트 컴파일러를 프로젝트에 더 쉽게 추가할 수 있도록 개선하고, 컴파일러가 생성하는 메모이제이션 방식을 최적화했습니다. 리액트 컴파일러는 이제 선택적 체이닝(optional chaining)과 배열 인덱스를 의존성으로 지원합니다. 이러한 개선을 통해 리렌더링이 줄어들고, UI 반응성이 향상되며, 본래의 선언적 코드 스타일을 그대로 유지할 수 있습니다.

자세한 사용 방법은 [공식 문서](https://react.dev/learn/react-compiler)에서 확인하실 수 있습니다.

## 프로덕션 환경에서의 결과

[이 컴파일러는 이미 Meta Quest Store와 같은 앱에 적용되었습니다.](https://www.youtube.com/watch?t=3002&v=lyEKhv8-3n0&feature=youtu.be) 초기 로드 및 페이지 간 내비게이션 속도가 최대 12% 향상되었으며, 일부 상호작용은 2.5배 이상 빨라졌습니다. 이러한 성능 향상에도 불구하고 메모리 사용량은 변함없이 유지됩니다. 결과는 환경마다 다를 수 있으므로, 여러분의 앱에서도 컴파일러를 활용해 유사한 성능 향상을 경험해 보시길 권장드립니다.

## 하위 호환성

베타 발표에서 언급했듯이, 리액트 컴파일러는 리액트 17 이상과 호환됩니다. 리액트 19를 아직 사용하지 않으신 경우, 컴파일러 설정에서 최소 타겟을 지정하고 `react-compiler-runtime`을 의존성에 추가하여 사용할 수 있습니다. 관련 문서는 [여기](https://react.dev/reference/react-compiler/target#targeting-react-17-or-18)에서 확인하실 수 있습니다.

## 컴파일러 기반 린팅으로 리액트 규칙을 강제 적용하기

리액트 컴파일러에는 [리액트 규칙](https://react.dev/reference/rules)을 위반하는 코드를 식별하는 ESLint 규칙이 포함되어 있습니다. 린터는 컴파일러 설치가 필요 없으므로, eslint-plugin-react-hooks를 업그레이드하셔도 괜찮습니다. 지금 바로 업그레이드하시길 권장드립니다.

`eslint-plugin-react-compiler`를 이미 설치하셨다면, 제거하신 뒤 `eslint-plugin-react-hooks@latest`를 사용하시면 됩니다. 이 개선에 기여해 주신 [@michaelfaith](https://bsky.app/profile/michael.faith)님께 감사드립니다!

설치 방법은 아래와 같습니다.

npm

```bash
npm install --save-dev eslint-plugin-react-hooks@latest
```

pnpm

```bash
pnpm add --save-dev eslint-plugin-react-hooks@latest
```

yarn

```bash
yarn add --dev --exact eslint-plugin-react-hooks@latest
```

```ts {5}
// eslint.config.js (Flat Config)

import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([reactHooks.configs.flat.recommended]);
```

```ts {3}
// eslintrc.json (Legacy Config)

{
"extends": ["plugin:react-hooks/recommended"],
// ...
}
```

리액트 컴파일러 규칙을 활성화하려면 `recommended` 프리셋 사용을 권장드립니다. 더 많은 설정 정보는 [README](https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/README.md)에서 확인하실 수 있습니다. React Conf에서 소개한 몇 가지 예시는 다음과 같습니다.

- 렌더링 루프를 유발하는 `setState` 패턴 탐지 ([`set-state-in-render`](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-render))
- 이펙트 내에서 비용이 큰 작업 탐지 ([`set-state-in-effect`](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect))
- 렌더링 중 안전하지 않은 ref 접근 방지 ([`refs`](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs))

## useMemo, useCallback, React.memo는 어떻게 해야 하나요?

기본적으로 리액트 컴파일러는 코드 분석과 휴리스틱을 기반으로 메모이제이션을 수행합니다. 대부분의 경우 컴파일러의 자동 메모이제이션은 기존에 작성한 것만큼 정밀하거나, 그보다 더 정밀하게 동작합니다. 또한 컴파일러는 조기 반환(early return) 이후의 부분처럼 `useMemo/useCallback`을 사용할 수 없는 코드 라인에서도 메모이제이션을 수행할 수 있습니다.

그러나 경우에 따라 개발자가 메모이제이션을 더 세밀하게 제어해야 하는 경우, `useMemo`와 `useCallback` 훅을 리액트 컴파일러와 함께 계속 사용할 수 있습니다. 예를 들어, 메모이제이션된 값이 이펙트의 의존성으로 사용되는 경우, 의존성이 의미 있게 변경되지 않는 한 이펙트가 반복 실행되지 않도록 보장하기 위해 사용할 수 있습니다.

새로운 코드에서는 컴파일러의 메모이제이션을 기본으로 사용하고, 필요한 경우에만 `useMemo`/`useCallback`을 활용해 정밀 제어를 하시길 권장드립니다.

기존 코드의 경우, 기존의 메모이제이션을 그대로 유지하거나, 제거 전 충분한 테스트를 거친 후 삭제하시길 권장드립니다.

## 새로운 앱은 리액트 컴파일러를 사용해야 합니다

Expo, Vite, Next.js 팀과 협력하여, 새로운 앱에서 컴파일러를 기본으로 사용할 수 있도록 지원하고 있습니다.

[Expo SDK 54](https://docs.expo.dev/guides/react-compiler/) 이상 버전에서는 기본적으로 컴파일러가 활성화되어 있으므로, 새 앱은 처음부터 컴파일러의 이점을 활용할 수 있습니다.

```bash
npx create-expo-app@latest
```

[Vite](https://vite.dev/guide/)와 [Next.js](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 사용자도 `create-vite` 및 `create-next-app` 명령에서 컴파일러 활성화 템플릿을 선택할 수 있습니다.

```bash
npm create vite@latest
```

```bash
npx create-next-app@latest
```

## 점진적으로 리액트 컴파일러 도입하기

기존 애플리케이션을 유지하고 계신 경우, 컴파일러를 점진적으로 도입할 수 있습니다. 저희는 게이팅 전략, 호환성 검사, 배포 도구를 다루는 단계별 [점진적 도입 가이드](https://react.dev/learn/react-compiler/incremental-adoption)를 공개했으며, 이를 통해 안전하게 컴파일러를 활성화할 수 있습니다.

## swc 지원 (실험적)

리액트 컴파일러는 Babel, Vite, Rsbuild 등 [여러 빌드 도구](https://react.dev/learn/react-compiler#installation)에서 설치할 수 있습니다.

또한 [swc](https://swc.rs/) 팀의 강동윤([@kdy1dev](https://x.com/kdy1dev))님과 협력하여 리액트 컴파일러를 swc 플러그인으로 지원하는 작업도 진행 중입니다. 아직 완료되지 않았지만, [리액트 컴파일러가 활성화된 Next.js 앱](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)에서 빌드 성능이 상당히 향상되었습니다.

최상의 빌드 성능을 위해 Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) 이상 버전 사용을 권장드립니다.

Vite 사용자는 [babel 플러그인](https://react.dev/learn/react-compiler/installation#vite)으로 추가하여 [vite-plugin-react](https://github.com/vitejs/vite-plugin-react)를 통해 컴파일러를 계속 사용할 수 있습니다. 또한 [oxc](https://oxc.rs/) 팀과 협력하여 [컴파일러 지원을 추가](https://github.com/oxc-project/oxc/issues/10048)하고 있으며, [rolldown](https://github.com/rolldown/rolldown)이 공식적으로 출시되고 Vite에서 지원되면, 관련 마이그레이션 정보로 문서를 업데이트할 예정입니다.

## 리액트 컴파일러 업그레이드

리액트 컴파일러는 성능 향상을 위한 자동 메모이제이션을 적용할 때 최상의 결과를 냅니다. 향후 버전에서는 메모이제이션 방식이 더 세분화되거나 정밀하게 변경될 수 있습니다.

그러나 프로덕션 코드가 자바스크립트에서 정적으로 항상 감지할 수 없는 방식으로 [리액트 규칙](https://react.dev/reference/rules)을 위반하고 있는 경우, 메모이제이션 방식 변경이 예기치 않은 결과를 초래할 수 있습니다. 예를 들어, 이전에 메모이제이션된 값이 컴포넌트 트리 어딘가의 `useEffect` 의존성으로 사용되고 있다면, 메모이제이션 방식이 변경됨에 따라 해당 `useEffect`가 과도하게 실행되거나 실행되지 않을 수 있습니다. 리액트 팀은 [useEffect를 동기화 목적에만](https://react.dev/learn/synchronizing-with-effects) 사용하는 것을 권장하지만, 코드베이스에 특정 값이 변경될 때만 실행되어야 하는 등의 다른 용도의 `useEffect`가 포함되어 있을 수도 있습니다.

즉, 드물게 메모이제이션 변경으로 인해 예상치 못한 동작이 발생할 수 있습니다. 따라서 리액트의 규칙을 준수하고, 앱에 대한 지속적인 엔드투엔드 테스트를 수행하여 컴파일러를 안전하게 업그레이드할 수 있도록 하는 것을 권장드립니다.

테스트 커버리지가 충분하지 않은 경우, 컴파일러를 SemVer 범위(`^1.0.0`) 대신 정확한 버전(예: `1.0.0`)에 컴파일러를 고정(`--save-exact` 또는 `--exact` 플래그 사용)하시길 권장드립니다. 이후 컴파일러 업그레이드는 수동으로 수행해야 하며, 앱이 예상대로 작동하는지 반드시 확인해야 합니다.

---

이 게시글을 검토하고 편집해 주신 [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), [Kang Dongyoon](https://x.com/kdy1dev)(@kdy1dev), [Dan Abramov](https://bsky.app/profile/danabra.mov)님께 감사드립니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
