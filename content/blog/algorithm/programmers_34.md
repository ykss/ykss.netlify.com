---
title: '[프로그래머스] 체육복'
date: 2021-01-08 01:00:00
category: 'Algorithm'
draft: false
---

### 문제 설명

점심시간에 도둑이 들어, 일부 학생이 체육복을 도난당했습니다. 다행히 여벌 체육복이 있는 학생이 이들에게 체육복을 빌려주려 합니다. 학생들의 번호는 체격 순으로 매겨져 있어, 바로 앞번호의 학생이나 바로 뒷번호의 학생에게만 체육복을 빌려줄 수 있습니다. 예를 들어, 4번 학생은 3번 학생이나 5번 학생에게만 체육복을 빌려줄 수 있습니다. 체육복이 없으면 수업을 들을 수 없기 때문에 체육복을 적절히 빌려 최대한 많은 학생이 체육수업을 들어야 합니다.

전체 학생의 수 n, 체육복을 도난당한 학생들의 번호가 담긴 배열 lost, 여벌의 체육복을 가져온 학생들의 번호가 담긴 배열 reserve가 매개변수로 주어질 때, 체육수업을 들을 수 있는 학생의 최댓값을 return 하도록 solution 함수를 작성해주세요.

### 제한사항

전체 학생의 수는 2명 이상 30명 이하입니다.
체육복을 도난당한 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
여벌의 체육복을 가져온 학생의 수는 1명 이상 n명 이하이고 중복되는 번호는 없습니다.
여벌 체육복이 있는 학생만 다른 학생에게 체육복을 빌려줄 수 있습니다.
여벌 체육복을 가져온 학생이 체육복을 도난당했을 수 있습니다. 이때 이 학생은 체육복을 하나만 도난당했다고 가정하며, 남은 체육복이 하나이기에 다른 학생에게는 체육복을 빌려줄 수 없습니다.

### 입출력 예

| n   | lost   | reserve   | return |
| --- | ------ | --------- | ------ |
| 5   | [2, 4] | [1, 3, 5] | 5      |
| 5   | [2, 4] | [3]       | 4      |
| 3   | [3]    | [1]       | 2      |

---

### 내 코드

```python
def solution(answers):
    def solution(n, lost, reserve):
    answer = 0
    student = []

    for i in range(n) :
        student.append(1)

    for index in reserve :
        student[index-1]+=1

    for index in lost :
        student[index-1]-=1

    for index in range(len(student)-1) :
        if student[index] == 2 and student[index+1] == 0 :
            student[index] -= 1
            student[index+1] += 1
        elif student[index] == 0 and student[index+1] == 2:
            student[index] += 1
            student[index+1] -= 1

    for index in student :
        if index > 0 :
            answer += 1

    return answer
```

문제 그대로 로직을 생각하면서 `for`문을 여러번 쓰는 하드코딩으로 작성하게 되었다. 먼저 `student`라는 리스트를 만들어 주어진 학생 수 만큼 초기화하고, 그리고나서 여벌 옷을 가지고 있는 학생들을 인덱스를 이용하여 `student` 배열안에 넣어 `+1`을 해주었다. 그리고 같은 방식으로 도난당한 학생들의 인덱스 원소에 `-1`을 하여 주어진 상황에 따라 `student`배열을 완성했다. 그 다음 부터 여벌옷을 빌려주는 로직을 하였는데, 이것도 효율적으로 짜기 보다는 인덱스로 비교해서 앞 인덱스가 여벌옷이 있고 바로 뒤 인덱스가 도난당했으면 빌려주고, 반대로 앞에 인덱스가 도난당했는데, 뒤에 인덱스가 여벌옷이 있으면 빌려오게끔 작성하고 마지막에는 배열에서 인덱스 원소 중 한벌이상 가지고 있는 인덱스의 수를 카운트하여 리턴했다.

---

### 다른 사람의 코드

```python
def solution(n, lost, reserve):
    _reserve = [r for r in reserve if r not in lost]
    _lost = [l for l in lost if l not in reserve]
    for r in _reserve:
        f = r - 1
        b = r + 1
        if f in _lost:
            _lost.remove(f)
        elif b in _lost:
            _lost.remove(b)
    return n - len(_lost)
```

`for`문을 단 한번만 쓰기도했고, 훨씬 깔끔하게 풀이했다. 처음 `_reserve`와 `_lost`배열을 만들면서 중복을 제거했고, 여벌옷을 가진 학생들의 배열 원소를 하나씩 뽑아서 왼쪽이나 오른쪽으로 인덱스를 이동했을 때, 옷을 0개 가진 배열에 해당 인덱스가 존재하면 빌려주는 식으로 했다. 그리고 이 과정을 거치면 결국 `_lost`에는 앞 뒤로 옷을 빌리지 못한 학생만 배열에 남게 되고 학생 수에서 그 길이를 빼서 답을 구했다. 깔끔한 로직으로 푼 것을 보고 이렇게 풀 수 있도록 문제를 보고 더 로직을 고민해봐야겠다는 생각이 들었다.
