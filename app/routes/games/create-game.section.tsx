import { Button, Card, CardFooter, CardHeader, Image } from '@nextui-org/react';

export const CreateGameSection = () => {
    return (
        <section className="py-6">
            <Card className="w-full h-[128px] col-span-12 bg-secondary-400 sm:col-span-5">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny text-gray-300 uppercase font-bold">
                        Governance
                    </p>
                    <h4 className="text-white font-medium text-2xl">
                        DAO member
                    </h4>
                </CardHeader>
                <CardFooter className="absolute bottom-0 z-10 justify-between">
                    <p className="text-gray-200">
                        Create new game to general users betting and spark the
                        hype! 💥
                    </p>
                    <Button
                        className="text-tiny"
                        color="secondary"
                        radius="full"
                        size="sm"
                    >
                        Create game
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
};
