---
title: '[LeetCode] Letter Combinations of a Phone Number - DFS - 파이썬'
date: 2021-04-06 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.

![pic1](https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Telephone-keypad2.svg/200px-Telephone-keypad2.svg.png)

### Example 1:

Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

### Example 2:

Input: digits = ""
Output: []

### Example 3:

Input: digits = "2"
Output: ["a","b","c"]

### onstraints:

0 <= digits.length <= 4
digits[i] is a digit in the range ['2', '9'].

---

### 내 코드

```python
class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        def dfs(i,str) :
            if len(str) == len(digits):
                result.append(str)
                return

            for i in range(i,len(digits)) :
                for j in dic[digits[i]] :
                    dfs(i+1,str+j)

        dic = {"2":"abc","3":"def","4":"ghi","5":"jkl","6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}

        if not digits :
            return []

        result = []
        dfs(0,"")

        return result
```

빈 문자열일 경우, 빈 배열을 리턴하도록 하고 dfs를 구현하여 시작했다. 만약에 조합의 길이가 주어진 숫자의 길이와 같으면 결과 배열에 넣도록 했고, 그렇지 않으면 딕셔너리에서 단어들을 하나씩 꺼내서 다시 dfs를 호출하여 모든 조합의 수를 구했다. 딕셔너리 자료형이 유리하게 쓰일 수 있으므로 꼭 기억하자.
