# 블록체인을 활용한 암표 거래 및 프리미엄 방지 티켓팅 시스템 개발 프로젝트



## 설치
 - [Git](https://git-scm.com/)
 - [Hyperledger Composer](https://hyperledger.github.io/composer/latest/installing/installing-index)
 - [MySQL & Workbench](https://donghwa-kim.github.io/mysql.html)

```sh
git config --global core.longpaths true
git clone http://khuhub.khu.ac.kr/2019-1-capstone-design1/HCS_block_chain_ticket_protection.git
```

소스코드 폴더 내에서 입력

```sh
npm install

cd ticketing-system
npm install

cd ..
chmod 700 ./start.sh
chmod 700 ./stop.sh
./start.sh

npm install -g nodemon
```

## 테스트

config/config.json, app.js 에서 DB정보 로컬에 맞게 수정

```sh
nodemon start
```


웹 브라우저
 - http://localhost:3100
 - http://localhost:3100/administrators/login

## 데모 영상
 - https://youtu.be/aVrIAOGRwTs