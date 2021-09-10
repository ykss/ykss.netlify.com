---
title: '[Github] Git Branch Strategy 알아보기(GitFlow,GithubFlow)'
date: 2021-09-09 01:00:00
category: 'github'
draft: false
---

이번에 동아리 협업에 앞서 사전 준비를 위해 여러가지 이야기를 나누던 중에 정말 내가 모르는 많은 서비스와 개념들이 있다는 것을 깨닫게 되었다. 그 중에 Git flow와 Github flow에 대해서 무슨 이야기를 하는지 몰랐었는데, 협업 시에 **커밋을 위한 방법론**, **Branch 전략**에 대한 이야기였다. 실질적으로 알아보고 나니 내가 실제 적용했던 방법이었지만, 그 용어에 대해서는 잘 모르고 있었기에 이번 기회에 정리해보려고 한다.

## 1. Git flow

Git flow은 Git 확장 모듈로 *Vincent Driessen*이라는 사람이 브랜치 모델로써 구현한 것이다. Git flow에서 핵심 브런치는 다섯가지이다. `feature > develop > release > hotfix > master` 브런치로 구성되는데 머지 순서는 앞에서 뒤 방향으로 진행된다. 물론 `release`나 `hoxfix` 브런치의 경우 `develop` 브런치로도 머지되기도 한다. 아래의 사진이 git flow를 잘 나타낸 이미지라고 할 수 있다.

![git flow](https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F99AC74385C03797428)

### 1.1 Git flow의 구조와 흐름

핵심이 되는 브런치는 `master`와 `develop` 브런치라고 할 수 있다. 이 두개 브런치는 항상 필수적으로 존재해야 한다. 그리고 `feature`, `release`, `hotfix` 브랜치의 경우 머지가 완료된 이후에는 삭제하도록 한다.

#### 1. feature 브런치

- 브런치나 뻗어 나가는 곳 : `develop`

- 브런치가 들어가는 곳 : `develop`

- 네이밍 룰 : `master`, `develop`, `release-*`, `hoxfix-*` 외 모두 가능

해당 브런치는 기능을 개발하고 추가할 때 사용하는 브런치로 `develop` 브런치를 기준으로 만들어지고 다시 `develop` 브런치에 합쳐진다. `feature` 브런치의 경우, `origin`에 반영하지 않고, 개발자 repo에만 존재시킨다. 그리고 머지를 진행할 때, `--no-ff` 옵션을 사용해서 브런치에서 머지가 되었음을 git 기록에 남긴다.

> `--no-ff` 옵션의 경우, ff(fast-forward) 관계이더라도 반드시 병합 커밋을 만들고 나서 머지한다. ff는 병합하는 두 브랜치의 커밋 히스토리가 한 브랜치에 전부 포함되면 중간 병합 커밋을 만들지 않고 브랜치 태깅만 변경한다.

#### 2. release 브런치

- 브런치나 뻗어 나가는 곳 : `develop`

- 브런치가 들어가는 곳 : `develop`, `master`

- 네이밍 룰 : `release-*`

이 브런치는 새로운 Production Release를 위한 브런치로, 배포할 기능들에 대한 개발이 `develop`에서 완료되면 해당 브런치에서 `release` 브런치를 따서 나오는 것이다. `release` 브런치에서는 혹시 버그가 있다면, 버그 픽스에 대한 부분만 커밋하고, 버그 문제가 수정되었다고 판단되면, `master`로 머지를 진행한다. (`--no-ff` 옵션 사용) 그리고 `master`로 머지한 이후에는 `tag` 명령어를 통해 릴리즈 버전을 명시하고, `-s`나 `-u <key>`를 통해서 머지한 유저의 정보를 남긴다. 그리고 나서 마지막으로 `develop` 브런치로 다시 머지하여 `release` 브랜치에서 수정했던 내용들이 `develop`에도 반영되도록 한다.

#### 3. hoxfix 브런치

- 브런치나 뻗어 나가는 곳 : `master`

- 브런치가 들어가는 곳 : `develop`, `master`

- 네이밍 룰 : `hoxfix-*`

Production(`master`)에서 발생한 버그들을 `hoxfix`로 가져온다. 그리고나서 수정 후에는 `develop`과 `master` 모두에 반영해주고, `master`에는 `tag`를 추가해주어야 한다. 만약 `release` 브랜치도 있다면 해당 브랜치에도 반영하여 릴리즈 시 반영될 수 있도록 해야한다.

### 1.2 Git flow의 장,단점

#### 장점

- 명령어가 나와있다. (설치해서 CLI나 GUI로도 사용 가능)

- 주로 쓰는 IDE에 플러그인 형태로 존재한다.

#### 단점

- 브런치가 과도하게 많게 느껴질 수 있다.

- 안쓰는 브런치가 있을 수 있고, 몇몇 브런치는 애매하게 나누기 힘든 경우가 있다.

---

## 2. Github flow

Github flow는 *Scott chacon*이라는 사람이 git flow가 너무 복잡해서 만든 전략이다. 그리고 자동화가 들어가있는 개념이다. 하지만 자동화가 필수적인 것은 아니다. 흐름도 매우 단순하여 `master`에 대한 `role`만 명확하게 하면 되고, 주로 병합 시에 `PR(pull request)`가 사용된다.

