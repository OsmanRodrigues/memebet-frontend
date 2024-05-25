import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { auth } from '../../cookies';
import { LoginForm } from './login-form';

export async function loader({ request }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await auth.parse(cookieHeader)) || {};

    return json({ privateKey: cookie.privateKey });
}

export default function Home() {
    const fetcher = useFetcher();
    let { privateKey } = useLoaderData<typeof loader>();

    if (fetcher.formData?.has('privateKey')) {
        privateKey = fetcher.formData.get('privateKey');
    }

    return (
        <>
            <h1>Hello world! Private key:{privateKey ?? 'not provided'}</h1>
            <LoginForm />
        </>
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