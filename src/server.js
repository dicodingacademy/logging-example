const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./services/NotesService');
const logger = require('./logger/index');
const ClientError = require('./exceptions/ClientError');
const os = require('os');
require('dotenv').config();

const init = async () => {
  const notesService = new NotesService();

  const server = Hapi.server({
    host: 'localhost',
    port: 3000,
  })

  await server.register(
    {
      plugin: notes,
      options: {
        service: notesService,
      },
    },
  )

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    logger.log('info', `userIP=${request.info.remoteAddress}, host=${os.hostname}, method=${request.method}, path=${request.path}`);
    return h.continue;
  });

  await server.start();
  console.log(`server start at ${server.info.uri}`);
}

init();