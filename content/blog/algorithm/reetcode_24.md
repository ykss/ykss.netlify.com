---
title: '[LeetCode] Reverse Linked List II - 파이썬'
date: 2021-05-13 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right, and return the reversed list.

### Example 1:

![그림1](https://assets.leetcode.com/uploads/2021/02/19/rev2ex2.jpg)

Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]

### Example 2:

Input: head = [5], left = 1, right = 1
Output: [5]

### Constraints:

The number of nodes in the list is n.
1 <= n <= 500
-500 <= Node.val <= 500
1 <= left <= right <= n

### Follow up:

Could you do it in one pass?

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        node = head
        node_list = []

        while node is not None :
            node_list.append(node.val)
            node = node.next

        reverse_list = node_list[left-1:right]
        head = node_list[:left-1]
        tail = node_list[right:]
        reverse_list = list(reversed(reverse_list))
        answers = head + reverse_list + tail

        prev = None

        while answers :
            node = ListNode(answers.pop())
            node.next = prev
            prev = node

        return node
```

이번 문제도 동일하게 파이썬 리스트로 변환하여 풀었다. 리스트로 변환하게 되면 슬라이싱을 통해 특정 위치의 배열을 뒤집는 것은 간단하기 때문에 리스트를 통해 답을 구하고 다시 배열리스트로 변경하여 답을 구했다.

### 다른 풀이

```python
class Solution:
    def reverseBetween(self, head: ListNode, left: int, right: int) -> ListNode:
        if not head or left == right :
            return head

        root = start = ListNode(None)
        root.next = head

        for _ in range(left-1) :
            start = start.next
        end = start.next

        for _ in range(right - left):
            tmp, start.next, end.next = start.next, end.next, end.next.next
            start.next.next = tmp
        return root.next
```

리스트로 바꾸는 편법(?)을 사용하지 않으면 배열 리스트로도 풀 수 있다. 다중할당을 통해 간결하게 풀 수도 있다.
