# WunderGraph subscriptions example - hooks

### Configuration

The best way to understand how to use subscriptions hooks is to play with the configuration.

```typescript
// wundergraph.config.ts
const counter = introspect.graphql({
  id: 'counter',
  apiNamespace: 'ws',
  loadSchemaFromString: schema,
  url: 'http://localhost:4000/graphql',
});

configureWunderGraphApplication({
  apis: [counter],
});
```

```typescript
// wundergraph.server.ts
export default configureWunderGraphServer(() => ({
  hooks: {
    global: {
      wsTransport: {
        onConnectionInit: {
          // counter is the id of the introspected api (data source id), defined in the wundergraph.config.ts
          enableForDataSources: ['counter'],
          hook: async (hook) => {
            let token = hook.clientRequest.headers.get('Authorization') || '';
            // we can have a different logic for each data source
            if (hook.dataSourceId === 'counter') {
              token = 'secret';
            }
            return {
              // this payload will be passed to the ws `connection_init` message payload
              // {"type": "connection_init", "payload": {"Authorization": "secret"}}
              payload: {
                Authorization: token,
              },
            };
          },
        },
      },
    },
    queries: {},
    mutations: {},
    subscriptions: {
      // .wundergraph/operations/Ws.graphql
      Ws: {
        mutatingPreResolve: async (hook) => {
          // here we modify the input before request is sent to the data source
          hook.input.from = 7;
          return hook.input;
        },
        postResolve: async (hook) => {
          // here we log the response we got from the ws server (not the modified one)
          hook.log.info(`postResolve hook: ${hook.response.data!.ws_countdown}`);
        },
        mutatingPostResolve: async (hook) => {
          // here we modify the response before it gets sent to the client
          let count = hook.response.data!.ws_countdown!;
          count++;
          hook.response.data!.ws_countdown = count;
          return hook.response;
        },
        preResolve: async (hook) => {
          // here we log the request input
          /**
           * // .wundergraph/operations/Ws.graphql
           * subscription($from: Int!) {
           * 	ws_countdown(from: $from)
           * }
           */
          hook.log.info(`preResolve hook input, counter starts from: ${hook.input.from}`);
        },
      },
    },
  },
  graphqlServers: [],
}));
```

#### Getting started

```shell
npm install && npm start
```

#### Check results

```shell
curl -N 'http://localhost:9991/operations/Ws?from=5'
```

- Check the output.
- Check the logs to see the hooks being executed.

#### TS operation

```shell
curl -N http://localhost:9991/operations/users/get?id=1
```

## Learn More

Read the [Docs](https://wundergraph.com/docs).

## Got Questions?

Join us on [Discord](https://wundergraph.com/discord)!
