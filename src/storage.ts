import { openSync, fstat, createReadStream, createWriteStream, writeFile, writeFileSync, readFileSync, readFile } from 'fs';
import { ServerResponse } from 'http';

export async function RetrieveIDList(path: string, put: Array<string>, callback: Function)
{
	let stream = createReadStream(path);

	let idBuilder = '';

	function build() {
		put.push(idBuilder);
		idBuilder = '';
	}

	stream.on('readable', () =>
	{
		let b:Buffer;
		while(null !== (b = stream.read(1)))
		{
			let c = b.toString();
			if(c === ',')
			{
				build();
			} else
			{
				idBuilder += c;
			}
		}
	});

	stream.on('end', () =>
	{
		build();
		callback();
	});
}

export function storeIDList(path: string, set: Array<string>) {
	writeFileSync(path, set.join(','));
}