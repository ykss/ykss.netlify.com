---
title: 'CSS Position & Display 정리 '
date: 2021-02-26 18:00:00
category: 'development'
draft: false
---

웹 개발을 하며 CSS를 사용하여 어느 정도 내가 원하는 대로 배치를 해야하는 상황이 비일비재 한데, CSS의 개념을 정확히 이해하지 못해서 헤멜 떄가 많았다. CSS를 통해 기본적으로 표시하고 배치하는 속성인 display와 position 속성에 대해 알아보자.

## 박스모델

CSS는 기본적으로 박스들이 여러개 쌓여있는 것 처럼 생각해야 한다.
![박스모델](https://mdn.mozillademos.org/files/9443/box-model.png)
박스에는 padding, border, margin이 있다.

- padding : 요소를 감싸고 있는 border내의 부분이다.
- border : 요소를 둘러싸고 있는 경계선 부분이다.
- margin : border 밖의 공간이다.

위와 같은 기본적인 속성외에도 width, background-color, text-shadow등 여러가지 속성들이 존재한다.

## display

display는 요소의 표시 형식을 결정하는 것이다. 내부 디스플레이 유형과 외부 디스플레이 유형으로 나뉘고, 외부 디스플레이 유형은 박스 자체가 어떻게 배치되는 방법에 대해서 나타내며, 내부 디스플레이 유형은 박스 내부의 요소가 어떻게 배치되는 방법을 나타낸다. 크게 가장 일반적인 유형은 외부 디스플레이 유형인 block과 inline이다.

박스가 block으로 정의 되면 아래와 같은 특징을 가진다.

- 한 줄 전체를 차지한다. 상위 콘테이너의 너비만큼 차지하는 것이다.
- 새 줄로 행갈이를 한다.
- width와 height 속성은 존중된다.
- padding과 margin등의 속성들로 인해 다른 요소들이 박스로 부터 밀려난다.
- 기본적으로 `<div>`와 `<p>`, `<h1>`과 같은 태그들은 block 형식을 가진다.

박스의 display 유형이 inline일 경우 다음과 같은 특징을 지닌다.

- 새 줄로 행갈이를 하지 않는다.
- weight와 height 속성은 적용되지 않는다.
- padding, margin등으로 인해 다른 inline 박스들이 멀어지지 않는다.
- `<a>`와 `<span>`,`<strong>`과 같은 태그들이 대표적으로 inline형식을 가지는 태그이다.

inline과 block의 중간 지대를 가지는 inline-block 형식도 있다. 이것은 새 줄로 넘어가는 행갈이는 원치 않지만, weight와 height는 존중하기 원할 때 사용한다.

## position

position은 문서 상의 요소를 배치하는 방법을 지정하는 것이다. top, right, bottom, left 속성이 요소를 배치할 최종 위치를 결정한다. position의 속성 값을 여러가지가 존재하는데 하나씩 알아보자

- static : 요소를 일반적인 문서 흐름에 따라 배치한다. top, right, bottom, left, z-index 속성이 아무 영향을 주지 않는다. 아무것도 지정하지 않을 경우 기본 값이다.
- relative : 일반적인 흐름으로 배치 한 후, 자기 자신을 기준으로 top, right 등 값에 따라 위치를 조정한다. 페이지 레이아웃에서 요소가 차지하는 공간은 static과 같다. 만약 z-index의 값이 auto가 아니면 새로운 쌓임 맥락을 생성한다.
- fixed : 일반적인 흐름에 따라 배치한 후에 뷰포트의 초기 컨테이닝 블록을 기준으로 삼아 배치한다. 단, 요소의 조상 중 하나가 transform, perspective, filter 속성 중 어느 하나라도 none이 아니면 뷰 포트 대신 해당 요소를 컨테이닝 블록으로 삼는다. 이 방식은 항상 새로운 쌓임 맥락을 생성한다.
- sticky : 일반적인 흐름에 따라 배치한 후에 가장 가까운 조상을 컨테이닝 블록으로 기준삼아 top, right 등의 값에 따라 위치를 조정한다.

> 참고

1. [MDN 도큐멘트](https://developer.mozilla.org/ko/docs/Learn/Getting_started_with_the_web/CSS_basics)
