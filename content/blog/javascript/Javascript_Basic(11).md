---
title: '자바스크립트의 클로저'
date: 2020-4-22 14:00:00
category: 'Javascript'
draft: false
---

![자바스크립트](./images/image-20200409103446799.png)





#### 1. 클로저의 개념

다음 코드를 통해 클로저의 개념에 대해 살펴보자.

```javascript
function outsideFunc(){
	var a = 10;
	var insideFunc = function (){
		console.log(a);
	}
	return insideFunc;
}

var inside = outerFunc();
inside(); // (출력 값) 10
```

여기서 `insideFunc()`는 `outsideFunc()`의 실행이 끝나고 나서 실행된다.  그 말은 곧 `outsideFunc()`실행컨텍스트가 종료되는 것이다. `outsideFunc()`실행 컨텍스트가 끝난 이후에도  `outsideFunc()`의 변수 객체를 참조할 수 있을까? 답은 참조할 수 있다! 왜냐하면 `outsideFunc()` 실행 컨텍스트는 종료되었지만, 변수 객체는 여전이 남아있기 때문이다. 이러한 개념이 **클로저**이다.  **클로저**는 **이미 생명 주기가 끝난 외부 함수의 변수를 참조하는 함수**라고 표현 할 수 있다.위 예제에서는 `insideFunc()`가 클로저가 되는 것이다. 그리고 위 코드에서 `outsideFunc()`에 있는 변수 `a`는 **자유 변수**가 된다. 클로저는 자바스크립트만의 개념은 아니고 보통 함수형 언어에서 많이 쓰이는 개념이다. 



#### 2. 클로저의 활용

클로저는 **성능**과 **자원**면에서 약간의 손해를 초래할 수 있다. 그럼 어째서 클로저를 이용하고 어떻게 활용할 수 있을까?  클로저를 제대로 활용하려면 많은 개발 경험이 쌓여야 한다. 일단 대표적인 예시들을 살펴보자.



##### 1) 특정 함수에 사용자 정의 객체 메서드 연결

```javascript
function SayHello(func) {
	this.greeting = "Hello!";
}

SayHello.prototype.call = function(func){
	func ? func(this.greeting) : this.func(this.greeting);
}

var userFunc = function(greeting) {
	console.log(greeting);
}

var objHello = new SayHello();
objHello.func = userFunc;
objHello.call();
```

위 코드를 보면 `greeting`변수가 선언되어 있는 `SayHello()` 생성자 함수가 정의되어 있고, `call()` 함수가 프로토타입 객체의 메서드로 선언되어 있다. `SayHello()`를 통해 함수 변수 `objHello`를 생성한다. 이 과정에서 미리 프로토타입 객체에 `call()`메서드가 선언되어 있기 때문에 `objHello`에도 `call()`메서드를 참조할 수 있다. `objHello`의 `func`프로퍼티에 `userFunc` 함수를 링크하고 `call()`메서드를 통해 `func`프로퍼티로 참조되는 함수를 호출한다. 이런식으로 사용자가 정의한 객체 메서드를 특정함수에 연결하는데 클로저가 활용 될 수 있다.



##### 2) 함수의 캡슐화

변수가 전역 변수로 선언되면 의도치 않게 변수의 내용이 변경 될 수도 있고, 같은 이름의 변수가 선언되는 등 여러가지 문제가 될 수 있다. 이러한 상황에서 클로저를 활용하면 이 문제를 해결할 수 있다. 

```javascript
var joinString = (fucntion(){
	var arr = [ 'Best ','',
    	' club is ','','.' ];

	return (function(sport,club){
       arr[1] = sport;
       arr[3] = club;
        
       return arr.join('');
    });
})();

var str = joinString('football','chelsea');
console.log(str);
```

위 코드를 보면 즉시 실행 함수를 사용하는데 여기서 `return`으로 반환되는 함수가 바로 **클로저**이다. 여기서 리턴된 **클로저**인 익명 함수는 이미 실행 완료된 즉시 실행 함수 내에 위치한 `arr`을 참조할 수 있다.



##### 3) setTimeout()에 지정되는 함수의 사용자 정의

`setTimeout()`함수는 브라우저에서 제공하는 함수로 첫번째 인자로 넘기는 함수를 두번째 인자로 넘기는 시간만큼 후에 실행할 수 있다. 하지만 첫번째 인자로 넘기는 함수에 파라미터를 넣어줄 수는 없다. 이러한 상황에서 **클로저**를 통해 해결이 가능하다.

