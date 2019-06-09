"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("../command");
const data_1 = require("../data");
require("https");
const https_1 = require("https");
const io_1 = require("../io");
const jimp_1 = require("jimp");
class PingCommand extends command_1.Command {
    constructor() {
        super(['ping'], data_1.Data.NORMAL);
    }
    process(m) {
        let channel = m.channel;
        let timeThen = m.createdTimestamp;
        channel.send('uwu').then((ms) => {
            let msg = ms;
            let timeDif = msg.createdTimestamp - timeThen;
            msg.edit(`response time: ${timeDif} ms`);
        });
    }
}
exports.PingCommand = PingCommand;
class BeepCommand extends command_1.Command {
    constructor() {
        super(['beep', 'breep'], data_1.Data.PLUS);
    }
    process(m) {
        let channel = m.channel;
        channel.send('here ya go', { files: ['./images/pinch.png'] });
    }
}
exports.BeepCommand = BeepCommand;
class AddPlusCommand extends command_1.Command {
    constructor() {
        super(['addplus', 'adp'], data_1.Data.ADMIN);
    }
    process(m) {
        let channel = m.channel;
        let collection = m.mentions.users;
        if (collection.size == 1) {
            let user = collection.array()[0];
            let userID = user.id;
            data_1.Data.addTo(data_1.Data.PLUS, userID).then(() => {
                channel.send(`${user.username} has been made a plus user!`);
            }).catch(() => {
                channel.send(`${user.username} is already a plus user`);
            });
        }
        else {
            channel.send("i don't understand who you want me to add");
        }
    }
}
exports.AddPlusCommand = AddPlusCommand;
class RemovePlusCommand extends command_1.Command {
    constructor() {
        super(['removeplus', 'rmp'], data_1.Data.ADMIN);
    }
    process(m) {
        let channel = m.channel;
        let collection = m.mentions.users;
        if (collection.size == 1) {
            let user = collection.array()[0];
            let userID = user.id;
            data_1.Data.removeFrom(data_1.Data.PLUS, userID).then(() => {
                channel.send(`${user.username} has been revoked of plus status!`);
            }).catch(() => {
                channel.send(`${user.username} isn't a plus user`);
            });
        }
        else {
            channel.send("i don't understand who you want me to remove");
        }
    }
}
exports.RemovePlusCommand = RemovePlusCommand;
class StopCommand extends command_1.Command {
    constructor() {
        super(['stop', 'byebye'], data_1.Data.ADMIN);
    }
    ;
    process(m, p) {
        let channel = m.channel;
        (p.length == 0) ?
            channel.send(';/').then(() => {
                data_1.client.destroy();
            }) :
            channel.send('goodbye').then(() => {
                data_1.client.destroy();
            });
    }
}
exports.StopCommand = StopCommand;
class CardCommand extends command_1.Command {
    constructor() {
        super(['mtg', 'card'], data_1.Data.NORMAL);
    }
    ;
    process(m) {
        let url = 'https://api.scryfall.com/cards/random';
        https_1.get(url, (res) => {
            let text = '';
            res.on('data', (chunk) => {
                text += chunk;
            });
            res.on('end', () => {
                JSON.parse(text, (key, value) => {
                    if (key === 'normal') {
                        let cardImage = value.split(/\?/)[0];
                        m.channel.send('', { files: [cardImage] });
                        return;
                    }
                });
            });
        });
    }
}
exports.CardCommand = CardCommand;
class StatCommand extends command_1.Command {
    constructor() {
        super(['poke', 'stat', 'stats'], data_1.Data.NORMAL);
        this.barWidth = 20;
        this.statnames = [
            ' HP',
            'ATK',
            'DEF',
            'SPA',
            'SPD',
            'SPE'
        ].reverse();
    }
    ;
    process(m, p) {
        let passID = '';
        if (p.length === 0) {
            let randNo = Math.floor(Math.random() * 807) + 1;
            passID = randNo.toString();
        }
        else {
            passID = p[0];
        }
        https_1.get(`https://pokeapi.co/api/v2/pokemon/${passID}`, (res) => {
            let text = '';
            res.on('data', (chunk) => {
                text += chunk;
            });
            res.on('end', () => {
                try {
                    let json = JSON.parse(text);
                    let name = json.name;
                    let stats = json.stats;
                    let block = `\`\`\`markdown\n${name}\n\n`;
                    let total = 0;
                    for (let i = 5; i >= 0; --i) {
                        let cs = stats[i].base_stat;
                        total += cs;
                        let cstr = cs.toString();
                        cstr = ' '.repeat(3 - cstr.length) + cstr;
                        let width = Math.floor((cs / 256.0) * this.barWidth) + 1;
                        let colorRange = Math.floor((cs / 256.0) * 3);
                        switch (colorRange) {
                            case 0:
                                block += `[${cstr}]: ${this.statnames[i]} | ${'█'.repeat(width)}${' '.repeat(this.barWidth - width)}\n`;
                                break;
                            case 1:
                                block += `#${cstr}]: ${this.statnames[i]} | ${'█'.repeat(width)}${' '.repeat(this.barWidth - width)}\n`;
                                break;
                            case 2:
                                block += `[${cstr}|: ${this.statnames[i]} | ${'█'.repeat(width)}${' '.repeat(this.barWidth - width)}]()\n`;
                                break;
                        }
                    }
                    block += `[${total}]: TOT |\`\`\``;
                    m.channel.send(block);
                }
                catch (ex) {
                    m.channel.send(`that's not a valid pokemon`);
                }
            });
        });
    }
}
exports.StatCommand = StatCommand;
class YesNoCommand extends command_1.Command {
    constructor() {
        super(['ask', 'yn'], data_1.Data.NORMAL);
        this.responses = [
            'certainly',
            'for sure',
            'yeet',
            'affirmative',
            'yes',
            'probably',
            'maybe',
            'i don\'t know',
            'probably not',
            'no',
            'nope',
            'certainly not',
            'negative',
            'never',
        ];
    }
    process(m, p) {
        if (p.length > 0) {
            let hash = io_1.hashify(p.join());
            let num = Math.floor(hash.readUIntBE(0, 1) / 256.0 * this.responses.length);
            m.channel.send(this.responses[num]);
        }
        else {
            m.channel.send('ask me a yes or no question');
        }
    }
}
exports.YesNoCommand = YesNoCommand;
class ProfileCommand extends command_1.Command {
    constructor() {
        super(['profile', 'pfp'], data_1.Data.NORMAL);
    }
    cleanUrl(url) {
        return url.substr(0, url.lastIndexOf('size'));
    }
    process(m, p) {
        let mentions = m.mentions.members;
        if (mentions.size == 0) {
            m.channel.send({ files: [this.cleanUrl(m.author.avatarURL)] });
        }
        else {
            let array = mentions.array();
            let pfpArray = [];
            array.forEach((e) => {
                pfpArray.push(this.cleanUrl(e.user.avatarURL));
            });
            m.channel.send({ files: pfpArray });
        }
    }
}
exports.ProfileCommand = ProfileCommand;
class ResampleCommand extends command_1.Command {
    constructor() {
        super(['resample'], data_1.Data.NORMAL);
    }
    process(m) {
        let attach = m.attachments;
        if (attach.size == 0) {
            m.channel.send('attach an image to resample');
        }
        else if (attach.size == 1) {
            let im_a = attach.array()[0];
            jimp_1.read(im_a.url).then((img) => {
                m.channel.send('read successfully\ndamn');
            }).catch((j) => {
                m.channel.send('an error occured');
            });
        }
        else {
            m.channel.send('i need only one image');
        }
    }
}
exports.ResampleCommand = ResampleCommand;
class DotCommand extends command_1.Command {
    constructor() {
        super(['dot', 'braille'], data_1.Data.NORMAL);
        this.DEFAULT_WIDTH = 40;
        this.MIN_WIDTH = 10;
        this.MAX_WIDTH = 100;
    }
    process(m, p) {
        let attach = m.attachments;
        if (attach.size == 0) {
            m.channel.send('attach an image');
        }
        else if (attach.size == 1) {
            let im_a = attach.array()[0];
            jimp_1.read(im_a.url).then((img) => {
                let width;
                if (p.length === 0) {
                    width = this.DEFAULT_WIDTH;
                }
                else {
                    width = Number.parseInt(p[0]);
                    if (width === 0)
                        width = this.DEFAULT_WIDTH;
                    else if (width % 2 === 1)
                        ++width;
                    if (width < this.MIN_WIDTH)
                        width = this.MIN_WIDTH;
                    else if (width > this.MAX_WIDTH)
                        width = this.MAX_WIDTH;
                    console.log(width);
                }
                let ratio = img.getHeight() / img.getWidth();
                let height = ratio * width;
                height = 4 * Math.round(height / 4);
                img.resize(width, height, () => {
                    let data = img.bitmap.data;
                    img.scan(0, 0, width, height, (x, y, idx) => {
                        let tot = (data[idx] + data[idx + 1] + data[idx + 2]) / 3.0;
                        let color = (tot > 127) ? 1 : 0;
                        data[idx] = color;
                    }, () => {
                        function getPixel(i, j) {
                            return data[img.getPixelIndex(i, j)];
                        }
                        let pix = getPixel;
                        let text = [];
                        for (let j = 0; j < height; j += 4) {
                            let line = '';
                            for (let i = 0; i < width; i += 2) {
                                let num = (pix(i, j)) |
                                    (pix(i, j + 1) << 1) |
                                    (pix(i, j + 2) << 2) |
                                    (pix(i, j + 3) << 6) |
                                    (pix(i + 1, j) << 3) |
                                    (pix(i + 1, j + 1) << 4) |
                                    (pix(i + 1, j + 2) << 5) |
                                    (pix(i + 1, j + 3) << 7);
                                line += String.fromCharCode(0x2800 + num);
                            }
                            text.push(line);
                        }
                        m.channel.send(`\`\`\`${text.join('\n')}\`\`\``);
                    });
                });
            }).catch((j) => {
                m.channel.send('an error occured');
            });
        }
        else {
            m.channel.send('i need only one image');
        }
    }
}
exports.DotCommand = DotCommand;
class HelpCommand extends command_1.Command {
    constructor() {
        super(['help', 'commands'], data_1.Data.NORMAL);
    }
    process(m) {
        let str = '\`\`\`\ncommand list:\n';
        data_1.Data.command_list.forEach(command => {
            str += command.matches[0] + '\n';
        });
        m.channel.send(str + '\`\`\`');
    }
}
exports.HelpCommand = HelpCommand;
