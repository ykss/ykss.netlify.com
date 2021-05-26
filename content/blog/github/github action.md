---
title: 'Github Action(깃헙 액션) 써보기'
date: 2021-05-25 18:00:00
category: 'Git'
draft: false
---

![action main](https://jonnung.dev/images/github_action_cover.png)

최근 주변 친구들을 통해 github action이라는 것이 되게 유용하고 요즘 많이 활용된다는 이야기를 들었었다. 그래서 단순히 아~ 그렇구나 하고 넘어갔었지만, 인프런에서 관련 강의를 우연히 보게되면서 한번 써보고 맛보자(?)라는 마음으로 해보게되었다. 그리고 이 기회에 포스팅으로 정리해보려고 한다.

## Github Action이란?

![Action](https://ifh.cc/g/iI8u1L.jpg)

Github Action은 깃헙 저장소를 기반으로 일련의 work flow를 자동화 하도록 해주는 CI/CD 도구라고 할 수 있다. 이 workflow는 어떻게 구성하느냐에 따라 빌드, 테스트, 배포 등 다양한 과정에 활용될 수 있고, 이러한 워크플로우를 직접 구성하고 만들 수도 있으며, Github 마켓 플레이스에서 내 워크플로우를 공유하거나 다른 사람의 워크플로우를 가져올 수도 있다. 그리고 Github Action에서는 Runners를 제공하여 이러한 워크플로우를 리눅스, 윈도우 등 환경을 지정하여 실행할 수 있다. 기본적으로 제공되는 Github-hosted runner는 azure의 Standard_DS2_v2로 vCPU 2, 메모리 7GB, 임시 스토리지 14GB를 제공한다.

## Github Action의 과금정책과 사용 범위는?

CI/CD도구이든 어쨌든 실제로 활용을 하기 위해서는 과금정책 부분도 쉽게 지나칠 수 있는 부분은 아니다. Github Action의 경우, Git repo의 공개/비공개 여부에 따라서 공개일 경우에는 파격적으로 무료로 제공하고 있다. 그리고 private repo의 경우에는 한달에 500MB 스토리지와 2,000분 이상 실행될 경우에는 과금이 들어가고 있다.

한 저장소에 최대 20개의 Workflow를 등록할 수 있고, 워크플로우 내에 Job같은 경우 실행 단위마다 최대 6시간 실행가능하다. 만약에 6시간이 초과 될 경우에는 자동으로 종료된다.

## Workflow 구성

workflow를 등록하려면 깃 저장소의 `.github/workflows` 경로에 `.yml` 또는 `.yaml` 파일을 생성하면서 워크플로우를 만들 수 있다. 워크플로우에는 필수적으로 갖춰야하는 구성이 있기 때문에, 그 구성들에 대해서 알아보자.

- 워크플로우는 어떠한 이벤트가 발생했을 때 실행된다. (event, on)
- 최소 1개 이상의 동작을 해야한다. (jobs)
- jobs안에는 여러 step이 존재할 수 있다. (steps)
- steps에서는 단순한 커맨드 실행 뿐만 아니라, action을 가져와 실행할 수 있다.
- action은 github 마켓플레이스의 액션을 이용하거나, 직접 만들어서 사용할 수도 있다.

아래는 이번에 github action을 사용해보면서

```yml
# 워크플로우 이름을 지정하는 부분이다.
name: crawlingPractice

# 어떠한 이벤트가 발생했을 때, 워크플로우를 실행시킬지 정한다.
# ex) push나 pull이 일어났을때, 또는 cron을 통해 일정주기마다 실행시킬지
on: [push]
#  schedule:
#    - cron: "*/10 * * * *"

# 워크플로우가 실행되면 수행될 동작을 정한다.
jobs:
  # 빌드 동작을 수행한다.
  build:
    # 빌드 동작이 수행될 환경을 지정한다.
    # ubuntu, mac os, windows 등의 github가 호스팅하는 머신환경을 이용할 수도 있고,
    # 사용자의 호스팅 환경이나, 도커 컨테이너등을 이용할 수도 있다.
    runs-on: ubuntu-latest
    # 실행할 여러 동작을 여기에 정의한다.
    steps:
      # 아래와 같이 actions에서 가져다 쓸 수 있다.
      - uses: actions/checkout@v2
        with:
          # 개인 토큰을 사용할 것인지 말 것인지
          persist-credentials: false
      - name: 1. pip 업그레이드
        run: python -m pip install --upgrade pip
      - name: 2. 필요한 패키지 인스톨
        run: pip install -r requirements.txt
      - name: 3. 크롤링 코드 실행
        run: |
          python crawler/mainDataCrawler.py
          python crawler/fetchDataCrawler.py
      - name: 4. 커밋
        run: |
          git config --local user.email "yukyeongsang@gmail.com"
          git config --local user.name "ykss"
          git add .
          git commit -m "Run crawler and update current data"
      - name: 5. 푸시
        uses: ad-m/github-push-action@master
        with:
          # branch: "master"
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

이렇게 위와 같이 워크플로우를 만들면 github action 탭에 워크플로우가 생성된 것을 확인할 수 있다.
![워크플로우 등록](https://ifh.cc/g/EZeHj6.jpg)

그리고 실제로 워크플로우가 실행된 기록을 체크할 수 있다.
![워크플로우 로그](https://ifh.cc/g/KU1gWe.jpg)

## 결론

이제 한번 github action을 사용해본 것이기 때문에 아직 제대로 안다고 볼 수는 없지만, 앞으로 github를 이용해서 프로젝트를 수행할 때, 특히 크롤링을 사용하거나 하는 경우나, 배포 자동화를 해야한다거나 하는 경우, 간단하게 workflow만 작성하면 되기 때문에 유용하게 쓰일 수 있을 것으로 생각된다.

---

> 참고

1. [Introduction to GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions)
2. [Github Action 빠르게 시작하기](https://jonnung.dev/devops/2020/01/31/github_action_getting_started/)
