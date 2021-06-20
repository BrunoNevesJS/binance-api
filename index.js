const api = require('./api');

setInterval(async () => {
    console.log(await api.depth());
}, process.env.CRAWLER_INTERVAL)