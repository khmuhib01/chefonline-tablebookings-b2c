// src/App.jsx

import {BrowserRouter} from 'react-router-dom';
import AppRoutes from './route';
import {HelmetProvider} from 'react-helmet-async';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './store/store';
import AuthProviderGuest from './context/AuthContextGuest';

const queryClient = new QueryClient();

function App() {
	return (
		<HelmetProvider>
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<AuthProviderGuest>
							<BrowserRouter>
								<AppRoutes />
							</BrowserRouter>
						</AuthProviderGuest>
					</PersistGate>
				</Provider>
			</QueryClientProvider>
		</HelmetProvider>
	);
}

export default App;
