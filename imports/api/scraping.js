import puppeteer from 'puppeteer';

Meteor.methods({
	'scrapeBook': async function (url) {
        console.log("awaiting function...")
		let result = await scrapeBook(url);
		return result;
	}
});

async function scrapeBook(url){
    console.log("starting...")
    const browser = await puppeteer.launch();
    console.log("launched browser...")
    const page = await browser.newPage();
    console.log("opening page...")

    await page.goto(url);
    console.log("accessing url...");
    console.log('scraping book...');

    const title_node = (await page.$x('//work/best_book/title'))[0];
    let title = ""

    try { 
        title = await page.evaluate(el => {
            return el.textContent;
        }, title_node)
    }
    catch(error){
        console.log("error!")
        title = ""
    }

    const author_node = (await page.$x('//work/best_book/author/name'))[0];

    let author = "" 
    
    try { 
        author = await page.evaluate(el => {
            return el.textContent;
        }, author_node)
    }
    catch(error){
        console.log("error!")
        author = ""
    }

    const pub_node = (await page.$x('//work/original_publication_year'))[0];

    let publication = ""
    try { 
        publication = await page.evaluate(el => {
            return el.textContent;
        }, pub_node)
    }
    catch(error){
        console.log("error!")
        publication = ""
    }

    const thumbnail_node = (await page.$x('//work/best_book/image_url'))[0];

    let thumbnail = ""
    try { 
        thumbnail = await page.evaluate(el => {
            return el.textContent;
        }, thumbnail_node)
    }
    catch(error){
        console.log("error!")
        thumbnail = ""
    }

    await browser.close();
    return [title, author, publication, thumbnail]
}
