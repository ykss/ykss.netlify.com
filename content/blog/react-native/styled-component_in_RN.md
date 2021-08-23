---
title: '[리액트네이티브] RN에서 styled-component 사용하기'
date: 2021-08-24 01:00:00
category: 'ReactNative'
draft: false
---

이번에 리액트 네이티브를 처음 사용하면서, 일단 익숙하다는 핑계로 제대로 알아보지도 않고 `stlyed-component`를 사용하려고 했다. 기본적으로 리액트 네이티브에서는 `stylesheet`을 이용해서 스타일링하기 때문에 어떤 방법으로 스타일링하는게 좋을지, 또는 둘 다 함께 혼용해도 괜찮을지에 대해서 알아보려고 한다.

## 1. React-Native의 스타일링

기본적으로 React Native의 경우 StyleSheet을 사용하여 스타일링한다. 물론 아래와 같이 컴포넌트에 직접 인라인 스타일링도 가능하다. 물론 이렇게 스타일링해도 스타일링 자체에 문제가 되는 것은 아니지만, 렌더링할 컴포넌트 구조를 파악하는데 불필요한 스타일링 코드 들이 혼재하다 보니 가독성 면에서 많이 조잡해보이고 파악하기 어려운 단점이 있다.

```tsx
import * as React from 'react'
import { Text, View, StyleSheet } from 'react-native'

export default function App() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Hello RN Styling!
      </Text>
    </View>
  )
}
```

그리고 위의 스타일 객체를 주목해보면 프로퍼티의 이름이 기존 CSS에서는 `align-items`나 `justify-content`와 같이 `-`을 통해 연결되는 경우가 많은데 RN에서 기본적으로 사용하는 속성들은 CamelCase로 표현되어 `alignItems`나 `justifyContent`와 같이 표현된다. 그리고 수치를 표시할 때, `px`과 같은 단위를 입력하지 않는다. 그리고 숫자가 아닌 값을 입력할 때 ``로 묶어줘야 하는 불편함도 존재한다. 물론 많은 부분이 기존 CSS와 많이 유사해서 스타일링 적응하기가 쉽구나~ 하는 생각이 들 수도 있지만 엄연히 다른 점들이 많이 존재하기 때문에 오히려 CSS에 익숙한 경우에는 불 필요하게 헷갈리고 귀찮은 점이 될 수 있다.

## 2. 더 깔끔한 코드를 위한 StyleSheet 스타일링

기본적인 인라인(inline) 방식으로 스타일링을 하는게 편할 수는 있지만 결국은 스타일링 코드가 많아지다 보면 이렇게 쓰면 안되겠구나...하는 생각과 매우 번잡하다는 생각이 들게 된다. 그래서 style 코드를 따로 떼다가 분리해서 쓰는 방식이 바로 `StyleSheet.create`이다.

```tsx
function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.yellow}>Yellow</Text>
      <Text style={styles.blue}>Blue</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  blue: {
    color: 'blue',
    fontSize: 50,
  },
  yellow: {
    color: 'yellow',
  },
})

export default App
```

위 예시 코드와 같이 `StyleSheet`을 만들어 놓고 여러가지 스타일 객체 중에 각 컴포넌트에 원하는 스타일 객체를 적용하는 방법이다. 이렇게하면 컴포넌트 부분에서는 굳이 스타일 코드들을 볼 필요없이 간결하게 컴포넌트 구조만 확인이 가능하고, Styling 코드들은 따로 분리하여 모아둬 깔끔하다는 장점이 있다.

## 3. 그렇다면 styled-components는?

보통의 경우 리액트에서 스타일링을 할 때는 스타일시트 파일과 컴포넌트에 `className`을 지정하여 스타일링하는데, 이렇게 별도의 파일로 스타일시트를 둘 경우, 해당 파일의 부피가 커지다보면 CSS 파일이 엄청 늘어나게 되고 프로젝트가 복잡해지기 시작한다.

나도 그래서 주로 리액트로 웹 개발을 할 때, `Styled-Components`를 사용하곤 했었다. 그 이유는 `CSS-in-JS` 방식으로 일단 따로 `.css` 파일이나 `.scss` 등의 스타일 시트를 여러개 만들어야 할 필요가 없었고, 자바스크립트 코드 내에서 일반적인 css를 사용하여 스타일링 할 수 있기 때문에 익숙함이 있었다. 게다가 스타일된 컴포넌트들을 여러개 만들어 놓고 그걸 재사용할 수 있기도 편하다는 점도 있었다. `CSS-in-JS` 방식으로 스타일링하는 것이 `emotion, jss`등 다른 라이브러리도 있었지만 가장 인기 있는 것은 Styled-component이다.

기본적으로 Styled-component의 코드는 아래와 같다.

```tsx
const Button = styled.a`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: transparent;
  color: white;
  border: 2px solid white;

  ${props =>
    props.primary &&
    css`
      background: white;
      color: palevioletred;
    `}
`
render(
  <div>
    <Button
      href="https://github.com/styled-components/styled-components"
      primary
    >
      GitHub
    </Button>
  </div>
)
```

