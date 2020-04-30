---
title: 'DOM Manipulation(조작)'
date: 2020-4-30 22:00:00
category: 'Web'
draft: false

---



[지난 포스트](https://ykss.netlify.app/web/DOM/)에서 DOM은 무엇이고 어떻게 접근하는지에 대해서 알아보았다. 이번에는 접근한 DOM을 어떻게 다룰 수 있는지에 대해 알아보려고 한다.



#### 1. 텍스트 노드 조작

요소의 텍스트는 텍스트 노드에 저장되어 있고, 텍스트 노드에 접근하기 위해서는 요소 노드인 부모 노드를 거쳐야 한다. 텍스트 노드는 유일한 프로퍼티인 `nodeValue`를 가지고 있고 `nodevalue`를 이용하여 텍스트를 수정할 수 있다.



`nodeValue`

* 노드의 값을 반환한다.
* Return: 텍스트 노드의 경우 문자열, 요소 노드의 경우 `null`을 반환한다.
* 이밖에도 `nodeName`, `nodeType`을 통해 노드의 정보를 얻을 수 있다.





#### 2. 어트리뷰트 노드 조작

어트리뷰트 노드 조작할 때 주로 쓰이는 프로퍼티와 메서드는 다음과 같다.



`className`

* `class` 어트리뷰트 값을 취득하거나 변경한다. `className` 프로퍼티에 값을 할당하는 경우에 `class` 어트리뷰트가 존재하지 않으면 동적으로 생성 후 할당한다. `class`값이 여러개면 공백으로 구분하여 문자열을 반환하기 때문에 `String`메서드인 `split(' ')`을 사용해서 배열로 바꿔 사용한다.



`classList`

* `add`, `remove`, `item`, `toggle`, `contains`, `replace` 메서드를 제공한다. 



`id` 

* `id` 어트리뷰트의 값을 취득하거나 변경한다. `id` 프로퍼티에 값을 할당할 떄, 존재하지 않으면 동적으로 생성하여 할당한다.



`hasAttribute(attribute)`

* 지정된 어트리뷰트 값이 존재하는지 여부를 체크한다.
* Return: Boolean



`setAttribute(attribute, value)`

* 어트리뷰트와 어트리뷰트 값을 설정한다.
* Return: undefined



`removeAttribute(attribute)`

* 지정된 어트리뷰트를 제거한다.
* Return: undefined





#### 3. HTML 콘텐츠 조작

`HTML` 콘텐츠를 조작하기 위해서 아래 프로퍼티와 메서드를 사용할 수 있다. 하지만 마크업이 포함된 콘텐츠 추가는 `XSS`공격에 취약하므로 주의해야 한다.



`textContent`

* 요소의 텍스트 콘텐츠를 취득하거나 변경한다. 이때 마크업은 무시되고, `textContent` 요소에 새로운 텍스트를 할당하는 방식으로 텍스트를 변경할 수 있다. 텍스트만 지정되어야 하고 마크업을 포함시키면 그것 또한 문자열로 인식된다.



`innerText`

* `innerText`프로퍼티로 요소의 텍스트 컨텐츠에 접근할 수 있지만 비표준이고, CSS를 고려해야 하므로 `textContent` 프로퍼티보다 느리다.
* CSS에 의해 비표시(visibility:hidden;)로 지정되어있으면 반환되지 않는 것처럼 CSS에 순종적이다.



`innerHTML` 

* 해당 요소의 모든 자식 요소를 포함하는 모든 콘텐츠를 하나의 문자열로 취득할 수 있고, 마크업을 포함한다.







#### 4. DOM 조작 방식

DOM을 조작하면 `innerHTML` 프로퍼티를 사용하지 않고도 새 콘텐츠를 추가할 수 있다. 

1) 요소 노드 생성 `createElement()` 메서드로 새로운 요소 노드를 생성한다. `createElement()` 메소드의 인자로 태그 이름을 전달한다.

2) 텍스트 노드 생성 `createTextNode()` 메서드를 사용해서 텍스트 노드를 생성한다.

3) 생성된 요소를 DOM에 추가하는 `appendChild()` 메서드를 사용해서 생성된 노드를 DOM tree에 추가한다. 



`createElement(tagName)`

* 태그 이름을 인자로 전달해서 요소를 생성한다.
* Return: HTMLElement를 상속받은 객체



`createTextNode(text)`

* 텍스트를 인자로 전달하여 텍스트 노드를 생성한다.
* Return: Text 객체



`appendChild(Node)`

* 인자로 전달한 노드를 마지막 자식 요소로 DOM에 추가한다.

* Return: 추가한 노드



`removeChild(Node)`

* 인자로 전달한 노드를 DOM 트리에서 제거한다.
* Return: 제거한 노드





#### 5. insertAdjacentHTML()

`insertAdjacentHTML(position,string)`

* 인자로 전달한 텍스트를 HTML로 파싱해서 그 결과로 생성된 노드를 DOM트리의 인자를 통해 전달된 지정된 위치에 삽입한다. 첫번째 인자가 삽입 위치이고, 두번째 인자가 표현할 문자열이다. 첫번째 인자가 될 수 있는 값은 `beforebegin`, `afterbegin`, `beforeend`, `afterend` 이다.



#### 6. innerHTML vs DOM 조작방식 vs insertAdjacentHTML()



`innerHTML`

* DOM 조작 방식에 비해서 간편하다. 하지만 XSS 공격에 취약한 문제가 있다.
* 해당 요소의 내용을 덮어 쓰기 때문에 HTML을 다시 파싱하는 과정을 거쳐 비효율적이다.



`DOM 조작방식`

* 특정 노드 한개를 DOM에 추가할 때 적합하지만 innerHTML보다 느리고 더 많은 코드가 필요하다.



`insertAdjacentHTML()`

* 간편하게 문자열로 정의된 여러 요소를 DOM에 추가할 수 있지만, `innerHTML`처럼 XSS 공격에 취약하다.
* 삽입되는 위치를 선정할 수 있다.







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

> 1. [poiemaWeb DOM](https://poiemaweb.com/js-dom)



