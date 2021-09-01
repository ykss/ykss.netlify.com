---
title: '[CSS] 미디어 쿼리 활용하기'
date: 2021-09-01 01:00:00
category: 'Web'
draft: false
---

반응형 웹을 구현하기 위해서 주로 사용되는게 미디어 쿼리이다. 미디어 쿼리는 화면(screen)이나 티비(TV) 같은 미디어 타입과 하나의 표현식으로 구성된다. width, height 등 미디어 특성을 활용해서 그 특성에 따라 다른 스타일을 적용해 줄 수 있도록 하는 것이 그 포인트이다. 이것을 무려 CSS로 구현이 가능하다. 물론 자바스크립트로도 당연히 가능하지만 이번에는 CSS 방식을 살펴보자.

## 1. 미디어 쿼리를 사용하는 두 가지 방법

### 1.1 `<link>` 태그와 사용하기

HTML 내에서 `<link>` 태그를 사용하여 특성이 조건에 맞을 때 특정 CSS 파일을 불러와 적용할 수 있도록 할 수 있다.

`<link rel="stylesheet" media="screen and (max-width: 768px)" href="style.css" />`

위와 같은 코드를 통해 미디어 타입이 스크린이고 화면 최대 너비가 768px인 상황 일 때, `style.css`의 스타일이 적용되도록 한다는 것이다. 하지만 보통은 이러한 HTML내의 방식보다, 주로 스타일 시트내에서 사용하는 방식이 많이 사용된다.

### 1.2 스타일 시트 내에서 사용하기

스타일 시트 내에서 `@media`를 사용하면 미디어 쿼리를 이용할 수 있다.

```css
@media screen and (max-width: 768px) {
  body {
    background-color: lightgreen;
  }
}
```

위와 같이 `@media` 뒤에 조건을 입력하고 그 조건에 맞을 경우 `{}`안의 스타일이 적용되게 된다.

## 2. 주로 사용되는 방식

보통 미디어를 지정하고 조건을 쓰는데, 만약 미디어 타입을 생략 할 경우에는 자동으로 `all`이 적용되어 모든 미디어 타입에 적용된다. 보통은 웹사이트 개발 시에는 screen이나 all이 사용되곤 한다.

미디어 특성에서는 크기 조건을 지정하기 위해 `max-width`와 `min-width`가 주로 사용된다. 이 외에도 `height`나 `color`등이 사용되기도 한다. 그리고 세로 모드인지 가로 모드인지를 파악하기 위해서 `orientation` 속성을 검사해서 다른 속성을 적용할 때도 쓸 수 있다. 기본적인 데스크탑은 주로 가로(landscape) 방향을 가정하지만, 태블릿이나 휴대폰에서는 세로(portrait) 모드인 경우, 해당 스타일이 제대로 적용될 수 있지 않기 때문에 해당 모드에 따라서 다른 스타일을 적용해 줄 수도 있다. 조건의 경우, and 등을 통해 추가적인 조건을 붙일 수도 있다.

반응형 웹을 만들 때, 해당 웹 서비스가 모바일 우선인지, 데스크탑 우선인지를 생각하고 만약 모바일로 우선할 경우와 데스크탑 우선인지에 따라 다르게 적용한다.

```css
/* 모바일에 적용될 스타일을 먼저 작성합니다. */
@media screen and (min-width: 769px) {
  /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */
}

/* --- 구분선 --- */

/* 데스크탑에서 사용될 스타일을 먼저 작성합니다. */
@media screen and (max-width: 768px) {
  /* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */
}
```

## 3. 주의사항

미디어 쿼리는 대부분 최신 브라우저에서 잘 적용되고, IE의 경우에만 9버전 이후 부터 지원된다.

미디어 쿼리를 정확히 적용하려면 viewport의 지정이 필수적이라고 할 수 있다. 주로 모바일을 위한 기능인데, 이미지 사이즈 확대 도는 축소 등이 가능하게끔 지원해준다. 아래와 같이 쓰인다.

```css
<meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1, user-scalable=yes,initial-scale=1.0" />
```

미디어 쿼리 외에도 아래 코드처럼 grid 방식으로 display하여 반응형을 구현할 수도 있지만, 정확히는 그 방식은 뷰포트의 너비를 보는 것이 아니다. 그래서 어떤 방식으로 쓰는게 좋을지는 컨텐츠에 따라 개발 상황에 따라 다른 부분이기 때문에 잘 판단해서 적용해보면 되겠다.

```css
.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}
```

---

출처 :

1. [반응형 웹을 위한 미디어 쿼리 사용법](https://offbyone.tistory.com/121)
2. [미디어쿼리 입문](https://developer.mozilla.org/ko/docs/Learn/CSS/CSS_layout/Media_queries)
