import { Message, MessageEmbedImage, MessageEmbed } from 'discord.js';
import { Command } from '../command';
import { Data, client } from "../data";
import { storeIDList } from '../storage';
import { Http2SecureServer } from 'http2';
import 'https';
import { get } from 'https';
import { hashify } from '../io';
import { read, RESIZE_BILINEAR, AUTO } from 'jimp';

export class PingCommand extends Command
{
	constructor()
	{
		super(['ping'], Data.NORMAL);
	}

	process(m: Message)
	{
		let channel = m.channel;
		let timeThen = m.createdTimestamp;
		channel.send('uwu').then((ms) =>
		{
			let msg	= (<Message>ms);
			let timeDif = msg.createdTimestamp - timeThen;
			msg.edit(`response time: ${timeDif} ms`);
		});
	}
}

export class BeepCommand extends Command
{
	constructor()
	{
		super(['beep','breep'], Data.PLUS);
	}

	process(m: Message)
	{
		let channel = m.channel;
		channel.send('here ya go', {files: ['./images/pinch.png']});
	}
}

export class AddPlusCommand extends Command
{
	constructor()
	{
		super(['addplus', 'adp'], Data.ADMIN)
	}

	process(m: Message)
	{
		let channel = m.channel;

		let collection = m.mentions.users;
		if(collection.size == 1)
		{
			let user = collection.array()[0];
			let userID = user.id;

			Data.addTo(Data.PLUS, userID).then(() => {
				channel.send(`${user.username} has been made a plus user!`);
			}).catch(() => {
				channel.send(`${user.username} is already a plus user`);
			});
		} else {
			channel.send("i don't understand who you want me to add");
		}
	}
}

export class RemovePlusCommand extends Command
{
	constructor()
	{
		super(['removeplus', 'rmp'], Data.ADMIN)
	}

	process(m: Message)
	{
		let channel = m.channel;

		let collection = m.mentions.users;
		if(collection.size == 1)
		{
			let user = collection.array()[0];
			let userID = user.id;

			Data.removeFrom(Data.PLUS, userID).then(() => {
				channel.send(`${user.username} has been revoked of plus status!`);
			}).catch(() => {
				channel.send(`${user.username} isn't a plus user`);
			});
		} else {
			channel.send("i don't understand who you want me to remove");
		}
	}
}

export class StopCommand extends Command
{
	constructor()
	{
		super(['stop','byebye'], Data.ADMIN)
	};
	
	process(m: Message, p: String[])
	{
		let channel = m.channel;
		(p.length == 0) ?
		channel.send(';/').then(() =>
		{
			client.destroy();
		}) :
		channel.send('goodbye').then(() =>
		{
			client.destroy();
		});
	}
}

export class CardCommand extends Command
{
	constructor()
	{
		super(['mtg','card'], Data.NORMAL)
	};

	process(m: Message)
	{
		let url = 'https://api.scryfall.com/cards/random';
		get(url, (res) =>
		{	
			let text = '';

			res.on('data', (chunk) =>
			{
				text += chunk;
			});

			res.on('end', () =>
			{
				JSON.parse(text, (key, value) =>
				{
					if(key === 'normal')
					{
						let cardImage = value.split(/\?/)[0];
						m.channel.send('', {files: [cardImage]});
						return;
					}
				})
			});
		});
	}
}

export class StatCommand extends Command
{
	constructor()
	{
		super(['poke','stat','stats'], Data.NORMAL)
	};

	barWidth = 20;

	statnames:string[] =
	[
		' HP',
		'ATK',
		'DEF',
		'SPA',
		'SPD',
		'SPE'
	].reverse();

