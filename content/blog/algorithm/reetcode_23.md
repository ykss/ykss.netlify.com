---
title: '[LeetCode] Odd Even Linked List - 파이썬'
date: 2021-05-12 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given the head of a singly linked list, group all the nodes with odd indices together followed by the nodes with even indices, and return the reordered list.

The first node is considered odd, and the second node is even, and so on.

Note that the relative order inside both the even and odd groups should remain as it was in the input.

### Example 1:

![그림1](https://assets.leetcode.com/uploads/2021/03/10/oddeven-linked-list.jpg)

Input: head = [1,2,3,4,5]
Output: [1,3,5,2,4]

### Example 2:

![그림2](https://assets.leetcode.com/uploads/2021/03/10/oddeven2-linked-list.jpg)
Input: head = [2,1,3,5,6,4,7]
Output: [2,3,6,7,1,5,4]

### Constraints:

The number of nodes in the linked list is in the range [0, 104].
-106 <= Node.val <= 106

### Follow up:

Could you solve it in O(1) space complexity and O(nodes) time complexity?

---

### 내 코드

```python
# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def oddEvenList(self, head: ListNode) -> ListNode:
        # 리스트로 바꿔서 리스트 인덱스 짝수인거를 뺴서 뒤로 넣기
        node = head
        even = []
        odd = []
        lists = []
        answers = []

        while node is not None :
            lists.append(node.val)
            node = node.next

        for i, x in enumerate(lists) :
            if i % 2 == 1 :
                even.append(x)
            else :
                odd.append(x)
        answers = odd + even

        prev = None
        while answers :
            node = ListNode(answers.pop())
            node.next = prev
            prev = node

        return node
```

처음에는 값을 기준으로 정렬하는 줄 알았는데, 자세히 읽어보니 홀수번째 인덱스를 먼저 출력하고, 짝수번째 인덱스를 출력하는 문제였다. 처음에는 배열리스트 상태로 풀어보려고 했는데 역시 파이썬 리스트가 익숙해서 리스트로 전환하고 리스트에서 `enumerate()`를 활용해서 짝수 인덱스와 홀수 인덱스를 구분하여 각각의 배열에 담은 후에 그걸 다시합쳤다. 그리고나서 합친 배열을 다시 배열리스트로 만들어서 반환하였다.

### 다른 풀이

```python
class Solution:
    def oddEvenList(self, head: ListNode) -> ListNode:
        if head is None :
            return None

        odd = head
        even = head.next
        even_head = head.next

        while even and even.next :
            odd.next, even.next = odd.next.next, even.next.next
            odd, even = odd.next, even.next

        odd.next = even_head
        return head
```

내가 풀이한 풀이는 이 문제의 원래 의도와는 다르게 풀이한 것이다. 위처럼 풀면 연결리스트만을 가지고 풀 수 있다. 홀수와 짝수를 나누어서 2칸씩 증가시키면서 처리한 후에 마지막에 홀수뒤에 짝수 연결리스트를 붙여서 해결했다.
