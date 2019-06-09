"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("./storage");
const discord_js_1 = require("discord.js");
const storage_2 = require("./storage");
const ping_1 = require("./commands/ping");
exports.client = new discord_js_1.Client();
var Data;
(function (Data) {
    Data.GHOST = 0;
    Data.NORMAL = 1;
    Data.PLUS = 2;
    Data.ADMIN = 3;
    Data.PATHS = [
        './data/ghost_users',
        '',
        './data/plus_users',
        './data/admin_users'
    ];
    Data.data = [
        [],
        [],
        [],
        []
    ];
    Data.PERM_NAMES = [
        'ghost',
        'normal',
        'plus',
        'admin'
    ];
    Data.server_prefs = [];
    Data.command_list = [
        new ping_1.PingCommand(),
        new ping_1.BeepCommand(),
        new ping_1.AddPlusCommand(),
        new ping_1.StopCommand(),
        new ping_1.RemovePlusCommand(),
        new ping_1.CardCommand(),
        new ping_1.StatCommand(),
        new ping_1.YesNoCommand(),
        new ping_1.ProfileCommand(),
        new ping_1.ResampleCommand(),
        new ping_1.DotCommand(),
        new ping_1.HelpCommand()
    ];
    function addTo(ind, id) {
        return new Promise((accept, reject) => {
            let a = () => {
                Data.data[ind].push(id);
                storage_1.storeIDList(Data.PATHS[ind], Data.data[ind]);
                accept();
            };
            Data.data[ind].includes(id) ? reject() : a();
        });
    }
    Data.addTo = addTo;
    function removeFrom(ind, id) {
        return new Promise((accept, reject) => {
            if (Data.data[ind].includes(id)) {
                Data.data[ind] = Data.data[ind].filter((v) => {
                    return v != id;
                });
                storage_1.storeIDList(Data.PATHS[ind], Data.data[ind]);
                accept();
            }
            else {
                reject();
            }
        });
    }
    Data.removeFrom = removeFrom;
    function retrieveAll() {
        return new Promise((resolve) => {
            let counter = 0;
            async function exit() {
                if (++counter === 3) {
                    console.log('all loaded!');
                    resolve();
                }
            }
            ;
            storage_2.RetrieveIDList(Data.PATHS[Data.GHOST], Data.data[Data.GHOST], exit);
            storage_2.RetrieveIDList(Data.PATHS[Data.PLUS], Data.data[Data.PLUS], exit);
            storage_2.RetrieveIDList(Data.PATHS[Data.ADMIN], Data.data[Data.ADMIN], exit);
        });
    }
    Data.retrieveAll = retrieveAll;
})(Data = exports.Data || (exports.Data = {}));
