---
title: '리액트 다루는 기술 정리 (6) - SPA와 리액트 라우터'
date: 2021-06-22 18:00:00
category: 'React'
draft: false
---

# 13. 리액트 라우터로 SPA 개발하기

## 13.1 SPA란?

Single Page Application의 약자로 한 개의 페이지로 이뤄진 어플리케이션을 의미한다. 전통적인 웹페이지는 여러 페이지로 구성되어 있고, 다른 페이지로 이동할 때마다 해당 페이지의 html을 서버에서 새로 받아오고, 해당 페이지에 해당하는 리소스들을 받아서 화면에 보여주었다. 하지만 요즘은 웹에 보여줄 화면이 너무 많익 떄문에 새로운 화면을 보여 줄 때, 매번 서버측에서 뷰를 준비하면 성능상 이슈가 생길 수 밖에 없다. 특히 사용자와 인터렉션이 자주 발생하는 애플리케이션이라면 더 그렇다.

그렇기 때문에 리액트와 같은 라이브러리나 뷰와 같은 프레임워크를 사용하여 뷰 렌더링은 브라우저가 담당하도록 하고, 사용자와의 인터렉션이 발생할 경우 필요한 부분만 JS를 사용해 업데이트하는 방식으로 발전하였다. 데이터가 갱신되어야 하는 경우에는 API를 통해 필요한 데이터만 새로 갱신받아 보여줄 수도 있다. SPA 방식에서는 html은 하나만 초기에 가져오고 그 이후에는 데이터만 JSON과 같은 형태로 필요시 송수신한다.

그렇다면 SPA로 만든 페이지에서는 페이지가 하나이기 때문에 여러 메뉴가 있는 페이지를 나타내지 못할까? 그렇지않다. 그때 필요한 게 바로 라우팅이다. 라우팅은 다른 주소의 화면을 보여주는 것이다. 리액트 라이브러리 자체에 라우터 기능이 내장되어 있지는 않으나, 브라우저 API를 통해서 관리하거나 라이브러리를 사용하여 쉽게 구현이 가능하다. 라우팅 라이브러리로는 react-router나 Next.js 등이 대표적이다. 리액트 라우터는 주로 클라이언트 사이드에서 이뤄지는 라우팅을 간단히 구현할 수 있도록 해준다.

### 13.1.2 SPA의 단점

SPA의 경우, 규모가 커지만 JS 파일이 너무 커질 수 있다. JS 파일이 너무 커지면 페이지 로딩 시 사용자가 실제로 방문하지 않을 수 있는 페이지의 스크립트도 모두 불러와야 하기 때문에 오래걸릴 수 있다. 하지만 이후 등장한 코드 스플리팅(cod splitting)을 사용하면 라우트 별로 파일을 나눠 트래픽과 로딩 속도를 개선할 수 있다.

이밖에도 SEO(Search Engine Optimizaion)이라고 불리는 검색엔진 최적화 부분에서도 SPA의 경우 일반 적인 크롤러에서는 JS에 담긴 페이지 정보를 제대로 수집하지 못하기 때문에 검색 결과에 페이지가 잘 반영되지 않을 수 있다. 구글에서는 JS 크롤링도 지원하지만 다른 검색엔진은 지원하지 않는 경우가 많다. 또 JS가 로딩되기 전까지는 짧은 시간 페이지에 흰 페이지만 나타날 수도 있다는 단점이 있지만 이러한 단점은 Next.js와 같은 서버 사이드 렌더링을 통해 해결이 가능하다.

## 13.2 react-router-dom 사용법

일단 `npm i react-router-dom` 과 같은 명령어로 라이브러리를 설치해야 한다. 그리고 `index.js` 파일에 react-router-dom의 내장 컴포넌트인 `BrowserRouter` 라는 컴포넌트로 `App` 컴포넌트를 감싸주면 된다. 해당 컴포넌트를 통해 HTML5의 History API를 이용하여 페이지를 새로고침 없이도 주소를 변경하고 현재 주소의 정보를 props로 쉽게 조회하고 이용할 수 있도록 할 수 있다.

Route 컴포넌트로 특정 주소에 컴포넌트를 연결하기 위해서는 `Route` 컴포넌트를 아래와 같이 사용하면 된다.

`<Route path="/" component = { Home } />` 그리고 보통 Home 경로에 Route 컴포넌트를 사용할 때는 exact라는 props를 true로 사용하여 원하는 컴포넌트만 표시될 수 있도록 한다.

