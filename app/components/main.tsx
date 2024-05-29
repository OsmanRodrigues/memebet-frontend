import type { PropsWithChildren } from 'react';

export const Main = ({ children }: PropsWithChildren) => (
    <main className="min-h-screen px-8">{children}</main>
);
