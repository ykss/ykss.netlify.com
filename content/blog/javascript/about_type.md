---
title: '자바스크립트 타입 정리 (원시, 참조, 원시래퍼)'
date: 2022-03-18 16:00:00
category: 'Javascript'
draft: false
---

## 1. 원시 타입(primitive type)

- boolean

- number

- string

- null

- undefined

원시 값을 변수에 할당하면 값이 복사되어 들어간다. 즉, 원시값이 할당된 변수는 자기 자신의 고유한 값을 가지게 된다.

### typeof

원시 값의 종류를 알 수 있는 메서드이지만, null의 경우 타입을 주의해야 한다.

null을 typeof 할 경우 object로 나오기 때문에 \`value === null\`과 같이 확인해야 한다.

## 2. 참조 타입(reference type)

- 객체 : {}

- 배열 : []

- 함수 : function

- Date

- 정규표현식 : RegExp

=>원시타입을 제외하면 모두 참조타입이다.

참조 타입은 변수의 값을 직접 저장하지 않고 메모리 안에서 객체의 위치를 가르키는 포인터를 저장한다. 값을 저장하는지 위치를 저장하는지가 가장 큰 차이이다.

## 3. 원시 래퍼 타입

- String

- Number

- Boolean

원시 래퍼 타입은 원시 타입을 객체처럼 편리하게 사용하도록 도와준다. 원시 타입을 객체처럼 사용하면 자바스크립트 내부에서 데이터의 인스턴스를 만들고 코드 실행 후에 바로 제거한다. 이러한 과정을 오토 박싱(autoboxing)이라고 한다.

```Javascript
var name = "bit";
console.log(name.concat("coin"));

var name = "bit";
var temp = new String(name);
console.log(temp.concat("coin"));
temp = null;
```

자바스크립트에서는 위와 같은 과정을 거쳐서 원시 타입을 마치 객체처럼 메서드를 사용할 수 있게 해준다.
