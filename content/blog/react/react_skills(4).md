---
title: '리액트 다루는 기술 정리 (4) - 컴포넌트 스타일링'
date: 2021-06-10 18:00:00
category: 'React'
draft: false
---

## 9.1 CSS

컴포넌트 스타일링의 가장 기본적인 방식이다. CSS 작성시 가장 중요한 것은 클래스를 중복되지 않도록 만드는 것이다. 클래스가 중복되지 않게하기 위해서 이름을 지을 때 특별한 규칙을 사용하거나 CSS Selector를 사용하는 방법이 있다.

### 9.1.1 이름 규칙

클래스 이름에 컴포넌트 이름을 포함시켜서 `.App-header` 와 같이 클래스를 만들수 있고, BEM 네이밍이라는 방식도 있다. 해당 클래스가 어디에서 어떤 용도로 사용되는지 명확하게 작성하는 방식이다. 예를들면, `.card_title-primary` 와 같은 형태이다.

### 9.1.2 CSS Selector

이 방법을 사용하면 CSS 클래스가 특정 클래스 내부에 있는 경우에만 스타일을 적용할 수 있다. `.App` 안에 들어 있는 `.logo` 에 스타일을 적용하기 위해서는 아래와 같이 표현한다.

```jsx
.App .logo {
	animation: App-logo-spin infinite 20s linear;
	height: 40vmin;
}
```

## 9.2 Sass

자주 사용되는 CSS 전처리기 중 하나로 확장된 CSS 문법을 사용해서 CSS 코드를 더욱 쉽게 작성할 수 있도록 해준다. 스타일 코드의 재활용성을 높여 주고 코드의 가독성을 높여 유지 보수를 더욱 쉽게 해준다. Sass에서는 두 가지 확장자 .scss와 .sass를 지원하는데 처음에는 .sass만 지원했으나 현재는 .scss도 지원한다. 두 확장자의 문법은 꽤나 다르다. 가장 큰 차이점은 중괄호({})와 세미콜론(;)이다. 비교적 .scss 확장자가 기존 css와 비슷하다고 볼 수 있다. Sass를 사용하려면 node-sass라는 라이브러리를 설치해야하고, 이 라이브러리는 Sass를 CSS로 변환해주는 역할을 한다.

```sass
// .sass
$font-stack: Helvetica, sans-serif
$primary-color: #333

body
	font: 100% $font-stack
	color: $primary-color
```

```scss
// .scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```

여기서 `@mixin` 기능이 나오는데 믹스인은 재사용되는 스타일 블록을 함수처럼 사용할 수 있도록 하는 기능이다. 또 Scss파일에서 다른 Scss파일을 불러올 때는 `@import` 구문을 사용한다.

```scss
@mixin square($size) {
  $calculated: 32px * $size;
  width: $calculated;
  height: $calculated;
}

----------------------------

@import './styles/utils.scss';
```

Scss의 장점은 라이브러리를 쉽게 불러와 사용할 수 있는 것이다. 라이브러리를 사용할 때는 상대경로를 이용하여 `@import '../../../node_modules/library/styles';` 와 같이 할 수도 있지만 그럼 경로가 복잡하기 때문에 `@import '~library/styles';` 처럼 사용하면 더 편하게 할 수 있다. 유용한 라이브러리로는 반응형 디자인을 쉽게 만들어 주는 `include-media` 와 색상 팔레트인 `open-color` 가 있다. 아래와 같이 사용 가능하다. 적용한 결과는 아래와 같다.

```scss
background: $oc-gray-2; //open-color를 통한 색상 가져오기
@include media('<768px') {
  //반응형 디자인을 만들수 있도록 화면 크기 지정
  background: $oc-gray-9;
}
```

![결과](https://ifh.cc/g/FhevpR.jpg)

## 9.3 CSS Module

스타일 작성 시 CSS 클래스가 다른 CSS 클래스의 이름과 절대 충돌되지 않도록 파일마다 고유한 이름을 자동으로 생성해주는 옵션이다. `.module.css` 확장자로 파일을 저장하기만 하면 CSS Module이 적용된다. CSS Module을 사용하면 클래스 이름을 지을 때 고유성에 대해 고민하지 않아도 된다. 해당 클래스는 스타일을 직접 불러온 컴포넌트 내부에서만 작동한다. 특정 클래스가 웹 페이지에서 전역적으로 사용될 때는 `:global` 을 붙이면 된다.

```scss
.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
}

.inverted {
  color: black;
  background: white;
  border: 1px solid black;
}

:global .something {
  font-weight: 800;
  color: aqua;
}
```

여러 클래스를 동시에 적용할 때는 템플릿 리터럴을 사용하여 아래와 같이 표현 가능하다.

```jsx
<div className={`${styles.wrapper} ${styles.inverted}`} >
```

Scss를 사용할 때도 확장자만 `.module.scss` 와 같이 바꿔주면 사용 가능하다.

## 9.4 styled-components

스타일을 자바스크립트에 내장시키는 방식으로 스타일 작성과 동시에 스타일이 적용된 컴포넌트를 만들어준다. `npm i styled-components` 와 같은 방식으로 설치한다. styled-component를 사용하면 자바스크립트 안에 스타일까지 작성할 수 있기 때문에 CSS나 Scss 파일을 만들지 않아도 된다. 그리고 스타일에서 props를 조회하여 사용할 수 있다. `background: ${props => props.color || 'blue'};` 이 부분이 그렇다. styled-components를 사용할 때 반응형 디자은을 위해서는 일반 CSS와 같이 media 쿼리를 사용하면 된다. 하지만 이런 작업을 반복하기에는 귀찮기 때문에 styled-components 매뉴얼에서 제공하는 유틸 함수를 따라서 적용할 수 있다.

```jsx
const sizes = {
  desktop: 1024,
  tablet: 768,
}

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)};
    }
  `

  return acc
}, {})

const Box = styled.div`
  background: ${props => props.color || 'blue'};
  padding: 1rem;
  display: flex;
  width: 1024px;
  margin: 0 auto;
  ${media.desktop`width: 768px;`}
  ${media.tablet`width: 100%;`};
`

const Button = styled.button`
  background: white;
  color: black;
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  ${props =>
    props.inverted &&
    css`
      background: none;
      border: 2px solid white;
      color: white;
      &:hover {
        background: white;
        color: black;
      }
    `};
  & + button {
    margin-left: 1rem;
  }
`

function StyledComponent() {
  return (
    <Box color="black">
      <Button>Hi</Button>
      <Button inverted={true}>테두리만</Button>
    </Box>
  )
}
```

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