리액트 컴포넌트에서는 a 태그를 통해 페이지를 전환해서는 안된다. 페이지 전환 과정에서 페이지를 새로 불러오기 때문에 애플리케이션의 상태 정보가 모두 날아가기 때문이다 그렇기 때문에 Link 컴포넌트를 통해 페이지를 전환해야, HTML5의 History API를 통해서 페이지의 주소만 바꿔줄 수 있다. Link 컴포넌트는 a 태그와 함께 페이지 전환을 방지하는 기능이 내장되어 있다. Link 컴포넌트는 다음과 같이 사용한다. `<Link to="/">홈</Link>`

Route 하나에 여러 개의 path를 지정할 수도 있다. `<Route path={['/about', '/info']} component={About} />` 와 같이 사용하면 된다.

## 13.3 URL 파라미터와 쿼리

- 파라미터 : /profile/ykss
- 쿼리 : /profile?details=true

파라미터는 주로 조회할 때 사용하고, 쿼리는 어떤 키워드를 검색하거나 페이지에 필요한 옵션을 전달할 때 사용한다.

### 13.3.1 URL 파라미터

URL 파라미터를 사용할 때는 라우트로 사용되는 컴포넌트에서 받아오는 match 라는 객체의 params 값을 참조한다. match 객체 안에는 현재 컴포넌트가 어떤 경로 규칙에 의해 보이는지가 나타나있다. path 규칙에는 `/profile/:playername` 과 같은 형식으로 넣어주면 된다. 그렇게하면 match.params.playername처럼 접근하여 값 조회가 가능하다.

```jsx
// Profile 컴포넌트

function Profile({ match }) {
  const { playername } = match.params
  const profile = data[playername]
  if (!profile) {
    return <div>존재하지 않는 선수 입니다.</div>
  }
  return (
    <>
      <h2>{profile.name}</h2>
      <p>포지션 : {profile.position}</p>
    </>
  )
}

export default Profile

// App 컴포넌트 Route 설정

function App() {
  return (
    <div>
      <ul className="nav">
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/about">소개</Link>
        </li>
        <li>
          <Link to="/profile/mount">Mount</Link>
        </li>
        <li>
          <Link to="/profile/werner">Werner</Link>
        </li>
      </ul>
      <div className="App">
        <Route path="/" component={Home} exact={true} />
        <Route path={['/about', '/info']} component={About} />
        <Route path="/profile/:playername" component={Profile} />
      </div>
    </div>
  )
}

export default App
```

### 13.3.2 URL 쿼리

URL 쿼리는 location 객체에 들어 있는 search 값을 통해 조회가 가능하다. location 객체는 라우트로 사용된 컴포넌트에 props로 전달되고 웹 애플리케이션의 현재 주소에 대해 정보를 지니고 있다. location의 형태를 아래와 같다.

```jsx
// http://localhost:3000/about?detail=true 일 경우 location 객체
{
	"pathname" : "/about",
	"search" : "?detail=true",
	"hash": ""
}
```

여기서 우리가 쿼리로 읽을 때는 search 값을 확인해야 한다. 이 값은 문자열로 되어있는데, search 값에서 특정 값을 읽어오려면 이 문자열을 객체 형태로 변환해야하고, 그때 주로 `qs`라는 라이브러리를 사용한다.

```jsx
function About({ location }) {
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true, // 쿼리 문자열 맨 앞의 ? 생략
  })
  const showDetail = query.detail === 'true' // 쿼리 파싱 결과 값은 문자열

  return (
    <div>
      <h1>사이트 소개 페이지 입니다.</h1>
      <p>개발자 정보와 만든 이유, 연락처 등을 표시</p>
      {showDetail && <p>디테일 값이 true 일때 표시됩니다.</p>}
    </div>
  )
}

export default About
```

쿼리를 사용할 때는 쿼리 문자열을 객체로 파싱하는 과정에서 결과 값은 항상 문자열이다. 쿼리 값이 boolean 형태여도 문자열 형태로만 받아진다. 그렇기 때문에 문자열과 일치하는지 비교해주어야 한다.

