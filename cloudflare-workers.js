const CloudflareWorker = () => {
  const routes = [];
  const notFound = () =>
    new Response('Not Found', { status: 404 });
  const handle = async (route, request) => {
    if (!route) return notFound();
    const { action } = route;
    const { method, path } = request;
    console.debug('[cfwjs]', method, path);
    var response = await action(request);
    if (response instanceof Response)
      return response;
    const headers = {};
    if (typeof response === 'object') {
      headers['Content-Type'] = 'application/json';
      response = JSON.stringify(response);
    }
    return new Response(response, {
      status: 200,
      headers
    });
  };
  const find = (method, path) =>
    routes.find(route =>
      ((method ? route.method === method : true) && (
        route.path instanceof RegExp ? route.path.test(path) : route.path === path
      ))
    );
  const app = event => {
    const { request } = event;
    const { method, url } = request;
    const { pathname, searchParams } = new URL(url);
    request.path = pathname;
    request.query = searchParams;
    const route = find(method, pathname);
    event.respondWith(handle(route, request));
  };
  app.route = (method, path, action) =>
    routes.push({ method, path, action });
  app.get = (path, fn) => app.route('GET', path, fn);
  app.post = (path, fn) => app.route('POST', path, fn);
  return app;
};