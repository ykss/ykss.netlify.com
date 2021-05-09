---
title: '[LeetCode] Swap Nodes in Pairs - 파이썬'
date: 2021-05-09 01:00:00
category: 'Algorithm'
draft: true
---

### Description

Given a linked list, swap every two adjacent nodes and return its head. You must solve the problem without modifying the values in the list's nodes (i.e., only nodes themselves may be changed.)

### Example 1:

Input: head = [1,2,3,4]
Output: [2,1,4,3]

### Example 2:

Input: head = []
Output: []

### Example 3:

Input: head = [1]
Output: [1]

### Constraints:

The number of nodes in the list is in the range [0, 100].
0 <= Node.val <= 100

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
