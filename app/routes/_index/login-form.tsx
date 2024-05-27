import type { FetcherWithComponents } from '@remix-run/react';
import type { WalletStatus } from '~/use-cases/wallet/use-wallet';

type LoginFormProps = {
    fetcher: FetcherWithComponents<any>;
    onLogin: () => void;
    onLogout: () => void;
    error?: any;
    walletStatus?: WalletStatus;
};

export enum LoginFormKey {
    address = 'address'
}

export function LoginForm({
    fetcher,
    error,
    walletStatus,
    onLogin,
    onLogout
}: LoginFormProps) {
    console.log('fetcher.state, walletStatus ->', fetcher.state, walletStatus);
    const isSubmitting = fetcher.state === 'submitting';
    const isFormDisabled =
        walletStatus === 'pending' ||
        isSubmitting ||
        fetcher.state === 'loading';

    //TODO try better error feedback
    if (error) throw new Error(error);

    return (
        <fetcher.Form>
            <button
                disabled={isFormDisabled}
                onClick={walletStatus === 'connected' ? onLogout : onLogin}
            >
                {isSubmitting
                    ? 'Submitting...'
                    : walletStatus === 'connected'
                      ? 'Logout'
                      : 'Login'}
            </button>
        </fetcher.Form>
    );
}
