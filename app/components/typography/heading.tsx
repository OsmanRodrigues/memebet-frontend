import { extendVariants } from '@nextui-org/react';
import { useEffect, useState } from 'react';

type HeadingVariants = {
    as: 'h1' | 'h2' | 'h3' | 'h4';
    color: 'primary' | 'secondary' | 'black' | 'white';
};
type HeadingProps = Partial<HeadingVariants> & {
    children: string;
    className?: string;
};

const HeadingBaseComponent = ({ children, ...props }: HeadingProps) => {
    const [variant, setVariant] = useState<
        Required<Pick<HeadingProps, 'as' | 'className'>>
    >({
        className: '',
        as: 'h2'
    });

    useEffect(() => {
        setVariant(prev => ({
            as: props.as ?? prev.as,
            className: props.className ?? prev.className
        }));
    }, [props.as, props.className]);

    return <variant.as className={variant.className}>{children}</variant.as>;
};

export const Heading = extendVariants(HeadingBaseComponent, {
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
        } as Record<HeadingVariants['color'], string>
    },
    defaultVariants: {
        as: 'h2',
        color: 'white'
    }
});
