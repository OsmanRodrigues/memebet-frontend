import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoginForm, LoginFormKey } from './login-form';
import * as walletUseCase from '~/use-cases/wallet';

export async function loader({ request }: LoaderFunctionArgs) {
    const wallet = await walletUseCase.getWallet(request);

    return json({
        wallet
    });
}

export default function Home() {
    const fetcher = useFetcher();
    const { wallet } = useLoaderData<typeof loader>();
    let address = wallet.address;

    if (fetcher.formData?.has(LoginFormKey.address)) {
        address = fetcher.formData.get(LoginFormKey.address) as string;
    }

    return (
        <>
            <h1>Hello world! Private key:{address ?? 'not provided'}</h1>
            <h1>Current balance: {wallet.ethBalance ?? 'not informed'}</h1>
            <LoginForm />
        </>
    );
}

export async function action({ request }: ActionFunctionArgs) {
    const { cookie, serializedCookie } =
        await walletUseCase.handleSubmitWalletAddress(request);

    return json(cookie, {
        headers: { 'Set-Cookie': serializedCookie }
    });
}
