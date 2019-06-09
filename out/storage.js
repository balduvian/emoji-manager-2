"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
async function RetrieveIDList(path, put, callback) {
    let stream = fs_1.createReadStream(path);
    let idBuilder = '';
    function build() {
        put.push(idBuilder);
        idBuilder = '';
    }
    stream.on('readable', () => {
        let b;
        while (null !== (b = stream.read(1))) {
            let c = b.toString();
            if (c === ',') {
                build();
            }
            else {
                idBuilder += c;
            }
        }
    });
    stream.on('end', () => {
        build();
        callback();
    });
}
exports.RetrieveIDList = RetrieveIDList;
function storeIDList(path, set) {
    fs_1.writeFileSync(path, set.join(','));
}
exports.storeIDList = storeIDList;