![github flow](https://user-images.githubusercontent.com/6351798/48032310-63842400-e114-11e8-8db0-06dc0504dcb5.png)

### 2.1 Github flow의 구조와 흐름

구조가 딱히 없다. 핵심적인 것은 `master` 브런치가 배포 브런치이고 Production 브런치인 것이다. `release` 브런치가 명확하지 않은 시스템에 적합하고 `hotfix`도 또한 기능 수정이나 다르지 않다고 본다.

### 2.2 Github flow 작업 방법

#### 1. `master` 브런치는 언제든 배포 가능하다.

마스터 브랜치는 항상 최신 상태이고, stable 상태로 product에 배포되는 브런치이다. 그렇기 때문에 `master` 브런치는 엄격한 `role`이 있어야 한다.

#### 2. `master` 브런치에서 브런치를 딸 때는 브런치 이름이 중요하다.

새로운 기능이나 버그를 수정할 경우, 브런치의 이름만 보고도 어떤 일을 하고 있는지 알 수 있도록 브런치 네이밍을 한다. Github만 보아도 어떤 일을 하고있는지 알 수 있어야 좋다.

#### 3. 원격지 브런치로 수시로 push 한다.

개발자 repo에서 다 완성하지 않았더라도, 원격지의 작업 중인 브런치로 수시로 push하여, 자신이 진행하고 있는 것을 다른 사람도 확인할 수 있도록 해야한다. 수시로 push 하면 지금 pc가 손상되더라도 remote에서 끌어다 쓸 수 있다.

#### 4. 피드백이나 도움 필요 시, 그리고 머지할 준비가 되었을 땐, `pull request`를 생성한다.

`PR`을 통해 코드 리뷰를 할 수도 있고, 코드 리뷰를 통해 다른 협업 개발자에게 진행 상황을 공유하고, 도움을 받을 수도 있고 코드 리뷰를 받도록한다. 그리고 머지하기전엔 PR을 통해 다른 개발자들의 `approve`를 얻는 것이 좋다.

#### 5. 기능에 대한 리뷰가 끝나면 `master`로 머지한다.

`master`로 머지되는 순간 Production에 반영되는 것이기 때문에 충분한 검토와 리뷰가 마쳐진 이후에 승인하고 머지를 진행하도록 한다.

#### 6. `master`로 머지되고 푸시했을 때는 즉시 배포하도록 한다.

Github flow의 핵심 중 하나인데, `master`에 병합되면 즉시 자동 배포가 되도록 설정해놓아야 한다. 여기에는 많은 툴들이 존재한다.

### 2.3 Github flow의 장,단점

#### 장점

- 단순하며, 쉽게 익숙해 질 수 있다.

- Github을 제대로 이용할 수 있다.

- 자연스럽게 코드리뷰를 유도할 수 있다.

- CI가 필수적이고, 자동 배포가 가능하다.

#### 단점

- CI와 배포 자동화가 안되어있으면 사람이 직접 수행해야 한다.

- 너무 많은 PR들이 올라오면 자칫 복잡해질 수 있다.

---

## 3. Gitlab flow

Github flow가 또 너무 간단하다고 해서 배포, 환경 구성, 릴리즈, 통합에 좀 더 보완하기 위해 등장한 것이다. github flow와 크게 다르지는 않기 때문에 간단하게만 살펴보자.

![gitlab flow](https://about.gitlab.com/images/git_flow/environment_branches.png)

### 3.1 Gitlab flow의 구조와 흐름

`production` 브런치가 존재하여 커밋한 내용들을 배포하는 형태이다. 이것도 비교적 간단한 구조이고 git flow와 github flow의 절충안이라고 할 수 있다. `production` 뿐만 아니라 `pre-production` 브런치를 두고 스테이징으로 활용하기도 한다. `release`한 브런치에서 보안상 문제가 발생하거나 백 포트를 위해서는 `cherry-pick`을 이용한 작업 진행이 가능하다.

> `cherry-pick`의 경우는 git의 명령어 중 하나로 git log에서 특정한 커밋 하나만 콕 찝어서 현재 HEAD가 가리키는 브랜치에 추가하는 것이다. 즉, 다른 브런치에 있는 커밋을 지금 내 브랜치에 가져와서 커밋해주는 방법이다.

Gitlab flow에서는 모든 기능과 변경 사항은 `feature`브랜치를 따서 수정 후 마스터 브랜치로 향하고, 마스터에서 많은 테스트가 진행(`pre-production`브랜치가 없는 경우)되고 나서 `production` 브런치로 머지를 하고 `tag`를 붙히는 방식이다. Gitlab flow는 Git flow의 릴리즈, 태깅, 머지 측면의 비효율을 제거하기 위해 고안되었다.

---

## 결론

이렇게 여러가지 브런치 전략이 있는지 몰랐고, 심지어 이런 것들이 일반적으로 다 알고있는 내용인지는 더 더욱 몰랐다. 어떤 방법이 답이다!는 당연히 없고, 조직과 시스템의 특성에 맞추어 사용하는 것이 답이다. 이런것들을 정리하다 보니 역시 제대로 협업하는 조직에서 일하는게 이래서 중요한 것 같다는 생각이 들었고, 나도 그런 조직에서 일하고 싶다는 생각이 들었다ㅜㅜ. 이렇게 네트워킹을 통해서 얘기하다 보면 실무를 위해 어떤 것을 배워야하고 내가 어떤 것을 잘 모르는지 파악할 수 있어서 좋았다. 앞으로도 꾸준히 모르는 것들을 정리해야겠다.

---

출처 :

1. [Git flow, GitHub flow, GitLab flow](https://ujuc.github.io/2015/12/16/git-flow-github-flow-gitlab-flow/)
