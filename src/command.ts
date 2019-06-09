import { Message } from "discord.js";

export class Command
{
	matches: string[];
	permission: number;

	constructor(m: string[], s: number)
	{
		this.matches = m;
		this.permission = s;
	}

	process(m: Message, p: string[]) {}
}
