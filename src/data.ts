import { storeIDList } from './storage';
import { Client } from 'discord.js';
import { RetrieveIDList as retrieveIDList } from './storage';
import { Command } from './command';
import { PingCommand, BeepCommand, AddPlusCommand, StopCommand, RemovePlusCommand, CardCommand, StatCommand, YesNoCommand, ProfileCommand, ResampleCommand, DotCommand, HelpCommand } from "./commands/ping";

export const client = new Client();

export module Data
{
	export const GHOST = 0;
	export const NORMAL = 1;
	export const PLUS = 2;
	export const ADMIN = 3;

	export const PATHS:string[] =
	[
		'./data/ghost_users',
		'',
		'./data/plus_users',
		'./data/admin_users'
	] 

	export var data:string[][] =
	[
		[],
		[],
		[],
		[]
	]

	export const PERM_NAMES:string[] =
	[
		'ghost',
		'normal',
		'plus',
		'admin'
	]

	export var server_prefs:string[] = [];

	export const command_list:Command[] = 
	[
		new PingCommand(),
		new BeepCommand(),
		new AddPlusCommand(),
		new StopCommand(),
		new RemovePlusCommand(),
		new CardCommand(),
		new StatCommand(),
		new YesNoCommand(),
		new ProfileCommand(),
		new ResampleCommand(),
		new DotCommand(),
		new HelpCommand()
	]

	export function addTo(ind: number, id: string): Promise<void>
	{
		return new Promise<void>((accept, reject) =>
		{
			let a = () =>
			{
				data[ind].push(id);
				storeIDList(PATHS[ind], data[ind]);
				accept();
			}

			data[ind].includes(id) ? reject() : a();
		});
	}

	export function removeFrom(ind: number, id: string): Promise<void>
	{
		return new Promise<void>((accept, reject) =>
		{
			if(data[ind].includes(id)) {
				data[ind] = data[ind].filter((v) => {
					return v != id;
				});
				storeIDList(PATHS[ind], data[ind]);
				accept();
			} else {
				reject();
			}
		});
	}

	export function retrieveAll(): Promise<void>
	{
		return new Promise((resolve) =>
		{
			let counter = 0;

			async function exit() {
				if(++counter === 3) {
					console.log('all loaded!');
					resolve();
				}
			};

			retrieveIDList(PATHS[GHOST], data[GHOST], exit);
			retrieveIDList(PATHS[PLUS], data[PLUS], exit);
			retrieveIDList(PATHS[ADMIN], data[ADMIN], exit);
		});
	}

}
