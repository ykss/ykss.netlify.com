---
title: 'DOM 이란 무엇일까?'
date: 2020-4-29 15:40:00
category: 'Web'
draft: false
---



**DOM**이란 **Document Object Model**의 약어이다. DOM은 HTML, XML 문서의 프로그래밍 인터페이스라고 할 수 있다. 문서의 구조화된 표현을 제공함으로써 프로그래밍 언어가 DOM 구조에 접근할 수 있도록 해주는 매우 중요한 역할이다. 개발자는 DOM 구조에 접근하여 문서 구조를 바꾸거나 스타일과 내용 등을 변경하고 이벤트를 연결시키는 등 다양한 작업을 수행할 수 있다. 우리가 흔히 쓰는 `javascript`언어를 통해 HTML 태그를 변경/추가/삭제하고 CSS 스타일을 바꾸고 조정하는 것이 DOM이 중간에서 연결해주는 역할을 하기때문에 가능하다고 할 수 있다.  DOM 프로그래밍 언어는 아니지만 DOM 없이는 자바스크립트가 웹페이지 또는 XML 페이지의 요소들에 대한 정보를 가지고 접근하여 조작하는 것이 불가능하다.



![출처 : wiki백과 ](./images/1024px-DOM-model.svg.png)

위 그림에서 확인 할 수 있는 것처럼 문서안의 모든 `element`는 문서를 위한 DOM의 한 부분이다. 이렇게 트리형으로 구조화 되어있기 때문에 자바스크립트와 같은 스크립팅 언어로 원하는 `element`에 접근하여 조작이 가능한 것이다.  과거에는 자바스크립트와 DOM이 더 밀접했지만 현재는 분리되어 발전하고 있다. DOM은 자바스크립트가 아닌 다른 언어를 통해서도 충분히 가능하다. 



#### 1. DOM을 어떻게 활용할까?

DOM은 프로그래밍 언어가 DOM에 접근하고 수정할 수 있도록 방법을 제공하는데, 일반적으로는 프로퍼티와 메서드를 가지고 있는 자바스크립트 객체로 제공한다. 이것이 **DOM API**이다. 정적인 웹페이지에 접근해서 동적으로 변경하기 위해서는 메모리 상의 DOM을 변경하는 것인데, DOM을 조작하는데 필요한 것이 DOM API라고 생각하면 된다. 



브라우저는 HTML 문서를 로드하고 해당 문서에 대한 모델을 메모리에 생성하는데, 이때 생성되는 트리 모양의 모델이 **DOM tree**이다. 





#### 2. DOM tree

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .red  { color: #ff0000; }
      .blue { color: #0000ff; }
    </style>
  </head>
  <body>
    <div>
      <h1>Clubs</h1>
      <ul>
        <li id="one" class="blue">Chelsea</li>
        <li id="two" class="red">ManUtd</li>
        <li id="three" class="red">Liverpool</li>
        <li id="four">Mancity</li>
      </ul>
    </div>
  </body>
</html>
```

위와 같이 `HTML`코드를 작성하여 브라우저가 로드 후 파싱하면 아래와 같은 DOM tree 모델을 생성하게 된다.

![poiemaweb DOM tree](https://poiemaweb.com/img/dom-tree.png)

위의 DOM 트리를 보면서 DOM의 구조에 대해 집중해보자.





##### 1) Document Node (문서 노드)

DOM에 포함된 모든 요소와 어트리뷰트, 텍스트와 같은 모든 노드는 `document` 객체의 자식이다. `document`가 root node라고 할 수 있다. `document` 노드는 트리의 최상위에 위치하여 DOM tree에 접근하기 위한 시작점이다.



##### 2) Element Node  (요소 노드)

요소 노드는 `HTML`요소를 표현한다. 요소 노드는 문서의 구조를 서술하며, 어트리뷰트나 텍스트 노드에 접근하기 위해서는 먼저 요소 노드에 먼저 접근해야 한다. 



##### 3) Attribute Node (어트리뷰트 노드)

어트리뷰트 노드는 `HTML`요소의 어트리뷰트를 표현하는데 어트리뷰트 노드의 경우 해당 요소의 자식이 아닌 요소의 일부로 표현된다. 어트리뷰트를 참조, 수정하려면 해당 요소 노드에 접근하면 된다.



##### 4) Text Node (텍스트 노드)

텍스트 노드의 경우 HTML 요소의 텍스트를 표현하고, 요소 노드의 자식이다. 그리고 텍스트 노드 자체는 자식 노드를 가지는 것이 불가능하다. DOM tree의 최하위 노드라고 할 수 있겠다.





#### 3. DOM Query (요소 접근방법)



##### 1) 하나의 요소 노드 선택

`document.getElementById(id)`

* id 어트리뷰트 값으로 요소 노드를 하나 선택한다. 여러개가 선택되면 첫번째 요소를 반환한다.
* Return: HTMLElement를 상속받은 객체

`document.querySelector(cssSelector)`

* CSS 셀렉터를 사용해서 요소 노드 한 개를 선택하고, 여러개 선택한 경우 역시 첫번째 요소만 반환한다.
* Return: HTMLElement를 상속받은 객체



##### 2) 여러 개의 요소 노드 선택

`document.getElementsByClassName(class)`

* class 어트리뷰트 값으로 요소 노드를 모두 선택하고 공백 구분으로 여러개의 클래스를 지정할 수 있다.
* Return : HTMLCollection(live)
* 리턴 값이 HTMLCollection인 것은 복수 개가 반환될 때 리스트를 담아 반환하기 위한 객체인데, 배열과 비슷하지만 배열은 아닌 유사 배열 형태이다. 중요한 것은 **HTMLCollection은 실시간으로 Node의 상태 변경을 반영**한다. 

`document.getElementsByTagName(tagName)`

* 태그명으로 요소 노드를 모두 선택한다.
* Return : HTMLCollection (live)

`document..querySelectorAll(selector)`

* 지정된 CSS 선택자를 사용해서 요소 노드 모두를 선택한다.
* Return: NodeList(non-live)





##### 3) DOM traversing (탐색)

`parentNode`

* 부모 노드를 탐색한다.
* Return: HTMLElement를 상속받은 객체

`firstChild`,`lastChild`

* 자식 노드를 탐색한다.
* Return: HTMLElement를 상속받은 객체

`hasChildNodes()`

* 자식 노드 확인 후 유무에 따라 Boolean값 반환한다.
* Return: Boolean

`childNodes`

* 자식 노드의 컬렉션 반환. 텍스트 요소를 포함한다.
* Return: NodeList (non-live)

`children`

* 자식 노드의 컬렉션을 반환하는데 `Element`요소만 반환한다.
* Return: HTMLCollection (live)

`previousSibling`, `nextSibling` 

* 형제 노드를 탐색하며, 텍스트 요소를 포함한다.
* Return: HTMLElement를 상속받은 객체

`previousElementSibling`, `nextElementSibling` 

* 형제 노드를 탐색하며, `Element`요소만 탐색한다.
* Return: HTMLElement를 상속받은 객체





DOM 을 조작하고 수정하는 **DOM Manipulation**에 대해서는 다음 포스트에 다루도록 하겠다.





---





### 출처

> 1. [MDN web docs DOM 소개]([https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/%EC%86%8C%EA%B0%9C](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/소개))
> 2. [poiemaWeb DOM](https://poiemaweb.com/js-dom)



