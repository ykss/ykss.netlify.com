---
title: '[LeetCode] Number of Islands - DFS - 파이썬'
date: 2021-04-05 01:00:00
category: 'Algorithm'
draft: false
---

### Description

Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Example 1:

Input: grid = [
["1","1","1","1","0"],
["1","1","0","1","0"],
["1","1","0","0","0"],
["0","0","0","0","0"]
]
Output: 1

### Example 2:

Input: grid = [
["1","1","0","0","0"],
["1","1","0","0","0"],
["0","0","1","0","0"],
["0","0","0","1","1"]
]
Output: 3

### Constraints:

m == grid.length
n == grid[i].length
1 <= m, n <= 300
grid[i][j] is '0' or '1'.

---

### 내 코드

```python
class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        def dfs(i,j)  :
            if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] == "0" :
                return
            grid[i][j] = "0"
            dfs(i+1,j)
            dfs(i-1,j)
            dfs(i,j+1)
            dfs(i,j-1)

        count = 0
        for i in range(len(grid)) :
            for j in range(len(grid[0])) :
                if grid[i][j] == "1" :
                    dfs(i,j)
                    count += 1
        return count
```

DFS를 통해서 만약 1인 부분이 있으면, dfs를 돌려서 상하좌우를 체크해보는 방법으로 하였다. 그렇게 카운트를 올려서 섬의 개수를 구했다.
