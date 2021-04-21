---
title: '[프로그래머스] 수식 최대화 - 파이썬'
date: 2021-04-22 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

[본 문제는 정확성과 효율성 테스트 각각 점수가 있는 문제입니다.]

개발자 출신으로 세계 최고의 갑부가 된 어피치는 스트레스를 받을 때면 이를 풀기 위해 오프라인 매장에 쇼핑을 하러 가곤 합니다.
어피치는 쇼핑을 할 때면 매장 진열대의 특정 범위의 물건들을 모두 싹쓸이 구매하는 습관이 있습니다.
어느 날 스트레스를 풀기 위해 보석 매장에 쇼핑을 하러 간 어피치는 이전처럼 진열대의 특정 범위의 보석을 모두 구매하되 특별히 아래 목적을 달성하고 싶었습니다.
진열된 모든 종류의 보석을 적어도 1개 이상 포함하는 가장 짧은 구간을 찾아서 구매

예를 들어 아래 진열대는 4종류의 보석(RUBY, DIA, EMERALD, SAPPHIRE) 8개가 진열된 예시입니다.

진열대 번호 1 2 3 4 5 6 7 8
보석 이름 DIA RUBY RUBY DIA DIA EMERALD SAPPHIRE DIA
진열대의 3번부터 7번까지 5개의 보석을 구매하면 모든 종류의 보석을 적어도 하나 이상씩 포함하게 됩니다.

진열대의 3, 4, 6, 7번의 보석만 구매하는 것은 중간에 특정 구간(5번)이 빠지게 되므로 어피치의 쇼핑 습관에 맞지 않습니다.

진열대 번호 순서대로 보석들의 이름이 저장된 배열 gems가 매개변수로 주어집니다. 이때 모든 보석을 하나 이상 포함하는 가장 짧은 구간을 찾아서 return 하도록 solution 함수를 완성해주세요.
가장 짧은 구간의 시작 진열대 번호와 끝 진열대 번호를 차례대로 배열에 담아서 return 하도록 하며, 만약 가장 짧은 구간이 여러 개라면 시작 진열대 번호가 가장 작은 구간을 return 합니다.

### [제한사항]

gems 배열의 크기는 1 이상 100,000 이하입니다.
gems 배열의 각 원소는 진열대에 나열된 보석을 나타냅니다.
gems 배열에는 1번 진열대부터 진열대 번호 순서대로 보석이름이 차례대로 저장되어 있습니다.
gems 배열의 각 원소는 길이가 1 이상 10 이하인 알파벳 대문자로만 구성된 문자열입니다.

### 입출력 예

| gems                                                                | result |
| ------------------------------------------------------------------- | ------ |
| ["DIA", "RUBY", "RUBY", "DIA", "DIA", "EMERALD", "SAPPHIRE", "DIA"] | [3, 7] |
| ["AA", "AB", "AC", "AA", "AC"]                                      | [1, 3] |
| ["XYZ", "XYZ", "XYZ"]                                               | [1, 1] |
| ["ZZZ", "YYY", "NNNN", "YYY", "BBB"]                                | [1, 5] |

---

### 내 코드 (시간초과)

```python
def solution(gems):
    duplicate = set(gems)
    count = len(duplicate)
    results = []

    for i in range(len(gems)):
        for j in range(count,len(gems)+1) :
            if set(gems[i:j]) == duplicate :
                results.append([i+1,j])
                break
    results.sort(key = lambda x : (x[1]-x[0]))
    return results.pop(0)
```

중복을 제거한 목록을 `duplicate`에 넣고, `gems`배열의 첫번째 인덱스부터 모든 보석이 등장하는 인덱스까지의 경우를 `results`배열에 넣고 구한 경우들 중에서 그 길이가 가장 짧은 것을 구하기 위해서 `sort()`에 lambda로 기준을 정하여 정렬하고, 가장 짧은 길이의 것을 리턴하였다. 정답은 나왔지만 테스트 케이스 15개 중에 2개가 시간초과로 실패했다. 아무래도 이중 for문 때문에 효율성이 좀 떨어지는 부분이 있는 것 같다. 그리고 효율성 테스트도 모두 실패한 결과가 나왔다.

### 다른 답안을 참고한 풀이

```python
def solution(gems):
    gems_dict = {gems[0]:1}
    gems_count = len(gems)
    type_count = len(set(gems))
    start, end = 0, 0
    result = (0,100001)

    while start < gems_count and end < gems_count :
        if len(gems_dict) < type_count :
            if end == len(gems) - 1:
                break
            end += 1
            if gems_dict.get(gems[end]) is None:
                gems_dict[gems[end]] = 1
            else:
                gems_dict[gems[end]] += 1
        else :
            if end - start < result[1] - result[0]:
                result = (start+1, end+1)
            if gems_dict[gems[start]] == 1:
                del gems_dict[gems[start]]
            else:
                gems_dict[gems[start]] -= 1
            start += 1

    return result
```

이 풀이의 핵심은 딕셔너리의 활용과 `start`와 `end`의 활용이다. 먼저 처음 인덱스꺼를 딕셔너리에 추가하고, 시작과 끝 지점을 0으로 해서 시작한다. `while` 반복문을 시작과 끝이 모두 주어진 배열의 길이보다 작을 때까지는 계속 반복하도록 돌리고, 만약에 딕셔너리의 길이가 보석 종류의 수보다 작으면 끝 포인터를 늘려서 끝 포인터가 딕셔너리에 없으면 추가하고, 있으면 +1 하도록 했다. 만약 딕셔너리의 길이가 종류의 수와 같으면 끝에서 시작지점을 뺀 것이 `result`에서 계산한 거리보다 가까우면 `result`를 갱신하도록 했다. 그리고 만약에 딕셔너리의 시작점이 이미 추가되어있으면 딕셔너리에서 지우고, 아니면 -1을 하도록 했다. 이런식으로 `start` 값을 늘려가면서 `result`를 갱신하여 답을 구한다. 이 방식으로하면 효율성테스트도 모두 통과 할 수 있다.
