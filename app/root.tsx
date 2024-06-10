import type { LinksFunction } from '@remix-run/node';
import type { PropsWithChildren } from 'react';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useLocation,
    useRouteError
} from '@remix-run/react';
import stylesheet from '~/tailwind.css?url';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/header';
import { MainWrapper } from './components/wrapper/main';
import { ErrorFallback } from './components/error-fallback';
import { TransactionsObserverProvider } from './utils/transactions-observer';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet }
];

export function Layout({ children }: PropsWithChildren) {
    const location = useLocation();
    const gradientBg = 'bg-gradient-to-t from-warning to-secondary';
    const isHome = location.pathname === '/';

    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <link rel="icon" href="data:image/x-icon;base64,AA" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Plus+Jakarta+Sans:ital,wght@0,400..700;1,400..700&display=swap"
                    rel="stylesheet"
                />
                <Meta />
                <Links />
            </head>
            <body
                className={`dark text-foreground ${isHome ? gradientBg : 'bg-background'}`}
            >
                <NextUIProvider>
                    <Toaster
                        position="bottom-center"
                        toastOptions={{ duration: 4000 }}
                    />
                    <TransactionsObserverProvider>
                        <Header />
                        <MainWrapper>{children}</MainWrapper>
                    </TransactionsObserverProvider>
                    <ScrollRestoration />
                    <Scripts />
                </NextUIProvider>
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError() as any;

    return (
        <ErrorFallback
            title="Root Error"
            error={error}
            isRouteError={isRouteErrorResponse(error)}
        />
    );
}
