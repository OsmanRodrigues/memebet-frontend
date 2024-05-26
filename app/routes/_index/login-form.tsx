import type { FetcherWithComponents } from '@remix-run/react';

type LoginFormProps = {
    fetcher: FetcherWithComponents<any>;
    onSubmit: () => void;
    error?: any;
    isPending?: boolean;
};

export enum LoginFormKey {
    address = 'address'
}

export function LoginForm({
    fetcher,
    error,
    isPending,
    onSubmit
}: LoginFormProps) {
    const isSubmitting = fetcher.state === 'submitting';
    const isFormPending = isPending || isSubmitting;

    //TODO try better error feedback
    if (error) throw new Error(error);

    return (
        <fetcher.Form>
            <button
                disabled={isFormPending || fetcher.state === 'loading'}
                onClick={onSubmit}
            >
                {isSubmitting ? 'Submitting...' : 'Login'}
            </button>
        </fetcher.Form>
    );
}
