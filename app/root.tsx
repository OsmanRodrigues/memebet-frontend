import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError
} from '@remix-run/react';
import type { PropsWithChildren } from 'react';
import { Header } from './components/header';

export function Layout({ children }: PropsWithChildren) {
    return (
        <html>
            <head>
                <link rel="icon" href="data:image/x-icon;base64,AA" />
                <Meta />
                <Links />
            </head>
            <body>
                <Header />
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary() {
    const error = useRouteError() as Error;

    if (isRouteErrorResponse(error)) {
        return (
            <>
                <h1>
                    {error.status} {error.statusText}
                </h1>
                <p>{error.data}</p>
            </>
        );
    }

    return (
        <>
            <h1>Error!</h1>
            <p>{error?.message ?? 'Unknown error'}</p>
        </>
    );
}
