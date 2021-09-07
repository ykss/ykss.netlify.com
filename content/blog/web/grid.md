---
title: '[CSS] Grid 레이아웃 알아보기'
date: 2021-09-07 01:00:00
category: 'Web'
draft: false
---

이전 포스트에서 Flex 방식에 대해서 알아보았는데, Flex 방식과 같이 레이아웃을 위해 많이 쓰이는 Grid 방식에 대해서 알아보자.

## 1. Grid는?

Grid 방식은 레이아웃의 끝판왕이라고 불리는데, 그렇다면 Flex와 어떤 차이가 있을까? Flex 방식은 한 방향으로 레이아웃하는 1차원 방식이라고 할 수 있고, Grid 방식은 두 방향 레이아웃을 배치할 수 있는 2차원 방식이라는 점에서 차이가 있다. 그렇기 때문에 Grid는 Flex보다 좀 더 복합적인 레이아웃 표현이 가능하다. Grid 방식의 경우 IE에서 지원하지 않는 문제가 있지만, IE 10과 11에서는 지원할 수 있는 방법이 있고, 최근에서는 IE가 공식적으로 지원 종료를 앞두고 있기 때문에 크게 문제가 되지 않는다고 생각한다.

## 2. Grid 레이아웃 살펴보기

일단 아래와 같은 구조의 HTML 구조가 있다고 보자.

```HTML
<div class="container">
	<div class="item">Item A</div>
	<div class="item">Item B</div>
	<div class="item">Item C</div>
	<div class="item">Item D</div>
	<div class="item">Item E</div>
	<div class="item">Item F</div>
	<div class="item">Item G</div>
	<div class="item">Item H</div>
	<div class="item">Item I</div>
</div>
```

위 구조에서 보면 `.container`는 Grid container의 역할을 하고, `.item`들은 Grid item의 역할을 한다고 볼 수 있다. Grid container는 Grid 방식의 영향을 받는 큰 틀, 범위라고 할 수 있고 container에 설정된 속성대로 Grid Item들이 배치된다고 생각할 수 있다.

## 3. Grid 속성의 종류 - 컨테이너에 적용하는 속성

Flex의 속성들은 크게 컨테이너에 적용하는 속성과 아이템에 적용하는 속성으로 나뉜다. 먼저 컨테이너에 적용하는 속성들에 대해 알아보자.

### 1. `display:`

```css
.container {
  display: grid;
  /* display: inline-grid; */
}
```

Grid 컨테이너로 사용하기 위해서는 컨테이너에 꼭 적용해야 하는 속성이다. Grid의 전체 영역을 나타내며 이 컨테이너 내부의 요소들이 Grid 규칙에 영향을 받아 정렬된다. `grid`와 `inline-grid`의 차이는 `block`과 `inline-block`과 동일한 차이라고 생각하면 된다.

### 2. 그리드 형태 정의 : `grid-template-rows`, `grid-template-columns`

```css
.container {
  grid-template-columns: 200px 200px 500px;
  /* grid-template-columns: 1fr 1fr 1fr */
  /* grid-template-columns: repeat(3, 1fr) */
  /* grid-template-columns: 200px 1fr */
  /* grid-template-columns: 100px 200px auto */

  grid-template-rows: 200px 200px 500px;
  /* grid-template-rows: 1fr 1fr 1fr */
  /* grid-template-rows: repeat(3, 1fr) */
  /* grid-template-rows: 200px 1fr */
  /* grid-template-rows: 100px 200px auto */
}
```

`grid-template-rows`는 행의 배치, `grid-template-columns`는 열의 배치를 결정한다. 컨테이너에 Grid 트랙의 크기들을 지정해줄 수 있다. 여러가지 단위를 혼용하는 것도 가능하다.

### 3. `repeat` 함수

```css
.container {
  grid-template-columns: repeat(5, 1fr);
  /* grid-template-columns: 1fr 1fr 1fr 1fr 1fr */
}
```

위 함수는 반복되는 값을 자동으로 처리할 수 있는 함수이다. `repeat(반복횟수, 반복값)`과 같이 사용할 수 있다.

### 4. `minmax` 함수

```css
.container {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, minmax(100px, auto));
}
```

최솟값과 최댓값을 지정할 수 있다. `minmax(100px,auto)`는 내용이 적어도 최소한 100px 크기는 유지하고, 내용이 많다면 자동으로 늘어날 수 있도록 하는 것이다.

### 5. `auto-fill`, `auto-fit`

```css
.container {
  grid-template-columns: repeat(auto-fill, minmax(20%, auto));
}
```

column 개수를 미리 정하지 않고 설정된 너비가 허용되는 한 최대한 셀을 채우는 방식이다. `auto-fill`로 위 예시코드 처럼 적용하면 셀이 4개일 때는 80&까지만 채우고 나머지 공간은 남게된다. 하지만 `auto-fit`을 사용하면 남는 공간까지 채운다. 이런 차이가 있다.

### 6. `row-gap`, `column-gap`, `gap` 간격 만들기

```css
.container {
  row-gap: 10px;
  /* row의 간격을 10px로 */
  column-gap: 20px;
  /* column의 간격을 20px로 */
}

.container {
  gap: 10px 20px;
  /* row-gap: 10px; column-gap: 20px; */
}

.container {
  gap: 20px;
  /* row-gap: 20px; column-gap: 20px; */
}
```

그리드 셀 사이의 간격을 조정해주는 속성이다.

### 7. `grid-auto-columns`, `grid-auto-rows` 그리드 형태 자동 정의

```css
.container {
  grid-auto-rows: minmax(100px, auto);
}
```

이 속성은 row나 column의 개수를 미리 알 수 없을 경우에 해결책으로 쓰이는 속성이다. 위처럼 사용하면 굳이 횟수를 지정해서 반복할 필요 없이 알아서 배치된다.

