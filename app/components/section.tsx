import type { PropsWithChildren } from 'react';

export type SectionWrapperProps = PropsWithChildren<{
    isFirstOfPage?: boolean;
}>;

export const SectionWrapper = ({
    children,
    isFirstOfPage
}: SectionWrapperProps) => (
    <section className={isFirstOfPage ? 'pt-6 pb-4' : 'py-4'}>
        {children}
    </section>
);
