import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { LoginForm, LoginFormKey } from './login-form';
import * as walletUseCase from '~/use-cases/wallet';
import { useWallet } from '~/use-cases/wallet/use-wallet';

export async function loader({ request }: LoaderFunctionArgs) {
    const wallet = await walletUseCase.getWallet(request);

    return json({
        wallet
    });
}

export default function Home() {
    const fetcher = useFetcher();
    const loaderData = useLoaderData<typeof loader>();
    const [wallet, dispatch] = useWallet();

    let address = loaderData.wallet.address;

    if (fetcher.formData?.has(LoginFormKey.address)) {
        address = fetcher.formData.get(LoginFormKey.address) as string;
    }

    const onSubmitLogin = () => {
        dispatch
            .connectWallet({
                onAccountsChange: async (accounts: string[]) => {
                    const formData = new FormData();
                    formData.append(LoginFormKey.address, accounts[0]);
                    fetcher.submit(formData, { method: 'POST' });
                }
            })
            .then(accounts => {
                const formData = new FormData();
                formData.append(LoginFormKey.address, accounts[0]);
                fetcher.submit(formData, { method: 'POST' });
            });
    };

    return (
        <>
            <h1>Hello world! Private key:{address ?? 'not provided'}</h1>
            <h1>
                Current balance:{' '}
                {loaderData.wallet.ethBalance ?? 'not informed'}
            </h1>
            <LoginForm
                fetcher={fetcher}
                onSubmit={onSubmitLogin}
                isPending={wallet.status === 'pending'}
                error={wallet.error}
            />
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
