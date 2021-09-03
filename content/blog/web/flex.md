---
title: '[CSS] Flex 레이아웃 알아보기'
date: 2021-09-03 01:00:00
category: 'Web'
draft: true
---

웹 페이지를 구성할 때, 다양한 레이아웃의 방식이 존재한다. float와 inline-block도 있고, 이번에 공부해볼 flex도 그 방법 중 하나이다. 최근 개발을 하면서 flex를 통한 레이아웃을 많이 사용하기 때문에, 이것에 대해 제대로 알고 정리하면 좋을 것 같아서 이렇게 공부하면서 정리한다.

## 1. Flex는?

Flex는 Flexible Box 또는 FlexBox라고 불리고, Flex 방식 자체가 레이아웃 배치 전용 기능으로 고안된 방식이다. 그렇기 때문에 이전에 float이나 inline-block과 같은 방법으로 레이아웃을 배치했었다면, flex 방식에는 기존 방식들에서 제공하지 않는 여러가지 기능들을 제공하고 있기에 레이아웃에 특화되어 있는 방식이라고 할 수 있다. 사실 레이아웃을 주로 다루는 방식은 Flex외에도 Grid라는 방식도 존재한다. Grid 방식이 좀 더 최신의 스펙이긴하지만 그렇다고 무작정 Grid가 항상 좋은 것은 아니고, Flex로 구현하는 것이 더 편리한 경우도 많다. 게다가 Grid의 경우, IE에서는 Grid를 지원하지 않는 버전도 많다.

## 2. Flex 레이아웃 살펴보기

일단 아래와 같은 구조의 HTML 구조가 있다고 보자.

```HTML
<div class="container">
	<div class="item">helloflex</div>
	<div class="item">abc</div>
	<div class="item">helloflex</div>
</div>
```

위 구조에서 보면 `.container`는 Flex container의 역할을 하고, `.item`들은 Flex item의 역할을 한다고 볼 수 있다. Flex container는 Flex 방식의 영향을 받는 큰 틀, 범위라고 할 수 있고 container에 설정된 속성대로 Flex Item들이 배치된다고 생각할 수 있다.

## 3. Flex 속성의 종류

Flex의 속성들은 크게 컨테이너에 적용하는 속성과 아이템에 적용하는 속성으로 나뉜다.

---

출처 :

1. [이번에야말로 CSS Flex를 익혀보자](https://studiomeal.com/archives/197)
