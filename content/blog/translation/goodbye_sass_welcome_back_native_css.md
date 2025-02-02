---
title: '(번역) 잘 가 SASS 👋, 다시 만나 반가워 네이티브 CSS'
date: 2025-02-04 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [Goodbye SASS 👋, welcome back native CSS](https://medium.com/@karstenbiedermann/goodbye-sass-welcome-back-native-css-b3beb096d2b4)

![thumbnail](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*xrYKieEfN_JLAweDrQMEVA.png)

Sass는 로컬에 설치되는 강력한 전처리기로 자리 잡으며 지난 10년 동안 제 프로젝트의 핵심을 이루었습니다. 이는 확장 가능하고 안정적인 CSS 패키지를 효율적으로 구성할 수 있게 해 주었습니다. 지금도 Sass는 굉장히 강력한 도구라고 생각합니다. 하지만 2024년에 접어들면서 CSS가 급속도로 발전하고 있다는 것은 부인할 수 없는 사실입니다. 한때 Sass에만 존재하던 기능들이 이제는 CSS에 기본적으로 통합되었으며, 변수 뿐만 아니라 특히 주목할 최신 기능인 CSS 중첩이 그 예입니다.

## 변수(Variables)

```css
:root {
  --button-padding: 10px 20px;
  --button-bg-color: #007bff;
  --button-text-color: #ffffff;
  --button-border-radius: 8px;
}

.button {
  padding: var(--button-padding);
  background-color: var(--button-bg-color);
  color: var(--button-text-color);
  border-radius: var(--button-border-radius);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}
```

변수 정의는 오랫동안 SCSS의 독특한 강점으로 여겨졌습니다. 이는 많은 속성을 중앙에서 관리할 수 있도록 해주는 기능으로, CSS에서는 오랜 시간 아쉬운 부분이었습니다. 그러나 이제는 CSS에서도 Sass와 유사한 방식으로 변수를 정의할 수 있습니다. 중요한 차이점은 Sass 변수는 전처리기 컨텍스트 내에서만 존재하지만, CSS 변수는 브라우저에서 사용될 수 있으며 자바스크립트를 통해 동적으로 덮어쓸 수도 있다는 점입니다.

## CSS 중첩(Nesting)

```css
.blog {
  position: relative;
  padding: 1rem;
  background: var(--neutral-100);

  .blog-item {
    border: 1px solid var(--neutral-200);

    & span {
      font-size: 1rem;
    }
  }
}
```

하나의 요소 안에서 다른 요소의 스타일 규칙을 정의할 수 있는 기능은 CSS 작성을 크게 단순화합니다. 하위 요소나 가상 선택자를 위해 동일한 선택자를 반복적으로 사용하는 대신, 중첩을 통해 이를 상위 선택자 내에서 그룹화할 수 있습니다. 이 기술은 코드베이스를 명확하고 계층적으로 구조화하며, 더 효율적으로 만들어줍니다.

CSS 중첩과 중첩 선택자는 각각 84%, 86% 이상의 [브라우저 지원](https://caniuse.com/?search=css%20nesting)을 받고 있어 점점 더 접근성이 높아지고 있습니다.

## :is() 의사 클래스

```css
:is(selector1, selector2, selector3) {
  /* styles */
}
```

`:is` 의사 클래스는 선택자 개념을 혁신적으로 바꾸며, 여러 선택자 리스트를 받아 이들 중 하나라도 일치하는 모든 요소를 스타일링 할 수 있도록 합니다. 이는 DOM에서 요소를 선택하고 스타일링 하는 과정을 크게 단순화합니다.

긴 선택자 리스트 대신 :is()를 사용하면 가독성을 높이면서 긴 선택자 작성도 피할 수 있습니다.

## :has() 의사 클래스

```css
.hero:has(.hero-button) {
  background-color: var(--accent-50);
}
```

CSS 의사 클래스 `:has()`는 하위 요소를 기준으로 요소를 선택하는 강력한 방법을 제공합니다. 이는 조건부 스타일 적용과 유사합니다.

## 컨테이너 쿼리

```css
.component {
  --theme: dark;
  container-name: fancy;
}

@container fancy style(--theme: dark) {
  .fancy {
    /* dark styles. */
  }
}
```

```css
.parent-container {
  container-type: inline-size;

  .headline {
    font-size: 2rem;
  }

  @container (width >= 720px) {
    .headline {
      font-size: 2.5rem;
    }
  }
}
```

컨테이너 쿼리는 CSS3 이후 웹 디자인에서 가장 중요한 혁신으로 평가받고 있습니다. 이는 반응형 디자인의 개념을 확장하여 요소가 컨테이너의 크기에 따라 조정될 수 있도록 합니다. 이러한 기술은 요소의 디자인이 컨텍스트에 따라 동적으로 변경될 수 있도록 하여 더욱 유연하고 적응력 있는 디자인을 가능하게 합니다.

컨테이너 fancy가 변수 --theme: dark를 가지고 있다면, 위의 CSS를 추가합니다.

## 캐스케이드 레이어(Cascade layers)

```css
@layer utilities {
  b .button {
    padding: 0.5rem;
  }

  .button--lg {
    padding: 0.8rem;
  }
}
```

캐스케이드 레이어를 사용하면 클래스나 ID 등을 중첩할 필요 없이 자체 계층(레이어)을 할당해 더 높은 우선순위(specificity)를 확보할 수 있습니다. `@layer` 규칙과 계층화된 `@import`를 사용해 리셋 및 기본값과 같은 낮은 우선순위 스타일에서 테마, 프레임워크, 디자인 시스템을 거쳐 컴포넌트, 유틸리티, 오버라이드와 같은 높은 우선순위 스타일까지 자체 캐스케이드 레이어를 구축할 수 있습니다. 이를 통해 더 나은 제어가 가능합니다.

## Sass의 미래

그렇다면 Sass는 이제 필요 없어졌을까요? 전혀 그렇지 않습니다. 픽셀을 rem으로 변환하는 함수와 믹스인(Mixins)은 Sass의 대체 불가능한 장점으로 남아있습니다. 하지만 저는 대부분의 프로젝트에서 Sass를 사용하지 않기로 결정했습니다. 대신 Sublime Editor에서 미리 정의된 코드 블록과 패키지를 사용해 워크플로를 크게 개선했습니다.

## Sass 잘 가?

2024년 시점에서 보면, Sass를 설치하고 사용하고 컴파일하는 과정의 번거로움을 감수할 만한 이점이 더 이상 없다고 생각합니다. 최신 CSS의 확장성과 사용 친화성은 추가 도구 없이도 충분히 작업을 수행할 수 있게 해줍니다.

저의 [Themex 프로젝트](https://app.themexproject.com)는 새로운 CSS 기능의 조합이 얼마나 강력할 수 있는지를 보여줍니다.

CSS의 발전과 함께 크고 작은 프로젝트를 직접적이고 간단하게 구현할 수 있기를 기대합니다.

**Sass, 안녕히 가세요. 고마웠습니다!**

![goodbye sass, and thank you!](https://miro.medium.com/v2/resize:fit:1000/format:webp/1*zE69ta024X0m4DJM4jRXlQ.gif)

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
