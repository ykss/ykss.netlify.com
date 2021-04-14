---
title: '[프로그래머스] 문자열 압축 - 파이썬'
date: 2021-04-15 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

데이터 처리 전문가가 되고 싶은 "어피치"는 문자열을 압축하는 방법에 대해 공부를 하고 있습니다. 최근에 대량의 데이터 처리를 위한 간단한 비손실 압축 방법에 대해 공부를 하고 있는데, 문자열에서 같은 값이 연속해서 나타나는 것을 그 문자의 개수와 반복되는 값으로 표현하여 더 짧은 문자열로 줄여서 표현하는 알고리즘을 공부하고 있습니다.
간단한 예로 "aabbaccc"의 경우 "2a2ba3c"(문자가 반복되지 않아 한번만 나타난 경우 1은 생략함)와 같이 표현할 수 있는데, 이러한 방식은 반복되는 문자가 적은 경우 압축률이 낮다는 단점이 있습니다. 예를 들면, "abcabcdede"와 같은 문자열은 전혀 압축되지 않습니다. "어피치"는 이러한 단점을 해결하기 위해 문자열을 1개 이상의 단위로 잘라서 압축하여 더 짧은 문자열로 표현할 수 있는지 방법을 찾아보려고 합니다.

예를 들어, "ababcdcdababcdcd"의 경우 문자를 1개 단위로 자르면 전혀 압축되지 않지만, 2개 단위로 잘라서 압축한다면 "2ab2cd2ab2cd"로 표현할 수 있습니다. 다른 방법으로 8개 단위로 잘라서 압축한다면 "2ababcdcd"로 표현할 수 있으며, 이때가 가장 짧게 압축하여 표현할 수 있는 방법입니다.

다른 예로, "abcabcdede"와 같은 경우, 문자를 2개 단위로 잘라서 압축하면 "abcabc2de"가 되지만, 3개 단위로 자른다면 "2abcdede"가 되어 3개 단위가 가장 짧은 압축 방법이 됩니다. 이때 3개 단위로 자르고 마지막에 남는 문자열은 그대로 붙여주면 됩니다.

압축할 문자열 s가 매개변수로 주어질 때, 위에 설명한 방법으로 1개 이상 단위로 문자열을 잘라 압축하여 표현한 문자열 중 가장 짧은 것의 길이를 return 하도록 solution 함수를 완성해주세요.

### 제한사항

s의 길이는 1 이상 1,000 이하입니다.
s는 알파벳 소문자로만 이루어져 있습니다.

### 입출력 예

| s                          | result |
| -------------------------- | ------ |
| "aabbaccc"                 | 7      |
| "ababcdcdababcdcd"         | 9      |
| "abcabcdede"               | 8      |
| "abcabcabcabcdededededede" | 14     |
| "xababcdcdababcdcd"        | 17     |

---

### 내 코드

```python
def solution(s):
    answer = ""
    results = []
    if len(s) == 1:
        return 1

    for num in range(1,len(s)//2+1) :
        count = 1
        temp = s[:num]
        for i in range(num,len(s),num) :
            if s[i:i+num] == temp :
                count += 1
            else :
                if count == 1 :
                    count = ""
                answer += str(count) + temp
                temp = s[i:i+num]
                count = 1
        if count == 1 :
            count = ""
        answer += str(count) + temp
        results.append(len(answer))
        answer = ""
    return min(results)
```

1글자씩 끊어서부터 2분의 1까지 끊는 경우를 모두 문자열 압축을 진행해보고 가장 길이가 짧은 것을 구하는 방식으로 진행하였다. 모든 케이스의 압축을 진행하는 방식으로 하였고, 그 방법으로 `count` 변수를 써서 문자열에 붙이는 식으로 하였다.

### 다른 사람의 풀이

```python
def compress(text, tok_len):
    words = [text[i:i+tok_len] for i in range(0, len(text), tok_len)]
    res = []
    cur_word = words[0]
    cur_cnt = 1
    for a, b in zip(words, words[1:] + ['']):
        if a == b:
            cur_cnt += 1
        else:
            res.append([cur_word, cur_cnt])
            cur_word = b
            cur_cnt = 1
    return sum(len(word) + (len(str(cnt)) if cnt > 1 else 0) for word, cnt in res)

def solution(s):
    return min(compress(s, tok_len) for tok_len in list(range(1, int(len(s)/2) + 1)) + [len(s)])
```

`compress()`라는 압축 함수를 만들어서 했는데, `tok_len`을 파라미터로 넘겨주며 몇 글자씩 끊을지를 넘겨주고, 결국은 비슷한 로직으로 진행하였다. 하지만 훨씬 깔끔하고 이해될 수 있도록 로직을 구성했다는 생각이 들었다.
