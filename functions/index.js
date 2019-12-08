const functions = require('firebase-functions');
const url = require('url');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.list = functions.https.onRequest((request, response) => {
    response.sendFile(path.join(__dirname + '/views/list.html'));
});

exports.getRoomList = functions.https.onRequest((request, response) => {
    let rooms = getRoomListFromJson(__dirname + '/json/room.json');
    response.send(rooms);
});

exports.test = functions.https.onRequest((request, response) => {
    response.sendFile(path.join(__dirname + '/views/index.html'));
});

exports.createRoom = functions.https.onRequest((request, response) => {
    // get data
    var url_parse = url.parse(request.url,true);
    var roomName = url_parse.query["room-name"];
    var word01 = url_parse.query["keyword01"];
    var word02 = url_parse.query["keyword02"];
    var keyWords = new Array(word01, word02);

    var room = new Room(roomName, keyWords);
    room.create(__dirname + '/json/room.json');
    response.redirect('/wordwolf/us-central1/list');
});


class Room {

    constructor(name, keyWords) {
        this.name = name;
        this.keyWords = keyWords;
    }

    create(path) {
        if (this.isExistFile(path)) {
            this.updateJsonFile(path);
        } else {
            writeJsonFile(path, new Array(this));
        }
    }

    isExistFile(path) {
        try {
            fs.statSync(path);
            return true;
        } catch(err) {
            if (err.code === 'ENOENT') return false;
        }
    }

    updateJsonFile(path) {
        let list = getRoomListFromJson(path);
        list.push(this);
        writeJsonFile(path, list);
    }
}

// json file
function getRoomListFromJson(path) {
    let json = fs.readFileSync(path, 'utf-8');
    let data = JSON.parse(json);
    let roomList = new Array();
    data.forEach(function(element) {
        roomList.push(new Room(element['name'], element['keyWords']));
    });
    return roomList;
}

function writeJsonFile(path, rooms) {
    fs.writeFileSync(path, JSON.stringify(rooms), (err) => {
        if (err) rej(err);
        if (!err) {
            console.log('Success create Json');
            console.log(this);
        }
    });
}
