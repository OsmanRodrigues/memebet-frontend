import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    DateInput,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
    useDisclosure
} from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';

export type CreateGameFetcherData = Omit<
    CreateValidationFunctionArgs & CreateGameArgs,
    'signerAddress' | 'provider' | 'validatorFunctionName'
>;

const CreateGameFetcherKey = 'create-game-fetcher';
const fetcherFormKey: Record<
    keyof CreateGameFetcherData,
    keyof CreateGameFetcherData
> = {
    functionName: 'functionName',
    functionCode: 'functionCode',
    home: 'home',
    away: 'away',
    token: 'token',
    start: 'start',
    end: 'end'
};

export const CreateGameSection = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                        Create new game for general users betting and spark the
                        hype! 💥
                    </p>
                    <Button
                        className="text-tiny"
                        color="secondary"
                        radius="full"
                        size="sm"
                        onClick={onOpen}
                    >
                        Create game
                    </Button>
                </CardFooter>
            </Card>
            <CreateGameModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </section>
    );
};
const CreateGameModal = (
    props: Pick<ModalProps, 'isOpen' | 'onOpenChange'>
) => {
    const fetcher = useFetcher<CreateGameFetcherData>({
        key: CreateGameFetcherKey
    });

    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            placement="top-center"
            backdrop="blur"
        >
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Create game
                        </ModalHeader>
                        <fetcher.Form method="POST" action="/resource/game">
                            <ModalBody>
                                <h3>Validation function</h3>
                                <Input
                                    name={fetcherFormKey.functionName}
                                    autoFocus
                                    label="Name"
                                    placeholder="Enter function name"
                                    variant="bordered"
                                />
                                <Input
                                    name={fetcherFormKey.functionCode}
                                    label="Code"
                                    placeholder="Enter function code"
                                    variant="bordered"
                                />
                                <Divider />
                                <h3>Game infos</h3>
                                <Input
                                    name={fetcherFormKey.home}
                                    label="Home pick"
                                    placeholder="Enter the first betting pick option"
                                    variant="bordered"
                                />
                                <Input
                                    name={fetcherFormKey.away}
                                    label="Away pick"
                                    placeholder="Enter the second betting pick option"
                                    variant="bordered"
                                />
                                <Input
                                    name={fetcherFormKey.token}
                                    label="Token"
                                    placeholder="Enter the token used to betting"
                                    variant="bordered"
                                />
                                <DateInput
                                    name={fetcherFormKey.start}
                                    label="Betting starts at"
                                    variant="bordered"
                                    granularity="minute"
                                />
                                <DateInput
                                    name={fetcherFormKey.end}
                                    label="Betting deadline"
                                    variant="bordered"
                                    granularity="minute"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button color="secondary" type="submit">
                                    Create
                                </Button>
                            </ModalFooter>
                        </fetcher.Form>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
