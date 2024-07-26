import { useEffect } from 'react';
import { useFetcher, useNavigate } from '@remix-run/react';
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    DateInput,
    Input,
    ModalProps,
    Textarea,
    useDisclosure
} from '@nextui-org/react';
import { SectionWrapper } from '~/components/wrapper/section';
import { ActionModal } from '~/components/portal/action-modal';
import { useTransactionsObserver } from '~/utils/transactions-observer';
import toast from 'react-hot-toast';

import type {
    CreateFunctionData,
    CreateGameData
} from '~/use-cases/governance/type';

export type CreateFunctionFetcherData = CreateFunctionData;
export type CreateGameFetcherData = CreateGameData;

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
    title: 'title',
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
        <SectionWrapper isFirstOfPage>
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
        </SectionWrapper>
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
        'isOpen' | 'onOpenChange' | 'children' | 'title'
    > & { fetcherKey: string }
) => {
    const transactionsObserver = useTransactionsObserver();
    const fetcher = useFetcher<any>({
        key: props.fetcherKey
    });
    const navigate = useNavigate();
    const isPending = fetcher.state !== 'idle';

    useEffect(() => {
        if (fetcher.data?.ok) {
            transactionsObserver?.notify?.(
                fetcher.data.data.transactionHash,
                async () => {
                    toast.success(
                        props.fetcherKey === CreateFunctionFetcherKey
                            ? 'Function created successfully!'
                            : 'Game created successfully!'
                    );
                    if (fetcher.data?.refetch)
                        navigate({
                            pathname: '/games',
                            search: '?refetch=true'
                        });
                }
            );
            toast.success('Creation request sent!');
            fetcher.submit(null, {
                action: '/resource/game?reset=true',
                method: 'POST'
            });
            props.onOpenChange?.(false);
        } else if (fetcher.data?.error) toast.error(fetcher.data.error);
    }, [fetcher.data]);

    return (
        <ActionModal
            title={props.title}
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            action="/resource/game"
            method="POST"
            fetcherForm={fetcher.Form}
            isPending={isPending}
            actionLabel={
                fetcher.state === 'submitting' ? 'Creating...' : 'Create'
            }
        >
            {props.children}
        </ActionModal>
    );
};
const CreateFunctionModal = (
    props: Pick<ModalProps, 'isOpen' | 'onOpenChange'>
) => {
    return (
        <ModalDefault
            title="Create function"
            fetcherKey={CreateFunctionFetcherKey}
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
        <ModalDefault
            title="Create game"
            fetcherKey={CreateGameFetcherKey}
            {...props}
        >
            <Input
                isRequired
                required
                name={createGameFetcherFormKey.title}
                label="Title"
                placeholder="Enter the title or question for the bet"
                variant="bordered"
            />
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
