---
title: '[CSS] Flex 레이아웃 알아보기'
date: 2021-09-03 01:00:00
category: 'Web'
draft: false
---

웹 페이지를 구성할 때, 다양한 레이아웃의 방식이 존재한다. float와 inline-block도 있고, 이번에 공부해볼 flex도 그 방법 중 하나이다. 최근 개발을 하면서 flex를 통한 레이아웃을 많이 사용하기 때문에, 이것에 대해 제대로 알고 정리하면 좋을 것 같아서 이렇게 공부하면서 정리한다.

## 1. Flex는?

Flex는 Flexible Box 또는 FlexBox라고 불리고, Flex 방식 자체가 레이아웃 배치 전용 기능으로 고안된 방식이다. 그렇기 때문에 이전에 float이나 inline-block과 같은 방법으로 레이아웃을 배치했었다면, flex 방식에는 기존 방식들에서 제공하지 않는 여러가지 기능들을 제공하고 있기에 레이아웃에 특화되어 있는 방식이라고 할 수 있다. 사실 레이아웃을 주로 다루는 방식은 Flex외에도 Grid라는 방식도 존재한다. Grid 방식이 좀 더 최신의 스펙이긴하지만 그렇다고 무작정 Grid가 항상 좋은 것은 아니고, Flex로 구현하는 것이 더 편리한 경우도 많다. 게다가 Grid의 경우, IE에서는 Grid를 지원하지 않는 버전도 많다.

## 2. Flex 레이아웃 살펴보기

일단 아래와 같은 구조의 HTML 구조가 있다고 보자.

```HTML
<div class="container">
	<div class="item">item1</div>
	<div class="item">item2</div>
	<div class="item">item3</div>
</div>
```

위 구조에서 보면 `.container`는 Flex container의 역할을 하고, `.item`들은 Flex item의 역할을 한다고 볼 수 있다. Flex container는 Flex 방식의 영향을 받는 큰 틀, 범위라고 할 수 있고 container에 설정된 속성대로 Flex Item들이 배치된다고 생각할 수 있다.

## 3. Flex 속성의 종류 - 컨테이너에 적용하는 속성

Flex의 속성들은 크게 컨테이너에 적용하는 속성과 아이템에 적용하는 속성으로 나뉜다. 먼저 컨테이너에 적용하는 속성들에 대해 알아보자.

### 1. `display:`

```css
.container {
  display: flex;
  /* display: inline-flex; */
}
```

Flex 컨테이너로 사용하기 위해서는 컨테이너에 꼭 적용해야 하는 속성이다. 이 속성만 적용해도 컨테이너 내부의 아이템들은 해당 내용물의 width만큼만 차지하게된다. 기본적으로는 flex item들은 가로 방향으로 배치된다. 그리고 height의 경우는 컨테이너의 높이만큼 조정된다. 그냥 `flex` 설정이 아닌 `inline-flex`속성도 있는데, 이것은 설정한 컨테이너가 주변 요소들과 어떻게 어우러져 배치될 지를 설정하는 것이다. `block`과 `inline-block`의 차이라고 볼 수 있다.

### 2. `flex-direction:`

```css
.container {
  flex-direction: row;
  /* flex-direction: column; */
  /* flex-direction: row-reverse; */
  /* flex-direction: column-reverse; */
}
```

위 속성은 아이템들이 배치 될 방향에 관한 것이다. `row`설정은 기본 값이고 `column`은 위에서 아래 방향으로 배치된다. `-reverse`가 붙은 것들은 반대 방향이라고 보면된다.

### 3. `flex-wrap:`

```css
.container {
  flex-wrap: nowrap;
  /* flex-wrap: wrap; */
  /* flex-wrap: wrap-reverse; */
}
```

이 속성은 컨테이너가 아이템을 한 줄에 담을 수 있는 공간이 없을 때 줄바꿈을 어떻게 할지를 결정하는 속성이다. `nowrap`(기본 값)으로 설정하면 삐져나가게 되고 `wrap`은 자연스럽게 다음 줄로 연결된다. `wrap-reverse`의 경우는 줄바꿈을 하는데 배치가 역순으로 된다.

### 4. `flex-flow:`

```css
.container {
  flex-flow: row wrap;
  /* 아래의 두 줄을 줄여 쓴 것 */
  /* flex-direction: row; */
  /* flex-wrap: wrap; */
}
```

이 속성은 `flex-direction`과 `flex-wrap`을 한번에 할 수 있는 속성이다. 둘다 설정할 경우 한줄로 간결하게 표현 가능하다.

### 5. `justify-content:`

```css
.container {
  justify-content: flex-start;
  /* justify-content: flex-end; */
  /* justify-content: center; */
  /* justify-content: space-between; */
  /* justify-content: space-around; */
  /* justify-content: space-evenly; */
}
```

메인 축 방향으로 아이템을 정렬하는 속성이다. `flex-start`가 기본값이고 가로일 땐 왼쪽 세로일 땐 위쪽으로 정렬한다. `flex-end`는 반대 끝점으로 정렬한다. `center`는 가운데로 정렬한다. 이 세개는 간단하고 `space-`로 시작하는 세가지를 살펴보자. `space-between`은 아이템들의 사이를 동일한 간격으로 정렬해준다. `space-around`는 아이템들의 둘레에 균일한 간격으로 정렬해준다.(패딩까지 균일하게 맞춰서 정렬하는 느낌이다.) 마지막으로 `space-evenly`는 아이템들의 사이와 양 끝에 균일한 간격을 만들어 준다. 하지만 이 속성은 IE와 엣지에서는 지원되지 않으니 주의해야 한다.

