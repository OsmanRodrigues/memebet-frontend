import { useFetcher, useSubmit } from '@remix-run/react';
import { useWallet } from './use-wallet';

export function LoginForm() {
    const [wallet, dispatch] = useWallet();
    const fetcher = useFetcher();
    const submit = useSubmit();
    const isSubmitting = fetcher.state === 'submitting';
    const isPending = wallet.status === 'pending' || isSubmitting;

    //TODO try better error feedback
    if (wallet.error) throw new Error(wallet.error);

    return (
        <fetcher.Form>
            <button
                disabled={isPending || fetcher.state === 'loading'}
                onClick={() =>
                    dispatch.getAccount().then(accounts => {
                        const formData = new FormData();
                        formData.append('privateKey', accounts[0]);
                        submit(formData, { method: 'POST' });
                    })
                }
            >
                {isSubmitting ? 'Submitting...' : 'Login'}
            </button>
        </fetcher.Form>
    );
}
