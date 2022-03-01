---
title: '[프로그래머스] K번째수 - 자바스크립트'
date: 2022-02-28 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

배열 array의 i번째 숫자부터 j번째 숫자까지 자르고 정렬했을 때, k번째에 있는 수를 구하려 합니다.

예를 들어 array가 [1, 5, 2, 6, 3, 7, 4], i = 2, j = 5, k = 3이라면

array의 2번째부터 5번째까지 자르면 [5, 2, 6, 3]입니다.
1에서 나온 배열을 정렬하면 [2, 3, 5, 6]입니다.
2에서 나온 배열의 3번째 숫자는 5입니다.
배열 array, [i, j, k]를 원소로 가진 2차원 배열 commands가 매개변수로 주어질 때, commands의 모든 원소에 대해 앞서 설명한 연산을 적용했을 때 나온 결과를 배열에 담아 return 하도록 solution 함수를 작성해주세요.

### 제한사항

array의 길이는 1 이상 100 이하입니다.
array의 각 원소는 1 이상 100 이하입니다.
commands의 길이는 1 이상 50 이하입니다.
commands의 각 원소는 길이가 3입니다.

### 입출력 예

| array                 | commands                         | return    |
| --------------------- | -------------------------------- | --------- |
| [1, 5, 2, 6, 3, 7, 4] | [2, 5, 3], [4, 4, 1], [1, 7, 3]] | [5, 6, 3] |

---

### 내 코드

```javascript
function solution(array, commands) {
  var answer = []
  commands.forEach(command => {
    const [i, j, k] = command
    var arr = array.slice(i - 1, j)
    arr.sort((a, b) => a - b)
    answer.push(arr[k - 1])
  })
  return answer
}
```

커멘드에 있는 배열을 하나씩 꺼내어 주어진 배열에 적용시켜야 했기 때문에, 배열을 하나씩 꺼내보기 위해 `forEach` 구문을 사용했고, 여기서 배열의 값들을 하나씩 받기 위하여 `const [i,j,k] = command`와 같은 방식으로 구조분해 할당을 하여 변수에 할당하였다. 그리고 배열을 슬라이싱 하기 위해 `slice()`함수를 사용하였고, (이 부분은 확실히 파이썬이 편하긴하다..) 여기서 `splice()`함수와도 헷갈리긴 했는데, slice 함수는 배열의 인덱스 구간을 잘라서 얕게 복사한 배열 객체를 반환하는 것이고, 원본 배열을 수정하지 않는다. 하지만 splice 함수의 경우에는 지울 원소 개수와 추가할 원소들을 받아서 원본 객체를 직접 수정한다. 원본 배열을 수정하거나 이어 붙힐 때 주로 사용한다. 이렇게 자바스크립트 함수에 대해서 헷갈리는 부분들은 완전히 마스터해야겠다. 그리고 항상 주의 할 것은 자바스크립트에서 `sort()`할 때, 숫자의 경우 따로 함수를 넣어주지 않을 경우 문자순으로 정렬되기 때문에 원치않는 결과가 나올 수 있는 것을 명심하자.

### 다른 사람의 코드

```javascript
function solution(array, commands) {
  return commands.map(command => {
    const [sPosition, ePosition, position] = command
    const newArray = array
      .filter(
        (value, fIndex) => fIndex >= sPosition - 1 && fIndex <= ePosition - 1
      )
      .sort((a, b) => a - b)
    return newArray[position - 1]
  })
}
```

이 풀이도 구조분해 할당을 썼다는 것은 동일하지만 `filter`를 사용하여서 풀이했다는 것이 새로웠다. 하지만 내 생각에는 이 문제를 풀 때의 로직을 좀 더 잘 표현하는 것은 내 풀이가 맞다고 생각한다. filter를 쓰는 순간 filter 기준에 대해 집중해야 하는데, 이것은 코드를 보는 입장에서는 로직이 바로 이해가지 않기 때문에 `slice()`함수와 같이 코드의 의도를 명확히 표현하는 방식이 낫지 않나 싶다. 하지만 그래도 이러한 사고를 하는 것은 중요하기 때문에 사고의 범위를 넓혀야 겠다는 생각이 든다.
