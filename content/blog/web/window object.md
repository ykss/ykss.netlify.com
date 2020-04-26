# window object



전역에 `a`라는 변수를 선언 시 `window.a`로도 호출이 가능하다. `window`에는 여러가지 프로퍼티와 메서드가 존재한다. `window.location`을 통해서 현재 브라우저의 주소를 확인하는 것이 가능하다. 그리고 값 수정을 통해 페이지를 이동하는 것도 가능하다. `window.navigator`는 브라우저 자체의 정보를 확인할 수 있고, `window.screen`에서는 현재 디스플레이의 사이즈 등 정보를 알 수 있다. 하지만 `window`객체에서 가장 중요하고 많이 쓰이는 것은 `window.document`이다. `window.document`에는 `HTML`과 `CSS`가 모두 저장되어 있어서 이 객체를 통해서 `HTML`과 `CSS`에 접근하고 해당 부분을 변경하거나 삭제하고 추가하는 것도 가능하다. 





# DOM

자바스크립트가 `HTML`에 접근 가능한 것은 **DOM(Document Object Model)**때문이다. DOM은 일종의 인터페이스라고 할 수 있다.  쉽게 풀어서 얘기하면 **컴퓨터가 문서를 잘 처리할 수 있도록 문서에 대한 구조를 정해놓은 것**이라고 할 수 있다. DOM은 Tree 형태를 유지하고 있다. `parent-children` 구조라고 할 수도 있다. `document` 오브젝트는 자바스크립트에서 `document`로 접근 가능하다. 브라우저 콘솔에서 `document.children`을 통해서 어떤 `children`이 있는지 확인할 수 있고, `document.parentNode`등도 가능하다. 이런 것처럼 `document` 객체를 이용하여 `HTML` 구조를 쉽게 이용 할 수 있다. 게다가 `document`에서 사용가능한 여러가지 API 등을 통해 더 손쉽게 이용할 수 있다. 위에 예시로 든 `.children`이나 `.parentNode`외에도 `.firstElementChild`나 `.lastElementChild`를 통해서 자식이나 부모 엘리멘트에 접근할 수 있고 `.nextElementSibling`이나 `.previousElementSibling`을 통해 같은 레벨의 엘리먼트에 접근하는 것도 가능하다.

