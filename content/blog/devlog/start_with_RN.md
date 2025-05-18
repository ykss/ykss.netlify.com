---
title: '2025년 리액트 네이티브로 프로젝트 시작하기'
date: 2025-02-02 11:30:00
category: 'DevLog'
draft: false
---

이 글은 사이드 프로젝트를 진행하기에 앞서 RN을 선택한 이유와 21년까지 경험했던 RN 이후 현재까지의 변경된 내용들에 대한 팔로업에 초점이 맞추어져 있다. 따라서 리액트 웹 개발자가 RN으로 앱 개발을 시작하려 할 때 참고할 수 있다면 좋을 것 같다.

## 배경

올해 목표 중 하나는 오랫동안 미뤄왔던 사이드 프로젝트를 시작하는 것이었다. 물론 완성까지 하면 너무 좋겠지만, 시작이 반이라는 생각으로 프로젝트 시작부터 해보려고 한다. 그렇기에 가장 먼저 해야 할 것은 기술 스택을 선정하는 것이었는데, 사실 후보군은 많이 있었다. 먼저 내가 만들고자 하는 사이드 프로젝트는 웹 서비스보다는 모바일 앱에 더 잘 어울리기 때문에 앱으로 개발해야겠다고 생각했고, 그렇게 했을 때 선택지는 세 가지 정도로 압축되었다.

1. 안드로이드 또는 iOS 네이티브 앱 개발
2. 하이브리드 앱 개발 - 네이티브 앱에 웹뷰를 통합하여 웹 기술로 대부분의 기능을 구현하는 방법
3. 플러터, RN을 통한 크로스 플랫폼 앱 개발

위의 선택지에서 1번의 경우, kotlin이나 swift와 같은 네이티브 언어 학습이 필요하고, 2번의 경우 네이티브 기능을 자유롭게 활용해야 하는 경우 한계점이 존재하고, 결국에는 네이티브 코드가 필요할 수 있게 된다. 사이드 프로젝트라는 특성을 생각하면 시작하는 데까지 많은 학습과 준비 과정이 필요하다면 프로젝트가 진척되기 힘들 것 같아 개발 경험이 있어 진입 장벽이 비교적 낮은 3번 방법을 선택했다.

## React Native를 선택한 이유

플러터와 RN은 예전에 앱 개발을 했을 때도 많이 비교되는 프레임워크였고, 지금까지도 경쟁을 통해 서로 발전하고 있는 관계이기도 하다. 사실 현시점에서는 플러터와 RN 중 어떤 프레임워크를 사용하더라도 사이드 프로젝트를 진행하는 데 이슈가 없지만 다음과 같은 이유로 React Native를 선택했다.

### 1. 비교적 낮은 러닝커브

현재 프런트엔드 개발을 하고 있기 때문에 리액트는 나에게 제일 익숙한 스택이라고 할 수 있는데, 러닝 커브 면에서는 React Native는 리액트 개발자가 선택할 수 있는 가장 최고의 선택이라고 하고 싶다. 물론 플러터도 과거에 경험해 봤지만, 대부분의 기억이 휘발되었고 Dart 언어를 다시금 학습해야 한다는 부담이 있었기 때문에 웹 FE 개발자로서 기존의 리액트와 Javascript/Typescript를 활용할 수 있고, 플러터보다는 낮은 진입장벽을 가진 React Native를 선택했다.

### 2. 새로운 아키텍처와 함께 개선된 성능

플러터와 RN은 경쟁 초기부터 계속하여 성능 비교 대상이었다. 그러나 빌드 성능 면이나 복잡한 UI, 애니메이션 렌더링에서는 플러터가 꾸준하게 더 앞선다는 평가가 많았다.

