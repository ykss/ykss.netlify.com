---
title: '[LeetCode] Valid Parentheses - 파이썬'
date: 2021-05-14 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:

Open brackets must be closed by the same type of brackets.
Open brackets must be closed in the correct order.

### Example 1:

Input: s = "()"
Output: true

### Example 2:

Input: s = "()[]{}"
Output: true

### Example 3:

Input: s = "(]"
Output: false

### Example 4:

Input: s = "([)]"
Output: false

### Example 5:

Input: s = "{[]}"
Output: true

### Constraints:

1 <= s.length <= 104
s consists of parentheses only '()[]{}'.

### 내 코드

```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        table = {
            ')' : '(',
            '}' : '{',
            ']' : '['
        }

        if len(s) < 2 :
            return False

        for x in s :
            if x not in table :
                stack.append(x)
            elif not stack or table[x] != stack.pop() :
                return False
        return len(stack) == 0
```

딕셔너리를 통해 테이블을 만들고 여는 괄호가 나오면 스택에 넣고, 닫는 괄호가 나올 때는 만약 여는 괄호가 없이 닫는 괄호가 나왔을 때 False를 리턴하고, 만약 지금 스택의 맨위에 있는 괄호의 테이블에 해당하는 것이 아니면 False를 리턴한다. 그리고 마지막에 stack이 비워져있으면 TRUE를 리턴하고, stack에 다른게 남아있으면 False이다. 이런 문제를 프로그래머스에서도 풀어봤던 것 같은데, stack의 활용 뿐만아니라 딕셔너리 활용이 중요한 것 같다.
