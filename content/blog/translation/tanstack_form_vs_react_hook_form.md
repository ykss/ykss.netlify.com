---
title: '(번역) TanStack Form vs React Hook Form'
date: 2025-06-10 09:30:00
category: 'Translation'
draft: false
---

> 원문 : [TanStack Form vs. React Hook Form](https://blog.logrocket.com/tanstack-form-vs-react-hook-form/)

리액트에서 폼을 구축할 때, 좋은 전략 없이 진행하면 코드가 반복되고 복잡해지기 쉽습니다. 이 때문에 많은 개발자들이 [React Hook Form](https://react-hook-form.com/) 같은 인기 있는 라이브러리를 사용하여 폼을 관리합니다. 하지만 새로운 폼 라이브러리인 [TanStack Form](https://tanstack.com/form/latest)은 React Hook Form과 어떻게 비교될까요? 그리고 이 라이브러리를 사용할 만한 가치가 있을까요?

![TanStack Form vs. React Hook Form](https://blog.logrocket.com/wp-content/uploads/2025/05/tanstack-form-vs-react-hook-form.png)

이 가이드는 두 라이브러리를 공정하게 비교하는 것을 목표로 합니다. 마지막에는 기준에 따라 어떤 라이브러리를 사용하는 것이 좋을지 추천도 드릴 예정입니다. 이 튜토리얼을 따라가기 위해서는 리액트와 타입스크립트에 대한 기본적인 지식이 필요합니다.

## TanStack Form이란?

![TanStack Form](https://blog.logrocket.com/wp-content/uploads/2025/05/tanstack-form.png)

TanStack Form은 [React Query](https://tanstack.com/query/latest)(현재는 TanStack Query), [TanStack Router](https://tanstack.com/router/latest), [TanStack Start](https://blog.logrocket.com/tanstack-start-overview/) 등 인기 있는 도구들을 만든 팀에서 만든 폼 관리 라이브러리입니다. TanStack Form은 타입 안정성, 유연한 폼 검증, 렌더링 속도를 우선시합니다. 또한 재사용 가능한 폼 구성 요소를 쉽게 구축할 수 있으며, 프레임워크에 종속되지 않고 리액트, 뷰, 앵귤러, Solid, Lit, Svelte와 함께 사용할 수 있습니다.

## TanStack Form의 특징

- **보장된 타입 안정성**: TanStack Form은 타입스크립트로 작성되었고, 타입 안정성을 엄격히 따릅니다. 이에 따라 API는 최대한 타입 안정적이며, 타입 안전한 개발 패턴을 따르도록 장려합니다. 그러므로 TanStack Form으로 구축된 폼은 견고하고 버그가 현저히 줄어듭니다.

- **유연한 폼 검증**: TanStack Form은 폼 검증에 다양한 접근 방식을 허용합니다. on blur, input change, submit, on mount 시점 등에서 검증이 가능합니다. 전체 폼, 폼의 일부분, 개별 필드 단위로도 유효성 검사가 가능합니다. 또한 [Zod 같은 검증 라이브러리](https://blog.logrocket.com/schema-validation-typescript-zod/)와 호환되며, 개발자가 커스텀 에러 메시지를 쉽게 작성할 수 있습니다. 비동기 유효성 검사와 [디바운싱](https://blog.logrocket.com/create-custom-debounce-hook-react/)도 손쉽게 설정할 수 있으며, 내장된 구현으로 지원됩니다.

- **상태 제어(controlled) 폼 필드**: TanStack Form은 제어된 입력만 허용하며, 폼 상태를 직접 관리합니다. 공식 문서에 따르면, 제어된 입력은 예측 가능성과 테스트 용이성 등의 이점이 있기 때문에 [의도적으로 이 방식을 채택](https://tanstack.com/form/latest/docs/philosophy#controlled-is-cool)했다고 합니다. 제어된 입력만을 사용하므로 DOM과 상호작용(즉, uncontrolled)할 필요가 없어 리액트 네이티브에서도 원활하게 작동합니다.

- **대규모 애플리케이션을 위한 설계**: TanStack Form의 API는 대규모 애플리케이션을 염두에 두고 개발되었습니다. 물론 단순한 폼 관리에도 사용할 수 있지만, 대규모 애플리케이션에서 복잡한 대규모 폼을 다룰 때 많은 이점을 얻을 수 있습니다. 재사용할 수 있는 폼 섹션([폼 합성](https://tanstack.com/form/latest/docs/framework/react/guides/form-composition))을 만들 수 있고, 커스텀 디자인 시스템과도 호환됩니다.

## TanStack Form 사용법

이 섹션에서는 TanStack Form을 리액트 프로젝트에서 사용하는 방법을 보여줍니다. 여기에는 간단한 폼을 만드는 튜토리얼과 더 복잡한 폼을 만드는 예제가 포함됩니다.

TanStack Form 문서에 따르면 타입스크립트 v5.4 이상이 필요합니다. 리액트에서 사용할 것이므로 `@tanstack/react-form` 패키지를 설치합니다.

또한 여기서는 npm 패키지 관리자를 사용하겠지만, 어떤 패키지 관리자를 사용해도 좋습니다.

```bash
npm install --save-exact @tanstack/react-form
```

`--save-exact` 플래그를 사용하는 이유는 TanStack Form의 API 타입 변경이 [시멘틱 버저닝](https://docs.npmjs.com/about-semantic-versioning)에서 패치로 간주하기 때문입니다. 따라서 업그레이드 시 타입 관련 문제를 방지하기 위해 특정 패치 버전에 고정하는 것이 중요합니다.

패키지를 설치한 후 리액트에서 TanStack Form을 사용할 수 있습니다.

### TanStack Form으로 간단한 폼 만들기

이 튜토리얼의 최종 소스 코드는 [StackBlitz에서](https://stackblitz.com/edit/vitejs-vite-ayqqa1nt?file=README.md) 확인할 수 있습니다.

간단한 폼을 만들기 위해서는 `useForm` API가 필요합니다. 이 훅은 새 폼 인스턴스를 생성합니다. [문서](https://tanstack.com/form/latest/docs/framework/react/guides/basic-concepts#:~:text=A%20Form%20Instance%20is%20an%20object%20that%20represents%20an%20individual%20form%20and%20provides%20methods%20and%20properties%20for%20working%20with%20the%20form.)에 따르면, “폼 인스턴스는 개별 폼을 나타내는 객체이며 폼과 상호작용을 할 수 있는 메서드와 속성을 제공합니다.”라고 설명합니다.

이 훅은 폼에서 받을 필드(또는 데이터 옵션)를 정의하는 데 사용됩니다. 또한 이 훅은 폼이 제출될 때 호출되는 `onSubmit` 함수도 정의합니다. 훅에 전달된 `onSubmit` 함수는 폼 응답 데이터에 접근할 수 있으며, 이 함수 안에서 개발자는 폼 응답을 가지고 원하는 작업을 자유롭게 수행할 수 있습니다.

이 튜토리얼은 Tailwind CSS를 스타일링에 사용하며, 설정 가이드는 [다음](https://tailwindcss.com/docs/installation/using-vite)과 같습니다.

`useForm` 훅을 프로젝트에 import합니다.

```jsx
import { useForm } from '@tanstack/react-form';
```

다음으로 폼의 기본 값을 정의하고 `onSubmit` 함수를 생성합니다.

```tsx
// ...
function App() {
  const form = useForm({
    defaultValues: { username: '', passowrd: '' },

    onSubmit: ({ value }) => {
      // 폼 입력을 다룹니다.
      alert(JSON.stringify(value, null, 4));
    },
  })

  return (/* 컴포넌트의 JSX */)
}
```

이후, 폼이 위치할 페이지를 설정합니다.

```tsx
// ...
function App() {
  const form = useForm({
    defaultValues: { username: '', passowrd: '' },

    onSubmit: ({ value }) => {
      // 폼 입력을 다룹니다.
      alert(JSON.stringify(value, null, 4));
    },
  });

  return (
    <main className="mx-auto px-5 max-w-xl">
      <h1 className="font-semibold my-6 text-xl">Login Form</h1>
      <form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* 필드 항목들 추가 */}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center cursor-pointer"
          onClick={() => form.handleSubmit()}
        >
          Submit
        </button>
      </form>
    </main>
  );
}
```

다음으로 TanStack Form Field(대문자 F를 주목하세요.)를 추가합니다. TanStack Form Field는 폼 인스턴스로부터 가져오는 리액트 컴포넌트이며, 단일 폼 입력를 관리합니다. 필드는 `name`(`useForm`에서 정의된 폼 옵션 중 하나), `validators`(필드에 대한 유효성 검사 함수가 포함된) 등의 프로퍼티를 받습니다.

필드 컴포넌트는 `field` 객체를 전달하는 자식도 허용합니다. TanStack Form에서 `field` 객체는 입력 필드의 상태를 제어하는 데 도움이 됩니다.

이 간단한 폼에는 username과 password라는 두 개의 인풋이 있으므로 두 개의 `form.Field` 컴포넌트가 필요합니다.

```tsx
// App.tsx

// ...
<form.Field name="username">
  {(field) => (
     <div className="mb-6">
        <label
          htmlFor={field.name}
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Username
        </label>
        <input
          id={field.name}
          name={field.name}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          autoComplete="off"
          required
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
    </div>
  )}
</form.Field>

<form.Field name="passowrd">
  {(field) => (
    <div className="mb-6">
      <label
        htmlFor={field.name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Password
      </label>
      <input
        id={field.name}
        name={field.name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        type="password"
        autoComplete="off"
        required
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  )}
</form.Field>
//...
```

이제 간단한 로그인 폼을 확인할 수 있습니다.

![로그인 폼](https://blog.logrocket.com/wp-content/uploads/2025/05/simple-form.png)

`useForm` 훅에서는 `validators` 옵션을 통해 전체 폼에 대한 검증 로직도 작성할 수 있습니다.

```tsx
const form = useForm({
  //...
  validators: ({ value }) => {
    /**/
  },
});
```

그러나 이 예시에서는 필드 단위의 검증을 사용할 것입니다.

```tsx
<form.Field
  name="username"
  validators={{
    onChange: ({ value }) =>
      value.includes(' ') ? 'Username cannot contain space' : undefined,
  }}
>
  {(field) => (
    <div className="mb-6">
      <label
        htmlFor={field.name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Username
      </label>
      <input
        id={field.name}
        name={field.name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        autoComplete="off"
        required
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em role="alert" className="text-xs text-red-600">
          {field.state.meta.errors.join(', ')}
        </em>
      )}
    </div>
  )}
</form.Field>

<form.Field
  name="passowrd"
  validators={{
    onBlur: ({ value }) =>
      value.length < 5 ? 'Password is too short' : undefined,
  }}
>
  {(field) => (
    <div className="mb-6">
      <label
        htmlFor={field.name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        Password
      </label>
      <input
        id={field.name}
        name={field.name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        type="password"
        autoComplete="off"
        required
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <em role="alert" className="text-xs text-red-600">
          {field.state.meta.errors.join(', ')}
        </em>
      )}
    </div>
  )}
</form.Field>
```

폼 유효성 검사가 얼마나 유연한지 확인할 수 있습니다. 첫 번째 필드는 `onChange` 시점에, 두 번째 필드는 `onBlur` 시점에 검증됩니다. 커스텀 에러 메시지도 설정되어 있어 사용자에게 제출 시점에 오류를 보여줄 수 있습니다.

![완성된 로그인 폼](https://blog.logrocket.com/wp-content/uploads/2025/05/custom-error-messages.png)

이제 간단한 폼이 완성되었습니다.

### TanStack Form으로 복잡한 폼 만들기

`useForm` 훅으로 간단한 폼을 만들 수 있지만, TanStack Form은 훨씬 더 많은 기능을 제공하며 복잡한 폼도 수용할 수 있습니다. 앞서 언급했듯이 이 폼들은 기존 디자인 시스템에 쉽게 통합될 수 있습니다. 또한 TanStack Form의 API는 대규모 프로젝트에서 장기적으로 보일러플레이트를 줄이는 것을 궁극적인 목표로 합니다.

다음 튜토리얼에서는 TanStack Form을 심화된 사용 사례에서 사용하는 방법을 보여줍니다. 이 섹션의 최종 소스 코드는 [StackBlitz에서 확인](https://stackblitz.com/edit/vitejs-vite-obwvslp2)할 수 있습니다.

TanStack Form은 Zod 또는 [Valibot](https://valibot.dev/)과 같은 스키마 검증 라이브러리와 매끄럽게 통합됩니다. 이 예제에서는 Zod를 사용합니다.

새 리액트 프로젝트를 설정한 후 Zod를 설치합니다.

```bash
npm i zod
```

Tailwind CSS도 설정합니다. 이 예제에서는 Tailwind를 스타일링 프레임워크로 사용합니다.

TanStack Form에서는 자체적인 폼 훅을 생성하고 해당 훅에 자체 컨텍스트 및 커스텀 폼 UI 컴포넌트를 연결하는 것을 권장합니다. 리액트의 컨텍스트는 깊은 컴포넌트 트리에서 [프로퍼티 드릴링(prop drilling)](https://blog.logrocket.com/the-upsides-of-prop-drilling-in-react/) 없이 데이터를 전달할 수 있게 해 줍니다. 이 경우 TanStack Form은 컨텍스트를 생성한 후 폼 훅에 추가하는 과정이 있어야 합니다.

`src` 폴더 안에 `utils` 폴더를 생성한 뒤, 그 안에 `formContext.ts` 파일을 만듭니다. 이 파일에서는 `@tanstack/react-form`의 `createFormHookContexts`를 import하여 폼 컨텍스트를 생성합니다.

```ts
// utils/formContext.ts
import { createFormHookContexts } from '@tanstack/react-form';

export const {
  formContext,
  fieldContext,
  useFieldContext,
} = createFormHookContexts();
```

다음으로 `utils` 폴더 안에 `formOpts.ts` 파일을 생성하고, 폼 필드들의 기본 값을 정의합니다. 이 파일에서는 `@tanstack/react-form`의 `formOptions` 헬퍼 함수를 사용합니다.

```ts
// utils/formOpts.ts
import { formOptions } from '@tanstack/react-form';

interface RegisterData {
  fullname: string;
  age: number;
  email: string;
  username: string;
  password: string;
  acceptTerms: boolean;
}

const defaultValues: RegisterData = {
  fullname: '',
  age: 0,
  email: '',
  username: '',
  password: '',
  acceptTerms: false,
};

export const formOpts = formOptions({ defaultValues });
```

`utils` 폴더 안에 `useAppForm.ts` 파일을 생성합니다. 파일 내에서 `@tanstack/react-form`의 `createFormHook`을 가져옵니다. 이 함수는 이전에 정의된 컨텍스트와 커스텀 폼 컴포넌트가 포함된 폼 훅을 생성합니다. 또한 `src/utils/formContext.ts` 파일에서 `fieldContext`와 `formContext`를 가져옵니다.

```ts
import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './formContext';
import TextField from '../components/TextField';
import CheckField from '../components/CheckField';

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    CheckField,
  },
  formComponents: {},
});

export default useAppForm;
```

`fieldComponents`에 import 된 `TextField`와 `CheckField`가 추가된 것을 볼 수 있습니다. 이 컴포넌트들은 `useAppForm` 훅에 바인딩 된 커스텀 리액트 UI 컴포넌트입니다.

그런 다음 가져온 UI 컴포넌트들을 생성합니다. `src` 폴더에 `components` 폴더를 만든 후, 그 안에 재사용 가능한 모든 컴포넌트들을 추가합니다. 먼저 `Label.tsx` 파일을 생성합니다.

```tsx
// components/Label.tsx
interface LabelProps extends React.ComponentProps<'label'> {}

function Label(props: LabelProps) {
  const { className, ...restProps } = props;

  return (
    <label
      className={`block mb-2 text-sm font-medium text-gray-900 ${className}`}
      {...restProps}
    />
  );
}
export default Label;
```

위는 폼의 UI와 함께 재사용 가능한 레이블 요소를 생성합니다.

그다음 `Input.tsx` 파일을 생성합니다.

```tsx
// components/Input.tsx
interface InputProps extends React.ComponentProps<'input'> {}

function Input(props: InputProps) {
  return (
    <input
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      autoComplete="off"
      {...props}
    />
  );
}

export default Input;
```

위는 스타일이 지정되고 재사용 가능한 폼의 입력 요소입니다.

이제 `utils/useAppForm.ts`에 `TextField` 컴포넌트를 생성합니다. 이 컴포넌트는 Tanstack Form `field` 객체에 접근할 수 있습니다.

```tsx
// components/TextField.tsx

import { useFieldContext } from '../utils/formContext';
import Label from './Label';
import Input from './Input';
import FieldError from './FieldError';

function TextField({ label, inputType }: { label: string; inputType: string }) {
  const field = useFieldContext<string>();
  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        type={inputType}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      />
      <FieldError field={field} />
    </>
  );
}
export default TextField;
```

`useFieldContext` 훅은 `utils/formContext.ts`에서 이전에 생성된 컨텍스트에 속하는 `field` 객체에 액세스 하는 데 사용됩니다. 가져온 `FieldError` 컴포넌트는 `field` 객체를 받아들이고 필드와 관련된 오류 메시지를 표시하는 리액트 컴포넌트입니다.

추가로 체크박스를 위한 Field 컴포넌트를 생성합니다. 이것은 사용자가 이용 약관에 동의하기 위해 체크할 폼 필드입니다 (튜토리얼 폼의 경우).

```tsx
// components/CheckField.tsx

import { useFieldContext } from '../utils/formContext';
import FieldError from './FieldError';
import Label from './Label';

function CheckField({ label }: { label: string }) {
  const field = useFieldContext<boolean>();

  return (
    <>
      <input
        type="checkbox"
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.checked)}
      />
      <Label htmlFor={field.name} className="inline-block ml-2">
        {label}
      </Label>
      <FieldError field={field} />
    </>
  );
}

export default CheckField;
```

마지막으로 에러 메시지를 표시하는 재사용 가능한 `FieldError` 컴포넌트를 만듭니다.

```tsx
// components/FieldError.tsx

import { type AnyFieldApi } from "@tanstack/react-form";

function FieldError({ field }: { field: AnyFieldApi }) {
  return (
    <span className="block mb-5">
      {!field.state.meta.isValid && (
        <em className="text-red-600 text-xs">
          {field.state.meta.errors.map((err) => err.message).join(", ")}
        </em>
      )}
    </span>
  );
}

export default FieldError;
```

이제 `src/App.tsx`로 가서 `useAppForm` 훅을 사용하여 폼을 생성합니다. `useAppForm`을 사용할 때는, `form.Field` 대신 `form.AppField` 컴포넌트를 사용하여 필드를 구성합니다.

```tsx
// App.tsx

import useAppForm from './utils/useAppForm';
import { formOpts } from './utils/formOpts';

function App() {
  const form = useAppForm({
    ...formOpts,
    validators: {},
    onSubmit: ({ value }) => {
      alert(JSON.stringify(value, null, 4));
    },
  });
  return (
    <main className="mx-auto px-5 max-w-xl">
      <h1 className="font-semibold my-6 text-xl">Register Form</h1>
      <form
        method="post"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="fullname"
          children={field => (
            <field.TextField label="Full Name" inputType="text" />
          )}
        />
        <form.AppField
          name="email"
          children={field => (
            <field.TextField label="Email" inputType="email" />
          )}
        />
        <form.AppField
          name="age"
          children={field => <field.TextField label="Age" inputType="number" />}
        />
        <form.AppField
          name="username"
          children={field => (
            <field.TextField label="Username" inputType="text" />
          )}
        />
        <form.AppField
          name="password"
          children={field => (
            <field.TextField label="Password" inputType="password" />
          )}
        />
        <form.AppField
          name="acceptTerms"
          children={field => (
            <field.CheckField label="I accept all terms and conditions" />
          )}
        />
        <button
          type="submit"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-auto px-5 py-2.5 text-center cursor-pointer"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
export default App;
```

이제 폼을 확인할 수 있습니다.

![예제 폼](https://blog.logrocket.com/wp-content/uploads/2025/05/complex-form.png)

마지막으로, 이 튜토리얼에서는 Zod와 `useAppForm`의 `validators` 속성을 사용하여 입력의 유효성을 검사합니다. 프로젝트에서 Zod를 사용하여 사용자 정의 오류 메시지를 작성하는 방법도 주목하세요. 폼은 `onSubmit` 시에만 유효성을 검사합니다.

```tsx
// App.tsx

import { z } from 'zod'
// 기타 import

const registerSchema = z.object({
  email: z.string().email('An email is required'),
  fullname: z.string().min(3, 'Must be up to 3 letters'),
  age: z.number().min(13, 'You must be 13+ to register'),
  username: z.string().min(3, 'Must be up to 3 letters'),
  password: z.string().min(8, 'Must be up to 8 characters'),
  acceptTerms: z
    .boolean()
    .refine((value) => value, 'You must accept the terms to continue'),
})

function App() {
  const form = useAppForm({
    // ...
    validators: {
      onSubmit: registerSchema,
    },
  })
  return (/* JSX */)
}
export default App
```

이제 사용자가 제출할 때만 검증이 실행됩니다. 아래는 폼을 빈 상태로 제출될 때 사용자에게 표시되는 에러 메시지입니다.

![폼 에러 표시](https://blog.logrocket.com/wp-content/uploads/2025/05/complex-form-custom-error-messages.png)

이것으로 TanStack Form을 사용한 복잡한 폼 생성이 완료되었습니다. 더 고급 기능은 [TanStack Form 문서](https://tanstack.com/form/latest)를 참고하세요.

## TanStack Form에서의 반응성(Reactivity)

폼의 최신 값이나 반응형 상태에 접근하려면, TanStack Form 문서에서는 두 가지 방법 중 하나를 사용하여 폼 상태를 구독할 것을 권장합니다.

첫 번째 방법은 `useStore` 훅을 사용하는 것입니다. 이 훅은 리액트 컴포넌트의 로직에서 폼 상태가 필요할 때 유용합니다. 이 훅은 두 개의 인자를 받습니다. 첫 번째는 폼 인스턴스의 store(`form.store`)이고, 두 번째는 노출할(또는 구독할) 폼 상태의 속성을 반환하는 함수입니다.

예시는 다음과 같습니다.

```ts
const fullname = useStore(form.store, state => state.values.fullname);
const isFormValid = useStore(form.store, state => state.isFormValid);
```

두 번째 방법은 `form.Subscribe` 컴포넌트를 사용하는 것입니다. 이 컴포넌트는 `selector`라는 프로퍼티를 가지며, `useStore`의 두 번째 인자와 마찬가지로 상태에서 어떤 속성을 구독할지 반환하는 선택자 함수를 받습니다.

```tsx
<form.Subscribe selector={state => state.values.fullname}>
  {fullname => (
    <form.Field>
      {field => (
        <input
          name="email"
          value={
            field.state.email ||
            `${fullname.replaceAll(' ', '').toLowerCase()}@neomail.com`
          }
          onChange={field.handleChange}
        />
      )}
    </form.Field>
  )}
</form.Subscribe>
```

문서에 따르면, `form.Subscribe`는 앱의 UI 내부에서 폼 상태에 반응할 필요가 있을 때 가장 적합합니다. 위 예시에서 `state.values.fullname`을 선택하고 이를 `form.Subscribe`의 자식 컴포넌트로 전달하는 과정을 확인할 수 있습니다.

TanStack Form의 반응성에 대한 [더 자세한 설명](https://tanstack.com/form/latest/docs/framework/react/guides/reactivity)은 공식 문서를 참조하세요.

## React Hook Form 개요

![React Hook Form](https://blog.logrocket.com/wp-content/uploads/2025/05/react-hook-form.png)

React Hook Form(RHF)은 간결함을 강조하는 리액트 폼 관리 라이브러리입니다. 현재 리액트에서 가장 인기 있는 폼 관리 라이브러리이며, 리액트 네이티브에서도 작동합니다.

TanStack Form과 마찬가지로 RHF에서도 필요한 폼 상태 변경을 “구독”할 수 있어 불필요한 리 렌더링을 최소화할 수 있습니다. RHF는 TanStack Form과는 달리 제어된 입력과 비제어 입력 모두를 지원합니다.

[React Hook Form의 기능과 역량](https://blog.logrocket.com/building-reusable-multi-step-form-react-hook-form-zod/)에 대한 더 자세한 가이드는 공식 문서를 참고하세요.

## TanStack Form vs React Hook Form

두 라이브러리는 결국 같은 문제를 해결하려고 하지만, 접근 방식은 다릅니다. 이 섹션에서는 개발자 경험(DX), 기능, 번들 크기 등 다양한 기준으로 두 라이브러리를 비교합니다.

### 개발자 경험(DX)

TanStack Form은 특히 대규모 애플리케이션에서 React Hook Form보다 설정에 더 많은 코드가 필요합니다. 하지만 장기적으로는 보일러플레이트 코드를 줄이는 데 유리합니다. 두 라이브러리 모두 타입 안정성을 갖추고 있으며 IDE의 IntelliSense를 지원합니다.

### 기능

기본적인 폼 관리 측면에서는 두 라이브러리 모두 탁월한 성능을 보여줍니다. 그러나 대규모 프로젝트를 수용하는 데는 TanStack Form이 React Hook Form보다 우위에 있는 것으로 보입니다.

### 번들 크기

`@tanstack/react-form`은 몇 가지 의존성을 포함하고 있지만 여전히 컴팩트합니다. 가장 중요한 의존성은 `@tanstack/form-core`(TanStack Form의 핵심 엔진)와 `@tanstack/store`(`useStore` 기능 구현에 사용되는 TanStack 팀이 만든 상태 관리 라이브러리)입니다.

Bundlephobia에 따르면, TanStack Form v1.11(작성 시점의 최신 버전)은 압축 전(minified)에는 36.4 KB, 압축 및 gzip 처리 후에는 9.6 KB의 크기를 가집니다.

![Tanstack Form BundlePhobia 결과](https://blog.logrocket.com/wp-content/uploads/2025/05/bundlephobia-tanstack-form.png)

반면, React Hook Form은 의존성이 전혀 없습니다. Bundlephobia 기준 v7.56(작성 시점의 최신 버전) 기준으로 압축 전(minified)에는 30.2 KB, 압축 및 gzip 처리 후에는 10.7 KB의 크기를 가집니다.

![React Hook Form BundlePhobia 결과](https://blog.logrocket.com/wp-content/uploads/2025/05/bundlephobia-react-hook-form.png)

### 인기도

React Hook Form은 TanStack Form보다 훨씬 더 인기가 많습니다. 현재 GitHub에서 React Hook Form은 더 많은 스타를 가지고 있으며, npm 다운로드 수 또한 훨씬 많습니다. TanStack Form은 상대적으로 작은 커뮤니티를 가지고 있어, 문제에 직면했을 때 도움을 얻기 어려울 수 있습니다.

아래는 지난 1년간 두 라이브러리의 npmtrends 다운로드 비교 차트입니다.

![npmtrends 결과](https://blog.logrocket.com/wp-content/uploads/2025/05/npmtrends-comparing-form-libraries.png)

> 출처 : [https://npmtrends.com/@tanstack/react-form-vs-react-hook-form](https://npmtrends.com/@tanstack/react-form-vs-react-hook-form)

### 유지관리

두 패키지 모두 활발하게 유지 관리되고 있습니다. 아래는 지난 1년간 두 패키지에 대한 커밋 히트맵입니다.

아래는 `@tanstack/react-form`에 대한 히트맵입니다.

![Tanstack Form 히트맵](https://blog.logrocket.com/wp-content/uploads/2025/05/package-commits-tanstack.png)

그리고 아래는 `react-hook-form`에 대한 히트맵입니다.

![React Hook Form 히트맵](https://blog.logrocket.com/wp-content/uploads/2025/05/package-commits-react-hook-form.png)

> 출처 : [https://pkco.vercel.app/package/react-hook-form](https://pkco.vercel.app/package/react-hook-form)

## 요약 비교 (TL;DR)

| 항목                      | TanStack Form (v1.11)                    | React Hook Form (v7.56) |
| ------------------------- | ---------------------------------------- | ----------------------- |
| 번들 크기 (minified)      | 36.4 KB                                  | 30.2 KB                 |
| 번들 크기 (gzip 포함)     | 9.6 KB                                   | 10.7 KB                 |
| GitHub 스타 수            | 약 5.4K                                  | 약 43.1K                |
| npm 다운로드 (주간 기준)  | 약 219K                                  | 약 11M                  |
| 지원 프레임워크           | 리액트, Angular, Vue, Svelte, Lit, Solid | 리액트                  |
| 비동기 검증 지원          | 예                                       | 예                      |
| 내장 비동기 디바운싱 지원 | 예                                       | 불확실                  |
| 스키마 기반 검증          | 예                                       | 예                      |
| 리액트 네이티브 지원      | 예                                       | 예                      |
| 비제어 입력 지원          | 아니요                                   | 예                      |
| 반응형 구독 지원          | 예                                       | 예                      |

## 어떤 것을 선택해야 할까요?

상황에 따라 다릅니다.

간단한 폼을 구축하고 싶고, 덜 복잡한 API를 원한다면 React Hook Form이 적합합니다. 하지만 복잡한 폼을 만들고자 한다면 TanStack Form이 더 포괄적이고 유연한 해결책이 될 수 있습니다.

단, React Hook Form은 TanStack Form보다 성숙도가 높다는 것에 주목할 필요가 있습니다. 안정성이 가장 중요한 요소라면, 적어도 현재 시점에서는 React Hook Form이 더 적합할 수 있습니다.

여러분의 프로젝트에는 어떤 라이브러리가 더 적합할까요?

<br/>

> 🚀 한국어로 된 프런트엔드 아티클을 빠르게 받아보고 싶다면 Korean FE Article(https://kofearticle.substack.com/)을 구독해주세요!
