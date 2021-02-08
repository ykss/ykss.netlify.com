---
title: '[책]모던 자바스크립트 입문 정리 (1)'
date: 2021-02-07 23:00:00
category: 'Javascript'
draft: false
---

## 자바스크립트 특징

- 자바스크립트는 인터프리터 언어이다.

실행 속도가 느릴 것 같지만 웹 브라우저에서 실행 시간에 컴파일 하는 JIT컴파일러를 내장하고 있어 빠르다.

- 동적 프로토타입 기반 객체 지향 언어이다.

C++이나 JAVA와 같이 클래스 기반 객체 지향 언어가 아닌 프로토타입을 상속하는 프로토타입 기반 객체 지향 언어이다.

- 동적 타입 언어이다.

실행 전에 변수 타입이 결정되는 정적 타입 언어와 다르게 실행되는 도중 변수에 저장되는 데이터 타입이 동적으로 바뀔 수 있는 동적 타입 언어이다.

## 변수의 명명 규칙(Naming Rule)

- 카멜 표기법(camelCase) 또는 스네이크 표기법(snake_case)를 사용하여 쓴다. 혼용하지 않는다.

- 루프 카운터는 i,j,k 등을 사용한다.

- 상수는 대문자로 표시한다. ex) MAX_SIZE

- 논리 값을 표시하는 변수 앞에는 is를 붙인다. ex) isMouseDown

- 생성자, 컴포넌트 등 이름을 붙일 떄는 파스칼 표기법을 사용한다. ex) SignupPage

## 객체 in 연산자

- in 연산자로 객체의 프로퍼티를 확인 할 수 있다.

```javascript
var player = { name: 'mount', position: 'midfielder' }
console.log('name' in player) // true
console.log('age' in player) // false
```

## 함수의 기초

- 변수 선언문이 호이스팅 되는 것처럼 함수 선언문도 또한 호이스팅 된다.
- 함수에 객체 인수를 전달한 경우, 함수 내에서 객체의 프로퍼티를 수정하면, 호출한 코드에 있는 인수 객체의 프로퍼티도 함께 변경된다. 객체를 넘길 시 객체의 참조가 전달되기 때문이다.
- 함수 안에서 변수 선언을 생략하고 값을 대입하면 전역 변수로 선언된다. 이 현상은 함수 바깥과 함수 안 모두에서 발생한다.

```javascript
function foo() {
  a = 'local'
  console.log(a) // local
  return a
}
foo()
console.log(a) // local
```

## 변수 선언

- let으로 선언한 경우, 변수의 유효 범위가 블록 안이고, let으로 선언한 변수 선언문은 호이스팅(끌올)하지 않는다.
- let문은 중복 선언 불가하다.
- const 선언문도 블록 유효 범위를 가지고, 한 번만 할당 가능한 변수를 선언한다.
- const로 상수 값이 아닌 객체를 선언했을 경우 객체 내의 프로퍼티 값은 수정이 가능하다.

## ES5의 내장 생성자

- 타입 객체
  - Object
  - String
  - Number
  - Boolean
  - Array
  - Date : 날짜 관련
  - Function
  - RegExp
- 에러 객체
  - Error
  - EvalError
  - InternalError
  - RangeError
  - ReferenceError
  - SyntaxError
  - TypeError
  - URIError

## ES6의 내장 생성자

- Symbol
- ArrayBuffuer : 고정 길이 이진 데이터 버퍼 생성
- DataView : ArrayBuffer 데이터를 읽고 쓸 경우
- Promise : 처리 지연 및 비동기 처리 관리
- Generator : 제네레이터 함수를 다룰 경우
- GeneratorFunction : 제네레이터 함수 생성
- Proxy : 객체의 기본적인 동작을 재정의 하는 기능 제공
- Map : Key-Value 맵을 생성
- Set : 중복 허용하지 않는 데이터 집합 생성

## Math 객체

- Math 객체 주요 메서드
  - Math.abs(x) : 절대값
  - Math.ceil(x) : x 이상의 최소 정수
  - Math.floor(x) : x 이하의 최대 정수
  - Math.max(x,y) : x, y 중에서 큰 값
  - Math.min(x,y) : x, y 중에서 작은 값
  - Math.pow(x,p) : x의 p 제곱
  - Math.random() : 0 이상 1 미만의 난수
  - Math.round() : x의 반올림
  - Math.sqrt(x) : x의 제곱근
  - Math.trunc(x) : x의 정수부

## String 객체

- String 객체 주요 메서드
  - charAt(n) : 대상 문자열의 n번째 문자
  - concat([s1,s2,...]) : 대상 문자열과 인수의 문자열을 연결해서 반환
  - includes(s [, n]) : 대상 문자열의 n번째 문자부터 문자열 s를 포함하는지 논리값, n을 생략하면 문자열의 끝부터 검색
  - indexOf(s) : 대상 문자열에서 s가 처음 나오는 위치
  - repeat(n) : 대상 문자열을 n개 연결한 문자열
  - replace(s1, s2) : 대상 문자열에 포함된 문자열 s1을 문자열 s2로 치환한 결괏값
  - slice(m, n) : 대상 문자열의 m번째 이후 n번째 미만의 부분 문자열 반환
  - split(s [, n]) : 대상 문자열을 문자열 s로 분할한 문자열 배열을 반환
  - substring(m, n) : 대상 문자열의 m번째 이후 n번째 미만의 부분 문자열을 반환
  - toLowerCase(), toUpperCase() : 대상 문자열을 소문자, 대문자로 변환
  - trim() : 대상 문자열에서 앞뒤 공백을 제거
  - valueOf() : String 객체를 문자열 값으로 변환

## 관계 연산자

- ==와 ===

==은 느슨한 비교이고, ===는 엄격한 비교이다. == 일 경우 타입이 다르면 타입을 맞춘 후에 값만 비교한다. ===는 타입도 같고 값도 같은 경우에만 같은 것으로 반환한다.
