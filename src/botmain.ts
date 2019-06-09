import { Client, Message, User } from "discord.js";
import 'readline';
import { createQuestion, stringPurity, decrypt } from "./io";
import { RetrieveIDList } from "./storage";
import { Data, client } from "./data";

const secretLogin = '08bd65522ba49ddb56afea09b6b14c979393cacb19d5e1a3c8dc582afa70ab9a2014fe6aadf0f4c3c10855755fd3edcb42e3d2dee82ed15d1c5b1b';

const discriminator = '==';

/** functions to veryify whether users are allowed to use a command
 *  based off of whether they are of a certiain permission level
 */
const permVerifiers:((user: User) => boolean)[] =
[
	/* ghost should probnably never be activated */
	() => false,
	/* for normal level commands, everyone is authorized */
	() => true,
	/* for plus level commands */
	(user) => Data.data[Data.PLUS].includes(user.id),
	/* for admin level commands */
	(user) => Data.data[Data.ADMIN].includes(user.id)
];

client.on('ready', async () =>
{
	console.log('logged in as' + client.user.tag + '! ');
});

client.on('message', commandInput);

client.on('messageUpdate', commandInput);

async function commandInput(msg: Message)
{
	let sender = msg.author;

	if(sender.bot) return;
	if(Data.data[Data.GHOST].includes(sender.id)) return;

	let text = msg.content;
	
	let parts = text.split(/ +/);

	if(parts[0].startsWith(discriminator))
	{
		let matches = (<string>parts.shift());
		matches = matches.substr(discriminator.length, matches.length).toLowerCase();

		let numCommands = Data.command_list.length;

		commandLoop: for(let i = 0; i < numCommands; ++i)
		{
			let cc = Data.command_list[i];
			let keys = cc.matches;

			if (keys.includes(matches))
			{

				let perm = cc.permission;

				for(let j = perm; j < 4; ++j)
				{
					if (permVerifiers[j](sender)) {
						cc.process(msg, parts);
						break commandLoop;
					}
				}

				msg.reply('you need a rank of at least ' + Data.PERM_NAMES[perm] + ' to use this command');
				break;
			}
		}
	}
}

/* start doing stuff */
/* main method essentially */

console.log('loading...');

Data.retrieveAll().then(() =>
{
	console.log('welcome to emoji manager!');

	createQuestion('enter passcode: ', 'wrong passcode!',
		(response: string) => new Promise<void>((accept, reject) =>
		{
			let truth = decrypt(secretLogin, 'aes-256-ctr', response);

			stringPurity(truth) ? 
				client.login(truth).then(() => accept).catch(() => reject) :
				reject();
		})
	);
});
	