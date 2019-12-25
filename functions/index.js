const functions = require('firebase-functions');
const express = require('express');
// const path = require('path');
const app = express();

app.get('/users', (req, res) => {
  // 本来はここでFireStoreとかからデータ取ってくるよ
  const users = [
    { "id": 1, "name": "イリヤ" },
    { "id": 2, "name": "美遊" },
    { "id": 3, "name": "クロエ" },
    { "id": 4, "name": "オルタ" },
    { "id": 5, "name": "マシュ" }
  ];

  // データを返却
  res.send(JSON.stringify(users));
});

/*
.
├── firebase.json
├── functions
│   ├── index.js
│   ├── node_modules
│   ├── package-lock.json
│   └── package.json
└── public
    ├── 404.html
    └── index.html
*/
