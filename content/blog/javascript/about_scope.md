---
title: '자바스크립트 타입 정리 (원시, 참조, 원시래퍼)'
date: 2022-03-26 16:00:00
category: 'Javascript'
draft: false
---

스코프는 이름이 충돌하는 문제를 덜어주고, 자동으로 메모리를 관리한다.

### 자바스크립트의 유효 범위

1. 전역 스코프

2. 함수 스코프

3. 블록 스코프(ES6)

### 1. 전역 스코프

스크립트 어디에서든 접근이 가능한 스코프로 협업과 라이브러리 사용시 충돌 가능성이 있다.

### 2. 함수 스코프

함수 내부에서 정의된 변수와 매개변수는 함수 외부에서 접근할 수 없다. 함수 내부에서 정의된 변수라면 함수의 어느 부분에서도 접근 가능하다.

- var, let, const 등으로 선언하지않고 그냥 선언한 변수는 전역 변수가 된다.

### 3. 블록 스코프(ES6)

```Javascript
if(true) {
  var value == "hello";
}

console.log(value);
//"hello"

if(true) {
  let value == "world";
}

console.log(value);
//"hello"

```

블록 스코프는 블록 안에서만 유효하고 접근 가능하다. let, const로 선언하면 블록 스코프가 된다.

### 4. 정리

- 스코프는 변수의 접근성과 생존 기간을 제어한다.

- 스코프는 이름이 충돌하는 문제를 덜어주고, 자동으로 메모리를 관리한다.

- 자바스크립트에는 전역 스코프, 함수 스코프, 블록 스코프가 존재한다.
