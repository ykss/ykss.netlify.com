---
title: '자바스크립트의 상속과 캡슐화'
date: 2020-4-28 11:00:00
category: 'Javascript'
draft: false
---

![자바스크립트](./images/image-20200409103446799.png)

> 해당 포스트는 ES6이전의 자바스크립트를 기준으로 작성하였습니다.



#### 1. 상속

클래스를 기반으로 하는 상속은 **ES6**이후에서만 지원하고, 자바스크립트의 객체 프로토타입 체인을 통하여 상속을 구현해 낼 수 있다. 여기서 상속의 구현에는 두가지 방법이 있다. 첫번째는 클래스 기반의 전통적인 상속 방식을 모방하는 것이고, 두번째는 클래스 개념 없이 객체의 프로토타입으로 구현하는 것이다. 



##### 1) 프로토타입을 이용한 상속

```javascript
function create_object(o){
	function F() {}
	F.prototype = o;
	return new F();
}
```

위 코드는 더글라스 크락포드가 자바스크립트 객체를 상속하는 방법으로 권장한 코드이다. 이 코드를 이해하면 자바스크립트의 상속 개념을 이해한 것과 다름 없다. `create_object()`함수는 `o`라는 객체 인자를 받는 함수이고 함수 내부의 코드를 보면 `F`라는 이름의 빈 함수 객체를 만든다. 그리고 `F`함수의 프로토타입 객체에 인자로 들어온 `o`라는 객체를 연결한다.  그리고 `F`를 생성자로 하는 새로운 객체를 만들어 반환한다. 이렇게 반환된 객체는 부모 프로퍼티에 접근 할 수 있고 자신의 프로퍼티를 만드는 것 또한 가능하다. 위의 `create_object()`함수는 매번 정의할 필요 없이 `Object.create()` 함수로 사용할 수 있다. 

```javascript
var player = {
    name : "mount",
    getName : function() {
        return this.name;
    },
    setName : function(name) {
        this.name = name;
    }
};

function create_object(o){
	function F() {}
	F.prototype = o;
	return new F();
}

var mount = create_object(player);

mount.setName("mount");
console.log(mount.getName()); // (출력 값) mount
```



##### 2) 클래스 기반의 상속

사실 클래스 기반의 상속도 프로토타입의 방식과 크게 다르지 않다. 프로토타입 기반에서는 객체 리터럴로 생성했던 것을 클래스 방식에서는 클래스 역할을 하는 함수로 상속을 구현한다.

```javascript
function Player(name){
	this.name = name;
};

Player.prototype.setName = function(value){
    this.name = value;
};

Player.prototype.getName = function(){
    return this.name;
};

function Midfielder(name) { 
}

var mount = new Player("mount");
Midfielder.prototype = mount;
var kante = new Midfielder("kante");
kante.setName("kante");
console.log(kante.getName());
```

위 코드에서는 `Midfielder`함수를 만들어서 해당 함수의 프로토타입이 `Player`생성자 함수의 인스턴스인 `mount`를 참조하도록 만들었다. 그리고 `Midfielder`생성자 함수로 만든 `kante`라는 인스턴스는 `mount`를 부모 객체로 참조하게 된다. 그럼 `mount`객체는 `Person`생성자로 만들어졌기 때문에 `Person`의 프로토타입 객체에 접근 가능하고, `mount`를 부모 프로토타입 객체로 취급하는 `kante` 또한 `Person.prototype`에 접근이 가능하다. 이렇게 프로토 타입 체인이 형성된 것이다. 하지만 위 코드에는 문제가 있는데, `kante`인스턴스 생성 시에 `Person`생성자는 호출되지 않는다. 처음 생성할 때 `new Midfielder("kante")`와 같이 인자를 전달했지만,  이것을 받아서 반영하는 부분은 존재하지 않는다. `Midfielder`생성자 함수는 비어있는 함수 이기 때문이다.  `kante`라는 객체는 결국 빈 객체가 되고 `kante.setName()`메서드 실행 이후에야 프로퍼티가 생성된다. 이것을 해결하기 위해 `Midfielder`코드를 수정해야 한다.

```javascript
function Midfielder(name) {
	Player.apply(this, arguments);
}
```

위 코드처럼 수정하면 `this`를 통해 `Midfielder` 생성자 함수로 생성된 빈 객체가 전달되고 `Player()` 생성자 함수를 실행시킨다. 이런 방식으로 자식 클래스의 인스턴스에 대해 부모 클래스의 생성자를 실행 시킬 수 있다. 현재 경우는 부모와 자식 클래스 인스턴스가 독립적이지 못하다. 





---



### 출처

> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)](https://book.naver.com/bookdb/book_detail.nhn?bid=7400243)
> 2. [인프런 'Javascipt 핵심 개념 알아보기 - JS Flow'](https://www.inflearn.com/course/핵심개념-javascript-flow/)


