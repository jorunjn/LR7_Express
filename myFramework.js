const http = require('http');
const { parse } = require('url'); 

function createApp() {

  const routes = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: []
  };


  const middlewares = [];

  function registerRoute(method, path, handler) {
    if (!routes[method]) {
      routes[method] = [];
    }
    routes[method].push({ path, handler });
  }

  function matchPath(routePath, requestPath) {
    const routeSegments = routePath.split('/').filter(Boolean);
    const reqSegments = requestPath.split('/').filter(Boolean);

    if (routeSegments.length !== reqSegments.length) {
      return null; 
    }

    const params = {};

    for (let i = 0; i < routeSegments.length; i++) {
      const routeSegment = routeSegments[i];
      const reqSegment = reqSegments[i];

      if (routeSegment.startsWith(':')) {
        const paramName = routeSegment.slice(1);
        params[paramName] = reqSegment;
      } else if (routeSegment !== reqSegment) {
        return null;
      }
    }

    return params; 
  }

  function handleRequest(req, res) {
    const parsedUrl = parse(req.url, true);
    const query = parsedUrl.query;
    const pathname = parsedUrl.pathname;

    req.query = query;
    req.params = {};
    req.body = null;

    res.statusCode = 200; 
    res.status = function (code) {
      res.statusCode = code;
      return res;
    };

    res.send = function (data) {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }
      res.end(data);
    };

    res.json = function (obj) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(obj));
    };

    const method = req.method.toUpperCase();
    const potentialRoutes = routes[method] || [];
    let matchedRoute = null;
    let params = null;

    for (let routeObj of potentialRoutes) {
      params = matchPath(routeObj.path, pathname);
      if (params) {
        matchedRoute = routeObj;
        break;
      }
    }

    function finalRouteHandler() {
      if (!matchedRoute) {
        res.status(404).send(`Cannot ${method} ${pathname}`);
      } else {
        req.params = params;
        matchedRoute.handler(req, res);
      }
    }

    const bodyChunks = [];
    if (method !== 'GET' && method !== 'DELETE') {
      req.on('data', (chunk) => {
        bodyChunks.push(chunk);
      });
      req.on('end', () => {
        if (bodyChunks.length > 0) {
          const rawBody = Buffer.concat(bodyChunks).toString();
          try {
            req.body = JSON.parse(rawBody);
          } catch (err) {
            req.body = rawBody;
          }
        }
        runMiddlewares(0);
      });
    } else {
      runMiddlewares(0);
    }

    function runMiddlewares(index, err) {
      if (err || index === middlewares.length) {
        if (err) {
          return handleError(err, req, res);
        }
        return finalRouteHandler();
      }

      const mw = middlewares[index];
      try {
        mw(req, res, function next(mwError) {
          if (mwError) {
            runMiddlewares(middlewares.length, mwError);
          } else {
            runMiddlewares(index + 1);
          }
        });
      } catch (error) {
        runMiddlewares(middlewares.length, error);
      }
    }
  }
  function handleError(err, req, res) {
    res.status(500).send('Internal Server Error: ' + err.message);
  }

  function get(path, handler) {
    registerRoute('GET', path, handler);
  }

  function post(path, handler) {
    registerRoute('POST', path, handler);
  }

  function put(path, handler) {
    registerRoute('PUT', path, handler);
  }

  function patch(path, handler) {
    registerRoute('PATCH', path, handler);
  }

  function del(path, handler) {
    registerRoute('DELETE', path, handler);
  }

  function use(mw) {
    middlewares.push(mw);
  }

  function listen(port, callback) {
    const server = http.createServer(handleRequest);
    server.listen(port, callback);
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    use,
    listen
  };
}
module.exports = createApp;
