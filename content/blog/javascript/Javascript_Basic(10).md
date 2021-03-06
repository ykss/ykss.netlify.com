---
title: '실행 컨텍스트와 스코프체인'
date: 2020-4-21 14:00:00
category: 'Javascript'
draft: false
---

![자바스크립트](./images/image-20200409103446799.png)



**실행컨텍스트**란 **'실행 가능한 코드를 형상화하고 구분하는 추상적인 개념'**이라고 ECMAScript에서 설명하고 있다. 바꿔말하면 '실행 가능한 자바스크립트 코드 블록이 실행되는 환경'이다. 여기서 말하는 **실행 가능한 코드 블록**은 대부분 **함수**라고 볼 수 있다. 실행컨텍스트가 형성되는 경우는 **전역 코드**, **eval()** 함수가 실행되는 코드, **함수 안의 코드**가 실행되는 경우이다. 대부분은 함수를 통해 실행 컨텍스트가 만들어진다.  현재 실행되는 컨텍스트에서 이 컨텍스트와 **관련 없는 실행 코드가 실행**되면 **새로운 컨텍스트가 생성**되어 스택에 들어가고 제어권도 그 컨텍스트로 이동한다. 아래 예제를 보자.

```javascript
console.log("전역 코드 실행!");

function context1(){
    console.log("context1 실행!");
}

function context2(){
    context1();
    console.log("context2 실행!");
}

context2();
```

위에서는 먼저 `전역 코드 실행!`이 출력된다. 그리고 나서 `context2()`를 호출하고 새로운 컨텍스트가 생성된다. 그리고 새로운 컨텍스트에서 `context1()`를 호출하고 또 새로운 컨텍스트를 만든다. `context1()` 컨텍스트에서는 `context1 실행!`이라는 값을 출력 후에 `context1()`를 반환하고 `context2()`로 돌아가서 `context2 실행!` 을 출력하고 나서야 `context2()`를 반환하고 전역 실행 컨텍스트 실행을 마친 후 종료된다.





#### 1. 실행 컨텍스트 생성과정

실행 컨텍스트의 생성 과정을 이해하려면 **활성 객체**와 **변수 객체**, **스코프체인** 등의 개념을 알고 생성되는 과정을 알아야 한다. 

 1. 활성 객체 생성(=변수 객체)

    실행 컨텍스트 생성 후에 해당 컨텍스트에서 실행에 필요한 여러가지 정보를 담을 객체를 생성한다. 이 객체가 **활성 객체**이다. 활성 객체 안에 사용할 매개변수와 사용자가 정의한 변수 및 객체를 저장한다.

 2. arguments 객체 생성

    활성 객체 생성 후에는 `arguments` 객체를 생성한다. 

 3. 스코프 정보 생성

    현재 컨텍스트의 유효 범위를 나타내는 **스코프 정보**를 생성한다. 현재 실행중인 실행 컨텍스트 안에서 연결 리스트와 유사하게 만들어진다. 이렇게 생성되는 리스트가 **스코프 체인**이다. `[[scope]]` 프로퍼티로 참조할 수 있다. 현재 생성된 활성 객체가 스코프 체인의 제일 앞에 추가된다.

 4. 변수 생성

    현재 실행 컨텍스트 내부에서 사용되는 지역 변수가 생성된다. 변수 객체 안에서 호출된 함수 인자는 각각의 프로퍼티가 생성되고 그 값이 할당된다. 만약에 값이 전달되지 않았으면 undefined가 할당된다. 이 부분에서 주의할 점은 **변수나 함수를 메모리에 생성할 뿐 초기화는 아직 이루어지지 않는다.**  값이 할당되는 표현식의 실행은 변수 객체의 생성이 다 되고나서 시작한다.

 5. this 바인딩

    변수 생성 이후에는 `this`가 바인딩된다. `this`가 참조하는 객체가 없으면 전역 객체를 참조한다.

 6. 코드 실행

    위의 과정을 거쳐 실행 컨텍스트가 생성되고, 변수 객체가 만들어지고 나서 표현식이 실행되며 변수 초기화와 연산이 이루어지고, 또 다른 함수가 실행된다. 이 단계에서 생성된 후 `undefined`되었던 변수들에 실제 값이 할당된다.  여기서 전역 컨텍스트는 일반적인 실행 컨텍스트와 차이가 있는데, `arguments` 객체가 없고, 전역 객체 하나만 포함하는 스코프 체인을 가지고 있다. 전역 실행 컨텍스트의 변수 객체가 전역 객체로 사용된다. **전역 실행 컨텍스트에서는 변수 객체가 곧 전역 객체**이다. 전역적으로 선언된 변수와 함수가 전역 객체의 **프로퍼티**가 된다.  



