---
title: '[LeetCode] Trapping Rain Water - 파이썬'
date: 2021-04-28 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

### Example 1:

![사진](https://assets.leetcode.com/uploads/2018/10/22/rainwatertrap.png)

Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.

### Example 2:

Input: height = [4,2,0,3,2,5]
Output: 9

### Constraints:

n == height.length
0 <= n <= 3 \* 104
0 <= height[i] <= 105

---

### 내 코드

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        if not height :
            return 0
        size = 0
        left, right = 0, len(height)-1
        left_max, right_max = height[left], height[right]

        while left <= right :
            left_max = max(left_max, height[left])
            right_max = max(right_max, height[right])

            if left_max <= right_max :
                size += left_max - height[left]
                left += 1
            else :
                size += right_max - height[right]
                right -= 1
        return size
```

위 방식은 투 포인터 방식으로 풀이 한 것이다. 맨 왼쪽과 맨 오른쪽에서 각각 포인터로 시작하여, 왼쪽포인터의 최대 높이와 오른쪽 포인터의 최대 높이를 갱신해가면서 최대 높이에서 현재 높이를 뺀 만큼 크기로 더하는 방식으로 하면서 계속 포인터의 위치를 옮겨가는 방식이다. 이러한 로직은 투 포인터 문제들을 많이 풀어보면서 적응해나가야할 것 같다.

### 다른 풀이 코드(스택)

```python
class Solution:
    def trap(self, height: List[int]) -> int:
        stack = []
        volume = 0

        for i in range(len(height)) :
            while stack and height[i] > height[stack[-1]] :
                top = stack.pop()

                if not len(stack) :
                    break

                distance = i - stack[-1] - 1
                waters = min(height[i], height[stack[-1]]) - height[top]
                volume += distance * waters

            stack.append(i)
        return volume
```

위 풀이는 스택 방식을 통해 푼 건데, 스택에 쌓아나가면서 현재 높이가 이전 높이보다 높을때 그 차이만큼 채워가는 방식이다. 스택과 같은 방식은 이 문제를 봤을 때 쉽게 떠오르는 느낌은 아니었다. 투 포인터 방식과 비교했을 때, 투 포인터가 미세하게 빠른데, 거의 같다고 볼 수 있을 만한 차이이므로 더 이해가 잘 가는 방식으로 풀면 된다.
