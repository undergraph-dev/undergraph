import { configureWunderGraphOperations } from '@bff-backup/sdk';

export default configureWunderGraphOperations({
	operations: {
		defaultConfig: {
			authentication: {
				required: false,
			},
		},
		queries: (config) => ({
			...config,
			caching: {
				enable: false,
				staleWhileRevalidate: 60,
				maxAge: 60,
				public: true,
			},
			liveQuery: {
				enable: true,
				pollingIntervalSeconds: 1,
			},
		}),
		mutations: (config) => ({
			...config,
		}),
		subscriptions: (config) => ({
			...config,
		}),
		custom: {
			ProtectedWeather: (config) => ({
				...config,
				authentication: {
					required: true,
				},
			}),
			PastLaunches: (config) => ({
				...config,
				caching: {
					...config.caching,
					enable: true,
				},
			}),
		},
	},
});
