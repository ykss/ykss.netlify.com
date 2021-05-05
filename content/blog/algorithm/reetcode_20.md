---
title: '[LeetCode] Reverse Linked List - 파이썬'
date: 2021-05-05 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given the head of a singly linked list, reverse the list, and return the reversed list.

### Example 1:

![그림1](https://assets.leetcode.com/uploads/2021/02/19/rev1ex1.jpg)
Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]

### Example 2:

![그림2](https://assets.leetcode.com/uploads/2021/02/19/rev1ex2.jpg)
Input: head = [1,2]
Output: [2,1]
Example 3:

Input: head = []
Output: []

### Constraints:

The number of nodes in the list is the range [0, 5000].
-5000 <= Node.val <= 5000

Follow up: A linked list can be reversed either iteratively or recursively. Could you implement both?

---

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        node, prev = head, None

        while node :
            next, node.next = node.next, prev
            prev, node = node, next

        return prev
```

순서를 반대로 바꾸는 문제인데, 이 문제 또한 스왑을 활용해서 풀었다. 다음 노드와 현재 노드, 이전 노드를 바꾸어 가면서 배열리스트를 뒤집고 마지막에 뒤집어진 `prev`를 리턴하였다.
