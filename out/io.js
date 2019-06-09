"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const crypto_1 = require("crypto");
function createQuestion(question, rejectMessage, onEnter) {
    let iq = readline_1.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    ask(iq, question);
    iq.on('line', (line) => {
        iq.pause();
        onEnter(line).then(() => {
            iq.close();
        }).catch(() => {
            console.log(rejectMessage);
            ask(iq, question);
        });
    });
    return iq;
}
exports.createQuestion = createQuestion;
function ask(iq, question) {
    iq.resume();
    iq.setPrompt(question);
    iq.prompt();
}
exports.ask = ask;
function hashify(input) {
    let hash = crypto_1.createHash('sha256');
    hash.update(input);
    return Buffer.alloc(32, hash.digest('base64'));
}
exports.hashify = hashify;
function encrypt(text, algorithm, password) {
    var cipher = crypto_1.createCipher(algorithm, hashify(password));
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
exports.encrypt = encrypt;
function decrypt(text, algorithm, password) {
    var decipher = crypto_1.createDecipher(algorithm, hashify(password));
    var dec = decipher.update(text, 'hex', 'ascii');
    dec += decipher.final('ascii');
    return dec;
}
exports.decrypt = decrypt;
function stringPurity(str) {
    let len = str.length;
    for (let i = 0; i < len; ++i) {
        let code = str.charCodeAt(i);
        if (code < 32 || code > 126) {
            return false;
        }
    }
    return true;
}
exports.stringPurity = stringPurity;
