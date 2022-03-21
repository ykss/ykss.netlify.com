---
title: 'JS 호이스팅 다시 살펴보기'
date: 2022-03-19 16:00:00
category: 'Javascript'
draft: false
---

### 1. 함수의 형태

함수에는 두 가지 리터럴 형태가 있다.

1. 함수 선언

함수 선언언 function 키워드 뒤로 함수의 이름을 적어서 선언한다. 함수 선언 방식의 경우, 호이스팅이 일어나서 가장 위로 끌올 되어 선언된다.

2. 함수 표현식

함수 표현식은 function 키워드 뒤로 이름없이 사용한다. 이름이 없어 익명 함수로도 불린다. 함수 표현식 방식의 경우 호이스팅이 일어나지 않는다.

```Javascript
// 함수 선언
function example() {
  return 'example';
}

// 함수 표현식
var example = () => {
  return "example";
}
```

변수의 경우는 함수와 다르게 선언만 끌어올려진다.

```Javascript
console.log(test)

var condition = false;

if(condition) {
  var test = "this is test";
}
```

이렇게 if문에서 변수의 선언과 초기화가 이루어 지는 경우에는 전역에서 선언한 경우와 동일하게 취급된다.

```Javascript
console.log(test());
console.log(value);

function test() {
  var value = "hoist";
  return value + " test";
}
```

위와 같이 함수 내에서 선언되는 경우에는 함수 스코프의 최상단으로만 끌어올려지고, 전역 공간에서 value는 정의되지 않는다.

### 2. 호이스팅이 되지않는 선언

```Javascript
console.log(test1);
console.log(test2);
console.log(Tester);

let test1 = 'let value';
const test2 = "const value";

class Tester {
  constructor(){
    this.name = "test";
  }
}

let tester = new Tester();
```

위와 같이 let이나 const로 선언된 변수나 class는 호이스팅이 일어나지 않는다. let과 const로 선언된 변수와 상수는 TDZ(Temporal Dead Zone) 구역에 배치되고 이 값들은 선언이 실행된 이후에 TDZ에서 제거되어 사용 가능한 상태가 된다.

### 3. 정리

- 함수 선언과 변수 선언은 코드를 실행할 때 해당 선언 스코프 최상단으로 끌어올려진다. 이런 현상이 호이스팅이다.

- 선언한 변수의 값은 끌어올려지지 않고 선언만 끌어올려진다.

- let, const, class 선언은 호이스팅이 발생하지 않는다.
