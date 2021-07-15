---
title: '[프로그래머스] 숫자 문자열과 영단어 - 파이썬'
date: 2021-07-16 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

네오와 프로도가 숫자놀이를 하고 있습니다. 네오가 프로도에게 숫자를 건넬 때 일부 자릿수를 영단어로 바꾼 카드를 건네주면 프로도는 원래 숫자를 찾는 게임입니다.

다음은 숫자의 일부 자릿수를 영단어로 바꾸는 예시입니다.

1478 → "one4seveneight"
234567 → "23four5six7"
10203 → "1zerotwozero3"
이렇게 숫자의 일부 자릿수가 영단어로 바뀌어졌거나, 혹은 바뀌지 않고 그대로인 문자열 s가 매개변수로 주어집니다. s가 의미하는 원래 숫자를 return 하도록 solution 함수를 완성해주세요.

참고로 각 숫자에 대응되는 영단어는 다음 표와 같습니다.

| 숫자 | 영단어 |
| ---- | ------ |
| 0    | zero   |
| 1    | one    |
| 2    | two    |
| 3    | three  |
| 4    | four   |
| 5    | five   |
| 6    | six    |
| 7    | seven  |
| 8    | eight  |
| 9    | nine   |

### 제한사항

- 1 ≤ s의 길이 ≤ 50
- s가 "zero" 또는 "0"으로 시작하는 경우는 주어지지 않습니다.
- return 값이 1 이상 2,000,000,000 이하의 정수가 되는 올바른 입력만 s로 주어집니다.

### 입출력 예

| s                  | result |
| ------------------ | ------ |
| "one4seveneight"   | 1478   |
| "23four5six7"      | 234567 |
| "2three45sixseven" | 234567 |
| "123"              | 123    |

---

### 내 코드

```python
def solution(s):
    num_dict = {
        'zero':0,
        'one':1,
        'two':2,
        'three':3,
        'four':4,
        'five':5,
        'six':6,
        'seven':7,
        'eight':8,
        'nine':9
    }
    answer = ''
    temp = ''
    for x in s :
        if x.isdigit() :
            answer += x
        else :
            temp += x
            if temp in num_dict :
                answer += str(num_dict[temp])
                temp = ''
    return int(answer)
```

먼저 각 단어에 대응하는 값을 딕셔너리로 만들어 놓고, 주어진 문자열을 한 글자씩 체크했다. 그래서 해당 문자가 숫자이면 정답 문자열에 그대로 붙이고, 만약 숫자가 아닐경우, 즉 문자일 경우에는 `temp`라는 변수에다가 붙여서, 해당 `temp`라는 변수가 딕셔너리의 키 값으로 존재하면 해당 키에 대응되는 값을 정답 문자열에 붙이고, 다시 `temp`를 초기화 시켜주는 식으로 했다. 이렇게하고 마지막에 완성된 문자열인 `answer`를 `int()`를 통해 형 변환 시켜주어 답을 구할 수 있었다.

### 다른사람의 코드

```python
num_dic = {"zero":"0", "one":"1", "two":"2", "three":"3", "four":"4", "five":"5", "six":"6", "seven":"7", "eight":"8", "nine":"9"}

def solution(s):
    answer = s
    for key, value in num_dic.items():
        answer = answer.replace(key, value)
    return int(answer)
```

나와 비슷하게 딕셔너리에 값을 저장했지만, 푼 로직이 달랐다. 주어진 문자열에 해당 key값이 존재할 경우 value값으로 치환해주는 `replace()`함수를 반복적으로 사용해서 답을 구했는데, 훨씬 간단한 방법이었다.