	process(m: Message, p:string[])
	{
		let passID = '';

		if(p.length === 0)
		{
			let randNo = Math.floor(Math.random() * 807) + 1;
			passID = randNo.toString();
		} else
		{
			passID = p[0];
		}

		get(`https://pokeapi.co/api/v2/pokemon/${passID}`, (res) =>
		{	
			let text = '';

			res.on('data', (chunk) =>
			{
				text += chunk;
			});

			res.on('end', () =>
			{
				try {
					let json = JSON.parse(text);

					let name:string = json.name;

					let stats:Array<any> = json.stats;

					let block = `\`\`\`markdown\n${name}\n\n`;

					let total = 0;

					for(let i = 5; i >= 0; --i)
					{
						let cs:number = stats[i].base_stat;
						total += cs;

						let cstr = cs.toString();
						cstr = ' '.repeat(3 - cstr.length) + cstr;

						let width = Math.floor((cs / 256.0) * this.barWidth) + 1;

						let colorRange = Math.floor((cs / 256.0) * 3);
						switch(colorRange)
						{
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
				} catch(ex) {
					m.channel.send(`that's not a valid pokemon`);
				}
			});
		});
	}
}

export class YesNoCommand extends Command
{
	constructor()
	{
		super(['ask','yn'], Data.NORMAL);
	}

	responses:string[] = 
	[
		'certainly',
		'for sure',
		'yeet',
		'affirmative',
		'yes',
		'probably',
		//---------------//
		'maybe',
		'i don\'t know',
		//-----------------//
		'probably not',
		'no',
		'nope',
		'certainly not',
		'negative',
		'never',
	];

	process(m: Message, p: string[])
	{
		if(p.length > 0)
		{
			let hash = hashify(p.join());
			let num = Math.floor(hash.readUIntBE(0, 1) / 256.0 * this.responses.length);

			m.channel.send(this.responses[num]);
		} else
		{
			m.channel.send('ask me a yes or no question');
		}
	}
}

export class ProfileCommand extends Command
{
	constructor()
	{
		super(['profile','pfp'], Data.NORMAL);
	}

	cleanUrl(url: string): string
	{
		return url.substr(0, url.lastIndexOf('size'));
	}

	process(m: Message, p: string[])
	{
		let mentions = m.mentions.members;

		if(mentions.size == 0)
		{
			m.channel.send({files:[this.cleanUrl(m.author.avatarURL)]});
		} else
		{
			let array = mentions.array();
			let pfpArray:string[] = [];

			array.forEach((e) => {
				pfpArray.push(this.cleanUrl(e.user.avatarURL));
			});

			m.channel.send({files:pfpArray});
		}
	}
}

export class ResampleCommand extends Command
{
	constructor()
	{
		super(['resample'], Data.NORMAL);
	}

	process(m: Message)
	{
		let attach = m.attachments;
		if(attach.size == 0)
		{
			m.channel.send('attach an image to resample')
		} else if(attach.size == 1)
		{
			let im_a = attach.array()[0];
			
			read(im_a.url).then((img) => {
				
				m.channel.send('read successfully\ndamn')
			}).catch((j) => {
				m.channel.send('an error occured');
			});
		} else
		{
			m.channel.send('i need only one image');
		}
	}
}

export class DotCommand extends Command
{
	constructor()
	{
		super(['dot','braille'], Data.NORMAL);
	}

	DEFAULT_WIDTH = 40;
	MIN_WIDTH = 10;
	MAX_WIDTH = 100;

	process(m: Message, p:string[])
	{
		let attach = m.attachments;
		if(attach.size == 0)
		{
			m.channel.send('attach an image')
		} else if(attach.size == 1)
		{
			let im_a = attach.array()[0];

			read(im_a.url).then((img) =>
			{
				let width:number;
				if(p.length === 0)
				{
					width = this.DEFAULT_WIDTH;
				} else
				{
					width = Number.parseInt(p[0]);
					if(width === 0) width = this.DEFAULT_WIDTH;
					else if(width % 2 === 1) ++width;
					if(width < this.MIN_WIDTH) width = this.MIN_WIDTH;
					else if(width > this.MAX_WIDTH) width = this.MAX_WIDTH;

					console.log(width);
				}

				let ratio = img.getHeight() / img.getWidth();
				let height = ratio * width;
				height = 4 * Math.round(height / 4);

				img.resize(width, height, () =>
				{
					let data = img.bitmap.data;
					img.scan(0, 0, width, height, (x, y, idx) =>
					{
						let tot = (data[idx] + data[idx + 1] + data[idx + 2]) / 3.0;

						let color = (tot > 127) ? 1 : 0;
						data[idx] = color;
						
					}, () =>
					{
						function getPixel(i: number, j: number):number
						{
							return data[img.getPixelIndex(i, j)];
						}

						let pix = getPixel;

						let text:string[] = [];
						for(let j = 0; j < height; j += 4)
						{
							let line = '';
							for(let i = 0; i < width; i += 2)
							{
								let num =
									(pix(i    , j    )     )|
									(pix(i    , j + 1) << 1)|
									(pix(i    , j + 2) << 2)|
									(pix(i    , j + 3) << 6)|
									(pix(i + 1, j    ) << 3)|
									(pix(i + 1, j + 1) << 4)|
									(pix(i + 1, j + 2) << 5)|
									(pix(i + 1, j + 3) << 7);
								line += String.fromCharCode(0x2800 + num);
							}
							text.push(line);
						}

						m.channel.send(`\`\`\`${text.join('\n')}\`\`\``);
					});
					/*.write('./data/temp/dot.png', () =>
					{
						m.channel.send({files: ['./data/temp/dot.png']});
					});*/
				});
			}).catch((j) =>
			{
				m.channel.send('an error occured');
			});
		} else
		{
			m.channel.send('i need only one image');
		}
	}
}

export class HelpCommand extends Command
{
	constructor()
	{
		super(['help','commands'], Data.NORMAL);
	}

	process(m: Message)
	{
		let str = '\`\`\`\ncommand list:\n';

		Data.command_list.forEach(command =>
		{
			str += command.matches[0] + '\n'	
		});

		m.channel.send(str + '\`\`\`');
	}
}