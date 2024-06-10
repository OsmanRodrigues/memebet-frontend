import { tv } from 'tailwind-variants';

type HeadingVariants = {
    as: 'h1' | 'h2' | 'h3' | 'h4';
    color: 'primary' | 'secondary' | 'black' | 'white';
};
type HeadingProps = Partial<HeadingVariants> & {
    children: string;
    className?: string;
    noPadding?: boolean;
};

export const Heading = ({ children, ...props }: HeadingProps) => {
    const Tag = props.as ?? 'h2';

    return <Tag className={headingVariants(props)}>{children}</Tag>;
};

const headingVariants = tv({
    variants: {
        as: {
            h1: 'py-4 font-bold text-4xl',
            h2: 'py-3 font-medium text-2xl',
            h3: 'py-2 font-normal text-xl',
            h4: 'py-1 font-light text-lg'
        } as Record<HeadingVariants['as'], string>,
        color: {
            primary: 'text-primary',
            secondary: 'text-secondary',
            black: 'text-black',
            white: 'text-white'
        } as Record<HeadingVariants['color'], string>,
        noPadding: {
            true: 'py-0'
        }
    },
    defaultVariants: {
        as: 'h2',
        color: 'white'
    }
});