내가 RN을 경험했던 2022년에는 새로운 아키텍처가 베타 단계였으나, 25년 현재에는 새로운 아키텍처가 안정화되어 대부분의 라이브러리가 이를 지원하고 있다. 새로운 네이티브 모듈 시스템이 도입되었고, 다중 스레드에서 동시 업데이트 처리가 가능한 새로운 렌더러가 도입되었다. 그뿐만 아니라 Javascript와 네이티브 런타임 사이에 존재했던 브릿지가 제거되어, 새로운 아키텍처 도입으로 성능이 크게 개선되었다. 특히 UI 렌더링과 브릿지 통신 오버헤드가 대폭 감소했다. 이외에도 여러 가지 최적화를 통해 성능 개선이 이루어졌고, 리액트 18을 완벽하게 지원하게 되었다. 이번 React Native의 혁신적인 개선 사항은 [<리액트 네이티브의 새로운 아키텍처가 출시되었습니다>](https://ykss.netlify.app/translation/new_architecture_is_here/)를 통해 좀 더 상세하게 확인할 수 있다.

결과적으로 RN의 성능이 우수하기 때문이 아니라, 성능 문제 때문에 꼭 플러터를 선택할 필요는 없다고 판단되어 RN을 선택한 것이다. 사실 플러터와 RN의 선택에 있어서는 이러한 성능 차이보다는 어떤 프레임워크를 더 숙련도 있게 활용할 수 있느냐가 포인트라고 생각한다.

### 3. Expo 프레임워크를 통해 얻을 수 있는 이점

Expo는 React Native 개발을 더욱 쉽게 만들어주는 프레임워크다. Expo를 사용하면 네이티브 코드를 전혀 사용하지 않아도 간단하고 여러 가지 장점을 얻을 수 있다는 점도 RN을 선택하게 된 이유 중 하나이다.

- 네이티브 빌드 환경 설정 없이 바로 개발 시작 가능
- OTA(Over-the-Air) 업데이트를 통한 즉각적인 앱 업데이트
- 푸시 알림, 카메라 등 다양한 네이티브 기능을 JavaScript API로 제공
- 개발 환경에서 QR코드로 즉시 테스트 가능(Expo Go)

이전에 Expo를 사용했을 때는 Expo에서 지원하는 네이티브 모듈이 제한적이었기 때문에, 뭔가 더 세밀한 제어나 특수한 네이티브 기능이 필요할 경우에는 Expo를 사용하다가 eject를 통하여 Expo를 걷어낸 순수한 RN 프로젝트로의 복잡한 전환이 필요했는데, 현재는 Expo가 많이 발전되어 사실 Expo를 사용하여 웬만한 네이티브 기능을 모두 사용할 수 있게 되었다. 이번에 알게 된 부분은 2025년 기준으로는 Expo의 개발 방식이 변화(EAS Build의 도입)되어 eject는 더 이상 사용되지 않으며 deprecated 되었다고 한다.

## Expo를 통한 RN 프로젝트 시작하기

### 개발 환경 설정

React Native 개발을 시작하기 전에 필요한 기본적인 개발 환경을 구축해야 한다. 먼저 Node.js는 LTS 버전을 설치하는 것을 권장한다. Expo를 사용하면 네이티브 개발 환경(Xcode, Android Studio) 없이도 개발을 시작할 수 있다는 장점이 있다. 다만, 네이티브 기능 개발을 위해 Xcode나 Android Studio 설치가 더 일반적으로 권장된다.

```bash
# Expo CLI로 프로젝트 생성 및 개발 시작
npx create-expo-app my-app
cd my-app
npx expo start
```

### Expo CLI vs RN CLI 선택 가이드

과거에는 React Native로 프로젝트를 시작할 때 가장 먼저 고민하게 되었던 것이 Expo CLI와 React Native CLI 중 어떤 것을 선택할지였다. 이전에는 Expo가 제한적인 기능만 제공하고 네이티브 모듈 사용에 제약이 많아 실제 프로덕션 앱 개발에는 RN CLI를 선호하는 경향이 있었다.

하지만 2025년 현재는 상황이 많이 달라졌다. Expo는 'Development Builds'와 'Config Plugins' 기능을 통해 네이티브 모듈도 자유롭게 사용할 수 있게 되었고, EAS(Expo Application Services)를 통한 빌드/배포 자동화, OTA 업데이트 등 다양한 기능을 제공하고 있다. 이러한 발전으로 인해 React Native 공식 문서에서도 Expo를 권장하고 있으며, 대부분의 앱 개발 요구사항을 Expo로 충분히 커버할 수 있게 되었다. 때문에 Expo와 React Native CLI 사이의 선택은 더 이상 큰 고민거리가 아니게 되었다.

#### Expo CLI의 장점

- 빠른 프로젝트 설정과 개발 시작
- 간편한 빌드 및 배포 프로세스
- 풍부한 내장 API와 컴포넌트
- OTA 업데이트 지원
- Config Plugins를 통한 네이티브 모듈 통합 가능
- 자동화된 빌드 인프라 제공

#### React Native CLI의 장점

- 네이티브 모듈에 대한 완전한 제어
- 커스텀 네이티브 코드 작성 가능
- 더 작은 앱 크기
- 네이티브 빌드 프로세스에 대한 완전한 통제

이러한 장단점을 고려했을 때, 특별히 네이티브 레벨의 깊은 커스터마이징이 필요하지 않은 대부분의 프로젝트에서는 Expo CLI를 선택하는 것이 개발 생산성과 유지보수 측면에서 더 유리하다. 실제로 많은 프로덕션 앱이 Expo를 사용하여 성공적으로 서비스되고 있다.

### 프로젝트 생성 및 구조

2025년 현재 Expo는 더 현대적이고 유연한 프로젝트 구조를 제공하는 Expo Router를 권장한다.

```bash
# 새 프로젝트 생성 (Expo Router + TypeScript)
npx create-expo-app --template
```

위 명령어를 실행하면 사용자에게 여러 옵션(Blank, Blank (TypeScript), Navigation (TypeScript) 등)을 제공하며, 그중에서 선택할 수 있다.

이 중 `Navigation (TypeScript)`를 선택하면 Next.js의 App Router와 유사한 파일 기반 라우팅을 지원하는 Expo Router를 포함한 템플릿의 프로젝트를 생성할 수 있다. Expo Router는 React Navigation을 기반으로 하되, 파일 시스템 기반의 더 직관적인 라우팅을 제공한다. 프로젝트 구조는 다음과 같다.

```bash
my-app/
├── app/               # Expo Router 기반 페이지
│   ├── (tabs)/       # 탭 네비게이션 그룹
│   ├── modal/        # 모달 스택
│   └── [dynamic]/    # 동적 라우트
│
├── components/        # 재사용 컴포넌트
├── hooks/            # 커스텀 훅
├── providers/        # 컨텍스트 프로바이더
├── services/         # API 및 외부 서비스
├── stores/           # 상태 관리
├── types/            # TypeScript 타입
├── utils/            # 유틸리티 함수
├── assets/           # 이미지, 폰트 등
└── app.json          # Expo 설정
```

#### 주요 특징

- 파일 시스템 기반 라우팅으로 직관적인 네비게이션 구조
- Expo Router의 lazy loading 활용으로 초기 로딩 성능 최적화
- TypeScript와 ESLint 설정 내장
- 테스트 환경 사전 구성

### 필수 라이브러리 설정

React Native 프로젝트를 시작할 때 필수적으로 고려해야 할 라이브러리들이 있다. 2025년 기준으로 가장 많이 사용되는 조합은 다음과 같다.

#### 네비게이션

```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
```

React Navigation은 React Native에서 사실상의 표준 네비게이션 라이브러리다. 특히 v7부터는 새로운 아키텍처와 호환되며, 성능이 크게 개선되었다. Expo를 사용하는 경우 Expo Router가 기본적으로 세팅되어 있어 별도로 React Navigation을 설치하고 구성할 필요가 없다. 위에서 잠시 언급한 것과 같이 Expo Router는 React Navigation을 기반으로 만들어졌으며, 파일 시스템 기반의 라우팅을 제공하여 더 직관적이고 간편한 네비게이션 구조를 만들 수 있다

#### 상태 관리

```bash
# Zustand (가장 널리 사용되는 선택)
npm install zustand

# 또는 Jotai (더 작은 규모의 상태 관리에 적합)
npm install jotai

# persist 미들웨어 (필요한 경우)
npm install @zustand/persist-async
```

상태 관리는 리액트 웹 개발 환경과 비슷하다. 2025년 현재 React Native를 통한 모바일 앱 개발에서는 Zustand는 널리 사용되는 상태 관리 라이브러리 중 하나다. Redux는 보일러플레이트가 많고 복잡성이 높다는 이유로 새로운 프로젝트에서는 잘 사용되지 않는다. Zustand는 간단한 API와 높은 성능, 작은 번들 사이즈를 제공하며, React Native 환경에서도 최적화되어 있다. 추가로, 서버 상태 관리를 위해 TanStack Query (구 React Query)의 사용이 증가하고 있다.

더 작은 규모의 상태 관리가 필요한 경우 Jotai를 고려할 수 있으며, 매우 간단한 상태 관리의 경우 리액트의 Context API로도 충분할 수 있다. 상태 유지가 필요한 경우 Zustand의 persist 미들웨어를 사용하면 앱을 재시작해도 상태를 유지할 수 있다.

#### 스타일링

React Native에서는 여러 가지 스타일링 방식을 사용할 수 있다. 이전에 경험했을 때는 기본 제공되는 StyleSheet와 styled-components를 사용했었지만, 요즘 웹 개발 트렌드와 일치하게 NativeWind를 통해 Tailwind CSS도 지원되어 트렌드로 자리 잡아가고 있다. 나는 요즘 웹에서도 Tailwind CSS를 주로 사용하고 있기 때문에 NativeWind를 사용하기로 했다.

- Nativewind (2025년 현재 가장 추천되는 방식)

```bash
# Nativewind 설치
npm install nativewind
npm install -D tailwindcss

# tailwind.config.js 생성
npx tailwindcss init
```

```tsx
// 사용 예시
export function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl font-bold">Hello, Nativewind!</Text>
    </View>
  );
}
```

2025년 기준으로 Nativewind가 가장 추천되는 스타일링 방식이다. 그 이유는 다음과 같다.

- 웹 개발자에게 친숙한 Tailwind CSS 문법 사용 가능
- 컴파일 타임에 최적화되어 런타임 성능 영향 없음
- 다크 모드 등 테마 관리가 용이
- 반응형 디자인 구현이 쉬움
- TypeScript와의 완벽한 통합

기본 제공되는 StyleSheet API는 간단한 스타일링에 적합하며, styled-components는 동적 스타일링이 많이 필요한 경우에 고려할 수 있다. 하지만 대부분의 경우 NativeWind를 사용하는 것이 생산성과 유지보수 측면에서 가장 좋은 선택이 될 것으로 생각한다. 하지만 스타일링 방식은 개인의 취향이 많이 반영되는 영역이기도 하므로 각자 선호하는 방식을 사용하는 것이 좋다.

## 결론

2025년 현재 React Native는 새로운 아키텍처와 Expo의 발전으로 더욱 성숙한 개발 환경을 제공하고 있다. 특히 Expo를 활용하면 웹 개발자도 쉽게 앱 개발을 시작할 수 있으며, 개발부터 배포까지 효율적으로 진행할 수 있다. 실제로 Instagram, Discord, Shopify와 같은 대규모 서비스들이 React Native를 성공적으로 도입하여 사용하고 있으며, 특히 Expo를 활용한 개발 사례도 늘어나고 있다.

물론 React Native가 완벽한 솔루션은 아니다. 복잡한 애니메이션이나 고성능이 요구되는 기능 구현에서는 여전히 네이티브 개발 대비 제약이 있을 수 있고, 앱 크기가 더 커질 수 있다는 단점도 존재한다. 하지만 대부분의 일반적인 앱 개발 시나리오에서는 충분한 성능과 개발 생산성을 제공하며, 특히 웹 개발 경험이 있는 개발자에게는 매력적인 선택지가 될 수 있다.

올해 RN 개발을 해보면서 느끼거나 새로 배우는 것들도 정리해 가려고 하는데, 사이드 프로젝트를 진행하며 겪는 어려움이나 고민 등 유의미한 과정을 남길 수 있다면 좋을 것 같다.

## 참고할만한 리소스

- [React Native 공식 문서](https://reactnative.dev)
- [Expo 공식 문서](https://docs.expo.dev)
- [React Native 새 아키텍처 마이그레이션 가이드](https://reactnative.dev/docs/new-architecture-intro)
- [Awesome React Native](https://github.com/jondot/awesome-react-native) - RN 관련 유용한 라이브러리 및 도구 모음
- [React Native 커뮤니티](https://github.com/react-native-community)

---

> 전적으로 제 이해의 기준으로 작성했기 때문에 잘못된 내용이 있을 수 있습니다. 제가 잘못 알고 있는 내용이 있다면 댓글로 남겨주시면 확인하도록 하겠습니다!
