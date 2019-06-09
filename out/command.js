"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(m, s) {
        this.matches = m;
        this.permission = s;
    }
    process(m, p) { }
}
exports.Command = Command;
