---
title: 'Babel 이란 무엇일까?'
date: 2020-5-2 20:40:00
category: 'Web'
draft: true
---



**Babel**은 자바스크립트 개발을 하다보면 자연스럽게 접하게 되는 것인데, Babel이란 무엇일까? [Babel의 공식 홈페이지](https://babeljs.io/)에 보면 매우 간단하게 "`Babel is a Javascript complier.` "라고 표현되어있다. 쉽게 말하면 자바스크립트의 컴파일러인 것이다. 그것도 코드를 코드로 바꿔주는 `code to code` 컴파일러이다. `code to code`라고 설명하는 이유는 최신의 자바스크립트의 코드들을 **babel**을 통해서 이전의 자바스크립트로 바꿔주는 역할을 수행하기 때문이다. 때문에 **트랜스파일러(Transpiler)**라고 불린다. 



#### Babel이 필요하게 된 이유

자바스크립트의 경우, `ES-`으로 시작되는 매년 새로운 자바스크립트 버전(ECMAScript)을 발표한다. 이렇게 자바스크립트가 매우 빠르게, 그리고 꾸준히 발전하고 있는데 브라우저가 그것을 전부 다는 지원하지 못하는 경우가 존재한다. 그렇기 때문에 ESNext 문법을 사용하여 웹 개발을 할 때는 코드와 브라우저의 호환을 맞춰주기 위해 **Babel**이 필수적인 역할을 담당한다. 개발자가 어떠한 버전의 자바스크립트로 개발을 하더라도 **Babel**이 중간에서 호환성을 모두 신경써주기 때문에 개발자가 따로 코드의 버전에 대해서 신경 쓸 필요가 없는 것이다. 이것은 개발자의 수고를 상당 부분 덜어주고, 개발에만 더욱 집중할 수 있도록 도와주는 역할을 한다. 



뿐만 아니라 요즘은 `typescript`와 같은 언어도 자주 쓰는데, 이때도 **Babel**이 문제없이 javascript로 컴파일 되도록 역할을 수행해준다. 





#### Polyfill 기능





---





### 출처

> 1. [MDN web docs DOM 소개]([https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/%EC%86%8C%EA%B0%9C](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/소개))
> 2. [poiemaWeb DOM](https://poiemaweb.com/js-dom)