#### 2. 스코프체인

위에서 **스코프체인**이 무엇인지 대략 설명하였다. **스코프체인**에 대해 제대로 이해해야 변수에 대한 인식 메커니즘을 알고 사용하는 변수가 어디서 선언된 변수인지 정확히 파악할 수 있다. **스코프**는 유효범위이다. 이 유효 범위안에 함수와 변수가 존재하는 것이다. 자바스크립트에서 `for`, `if` 구문은 유효 범위가 없고, **함수**만 유효 범위의 한 단위가 된다. 이러한 스코프가 `[[scope]]` 프로퍼티에 연결리스트로 관리되는 것이 **스코프체인**이다. 함수가 실행되는 순간 실행 컨텍스트가 만들어지고 해당 실행 컨텍스트는 실행된 함수의 `[[scope]]` 프로퍼티를 기반으로 새로운 스코프 체인을 만든다. 

```javascript
var num1 = 1;
var num2 = 2;
function func(){
	var num1 = 10;
	var num2 = 20;
	console.log(num1);// (출력 값) 10
	console.log(num2);// (출력 값) 20
}
func();
console.log(num1);// (출력 값) 1
console.log(num2);// (출력 값) 2
```

위 예제를 실행하면 먼저 전역 실행 컨텍스트가 생성되고 `func()` 함수 객체가 만들어진다. 그리고 `func`함수 객체의 `[[scope]]`는 전역 변수 객체가 된다. 그리고 `func()` 함수가 실행되고 나면 새로운 컨텍스트가 생성된다. `func`컨텍스트의 스코프체인은 실행된 함수의 `[[scope]]` 프로퍼티를 그대로 복사하고, 현재 생성된 변수 객체를 스코프 체인의 맨 앞에 추가한다. 결국 스코프체인은 다음과 같이 표현할 수 있다.

> **스코프 체인 = 현재 실행 컨텍스트의 변수 객체 + 상위 컨텍스트의 스코프 체인**

```javascript
var num = "num1";

function printNum(){
	return num;
}
function printFunc(func){
	var num = "num2";
	console.log(func());
}
printFunc(printNum);
```

위 코드를 잘 살펴보자. 먼저 전역 실행 컨텍스트가 생성된다. 그리고 `num`변수 ,`printNum()`함수, `printFunc()`함수, `this`, `[[scope]]` 등이 변수 객체에 생성된다. 그리고 `printFunc()`함수가 실행되면서 새로운 실행 컨텍스트가 생성되고 `printFunc()`실행 컨텍스트에는 `num`변수, `func()`함수,`this`,`[[scope]]`가 생성된다. 그리고 `printFunc()`의 `[[scope]]`는 전역 객체를 복사하고 현재 실행 컨텍스트의 변수 객체인 `printFunc()`변수 객체를 리스트로 이어 생성한다. 그리고 `func()`함수를 참조하여 `func(printNum)`을 실행시키고 `printNum()`실행 컨텍스트를 생성한다. `this`와 `[[scope]]`를 만든다. **여기서 `printNum()`의 `[[scope]]`는 `printNum()`이 전역 실행 컨텍스트에 생성**되어있기 때문에, 전역 생성 컨텍스트를 복사한 후에 현재 실행 컨텍스트 변수 객체인 `printNum()` 변수 객체를 리스트에 추가한다. 때문에 스코프체인에 따라서 전역 객체에서 `num`변수를 찾기 때문에 `num1`이 출력된다. 위 예시 코드를 잘 이해하면 실행 컨텍스트와 스코프 체인에 대해 이해할 수 있다.







---





### 출처

> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)](https://book.naver.com/bookdb/book_detail.nhn?bid=7400243)
> 2. [인프런 'Javascipt 핵심 개념 알아보기 - JS Flow'](https://www.inflearn.com/course/핵심개념-javascript-flow/)





