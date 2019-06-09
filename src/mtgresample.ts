import { get } from 'https'
import { writeFile, readdir } from 'fs';

function gatherCard()
{
	console.log('gathering...')
	get('https://api.scryfall.com/cards/random', (res) =>
	{	
		let text = '';

		res.on('data', (chunk) =>
		{
			text += chunk;
		});

		res.on('end', () =>
		{
			let json = JSON.parse(text);

			let uri = json.image_uris.art_crop;

			let parts = uri.split(/\?/);

			console.log(`found`)
			setTimeout(() => {
				get(parts[0], (res) =>
				{
					let imgData = '';
					res.setEncoding('binary');

					res.on('data', (chunk) =>
					{
						imgData += chunk;
					});

					res.on('end', () => {
						readdir('./data/mtgresample', (ex0, files) => {
							let len = files.length;
							if(len === 1000) {
								process.exit();
							} else {
								writeFile(`./data/mtgresample/${files.length}.png`, imgData, 'binary', (ex1) => {
									console.log('written file!');
									setTimeout(gatherCard, 1000);
								});
							}
						});
					});
				});
			}, 500);
		});
	});
}

gatherCard();
