import type { LinksFunction } from '@remix-run/node';
import type { PropsWithChildren } from 'react';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    isRouteErrorResponse,
    useRouteError
} from '@remix-run/react';
import stylesheet from '~/tailwind.css?url';
import { NextUIProvider } from '@nextui-org/react';
import { Header } from './components/header';
import { Main } from './components/main';
import { Toaster } from 'react-hot-toast';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: stylesheet }
];

export function Layout({ children }: PropsWithChildren) {
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
            <body className="dark text-foreground bg-background">
                <NextUIProvider>
                    <Header />
                    <Toaster position="bottom-center" />
                    <Main>{children}</Main>
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
