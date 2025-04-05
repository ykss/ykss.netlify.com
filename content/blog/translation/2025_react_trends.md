---
title: '(번역) 2025년 리액트 트렌드'
date: 2025-04-08 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [React Trends in 2025](https://www.robinwieruch.de/react-trends/)

저는 매년 리액트 세계에서 가장 중요한 트렌드에 대해 논의합니다. 이번 글에서는 여러분이 2025년에 주목해야 할 리액트 트렌드를 살펴보겠습니다. 초보 개발자든 숙련된 개발자든, 이 트렌드를 통해 최신 리액트 생태계의 발전을 따라갈 수 있을 것입니다.

## 리액트 서버 컴포넌트(RSC)

**리액트 서버 컴포넌트**는 지금까지 많은 발전을 이루어왔습니다. 최초의 발표는 2020년 12월 21일, "제로 번들 사이즈의 리액트 서버 컴포넌트 소개"라는 [컨퍼런스 발표](https://www.youtube.com/watch?v=TQQPAU21ZUw)에서 이루어졌습니다. 이후 이에 대한 기술적인 세부 사항과 논의가 [RFC(Request for Comments)](https://github.com/reactjs/rfcs/pull/188)에서 이루어졌습니다.

리액트 서버 컴포넌트 사양의 첫 번째 구현은 2022년 10월 25일 Next.js Conf에서 발표된 Next.js 13에서 도입되었습니다. 이 릴리스는 RSC를 완전히 수용한 App Router(_app/_ 디렉터리)의 시작을 알렸습니다.

Next.js 13(2022)과 14(2023)가 RSC 도입의 주요 촉매제 역할을 했고, 이에 따라 많은 부정적인 피드백을 받기도 했지만, Next.js 15(2024)에서는 더욱 안정적인 RSC의 비전을 대중에게 제공하였습니다.

2025년에는 React Router(이전의 Remix)와 TanStack Start 또한 RSC를 지원할 예정이므로, 리액트 서버 컴포넌트가 리액트 생태계의 표준적인 기능이 될 가능성이 큽니다.

```tsx
import { db } from '@/lib/db';

const PostsPage = async () => {
  const posts = await db.post.findMany();

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h2>Posts Page</h2>

      <ul className="flex flex-col gap-y-2">
        {posts.map(post => (
          <li key={post.id}>{post.name}</li>
        ))}
      </ul>
    </div>
  );
};
```

간단히 말해, 리액트 서버 컴포넌트(RSC)는 서버에서 한 번 실행된 후, 자바스크립트가 아닌 렌더링 된 출력만 클라이언트에 전달하는 컴포넌트입니다. 이를 통해 클라이언트 측 자바스크립트 번들 크기를 줄이고, 데이터베이스, API 및 백엔드 로직에 직접 접근할 수 있으면서도 브라우저에는 노출되지 않도록 할 수 있습니다.

서버 컴포넌트는 클라이언트 컴포넌트와 함께 작동하며, 성능을 최적화하기 위해 무거운 로직은 서버에서 처리하고, 필요한 경우 클라이언트에서 인터랙티브 한 요소를 유지할 수 있도록 해줍니다.

> 계속 읽기 : [리액트는 풀스택 프레임워크가 되어가고 있습니다](https://www.robinwieruch.de/react-full-stack-framework/)

## 리액트 서버 함수

**리액트 서버 액션(RSA)**은 리액트 서버 컴포넌트의 발전 형태로, 뮤테이션(mutations, 예: 폼 제출, 데이터베이스 업데이트)를 단순화하기 위해 도입되었습니다. 이를 통해 컴포넌트가 API 경로를 수동으로 정의하지 않고도 서버 함수를 호출할 수 있으며, 원격 프로시저 호출(RPC)과 유사한 개발자 경험(DX)을 제공합니다.

```tsx
import { db } from '@/lib/db';

const createPost = async (formData: FormData) => {
  'use server';

  const name = formData.get('name') as string;

  await db.post.create({
    data: {
      name,
    },
  });
};

const PostsPage = async () => {
  const posts = await db.post.findMany();

  return (
    <div className="p-4 flex flex-col gap-y-4">
      <h2>Posts Page</h2>

      <form action={createPost} className="flex flex-col gap-y-2">
        <input type="text" name="name" placeholder="Name" />
        <button type="submit">Create</button>
      </form>

      <ul className="flex flex-col gap-y-2">...</ul>
    </div>
  );
};
```

그러나 RSC가 데이터 페칭의 개발자 경험(DX)을 개선하고, RSA가 뮤테이션을 간소화했지만, 클라이언트 컴포넌트에서 데이터를 가져오는 작업은 여전히 번거로웠습니다. 예를 들어, Next.js에서는 클라이언트 컴포넌트에서 데이터를 가져오려면 별도의 API 경로를 정의해야 했는데, 이는 RSC 및 RSA의 개선된 DX와 맞지 않았습니다.

이 문제를 해결하기 위한 임시방편으로, 클라이언트 컴포넌트의 [데이터 페칭을 위해 리액트 서버 액션을 사용](https://www.robinwieruch.de/next-server-actions-fetch-data/)하는 방법이 있었지만, 몇 가지 단점이 있었습니다.

결국 2024년 9월, 리액트 팀은 **리액트 서버 함수(RSF)**를 발표했습니다. RSF는 서버 컴포넌트와 클라이언트 컴포넌트에서 데이터를 가져오거나 변형하는 모든 기능을 포함하는 개념이며, RSA는 RSF의 뮤테이션 기능만을 의미하는 하위 개념이 되었습니다.

아직 베타 버전이 아닌 Next.js, TanStack Start, React Router 등 주요 리액트 (메타) 프레임워크에서 리액트 서버 함수가 정식으로 구현되지는 않았지만, 조만간 이를 지원할 가능성이 높습니다.

> 계속 읽기 : [웹 애플리케이션 101](https://www.robinwieruch.de/web-applications/)

## 리액트 폼

리액트 19는 2024년 말에 출시되었으며, 리액트 생태계에 많은 개선을 가져왔습니다. 리액트 서버 컴포넌트와 리액트 서버 함수가 이번 릴리스의 주요 초점이었지만, 리액트 폼도 크게 개선되었습니다.

가장 큰 변화는 `<form>` 요소의 `action` 속성입니다. 이를 통해 폼 제출 시 호출할 (서버) 액션을 지정할 수 있습니다. 앞서 본 예제에서는 이를 이용해 새 게시물을 생성하는 서버 요청을 수행했습니다. 다음은 클라이언트 측 검색 기능의 예제입니다.

```tsx
const Search = () => {
  const search = (formData: FormData) => {
    const query = formData.get('query');
    alert(`You searched for '${query}'`);
  };

  return (
    <form action={search}>
      <input name="query" />
      <button type="submit">Search</button>
    </form>
  );
};
```

리액트 19는 또한 `useFormStatus`, `useOptimistic`, `useActionState`(이전의 [useFormState](https://github.com/facebook/react/pull/28491))와 같은 새로운 훅을 도입하여 폼과 관련된 클라이언트 측 상호작용을 더욱 쉽게 관리할 수 있도록 했습니다.

이제 리액트에서 폼 관리는 더욱 강력하고 유연해졌지만, 여전히 React Hook Form과 같은 인기 있는 폼 라이브러리를 사용할 수도 있습니다.

> 계속 읽기 : [리액트 라이브러리 탐색하기](https://www.robinwieruch.de/react-libraries/)

## 라이브러리 vs 프레임워크

리액트 프로젝트를 시작하는 것은 (메타) 프레임워크와 서버 기반 리액트 기능의 증가로 인해 더욱 다양하고 복잡해졌습니다. 2025년에는 리액트 생태계가 발전하고 새로운 솔루션이 등장하면서 이 주제의 중요성이 더욱 커질 것입니다. 따라서 적절한 프레임워크를 선택하는 것이 점점 더 중요한 결정이 될 것입니다.

> 계속 읽기 : [리액트 프로젝트를 시작하는 방법](https://www.robinwieruch.de/react-starter/)

리액트는 처음에는 클라이언트 측 렌더링 및 라우팅을 위한 라이브러리(SPA)로 시작했지만, 이제는 CSR, SSR, SSG, ISR 등 다양한 렌더링 모드와 클라이언트 사이드, 서버 사이드, 하이브리드 라우팅을 지원하는 생태계로 발전했습니다.

> 계속 읽기 : [리액트를 라이브러리 또는 프레임워크로 학습하기](https://www.robinwieruch.de/learning-react/)

리액트를 라이브러리로 사용하면 특정 프레임워크에 얽매이지 않고 리액트 자체에 집중할 수 있습니다. 그러나 그렇게 하면 RSC 및 RSF와 같은 기능을 사용할 수 없게 되며, 이러한 기능은 번들링과 라우팅 솔루션을 제공하는 프레임워크에서만 지원됩니다.

결국 프로젝트에 맞는 적절한 선택은 요구 사항과 개인적인 선호도에 따라 달라집니다. 좋은 소식은 다양한 옵션이 있다는 것이지만, 나쁜 소식은 최신 솔루션을 따라잡기가 점점 더 어려워지고 있다는 점입니다.

## 리액트 프레임워크

**Next.js**가 가장 인기 있는 리액트 프레임워크이지만, 2025년에는 다른 프레임워크들도 주목을 받을 것입니다. 특히 리액트 생태계에서 큰 영향을 미칠 것으로 예상되는 두 가지 주요 프레임워크는 **TanStack Start**와 **React Router**입니다.

> 계속 읽기 : [Next.js의 미래](https://www.road-to-next.com/)

TanStack Start는 TanStack Router를 기반으로 새롭게 등장한 프레임워크이며, React Router는 오랫동안 사용된 라이브러리로서 한동안 중단되었던 Remix를 다시 발전시키면서 본격적인 프레임워크로 자리 잡고 있습니다.

이 두 프레임워크는 아직 리액트 서버 컴포넌트 및 서버 함수에 대한 완전한 지원이 이루어지지 않았지만, 리액트 생태계의 주요 플레이어가 될 가능성이 있으며, 향후 Next.js의 대안으로 떠오를 가능성이 큽니다.

## 풀스택 리액트

리액트 서버 컴포넌트 및 리액트 서버 함수와 같은 서버 기반 리액트 기능이 증가하면서 리액트를 활용한 풀스택 웹 애플리케이션 개발이 본격적으로 이루어지고 있습니다. 이 트렌드는 점점 더 많은 개발자들이 서버 기반 리액트 솔루션을 채택함에 따라 계속 확산될 것입니다.

그러나 RSC와 RSF를 사용하여 데이터베이스에 액세스 하는 것은 단지 시작일 뿐입니다. 풀스택 애플리케이션에는 인증, 권한 관리, 아키텍처 계층, 캐싱 등 서버 측 기능을 포함하는 완전한 백엔드 인프라가 필요하며, 또한 메시지 큐, 이메일 서비스 등과 같은 서드파티 서비스와의 연동도 중요합니다.

> 계속 읽기 : [풀스택 리액트 기술 스택](https://ykss.netlify.app/translation/2025_react_tech_stack/)

백엔드 서비스가 풀스택 애플리케이션에 필수적이지만, 원격 프로시저 호출(RPC)과 같은 리액트 서버 함수를 활용하더라도 클라이언트-서버 간 통신은 여전히 중요한 요소입니다. 2025년에는 검증 및 HTTP 상태 코드 처리를 더욱 효율적으로 할 수 있는 도구들이 등장하면서 개발자 경험이 향상될 것으로 기대됩니다.

> 계속 읽기 : [리액트에서 폼 검증하기](https://www.robinwieruch.de/react-form-validation/)

## 리액트의 "Shadcn화(Shadcnification)"

최근 몇 년간 Shadcn UI는 마치 Tailwind CSS처럼 리액트 프로젝트의 기본 UI 라이브러리로 자리 잡았습니다. Shadcn UI는 미리 스타일이 적용된 동시에 커스터마이징이 가능한 컴포넌트들을 통해 편리함과 유연성을 동시에 제공하여, 전통적인 라이브러리의 제약 없이 잘 디자인된 UI를 원하는 개발자들에게 최고의 선택이 되었습니다.

이로 인해 현대적인 리액트 스타일링 방식이 표준화되었지만, 많은 프로젝트의 UI가 비슷해지면서 새로운 UI 라이브러리에 대한 수요가 증가할 가능성이 큽니다. 조만간 익숙한 미학에 도전하는 새로운 접근 방식이 등장할 것입니다. 2025년에는 리액트 스타일링에 새로운 접근 방식이 등장할지 지켜볼 필요가 있습니다.

## 리액트와 AI

AI와 리액트의 결합은 두 가지 측면에서 중요한 의미를 가집니다. 첫째, 리액트는 가장 널리 사용되는 프런트엔드 라이브러리이기 때문에, AI 모델을 훈련하는 데 리액트 코드가 많이 사용됩니다. 따라서 AI 도구인 v0과 같은 서비스에서 자동으로 리액트 코드를 생성하여 프로젝트에 쉽게 통합할 수 있습니다.

둘째, 리액트가 서버 컴포넌트 및 서버 액션을 통해 풀스택 프레임워크로 발전하면서 AI 기반 애플리케이션을 개발하는 데 더욱 적합한 환경이 조성되고 있습니다. 또한 Vercel의 AI SDK 및 LangChain과 같은 라이브러리는 정교한 AI 솔루션을 개발하는 데 있어 리액트의 기능을 더욱 확장하고 있습니다.

## Biome

ESLint 및 Prettier를 설정하는 것은 쉽지 않으며, 이 두 도구를 함께 잘 작동하도록 조정하는 것도 까다로운 작업입니다. 그러나 이러한 도구는 웹 개발자에게 필수적입니다. [Biome](https://biomejs.dev/)(구 Rome)은 이러한 문제를 해결하고자 탄생한 빠른 올인원(all-in-one) 툴 체인 솔루션입니다.

또 다른 유망한 대안으로는 [oxc](https://oxc.rs/)가 있습니다.

Biome은 Rust 기반의 성능 최적화된 포맷터를 개발하여 [Prettier의 \$20,000 보상금을 획득](https://prettier.io/blog/2023/11/27/20k-bounty-was-claimed)했으며, 향후 개발자들 사이에서 널리 채택될 가능성이 있습니다. [Next.js GitHub 토론](https://github.com/vercel/next.js/discussions/59347)과 같은 여러 개발자 커뮤니티에서 ESLint 의존성을 줄이고 다른 린터(linter)를 허용하는 방안에 대한 논의가 진행되고 있습니다.

저는 개인적으로 Biome이 속도와 포괄적인 기능을 제공하는 최신 웹 애플리케이션을 위한 핵심 툴체인이 될 것으로 기대하고 있습니다.

## 리액트 컴파일러

리액트 개발자라면 누구나 `useCallback`, `useMemo`, `memo`와 같은 최적화 작업에 대한 번거로움을 경험했을 것입니다. 리액트는 성능 최적화를 위해 개발자가 명시적으로 최적화 작업을 수행해야 했지만, 다른 프레임워크들은 기본적으로 빠른 성능을 제공합니다.

이에 대응하여 리액트 팀은 [리액트 컴파일러](https://www.youtube.com/watch?v=lGEMwh32soc&ab_channel=ReactConf)를 개발하고 있습니다. 이 컴파일러는 함수(`useCallback`), 값(`useMemo`), 컴포넌트(`memo`)를 수동으로 메모화할 필요가 없도록 하는 것을 목표로 합니다. 리액트는 이러한 최적화를 처리하여 각 렌더링에서 재계산의 필요성을 줄여줍니다.

현재 [리액트 Compiler](https://react.dev/learn/react-compiler)는 베타 버전으로 사용해 볼 수 있습니다.

---

마지막으로, 2025년에 대한 저의 희망적인 예측이 하나 더 있습니다. 리액트 개발자들이 컴포넌트 파일의 [더 나은 네이밍 컨벤션을](https://x.com/rwieruch/status/1836434009041035635) 채택하는 것입니다. 😄

이 글에서 다룬 2025년 리액트 트렌드가 유익했기를 바랍니다. 질문이나 피드백이 있다면 언제든지 연락 주세요! 항상 도움을 드릴 준비가 되어 있습니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
