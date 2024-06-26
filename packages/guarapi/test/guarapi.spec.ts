import http, { Server } from 'node:http';
import http2, { Http2Server } from 'node:http2';
import guarapi, { createServer, middlewarePlugin, nextPipeline } from '../src/index';
import { generateCertificates, request } from './utils';
import type { GuarapiConfig, Plugin, ServerOptions } from '../src/types';

describe('Guarapi', () => {
  const env = process.env;
  const { certPem, keyPem } = generateCertificates();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
    process.env = { ...env };
  });

  afterEach(() => {
    process.env = env;
  });

  it('should create app without config', () => {
    const app = guarapi();

    expect(app).toHaveProperty('logger');
    expect(app).toHaveProperty('listen');
  });

  it('should create app with empty config object', () => {
    const config: GuarapiConfig = {};
    const app = guarapi(config);

    expect(app).toHaveProperty('logger');
    expect(app).toHaveProperty('listen');
  });

  it('should create app with custom log', () => {
    const config: GuarapiConfig = {};
    const app = guarapi(config);

    expect(app).toHaveProperty('logger');
    expect(app).toHaveProperty('listen');
  });

  it('should app call listen callback', () => {
    const config: GuarapiConfig = {};
    const app = guarapi(config);
    const listenCallback = jest.fn();
    const server = {
      listen: jest.fn((_port?: number, _host?: string, cb?: () => void) => cb && cb()),
    };

    jest.spyOn(http, 'createServer').mockImplementation(() => server as unknown as Server);
    jest.spyOn(http2, 'createServer').mockImplementation(() => server as unknown as Http2Server);

    app.listen(3000, '0.0.0.0', listenCallback);

    expect(listenCallback).toBeCalled();
  });

  it('should app call listen and close callbacks', () => {
    const app = guarapi();
    const listenCallback = jest.fn();
    const closeCallback = jest.fn();
    const server = {
      listen: jest.fn((_port?: number, _host?: string, cb?: () => void) => cb && cb()),
      close: jest.fn((cb?: () => void) => cb && cb()),
    };

    jest.spyOn(http, 'createServer').mockImplementation(() => server as unknown as Server);
    jest.spyOn(http2, 'createServer').mockImplementation(() => server as unknown as Http2Server);

    app.listen(3000, '0.0.0.0', listenCallback);
    app.close(closeCallback);

    expect(listenCallback).toBeCalled();
    expect(closeCallback).toBeCalled();
  });

  it('should call all plugins pre/post in request handler pipeline', async () => {
    const app = guarapi();
    const server = createServer({}, app);

    const pluginOne = jest.fn();

    const pluginTwoPreHandler = jest.fn();
    const pluginTwo: Plugin = () => ({
      name: 'Plugin Two',
      pre: (req, res, next) => {
        pluginTwoPreHandler();
        next();
      },
    });

    const pluginThreePostHandler = jest.fn();
    const pluginThree: Plugin = () => ({
      name: 'Plugin Three',
      post: (req, res, next) => {
        pluginThreePostHandler();
        next();
      },
    });

    app.plugin(pluginThree);
    app.plugin(pluginTwo);
    app.plugin(pluginOne);

    app.plugin(middlewarePlugin);
    app.use(async (req, res) => {
      res.end('ok');
    });
    await request(server).get('/');

    expect(pluginThreePostHandler).toHaveBeenCalledTimes(1);
    expect(pluginTwoPreHandler).toHaveBeenCalledTimes(1);
    expect(pluginOne).toHaveBeenCalledTimes(1);
  });

  it('should app throw err trying to use plugins not applyed', () => {
    const app = guarapi();

    expect(() => app.logger('info', 'No info')).toThrow();
    expect(() => app.use(() => {})).toThrow();
  });

  it('should app works with https server', async () => {
    const serverOptions = { isSSL: true, cert: certPem, key: keyPem };
    const app = guarapi();
    const server = createServer(serverOptions, app);
    const httpVersion = jest.fn();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    app.plugin(middlewarePlugin);
    app.use((req, res) => {
      httpVersion(req.httpVersion);
      res.end('ok');
    });

    await request(server).get('/').set('Host', 'localhost');

    expect(httpVersion).toHaveBeenCalledWith('1.1');
  });

  it('should app works with http2 ssl server', async () => {
    const serverOptions: ServerOptions = { isHTTP2: true, isSSL: true, cert: certPem, key: keyPem };
    const app = guarapi();
    const server = createServer(serverOptions, app);
    const httpVersion = jest.fn();

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    app.plugin(middlewarePlugin);
    app.use((req, res) => {
      httpVersion(req.httpVersion);
      res.end('ok');
    });

    await request(server, { http2: true }).get('/').set('Host', 'localhost');

    expect(httpVersion).toHaveBeenCalledWith('2.0');
  });

  it('should respond with json', async () => {
    const app = guarapi();
    const server = createServer({}, app);

    app.plugin(middlewarePlugin);

    app.use((req, res) => {
      res.json({ ok: true });
    });

    await request(server).get('/').expect('Content-Type', /json/).expect(200, { ok: true });
  });

  it('should respond with status 401', async () => {
    const app = guarapi();
    const server = createServer({}, app);

    app.plugin(middlewarePlugin);

    app.use((req, res) => {
      res.status(401).end('Unauthorized');
    });

    await request(server).get('/').expect(401, 'Unauthorized');
  });

  it('should handle plugin rejection', async () => {
    const app = guarapi();
    const server = createServer({}, app);

    app.plugin(() => {
      return {
        name: 'unhandledSyncThrow',
        pre: (_req, _res, _next) => {
          throw new Error('Oh no');
        },
        error: (error, req, res) => {
          nextPipeline([], req, res, error, (err) => {
            res.status(500).end((err as Error).message);
          });
        },
      };
    });

    await request(server).get('/').expect(500, 'Oh no');
  });

  it('should handle final rejection', async () => {
    const app = guarapi();
    const server = createServer({}, app);

    app.plugin(() => {
      return {
        name: 'unhandledSyncThrow',
        pre: (_req, _res, _next) => {
          throw new Error('Oh no');
        },
        error: (error, req, res, next) => {
          nextPipeline([], req, res, error, next);
        },
      };
    });

    await request(server).get('/').expect(500, 'Internal Server Error');
  });
});
