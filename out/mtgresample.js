"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = require("https");
const fs_1 = require("fs");
function gatherCard() {
    console.log('gathering...');
    https_1.get('https://api.scryfall.com/cards/random', (res) => {
        let text = '';
        res.on('data', (chunk) => {
            text += chunk;
        });
        res.on('end', () => {
            let json = JSON.parse(text);
            let uri = json.image_uris.art_crop;
            let parts = uri.split(/\?/);
            console.log(`found`);
            setTimeout(() => {
                https_1.get(parts[0], (res) => {
                    let imgData = '';
                    res.setEncoding('binary');
                    res.on('data', (chunk) => {
                        imgData += chunk;
                    });
                    res.on('end', () => {
                        fs_1.readdir('./data/mtgresample', (ex0, files) => {
                            let len = files.length;
                            if (len === 1000) {
                                process.exit();
                            }
                            else {
                                fs_1.writeFile(`./data/mtgresample/${files.length}.png`, imgData, 'binary', (ex1) => {
                                    console.log('written file!');
                                    setTimeout(gatherCard, 1000);
                                });
                            }
                        });
                    });
                });
            }, 500);
        });
    });
}
gatherCard();
