import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import AppRoutes from './route';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store/store';
import AuthProviderGuest from './context/AuthContextGuest';

// Create QueryClient
const queryClient = new QueryClient();

// Create Router with Future Flags
const router = createBrowserRouter(
	[
		{
			path: '/*',
			element: <AppRoutes />,
		},
	],
	{
		future: {
			v7_startTransition: true,
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_skipActionErrorRevalidation: true,
		},
	}
);

function App() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<AuthProviderGuest>
							<RouterProvider router={router} />
						</AuthProviderGuest>
					</PersistGate>
				</Provider>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