```javascript
function callLater(obj, a, b) {
    return (function(){
        obj["sum"] = a+b;
        	console.log(obj["sum"]);
    });
}

var sumObj = {
    sum : 0
}

var func = callLater(sumObj, 1, 2);
setTimeout(func, 500);
```

위 코드를 보면 `setTimeout()`함수에 바로 `callLater()`함수를 넣지 않고, `callLater()`에 원하는 파라미터를 전달한 것을 `func`함수에 반환 받아서 그 `func` 함수를 `setTimeout()`의 인자로 넣어서 호출한다. 여기서 반환 받은 함수가 **클로저**이다. 



#### 3. 클로저 사용 시 주의사항



##### 1)  클로저의 프로퍼티 값이 변할 수 있음을 기억하자!

클로저의 프로퍼티 값이 쓰기 가능하기 때문에 그 프로퍼티 값이 호출에 의해 항상 변할 수 있다. 아래 예시를 살펴보자.

```javascript
function outerFunc(arg){
    var num = arg;
    return function(x) {
        num += x;
        console.log('num: ' + num);
    }
}
var test = outerFunc(40);
test(5); // (출력 값) num: 45
test(-10); // (출력 값) num: 35
```

위 코드의 결과를 보면 `test()`함수를 실행할 때마다  `num`의 값은 계속 변화한다. 이 부분을 주의해야 한다.



##### 2) 하나의 클로저가 여러 함수 객체의 스코프 체인에 들어가 있을 수 있다.

```javascript
function func(){
    var x = 1;
    return {
        func1 : function(){console.log(++x);},
        func2 : function(){console.log(-x);}
    };
};

var test = func();
test.func1(); //(출력 값) 2
test.func2(); //(출력 값) -2
```

하나의 클로저가 여러 함수 객체의 스코프체인에 들어가 있을 수 있고, 두 함수 모두 자유변수 `x`를 참조하기 때문에, 호출할 때마다 `x` 값이 변경될 수 있음을 유의해야한다.



##### 3) 루프안의 클로저를 유의하자!

```javascript
function countSecond(howMany){
    for (var i = 1; i <= howMany; i++){
        setTimeout(function () {
            console.log(i);
        }, i*1000);
    }
};
countSecond(3); // (출력 값) 4 4 4
```

위 소스의 코딩 의도는 `1`,` 2`, `3`을 1초 간격으로 출력하는 것이다. 하지만 위 코드를 실행해보면 `4`가 1초간격으로 세번 출력되고 종료된다. 왜 의도와 다른 결과가 출력 될까? 이것은 **클로저**와 관련이 있다. 여기서 `setTimeout()`함수는 자유 변수 `i`를 참조하는데, 이 `setTimeout()`함수가 실행되는 시점은 `countSecond()`함수가 모두 종료되고 난 후에 실행되는 것이다. `setTimeout()`내의 익명 함수가 클로저가 되어서 변수 `i`를 참조하는 것이다. 이미 `countSecond()`함수가 종료되었을 때는 `i`가 4로 증가하여 더이상 루프조건을 만족 시키지 못하고 종료된 상태이기 때문에 `setTimeout()`으로 실행되는 익명함수는 모두 `4`라는 값을 가지고 있는 변수 `i`를 참조하여 1초 간격으로 4를 출력하는 것이다. 그럼 원래 의도대로 결과 값을 얻기 위해서는 어떻게 해야할까?

```javascript
function countSecond(howMany){
    for(var i = 1; i<=howMany; i++){
        (function (currentI){
            setTimeout(function(){
                console.log(currentI);
            }, currentI * 1000);
        }(i));
    }
};
countSecond(3); // (출력 값) 1 2 3 
```

위와 같이 코드를 수정하면 의도한대로 값이 출력된다. 즉시 실행 함수를 통해 루프 `i`값을 `currentI`변수에 저장하여 `currentI`를 출력하는 방법이다. 위처럼 즉시 실행함수를 사용하면 `setTimeout()`함수가 자유 변수 `i`가 아닌 `currentI`를 참조하기 때문에 의도한 결과를 얻을 수 있다.  루프안에서 클로저를 사용할 때는 주의하도록 하자.



---



### 출처

> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)](https://book.naver.com/bookdb/book_detail.nhn?bid=7400243)
> 2. [인프런 'Javascipt 핵심 개념 알아보기 - JS Flow'](https://www.inflearn.com/course/핵심개념-javascript-flow/)





