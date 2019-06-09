"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("readline");
const io_1 = require("./io");
const data_1 = require("./data");
const secretLogin = '08bd65522ba49ddb56afea09b6b14c979393cacb19d5e1a3c8dc582afa70ab9a2014fe6aadf0f4c3c10855755fd3edcb42e3d2dee82ed15d1c5b1b';
const discriminator = '==';
const permVerifiers = [
    () => false,
    () => true,
    (user) => data_1.Data.data[data_1.Data.PLUS].includes(user.id),
    (user) => data_1.Data.data[data_1.Data.ADMIN].includes(user.id)
];
data_1.client.on('ready', async () => {
    console.log('logged in as' + data_1.client.user.tag + '! ');
});
data_1.client.on('message', commandInput);
data_1.client.on('messageUpdate', commandInput);
async function commandInput(msg) {
    let sender = msg.author;
    if (sender.bot)
        return;
    if (data_1.Data.data[data_1.Data.GHOST].includes(sender.id))
        return;
    let text = msg.content;
    let parts = text.split(/ +/);
    if (parts[0].startsWith(discriminator)) {
        let matches = parts.shift();
        matches = matches.substr(discriminator.length, matches.length).toLowerCase();
        let numCommands = data_1.Data.command_list.length;
        commandLoop: for (let i = 0; i < numCommands; ++i) {
            let cc = data_1.Data.command_list[i];
            let keys = cc.matches;
            if (keys.includes(matches)) {
                let perm = cc.permission;
                for (let j = perm; j < 4; ++j) {
                    if (permVerifiers[j](sender)) {
                        cc.process(msg, parts);
                        break commandLoop;
                    }
                }
                msg.reply('you need a rank of at least ' + data_1.Data.PERM_NAMES[perm] + ' to use this command');
                break;
            }
        }
    }
}
console.log('loading...');
data_1.Data.retrieveAll().then(() => {
    console.log('welcome to emoji manager!');
    io_1.createQuestion('enter passcode: ', 'wrong passcode!', (response) => new Promise((accept, reject) => {
        let truth = io_1.decrypt(secretLogin, 'aes-256-ctr', response);
        io_1.stringPurity(truth) ?
            data_1.client.login(truth).then(() => accept).catch(() => reject) :
            reject();
    }));
});
