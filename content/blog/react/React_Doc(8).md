---
title: '[리액트 주요 개념] 폼
date: 2020-12-05 01:00:00
category: 'React'
draft: false
---

![리액트](./images/react-logo.png)

## 제어 컴포넌트
HTML에서는 `<input>`,`<textarea>`,`<select>`와 같은 폼 엘리먼트가 사용자 입력 기반으로 자신의 state를 관리하고 업데이트 한다. 리액트에서는 컴포넌트의 state 속성에 유지되고 `setState()`에 의해 업데이트된다. 리액트의 state를 **신뢰 가능한 단일 출처**로 만들어서 결합하는 것이 가능하다. 폼을 렌더링하는 리액트 컴포넌트는 폼에 발생하는 사용자의 입력 값을 제어한다. 이런 방식으로 리액트에 의해 값이 제어되는 폼 엘리먼트가 **제어 컴포넌트**이다.

```javascript
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```
`value` 어트리뷰트는 폼 엘리먼트에 설정되기 때문에 표시되는 값은 항상 `this.state.value`가 된다. 여기서 state가 신뢰 가능한 단일 출처가 되는 것이다. `handleChange`가 동작하고 해당 메서드에서 state를 변경하기 때문에 계속 값이 업데이트된다. 


## textarea 태그
리액트에서 `<textarea>`는 `value` 어트리뷰트를 사용한다. 그럼 아까 전 코드의 폼과 유사하게 작성 가능하다. 


## select 태그
리액트에서 `<select>`는 `selected` 어트리뷰트 대신 `value` 어트리뷰트를 사용한다. 전반적으로 `<input>`,`<textarea>`,`<select>` 모두 비슷하게 작성하여 동작한다. 모두 `value` 어트리뷰트를 사용한다. `select` 태그에서 `multiple={true}`와 같이 옵션을 허용하면 `value`에 `value={['B', 'C']}`와 같이 배열을 전달 할 수도 있다.


## 제어 컴포넌트의 대안
제어 컴포넌트를 사용하려면 데이터를 변경하는 모든 방법에 대해 이벤트 핸들러를 작성해야하고 모든 상태를 연결해야되기 때문에 그것이 번거로울 수 있다. 이러한 경우 대안으로 입력 폼을 구현하기 위해 `비제어 컴포넌트`를 쓸 수도 있다. [여기](https://ko.reactjs.org/docs/uncontrolled-components.html)를 누르면 비제어 컴포넌트에 대해 확인할 수 있다. 


출처 : [리액트 주요 개념안내서](https://ko.reactjs.org/docs/hello-world.html)
