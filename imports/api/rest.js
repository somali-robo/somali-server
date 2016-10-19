import { Restivus } from 'meteor/nimble:restivus';
import Messages from './db/messages';

export const Api = new Restivus({
  prettyJson: true,
});

Api.addRoute('hello', {
  get: {
    action: function() {
      return {
        status: 'success',
        data: {
          message: 'Hello, REST API!',
        },
      };
    },
  },
});

Api.addRoute('messages', {
  // GET /api/messages
  get: {
    action: function() {
      return {
        status: 'success',
        data: Messages.find().fetch(),
      };
    },
  },
  // POST /api/messages
  post: {
    action: function() {
      const { subject, body } = this.bodyParams;
      const message = {
        subject,
        body,
        createdAt: new Date(),
      };
      const res = Messages.insert(message);
      return {
        status: 'success',
        data: Messages.findOne(res),
      };
    },
  },
});

export default Api;
