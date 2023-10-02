---
title: '(번역) Bun vs Node.js : 당신이 알아야 할 모든 것들'
date: 2023-10-04 01:00:00
category: 'Translation'
draft: false
---

> 원문: [Bun vs Node.js: Everything you need to know](https://www.builder.io/blog/bun-vs-node-js)

![](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F4cac663bd6d74d6f98a2108d2bdf5630)

9월 8일, 자바스크립트 커뮤니티에 새로운 소식이 들려왔습니다. [Jarred Sumner](https://twitter.com/jarredsumner)가 만든 Bun v1.0이 출시되었기 때문입니다. 하지만 많은 사람들이 궁금해하는 것이 있습니다. Bun의 본질은 무엇일까요? 왜 모두가 이미 검증된 [Node.js](https://nodejs.org/en)와 비교하는 걸까요? Bun은 일시적인 트렌드에 불과한 것일까요? 아니면 기존의 판도를 바꾸기 위해 등장한 것일까요? 이 글에서는 Bun과 그 기능에 대해 자세히 알아보고, 확고하게 자리 잡은 Node.js와 어떻게 비교되는지 알아보겠습니다.

## Bun은 무엇인가요?

Bun은 자바스크립트 및 타입스크립트 앱을 위한 초고속 올인원 도구입니다. Bun의 장점은 개발 프로세스를 간소화하여 그 어느 때보다 원활하고 효율적으로 만들 수 있다는 점입니다. 이는 Bun이 단순한 런타임이 아니라 패키지 관리자, 번들러, 테스트 러너의 역할을 동시에 수행하기 때문에 가능합니다. JS 개발을 위한 스위스 군용 나이프가 있다고 상상해 보세요. Bun이 바로 그것입니다.

(역자 주 : "스위스 군용 나이프(Swiss Army knife)"는 일반적으로 다양한 기능을 가진 다목적 도구를 말합니다.)

## Bun은 무엇을 해결하나요?

2009년 Node.js의 등장은 획기적이었습니다. 하지만 많은 기술이 그렇듯 기술이 성장함에 따라 복잡성도 함께 증가했습니다. 도시라고 생각해 보세요. 도시가 커질수록 교통 혼잡이 문제가 될 수 있습니다.

Bun은 이러한 혼잡을 완화하여, 더 원활하고 빠르게 움직일 수 있는 새로운 인프라가 되는 것을 목표로 합니다. Bun은 기존의 것을 재창조하는 것이 아니라 개선함으로써 속도와 단순성을 확보하는 동시에, 자바스크립트의 독특하고 강력한 본질을 잃지 않도록 합니다.

Bun은 더 빠르고 간결하며 Node.js를 대체할 수 있는 더 현대적인 도구로 설계되었다고 했으니, 몇 가지 비교를 통해 진짜인지 살펴보겠습니다. 하지만 먼저 한 가지 다른 주제에 대해 논의해 보겠습니다.

### Node.js vs Deno vs Bun

자바스크립트 런타임의 발전을 논할 때 [Deno](https://deno.com/)를 간과하기는 어렵습니다. Node.js의 창시자인 Ryan Dahl은 Node.js의 문제점과 아쉬운 점을 해결하기 위한 새로운 런타임으로 Deno를 소개했습니다.

Deno는 자바스크립트와 타입스크립트를 위한 안전한 런타임입니다. 이 런타임은 Node.js의 여러 단점을 직접적으로 해결합니다. 예를 들어, Deno는 외부 도구 없이도 타입스크립트를 기본적으로 지원합니다. 스크립트에 기본적으로 광범위한 권한이 부여되는 Node.js와 달리, Deno는 개발자가 파일 시스템 접근 또는 네트워크 연결과 같이 잠재적으로 민감한 작업에 대한 권한을 명시적으로 부여해야 하는 보안 우선 접근 방식을 채택합니다.

Deno는 Node.js에 대한 강력한 대안을 제시하지만, Node.js만큼 광범위하게 채택되지는 못했습니다. 따라서 이 글에서는 Bun과 확고하게 자리 잡은 Node.js를 대조하는 데 중점을 두었습니다.

## 시작하기

Bun을 사용하면 `bun init -y` 명령으로 빈 프로젝트를 생성할 수 있습니다. 몇 개의 파일이 생성되었으며, index.ts에 `console.log("Hello, Bun!")`라는 줄을 추가합니다. 터미널에서 `bun index.ts` 명령을 실행하면 "Hello, Bun!"이 기록되는 것을 확인할 수 있습니다.

## Bun vs Node.js : 자바스크립트 런타임

자바스크립트 런타임은 자바스크립트 프로그램을 사용하고 실행하는 데 필요한 모든 구성 요소를 제공하는 환경입니다.

Node.js와 Bun은 모두 런타임입니다. Node.js는 주로 C++로 작성됐지만, Bun은 로우 레벨 범용 프로그래밍 언어인 [Zig](https://ziglang.org/)로 작성되었습니다. 하지만 이것은 빙산의 일각에 불과합니다. Bun을 런타임으로만 취급할 때의 다른 점을 자세히 살펴보겠습니다.

### 자바스크립트 엔진

자바스크립트 엔진은 우리가 작성한 자바스크립트 코드를 컴퓨터가 특정 작업을 수행할 수 있는 기계어 코드로 변환하는 프로그램입니다.

Node.js는 크롬 브라우저를 구동하는 구글의 [V8 엔진](https://v8.dev/)을 사용하는 반면, Bun은 애플에서 사파리용으로 개발한 오픈 소스 자바스크립트 엔진인 [JavaScriptCore(JSC)](https://developer.apple.com/documentation/javascriptcore)를 사용합니다.

V8과 JSC는 아키텍처와 최적화 전략이 다릅니다. JSC는 실행 시간은 약간 느리지만, 빠른 시작 시간과 메모리 사용량 감소를 우선시합니다. 반면 V8은 런타임 최적화를 통해 빠른 실행을 우선시하기 때문에, 메모리 사용량이 늘어날 수 있습니다.

따라서 Bun은 Node.js보다 최대 4배 더 빠르게 시작할 수 있습니다.

![](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fffa01b170c5e450e9a9f8e1e347e39a6?format=webp&width=2000)

요약: bun은 deno보다 2.19배, node보다 4.81배 빠르게 실행되었습니다.

### 트랜스파일러

Node.js는 자바스크립트를 위한 강력한 런타임이지만 기본적으로 타입스크립트 파일을 지원하지는 않습니다. Node.js 환경에서 타입스크립트를 실행하려면 외부 종속성이 필요합니다. 한 가지 일반적인 접근 방식은 빌드 단계를 사용하여 타입스크립트(TS)를 자바스크립트(JS)로 트랜스파일한 다음, 결과 JS 코드를 실행하는 것입니다. 다음은 [`ts-node`](https://github.com/TypeStrong/ts-node) 패키지를 사용하는 기본 설정입니다.

#### 1. 설치

```bash
npm install -D typescript ts-node
```

#### 2. 스크립트 설정

`package.json`에서 스크립트를 설정하여 프로세스를 간소화할 수 있습니다.

```json
{
  "scripts": {
    "start": "ts-node ./path/to/your/file.ts"
  }
}
```

#### 3. 실행

위의 스크립트와 함께 타입스크립트 파일을 쉽게 실행할 수 있습니다.

```bash
npm start
```

이와는 대조적으로 Bun은 보다 간소화된 접근 방식을 제공합니다. 런타임에 자바스크립트 트랜스파일러가 통합되어 있습니다. 이를 통해 `.js, .ts, .jsx` 및 `.tsx` 파일을 직접 실행할 수 있습니다. Bun에 내장된 트랜스파일러는 이러한 파일을 바닐라 자바스크립트로 원활하게 변환하여 추가 단계 없이 즉시 실행할 수 있도록 지원합니다.

```bash
bun index.ts
```

Node.js를 실행하기 전에 변환 단계를 거쳐야 하므로, 타입스크립트 파일을 실행할 때 속도 차이가 더 벌어집니다.

![](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fa929240bcfb647f7b019075de9d6f9b9?format=webp&width=2000)

### ESM 및 CommonJS 호환성

모듈 시스템을 사용하면 개발자가 코드를 재사용할 수 있는 세그먼트로 구성할 수 있습니다. 자바스크립트에서 두 가지 주요 모듈 시스템은 [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules)와 [ES Module](https://nodejs.org/api/esm.html#modules-ecmascript-modules)(ESM)입니다. Node.js에서 시작된 CommonJS는 동기식 모듈 처리를 위해 `require`와 `module.exports`를 사용하며, 서버 사이드 작업에 이상적입니다.

ES6에 도입된 ESM은 `import` 및 `export` 문을 사용하여 브라우저와 최신 빌드 도구에 최적화된 보다 정적이고 비동기적인 접근 방식을 제공합니다. 모듈 시스템을 더 잘 이해하기 위해 널리 사용되는 두 가지 패키지인 CommonJS의 [`colors`](https://github.com/Marak/colors.js) 패키지와 ESM의 [`chalk`](https://github.com/chalk/chalk) 패키지를 이용하여 콘솔에 색상을 출력해 보겠습니다.

Node.js는 전통적으로 CommonJS 모듈 시스템과 연관되어 있습니다. 다음은 일반적인 사용 예시입니다.

```js
// Node.js에서의 CommonJS (index.js)
const colors = require('colors');
console.log(colors.green('Hello, world!'));
```

Node.js의 ES 모듈의 경우, 두 가지 옵션 중 하나를 선택해야 합니다.

1. `package.json`에 `"type": "module"`을 포함해야 합니다.
2. `.mjs` 확장자를 사용합니다.

```js
// Node.js에서의 ESM (index.mjs)
import chalk from 'chalk';
console.log(chalk.blue('Hello, world!'));
```

CommonJS에서 ES Module(ESM)로의 전환은 복잡한 여정이었습니다. Node.js는 ESM이 도입된 지 반년이 지난 후에야 실험적(experimental) 플래그 없이 ESM을 지원하게 되었습니다. 그럼에도 불구하고 CommonJS는 여전히 생태계에서 널리 사용되고 있습니다.

Bun은 특별한 설정 없이 두 가지를 모두 지원하여 모듈 시스템을 간소화합니다. Bun의 뛰어난 기능은 동일한 파일에서 `import`와 `require()`를 모두 지원할 수 있다는 점인데, 이는 Node.js에서는 기본적으로 불가능한 기능입니다.

```js
// Bun에서의 혼합 모듈 (index.js)
import chalk from 'chalk';
const colors = require('colors');

console.log(chalk.magenta('Hello from chalk!'));
console.log(colors.cyan('Hello from colors!'));
```

### 웹 API

브라우저 기반 애플리케이션에 필수적인 웹 API는 웹 상호 작용을 위한 `fetch` 및 `WebSocket`과 같은 도구를 제공합니다. 이러한 도구는 브라우저 표준이 되었지만, Node.js와 같은 서버 사이드 환경에서의 지원은 일관성이 없었습니다.

이전 버전의 Node.js에서는 브라우저에서 일반적으로 사용할 수 있는 웹 표준 API가 기본적으로 지원되지 않았습니다. 개발자는 이 기능을 그대로 사용하기 위해 `node-fetch`와 같은 서드파티 패키지에 의존해야 했습니다. 하지만 Node.js v18부터는 `fetch` API가 실험적으로 지원되어 이러한 패키지가 필요하지 않게 될 가능성이 있습니다.

Bun은 이러한 웹 표준 API에 대한 기본 지원을 제공하여 이 과정을 간소화합니다. 개발자는 추가 패키지 없이도 안정적인 `fetch`, `Request`, `Response`, `WebSocket` 및 기타 브라우저와 유사한 API를 직접 사용할 수 있습니다. 또한, Bun은 이러한 웹 API를 기본적으로 구현하기 때문에 서드파티 대안에 비해 더 빠르고 안정적입니다.

다음은 Node.js(v18 이상) 및 Bun과 모두 호환되는 예제입니다. Node.js에서는 실험적이지만, Bun에서는 동일한 기능이 안정적으로 작동합니다.

```js
// Node.js(v18 이상)의 실험적 fetch 및 Bun의 내장 fetch
async function fetchUserData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
  const user = await response.json();
  console.log(user.name);
}

fetchUserData(); // Leanne Graham
```

### 핫 리로딩

핫 리로딩은 코드가 변경되면 전체 재시작 없이도 애플리케이션의 일부를 실시간으로 자동으로 새로 고치거나 다시 로드하여 개발자의 생산성을 높여주는 기능입니다.

Node.js 생태계에는 핫 리로딩을 달성하기 위한 몇 가지 옵션이 있습니다. 널리 사용되는 도구 중 하나는 전체 프로세스를 강제 재시작하는 [`nodemon`](https://github.com/remy/nodemon)입니다.

```bash
nodemon index.js
```

또는 Node.js v18부터 실험적으로 `--watch` 플래그가 도입되었습니다.

```bash
node --watch index.js
```

두 방법 모두 코드가 변경될 때 애플리케이션을 실시간으로 다시 로드하는 것을 목표로 합니다. 그러나 특정 환경이나 시나리오에서는 서로 다른 동작을 보일 수 있습니다.

예를 들어, `nodemon`은 HTTP 및 웹소켓 연결이 끊기는 등의 장애를 일으킬 수 있으며, `--watch` 플래그는 실험 중이므로 전체 기능을 제공하지 않을 수 있으며, [GitHub 이슈](https://github.com/nodejs/node/issues?q=--watch)에 몇 가지 문제가 보고되었습니다.

Bun은 핫 리로딩 기능을 한 단계 더 발전시켰습니다. `--hot` 플래그와 함께 Bun을 실행하면 핫 리로딩이 활성화됩니다.

```bash
bun --hot index.ts
```

전체 프로세스를 다시 시작해야 하는 Node.js 메서드와 달리 Bun은 이전 프로세스를 종료하지 않고 제자리에서 코드를 다시 로드합니다. 따라서 HTTP 및 웹소켓 연결이 중단되지 않고, 애플리케이션 상태가 유지되므로 보다 원활한 개발 환경을 제공합니다.

### Node.js 호환성

새로운 런타임이나 환경으로 전환할 때, 호환성은 개발자의 주요 관심사입니다. Bun은 Node.js를 대체하는 도구로 포지셔닝하여 이 문제를 해결합니다. 즉, 기존 Node.js 애플리케이션과 npm 패키지를 수정하지 않고도 Bun과 원활하게 통합할 수 있습니다. 이러한 호환성을 보장하는 주요 기능은 다음과 같습니다.

- `fs`,`path`,`net`과 같은 내장 Node.js 모듈을 지원합니다.
- `__dirname`과 `process` 같은 전역 변수를 인식합니다.
- 익숙한 `node_modules` 구조를 포함한 Node.js 모듈 확인 알고리즘을 준수합니다.

> Bun은 계속 발전하고 있습니다. 개발 워크플로우를 개선하도록 맞춤화되어 있으며, 서버리스 기능과 같이 리소스가 제한된 환경에 이상적입니다. Bun의 개발팀은 포괄적인 Node.js 호환성과 널리 사용되는 프레임워크와의 더 나은 통합을 위해 노력하고 있습니다.

Bun은 Node.js와의 호환성을 보장하지만 거기서 멈추지 않습니다. Bun은 개발자에게 가장 필요한 기능을 위해 고도로 최적화된 표준 라이브러리 API를 함께 제공합니다.

### Bun API

#### Bun.file()

파일을 느리게 로드하고 다양한 형식으로 콘텐츠에 접근할 수 있습니다. 이 방법은 Node.js보다 최대 10배 빠릅니다.

```js
// Bun (index.ts)
const file = Bun.file('package.json');
await file.text();

// Node.js (index.mjs)
const fs = require('fs/promises');
const fileContents = await fs.readFile('package.json', 'utf-8');
```

#### Bun.write()

문자열부터 블롭(Blob)까지 디스크에 데이터를 쓸 수 있는 다용도 API입니다. Node.js보다 최대 3배 빠르게 기록합니다.

```js
// Bun (index.ts)
await Bun.write('index.html', '<html/>');

// Node.js (index.mjs)
const fs = require('fs/promises');
await fs.writeFile('index.html', '<html/>');
```

#### Bun.serve()

웹 표준 API를 사용하여 HTTP 서버 또는 웹소켓 서버를 설정합니다. Node.js보다 초당 4배 더 많은 요청을 처리할 수 있으며 Node.js의 `ws` 패키지보다 5배 더 많은 웹소켓 메시지를 처리할 수 있습니다. 이 백엔드 기능은 개발자가 Node.js에서 Express를 사용하는 방식과 유사하지만, Bun의 성능 최적화를 통해 추가적인 이점을 얻을 수 있습니다.

```js
// Bun (index.ts)
Bun.serve({
  port: 3000,
  fetch(request) {
    return new Response('Hello from Bun!');
  },
});

// Node.js (index.mjs)
import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from Node.js!');
});
server.listen(3000);
```

Bun은 또한 sqlite와 password를 기본적으로 지원합니다.

## Bun vs Node.js: 패키지 관리자

Bun은 단순한 런타임이 아니라 강력한 패키지 관리자가 포함된 고급 도구입니다. 종속성을 설치하는 동안 인내심을 갖고 기다려야 했던 경험이 있다면 Bun은 놀랍도록 빠른 대안을 제공합니다. Bun을 런타임으로 사용하지 않더라도, 내장된 패키지 관리자를 사용하면 개발 워크플로우의 속도를 높일 수 있습니다.

아래 표에서 Bun 커맨드를 Node의 패키지 관리자 [npm](https://www.npmjs.com/)과 비교해 보세요.

| Bun                       | npm                           | 목적                                      |
| ------------------------- | ----------------------------- | ----------------------------------------- |
| `bun install`             | `npm install`                 | `package.json`의 모든 종속성 설치         |
| `bun add <package>`       | `npm install <package>`       | 프로젝트에 새 패키지 추가                 |
| `bun add <package> --dev` | `npm install <package> --dev` | 새 개발 전용 패키지 추가                  |
| `bun remove <package>`    | `npm uninstall <package>`     | 프로젝트에서 패키지 제거                  |
| `bun update <package>`    | `npm update <package>`        | 특정 패키지를 최신 버전으로 업데이트      |
| `bun run <script>`        | `npm run <script>`            | `package.json`에서 지정된 스크립트를 실행 |

언뜻 보기에 Bun의 명령은 익숙해 보이지만 경험은 전혀 평범하지 않습니다. Bun은 npm보다 몇 배나 빠른 설치 속도를 자랑합니다. 이는 전역 모듈 캐시를 활용하여 npm 레지스트리에서 중복 다운로드를 제거함으로써 달성할 수 있습니다. 또한 Bun은 각 운영 체제에서 사용할 수 있는 가장 빠른 시스템 호출을 사용하여 최적의 성능을 보장합니다.

다음은 캐시에서 Remix 프로젝트 스타터의 종속 요소를 설치하는 속도 비교로, Bun과 npm을 비교한 것입니다.
![](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F68bfdc8b5baa41dba053822bca1ff1f7?format=webp&width=2000)

> `bun` CLI에는 `npm`, `yarn`, `pnpm`을 획기적으로 빠르게 대체할 수 있도록 설계된 Node.js와 호환 가능한 패키지 관리자가 포함되어 있습니다.

또한, `bun run <command>`는 7ms밖에 걸리지 않는 반면, `npm run <command>`는 176ms가 걸립니다. Node.js의 npm은 수년 동안 자바스크립트 패키지 관리의 표준이었지만, Bun은 속도 면에서 정말 강력하며 매력적인 대안을 제시합니다.

## Bun vs Node.js: 번들러

번들링은 여러 개의 자바스크립트 파일을 가져와서 하나 이상의 최적화된 번들로 병합하는 프로세스입니다. 이 과정에는 타입스크립트를 자바스크립트로 변환하거나 코드를 축소하여 크기를 줄이는 등의 변환 작업도 포함될 수 있습니다.

Node.js 생태계에서 번들링은 일반적으로 Node.js 자체보다는 서드파티 도구를 통해 처리합니다. Node.js 세계에서 가장 인기 있는 번들러로는 [코드 분할](https://developer.mozilla.org/en-US/docs/Glossary/Code_splitting), [트리 쉐이킹](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking), [핫 모듈 교체](https://webpack.js.org/concepts/hot-module-replacement/)와 같은 기능을 제공하는 [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/), [Parcel](https://parceljs.org/) 등이 있습니다.

반면에 Bun은 런타임이자 패키지 관리자일 뿐만 아니라 그 자체로 번들러이기도 합니다. 브라우저의 프런트엔드 애플리케이션(React 또는 Next.js 애플리케이션) 및 Node.js를 비롯한 다양한 플랫폼을 위한 자바스크립트 및 타입스크립트 코드를 번들링하도록 설계되었습니다.

Bun으로 번들링하려면 간단한 명령어를 사용하면 됩니다.

```bash
bun build ./index.ts --outdir ./build
```

이 명령은 `index.ts` 파일을 번들링하여 `./build` 디렉터리에 결과를 출력합니다. 번들링 프로세스는 매우 빠르며, Bun은 esbuild보다 1.75배 빠르며 Parcel 및 Webpack과 같은 다른 번들러보다 훨씬 빠릅니다.
![](https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2Fd43dc089058a4b448de3c189ed20cbf6?format=webp&width=2000)

Bun은 0.17초, esbuild는 0.3초, rspack은 4.45초, Parcel 2는 26.32초, Rollup은 32초, Webpack 5는 38.02초가 소요됩니다.

Bun에서 눈에 띄는 기능은 자바스크립트 매크로를 도입한 것입니다. 이를 통해 번들링 중에 자바스크립트 함수를 실행하고 그 결과를 최종 번들에 직접 포함할 수 있습니다. 이 메커니즘은 번들링에 대한 새로운 관점을 제공합니다.

Bun의 자바스크립트 매크로를 활용하여 번들링 프로세스 중에 사용자 이름을 가져오는 이 예시를 확인해 보세요. 매크로는 런타임 API를 호출하는 대신 번들 타임에 데이터를 가져와서 결과를 최종 출력에 직접 포함시킵니다.

```js
// users.ts

export async function getUsername() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await response.json();
  return user.name;
}

// index.ts

import { getUsername } from "./users.ts" with { type: "macro" };
const username = await getUsername();

// build/index.js

var user = await "Leanne Graham";
console.log(user);
```

Node.js에는 이미 확고한 번들링 도구가 있지만, Bun은 번들링 환경을 재편할 수 있는 통합적이고 빠르며 혁신적인 대안을 제공합니다.

## Bun vs Node.js : 테스트 러너

테스트는 소프트웨어 개발의 중요한 측면으로, 코드가 예상대로 작동하는지 확인하고, 잠재적인 문제를 프로덕션 배포 전에 포착합니다. Bun은 런타임, 패키지 관리자, 번들러일 뿐 아니라 테스트 러너 역할도 수행합니다.

Node.js 개발자는 전통적으로 테스트 요구 사항을 충족하기 위해 [Jest](https://jestjs.io/)에 의존해 왔지만, Bun은 속도, 호환성 및 최신 개발 워크플로우에 맞는 다양한 기능을 보장하는 내장된 테스트 러너를 도입했습니다.

Bun의 테스트 러너인 `bun:test`는 'expect' 스타일 API로 잘 알려진 테스트 프레임워크인 Jest와 완벽하게 호환되도록 설계되었습니다. 이러한 호환성 덕분에 Jest에 익숙한 개발자는 가파른 학습 곡선 없이도 Bun으로 쉽게 전환할 수 있습니다.

```js
import { test, expect } from 'bun:test';

test('2 + 2', () => {
  expect(2 + 2).toBe(4);
});
```

`bun test` 명령으로 간단하게 테스트를 실행할 수 있습니다. 또한 Bun의 런타임은 타입스크립트와 JSX를 기본적으로 지원하므로 추가 구성이나 플러그인이 필요하지 않습니다.

### Jest 또는 Vitest에서 마이그레이션하기

호환성에 대한 Bun의 노력은 Jest의 전역 임포트 지원을 통해 빛을 발합니다. 예를 들어, `@jest/global` 또는 `vitest`에서 임포트하면 내부적으로 `bun:test`로 다시 매핑됩니다. 즉, 코드를 수정하지 않고도 기존 테스트 스위트(suties)를 Bun에서 실행할 수 있습니다.

```js
// index.test.ts
import { test } from '@jest/globals';

describe('test suite', () => {
  test('addition', () => {
    expect(1 + 1).toBe(2);
  });
});
```

### 성능 벤치마크

Bun의 테스트 러너는 호환성뿐만 아니라 속도도 뛰어납니다. [Zod](https://zod.dev/) 테스트 스위트에 대한 벤치마크에서 Bun은 Jest보다 13배, Vitest보다 8배 빠른 것으로 입증되었습니다. 이러한 속도 우위는 빠른 네이티브 코드로 구현된 Bun의 매처(matchers)를 통해 더욱 두드러집니다. 예를 들어, Bun의 `expect().toEqual()`은 Jest보다 무려 100배, Vitest보다 10배 빠릅니다.

기존 테스트를 마이그레이션 하든 새 프로젝트를 시작하든, Bun은 최신 개발 요구사항에 부합하는 강력한 테스트 환경을 제공합니다.

## 결론

Node.js는 오랫동안 자바스크립트 세계에서 기준이 되어 개발자를 안내하는 초석 역할을 해왔습니다. 하지만 Bun은 주목할 만한 도전자로 등장하여 경계를 허물고 있습니다.

아직은 초기 단계이지만 Bun이 불러일으키고 있는 화제는 부정할 수 없습니다. 현재 MacOS와 Linux에 최적화되어 있으며, Windows 지원도 진행 중이지만 일부 기능은 곧 추가될 예정입니다. 다양한 기능을 제공하는 Bun은 꼭 한 번 살펴봐야 할 도구입니다.

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
