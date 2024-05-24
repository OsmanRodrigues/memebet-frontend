import { useFetcher } from '@remix-run/react';

export function LoginForm() {
    const fetcher = useFetcher();

    return (
        <fetcher.Form method="post">
            <button
                name="privateKey"
                value="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
            >
                Login
            </button>
        </fetcher.Form>
    );
}
