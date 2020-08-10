
const puppeteer = require('puppeteer');

async function start (){
    async function loadNewComments(page, selector){
        const moreButton = await page.$(selector)
        if(moreButton){ 
          console.log("more");
          await moreButton.click();
          await page.waitFor(selector, {timeout: 4000}).catch(() => {console.log ("timeout")});
          await loadNewComments(page, selector);
        }
    }

    async  function getComments(page, selector){
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText));
        return comments;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/p/CCFNBvYMhqK/');
    await loadNewComments(page, '.dCJp8');

    const users = await getComments(page, '.C4VMK span a');
    const counted = count(users);
    const sorted = sortUsers(counted);
    sorted.forEach(user =>{console.log(user)})
    await browser.close()

}

function count(users){
    const count = {}
    users.forEach(user => {count[user] = (count[user] || 0) + 1})
    return count;
}

function sortUsers(counted){
    const entries = Object.entries(counted);
    const sorted = entries.sort((a,b)=> { return b[1] - a[1]});
    return sorted;
}

start();