위의 코드를 보면 Styled-components의 특징에 대해서 나와 있다. 형태는 기존 태그에 백틱(`)을 사용하여 백틱 내에 css 코드 및 scss 코드를 자유롭게 입력할 수 있도록 하는 것인데, 이렇게 스타일링을 하고 나서 단순하게 스타일링된 컴포넌트의 이름을 jsx코드 내에서 해당 이름을 태그로한 컴포넌트를 사용하기만 하면 된다. 그런 면에서 렌더링하는 컴포넌트가 매우 간단하게 보일 수 있고, 붎필요하게 여러 컴포넌트들 마다 모두 클래스를 붙이지는 않아도 된다는 장점이 있다. 이밖에 간단하게 Styled-components의 특징에 대해서 알아보자.

1. Styled-Components는 공식적으로 리액트 네이티브에서도 지원된다.

2. No-class Policy
   가능한 class를 만들지 않고 props를 사용하는 것을 권장한다. 아래와 같이 컴포넌트를 사용할 때 넣어준 props를 스타일링 코드에서도 이용이 가능하다. 이 점은 매우 큰 유연성을 제공한다.

```tsx
const Subtitle = styled.h2`
  font-size: 2em;
  color: ${props => (props.primary ? 'red' : 'green')};
`
<Subtitle primary>Hello World</Subtitle>
```

3. 재사용성이 높다.

```tsx
const whiteText = css`
  color: #fff;
  font-size: 14px;
`

const MyBoldTextComponent = styled.Text`
  ${whiteText}
  font-weight: 600
`

const MyLightTextComponent = styled.Text`
  ${whiteText}
  font-weight: 200
`
const StyledText = styled.Text`
  color: #000;
  font-size: 20px;
  margin: 10px;
  padding: 10px;
`
const ErrorText = styled(StyledText)`
  font-weight: 600;
  color: red;
`
```

위와 같이 공통적인 스타일은 그대로 적용할 때, 중복되는 스타일을 재사용 가능하도록 관리할 수 있다.

4. ThemeProvider를 통해 context API 방식과 같이 전역 스타일을 제공가능하다.

```tsx
/* src/theme.js */
export const lightTheme = {
  background: '#ffffff',
  text: '#ffffff',
  purple: '#9b59b6',
  blue: '#3498db',
}

export const darkThme = {
  background: '#34495e',
  text: '#34495e',
  purple: '#9b59b6',
  blue: '#3498db',
}

/* App.js */
const App = () => {
  const [isDark, setIsDark] = useState(false)
  const _toggleSwitch = () => setIsDark(!isDark)

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <Container>
        <Switch value={isDark} onValueChange={_toggleSwitch} />
      </Container>
    </ThemeProvider>
  )
}

export default App
```

위와 같이 다크모드 적용도 가능하다.

5. 서버사이드렌더링을 지원한다.

6. CSS 테스팅이 간편하다. (jest-styled-components 이용)

7. Typescript를 사용할 경우, Props에 대한 타입 인터페이스 적용이 가능하다.

```tsx
export interface ButtonInterface = {
   active?: boolean;
   label: string;
   disabled: boolean;
}
export const StyledButton = styled.TouchableOpacity<ButtonInterface>`
   color: ${props => props.active === undefined
      ? `gray`
      : props.active === true
         ? `green`
         : `gray`
   };
   opacity: $props => props.disabled === undefined
     ? 1
     : props.disabled === true
        ? 0.5
        : 1
   };
`;
```

위에 4번, 6번 특징의 경우는 사실 아직 제대로 적용해 본 적이 없기 때문에 체감상 와닿지는 않지만 이렇게나 여러가지 장점들이 존재한다.

## 4. 리액트 네이티브에서 Styled-components를 쓰며 느낀점

먼저, 중간 중간 어디까지 styled-component화 해야될지에 대해서 고민하게 되었다. 간단한 스타일을 적용하는 경우에 굳이 하나의 스타일드 컴포넌트를 더 만들어야 할지 아니면 그냥 해당 부분은 인라인 스타일로 넣을지 고민이 되는 부분이다. 지금 하고 있는 개발에서는 스타일적용이 적게 필요한 경우, 인라인 스타일을 혼용하기도 했다.

className을 사용하지 못한다는 것이나 rem과 같이 여러가지 단위를 사용하지 못하는 부분은 사실 스타일드컴포넌트의 문제가 아니고 RN 자체의 문제이기 때문에 어느정도 불편함은 감수해야겠다.

그래도 포스팅을 정리하며 styled-components의 여러가지 장점들을 알았기 때문에 이러한 장점들을 바탕으로 했을 때 충분히 쓸만한 이유가 있다고 생각이 들었다. 가능한(!) 이 장점들을 활용한 개발을 해야겠다.

---

출처

1. [스타일드 컴포넌트를 사용하는 이유](https://eunbin00.tistory.com/31)
2. [react-native 프로젝트의 style에 대해서 알아보기](https://velog.io/@jinsunee/react-native-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%9D%98-style%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0)
