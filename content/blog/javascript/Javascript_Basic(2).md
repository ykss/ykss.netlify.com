---
title: '자바스크립트의 객체'
date: 2020-4-9 13:25:00
category: 'Javascript'
draft: false
---


![image-20200409103446799](./images/image-20200409103446799.png)





## 자바스크립트의 객체

이전 포스트에서 언급했던 것과 같이 자바스크립트에서 *null*과 *undefined*를 제외한 모든 것은 객체로 표현될 수 있다. 그만큼 객체의 활용과 객체의 특성에 대해서 제대로 이해하는 것이 중요하다. 



---



## 객체의 생성

자바스크립트에서는 객체를 생성하는 방법이 크게 세가지가 있다. 첫번째는 `Object()` 객체 생성자 함수를 이용하는 방법, 두번째는 객체 리터럴을 이용하는 방법, 세번째는 생성자 함수를 이용하는 방법이다

1. `Object()`생성자 함수

   ```javascript
   //player라는 이름의 빈 객체 생성
   var player = new Object();
   
   //player 객체 프로퍼티 생성
   player.name = 'Mason Mount';
   player.position = 'Midfielder';
   player.back_number = 19;
   
   console.log(typeof player); // (결과) object
   console.log(player); // (결과) {name: 'Mason Mount', position: 'Midfielder', back_number: 19 }
   ```

   

2. 객체 리터럴

   ```javascript
   var player = {
   	name : 'Mason Mount',
   	position : 'Midfielder',
   	back_number : 19 
   };
   
   console.log(typeof player); // (결과) object
   console.log(player); // (결과) {name: 'Mason Mount', position: 'Midfielder', back_number: 19 }
   ```

   

3. 생성자 함수 (함수를 통한 객체 생성)

   ```javascript
   var minus = new Function('x','y','return x-y'); //minus라는 함수 객체 선언
   console.log(minus(4,3)); //(출력값) 1
   ```

   

---



## 객체 프로퍼티 접근/출력/삭제

객체에는 프로퍼티가 존재하는데 프로퍼티는 기본 데이터 형식이 들어갈 수도 있고, 객체가 들어갈 수도 있고, 함수가 들어가서 메소드로 사용될 수도 있다. 이렇게 객체에서는 새로운 프로퍼티를 생성/삭제할 수도 있고, 프로퍼티에 접근하여 값을 읽거나 변경할 수 있다. 객체의 프로퍼티에 접근하는 방법에는 두가지 방법이 있다.



1. 대괄호([ ])를 통한 접근법

   대괄호 표기법 시 접근하려는 프로퍼티 이름을 꼭 **문자열**로 만들어야 한다.

2. 마침표(.)를 통한 접근법

   ```javascript
   var player = {
   	name : 'Mason Mount',
   	position : 'Midfielder',
   	back_number : 19 
   };
   
   //프로퍼티 읽기
   console.log(player.name);  // (출력값) Mason Mount
   console.log(player['name']); // (출력값) Mason Mount
   console.log(player.score); // (출력값) undefined
   
   //프로퍼티 수정
   player.position = 'Defender';
   console.log(player.position); // (출력값) Defender
   console.log(player['position']); // (출력값) Defender
   
   //프로퍼티 동적 생성
   player.score = 9;
   console.log(player.score); // (출력값) 9
   
   //대괄호 표기법만 사용해야하는 경우
   player['market-value'] = '20m';
   console.log(player['market-value']); // (출력값) 20m
   console.log(player.market-value); // (출력값) NaN
   ```

   * **프로퍼티 동적생성** - 존재하지 않는 프로퍼티에 값을 할당할 경우 새로운 프로퍼티가 동적으로 할당된 이후에 값이 할당된다.
   * **NaN**은 수치 연산을 해서 비정상적인 값을 얻지 못할 때 출력된다.



프로퍼티를 하나씩 출력할 수도 있지만, **for in 문**을 사용하면 객체에 포함된 모든 프로퍼티를 루프를 통해 출력 할 수 있다. 

```javascript
var player = {
	name : 'Mason Mount',
	position : 'Midfielder',
	back_number : 19 
};

var i;
for (i in player) {
    console.log(i, player[i]);
}

// (출력값) name 'Mason Mount'
//         position Midfielder
//         back_number 19          
```



객체 프로퍼티를 삭제하는 경우에는 **delete** 연산자를 이용해서 삭제할 수 있다. 하지만 **객체의 프로퍼티만 삭제할 수 있고, 객체 자체를 삭제하지는 못한다. **

```javascript
var player = {
	name : 'Mason Mount',
	position : 'Midfielder',
	back_number : 19 
};

delete player.name;
console.log(player.name); // (출력값) undefined; 

delete player;
console.log(player.position); // (출력값) midfielder;
```



## 객체비교

동등연산자(==)를 사용하여 두 개의 객체를 비교할 때, 객체의 프로퍼티 값이 아닌 참조값을 비교한다.

```javascript
var num1 = 100;
var num2 = 100;

var objA = { value: 100 };
var objB = { value: 100 };
var objC = objB;

console.log(num1 == num2); // (출력값) true
console.log(objA == objB); // (출력값) false
console.log(objB == objC); // (출력값) true
```

위 예시를 보면 `objA`와 `objB`의 비교는 둘의 참조값이 다르기 때문에 false의 결과를 얻게 된다. `objB`와 `objC`의 비교의 경우 위의 할당 과정에서 `objC`에 `objB`의 참조값이 할당되었기 때문에 true의 결과를 얻게 된 것이다. 





**### 출처**

\> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)](https://book.naver.com/bookdb/book_detail.nhn?bid=7400243)

\> 2. [인프런 'Javascipt 핵심 개념 알아보기 - JS Flow'](https://www.inflearn.com/course/핵심개념-javascript-flow/)