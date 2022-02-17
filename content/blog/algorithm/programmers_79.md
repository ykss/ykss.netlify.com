---
title: '[프로그래머스] 완주하지 못한 선수 - 자바스크립트'
date: 2022-02-18 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

수많은 마라톤 선수들이 마라톤에 참여하였습니다. 단 한 명의 선수를 제외하고는 모든 선수가 마라톤을 완주하였습니다.

마라톤에 참여한 선수들의 이름이 담긴 배열 participant와 완주한 선수들의 이름이 담긴 배열 completion이 주어질 때, 완주하지 못한 선수의 이름을 return 하도록 solution 함수를 작성해주세요.

### 제한사항

마라톤 경기에 참여한 선수의 수는 1명 이상 100,000명 이하입니다.
completion의 길이는 participant의 길이보다 1 작습니다.
참가자의 이름은 1개 이상 20개 이하의 알파벳 소문자로 이루어져 있습니다.
참가자 중에는 동명이인이 있을 수 있습니다.

### 입출력 예

| participant                                       | completion                               | return   |
| ------------------------------------------------- | ---------------------------------------- | -------- |
| ["leo", "kiki", "eden"]                           | ["eden", "kiki"]                         | "leo"    |
| ["marina", "josipa", "nikola", "vinko", "filipa"] | ["josipa", "filipa", "marina", "nikola"] | "vinko"  |
| ["mislav", "stanko", "mislav", "ana"]             | ["stanko", "ana", "mislav"]              | "mislav" |

---

### 내 코드

```javascript
function solution(participant, completion) {
  let a = participant.sort()
  let b = completion.sort()
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      answer = a[i]
      return answer
    }
  }
}
```

두 배열을 먼저 정렬한 다음에 같은 인덱스를 비교할 때 만약 불일치 하면 그 부분이 완주하지 못한 선수로 판단하여 반환되는 방법으로 풀었다.

### 다른 사람의 코드

```javascript
function solution(participant, completion) {
  var dic = completion.reduce(
    (obj, t) => ((obj[t] = obj[t] ? obj[t] + 1 : 1), obj),
    {}
  )
  return participant.find(t => {
    if (dic[t]) dic[t] = dic[t] - 1
    else return true
  })
}
```

이 방식은 `reduce()`와 `find()`를 이용한 방식인데, `find()` 함수가 주어진 판별 함수를 만족하는 첫 번째 요소의 값을 반환하는 특성을 이용하여 풀이한 것이다. 일단 딕셔너리(해시맵) 특성을 활용하였는데, 처음에 초기 값이 `{}` 빈 객체로 들어가고 빈 객체안에 `key-value`형식으로 할당하는 식이다. 그래서 `reduce()` 함수의 결과는 `["josipa", "filipa", "marina", "nikola"]` 배열을 넣었을 때, `{ josipa: 1, filipa: 1, marina: 1, nikola:1 }` 와 같은 형태가 `dic` 변수에 들어가게된다. 그리고 나서 참가자 배열에서 `find()` 함수를 통해서 배열 원소를 하나씩 꺼내서 `dic` 객체 안에 해당 값이 있는지 확인한다. 그래서 있으면 -1씩 value를 조정하고, 만약 이미 value가 0인 key가 있을 경우에 true를 리턴하면서 만족하는 첫 번째 요소(value가 0이었던 key)를 반환하여 답을 구했다. 나는 이렇게 자바스크립트에서 해시를 활용해보지도 않았었고 이런 방법은 생각해놓지 못했을 것 같은데 사고를 확장할 수 있는 좋은 풀이였다는 생각이 든다.