### 6. `align-items:`

```css
.container {
  align-items: stretch;
  /* align-items: flex-start; */
  /* align-items: flex-end; */
  /* align-items: center; */
  /* align-items: baseline; */
}
```

수직 축으로 아이템 정렬하는 속성이다. `stretch` 속성이 기본 값이고, 아이템들이 수직축 방향으로 끝까지 늘어난다. `flex-start`와 `flex-end`는 아이템을 시작점으로 정렬할지 끝점으로 정렬할 지 정하는 것이다. `center`는 당연하게 가운데로 정렬하는 것이고, `baseline`은 아이템들을 텍스트 베이스라인 기준으로 정렬한다.

### 7. `flex-wrap:wrap;` + `align-content`

```css
.container {
  flex-wrap: wrap;
  align-content: stretch;
  /* align-content: flex-start; */
  /* align-content: flex-end; */
  /* align-content: center; */
  /* align-content: space-between; */
  /* align-content: space-around; */
  /* align-content: space-evenly; */
}
```

이 속성은 `flex-wrap:wrap`이 설정된 상태에서 행이 2줄 이상 되었을 때에 수직축 방향 정렬을 결정하는 속성이다. 세부 속성은 `justify-content`나 `align-items`랑 유사하다.

## 4. Flex 속성의 종류 - 아이템에 적용하는 속성

### 1. `flex-basis`

```css
.item {
  flex-basis: auto; /* 기본값 */
  /* flex-basis: 0; */
  /* flex-basis: 50%; */
  /* flex-basis: 300px; */
  /* flex-basis: 10rem; */
  /* flex-basis: content; */
}
```

이 속성은 Flex 아이템의 기본 크기를 설정하는데 이 기본 크기는 flex-direction에 따라 너비일 수도 있고 높이일 수도 있다. 기본 값인 `auto`의 경우 해당 아이템의 width를 사용한다. 그리고 위 예시처럼 직접적으로 조정할 수 있고, `content`로 할 경우 컨텐츠의 크기에 맞게 설정된다.

### 2. `flex-grow`

```css
.item {
  flex-grow: 1;
  /* flex-grow: 0; */ /* 기본값 */
}
```

이 속성은 아이템이 `flex-basis`보다 커질 수 있는지 결정하는 속성이다. 값으로는 숫자 값을 넣을 수 있는데, 0보다 클경우 해당 아이템이 유연한 Flexible 박스가 된다. 기본값이 0이기 때문에 따로 지정하지 않을 경우 유연하게 늘어나지 않는다. 뒤의 숫자는 의미없는 것은 아니고 아이템이 여러개일 경우 비율을 의미한다.

```css
/* 1:2:1의 비율로 세팅할 경우 */
.item:nth-child(1) {
  flex-grow: 1;
}
.item:nth-child(2) {
  flex-grow: 2;
}
.item:nth-child(3) {
  flex-grow: 1;
}
```

### 3. `flex-shrink`

```css
.item {
  flex-basis: 150px;
  flex-shrink: 1; /* 기본값 */
}
```

`flex-grow`와 쌍을 이루는 속성으로, 반대로 `flex-basis`보다 작아질 수 있는지를 정한다. `flex-grow`와는 다르게 1이 기본값이라, 따로 적용하지않으면 기본적으로 `flex-basis`보다 줄어들 수 있다.

### 4. `flex`

```css
.item {
  flex: 1;
  /* flex-grow: 1; flex-shrink: 1; flex-basis: 0%; */
  flex: 1 1 auto;
  /* flex-grow: 1; flex-shrink: 1; flex-basis: auto; */
  flex: 1 500px;
  /* flex-grow: 1; flex-shrink: 1; flex-basis: 500px; */
}
```

직전의 세가지 속성을 한번에 쓸수 있는 방식이다. `flex-basis`의 경우 생략하면 0이 된다.

### 5. `align-self`

```css
.item {
  align-self: auto;
  /* align-self: stretch; */
  /* align-self: flex-start; */
  /* align-self: flex-end; */
  /* align-self: center; */
  /* align-self: baseline; */
}
```

이 속성은 `align-items`의 아이템 버전이라고 할 수 있다. 기본값은 `auto`이고, `align-items` 속성을 상속받는다. 하지만 따로 지정되어있을 경우 `align-self`가 더 우선된다.

### 6. `order`

```css
.item:nth-child(1) {
  order: 3;
} /* A */
.item:nth-child(2) {
  order: 1;
} /* B */
.item:nth-child(3) {
  order: 2;
} /* C */
```

아이템의 나열 순서를 지정하는 건데, 시각적인 순서일 뿐이고 HTML 구조가 바뀌는 것은 아니다.

### 7. `z-index`

```css
.item:nth-child(2) {
  z-index: 1;
  transform: scale(2);
}
/* z-index를 설정 안하면 0이므로, 1만 설정해도 나머지 아이템을 보다 위로 올라온다 */
```

Z축 정렬을 할 수 있는 속성이다. 숫자가 클 수록 위로 올라온다. `position`의 `z-index`와 비슷하다.

## 정리

위의 Flex 속성들만 숙지해도 레이아웃을 충분히 쉽고 간편하게 할 수 있다. 많이 써볼수록 익숙해지고 써봐야 제대로 알 수 있기 때문에, 프로젝트에 적용하며 익숙해져야겠다.

---

출처 :

1. [이번에야말로 CSS Flex를 익혀보자](https://studiomeal.com/archives/197)