![결과](https://ifh.cc/g/eKQWox.jpg)

## 13.4 서브 라우트

서브 라우트는 라우트 내부에 또 라우트를 정의하는 것인데 라우트 컴포넌트 내에 Route 컴포넌트를 또 사용하면 된다. Route 컴포넌트에 component 대신 render라는 props를 넣어주면 보여주고 싶은 JSX를 넣을 수 있다. 따로 컴포넌트를 만들기는 애매할 때 사용한다. 아래와 같이 라우트를 통해 접근한 컴포넌트에서 또 라우트 하는게 가능하다.

```jsx
//Profiles.js
function Profiles() {
  return (
    <div>
      <h3>선수 목록</h3>
      <ul>
        <li>
          <Link to="profiles/mount">Mount</Link>
        </li>
        <li>
          <Link to="profiles/werner">Werner</Link>
        </li>
      </ul>
      <Route
        path="/profiles"
        exact
        render={() => <div>선수를 선택해주세요.</div>}
      />
      <Route path="/profiles/:playername" component={Profile} />
    </div>
  )
}

export default Profiles

//App.js
function App() {
  return (
    <div>
      <ul className="nav">
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/profiles">선수 프로필</Link>
        </li>
        <li>
          <Link to="/about">페이지 소개</Link>
        </li>
      </ul>
      <div className="App">
        <Route path="/" component={Home} exact={true} />
        <Route path={['/about', '/info']} component={About} />
        <Route path="/profiles" component={Profiles} />
      </div>
    </div>
  )
}

export default App
```

## 13.5 리액트 라우터 부가 기능

### 13.5.1 history

history 객체는 라우트로 사용된 컴포넌트에 match, location과 함께 전달되는 props로 이 객체를 통해서 컴포넌트 내에 메서드에서 라이터 API를 호출할 수 있다. 특정 버튼을 눌렀을 때 뒤로가거나 다른 페이지로의 이탈을 방지하거나 할 때 활용한다.

```jsx
const handleGoBack = () => {
  history.goBack()
}

const handleGoHome = () => {
  history.push('/')
}

return (
  <div>
    <button onClick={handleGoBack}>뒤로</button>
    <button onClick={handleGoHome}>홈으로</button>
    <h1>사이트 소개 페이지 입니다.</h1>
    <p>개발자 정보와 만든 이유, 연락처 등을 표시</p>
    {showDetail && <p>디테일 값이 true 일때 표시됩니다.</p>}
  </div>
)
```

### 13.5.2 withRouter

withRouter 함수는 HoC(Higher-order Component)이다. 라우트로 사용되지 않은 컴포넌트에서도 match, location, history에 접근할 수 있도록 해준다. 단지 `import { withRouter } from 'react-router-dom';` 과 같이 불러와서 구조분해 할당으로 `{location, match, history}` 과 같이 사용할 수 있다.

### 13.5.3 Switch

Switch 컴포넌트는 여러 Route를 감싸고 그중 일치하는 하나의 라우트만 렌더링해준다. 모든 규칙과 일치하지 않을 때는 Not Found 페이지로 연결해줄 수도 있다.

```jsx
<Switch>
  <Route path="/" component={Home} exact={true} />
  <Route path={['/about', '/info']} component={About} />
  <Route path="/profiles" component={Profiles} />
  <Route
    render={({ location }) => (
      <div>
        <h2>Page not Found</h2>
        <p>{location.pathname} 페이지가 존재하지 않습니다.</p>
      </div>
    )}
  />
</Switch>
```

![page not found](https://ifh.cc/g/xg65EI.jpg)

### 13.5.4 NavLink

NavLink는 현재 경로와 Link에서 사용하는 경로가 일치하는 경우 특정 스타일이나 CSS 클래스를 적용할 수 있는 컴포넌트이다. NavLink가 활성화 되었을 때 스타일은 activeStyle, CSS 클래스는 activeClassName 값을 props로 넣어주면 된다. 현재 경로가 활성화되어있다는 것을 나타내는 것이다.

```jsx
				<li>
					<NavLink to="/" activeStyle={activeStyle} exact>
            홈
          </NavLink>
        </li>
        <li>
          <NavLink to="/profiles" activeStyle={activeStyle}>
            선수 프로필
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" activeStyle={activeStyle}>
          페이지 소개
          </NavLink>
				</li>
```

![NavLink](https://ifh.cc/g/WX0cRJ.jpg)

---

참고

1. [리액트를 다루는 기술](https://book.naver.com/bookdb/book_detail.nhn?bid=15372757)