### 8. 각 셀의 영역지정

```CSS
.item:nth-child(1) {
	grid-column: 1 / 3;
	grid-row: 1 / 2;
}

.item:nth-child(1) {
	grid-column-start: 1;
	grid-column-end: 3;
	grid-row-start: 1;
	grid-row-end: 2;
}

/* grid-column-start
grid-column-end
grid-column
grid-row-start
grid-row-end
grid-row
-ms-grid-row
-ms-grid-column
-ms-grid-row-span
-ms-grid-column-span */
```

Grid 아이템에 적용하는 속성으로 각 셀의 영역을 지정한다.

```CSS
.item:nth-child(1) {
	/* 1번 라인에서 2칸 */
	grid-column: 1 / span 2;
	/* 1번 라인에서 3칸 */
	grid-row: 1 / span 3;
}
```

시작이나 끝 번호 지정 외에도 몇개의 셀을 차지할지 위처럼 정해줄 수 있다.

### 9. 영역 이름으로 그리드 정의 `grid-template-areas`

```css
.container {
  grid-template-areas:
    'header header header'
    '   a    main    b   '
    '   .     .      .   '
    'footer footer footer';
}

.header {
  grid-area: header;
}
.sidebar-a {
  grid-area: a;
}
.main-content {
  grid-area: main;
}
.sidebar-b {
  grid-area: b;
}
.footer {
  grid-area: footer;
}
/* 이름 값에 따옴표가 없는 것에 주의하세요 */
```

각 영역에 이름을 붙이고 그 이름으로 배치할 수 있다. 각 셀마다 공백을 넣어서 구분할 수 있고, 빈칸은 마침표나 "none"을 사용하면 된다. 그리고 `grid-area` 속성을 통해 이름을 지정해 줄 수 있다.

### 10. 자동 배치 `grid-auto-flow`

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(25%, auto));
  grid-template-rows: repeat(5, minmax(50px, auto));
  grid-auto-flow: dense;
  /* row, column, dense, row dense, column dense */
}
item:nth-child(2) {
  grid-column: auto / span 3;
}
item:nth-child(5) {
  grid-column: auto / span 3;
}
item:nth-child(7) {
  grid-column: auto / span 2;
}
```

아이템이 자동 배치되는 흐름을 결정하는 속성이다. `dense`는 빈 셀을 모두 채우는 알고리즘이라고 할 수 있다. `row`나 `column`이 붙으면 기준에 따라 우선으로 채우게된다.

### 11. 세로 방향 정렬 `align-items`

```css
.container {
  align-items: stretch;
  /* align-items: start; */
  /* align-items: center; */
  /* align-items: end; */
}
```

아이템들을 세로(column축) 방향으로 정렬하는 부분이고, 컨테이너에 적용되는 속성이다.

### 12. 가로 방향 정렬 `justify-items`

```css
.container {
  justify-items: stretch;
  /* justify-items: start; */
  /* justify-items: center; */
  /* justify-items: end; */
}
```

아이템들을 가로(row축) 방향으로 정렬하는 부분이고, 컨테이너에 적용되는 속성이다.

### 13. `place-items`

```css
.container {
  place-items: center start;
}
```

`align-items`와 `justify-items`를 함께 쓸 수 있는 속성이다. 앞에 순서대로 적용된다. 즉 세로 가로 정렬 순이다.

### 14. 아이템 그룹 세로 정렬 `align-content`

```css
.container {
  align-content: stretch;
  /* align-content: start; */
  /* align-content: center; */
  /* align-content: end; */
  /* align-content: space-between; */
  /* align-content: space-around; */
  /* align-content: space-evenly; */
}
```

모든 Grid 아이템들 높이의 합이 컨테이너 높이보다 작을 때 통째로 정렬할 때 사용한다.

### 15. 아이템 그룹 가로 정렬 `justify-content`

```css
.container {
  justify-content: stretch;
  /* justify-content: start; */
  /* justify-content: center; */
  /* justify-content: end; */
  /* justify-content: space-between; */
  /* justify-content: space-around; */
  /* justify-content: space-evenly; */
}
```

Grid 아이템들의 너비를 모두 합한 값이 Grid 컨테이너의 너비보다 작을 때 Grid 아이템들을 통쨰로 정렬한다.

### 16. `place-content`

```css
.container {
  place-content: space-between center;
}
```

`align-content`와 `justify-content`를 함께 적용할 수 있는 속성이다.

### 17. 개별 아이템 세로/가로 정렬 `align-self`/ `justify-self`

```css
.item {
  align-self: stretch;
  /* align-self: start; */
  /* align-self: center; */
  /* align-self: end; */
}
.item {
  justify-self: stretch;
  /* justify-self: start; */
  /* justify-self: center; */
  /* justify-self: end; */
}
```

그룹이 아닌 아이템의 세로/가로 축 방향을 정렬한다. 개별 아이템에 적용 가능 하다.

### 18. `place-self`

`align-self`와 `justify-self`를 함께 쓸 수 있는 속성이다.

### 19. `order`

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

이렇게 살펴보면 확실히 뭔가 Grid가 다양하고 세부적인 기능은 더 많이 제공한다는 생각은 들지만 뭔가 쓰려면 조금 Grid 구조에 대해 숙지한 후에 자유롭게 쓰면 유용할 것 같다는 생각이 들었다. 아직은 Flex 구성이 좀 더 익숙하게 느껴진다. Flex와 Grid는 배타적인 방식은 아니기 때문에 둘을 혼용하여 자유롭게 쓰기 위해 노력해야겠다.

---

출처 :

1. [이번에야말로 CSS Grid를 익혀보자](https://studiomeal.com/archives/533)
