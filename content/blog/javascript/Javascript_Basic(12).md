---
title: '자바스크립트의 OOP'
date: 2020-4-24 16:00:00
category: 'Javascript'
draft: false
---

![자바스크립트](./images/image-20200409103446799.png)

> 해당 포스트는 ES6이전의 자바스크립트를 기준으로 작성하였습니다.



자바스크립트는 자바스크립트에 존재하는 여러가지 특성을 이용하여 객체지향 언어의 특성을 구현해 낼 수 있다. ES6 이후에는 `Class`개념과 상속 개념이 자바스크립트에도 적용되었지만 이전에는 클래스, 생성자, 메서드, 상속, 캡슐화 등이 어떻게 구현되었는지 알아보자.



#### 1. 클래스 기반 언어 vs 프로토타입 기반 언어

그전에 객체지향을 구현함에 있어 클래스 기반 언어와 프로토타입 기반의 언어를 비교해보자. 클래스 기반 언어는 형태와 기능들로 클래스를 정의하고, 생성자로 인스턴스를 만들어 사용한다. Java나 c++같은 경우가 해당된다. 이 경우 모든 인스턴스는 클래스에 정의된 대로 생성되고 런타임에는 변경이 불가하다. 반면 프로토타입 기반의 언어는 객체의 자료구조와 메서드 등을 동적으로 변경이 가능하다. 하지만 정확성이나 안정성 기반으로 보면 클래스 기반의 언어들이 더 안정적이다. 하지만 프로토타입 기반의 언어는 동적으로 자유롭게 객체의 구조와 동작방식을 바꿀 수 있는 것이 장점이라고 할 수 있다.



#### 2. 클래스, 생성자, 메서드

자바스크립트도 ES6 이후 부터는 `class`키워드를 제공한다. 하지만 `class`키워드를 사용하지 않고도 자바스크립트는 강력한 객체 지향 프로그래밍 능력을 가지고 있다.  프로토타입 기반 프로그래밍으로도 **Class-free**한 스타일로 프로토타입 체이닝과 클로저 등을 활용하여 객체지향 언어의 상속과 캡슐화 등의 개념 구현이 가능하다. 그렇기 때문에 클래스와 생성자, 메서드도 동일하게 구현 가능하다. ES6에서 `class` 키워드를 제공한 것은 클래스가 익숙한 개발자들을 위한 도구를 추가한 것일 뿐이고, 사실상 클래스도 함수이고 여전히 프로토타입 기반인 것은 달라지지 않는다. 다만 클래스와 생성자 함수가 동일하게 동작하지는 않고 `class`가 좀 더 엄격하다. `class`에 대한 내용은 추후에 ES6에 대한 내용을 따로 다루도록 하겠다.

```javascript
function Player(name) {
	this.name = name;
}

Player.prototype.getName = function(){
    return this.name;
}

Player.prototype.setName = function(name){
    this.name = name;
}
var mount = new Player("mount");
var kante = new Player("kante");
console.log(mount.getName());
console.log(kante.getName());
```

위 코드에서는 `Player` 함수 객체에 직접 메서드를 추가하는 것이 아니고 `prototype`프로퍼티에 `getName()`과 `setName()` 함수를 정의하였다. 이렇게 하면 `Player`함수를 생성자 함수로 하여 객체를 생성할 때 각 객체들이 각자 따로 함수 객체를 생성하지 않고 `setName()`,`getName()`함수를 프로토타입 체이닝을 통해 공유 할  수있다. 이렇게 클래스안의 메서드를 정의하려고 할 때는 프로토타입 객체에 정의하고,  `new`를 통해 객체를 생성하는 것이 좋다. **더글라스 크락포드**가 권장하는 메서드 정의 방법을 예시와 같은 함수로 추천한다.

```javascript
Function.prototype.method = function(name, func){
	if(!this.prototype[name]){
		this.prototype[name] = func;
	}
}
```

위 함수를 이용하면 아까의 코드는 다음과 같이 변경할 수 있다.

```javascript
Function.prototype.method = function(name,func){
	this.prototype[name] = func;
}

function Player(name){
    this.name = name;
}

Player.method("setName",function(name){
    this.name = name;
});

Player.method("getName",function(){
    return this.name;
});

var mount = new Player("mount");
var kante = new Player("kante");
console.log(mount.getName());
console.log(kante.getName());
```



---



### 출처

> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)](https://book.naver.com/bookdb/book_detail.nhn?bid=7400243)
> 2. [인프런 'Javascipt 핵심 개념 알아보기 - JS Flow'](https://www.inflearn.com/course/핵심개념-javascript-flow/)




