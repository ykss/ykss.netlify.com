---
title: '[프로그래머스] 두 개 뽑아서 더하기'
date: 2020-12-10 23:00:00
category: 'Algorithm'
draft: false
---

* 문제 설명
정수 배열 numbers가 주어집니다. numbers에서 서로 다른 인덱스에 있는 두 개의 수를 뽑아 더해서 만들 수 있는 모든 수를 배열에 오름차순으로 담아 return 하도록 solution 함수를 완성해주세요.


* 제한사항
numbers의 길이는 2 이상 100 이하입니다.
numbers의 모든 수는 0 이상 100 이하입니다.


* 입출력 예
```
numbers	result
[2,1,3,4,1]	[2,3,4,5,6,7]
[5,0,2,7]	[2,5,7,9,12]
```


* 내 코드
```python
def solution(numbers):
    answer = []
    for i in range(len(numbers)):
        for j in range(i+1,len(numbers)):
            if numbers[i]+numbers[j] not in answer:
                answer.append(numbers[i]+numbers[j])
    answer.sort()
    return answer
```

