# ☁️ Cloudflare Workers Framework

online demo: https://cfwjs.lsong.workers.dev

## example

```js
const app = CloudflareWorker();

app.get('/', async ({ path }) => {
  return `hello world`;
});

// start workers
addEventListener('fetch', app);
```

## license

This Project is under GPLv2 .