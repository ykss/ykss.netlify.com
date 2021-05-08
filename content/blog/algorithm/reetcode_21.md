---
title: '[LeetCode] Add Two Numbers - 파이썬'
date: 2021-05-08 01:00:00
category: 'Algorithm'
draft: false
---

### Description

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

### Example 1:

![그림1](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.

### Example 2:

Input: l1 = [0], l2 = [0]
Output: [0]

### Example 3:

Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]

### Constraints:

The number of nodes in each linked list is in the range [1, 100].
0 <= Node.val <= 9
It is guaranteed that the list represents a number that does not have leading zeros.

---

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        list_1 = []
        list_2 = []
        sum = 0
        answers = []

        while l1 is not None :
            list_1.append(l1.val)
            l1 = l1.next
        while l2 is not None :
            list_2.append(l2.val)
            l2 = l2.next

        list_1 = list(reversed(list_1))
        list_2 = list(reversed(list_2))
        list_1 = list(map(str,list_1))
        list_2 = list(map(str,list_2))
        list_1 = ''.join(list_1)
        list_2 = ''.join(list_2)
        sum_list = int(list_1) + int(list_2)
        prev: ListNode = None
        for i in str(sum_list) :
            node = ListNode(int(i))
            node.next = prev
            prev = node

        return node
```

이 문제는 노드에 담겨있는 것을 먼저 파이썬 리스트로 변환한 다음에 변환한 리스트 두 개를 뒤집고 문자열로 변환하였다가 다시 연결리스트로 만들어서 연결 리스트로 반환하는 방식으로 하였다. 다른 부분보다 파이썬 리스트를 다시 연결 리스트로 바꾸는 방법이 생소했는데, 이번 기회에 기억해두자.
