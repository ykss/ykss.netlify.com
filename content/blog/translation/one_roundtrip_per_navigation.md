---
title: '(번역) 한 번의 왕복 요청으로 이루어지는 내비게이션'
date: 2025-06-10 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [One Roundtrip Per Navigation](https://overreacted.io/one-roundtrip-per-navigation/)

다른 페이지로 이동하려면 몇 번의 요청이 필요할까요?

가장 단순한 경우는 단 한 번의 요청만으로 해결됩니다. 사용자가 링크를 클릭하면 브라우저는 새 URL에 대한 HTML 콘텐츠를 요청하고, 그 콘텐츠를 표시합니다.

실제로는, 페이지가 이미지나 클라이언트 측 자바스크립트, 추가 스타일 등을 로드하고자 할 수 있습니다. 그래서 여러 개의 요청이 발생하게 됩니다. 일부 요청은 렌더링을 막는 요청이 될 수 있으며(브라우저는 이 요청들이 완료될 때까지 페이지 표시를 미룹니다), 나머지는 부가적인 요청들입니다. 이러한 요청들은 전체적인 인터랙티브한 동작에 중요할 수 있지만, 브라우저는 이들이 로드되는 동안에도 이미 페이지를 표시할 수 있습니다.

그렇다면, *데이터*를 로드할 때는 어떨까요?

다음 페이지에 필요한 *데이터*를 가져오는 데 몇 번의 API 요청이 필요할까요?

---

### HTML

웹 개발이 클라이언트로 옮겨오기 전에는, 이런 질문 자체가 의미가 없었습니다. “API를 호출한다”는 개념이 없었기 때문이죠. 서버는 그냥 HTML을 반환하는 *서버*일 뿐, *API 서버*로 생각되지 않았습니다.

**전통적인 “HTML 앱” 혹은 웹사이트에서는, 데이터를 가져오는 데 항상 한 번의 왕복 요청만 필요했습니다.** 사용자가 링크를 클릭하면 서버는 HTML을 반환하고, 다음 페이지를 표시하는 데 필요한 모든 데이터는 그 HTML _안에_ 이미 포함되어 있습니다. HTML 자체가 데이터인 _셈이죠_. 별도의 처리 없이 바로 표시할 수 있습니다.

```html
<article>
  <h1>한 번의 왕복 요청으로 이루어지는 내비게이션</h1>
  <p>다른 페이지로 이동하려면 몇 번의 요청이 필요할까요?</p>
  <ul class="comments">
    <li>HTML의 재창조</li>
    <li>PHP의 재창조</li>
    <li>GraphQL의 재창조</li>
    <li>Remix의 재창조</li>
    <li>Astro의 재창조</li>
  </ul>
</article>
```

(물론 기술적으로는 이미지, 스크립트, 스타일과 같은 정적이고 재사용 가능하며 캐시 가능한 요소들이 “외부화”되지만, 필요에 따라 언제든지 인라인 처리할 수도 있습니다.)

---

### “REST”

애플리케이션 로직이 점점 클라이언트로 이동하면서 상황이 달라졌습니다. 우리가 가져오고자 하는 데이터는 일반적으로 표시하고자 하는 UI에 따라 결정됩니다. 게시글을 보여주고 싶다면 게시글 데이터를 가져와야 하고, 댓글을 보여주고 싶다면 댓글 데이터를 가져와야 합니다. 그럼 얼마나 여러번 가져와야 할까요?

JSON API와 함께 사용되는 REST[라는](https://htmx.org/essays/how-did-rest-come-to-mean-the-opposite-of-rest/) 기술을 통해 개념적인 “리소스”마다 하나의 엔드포인트를 노출하는 방법을 제안합니다. “리소스”가 정확히 무엇인지는 아무도 모르지만, 보통은 백엔드 팀이 이 개념을 정의합니다. 예를 들어 게시글 "리소스"와 댓글 "리소스"가 있을 수 있으므로, 이로 인해 게시글 페이지(게시글과 댓글을 포함)에 대한 데이터를 두 번 가져와서 불러올 수 있게 됩니다.

그렇다면 이 두 번의 가져오기는 _어디서_ 발생할까요?

서버 중심의 HTML 앱(웹사이트)에서는 하나의 요청 중에 두 개의 REST API를 호출하고, 여전히 모든 데이터를 하나의 응답으로 반환할 수 있습니다. 이는 REST API 요청이 _서버에서_ 발생하기 때문입니다. REST API는 주로 데이터 계층의 명시적인 경계를 위한 수단으로 사용되었지만, 꼭 필요하지는 않았습니다(많은 경우에는 Rails나 Django처럼 인프로세스 데이터 계층을 사용하는 데 만족했습니다). REST 여부와 상관없이, 데이터(HTML)는 클라이언트(브라우저)에 온전한 상태로 도착합니다.

상호작용을 위해 UI 로직이 클라이언트로 옮겨가기 시작하면서, 기존 REST API를 그대로 두고 클라이언트*에서* 이를 `fetch`하는 것이 자연스럽게 느껴졌습니다. JSON API의 유연성은 바로 이런 상황에 좋다고 생각되었죠. 모든 것이 JSON API가 되었습니다.

```js
const [post, comments] = await Promise.all([
  fetch(`/api/posts/${postId}`).then(res => res.json()),
  fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
]);
```

**그러나 그 결과, 네트워크 탭에는 이제 두 개의 가져오기가 보입니다. 하나는 게시글에 대한 가져오기이고, 다른 하나는 게시글의 댓글에 대한 가져오기입니다.** 하나의 페이지, 하나의 링크 클릭이 종종 두 개 이상의 REST “리소스”로부터 데이터를 필요로 합니다. 가장 좋은 경우에는 두세 개의 엔드포인트를 호출하고 끝나지만, 최악의 경우에는 N개의 항목마다 N개의 엔드포인트를 호출하거나, 클라이언트/서버 간에 연속적인 워터폴 요청을 해야 할 수도 있습니다(일부 데이터를 받아서 처리한 후, 그 데이터를 기반으로 다시 데이터를 요청).

비효율이 서서히 발생하고 있습니다. 서버에 있을 때는 여러 개의 REST 요청을 만드는 것이 저렴했습니다. 배포된 코드를 통제할 수 있었기 때문입니다. REST 엔드포인트가 멀리 있으면 서버를 그 가까이로 옮기거나, 해당 코드를 인프로세스 코드로 이전할 수도 있었습니다. 복제나 서버 측 캐싱을 사용할 수도 있었습니다. 뭔가 비효율적이더라도, 서버 쪽에는 이를 개선할 수 있는 다양한 *수단*이 있습니다. 아무것도 서버 측 개선을 _막을 수_ 없습니다.

하지만 서버를 블랙박스로 본다면, 서버가 제공하는 API를 개선할 여지가 없습니다. 서버가 요청을 병렬로 실행하는 데 필요한 모든 데이터를 반환하지 않으면, 클라이언트/서버 워터폴을 최적화할 수 없습니다. 서버가 모든 데이터를 배치로 반환하지 않으면 병렬 요청 수를 줄일 수 없습니다.

어느 순간, 한계에 도달하게 됩니다.

---

### 컴포넌트

위에서 설명한 문제는 효율성과 캡슐화 간의 긴장 상태가 없었다면 그리 나쁘지 않았을 수도 있습니다. 개발자로서 우리는 데이터 로딩 로직을 그 데이터가 사용되는 위치 가까이에 배치하고 싶은 욕구를 느낍니다. 누군가는 이것이 “스파게티 코드”로 이어질 수 있다고 말할 수도 있지만, 꼭 그런 것은 아닙니다! 그 아이디어 자체는 합리적입니다. 기억하세요. UI가 데이터를 _결정합니다._ 필요한 데이터는 우리가 무엇을 표시하고 싶은지에 따라 달라집니다. 따라서 데이터 가져오기 로직과 UI 로직은 *본질적으로 밀접하게 연결*되어 있으며, 하나가 바뀌면 다른 하나도 반드시 그에 맞춰 조정되어야 합니다. 데이터를 "적게 가져와서(underfetching)" 기능을 깨뜨리거나, "너무 많이 가져와(overfetching)" 성능을 저해하고 싶지는 않을 것입니다. 그렇다면 UI 로직과 데이터 로딩을 어떻게 동기화할 수 있을까요?

가장 직접적인 방법은 데이터 로딩 로직을 UI 컴포넌트 안에 직접 작성하는 것입니다. 이는 ‘`Backbone.View`에서 `$.ajax`를 사용하는 방식’ 또는 ‘`useEffect`에서 `fetch`를 사용하는 방식’으로, 클라이언트 측 UI가 부상하면서 폭발적으로 인기를 끌었습니다. 지금도 여전히 많이 사용되고 있습니다. 이 접근의 장점은 *코드의 근접성(colocation)*에 있습니다. 어떤 데이터를 로딩할지에 대한 코드가, 그 데이터를 소비하는 코드 바로 옆에 위치하게 됩니다. 서로 다른 개발자가 서로 다른 데이터 소스를 사용하는 컴포넌트를 작성한 뒤, 이들을 하나로 조합할 수 있습니다.

```jsx
function PostContent({ postId }) {
  const [post, setPost] = useState();
  useEffect(() => {
    fetch(`/api/posts/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, []);
  if (!post) {
    return null;
  }
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Comments postId={postId} />
    </article>
  );
}

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then(res => res.json())
      .then(setComments);
  }, []);
  return (
    <ul className="comments">
      {comments.map(c => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}
```

하지만 이 접근은 앞서 설명한 문제를 훨씬 더 심각하게 만듭니다. 단일 페이지를 렌더링하는 데 여러 개의 요청이 필요할 뿐만 아니라, 이 요청들이 *코드베이스 전반*에 분산되어 있다는 점에서 그렇습니다. 그 비효율을 어떻게 추적할 수 있을까요?

누군가가 컴포넌트를 수정하면서 새로운 데이터 로딩을 추가했고, 그 결과 이 컴포넌트를 사용하는 수십 개의 화면에서 새로운 클라이언트/서버 워터폴 요청이 생겨날 수 있습니다. 만약 우리의 컴포넌트가 [Astro 컴포넌트](https://docs.astro.build/en/basics/astro-components/)처럼 서버*에서만* 실행되었다면, 데이터 로딩으로 인한 지연은 아예 없거나 최악의 경우에도 예측 가능했을 것입니다. 하지만 클라이언트에서 데이터 로딩 로직이 여러 컴포넌트에 퍼져 있다면, 이런 비효율은 걷잡을 수 없이 확산됩니다. 그리고 이를 고칠 만한 마땅한 수단이 없습니다. 사용자를 서버에 더 가깝게 *옮겨놓을 수*도 없고, _내재된_ 워터폴 요청은 클라이언트에서 아무리 프리페칭을 하더라도 해결되지 않습니다.

데이터 불러오기 코드에 구조를 조금 더 추가하면 도움이 될 수 있는지 살펴봅시다.

---

### 쿼리

[React Query](https://tanstack.com/query/latest/docs/framework/react/overview)의 `useQuery`와 같이 데이터 요청에 구조를 부여하려는 솔루션은 위 문제에 대한 궁극적인 해결책이 아닙니다. 이들은 `useEffect`에서 `fetch`를 사용하는 것보다는 훨씬 더 원칙적인 방식이며, 캐싱이 도움이 되긴 하지만, 여전히 “N개의 항목에 대해 N개의 쿼리”와 “클라이언트/서버 간의 쿼리 워터폴” 문제에서 자유롭지 않습니다.

```jsx
function usePostQuery(postId) {
  return useQuery(['post', postId], () =>
    fetch(`/api/posts/${postId}`).then(res => res.json())
  );
}

function usePostCommentsQuery(postId) {
  return useQuery(['post-comments', postId], () =>
    fetch(`/api/posts/${postId}/comments`).then(res => res.json())
  );
}

function PostContent({ postId }) {
  const { data: post } = usePostQuery(postId);
  if (!post) {
    return null;
  }
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Comments postId={postId} />
    </article>
  );
}

function Comments({ postId }) {
  const { data: comments } = usePostCommentsQuery(postId);
  return (
    <ul className="comments">
      {comments.map(c => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}
```

사실, 클라이언트 측 캐싱이 만능 해결책은 아닙니다. 클라이언트 앱에서 “뒤로 가기” 버튼이 즉시 동작하도록 하려면 캐싱이 반드시 필요하고, 탭 전환처럼 특정 내비게이션에서 캐시 재사용은 도움이 됩니다. 하지만 많은 내비게이션, 특히 링크 클릭에서는 사용자가 신선한 콘텐츠를 _기대합니다_. 바로 이것이 브라우저가 HTML 앱에서 페이지를 로딩할 때 기다리는 이유입니다! 사용자가 페이지 *전체*가 대체되기를 원하지는 않더라도(특히 앱이 내비게이션 셸(shell)을 사용할 경우), 콘텐츠 영역은 링크 클릭 후에 신선하길 기대합니다. (물론, 마우스 오버 시 프리페칭을 통해 신선*하면서도* 즉각적인 내비게이션을 제공하는 건 훨씬 더 좋습니다.)

직관과 달리, 더 빠르다고 해서 _항상_ 더 나은 사용자 경험을 제공하는 것은 아닙니다. 캐시된 오래된 콘텐츠가 잠깐 나타났다가 바로 교체되는 방식(예: stale-while-revalidate)은 오히려 사용자의 의도를 *저버리는*일일 수 있습니다. 사용자는 링크를 클릭할 때 최신 데이터를 기대합니다. “혹시 몰라서" Ctrl+R을 누르게 만들고 싶지는 않습니다.

클라이언트 측 캐싱은 콘텐츠가 _아직 바뀌지 않았거나_, 변경 사항을 반영할 필요가 없을 때는 유용하지만, 만병통치약이 아니며 다른 문제를 해결하지 못합니다. 다양한 문제를 해결하지만 데이터를 최신 상태로 유지*하려는* 경우 요청 횟수를 줄이지는 못하며 클라이언트/서버 워터폴을 방지하는 데 도움이 되지 않습니다.

이제 우리는 UI와 데이터 요구사항을 근접하게 유지하고 싶지만, 동시에 워터폴 요청을 피하고 과도한 병렬 요청도 막고 싶다는 긴장감이 생겼습니다. 클라이언트 쿼리 캐시*만으로는* 이 문제를 해결할 수 없습니다.

그렇다면, 우리는 무엇을 해야 할까요?

---

### 클라이언트 로더(loader)

우리가 할 수 있는 일 중 하나는 코드 근접성을 포기하는 것입니다. 각 라우트마다 해당 라우트에 필요한 모든 데이터를 로드하는 함수를 정의한다고 가정해 봅시다. 이 함수를 *로더*라고 부르겠습니다.

```js
async function clientLoader({ params }) {
  const { postId } = params;
  const [post, comments] = await Promise.all([
    fetch(`/api/posts/${postId}`).then(res => res.json()),
    fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
  ]);
  return { post, comments };
}
```

이 예제는 리액트 라우터의 [`clientLoader`](https://reactrouter.com/start/framework/data-loading#client-data-loading) API를 사용하고 있지만, 이 개념 자체는 더 일반적입니다. 각 내비게이션 시점마다, 라우터는 다음 라우트의 로더를 실행하고 그 결과 데이터를 컴포넌트 트리에 전달한다고 상상해보세요.

이 접근 방식의 단점은, 데이터 요구사항이 해당 데이터를 필요로 하는 컴포넌트들과 더 이상 나란히 있지 않다는 점입니다. 각 라우트의 "상단"에 있는 코드가 그 아래에 어떤 컴포넌트들이 있고, 그 컴포넌트들이 어떤 데이터를 필요로 하는지를 "알고 있어야" 합니다. 이 점에서 보면, 쿼리나 컴포넌트 내부에서 데이터를 가져오는 방식에 비해 한 단계 후퇴한 것처럼 느껴집니다.

하지만 이 접근의 장점은 클라이언트/서버 워터폴을 훨씬 더 쉽게 방지*할 수 있다는 것*입니다. 물론 여전히 `clientLoader` 함수가 실행되므로 워터폴이 생길 수도 있지만, 이제 그 구조가 _눈에 보입니다._ 즉, 컴포넌트나 쿼리에서 데이터를 가져올 때처럼 _기본적으로_ 워터폴이 발생하는 방식은 아닙니다.

---

### 서버 로더

로더를 사용한다는 또 다른 장점은, 각 라우트가 독립적인 로더를 가지고 있다면 이 로직의 일부를 _서버로_ 옮기기가 훨씬 쉬워진다는 점입니다. 로더는 컴포넌트와 독립적으로 동작하며(컴포넌트가 렌더링되기 _전에_ 실행됨), 따라서 HTML 또는 API 서버의 일부로 구성할 수도 있고, 아예 별도의 "BFF(_Backend for Frontend_)" 서버로 구성할 수도 있습니다.

```js
// 이 코드는 서버에서 실행될 수 있습니다
async function loader({ params }) {
  const { postId } = params;
  const [post, comments] = await Promise.all([
    fetch(`/api/posts/${postId}`).then(res => res.json()),
    fetch(`/api/posts/${postId}/comments`).then(res => res.json()),
  ]);
  return { post, comments };
}
```

이것은 [리액트 라우터의 `loader` 함수](https://reactrouter.com/start/framework/data-loading#server-data-loading)나, 이전 Next.js의 `getServerSideProps()`가 따랐던 모델입니다. 보통 빌드 시점의 코드 변환을 통해 이 로더 코드를 클라이언트용 코드와 "분리"하게 됩니다.

그렇다면, 왜 로더를 서버로 옮기는 걸까요?

서버를 단순한 블랙박스로 보지 않는다면, 서버는 데이터 요청 코드를 배치하기에 가장 자연스러운 장소입니다. 서버는 일반적으로 성능 문제를 개선할 수 있는 수단들을 많이 가지고 있습니다. 예를 들어, 지연 시간을 줄이기 위해 BFF 서버를 데이터 소스 가까이 배치할 수 있습니다. 그러면 _내재된_ 워터폴 요청도 저렴하게 처리할 수 있습니다. 데이터 소스가 느릴 경우에도, 서버에서는 크로스 요청 캐시 같은 메커니즘을 추가할 수 있습니다. 또는 마이크로서비스 전체를 포기하고 Rails에서 처럼 데이터 계층을 인프로세스로 옮길 수도 있습니다.

```js {1,6-7}
import { loadPost, loadComments } from 'my-data-layer';

async function loader({ params }) {
  const { postId } = params;
  const [post, comments] = await Promise.all([
    loadPost(postId),
    loadComments(postId),
  ]);
  return { post, comments };
}
```

인프로세스 데이터 계층은 최적화를 위한 최고의 기회를 제공합니다. 필요한 경우 더 낮은 수준으로 내려가서 특정 화면을 위한 저장 프로시저(stored procedure)를 직접 호출할 수도 있습니다. 요청 당 메모리 내 캐싱과 배치 처리를 통해 DB 호출 횟수를 더 줄일 수 있습니다. 오버페칭이나 언더페칭에 대해 걱정할 필요도 없습니다. 각 로더는 _해당 화면에 필요한 데이터만_ 정확하게 전달하면 되니까요. 더 이상 "REST" “리소스”를 "확장"할 필요가 없습니다.

설령 REST API 호출을 사용하더라도, 우리는 전통적인 “HTML 앱”의 유용한 특성, 즉, Rails나 Django로 구성된 아키텍처는 그대로 유지됩니다. **클라이언트 관점에서 보면, 데이터(JSON)는 단일 왕복 요청으로 도착합니다.** 그리고 클라이언트/서버 워터폴은 이 모델에서는 _절대 발생하지 않습니다._

자, 이것이 서버 로더의 장점입니다. 그렇다면 단점은 무엇일까요?

---

### 서버 함수

앞서 로더를 사용하기로 했을 때, 우리는 코드 근접성을 포기해야 했습니다.

그렇다면, 로더를 서버에 남겨두면서 _컴포넌트마다 로더를 하나씩_ 정의하면 어떨까요? 다시 말해 코드 근접성을 되찾는 겁니다. 이를 위해선 서버와 클라이언트 코드 간의 경계를 좀 더 모호하게 만들어야 할 수도 있지만, 일단 한번 시도해보면서 결과를 지켜봅시다.

이걸 어떻게 구현할지는 사용하는 “경계 흐리기” 방식에 따라 달라집니다. 먼저 [TanStack 서버 함수](https://tanstack.com/start/latest/docs/framework/react/server-functions)를 예로 들어보겠습니다.

이 방식은 클라이언트에서 직접 import할 수 있는 서버 함수를 선언할 수 있게 해줍니다.

```js
import { createServerFn } from '@tanstack/react-start';
import { loadPost, loadComments } from 'my-data-layer';

export const getPost = createServerFn({ method: 'GET' }).handler(async postId =>
  loadPost(postId)
);

export const getComments = createServerFn({
  method: 'GET',
}).handler(async postId => loadComments(postId));
```

또 다른 예는 [리액트 서버 함수](https://react.dev/reference/rsc/server-functions) 문법을 사용하는 것입니다.

```js
'use server';

import { loadPost, loadComments } from 'my-data-layer';

export async function getPost(postId) {
  return loadPost(postId);
}

export async function getComments(postId) {
  return loadComments(postId);
}
```

둘의 차이에 대해 이 글에서는 깊이 다루지 않겠습니다. 여기서는 [둘 다 암묵적인 RPC 엔드포인트를 생성하는 것](https://overreacted.io/what-does-use-client-do/#use-server)으로 간주하겠습니다.

요점은 클라이언트 측 컴포넌트에서 직접 엔드포인트를 import할 수 있다는 것입니다. 굳이 REST 엔드포인트나 API 라우트를 따로 만들 필요가 없습니다. `import`만으로 암묵적인 API 라우트가 되는 셈이죠.

이제 코드 근접성이 다시 생겼습니다! `PostContent` 컴포넌트는 `getPost`만 필요합니다.

```js {1,5}
import { getPost } from './my-server-functions';
import { Comments } from './Comments';

function usePostQuery(postId) {
  return useQuery(['post', postId], () => getPost(postId));
}

function PostContent({ postId }) {
  const { data: post } = usePostQuery(postId);
  if (!post) {
    return null;
  }
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Comments postId={postId} />
    </article>
  );
}
```

마찬가지로 `Comments`는 서버로부터 `getComments`를 직접 import할 수 있습니다.

```js {1,4}
import { getComments } from './my-server-functions';

function usePostCommentsQuery(postId) {
  return useQuery(['post-comments', postId], () => getComments(postId));
}

export function Comments({ postId }) {
  const { data: comments } = usePostCommentsQuery(postId);
  return (
    <ul className="comments">
      {comments.map(c => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}
```

그런데 잠깐만요…

이 방식은 앞서 설명한 문제들을 해결해주지 않습니다!

사실, 성능 측면에서 보면 [컴포넌트](#컴포넌트)나 [쿼리](#쿼리) 내부에서 fetch하는 방식으로 *되돌아간 셈*입니다. 서버 함수(Server Function)의 장점은 _더 깔끔한 문법_(`import`를 통한 호출)뿐이고, 이 방식을 *코드와 근접한 데이터 가져오기*에 사용하면 서버 로더보다 성능이 오히려 *퇴보*합니다. 서버 함수는 단일 왕복 요청을 강제하지도 않고, 클라이언트/서버 워터폴도 방지하지 못합니다. 서버 함수는 *서버 호출*을 단순화해주지만, 데이터 로딩 자체를 개선해주지는 않습니다.

그렇다면 대안은 무엇일까요?

---

### GraphQL 프래그먼트

안타깝게도 오해받아왔지만, GraphQL은 효율적인 코드 근접성을 실현하기 위한 하나의 접근 방식입니다.

GraphQL의 [본래 의도](https://alan.norbauer.com/articles/relay-style-graphql/)는 개별 컴포넌트들이 필요한 데이터 의존성을 *프래그먼트(fragment)*로 선언하고, 이 프래그먼트들이 하나로 합쳐지도록 만드는 것이었습니다. (수년이 지나서야 [Apollo에서도 이를 제대로 지원](https://www.apollographql.com/blog/optimizing-data-fetching-with-apollo-client-leveraging-usefragment-and-colocated-fragments)하게 되었습니다.)

이 방식에서는 `Comment` 컴포넌트가 스스로 필요한 데이터를 다음과 같이 선언할 수 있습니다.

```jsx {14-17}
function Comments({ comments }) {
  return (
    <ul className="comments">
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}

function Comment({ comment }) {
  const data = useFragment(
    graphql`
      fragment CommentFragment on Comment {
        id
        text
      }
    `,
    comment
  );
  return <li>{data.text}</li>;
}
```

여기서 중요한 점은 `Comment` 컴포넌트가 **직접 데이터를 가져오지는 않는다는 것**입니다. 단지 어떤 데이터가 필요한지만 *선언*합니다. 이제 `PostContent` 컴포넌트를 살펴봅시다.

`PostContent` 컴포넌트는 `Comment`의 프래그먼트를 자신의 프래그먼트에 _포함시킵니다._

```jsx {9}
function PostContent({ post }) {
  const data = useFragment(
    graphql`
      fragment PostContentFragment on Post {
        title
        content
        comments {
          id
          ...CommentFragment
        }
      }
    `,
    post
  );
  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.content}</p>
      <Comments comments={data.comments} />
    </article>
  );
}
```

실제 데이터 요청은 상위 수준 어딘가에서 이루어집니다. 이 프래그먼트들은 _전체 라우트를 위한_ 다음과 같은 GraphQL 쿼리로 합쳐지게 됩니다.

```graphql
query PostPageQuery($postId: ID!) {
  post(id: $postId) {
    # PostContentFragment에서 가져온 것
    title
    content
    comments {
      # CommentFragment에서 가져온 것
      id
      text
    }
  }
}
```

이는 마치 자동으로 생성되는 로더와 같습니다!

이제 각 화면마다, 해당 화면에서 실제로 필요한 데이터를 컴포넌트의 소스 코드에 기반하여 정확히 묘사하는 쿼리를 생성할 수 있게 됩니다. 어떤 컴포넌트가 필요로 하는 데이터를 변경하고 싶다면, 해당 컴포넌트 내의 프래그먼트만 수정하면 되고, 전체 쿼리는 자동으로 갱신됩니다. **GraphQL 프래그먼트를 사용하면 각 내비게이션마다 단일 왕복 요청으로 모든 데이터를 로딩할 수 있습니다.**

물론 GraphQL이 모든 사람에게 적합한 것은 아닙니다. 저 역시 아직 문법이 다소 혼란스럽게 느껴질 때가 있고(부분적으로는 제가 이를 많이 사용해보지 않았기 때문입니다), 이걸 제대로 사용하려면 서버 측과 클라이언트 측 모두에서 일정 수준의 조직적인 이해가 필요합니다. 저는 GraphQL에 대해 영업을 하려는 게 아닙니다.

하지만 GraphQL이 이 문제를 실제로 _해결한_ _몇 안 되는_ 방법 중 하나라는 점은 분명히 언급할 필요가 있습니다. GraphQL은 데이터 요구사항을 UI와 나란히 선언할 수 있게 해주면서도, 단순하게 [컴포넌트](#컴포넌트)나 [쿼리](#쿼리) 안에서 데이터를 가져오는 접근 방식에서 발생하는 단점을 _회피할_ 수 있게 해줍니다(이러한 단점은 [서버 함수](#서버-함수)을 사용하든 아니든 존재합니다). 다시 말해, GraphQL은 [서버 로더](#서버-로더)의 성능 특성*과* [쿼리](#쿼리)의 코드 근접성과 모듈성을 모두 제공합니다.

그리고 이와 유사한 문제를 해결하려는 또 다른 방식이 존재합니다.

### RSC

리액트 서버 컴포넌트는 2010년대 내내 리액트 팀을 괴롭혔던 질문에 대한 답입니다. “리액트에서 데이터를 어떻게 가져올 것인가?”

각 데이터가 필요한 컴포넌트마다 자체 [서버 로더](#서버-로더)가 있을 수 있다고 상상해보세요. 컴포넌트당 하나의 함수가 가장 단순한 해결책입니다.

이제 우리는 컴포넌트 _안에서_ 서버 로더를 직접 호출하여 데이터를 가져오는 것은 [클라이언트/서버 워터폴로 바로 돌아가는 실수임](#서버-함수)을 알고 있습니다. 그래서 우리는 반대로 접근합니다. 서버 로더가 데이터를 반환하는 대신 컴포넌트를 *반환*할 것입니다.

```js {7,9,15}
import { loadPost, loadComments } from 'my-data-layer';
import { PostContent, Comments } from './client';

function PostContentLoader({ postId }) {
  const post = await loadPost(postId);
  return (
    <PostContent post={post}>
      <CommentsLoader postId={postId} />
    </PostContent>
  );
}

function CommentsLoader({ postId }) {
  const comments = await loadComments(postId);
  return <Comments comments={comments} />;
}
```

```js
'use client';

export function PostContent({ post, children }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {children}
    </article>
  );
}

export function Comments({ comments }) {
  return (
    <ul className="comments">
      {comments.map(c => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}
```

데이터는 위에서 아래로 흐릅니다. 서버가 진실의 원천(source of truth)입니다. 서버로부터 프로퍼티를 받고자 하는 컴포넌트는 [`'use client'` 지시어](https://overreacted.io/what-does-use-client-do/)를 통해 이를 명시적으로 표현합니다. 우리의 서버 로더는 컴포넌트처럼 생겼기 때문에 이들을 서버 컴포넌트라고 부르지만, 실제로는 구성 가능한 형태의 서버 로더인 셈입니다.

이 구조는 예전의 "컨테이너 vs 프레젠테이션 컴포넌트” 패턴을 떠올리게 할 수도 있지만, 여기서는 모든 “컨테이너”가 서버에서 실행되어 추가적인 왕복 요청을 방지한다는 차이가 있습니다.

이 접근 방식으로 무엇을 얻을 수 있을까요?

- **우리는 [서버 로더](#서버-로더)의 효율성을 얻습니다.** 서버 로더에 적용 가능한 모든 성능 최적화 전략(요청당 캐싱, 요청 간 캐싱, 데이터 소스 근처에 서버 배치 등)이 서버 컴포넌트에도 그대로 적용됩니다. 클라이언트/서버 워터폴은 절대 발생하지 않으며, 데이터는 항상 한 번의 왕복 요청으로 도착합니다.

- **우리는 [컴포넌트](#컴포넌트)나 [GraphQL 프래그먼트](#graphql-프래그먼트)의 코드 근접성을 얻습니다.** 데이터 의존성이 비록 완전히 같은 파일에 선언되지는 않더라도, 단 한 단계만 떨어져 있습니다. 리액트에서 프로퍼티의 출처를 찾듯이, "모든 참조 찾기" 기능을 통해 *서버 프로퍼티*의 출처를 찾을 수 있습니다.

- **우리는 [HTML](#html) 앱의 “본질적인” 정신 모델을 얻습니다.** 별도의 “API”가 존재하지 않으며(필요하다면 추가할 수 있습니다), 장기적인 정규화된 클라이언트 캐시도 없습니다. 리액트 컴포넌트라는 팔레트를 사용하여 트리를 반환할 뿐입니다. 특별한 언어를 배워야 할 필요도, 별도의 데이터 로딩 API를 배워야 할 필요도 없습니다. 어찌 보면, 아예 API 자체가 없습니다.

실제로 위 예제는 다음과 같이 단순화할 수도 있습니다.

```js
import { loadPost, loadComments } from 'my-data-layer';

async function PostContent({ postId }) {
  const post = await loadPost(postId);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <Comments postId={postId} />
    </article>
  );
}

async function Comments({ postId }) {
  const comments = await loadComments(postId);
  return (
    <ul className="comments">
      {comments.map(c => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}
```

사용자가 페이지를 요청할 때(초기 로딩이든 이후 내비게이션이든), 클라이언트는 *서버에 단일 요청*을 보냅니다. 서버는 `<PostContent postId={123} />`에서부터 출력을 직렬화하기 시작하며, 이를 재귀적으로 펼쳐서 리액트 트리를 스트리밍합니다. 이 트리는 HTML로 변환되거나 JSON으로 직렬화됩니다.

클라이언트 입장에서는, 모든 내비게이션이 서버로의 단일 요청을 의미합니다. 서버 입장에서는, 데이터 로딩 로직이 필요한 만큼 모듈화되어 있습니다. 서버는 클라이언트에게 데이터를 전달하는 방식으로 클라이언트 트리를 *반환*합니다.

---

### 그래서 무엇을 얻었는가?

이 글에서 필자는 RSC가 기존의 다양한 데이터 패칭 방식들과 어떤 관계를 가지는지를 설명하고자 했습니다. 다루지 못한 내용도 많지만, 몇 가지만 언급해보겠습니다.

- 데이터 패칭을 한 번의 왕복으로 끝내는 건 느린 부분이 있을 경우 안 좋아 보일 수도 있습니다. (RSC는 스트리밍으로, GraphQL은 `@defer` 지시어로 이 문제를 해결합니다.)

- 클라이언트/서버 워터폴이 프리페칭으로 해결될 수 있다고 생각할 수도 있습니다. (하지만 그건 사실이 아닙니다. _근본적으로 발생하는_ 워터폴은 프리페칭으로는 해결되지 않습니다.)

- 컴포넌트에서 데이터를 가져오는 건 서버 전용 워터폴 때문에 나쁜 선택처럼 보일 수 있습니다. (이는 경우에 따라 사실일 수 있습니다. 데이터 레이어가 저지연이라면 문제가 되지 않을 수도 있지만, 이는 RSC 자체에 대한 반론이라기보다는 별도의 논의가 필요합니다.)

**마지막으로 강조하고 싶은 것은, 코드 근접성*과* 효율성이라는 두 가지 문제를 동시에 해결하려는 접근은 흔치 않다는 점입니다. HTML 템플릿이 그렇고([Astro](https://astro.build/)가 그 현대적인 구현체 중 하나입니다), GraphQL이 그렇고, RSC도 그중 하나입니다.**

당신이 좋아하는 프레임워크에게 물어볼 질문이 하나 생겼네요.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
