---
title: 'let, const, var 의 차이는?'
date: 2020-4-11 18:37:00
category: 'Javascript'
draft: false
---


자바스크립트에서 변수를 선언할 때 `let`, `const`, `var` 등을 사용하곤 한다. 셋의 차이를 정확하게 아는 것이 변수를 활용하는 데 있어 도움이 될 것이다.



### `var` Vs `let`



기본적으로 예전의 자바스크립트 버전에서는 변수 선언 시 선택권이 없이 오직 `var`만 사용 가능했다. 다른 언어와 다르게 데이터 타입을 명시하지 않은 채로 선언할 수 있었기 때문에 어떻게 보면 매우 융통성(?)있고 유연해 보일 수도 있었지만, 자바스크립트를 표현할 때 느슨하다는 표현을 많이하는 것처럼 단점으로 여겨지는 것도 다반사 이다. 그래서 왜 `let`이 등장할 수 밖에 없었는지의 이유를 `var`와의 비교를 통해 알아보려고 한다. 아래 예시를 통해 `var`의 특징을 간단하게 살펴보자.

``` javascript
var num = 500;
console.log(num); 

var num = 300;
console.log(num);

// (출력 값) 500 
//          300
```

위의 경우를 보면 num이라는 변수는 위에서 이미 선언되어 있고 값이 할당되어 있는 상태인데, 어떠한 에러도 없이 제대로 출력이 된다. 이처럼 **변수의 중복 선언**이 허용되는 것이다.  이러한 문제는 개발 시 적용되었을 때, 실수로 같은 이름의 변수를 여러개 사용해서 원치않는 결과를 얻을 수 있고, 어디서부터 어떻게 잘못 쓰였는지 알아내기도 쉽지 않아서 디버깅 작업에 있어서 어려움을 줄 수도 있다. 여기기 `let`의 예시를 살펴보면 `let`의 경우는 이미 `num`이라는 변수가 선언되었다고 하며 에러를 출력한다.

```javascript
let num = 500;
console.log(num); 

let num = 300;
console.log(num);

// index.js:4 Uncaught SyntaxError: Identifier 'num' has already been declared 
```



뿐만 아니라, 자바스크립트의 **호이스팅(Hoisting)** 과정에서 `var`는 **변수 선언 이전부터 참조가 가능**하다.  **호이스팅**이란 자바스크립트에서 변수나 함수의 선언문을 코드의 맨 위로 **끌올**해서 동작하는 것인데, 이것은 자바스크립트의 큰 특징 중 하나이다. 여기서 `var`는 선언과 동시에 Initailize 되기 때문에 `let`과 다르게 선언문 이전에 해당 변수를 참조해도 에러가 발생하지 않는다. 그러나 `let`의 경우에는 선언 단계과 Initialize 단계가 구분되어 실행되기 떄문에 해당 변수를 호출하면 에러를 발생시킨다.

```javascript
console.log(test); // (출력 값) undefined
var test;

console.log(code); // Uncaught ReferenceError: Cannot access 'code' before initialization
let code;
```



이밖에도, **`var`를 생략하고 선언이 가능**하다는 점과 **블록 레벨 스코프**가 아닌 **함수 레벨 스코프**를 따른다는 점 등 특징들에서 여러 특징들이 있다. 이러한 특징들도 `let`과 `const`등의 다른 선언 방식을 통해 `var`의 한계를 극복 할 수 있다.

```javascript
//함수레벨 스코프 vs 블록레벨 스코프
var x = 0;
{
  var x = 1;
  console.log(x); // 1
}
console.log(x);   // 1

let y = 0;
{
  let y = 1;
  console.log(y); // 1
}
console.log(y);   // 0
```



### `const`

`const`는 `constant` 라는 의미로 일정하다는 뜻을 가지고 있다. 다시 말해서 **저장된 값이 변경되지 않는다**는 특징이 있다. 우리가 변수를 만들 때 해당 변수가 초기화 선언 후에 변경되지 말아야한다면 `const`를 통해 선언하면 된고 그렇지 않고 값을 재할당해야 한다고 하면 `let`을 사용하면 된다. 단순한 차이이다. 

어렵게 생각할 필요 없이 변수 선언 시, 우리가 변수를 선언할 떄의 의도를 고려하여 `let`과 `const`를 사용하면 된다. 가능하면 `const`는 우리가 의도치 못한 변경을 막아주기 때문에 되도록 `const`를 사용하고 재할당이 필요한 경우에는 `let`을 통해 변수를 선언하도록 하자.



> 출처
>
> [let, const와 블록 레벨 스코프](https://poiemaweb.com/es6-block-scope)