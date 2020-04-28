---
title: '자바스크립트의 상속과 캡슐화'
date: 2020-4-28 23:00:00
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

위 코드처럼 수정하면 `this`를 통해 `Midfielder` 생성자 함수로 생성된 빈 객체가 전달되고 `Player()` 생성자 함수를 실행시킨다. 이런 방식으로 자식 클래스의 인스턴스에 대해 부모 클래스의 생성자를 실행 시킬 수 있다. 현재 경우는 부모와 자식 클래스 인스턴스가 독립적이지 못하다. 현재 자식 클래스의 prototype이 부모 클래스의 인스턴스를 참조하고 있기 때문에 자식 클래스의 prototype에 메서드를 추가하려고 하면 문제가 발생 할 수 있다. 부모 클래스의 인스턴스와 자식 클래스의 인스턴스는 독립되어야 한다. 그렇게 하기 위해서는 두 클래스의 프로토타입 사이에 중개역할을 하는 것이 필요하다.

```javascript
function Player(name){
	this.name = name;
};

Function.prototype.method = function(name, func) {
    this.prototype[name] = func;
}

Player.method("setName",function(value){
    this.name = value;
});

Player.method("getName",function(){
    return this.name;
});

function Midfielder(name) { 
}

function F() {};
F.prototype = Player.prototype;
Midfielder.prototype = new F();
Midfielder.prototype.constructor = Midfielder;
Midfielder.super = Player.prototype;

var mount = new Midfielder();
mount.setName("mount");
console.log(mount.getName());
```

이 방식은 프로토타입을 통한 상속 구현과 매우 유사하다. 빈 함수 객체 `F()`를 쓰기 때문이다. 빈 함수 `F()`를 사용하며 `Player`의 인스턴스와 `Midfielder`의 인스턴스가 독립적이게 만들었다. 





#### 2. 캡슐화

캡슐화는 OOP에서 매우 중요한 부분이다. **캡슐화**는 관련된 여러 정보를 하나의 틀에 담는 것이다. 관련된 변수와 메서드 등을 클래스라는 틀안에 담는다고 생각하면 된다. 여기서 이러한 정보들을 공개하느냐 아니면 비공개로 유지하느냐에 따라 **정보 은닉**의 개념이 적용되는지에 여부가 달려있다. 다른 언어에서도 `public`이나 `private` 키워드를 통해 어떤 키워드로 변수를 생성하느냐에 따라 해당 변수를 노출시킬지 말지 결정한다. 자바스크립트의 경우 이러한 키워드가 존재하지는 않지만 다른 방식을 통해 **정보 은닉**을 실현할 수 있다.

```javascript
var Player = function(arg) {
    var name = arg ? arg : "example";
    
    this.getName = function() {
        return name;
    }
    this.setName = function() {
        name = arg;
    }
};

var mount = new Player();
console.log(mount.getName()); // (출력 값) example
mount.setName("mount"); 
console.log(mount.getName()); // (출력 값) mount
console.log(mount.name); // (출력 값) undefined
```

위 코드를 보면 `name`은 private 멤버로 선언했고, `getName()`과 `setName()` 함수는 public 메서드로 선언되었다. `this` 객체의 프로퍼티로 선언하면 외부에서 `new`를 통해 생성하여 접근 가능하지만 `var`로 선언된 멤버는 외부에서 접근이 불가능하다. 하지만 public한 메서드가 **클로저**역할을 하면서 `getName()`이나 `setName()`에서는 `name` 변수에 접근할 수 있게 된다. 이게 자바스크립트의 기본적인 **정보 은닉**이다.

```javascript
var Player = function(arg) {
    var name = arg ? arg : "example";
    
    return {
    	getName : function() {
        	return name
    	},
        setName : function() {
        name = arg;
    	}
    }; 
}

var mount = new Player();
console.log(mount.getName()); // (출력 값) example
```

위 코드의 방식은 `Player()` 함수를 호출하면서 객체를 리턴받는다. 리턴받는 객체에는 `Player()`함수의 private 멤버에 접근 할 수 있는 메서드들이 담겨있다. 반환 받는 객체의 메서드를 호출함을 통해서 private 멤버에 접근할 수 있다. 실제로 자주 쓰는 구조이고, 한 가지 주의할 점이 있다. 접근하는 private 멤버가 객체나 배열일 경우 얕은 복사로 참조만 반환 하기 때문에 쉽게 변경 될 수 있다. 그렇기 때문에 객체가 아닌 함수를 반환하는 방식도 있다. 

```javascript
var Player = function(arg) {
    var name = arg ? arg : "example";
    
    var Func = function () {}
    Func.prototype = {
        getName : function() {
        	return name
    	},
        setName : function() {
       	 	name = arg;
    	}
    }
    
    return Func;
}();

var mount = new Player();
console.log(mount.getName()); // (출력 값) example
```

위와 같이 즉시 실행 함수를 사용하면 반환되는 `Func()` 함수가 클로저가 되고, `name` 프로퍼티는 자유 변수가 된다. 그렇기 때문에 직접적으로 `name`변수에는 접근할 수 없다. (자바의 게터, 세터 느낌이라고 이해하면 될 거 같다.) 위에 나타난 정보은닉을 위한 여러가지 패턴을 잘 숙지하고 유용하게 이용할 수 있어야 한다.







---







### 출처

> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)


