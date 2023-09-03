import http from 'node:http';
import request from 'supertest';
import guarapi, { middleware } from '../../src';

describe('Guarapi - plugins/middleware', () => {
  const buildApp = () => {
    const app = guarapi();
    const server = http.createServer(app);

    app.plugin(middleware);

    return { app, server };
  };

  beforeAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should run pipeline', async () => {
    const { app, server } = buildApp();
    const middlewareOne = jest.fn();
    const middlewareTwo = jest.fn();

    app.use((req, res, next) => {
      middlewareOne();
      next();
    });

    app.use((req, res, next) => {
      middlewareTwo();
      next();
    });

    app.use(async (req, res) => {
      res.end('ok');
    });

    await request(server).get('/');

    expect(middlewareOne).toBeCalledTimes(1);
    expect(middlewareTwo).toBeCalledTimes(1);
  });

  it('should run pipeline with throw error handle', async () => {
    const { app, server } = buildApp();
    const middlewareOne = jest.fn();
    const middlewareTwo = jest.fn();
    const middlewareThree = jest.fn();
    const middlewareFour = jest.fn();

    app.use((req, res, next) => {
      middlewareOne();
      next();
    });

    app.use((_req, _res, _next) => {
      throw new Error('Unexpected error');
    });

    app.use((req, res, next) => {
      middlewareTwo();
      next();
    });

    app.use((req, res) => {
      middlewareThree();
      res.end('ok');
    });

    app.use((error, req, res, _next) => {
      middlewareFour();
      res.end('ERROR');
    });

    await request(server).get('/');

    expect(middlewareOne).toBeCalledTimes(1);
    expect(middlewareTwo).not.toBeCalledTimes(1);
    expect(middlewareThree).not.toBeCalledTimes(1);
    expect(middlewareFour).toBeCalledTimes(1);
  });

  it('should run pipeline with next param error handle', async () => {
    const { app, server } = buildApp();
    const middlewareOne = jest.fn();
    const middlewareTwo = jest.fn();
    const middlewareThree = jest.fn();
    const middlewareFour = jest.fn();

    app.use((req, res, next) => {
      middlewareOne();
      next();
    });

    app.use((_req, _res, next) => {
      next(new Error('Unexpected error'));
    });

    app.use((req, res, next) => {
      middlewareTwo();
      next();
    });

    app.use((req, res) => {
      middlewareThree();
      res.end('ok');
    });

    app.use((error, req, res, _next) => {
      middlewareFour();
      res.end('ERROR');
    });

    await request(server).get('/');

    expect(middlewareOne).toBeCalledTimes(1);
    expect(middlewareTwo).not.toBeCalledTimes(1);
    expect(middlewareThree).not.toBeCalledTimes(1);
    expect(middlewareFour).toBeCalledTimes(1);
  });
});