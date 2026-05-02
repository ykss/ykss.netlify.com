---
title: '(번역) 2026년판 자바스크립트 개발자가 알아야 할 것들'
date: 2026-05-07 09:30:00
category: 'Translation'
draft: false
---

> 원문: [What To Know in JavaScript (2026 Edition)](https://frontendmasters.com/blog/what-to-know-in-javascript-2026-edition/)

[CSS에 대해서는 이런 글을 작성한 적이 있는데](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-2025-edition/), 자바스크립트도 마찬가지로 다뤄봐야겠습니다! 특히 자바스크립트는 버전 관리가 훨씬 잘 이루어지니까요. 언어의 새로운 기능을 살펴보겠지만, 자바스크립트 개발자로 일한다는 건 언어 그 자체를 넘어 런타임, 프레임워크, 라이브러리, 툴링까지 아우르는 일입니다. 자, 시작해봅시다. 어차피 이미 아래로 스크롤했겠지만요.

## 언어의 새로운 기능

자바스크립트는 매년 버전이 릴리스됩니다. 꽤 좋은 방식이라고 생각합니다!

### ECMAScript 2025

가장 최신 버전은 **ECMAScript 2025**로, 2025년 6월에 출시됐습니다. [전체 스펙은 이 버전에서 확인할 수 있습니다](https://tc39.es/ecma262/2025/).

#### 이터레이터 헬퍼(Iterator Helpers)

이제 이터레이터에서 직접 `.map()`, `.filter()`, `.take()`, `.drop()` 같은 메서드를 지연 평가(lazy evaluation) 방식으로 사용할 수 있습니다. 솔직히 주로 프런트엔드 일을 하는 저 같은 사람 입장에서는 좀 생소하게 느껴집니다. 배열에서 이미 map을 쓸 수 있는데 뭐가 대단하냐고요? 하지만 성능 측면에서는 분명히 의미가 있습니다.

```javascript
const result = array
  .map(x => x * 2) // 새 배열을 메모리에 생성
  .filter(x => x > 10) // ... 또 생성
  .slice(0, 3); // ... 또 생성
```

배열이 크고 각 연산이 "비용이 많이 든다"면, 이 방식은 느리고 메모리도 많이 씁니다. 새로운 방식은 이렇습니다.

```javascript
const result = Iterator.from(array)
  .map(x => x * 2)
  .filter(x => x > 10)
  .take(3)
  .toArray(); // 중간 배열 생성 없이, 3개를 찾으면 연산을 멈춥니다
```

보너스로 `Iterator.from()`은 이터러블(iterable)한 것이라면 뭐든 동작합니다. 배열뿐 아니라 Set, Map, 제너레이터 등 모두 동일한 메서드 세트를 쓸 수 있습니다.

#### Set 메서드

자바스크립트의 Set은 각 항목이 고유한 배열 같은 자료구조입니다. 이건 새로운 게 아니지만, Set이 *두 개*라면 이야기가 달라집니다. 이제 두 Set을 비교해서 교집합, 차집합 등을 반환하는 메서드가 생겼습니다.

```javascript
const youKnow = new Set(['JS', 'Python', 'CSS', 'SQL']);
const jobNeeds = new Set(['JS', 'TypeScript', 'Python']);

// 채용 공고에서 원하는 기술 중 이미 알고 있는 것
youKnow.intersection(jobNeeds); // → Set {"JS", "Python"}

// 모두 합친 것 — 당신의 전체 스택 + 채용 공고가 원하는 것
youKnow.union(jobNeeds); // → Set {"JS", "Python", "CSS", "SQL", "TypeScript"}

// 채용 공고가 원하지만 아직 모르는 것 (스킬 갭)
jobNeeds.difference(youKnow); // → Set {"TypeScript"}

// 당신이 알지만 채용 공고가 신경 쓰지 않는 것
youKnow.difference(jobNeeds); // → Set {"CSS", "SQL"}

// 한 쪽에만 있는 것, 양쪽 모두에 없는 것
youKnow.symmetricDifference(jobNeeds); // → Set {"CSS", "SQL", "TypeScript"}

// 채용 조건이 당신이 아는 것의 부분집합인가요?
jobNeeds.isSubsetOf(youKnow); // → false

// 당신이 모든 기술을 알고 있고 그 이상인가요?
youKnow.isSupersetOf(jobNeeds); // → false

// 당신과 채용 공고 사이에 겹치는 게 전혀 없나요?
youKnow.isDisjointFrom(jobNeeds); // → false
```

꽤 유용하죠. Claude Code가 이걸로 [인터렉티브 데모를 만들어줬는데](https://codepen.io/editor/chriscoyier/pen/019c9733-c5ed-7594-9bd9-8ed47f3860d1?file=%2Findex.html&orientation=left&show=preview) 재밌었습니다.

#### 정규식(RegEx) 업데이트

상황을 설명하겠습니다. 페이지 내 검색 기능을 만들고 있는데, 사용자가 직접 검색어를 입력합니다. 그 검색어를 정규식으로 사용하려고 하는데, 여기에 위험이 있습니다. 사용자가 입력하는 문자 중 일부는 정규식에서 "특수 문자"로 쓰이기 때문입니다. 예를 들어 `$`는 마지막 문자를 가리키는 식으로요. 그래서 사용자가 `$9`를 검색하면 정규식이 깨집니다. 어떤 문자를 "이스케이프(escape)"해야 하는지는 각 정규식 구현마다 다릅니다.

그래서! 무려 15년에 걸친 여정 끝에 `RegExp.escape()`가 드디어 등장했습니다.

```javascript
const query = userInput; // 예: "$5.00 (off!)"

// ❌ 이전 방식 — 정규식 특수 문자가 있으면 깨짐
const badRe = new RegExp(query, 'g');

// ✅ ES2025 — 메서드 하나로 문제 해결
const goodRe = new RegExp(RegExp.escape(query), 'g');
```

이번에도 [Claude Code가 제법 훌륭한 데모를 만들어줬습니다](https://codepen.io/editor/chriscoyier/pen/019cbeea-b5e2-7af0-acbe-96dab95e0ee8).

정규식 "플래그"가 동작하는 방식도 업데이트됐습니다. 흔히 쓰는 `i` 플래그처럼, 대소문자를 구분하지 않는 옵션을 정규식 끝에 `/i`로 붙이는 방식이 있었죠. 그런데 정규식의 _일부분만_ 대소문자 구분 없이 처리하고 싶다면 어떻게 할까요? 이제는 해당 부분을 괄호로 감싸고 앞에 플래그를 추가하면 됩니다.

```javascript
// 기존 방식 — 대소문자 민감도를 섞을 수 없었음
/[a-z]+@[A-Z]+/i  // 'i' 플래그가 전체에 적용됨

// ES2025 — 그룹별 인라인 수정자
/(?i:[a-z.]+)@(?-i:[A-Z]+)\.(?i:com|org)/
//^^^^ 대소문자 구분 없는 부분
//             ^^^^^ 대소문자 구분하는 부분
//                           ^^^ 대소문자 구분 없는 부분
```

#### Promise 업데이트

모두가 좋아하는 비동기 프로그래밍 모델(Promise)에 `Promise.try()`가 추가되면서 오류 처리를 간소화할 수 있습니다. 어떤 함수는 동기적으로, _또는_ 비동기적으로 에러를 던질 수 있었는데, 각각 따로 처리해야 했습니다. 이제는 한꺼번에 처리할 수 있습니다.

```javascript
// 비동기일 수도, 동기 에러를 던질 수도 있는 함수
function loadUser(id) {
  if (!id) throw new Error('No ID'); // 동기 에러
  return fetch(`/api/users/${id}`); // 비동기
}

// ❌ 이전 방식 — 두 가지 에러 경로 처리
let p;
try {
  p = loadUser(id); // 여기서 동기 에러를 잡고…
} catch (e) {
  handleError(e);
}
p?.catch(e => handleError(e)); // …여기서 비동기 에러를 잡음

// ✅ ES2025 — 한 줄로, .catch() 하나로
Promise.try(() => loadUser(id))
  .then(user => render(user))
  .catch(err => showError(err)); // 둘 다 잡습니다
```

이번에도 [Claude Code가 개념을 잘 설명해주는 데모를 만들어줬습니다](https://codepen.io/editor/chriscoyier/pen/019cc8dc-9bde-7597-9b57-d91d6ef0a6c2).

#### 가져오기 속성

[가져오기 속성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with)은 개인적으로 가장 좋아하는 기능입니다. 정말로요! 우선 JSON 데이터를 fetch하고 파싱하는 과정 없이 그냥 JSON 파일로 바로 임포트할 수 있다는 게 마음에 듭니다.

```javascript
import data from "./file.json" with { type: "json" };
```

`with` 이후의 객체 부분이 바로 "가져오기 속성"입니다. 여기에는 몇 가지 트릭이 더 있는데, 곧 살펴보겠습니다.

JSON 임포트는 보기에도 깔끔하고 코드도 한두 줄 줄어들지만, 솔직히 꽤 주목할 만한 단점도 있습니다. Jake Archibald가 [JSON 임포트 vs 페치](https://jakearchibald.com/2025/importing-vs-fetching-json/)에서 지적한 내용인데요. 한 가지 큰 문제는, 임포트에 실패하면 "모듈 그래프 전체를 망가뜨릴 수 있다"는 점입니다. 꽤 심각하죠. 동적 `import()`를 사용해 실패를 `catch`할 수도 있지만…

```javascript
try {
  const { default: data } = await import(url, {
    with: { type: 'json' },
  });
} catch (error) {
  // 대체 로직
}
```

`fetch`로 JSON을 가져올 때만큼의 유연성은 없어서 여전히 아쉬운 면이 있습니다. Jake는 임포트한 데이터가 "페이지 생명주기 동안 모듈 그래프에 계속 남아 있다"는 점도 짚어줍니다. `fetch` 이후 데이터처럼 가비지 컬렉션(garbage collection)이 되지 않는다는 거죠. 아무튼, 신중하게 사용하세요.

JSON 외에도 가져오기 속성으로 임포트할 수 있는 게 있습니다. 제가 이 기능을 개인적으로 좋아하는 진짜 이유는 CSS를 이런 방식으로 임포트할 수 있다는 점 때문입니다.

```javascript
import componentStyles from "./component.css" with { type: "css" };
```

[웹 컴포넌트와 CSS 모듈 스크립트를 활용한 바닐라 앱 아키텍처](https://frontendmasters.com/blog/architecture-through-component-colocation/)에서 이에 대해 자세히 다뤘습니다. CSS 파일을 자바스크립트 컴포넌트 바로 옆 폴더에 나란히 두면서, CSS는 CSS 파일로 유지할 수 있다는 게 정말 마음에 듭니다.

```javascript
import sheet from './styles.css' with { type: 'css' };

class MyComponent extends HTMLElement {
   constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.adoptedStyleSheets = [sheet];
  }
     ...
```

---

ES2025의 모든 내용을 다룬 건 아니며, 이를 구체적으로 다루는 글도 이미 많이 있습니다. Matthew Tyson의 [ECMAScript 2025: 자바스크립트의 최고 신기능](https://www.infoworld.com/article/4021944/ecmascript-2025-the-best-new-features-in-javascript.html)이 꽤 도움이 됐습니다. `Float16Array` 같은 내용도 다루는데, 제 전문 영역은 아니지만 정밀도와 메모리 사용량 사이에서 트레이드오프가 필요한 상황에서 유용한 기능입니다.

### ECMAScript 2026 (2026년 중반 예정)

2026년 아직 이른 시기지만, 예년처럼 연간 ECMAScript 릴리스가 연중에 나올 것을 기대하고 있습니다. 이미 Stage 4에 진입해 포함될 가능성이 높은 기능들을 소개합니다.

#### Temporal API

자바스크립트에 한동안 추가된 기능 중 가장 기대되고 유용한 기능입니다. 한마디로 요약하면 "이제 라이브러리 없이도 자바스크립트에서 날짜와 시간을 제대로 다룰 수 있다"는 것입니다. 오랫동안 [Moment](https://momentjs.com/) 같은 훌륭한 라이브러리들이 이 빈자리를 채워왔고, 개발자들은 성능과 개발 경험(DX) 사이에서 선택을 강요받아왔습니다 😬.

이 글을 쓰는 시점에 Safari만 [아직 미지원 상태](https://caniuse.com/temporal)이지만, [작업이 진행 중](https://blogs.igalia.com/compilers/2026/01/31/implementing-the-temporal-proposal-in-javascriptcore/)이고 이제 TP(기술 미리보기, Technical Preview)에 들어갔으니 머지않아 지원될 것입니다.

이제 특정 시간대의 현재 시간을 구하는 것이 정말 간단해졌습니다. 라이브러리가 필요 없습니다.

```javascript
const now = Temporal.Now.zonedDateTimeISO('America/New_York');

// 프로그래밍 방식의 날짜
console.log(now.toString());

// 더 읽기 좋은 방식으로...
console.log(now.toLocaleString());
```

[TC39 미팅 어젠다에는 다음 미팅이 당신의 시간대로 언제인지 알려주는 코드가 DevTools 콘솔용으로 올라와 있는데](https://github.com/tc39/agendas/blob/main/2026/03.md), 꽤 재밌었습니다.

```javascript
Temporal.ZonedDateTime.from('2026-03-10T10:00[America/New_York]')
  .withTimeZone(Temporal.Now.timeZoneId()) // 당신의 시간대
  .toLocaleString();
```

멋지죠.

Temporal이 할 수 있는 건 무궁무진하지만, 기존 방식이 특히 엉망이었던 사례 몇 가지를 더 살펴보겠습니다.

1월의 마지막 날에 "한 달을 더하면" 황당한 결과가 나왔습니다.

```javascript
const date = new Date(2026, 0, 31); // 1월 31일
date.setMonth(date.getMonth() + 1); // "한 달 추가"
console.log(date.toDateString()); // Sun Mar 03 2026 ❌ 😬
```

하지만 멋진 Temporal API를 쓰면 올바르게 처리됩니다.

```javascript
const jan31 = Temporal.PlainDate.from('2026-01-31');
const feb = jan31.add({ months: 1 });
console.log(feb.toString()); // 2026-02-28 ✅
```

비교 연산도 이제 올바르게 작동합니다.

```javascript
const a = Temporal.Duration.from({ hours: 25 });
const b = Temporal.Duration.from({ days: 1 });

const cmp = Temporal.Duration.compare(a, b, {
  relativeTo: Temporal.Now.plainDateISO(),
});
console.log(cmp); // 1  (25시간 > 1일) ✅
```

#### 명시적 자원 관리(Explicit Resource Management)

비동기 함수와 await 사용 시 정리(cleanup)를 보장하는 새로운 `using` 키워드가 생겼습니다. 런타임은 변수가 스코프를 벗어날 때 `[Symbol.dispose]()`(또는 `[Symbol.asyncDispose]()`)가 반드시 호출되도록 보장합니다.

```javascript
class FileHandle {
  constructor(path) {
    this.path = path;
    console.log(`Opened ${path}`);
  }

  async write(data) {
    // ... 데이터 쓰기
  }

  async [Symbol.asyncDispose]() {
    await someFlushOperation();
    console.log(`Flushed and closed ${this.path}`);
  }
}

async function saveData() {
  await using file = new FileHandle("output.txt");
  await file.write("hello world");
  // 에러가 발생해도 여기서 file이 자동으로 flush되고 닫힙니다
}
```

단일 자원에는 `using` 키워드가 훌륭하지만, 여러 자원을 정리해야 할 때를 위한 DisposableStack도 생겼습니다.

```javascript
async function runJob() {
  await using stack = new AsyncDisposableStack();
  const db = stack.use(await openDatabase());
  const file = stack.use(new FileHandle("output.txt"));
  const tmpDir = stack.defer(async () => removeTempDir("/tmp/job"));

  // 작업 수행...
  await file.write(await db.query("SELECT * FROM jobs"));

  // 세 가지 모두 역순으로 정리됩니다. 에러가 발생해도 마찬가지입니다
}
```

#### Array.fromAsync / Iterator 시퀀싱

`Array.fromAsync`는 2024년에 먼저 출시됐지만, 스펙에 문제가 있어 ES2026에서야 정식으로 포함됐습니다. 비동기 이터레이터를 순회하면서 **각 `yield` 값을 await**하여 결과를 일반 배열에 담습니다. 이 기능 없이는 직접 루프를 돌며 push해야 했습니다.

```javascript
async function* fetchNumbers() {
  yield 1;
  await new Promise(r => setTimeout(r, 100)); // 비동기 지연 시뮬레이션
  yield 2;
  await new Promise(r => setTimeout(r, 100));
  yield 3;
}

const numbers = await Array.fromAsync(fetchNumbers());
console.log(numbers); // [1, 2, 3]
```

페이지네이션처럼 결과를 yield하는 비동기 함수들을 순회할 때 특히 유용합니다. yield 대신 모두 완료되면 반환하는 Promise 배열을 전달할 수도 있습니다.

페이지네이션 이야기가 나온 김에, `Iterator.concat`은 이터레이션 대상을 지연 평가할 수 있게 해주는 새로운 기능입니다. 처음부터 모든 것을 배열에 펼쳐 담는 대신, 이터레이션은 그대로 수행하면서 중간에 멈추면 배열을 미리 채우지 않아 메모리를 아낄 수 있습니다.

```javascript
const page1 = [{ id: 1 }, { id: 2 }][Symbol.iterator]();
const page2 = [{ id: 3 }, { id: 4 }][Symbol.iterator]();
const page3 = [{ id: 5 }, { id: 6 }][Symbol.iterator]();

for (const item of Iterator.concat(page1, page2, page3)) {
  process(item); // 모든 페이지를 지연 방식으로 순회합니다
}
```

#### Error.isError()

어떤 값이 진짜 `Error` 객체인지 신뢰할 수 있게 확인할 수 있습니다. Error처럼 생긴 객체가 아닌 진짜 Error인지를요. 웹 워커(web worker)나 iframe처럼 서로 다른 "렐름(realm)"에서 발생해 일반적인 방법으로는 판별하기 어려울 수 있는 에러를 받는 중앙화된 에러 리포팅 서비스 같은 상황에서 특히 유용합니다.

#### Math.sumPrecise

`console.log(0.1 + 0.2);`를 실행해본 적 있으신가요? 결과가 `0.30000000000000004`라는 이상한 숫자가 나오죠. 사연이 깁니다. Firefox에서 `console.log(Math.sumPrecise([0.1, 0.2]));`를 실행해보면... 결과는 정확히 같습니다.

하지만 그럼에도 [특정 상황에서는 여전히 유용하다고 합니다](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sumPrecise) 🤷‍♀️

#### Base64 / Hex 인코딩

이런 작업들을 이제 간단하고 직관적인 메서드 호출로 처리할 수 있다는 게 좋습니다.

```javascript
const val = 'Frontend Masters!';
const textEnc = new TextEncoder();
const bytes = textEnc.encode(val);

console.log(bytes.toBase64()); // 'RnJvbnRlbmQgTWFzdGVycyE='
console.log(bytes.toHex()); // '46726f6e74656e64204d61737465727321'
```

이번에도 Claude Code가 [멋진 데모를 만들어줬습니다](https://codepen.io/editor/chriscoyier/pen/019d5093-782b-7ab5-a507-f689e9e00173).

## 프레임워크의 새로운 기능

### 리액트 생태계

[리액트 19는 2024년 12월에 출시됐고](https://react.dev/blog/2024/12/05/react-19), 현재는 19.2 버전입니다. 리액트 20에 뭐가 담길지 공개된 정보는 아직 많지 않습니다.

리액트 19는 꽤 큰 릴리스였는데, [RSC(리액트 서버 컴포넌트)](https://react.dev/reference/rsc/server-components), [리액트 컴파일러](https://react.dev/learn/react-compiler), [서버 액션](https://18.react.dev/reference/rsc/server-actions)이 핵심입니다. 간략히 정리하면 이렇습니다.

- **RSC**: Node 서버를 활용할 수 있다면, _어쩌면 정말로_, 원래 클라이언트 측 자바스크립트 번들에 포함됐을 일부 컴포넌트를 서버에서 처리하고 필요한 데이터만 클라이언트로 전달할 수 있습니다.
- **서버 액션**: 마찬가지로 Node 서버가 있을 때, 서버에만 존재하는 함수를 컴포넌트에서 직접 호출할 수 있습니다. 폼 처리가 대표적인 예입니다.
- **컴파일러**: 기존에는 개발자가 직접 챙겨야 했던 성능 최적화들이 있었습니다. `useMemo` 전문가이신가요? 저도 아닙니다. 이 컴파일러를 통해 리액트 코드를 먼저 처리하면 이런 최적화를 자동으로 해줍니다. 빌드 복잡도는 좀 높아지지만 성능은 올라갑니다.

물론 세세한 변경 사항도 많지만, 크게 보면 이것들이 핵심입니다. [React Native는 0.83으로 업데이트됐으며](https://reactnative.dev/blog/2025/12/10/react-native-0.83), 사실 저는 잘 모르는 영역이지만, 10년간의 개발 끝에 1.0을 "예고"(다소 비공식적이지만)한 것은 모두에게 의미 있는 일이라고 생각합니다. 링크는 찾지 못했는데, React Universe Conf 무대에서 언급된 것 같습니다.

방금 오븐에서 꺼낸 따끈따끈한 서버 기반 리액트 기술들은 작년에 연달아 [심각한 보안 취약점](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)을 겪었고, 많은 사람들이 이를 보고 우려를 표명한 것은 충분히 이해할 만합니다.

### 뷰(Vue) 생태계

Vue 3.5는 안정적으로 유지되고 있으며, [Vue 3.6이 알파 버전으로 공개됐습니다](https://github.com/vuejs/core/releases/tag/v3.6.0-alpha.1). "Solid 및 Svelte 5 수준"의 대폭적인 성능 향상을 가져오는 선택적 기능 [Vapor Mode](https://github.com/vuejs/core/releases/tag/v3.6.0-alpha.1#about-vapor-mode)가 함께 소개됐습니다.

[2024년 Vue 생태계 전반에 대한 개요](https://frontendmasters.com/blog/the-vue-ecosystem-in-2024/)에서 살펴볼 수 있습니다. 완전한 Vue 외부인으로서, 2025/2026년 상황을 파악하기가 다소 어렵습니다. 물론 Evan You가 핵심 인물이지만, 현재 "자바스크립트 툴링 회사"인 [VoidZero](https://voidzero.dev/)를 운영하고 있습니다. 이곳에서는 Vite 자체, 포맷팅, 린팅, 테스팅 등 _수많은_ 주요 프로젝트를 아우르는 [Vite+](https://viteplus.dev/)를 만들고 있습니다. 이 모든 것이 Vue에만 국한된 게 아니다 보니, 이 모든 것을 이끌어가면서 Vue 자체에 집중하기가 쉽지 않을 것 같습니다 🤷‍♀️.

주요 Vue 메타 프레임워크인 Nuxt는 [4.0으로 업데이트됐으며](https://nuxt.com/blog/v4), Nuxt의 관리 주체인 NuxtLabs는 [Vercel에 인수됐습니다](https://vercel.com/blog/nuxtlabs-joins-vercel). Vercel이 Nuxt를 완전히 "소유"하는 건 아니지만… 그런 느낌도 있죠. 메타 프레임워크들이 이론적으로 지속 가능한 기반을 갖게 됐다는 점에서 한편으론 긍정적이고, 한편으론 VoidZero가 Vue 본래 언어를 위한 메타 프레임워크를 제외한 자바스크립트 툴체인의 거의 모든 단계를 갖게 된 게 묘하게 느껴지기도 합니다. Vue의 대표적인 상태 관리 라이브러리인 Pinia는 [v3로 업데이트되면서](https://pinia.vuejs.org/cookbook/migration-v2-v3.html) Vue 2 지원을 종료했습니다.

### Svelte 생태계

Svelte는 [v5에서 순항 중입니다](https://svelte.dev/blog/svelte-5-is-alive). 반응성을 더 세밀하게 제어해 더 효율적이고 빠른 "Runes API"를 도입한 큰 업데이트였습니다. 솔직히 Svelte나 [SvelteKit](https://svelte.dev/docs/kit/introduction)에 대해 잘 알지 못하지만, Vercel의 일부이기도 하고, 사용자들에게 아주 사랑받고 있다는 건 알고 있습니다.

## 자바스크립트 런타임

가장 큰 런타임은 분명 브라우저에 내장된 것들입니다. 하지만 직접 선택해서 실행할 수 있는 런타임으로는 Node가 여전히 지배적인 플레이어이며, 두 개의 흥미로운 경쟁자가 있습니다. [Deno나 Bun이 Node를 대체할 수 있는 경우에 대해서는](https://frontendmasters.com/blog/when-deno-or-bun-is-a-better-solution-than-node-js/) 다뤘습니다. 최근에는 세 런타임 모두 TypeScript를 기본으로 지원하고 표준 Node API와의 호환성을 높이는 방향으로 수렴하는 추세입니다.

### Node.js

Node의 최근 가장 큰 소식은 [TypeScript 파일을 기본으로 실행할 수 있게 됐다는 것입니다](https://nodejs.org/en/learn/typescript/run-natively).

```css
node my-script.ts
```

Node 22.18.0부터 `--experimental-strip-types` 플래그 없이도 이렇게 동작합니다. 다만 여전히 타입을 *제거(strip)*하는 방식이라, 실제 TypeScript 코드 문제를 경고해주지는 않습니다.

Node에서 나오는 가장 큰 소식은 보통 화려하지는 않지만 중요한 기본기 개선들입니다. 보안, 성능 향상, 브라우저 자바스크립트 API와의 정렬이 대표적입니다.

개인적으로 Node의 발전에 꽤 만족하고 있습니다. Node의 내장 테스트 러너로 전환하는 프로젝트를 진행했는데, 의존성을 줄일 수 있어 좋았습니다. 신뢰할 수 없는 코드 환경에서도 사용하기 쉬워진 [권한 모델](https://nodejs.org/api/permissions.html#permissions)도 응원합니다.

### Bun

[Bun의 큰 릴리스는 1.3](https://bun.com/blog/bun-v1.3)이었는데, 개발 서버 실행 관련 DX 기능이 많이 추가됐습니다. HTML 파일만 지정하면 완전한 기능을 갖춘 개발 서버를 실행할 수 있다는 게 꽤 만족스럽습니다.

```bash
bun './**/*.html'
```

이 과정에서 처리와 번들링도 모두 해주므로, 이 맥락에서 Bun은 Vite의 대안이 될 수 있습니다.

Bun에서 가장 큰 소식은 [Anthropic(Claude를 만드는 회사)이 작년 말 Bun을 인수했다는 것입니다](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone). 전반적인 분위기는 Bun에 좋은 소식이라는 것으로, 안정적이고 자금력 있는 기반을 갖게 됐습니다.

일반적으로 사람들이 Bun을 선택하는 이유는 속도 때문입니다. npm 패키지 설치 속도가 매우 빠르고 전반적으로 빠른 성능을 발휘합니다. [다소 안정성을 희생하기는 합니다](https://js-segfault-compare.sigmasd.workers.dev/).

### Deno

Deno는 [v2](https://deno.com/blog/v2.0)를 유지하고 있습니다. 완전한 Node.js 호환성을 갖추고 있으며 세 런타임 중 가장 안정적입니다. 패키지의 `npm:` 지정자를 통해 npm과도 완전히 호환됩니다.

사람들이 Deno를 선택하는 이유는 보통 안정성과 보안 우선 아키텍처 때문입니다. [이렇게 명시되어 있습니다](https://docs.deno.com/runtime/fundamentals/security/).

> Deno는 기본적으로 보안이 적용됩니다. 명시적으로 활성화하지 않는 한, Deno로 실행되는 프로그램은 파일 시스템 접근, 네트워크 연결, 환경 접근 같은 민감한 API에 접근할 수 없습니다. 커맨드 라인 플래그나 런타임 권한 프롬프트를 통해 이러한 리소스에 대한 접근을 명시적으로 허용해야 합니다. 이는 의존성에 모든 시스템 I/O에 대한 전체 접근 권한이 자동으로 부여되어 프로젝트에 숨겨진 취약점이 생길 수 있는 Node와의 큰 차이점입니다.

좋은 설계입니다.

## 빌드 도구

### Vite

[Vite](https://vite.dev/)는 자바스크립트 생태계의 지배적인 빌드 도구가 됐습니다. 운이 좋게 타이밍이 맞아떨어진 것 같습니다! Vue를 만든 팀에서 출발했지만, Vite는 거의 모든 프런트엔드 프로젝트에서 동작하는 빌드 도구입니다. 개인적으로 이들의 접근 방식이 마음에 드는데, 로컬 개발 시에는 전체 번들링 없이 변경된 작은 부분만 업데이트하면서 필요할 때는 프로덕션 수준의 번들링도 해줍니다.

[Vite는 최근 v8로 업데이트됐습니다](https://vite.dev/blog/announcing-vite8). 서드파티 번들링 도구인 [Rollup](https://rollupjs.org/) 대신 자체 개발한 번들러인 [Rolldown](https://rolldown.rs/)을 사용하게 된 것이 주요 변경 사항입니다. 이는 더 "통합된 툴체인"이 되겠다는 Vite의 최근 방향과 일치합니다. 파서 등의 툴링을 공유함으로써 전체 시스템의 예측 가능성을 높일 수 있습니다. 이 전체 툴체인을 [Vite+](https://viteplus.dev/)라고 부르며, Vite의 멋진 개발 서버뿐 아니라 포맷팅, 린팅, 타입 검사, 테스팅, 태스크 실행, 모노레포 지원, 패키징까지 포함합니다.

Cloudflare의 호스팅, 데이터 스토리지, 클라우드 함수 등의 인프라를 활용한 "배포 플랫폼" [Void](https://void.cloud/)도 개발 중입니다.

> 데이터베이스, KV 스토리지, 오브젝트 스토리지, AI 추론, 인증, 큐, 크론 작업. 모두 내장되어 있습니다. 필요한 것만 임포트하고 불필요한 건 건너뛰세요.

오늘날 대부분의 프레임워크가 Vite를 사용합니다. [Astro](https://astro.build/), [SolidStart](https://start.solidjs.com/), [SvelteKit](https://svelte.dev/docs/kit/introduction), [Nuxt](https://nuxt.com/) 등이 그렇습니다. 눈에 띄는 예외는 webpack을 사용하며 Turbopack으로 전환 중인 Next.js입니다. [Cloudflare가 AI로 Next.js를 Vite로 포팅한 사례](https://github.com/cloudflare/vinext)도 있었는데, 꽤 논란이 됐습니다.

### Turbopack

[Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)은 Vercel의 번들러로, Next.js v16부터 [기본 번들러](https://nextjs.org/docs/app/guides/upgrading/version-16#turbopack-by-default)가 됐습니다. Rust 기반 프로젝트로, Next.js의 이전 버전에서 webpack보다 최대 5~10배 빠른 새로고침 속도를 제공합니다. 현재는 Next.js에서만 사용되는 것으로 알고 있습니다.

### webpack

[webpack](https://webpack.js.org/)은 여전히 널리 사용되고 있으며, 다양한 로더의 필요성을 줄이고 여러 부분을 간소화하는 내용의 [2026년 로드맵](https://webpack.js.org/blog/2026-02-04-roadmap-2026/)을 발표했습니다. webpack이 너무 복잡하다는 일반적인 인식을 고려하면 반가운 소식입니다.

## TypeScript

[타입스크립트가 v6로 업데이트됐습니다](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/). v7은 2026년 중반을 목표로 하고 있으며, Go 기반의 새 컴파일러로 전환하는 대규모 릴리스가 될 예정입니다. v6의 주요 목표는 그 변화를 준비하는 정비 작업입니다. [Bytes 뉴스레터](https://bytes.dev/archives/473)에 간결한 요약이 있습니다.

> Strict 모드가 기본값 `true`로 변경됐고, `module`은 `esnext`를 기본값으로, `target`은 현재 연도의 ES 스펙(현재 `es2025`)에 맞춰 유동적으로 설정되며, `types`는 이제 `node_modules/@types`의 모든 것을 끌어오는 대신 빈 배열을 기본값으로 합니다. 마지막 변경 사항만으로도 많은 프로젝트가 깨지겠지만, 20~50%의 속도 향상 효과도 있습니다.

VS Code나 Playwright 사용 시 약 10배의 속도 향상이 확인되는 v7을 미리 준비해두는 것이 좋을 것 같습니다.

주목할 만한 소식은 [타입스크립트가 GitHub의 1위 언어가 됐다는 것입니다](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/), 전년 대비 66%의 성장입니다.

### 자바스크립트에 타입이?

몇 년 전, [자바스크립트에 타입을 직접 추가하자는 논의](https://devblogs.microsoft.com/typescript/a-proposal-for-type-syntax-in-javascript/)가 있었습니다. 컴파일러 없이도 타입스크립트의 일부 혜택을 누리자는 아이디어였죠. 그다지 진전이 없는 것 같고, 타입스크립트가 할 수 있는 것을 진정으로 대체하기는 어려울 것 같습니다.

### AI

이쯤에서 이 이야기를 꺼내는 게 적당할 것 같습니다. 타입스크립트는 개발자들이 활발히 사용하는 언어이자 LLM이 학습할 오픈 소스 데이터로도 풍부하게 제공되다 보니, AI는 요즘 코드 작성을 정말 잘합니다. 특히 타입스크립트를요. 92%의 개발자가 어느 정도 AI를 활용해 코드를 작성한다고 하는데, 놀라운 성장이며 지금 이 시대 개발 업계에서 단연 가장 큰 이슈입니다.

## 테스팅

자바스크립트의 주요 테스팅 프레임워크들, Jest, Jasmine, Mocha 등은 여전히 잘 운영되며 대부분의 테스트를 담당하고 있습니다. 하지만 변화도 있는데, Vite가 엄청나게 인기를 얻으면서 Vite의 테스팅 프레임워크인 [Vitest](https://vitest.dev/)도 급부상했습니다. Jest와 호환되어 테스트 마이그레이션이 비교적 쉽고, 훨씬 빠르며, 보기에도 더 깔끔합니다. Vitest에는 실제 브라우저에서 테스트를 실행할 수 있는 "브라우저 모드"도 있어 컴포넌트 테스팅에 꽤 중요한 기능입니다. 이 기능은 보통 [Playwright](https://playwright.dev/)와 함께 사용하는데, Playwright도 인기가 치솟고 있으며 자체적으로 "엔드투엔드(end-to-end)" 테스트도 할 수 있습니다. [Puppeteer](https://pptr.dev/)나 [Cypress](https://www.cypress.io/)보다 인기가 높아진 것 같습니다.

## 메타 프레임워크

### Next.js

[Next.js는 Turbopack을 기본으로 채택한 첫 번째 버전인 v16입니다](https://nextjs.org/blog/next-16). 개인적으로 이 방향으로의 전진이 마음에 들지만, 마이그레이션이 어려워 직접 운영 중인 프로젝트에서는 비활성화했습니다. 하지만 로깅/에러 개선은 눈에 띄게 발전했습니다. 이 버전의 Next.js는 리액트 컴파일러와 리액트 서버 컴포넌트를 자동으로 사용하는데, 이론적으로는 전반적인 성능 향상이지만 결과는 더 복잡하고 엇갈립니다.

Next.js 사이트에 AI를 많이 사용한다면, [MCP 서버](https://nextjs.org/docs/app/guides/mcp)가 생겼다는 것도 주목할 만합니다. 연동하면 AI가 여러분의 사이트 작업을 훨씬 잘 이해하게 됩니다.

리액트 19도 적용되어 `<ViewTransition>` 지원이 가능합니다. [관련 내용은 여기서 살펴봤습니다](https://frontendmasters.com/blog/reacts-viewtransition-element/).

### Remix / React Router

몇 년 전 Remix는 Shopify에 인수됐습니다. v2를 거쳐, Remix v3가 되려던 것이 사실은 [React Router](https://reactrouter.com/) v7이 된다고 발표됐습니다. [이제 Remix v3도 별도로 개발이 진행 중입니다](https://remix.run/blog/wake-up-remix). 가장 큰 변화는 리액트가 더 이상 필수 의존성이 아니라는 점입니다.

> 지금까지 본 어떤 프레임워크보다 웹에 더 가까운 느낌의 자체 컴포넌트 모델을 만들고 있습니다.

[Remix Jam](https://remix.run/jam/2025)이라는 행사에서 자세한 내용을 공개했으니, 관심이 있다면 확인해보세요.

### TanStack

Remix 혼선의 반사이익 일부를 [TanStack 생태계](https://tanstack.com/)가 얻었을 수도 있습니다. [인기 있는 라우터](https://tanstack.com/router/latest)를 포함한 여러 도구들의 모음인데, 그 라우터가 Remix처럼 [프레임워크](https://tanstack.com/start/latest)로까지 발전했습니다.

Adam Rackis가 작성한 [TanStack 관련 콘텐츠](https://frontendmasters.com/blog/tag/tanstack/)가 많이 있습니다.

### Astro

[Astro](https://astro.build/)는 수년 동안 꾸준히 성장해왔고 지금도 멈추지 않았습니다. 올해 [Cloudflare에 인수됐는데](https://blog.cloudflare.com/astro-joins-cloudflare/), 대체로 좋은 소식으로 받아들여집니다. 훌륭한 프런트엔드 프레임워크는 탄탄한 비즈니스 모델을 갖추기 어렵고, 그 해답이 탄탄한 호스팅 사업자와의 파트너십인 것 같습니다. 이미 [이상한 WordPress 클론](https://blog.cloudflare.com/emdash-wordpress/)을 만드는 데도 쓰이고 있습니다.

기본적으로 정적 사이트를 만들면서도, 현대적인 자바스크립트 프레임워크의 컴포넌트 기반 아키텍처를 활용하고, 필요할 때 더 동적인 기능을 쉽게 추가하고 싶다면 Astro가 최고의 선택입니다.

[Astro의 최신 릴리스는 6.0입니다](https://astro.build/blog/astro-6/). 개발 시 사용하는 런타임 커스터마이징, 콘텐츠 보안 정책(CSP, Content Security Policy), 실험적인 빠른 컴파일러 같은 성숙한 기능들이 추가됐습니다. 곧이어 [6.1](https://astro.build/blog/astro-610/)도 출시됐는데, 다양한 설정 개선 사항이 담겨 있어 얼마나 열정적으로 프레임워크를 개선하고 있는지 잘 보여줍니다.

## npm

[npm](https://www.npmjs.com/)에서는 특별히 눈에 띄는 변화가 없는 것 같습니다. Microsoft/GitHub가 인수한 지 6년이 됐고 안정적으로 운영되고 있습니다. GitHub 자체는 [가동 시간 문제가 있었습니다](https://damrnelson.github.io/github-historical-uptime/).

npm에서 _덜_ 좋은 소식은 공급망(supply chain) 사고들입니다. [s1ngularity](https://nx.dev/blog/s1ngularity-postmortem)는 사람들의 인증 정보/토큰/설정 파일을 탈취해 GitHub에 공개적으로 올렸습니다 😳. 이후 [debug/chalk](https://www.wiz.io/blog/widespread-npm-supply-chain-attack-breaking-down-impact-scope-across-debug-chalk)에서는 악성 패키지 업데이트가 배포되어 암호화폐 트랜잭션을 나쁜 사람들의 지갑으로 우회시킬 수 있었습니다. 그리고 자기 복제 형태로 인증 정보를 탈취하는 Shai-Hulud 웜(이런, *웜들*이 맞군요, 복수입니다)이 있었는데, 2.0 버전은 사용자 홈 디렉터리의 모든 파일을 덮어쓰거나 삭제하는 방식이었습니다. 2000만 회 이상의 다운로드를 기록한 796개의 npm 패키지에 배포됐습니다. 정말 대단하군요. npm 보안 관점에서 작년 한 해는 좋지 않았습니다.

심각한 프로덕션 앱에서 npm을 사용한다면, [Socket](https://socket.dev/) 같은 도구를 활용해 보호 조치를 취하는 것이 좋을 수 있습니다.

## 무엇을 배워야 할까?

언제나 변하지 않는 답은, 기본 원리를 이해하는 것이 툴링과 프레임워크의 변화와 상관없이 당신을 지켜준다는 것입니다. 감히 말하자면, AI가 코드 작성을 더 많이 도울수록, 코드가 어떻게 만들어지든 계획하고, 이끌고, 다듬고, 테스트하고, 설계하고, 좋은 취향을 적용할 수 있는 여러분 같은 사람이 더 필요해집니다.

Frontend Masters에 가입하는 것이 그 기본기를 쌓는 방법입니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
