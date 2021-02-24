import fetch from 'node-fetch';
import $ from 'cheerio';
import fs from 'fs';

const getImageSources = async (url: string) => {
    const response = await fetch(url);

    let html = '';
    try {
        for await (const chunk of response.body) {
            html += chunk.toString();
        }
    } catch (err) {
        console.log(err.stack);
    }

    const imageNodes = $('img', html);
    const sources = imageNodes.map((_, el) => el.attribs.src);

    return sources.toArray();
}

const getImage = async (url: string, chapterFolder: string) => {
    const response = await fetch(url);
    const fileName = url.substring(url.lastIndexOf('/') + 1);
    const dir = `chapters/${chapterFolder}`;

    try {
        const image = await response.buffer();

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.writeFile(`${dir}/${fileName}`, image, () =>
            console.log(`finished downloading ${chapterFolder}/${fileName}`));

    } catch (err) {
        console.log(err.stack);
    }
}

const scrapChapter = async (baseUri: string, chapter: string) => {
    const imageSources = await getImageSources(`${baseUri}${chapter}`);

    for (const imageSource of imageSources) {        
        await getImage(imageSource.toString(), chapter);
    }
}

export { getImageSources, getImage, scrapChapter };