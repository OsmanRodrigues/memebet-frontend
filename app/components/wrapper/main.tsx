import type { PropsWithChildren } from 'react';

export const MainWrapper = ({ children }: PropsWithChildren) => (
    <main className="min-h-screen px-8">{children}</main>
);
