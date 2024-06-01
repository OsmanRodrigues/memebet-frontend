import { Button } from '@nextui-org/react';
import { useNavigate } from '@remix-run/react';

export const ErrorFallback = ({
    error,
    title,
    isRouteError
}: {
    error: any;
    title?: string;
    isRouteError?: boolean;
}) => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center">
            <div className="text-center">
                {isRouteError ? (
                    <>
                        {title?.length && <h1>{title}</h1>}
                        <h2>
                            {error.status} {error.statusText}
                        </h2>
                        <p>{error.data}</p>
                    </>
                ) : (
                    <>
                        <h1>{title?.length ? title : 'Error!'}</h1>
                        <p>
                            {error?.message ?? error?.error ?? 'Unknown error'}
                        </p>
                    </>
                )}
                <div>
                    <Button
                        variant="light"
                        color="primary"
                        onClick={() => navigate(-1)}
                    >
                        Go back
                    </Button>
                    or
                    <Button
                        variant="light"
                        color="primary"
                        onClick={() => navigate('/')}
                    >
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    );
};
