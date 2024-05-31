import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    DateInput,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
    Textarea,
    useDisclosure
} from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import type {
    CreateGameArgs,
    CreateValidationFunctionArgs
} from '~/services/governance/type';

export type CreateFunctionFetcherData = Omit<
    CreateValidationFunctionArgs,
    'signerAddress' | 'provider'
>;
export type CreateGameFetcherData = Omit<
    CreateGameArgs,
    'signerAddress' | 'provider'
>;

const CreateFunctionFetcherKey = 'create-function-fetcher';
const CreateGameFetcherKey = 'create-game-fetcher';
const createFunctionFetcherFormKey: Record<
    keyof CreateFunctionFetcherData,
    keyof CreateFunctionFetcherData
> = {
    functionCode: 'functionCode',
    functionName: 'functionName'
};
const createGameFetcherFormKey: Record<
    keyof CreateGameFetcherData,
    keyof CreateGameFetcherData
> = {
    home: 'home',
    away: 'away',
    token: 'token',
    start: 'start',
    end: 'end',
    validatorFunctionName: 'validatorFunctionName'
};

export const CreateGameSection = () => {
    const createFunctionModal = useDisclosure();
    const createGameModal = useDisclosure();

    return (
        <section className="py-6">
            <Card className="w-full h-[128px] col-span-12 bg-secondary-400 mobile:h-[176px]">
                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                    <p className="text-tiny text-gray-300 uppercase font-bold">
                        Governance
                    </p>
                    <h4 className="text-white font-medium text-2xl">
                        DAO member
                    </h4>
                </CardHeader>
                <CardFooter className="absolute bottom-0 z-10 justify-between mobile:flex-col">
                    <p className="text-gray-200">
                        Create a validation function or a new game for general
                        users and let the betting happen! 💥
                    </p>
                    <div className="flex flex-row justify-end gap-2 mobile:w-full">
                        <CTAButton
                            onClick={createFunctionModal.onOpen}
                            text="New function"
                        />
                        <span>or</span>
                        <CTAButton
                            onClick={createGameModal.onOpen}
                            text="New game"
                        />
                    </div>
                </CardFooter>
            </Card>
            <CreateFunctionModal
                isOpen={createFunctionModal.isOpen}
                onOpenChange={createFunctionModal.onOpenChange}
            />
            <CreateGameModal
                isOpen={createGameModal.isOpen}
                onOpenChange={createGameModal.onOpenChange}
            />
        </section>
    );
};
const CTAButton = (props: { text: string; onClick: () => void }) => (
    <Button
        className="text-tiny"
        color="secondary"
        radius="full"
        size="sm"
        onClick={props.onClick}
    >
        {props.text}
    </Button>
);
const ModalDefault = (
    props: Pick<
        ModalProps,
        'isOpen' | 'onOpenChange' | 'children' | 'title' | 'key'
    >
) => {
    const fetcher = useFetcher({
        key: props.key ? props.key.toString() : undefined
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
                            {props.title}
                        </ModalHeader>
                        <fetcher.Form method="POST" action="/resource/game">
                            <ModalBody>{props.children}</ModalBody>
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
const CreateFunctionModal = (
    props: Pick<ModalProps, 'isOpen' | 'onOpenChange'>
) => {
    return (
        <ModalDefault
            title="Create function"
            key={CreateFunctionFetcherKey}
            {...props}
        >
            <Input
                isRequired
                required
                name={createFunctionFetcherFormKey.functionName}
                autoFocus
                label="Name"
                placeholder="Enter function name"
                variant="bordered"
            />
            <Textarea
                isRequired
                required
                name={createFunctionFetcherFormKey.functionCode}
                label="Code"
                placeholder="Enter function code"
                variant="bordered"
                classNames={{
                    base: 'w-full',
                    input: 'resize-y min-h-[64px]'
                }}
                disableAnimation
                disableAutosize
            />
        </ModalDefault>
    );
};
const CreateGameModal = (
    props: Pick<ModalProps, 'isOpen' | 'onOpenChange'>
) => {
    return (
        <ModalDefault title="Create game" key={CreateGameFetcherKey} {...props}>
            <Input
                isRequired
                required
                name={createGameFetcherFormKey.home}
                label="Home pick"
                placeholder="Enter the first betting pick option"
                variant="bordered"
            />
            <Input
                isRequired
                required
                name={createGameFetcherFormKey.away}
                label="Away pick"
                placeholder="Enter the second betting pick option"
                variant="bordered"
            />
            <Input
                isRequired
                required
                name={createGameFetcherFormKey.token}
                label="Token"
                placeholder="Enter the token used to betting"
                variant="bordered"
            />
            <DateInput
                isRequired
                name={createGameFetcherFormKey.start}
                label="Betting starts at"
                variant="bordered"
                granularity="minute"
            />
            <DateInput
                isRequired
                name={createGameFetcherFormKey.end}
                label="Betting deadline"
                variant="bordered"
                granularity="minute"
            />
            <Input
                isRequired
                required
                name={createGameFetcherFormKey.validatorFunctionName}
                label="Function name"
                placeholder="Enter the validation function name"
                variant="bordered"
            />
        </ModalDefault>
    );
};
