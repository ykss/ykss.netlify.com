---
title: '자바스크립트의 연산자'
date: 2020-4-13 16:00:00
category: 'Javascript'
draft: false
---

![image-20200409103446799](./images/image-20200409103446799.png)


자바스크립트에서도 다른 언어와 동일하게 연산자들이 쓰인다. 그 중에서 자바스크립트에서 주의 깊게 봐야할 몇가지 연산자에 대해서 살펴보자.

### + 연산자
`+` 연산자는 기본적으로 **더하기**연산과 **문자열 연결**연산 기능을 수행한다. 둘 다 숫자이면 더하기 연산을 수행하고 대상에 문자열이 포함되면 모두 문자열 연결 연산으로 수행된다. 
```javascript
let numAdd = 1 + 5;
let numAdd2 = 1 + '5';
let numbAdd3 = 'Hello' + 'Javascript';

console.log(numAdd); // (출력 값) 6
console.log(numAdd2); // (출력 값) '15'
console.log(numAdd3); // (출력 값) 'HelloJavascript'
```



---



### typeof 연산자

`typeof`연산자는 피연산자의 타입을 **문자열**형태로 리턴해주는 연산자이다. 주의할 점은 `null`이 `object`로 리턴되는 것을 꼭 기억해야 한다.

|   숫자    |  'number'   |
| :-------: | :---------: |
|  문자열   |  'string'   |
|  불린값   |  'boolean'  |
|   null    |  'object'   |
| undefined | 'undefined' |
|   객체    |  'object'   |
|   함수    | 'function'  |
|   배열    |  'object'   |



---



### ==(동등)연산자와 ===(일치)연산자

**==연산자**는 비교 대상인 피연산자의 타입이 다르면 타입 변환을 통해 두 값이 같은지 비교하고, **===연산자**는 피연산자의 타입이 다를 경우에 타입 변경 없이 비교 한다.

```javascript
console.log(1 == '1'); //(출력 값) true
console.log(1 === '1'); //(출력 값) false
```

많은 경우에서 타입을 변환하여 비교하지 않기 때문에, 대부분의 경우 '==='를 통해 비교하는 것이 바람직 할 수 있다.



---



### !!연산자

!!연산자는 **피연산자를 불린값으로 변환**해주는 연산자이다. 객체는 비어있는 객체도 true인 것을 기억하자.

```javascript
console.log(!!0); // (출력 값) false
console.log(!!1); // (출력 값) true
console.log(!!'string'); // (출력 값) true
console.log(!!null); // (출력 값) false
console.log(!!undefined); // (출력 값) false
console.log(!!{}); // (출력 값) true
console.log(!![1,2,3]); // (출력 값) true
console.log(!![]); // (출력 값) true
```





### 출처

> 1. [INSIDE JAVASCRIPT (한빛미디어, 송형주,고현준 지음)](https://book.naver.com/bookdb/book_detail.nhn?bid=7400243)
> 2. [인프런 'Javascipt 핵심 개념 알아보기 - JS Flow'](https://www.inflearn.com/course/핵심개념-javascript-flow/)





