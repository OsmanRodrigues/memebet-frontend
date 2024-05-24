import { useFetcher, useSubmit } from '@remix-run/react';
import { useWallet } from './use-wallet';

export function LoginForm() {
    const [wallet, dispatch] = useWallet();
    const fetcher = useFetcher();
    const submit = useSubmit();

    //TODO try better error feedback
    if (wallet.error) throw new Error(wallet.error);

    return (
        <fetcher.Form>
            <button
                onClick={() =>
                    dispatch.getAccount().then(accounts => {
                        const formData = new FormData();
                        formData.append('privateKey', accounts[0]);
                        submit(formData, { method: 'POST' });
                    })
                }
            >
                Login
            </button>
        </fetcher.Form>
    );
}
