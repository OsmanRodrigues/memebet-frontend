import type { PropsWithChildren } from 'react';

export const MainWrapper = ({ children }: PropsWithChildren) => (
    <main className="min-h-screen px-14 mobile:px-8">{children}</main>
);
