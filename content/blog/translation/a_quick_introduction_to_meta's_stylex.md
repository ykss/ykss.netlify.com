---
title: '(번역) Meta의 StyleX에 대한 간략한 소개'
date: 2024-01-02 01:00:00
category: 'Translation'
draft: true
---

> 원문 : [A Quick Introduction to Meta's Stylex](https://refine.dev/blog/meta-stylex/)

## 도입

[Stylex](https://stylexjs.com/docs/learn/)는 최근(2023년 12월 기준) Meta에서 개발한 오픈소스 CSS-in-JS 솔루션입니다. 이는 리액트/자바스크립트 컴포넌트 내에서 아토믹 인라인 CSS 스타일을 작성할 수 있게 하며, 전역적으로 접근 가능한 CSS 변수를 통해 정적 CSS의 강력한 기능을 제공합니다. StyleX는 각 스타일에 대해 고유한 클래스 식별자를 생성하고, 의사 클래스(pseudo-class)와 같은 충돌 기여 요소의 사용을 최소화하여 충돌 없는 CSS를 지원합니다. 이러한 부분 덕분에 StyleX는 Emotion과 같은 다른 CSS-in-JS 솔루션보다 훨씬 더 신뢰성있고 안정적이며 확장성이 뛰어납니다.

StyleX 스타일은 라이브러리 전반에서 재사용 및 확장이 가능하도록 설계되었기 때문에 특히 더 강력합니다. 또한 Flow를 위한 컴파일 타임 프롭 타이핑 기능이 탑재되어 있으며 타입스크립트에 대한 탁월한 지원으로, 정적으로 입력된 코드베이스에서 쉽게 채택할 수 있습니다.

StyleX를 사용하면 리액트 컴포넌트에서 코로케이션 스타일을 정의하고, 렌더링 로직을 조작하고, 그에 따라 마크업에서 인라인으로 사용할 수 있습니다. 컴포넌트 외부에 전역 변수를 선언하고, 내보낸 다음 특정 컴포넌트 내부에서 가져와서 사용할 수 있습니다. 전역 변수는 동적 레이아웃, 그리드 시스템, 색상 팔레트, 타이포그래피, 간격, 크기 조정, 반응형 디자인 및 테마에 유용합니다.

이 입문 글에서는 이미 설정된 Next.js 애플리케이션에서 `stylex.create` 및 `stylex.props` API를 사용하여 StyleX 스타일을 정의하고 사용하는 방법을 다룹니다. 그리고 Stylex로 충돌 없는 인라인 CSS를 작성할 때의 몇 가지 특이점을 이해하기 위해 노력했습니다. 이 과정에서 간단한 스타일 선언, import한 Stylex 변수를 사용한 스타일 선언, 조건부 스타일링, 미디어 쿼리를 사용한 반응형 컴포넌트를 구현하는 코드 예시를 소개할 예정입니다. 또한 `stylex.defineVars` API로 변수를 생성하고 컴포넌트 내에서 사용하는 방법도 살펴보겠습니다.

Facebook에서 제공하는 [이 예제 Next.js 앱](https://github.com/facebook/stylex/tree/main/apps/nextjs-example)을 기본으로 사용하고, 이를 바탕으로 자체 페이지와 컴포넌트를 구축했습니다. 필요한 경우 자유롭게 복제하여 로컬에서 사용하고, 커스터마이즈 해보세요.

## StyleX 및 타입스크립트를 사용한 CSS-in-JS

StyleX에는 `create` 메서드와 `props` 메서드라는 두 가지 핵심 API가 있습니다. `stylex.create()`를 사용하면 자바스크립트 객체로 CSS 스타일을 선언할 수 있습니다. 객체에는 CSS 클래스를 나타내는 속성 식별자와 CSS 규칙을 나타내는 값이 있어야 합니다. `stylex.props` 메서드를 사용하면 인라인 마크업 내에서 선언된 스타일에 액세스할 수 있습니다.

`stylex.defineVars` API는 실제 CSS 변수를 나타내며 앱 전체 리액트 컴포넌트에서 액세스할 수 있는 전역 StyleX 변수의 선언을 용이하게 해줍니다. 덕분에 동적 레이아웃, 그리드 시스템, 색상 팔레트, 간격, 크기 조정, 테마 등에 StyleX 변수를 사용할 수 있습니다.

다음 섹션 및 하위 섹션에서는 `stylex.create`, `stylex.props`, `stylex.defineVars` 메서드를 사용하여 StyleX 스타일을 Next.js 페이지와 컴포넌트에 사용하는 코드 예시를 살펴보겠습니다.

다루는 각 주제에 대해 StyleX와 관련된 변경 사항을 분석한 다음, 이를 이해하려고 노력할 것입니다.

대부분의 변경 사항은 `app/page.tsx` 파일과 `<Card />` 컴포넌트에 있습니다. 먼저 `<Home />` 컴포넌트가 있는 `page.tsx` 파일에 집중하여 StyleX 스타일을 만들고 적용하는 방법을 살펴보겠습니다.

## StyleX로 Next.js 앱 스타일링하기

`app/page.tsx` 파일에는 `<Home />` 컴포넌트가 포함되어 있으며, StyleX 스타일로 자체 마크업을 추가하면 다음과 같이 보입니다.

<details>
  <summary>Home 컴포넌트 보기</summary>

  ```tsx
import stylex from "@stylexjs/stylex";
import Card from "./components/Card";
import { colors } from "./stylex/cssVars.stylex";
import { globalTokens as $ } from "./stylex/globalTokens.stylex";

const MEDIA_MOBILE = "@media (max-width: 700px)" as const;

const style = stylex.create({
  main: {
    margin: "auto",
    fontFamily: $.fontMono,
  },
  jumbotron: {
    border: "1px transparent solid",
    padding: "16px 24px",
    backgroundColor: "#e9ecef",
  },
  jtBody: {
    padding: "8px 0",
  },
  jtHeading: {
    margin: "12px 0",
    fontFamily: $.fontSans,
    fontSize: "54px",
    fontWeight: "bold",
    color: "#4d4d4d",
  },
  jtText: {
    margin: "24px 0",
    fontSize: "24px",
  },
  jtFooter: {
    margin: "24px 0",
  },
  jtButton: {
    padding: "12px 24px",
    fontFamily: $.fontMono,
    fontSize: "20px",
    fontWeight: "bold",
    color: colors.white,
    border: "1px solid transparent",
    borderRadius: "4px",
    backgroundColor: colors.primary,
    textDecoration: {
      default: "none",
      ":hover": "underline",
    },
  },
  deck: {
    display: "flex",
    flexDirection: {
      default: "row",
      [MEDIA_MOBILE]: "column",
    },
    justifyContent: {
      default: "space-betweem",
      [MEDIA_MOBILE]: "center",
    },
    alignItems: {
      default: "center",
      [MEDIA_MOBILE]: "space-between",
    },
    margin: "24px auto",
  },
  cardHeading: {
    margin: "16px 0",
    fontFamily: $.fontMono,
    fontSize: "32px",
  },
  cardText: {
    margin: "16px 0",
    fontFamily: $.fontSans,
    fontSize: "16px",
  },
  featuredBg: {
    backgroundColor: "orange",
  },
});

export default function Home() {
  return (
    <main {...stylex.props(style.main)}>
      <div {...stylex.props(style.jumbotron)}>
        <div {...stylex.props(style.jtBody)}>
          <h1 {...stylex.props(style.jtHeading)}>Hello, world!</h1>
          <p {...stylex.props(style.jtText)}>
            This is a template for a simple marketing or informational website. It includes a large callout called a
            jumbotron and three supporting pieces of content. Use it as a starting point to create something more
            unique.
          </p>
        </div>
        <div {...stylex.props(style.jtFooter)}>
          <a {...stylex.props(style.jtButton)} href="#" role="button">
            Learn more &raquo;
          </a>
        </div>
      </div>

      <div {...stylex.props(style.deck)}>
        <Card featuredBg={{ backgroundColor: "orange" }}>
          <h2 {...stylex.props(style.cardHeading)}>Heading</h2>
          <p {...stylex.props(style.cardText)}>
            Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
            condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.
            Donec sed odio dui.
          </p>
          <p>
            <a href="#" role="button">
              View details &raquo;
            </a>
          </p>
        </Card>
        <Card>
          <h2 {...stylex.props(style.cardHeading)}>Heading</h2>
          <p {...stylex.props(style.cardText)}>
            Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
            condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.
            Donec sed odio dui.
          </p>
          <p>
            <a href="#" role="button">
              View details &raquo;
            </a>
          </p>
        </Card>
        <Card>
          <h2 {...stylex.props(style.cardHeading)}>Heading</h2>
          <p {...stylex.props(style.cardText)}>
            Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
            condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.
            Donec sed odio dui.
          </p>
          <p>
            <a href="#" role="button">
              View details &raquo;
            </a>
          </p>
        </Card>
      </div>
    </main>
  );
}
```
</details>
<br/>

보시다시피 스타일링은 전적으로 StyleX에서 처리합니다. 이제 브라우저의 페이지는 다음과 같이 표시됩니다.

![](https://refine.ams3.cdn.digitaloceanspaces.com/blog/2023-12-13-stylex-post/1.png)

아래 섹션에서 자세히 살펴보겠습니다.

### `stylex.create`로 스타일 만들기

`stylex.create` 메서드를 사용하여 StyleX를 선언했습니다.

<details>
  <summary> <code>stylex.create</code> 메서드 보기</summary>

  ```tsx
  const style = stylex.create({
  main: {
    margin: "auto",
    fontFamily: $.fontMono,
  },
  jumbotron: {
    border: "1px transparent solid",
    padding: "16px 24px",
    backgroundColor: "#e9ecef",
  },
  jtBody: {
    padding: "8px 0",
  },
  jtHeading: {
    margin: "12px 0",
    fontFamily: $.fontSans,
    fontSize: "54px",
    fontWeight: "bold",
    color: "#4d4d4d",
  },
  jtText: {
    margin: "24px 0",
    fontSize: "24px",
  },
  jtFooter: {
    margin: "24px 0",
  },
  jtButton: {
    padding: "12px 24px",
    fontFamily: $.fontMono,
    fontSize: "20px",
    fontWeight: "bold",
    color: colors.white,
    border: "1px solid transparent",
    borderRadius: "4px",
    backgroundColor: colors.primary,
    textDecoration: {
      default: "none",
      ":hover": "underline",
    },
  },
  deck: {
    display: "flex",
    flexDirection: {
      default: "row",
      [MEDIA_MOBILE]: "column",
    },
    justifyContent: {
      default: "space-betweem",
      [MEDIA_MOBILE]: "center",
    },
    alignItems: {
      default: "center",
      [MEDIA_MOBILE]: "space-between",
    },
    margin: "24px auto",
  },
  cardHeading: {
    margin: "16px 0",
    fontFamily: $.fontMono,
    fontSize: "32px",
  },
  cardText: {
    margin: "16px 0",
    fontFamily: $.fontSans,
    fontSize: "16px",
  },
  featuredBg: {
    backgroundColor: "orange",
  },
});
  ```
</details>

CSS 클래스를 나타내는 속성 구분자와 실제 CSS 규칙을 구성하는 값이 있는 스타일 객체를 받습니다. 내부적으로 StyleX는 각 StyleX 스타일 객체 속성에 대해 `x`로 시작하는 식별자를 가진 CSS 클래스를 생성합니다. 스타일이 `stylex.props`가 있는 JSX 요소에 적용되면 이 생성된 CSS 클래스가 요소의 `className` 프로퍼티에 추가됩니다.

**스타일 선언 - 정적 분석이 가능해야 함**

StyleX 스타일 선언에는 몇 가지 제약 조건이 있습니다. 스타일 객체 프로퍼티에 대한 제약 조건은 아래와 같습니다.

- 스타일 객체 프로퍼티는 추가 중첩이 요소의 CSS 프로퍼티에 속하므로 한 단계 깊이를 초과해서는 안 됩니다.
- 스타일 객체 프로퍼티는 StyleX가 아닌 함수를 호출할 수 없습니다.
- 스타일 객체 프로퍼티는 StyleX가 아닌 모듈에서 값을 가져올 수 없습니다.

일반적으로, StyleX 스타일 선언은 정적 분석이 가능해야 합니다. 더 자세한 목록은 [여기](https://stylexjs.com/docs/learn/styling-ui/defining-styles/#constraints)를 참조하세요.

**import한 스타일 변수가 있는 StyleX 스타일**

StyleX 변수를 가져와서 사용하는 것이 일반적입니다.

```tsx
{
    fontFamily: $.fontMono,
}
```

동적 레이아웃, 반응형 디자인, 간격, 타이포그래피, 색상 및 테마에 대한 변형 생성에 전역 StyleX 변수를 사용하는 것이 중요합니다.

**StyleX 조건부 스타일 정의**

조건부 스타일 정의를 적용하여 CSS 의사 클래스를 할당할 수 있습니다.

```tsx
textDecoration: {
  default: "none",
  ':hover': "underline",
},
```

**StyleX 미디어 쿼리**

또한 조건부로 정의된 미디어 쿼리를 통해 반응형 디자인을 유지할 수 있습니다.

```tsx
flexDirection: {
  default: "row",
  [MEDIA_MOBILE]: "column",
},
justifyContent: {
  default: "space-betweem",
  [MEDIA_MOBILE]: "center",
},
alignItems: {
  default: "center",
  [MEDIA_MOBILE]: "space-between",
},
```

위의 스타일 선언을 통해 JSX 요소에 적용할 로컬 아토믹 스타일을 정의했습니다.

### `stylex.props` - StyleX에서 스타일 적용하기

위에서 선언한 스타일을 JSX 마크업 내부에 인라인 및 원자 단위로 적용합니다.

```tsx
return (
  <main {...stylex.props(style.main)}>
    <div {...stylex.props(style.jumbotron)}>
      <div {...stylex.props(style.jtBody)}>
        <h1 {...stylex.props(style.jtHeading)}>Hello, world!</h1>
        <p {...stylex.props(style.jtText)}>
          This is a template for a simple marketing or informational website. It includes a large callout called a
          jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.
        </p>
      </div>
      <div {...stylex.props(style.jtFooter)}>
        <a {...stylex.props(style.jtButton)} href="#" role="button">
          Learn more &raquo;
        </a>
      </div>
    </div>

    <div {...stylex.props(style.deck)}>
      <Card featuredBg={{ backgroundColor: "orange" }}>
        <h2 {...stylex.props(style.cardHeading)}>Heading</h2>
        <p {...stylex.props(style.cardText)}>
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
          condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.
          Donec sed odio dui.
        </p>
        <p>
          <a href="#" role="button">
            View details &raquo;
          </a>
        </p>
      </Card>
      <Card>
        <h2 {...stylex.props(style.cardHeading)}>Heading</h2>
        <p {...stylex.props(style.cardText)}>
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
          condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.
          Donec sed odio dui.
        </p>
        <p>
          <a href="#" role="button">
            View details &raquo;
          </a>
        </p>
      </Card>
      <Card>
        <h2 {...stylex.props(style.cardHeading)}>Heading</h2>
        <p {...stylex.props(style.cardText)}>
          Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris
          condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod.
          Donec sed odio dui.
        </p>
        <p>
          <a href="#" role="button">
            View details &raquo;
          </a>
        </p>
      </Card>
    </div>
  </main>
);
```

적용된 각 스타일에 대해 `stylex.props` 메서드를 호출하고 스타일 객체 프로퍼티를 인수로 전달하고 있음을 주목하세요. 내부적으로 StyleX는 `x` 접두사를 사용하여 생성한 CSS 클래스 구분자를 가져와 JSX 요소의 `className` 프로퍼티에 추가합니다.

여러 스타일을 `stylex.props()`에 전달하면 모두 단일 클래스로 병합됩니다. 병합에서 특정성이 문제가 되는 경우, 마지막 스타일이 가장 높은 순위를 차지합니다. [이 문서 섹션](https://stylexjs.com/docs/learn/styling-ui/using-styles/#merging-styles)에서 자세히 알아보세요.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
