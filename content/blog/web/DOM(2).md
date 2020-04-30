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





---





### 출처

> 1. [poiemaWeb DOM](https://poiemaweb.com/js-dom)



