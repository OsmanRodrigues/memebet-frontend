import { Button, NavbarContent, NavbarItem } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { WalletData } from '~/use-cases/wallet/type';
import { useWallet } from '~/use-cases/wallet/use-wallet';
import { WalletItem } from './wallet.item';

export type AuthData = Partial<WalletData>;

export const AuthFetcherKey = 'auth-fetcher';
export enum AuthFormKey {
    address = 'address'
}

export const AuthItem = () => {
    const fetcher = useFetcher<AuthData>({
        key: AuthFetcherKey
    });
    const [wallet, dispatch] = useWallet(fetcher.data?.address, {
        onAddressChange: async newAddress => submitFormData({ newAddress }),
        onDisconnectWallet: async () => submitFormData({ action: 'logout' })
    });
    const isSubmitting = fetcher.state === 'submitting';
    const isFormDisabled =
        wallet.status === 'pending' ||
        isSubmitting ||
        fetcher.state === 'loading';

    const submitFormData = (args: {
        newAddress?: string;
        action?: 'logout';
    }) => {
        const formData = new FormData();

        if (args.action === 'logout') {
            formData.append(args.action, args.action);
        } else if (args.newAddress) {
            formData.append(AuthFormKey.address, args.newAddress);
        } else {
            return;
        }

        fetcher.submit(formData, {
            method: 'POST',
            action: '/resource/auth'
        });
    };
    const onSubmitLogin = () => {
        dispatch.connectWallet();
    };
    const onSubmitLogout = () => {
        dispatch.disconnectWallet(undefined, async () =>
            submitFormData({ action: 'logout' })
        );
    };

    // TODO remove this comment
    // useEffect(() => {
    //     if (wallet.status === 'disconnected')
    //         fetcher.submit(null, {
    //             method: 'GET',
    //             action: '/resource/auth'
    //         });
    // }, []);

    return (
        <NavbarContent justify="end">
            <WalletItem walletState={wallet.status} />
            <NavbarItem>
                <fetcher.Form>
                    <Button
                        isDisabled={isFormDisabled}
                        color={isFormDisabled ? 'danger' : 'default'}
                        variant="flat"
                        onClick={
                            wallet.status === 'connected'
                                ? onSubmitLogout
                                : onSubmitLogin
                        }
                    >
                        {isSubmitting
                            ? 'Logging in...'
                            : wallet.status === 'connected'
                              ? 'Logout'
                              : 'Login'}
                    </Button>
                </fetcher.Form>
            </NavbarItem>
        </NavbarContent>
    );
};
