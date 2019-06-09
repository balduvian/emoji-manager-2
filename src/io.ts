import { createInterface, Interface, emitKeypressEvents, Key, ReadLineOptions } from "readline";
import { SIGINT } from "constants";
import { createHash, createHmac, createCipher, createCipheriv, createDecipher, createDecipheriv, Cipher } from 'crypto';

export function createQuestion(question: string, rejectMessage: string, onEnter: (s: string) => Promise<void>): Interface
{
    let iq = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    ask(iq, question);

    iq.on('line', (line) =>
    {
        iq.pause();

        onEnter(line).then(() =>
        {
            iq.close();
        }).catch(() =>
        {
            console.log(rejectMessage);
            ask(iq, question);
        });
    });

    return iq;
}

export function ask(iq: Interface, question: string)
{
    iq.resume();
    iq.setPrompt(question);
    iq.prompt();
}

export function hashify(input: string): Buffer
{
    let hash = createHash('sha256');
    hash.update(input);
    return Buffer.alloc(32, hash.digest('base64'));
}

export function encrypt(text:string, algorithm: string, password:string): string
{
    var cipher = createCipher(algorithm, hashify(password));
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
    
export function decrypt(text:string, algorithm: string, password:string): string
{
    var decipher = createDecipher(algorithm, hashify(password));
    var dec = decipher.update(text, 'hex', 'ascii');
    dec += decipher.final('ascii');
    return dec;
}

export function stringPurity(str: string): boolean
{
    let len = str.length;
    for(let i = 0; i < len; ++i)
    {
        let code = str.charCodeAt(i);   
        if(code < 32 || code > 126)
        {
            return false;
        }
    }
    return true;
}
