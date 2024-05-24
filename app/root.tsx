import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node';
import { auth } from './cookies';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    useFetcher,
    useLoaderData
} from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await auth.parse(cookieHeader)) || {};

    return json({ privateKey: cookie.privateKey });
}

export default function App() {
    const fetcher = useFetcher();
    let { privateKey } = useLoaderData<typeof loader>();

    if (fetcher.formData?.has('privateKey')) {
        privateKey = fetcher.formData.get('privateKey');
    }

    return (
        <html>
            <head>
                <link rel="icon" href="data:image/x-icon;base64,AA" />
                <Meta />
                <Links />
            </head>
            <body>
                <h1>Hello world! Private key:{privateKey ?? 'not provided'}</h1>
                <Outlet />
                <fetcher.Form method="post">
                    <button
                        name="privateKey"
                        value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                    >
                        Login
                    </button>
                </fetcher.Form>
                <Scripts />
            </body>
        </html>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await auth.parse(cookieHeader)) || {};
    const formData = await request.formData();

    const privateKey = formData.get('privateKey');
    cookie.privateKey = privateKey;

    return json(privateKey, {
        headers: { 'Set-Cookie': await auth.serialize(cookie) }
    });
}
