---
title: 'this 파헤치기 (call, apply, bind)'
date: 2022-3-17 16:00:00
category: 'Javascript'
draft: false
---

### 1) this의 존재 이유

this를 통해 함수를 다른 객체에서도 재사용할 수 있다.

```Javascript
function playerGlobal() {
  console.log("좋아하는 선수는 " + this.name )
}

var mount = {
  name: 'mason mount',
  display : playerGlobal
}

var kante = {
  name: 'ngolo kante',
  display : playerGlobal
}
```

### 2) apply, call, bind

일반적으로 this 값은 자동 할당되지만 call, apply, bind는 this를 제어하기 위해 사용된다.

```Javascript
function playerGlobal(item) {
  console.log("좋아하는 선수는 " + item + this.name )
}

function playerGlobal(item1, item2) {
  [item1, item2].forEach(function(el) {
    console.log('좋아하는 선수는' + el + this.name)
  },this);
}

var mount = {
  name: 'mason mount',
  display : playerGlobal
}

var kante = {
  name: 'ngolo kante',
  display : playerGlobal
}

playerGlobal.call(mount,"chelsea's ")
// "좋아하는 선수는 chelsea's mason mount"
playerGlobal.call(kante,"귀여운 ")
// "좋아하는 선수는 귀여운 ngolo kante"
playerGlobal.apply(mount, ['멋진 ', '잘생긴 '])
// "좋아하는 선수는 멋진 mason mount"
// "좋아하는 선수는 잘생긴 mason mount"

```

- call()과 apply()의 차이는 call()은 함수를 실행할 때 전달할 인수를 하나씩 전달하지만 apply()는 전달할 인수를 배열로 묶어 한번에 전달한다. 인수를 배열로 보내는 점을 제외하고는 call()과 apply()는 동일한 기능을 수행한다.

```Javascript
function playerGlobal(item) {
  console.log("좋아하는 선수는 " + item + this.name )
}

var mount = {
  name: 'mason mount'
}

var kante = {
  name: 'ngolo kante'
}

var playerGlobalBind = playerGlobal.bind(mount)
console.log(playerGlobalBind('멋진 '))
// "좋아하는 선수는 멋진 mason mount"
```

- bind()는 this 값을 어디서 사용하든 호출 객체가 바뀌지 않도록 고정한다.

### 3) 화살표 함수와 this

화살표 함수의 this는 일반적인 this처럼 함수를 호출한 객체를 할당하지 않고, 바로 상위 스코프의 this를 할당한다.

```Javascript
function playerGlobal(item1, item2) {
  [item1, item2].forEach(function(el) {
    console.log('좋아하는 선수는' + el + this.name)
  },this);
}

function playerGlobal(item1, item2) {
  [item1, item2].forEach((el) => {
    console.log('좋아하는 선수는' + el + this.name)
  });//this를 따로 인수로 넣어줄 필요가 없다.
}
```

### 4) 정리

- this는 함수를 호출하는 객체를 의미한다.

- call과 apply는 this에 할당되는 객체를 지정할 수 있다.

  - call은 인자를 하나씩 전달하고, apply는 배열로 전달한다는 차이가 있다.

- bind 메서드는 this에 할당되는 객체가 고정된 새로운 함수를 생성한다.

- 화살표 함수에서 this는 상위 스코프의 객체를 할당받는다.
