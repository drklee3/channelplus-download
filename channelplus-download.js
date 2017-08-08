// ==UserScript==
// @name         CHANNEL+ Downloader
// @version      0.1
// @description  Downloads CHANNEL+ images
// @author       Derrick Lee
// @match        http://api.vfan.vlive.tv/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_notification
// ==/UserScript==

function formatDate(date) {
    let yy = date.getFullYear().toString().substr(2);
    let mm = ('0' + (date.getMonth() + 1).toString()).slice(-2);
    let dd = ('0' + date.getDate().toString()).slice(-2);

    return yy + mm + dd;
}

function pad(num) {
    return ('0' + num).slice(-2);
}

GM_registerMenuCommand('Download images', function() { // eslint-disable-line no-undef
    'use strict';
    let raw = document.getElementsByTagName('pre')[0].textContent;
    let data;
    try {
        data = JSON.parse(raw);
    } catch (e) {
        GM_notification('Failed to parse JSON'); // eslint-disable-line no-undef
        return;
    }

    let posts = data.data;
    let toDownload = 0;
    let lastDate;
    let dateCount = 0;

    for (let i = 0; i < posts.length; i++) {
        let date = formatDate(new Date(posts[i].created_at));
        let photos = posts[i].photo;

        for (let key in photos) {
            toDownload++;

            let fileName;
            if (lastDate === date) {
                dateCount++;
                fileName = date + '_'+ pad(dateCount);
            } else { // new date
                dateCount = 0;
                fileName = date;
            }

            lastDate = date;
            GM_download(photos[key].url, fileName); // eslint-disable-line no-undef
        }
    }

    GM_notification('started ' + toDownload + ' downloads'); // eslint-disable-line no-undef
}, 'r');