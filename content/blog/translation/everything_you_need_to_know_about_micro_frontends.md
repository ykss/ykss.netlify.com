---
title: '(번역) 마이크로 프런트엔드에 대해 알아야 할 모든 것'
date: 2024-01-02 01:00:00
category: 'Translation'
draft: true
---

> 원문 : [Everything You Need to Know About Micro Frontends](https://newsletter.systemdesign.one/p/micro-frontends)

> 0.1% 기업이 개발 팀을 확장하는 방법
 
프런트엔드 개발은 어렵습니다.

많은 팀이 참여하는 대규모 프로젝트에서 프런트엔드 개발을 확장하는 것은 더 어렵습니다.

비즈니스 아이디어가 인기를 얻고 많은 고객을 확보했다고 가정해보면, 백엔드를 마이크로서비스로 분할하여 확장성을 높일 수 있습니다.

하지만 프런트엔드는 여전히 복잡한 모놀리스(monolith)입니다. 따라서 프런트엔드에 새로운 기능과 기술을 추가하는 것은 쉽지 않습니다.

![Communication Paths Between Teams Working on a Monolith Frontend](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85036dfe-7464-4b55-865a-e206bf86f61a_1495x1265.png)
> 모놀리스 프런트엔드에서 작업하는 팀 간의 커뮤니케이션 경로

또한 개발 팀을 확장하기가 어려워집니다. 프런트엔드 모놀리스를 변경하려면 팀원들이 서로 소통해야 하기 때문입니다. 그리고 개발 속도가 느려집니다.

따라서 커뮤니케이션 경로가 많아지면 팀 수가 늘어날수록 개발 효율성이 떨어집니다.

![Delivery Workflow: Monolith Frontend vs Micro Frontend](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1e4ae5e4-207e-4191-8825-39ff368f4707_3328x1052.png)
> 배포 워크플로: 모놀리스 프런트엔드 vs 마이크로 프런트엔드

게다가 새로운 기능을 제공하려면 프런트엔드 변경이 필요할 가능성이 높습니다. 따라서 여러 팀이 서로 다른 백엔드 마이크로서비스에서 작업하는 경우 필요한 프런트엔드 변경 횟수가 증가합니다.

이 문제에 대한 간단한 해결책은 백엔드 및 프런트엔드 서비스를 모두 소유하도록 팀을 나누고 각 팀에 작업을 공정하게 분배하는 것입니다.

또한 프런트엔드를 완전히 다시 작성하는 것은 비용이 많이 듭니다. 따라서 처음부터 프런트엔드에서 많은 기술 스택을 지원하는 것이 중요합니다.

---
## [GreatFrontEnd (추천 광고)](https://www.greatfrontend.com/)

전직 FAANG 수석 엔지니어가 제공하는 엔드투엔드 프런트엔드 면접 준비 플랫폼에서 최고 수준의 프런트엔드 시스템 설계 리소스를 찾아보세요.

참고: 이 게시물에는 제휴사 링크가 없습니다.

---

## 마이크로 프런트엔드란 무엇인가요?

마이크로 프런트엔드는 마이크로 서비스 개념을 프런트엔드로 확장한 것입니다. 이는 아키텍처 및 조직의 스타일을 의미합니다.

마이크로 프런트엔드는 웹사이트를 독립적인 도메인 기반의 마이크로 앱으로 분할합니다. 그리고 각 마이크로 앱은 독립적으로 빌드, 테스트 및 배포됩니다.

마이크로 프런트엔드는 기술에 구애받지 않습니다. 따라서 리액트, 뷰, 앵귤러와 같은 다양한 도구와 프레임워크로 구현할 수 있습니다.

![Team Organization: Monolith Frontend vs Micro Frontend](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F62e4cf4d-7a16-4533-bd00-e9a1e3f80943_2463x1575.png)
> 팀 구성: 모놀리스 프런트엔드 대 마이크로 프런트엔드

또한 개발팀은 백엔드부터 마이크로 프런트엔드까지 엔드투엔드 기능을 소유해야 합니다. 그래야 자율성과 효율성을 높일 수 있기 때문입니다.

따라서 특정 기술이 아닌 비즈니스 하위 도메인을 중심으로 팀을 구성해야 합니다.

*도메인 중심 디자인(**DDD**)*은 마이크로 프런트엔드의 핵심 원칙입니다. 다시 말해, 각 마이크로 프런트엔드는 비즈니스 하위 도메인을 나타냅니다.

따라서 마이크로 프런트엔드의 경계는 개발자가 아닌 사용자에게 제공하는 가치를 기준으로 설정해야 합니다.

또한 DDD의 *경계 컨텍스트(bounded context)*는 우발적인 결합이 발생하기 어렵게 만듭니다. 바운드 컨텍스트는 특정 도메인 모델이 적용되는 도메인 내의 경계입니다.

![Micro Frontends in Spotify Web UI](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0e3c6011-30cc-42dd-a448-23826eee6c59_2920x1506.png)
> Spotify 웹 UI의 마이크로 프런트엔드

위 이미지는 마이크로 프런트엔드를 사용하는 Spotify 웹 UI의 모습을 보여줍니다.


## 마이크로 프런트엔드는 어떻게 작동하나요?

컨테이너 애플리케이션은 모든 마이크로 프런트엔드를 결합하는 상위 앱입니다. 최소한의 HTML, CSS, JavaScript로 구축됩니다.

컨테이너 애플리케이션은 다음과 같은 것들을 수행합니다.

- 헤더 및 푸터와 같은 일반적인 페이지 요소 렌더링하기

- 온디맨드 마이크로 프런트엔드 렌더링

- 인증 및 네비게이션과 같은 다양한 문제 해결

마이크로 프런트엔드에서 크로스 커팅 문제가 작동하는 방식은 다음과 같습니다.

### 마이크로 프런트엔드에서의 인증

![Micro Frontend Authentication Workflow](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fff21fa06-8386-42ae-bbf3-6ef267242249_2753x1404.png)
> 마이크로 프런트엔드 인증 워크플로

컨테이너 애플리케이션은 서버와 상호 작용하여 인증 토큰을 받습니다. 그런 다음 컨테이너 애플리케이션은 토큰을 각 마이크로 프런트엔드에 주입합니다. 마이크로 프런트엔드는 각 요청과 함께 토큰을 서버로 보냅니다.

### 마이크로 프런트엔드에서의 CSS 격리

CSS에는 네임스페이스나 캡슐화가 없습니다. 따라서 마이크로 프런트엔드에서 스타일이 재정의될 위험이 있습니다.

이 문제를 방지하는 아래와 같은 방법들이 있습니다.

- BEM CSS 명명 규칙

- SASS 전처리기

- CSS 모듈

- CSS-in-JS 라이브러리

### 마이크로 프런트엔드에서의 공유 컴포넌트

[Lifecycle of Shared Components in Micro Frontends
](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff4e59109-2164-426d-891f-59099a2702f7_3058x2101.png)
> 마이크로 프런트엔드에서 공유 컴포넌트의 수명 주기

공유 라이브러리는 마이크로 프런트엔드에서 시각적 일관성과 코드 재사용을 제공합니다.

다음은 마이크로 프런트엔드에서 공유 컴포넌트를 개발하는 간단한 접근 방식입니다.

- 팀에서 자체 컴포넌트를 만들고 처음에 코드 중복을 허용합니다.

- 패턴이 나타나면 코드를 라이브러리로 추출합니다.

그러나 비즈니스 로직을 공유하지 않는 것이 결합을 방지하는 데 중요합니다.

또한 높은 품질과 일관성을 위해 공유 컴포넌트는 한 팀이 소유해야 합니다. 하지만 모든 팀의 기여에 열려 있어야 합니다.

### 마이크로 프런트엔드에서의 테스트

테스트 전략은 모놀리식 프런트엔드와 동일합니다. 각 마이크로 프런트엔드에는 자동화된 테스트가 필요합니다.

그러나 웹 페이지의 올바른 결합을 확인하기 위한 기능 테스트는 최소한으로 유지해야 합니다. 그렇지 않으면 복잡성이 증가합니다.


## 마이크로 프런트엔드 구조

마이크로 프런트엔드의 *3가지 원칙*은 다음과 같습니다.

- 비즈니스 도메인을 중심으로 모델링

- 자율적인 팀을 통한 분권화

- 배포에 대한 자동화 문화

각 마이크로 프런트엔드는 개별 앱으로 배포됩니다. DOM은 마이크로 프런트엔드 간에 공유됩니다.

![Architecture Evolution](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2395b52a-5e02-48a5-a3c0-75ebff0ece47_3668x1848.png)
> 구조의 진화

마이크로 프런트엔드는 일반적으로 백엔드 포 프런트엔드(**BFF**) 패턴으로 설정됩니다.

BFF 패턴은 각 마이크로 프런트엔드에 맞는 맞춤형 백엔드를 생성합니다. 그러나 마이크로 프런트엔드가 간단한 API만 사용하는 경우에는 전용 백엔드가 필요하지 않습니다.

### 마이크로 프런트엔드 간 커뮤니케이션

마이크로 프런트엔드는 상태를 공유해서는 안 되며, 메시지나 이벤트를 통해 통신해야 합니다. 또한 마이크로 프런트엔드 간의 통신은 결합을 방지하기 위해 최소한으로 유지되어야 합니다.

마이크로 프런트엔드가 서로 통신할 수 있는 방법은 다음과 같습니다.

- 사용자 지정 이벤트

- 콜백 전달

- 주소 표시줄을 통신 메커니즘으로 사용하여 라우팅하기

- 웹 워커


## 어떻게 마이크로 프런트엔드를 구현할까요?

![Micro Frontend Implementation](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F64d68ec5-fb64-456d-86cf-b0b8280ed52a_1614x687.png)
> 마이크로 프런트엔드 구현

마이크로 프런트엔드를 렌더링하기 위해 별도의 서버를 설정할 수 있습니다. 또한 컨테이너 앱 서버를 설치하여 필요에 따라 관련 마이크로 프런트엔드 서버와 상호 작용할 수 있습니다.

마이크로 프런트엔드의 몇 가지 일반적인 *안티 패턴*은 다음과 같습니다.

- 경계를 제대로 설정하지 않고, 많은 마이크로 프런트엔드를 생성하는 경우

- 많은 프레임워크와 도구 사용으로 인한 복잡성 증가

- 마이크로 프런트엔드의 종속성 지옥

![Micro Frontend Deployment Pipeline](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f0f6ccc-3e1f-4049-925d-378e0cf20b3c_2380x840.png)
> 마이크로 프런트엔드 배포 파이프라인

또한 각 마이크로 프런트엔드는 독립적인 배포 파이프라인을 가져야 합니다. 범위와 관련 위험을 줄일 수 있기 때문입니다.

![Micro Frontend Code Organization: Mono Repo vs Poly Repo](https://substackcdn.com/image/fetch/w_1456,c_limit,f_webp,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff8792bd5-5e94-4ab1-a80d-a07556f97d32_1282x707.png)
> 마이크로 프런트엔드 코드 구성: 모노 레포지토리와 폴리 레포지토리

**마이크로 프런트엔드 코드를 구성하는 방법에는 두 가지가 있습니다.**

- 모노레포

- 폴리레포
  
*모노레포*는 단일 레포지토리를 사용하여 코드와 라이브러리를 공유합니다. 추적하고 관리하기가 더 쉽습니다. 하지만 경계를 올바르게 설정하지 않으면 실수로 결합될 위험이 있습니다.

*폴리레포*는 마이크로 프런트엔드당 하나의 레포지토리를 제공하지만. 이는 코드 기반을 독립적으로 유지합니다. 하지만 추적 및 관리가 어려워질 수 있습니다.

따라서 옳고 그른 접근 방식은 없으며 상황에 따라 적합한 방식이 있을 뿐입니다.

**마이크로 프런트엔드에는 구성에 따라 두 가지 유형이 있습니다.** 빌드 타임과 런타임입니다.

### 마이크로 프런트엔드 빌드 시간 통합

마이크로 프런트엔드는 패키지로 게시됩니다. 그리고 컨테이너 애플리케이션은 이를 종속 요소로 포함합니다.

하지만 이 접근 방식은 릴리스 단계에서 커플링을 생성합니다. 다시 말해, 어떤 마이크로 프런트엔드가 변경되면 모든 마이크로 프런트엔드의 릴리스가 필요합니다.

따라서 빌드 시 통합을 피하는 것이 좋습니다.

```json
{
  "name": "@frontend/container",
  "version": "2.7.1",
  "description": "A micro frontends app",
  "dependencies": {
    "@frontend/micro-app-1": "^3.1.9",
    "@frontend/micro-app-2": "^8.2.1",
  }
}
```

### 마이크로 프런트엔드 런타임 통합

컴포지션은 런타임에 발생하며 브라우저 새로고침 시 마이크로 프런트엔드를 업데이트할 수 있습니다.

런타임 통합을 설정하는 다양한 방법이 있습니다.

- iframe

- 자바스크립트

- 웹 컴포넌트

#### iframe

iframe으로 마이크로 프런트엔드를 구축하는 것이 가장 간단한 접근 방식입니다. 스타일과 전역 변수를 효과적으로 격리할 수 있습니다.

하지만 유연성이 떨어지고 통합이 어려울 수 있습니다. 또한 라우팅, 히스토리, 딥링킹이 복잡해질 수 있습니다.

```html
<iframe id="micro-frontend"></iframe>
```

#### 자바스크립트

마이크로 프런트엔드는 `<script>` 태그를 사용하여 추가됩니다. 그런 다음 전역 함수를 엔트리 포인트에 노출합니다. 컨테이너 애플리케이션은 마이크로 프런트엔드의 전역 함수를 호출하여 렌더링합니다.

이것은 유연하기 때문에 마이크로 프런트엔드를 사용하는 가장 좋은 방법일 것입니다.

```html
<script src="https://origin.server/micro-frontend.js"></script>
```

#### 웹 컴포넌트

마이크로 프런트엔드는 사용자 정의 HTML 요소로 정의됩니다. 그런 다음 컨테이너 애플리케이션이 이를 인스턴스화합니다.

이는 웹 컴포넌트 사양이 마음에 들고 브라우저 기능을 사용하려는 경우 유효한 접근 방식입니다.

하지만 자신만의 인터페이스를 정의하려는 경우에는 올바른 방법이 아닐 수 있습니다.


## 마이크로 프런트엔드 프레임워크

마이크로 프런트엔드는 아직 도입 초기 단계에 있습니다. 하지만 프로덕션에 바로 사용할 수 있는 마이크로 프런트엔드 프레임워크가 일부 존재합니다.

- [Luigi](https://luigi-project.io/)
- [Single SPA](https://single-spa.js.org/)
- [Open Components](https://opencomponents.github.io/)
- [Bit](https://bit.cloud/)
- [Frint.js](https://frint.js.org/)


## 마이크로 프런트엔드의 장점

마이크로 프런트엔드의 장점은 다음과 같습니다.

- 격리된 배포를 통한 빠른 제공
- 유연한 기술 스택과 간단한 코드베이스로 인한 빠른 개발 주기
- 작은 코드베이스로 인한 유지보수 및 테스트 가능성 향상
- 자율적인 팀으로 인한 확장 가능한 개발
- 필요에 따라 마이크로 프런트엔드가 로드되므로 초기 로드 시간 단축
- 모듈이 독립적이기 때문에 높은 안정성
- 작은 코드베이스와 제한된 컨텍스트로 인해 신규 개발자를 위한 낮은 진입 장벽
- 분산 아키텍처로 인한 분리된 시스템
- 애플리케이션의 여러 부분 간의 명시적인 데이터 흐름으로 인한 낮은 커플링
- 버전 전환을 통한 손쉬운 롤백
- 앱 부분의 점진적 업그레이드를 통한 신속한 제품 피드백
- 프런트엔드 부분의 손쉬운 업데이트 또는 재작성
- 격리된 방식으로 새로운 기술을 쉽게 실험

## 마이크로 프런트엔드의 단점

마이크로 프런트엔드의 단점은 다음과 같습니다.

- 운영 오버헤드로 인한 복잡성 증가
- 일관된 사용자 경험을 유지하기 위한 추가적인 작업
- 시각적 일관성을 유지하기 위한 이해관계자의 반발
- 변화하는 요구사항에 따른 분산 모놀리스 문제 발생 가능성
- 관련 마이크로 프런트엔드 로드로 인한 사용자 앱 탐색 시, 로드 시간 증가 
- 마이크로 프런트엔드의 중복된 종속성으로 인해 높은 대역폭 사용량 발생
- 팀 자율성 증가로 인한 파편화된 업무 방식
- 많은 레포지토리, 도구, 배포 파이프라인으로 인한 운영 및 거버넌스 복잡성 증가

## 결론

### 마이크로 프런트엔드를 사용해야 하는 경우

마이크로 프런트엔드는 다음과 같은 경우에 적합합니다.

- 중대형 프로젝트
- 웹 프로젝트
- 오버헤드에 관대한 생산성 우선 프로젝트
- 기술적, 조직적 성숙도가 높은 프로젝트

### 마이크로 프런트엔드를 사용하지 않아야 하는 경우

다음과 같은 경우 마이크로 프런트엔드는 적합하지 않습니다.

- 소규모 프로젝트
- 팀 간에 기능을 나누기 위해 설정된 컨텍스트가 존재하지 않는 경우
- 자동화가 불충분하게 설정된 경우
- 툴링 및 개발 관행에 대한 분산된 의사결정이 익숙치 않은 경우

마이크로 프런트엔드는 만병통치약이 아닙니다. 하지만 마이크로 프런트엔드는 특정 상황에서 문제를 해결할 수 있습니다.

또한 단일 페이지 애플리케이션과 서버 측 렌더링은 여전히 프런트엔드에 유효한 옵션입니다.

위험을 적절히 관리한다면 마이크로 프런트엔드의 이점이 비용보다 더 클 수 있습니다. 따라서 직접 조사하는 것이 중요합니다.

## 참조

- https://www.thoughtworks.com/radar/techniques/micro-frontends
- https://martinfowler.com/articles/micro-frontends.html
- https://www.infoq.com/presentations/evolution-micro-frontend/
- https://www.altexsoft.com/blog/micro-frontend/
- https://www.infoq.com/presentations/dazn-microfrontend/
- https://www.aplyca.com/en/blog/micro-frontends-what-are-they-and-when-to-use-them
- https://www.infoq.com/presentations/microfrontend-antipattern/
- https://www.xenonstack.com/insights/micro-frontend-architecture
- https://www.infoq.com/news/2018/08/experiences-micro-frontends/
- https://aws.amazon.com/blogs/architecture/micro-frontend-architectures-on-aws/

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
