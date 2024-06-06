import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader
} from '@nextui-org/react';

import type { Fetcher } from '@remix-run/react';
import type { ModalProps } from '@nextui-org/react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

type ActionModalProps = Pick<
    ModalProps,
    'isOpen' | 'onOpenChange' | 'children'
> & {
    fetcherForm: ForwardRefExoticComponent<
        any & RefAttributes<HTMLFormElement>
    >;
    method: Fetcher['formMethod'];
    action: Fetcher['formAction'];
    actionLabel?: string;
    isPending?: boolean;
    title?: string;
};

export const ActionModal = (props: ActionModalProps) => {
    return (
        <Modal
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            isDismissable={props.isPending}
            placement="top-center"
            backdrop="blur"
        >
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {props.title}
                        </ModalHeader>
                        <props.fetcherForm
                            method={props.method}
                            action={props.action}
                        >
                            <ModalBody>{props.children}</ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={onClose}
                                    isDisabled={props.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color={
                                        props.isPending ? 'danger' : 'secondary'
                                    }
                                    type="submit"
                                    isDisabled={props.isPending}
                                    isLoading={props.isPending}
                                >
                                    {props.actionLabel ?? 'Send'}
                                </Button>
                            </ModalFooter>
                        </props.fetcherForm>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
