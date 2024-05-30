import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    DateInput,
    DateValue,
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
import { useState } from 'react';

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
    const [bettingDate, setBettingDate] = useState<
        Record<'startTime' | 'endTime', DateValue | null>
    >({
        startTime: null,
        endTime: null
    });

    const onStartTimeSelected = (selectedDate: DateValue) =>
        setBettingDate(prev => ({ ...prev, startTime: selectedDate }));
    const onEndTimeSelected = (selectedDate: DateValue) =>
        setBettingDate(prev => ({ ...prev, endTime: selectedDate }));

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
                        <ModalBody>
                            <h3>Validation function</h3>
                            <Input
                                autoFocus
                                label="Name"
                                placeholder="Enter function name"
                                variant="bordered"
                            />
                            <Input
                                label="Code"
                                placeholder="Enter function code"
                                variant="bordered"
                            />
                            <Divider />
                            <h3>Game infos</h3>
                            <Input
                                label="Home pick"
                                placeholder="Enter the first betting pick option"
                                variant="bordered"
                            />
                            <Input
                                label="Away pick"
                                placeholder="Enter the second betting pick option"
                                variant="bordered"
                            />
                            <Input
                                label="Token"
                                placeholder="Enter the token used to betting"
                                variant="bordered"
                            />
                            <DateInput
                                label="Starts at"
                                variant="bordered"
                                granularity="minute"
                                value={bettingDate.startTime}
                                onChange={onStartTimeSelected}
                                // placeholder="Select the date/time to start betting"
                            />
                            <DateInput
                                label="Ends at"
                                variant="bordered"
                                granularity="minute"
                                value={bettingDate.endTime}
                                onChange={onEndTimeSelected}
                                // placeholder="Select the date/time to finish betting"
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
                            <Button color="secondary" onPress={onClose}>
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
