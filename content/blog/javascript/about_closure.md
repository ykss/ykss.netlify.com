---
title: '클로저 정리하기'
date: 2022-04-03 16:00:00
category: 'Javascript'
draft: false
---

클로저는 쉽게 이해하거나 설명하기 어려운 개념일 수 있다.

### 1. closure의 의미

- 사전적 의미 : 중단하다, 폐쇄하다

자바스크립트에 함수 스코프가 있고, 함수 내부에서 정의된 변수는 함수의 어떤 부분에서도 접근 가능하다. 즉, 내부 함수에서 자신을 포함하는 외부 함수의 스코프에 접근할 수 있다는 이야기이다.

```Javascript
var outer = function(){
  var a = 1;

  var inner = function() {
    var b = 5;
    var c = 6;

    a = a + b + c;
    console.log(a);
  };
  return inner;
};

var newInner = outer();
newInner();
```

내부 함수가 외부 함수보다 오래 살아있는 경우는 어떻게 될까? 위의 코드를 보면 outer()함수가 실행되고 나서 inner()함수가 실행 된다. 그럼에도 inner()함수는 outer()가 이미 반환된 후에도 outer의 변수 a에 대한 접근 권한을 가진다. **함수는 자신을 포함하는 함수의 스코프에 접근할 수 있기 때문**이다.

클로저를 한 마디로 표현하면 **폐쇄된 공간에 대한 접근 권한을 가진 함수**이다. 이런 특성을 이용하면 비공개 데이터를 가진 객체를 만들 수 있다.

### 2. 클로저 활용 예시

```Javascript
var person = (function () {
  var age = 15;

  return {
    name: 'mount',
    getAge : function(){
      console.log(age);
      return age;
    },
    setAge : function(val){
      age = val;
      console.log(age)
    }
  }
})();
person.getAge();
person.setAge(20);
//20

person.age = 30;
//20
```

위 코드를 보면 age 변수에 접근하기 위해서는 setAge()와 getAge()라는 내부 함수를 통해서만 접근이 가능하다.
