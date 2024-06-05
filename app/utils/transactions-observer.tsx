import {
    type PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef
} from 'react';
import { timer } from './timer';

type TransactionStatus = 'pending' | 'success' | 'error';
type SubscriptionHandler = (
    transactionStatus: TransactionStatus
) => Promise<void>;
type TransactionsObserverContextValue = {
    notify: (transactionHash: string, handler: SubscriptionHandler) => void;
};

class TransactionsObserver {
    private transactions: Map<
        string,
        { handler: SubscriptionHandler; notifiedAt?: number }
    > = new Map();

    constructor(private provider: typeof window.ethereum) {}

    private async checkTransactionStatus(
        txHash: string
    ): Promise<TransactionStatus | { error: string } | null> {
        if (!this.provider) return { error: 'Eth provider is required.' };

        if (this.provider.isConnected()) {
            try {
                const providerRes = await this.provider.request({
                    method: 'eth_getTransactionReceipt',
                    params: [txHash as `0x${string}`]
                });
                if (providerRes === null) return 'pending';
                else if (providerRes.status === '0x0') return 'error';
                else if (providerRes.status === '0x1') return 'success';
            } catch (err: any) {
                return { error: err.message ?? String(err) };
            }
        }
        return null;
    }

    private notify(
        transactionHash: string,
        transactionStatus: TransactionStatus
    ) {
        const transaction = this.transactions.get(transactionHash);

        if (!transaction || transaction.notifiedAt) {
            const errorCause = transaction?.notifiedAt
                ? 'it already notified'
                : 'not found it';

            throw {
                error: `Can't notify about transaction "${transactionHash}" because ${errorCause}.`
            };
        }

        transaction.handler(transactionStatus);
        transaction.notifiedAt = Date.now();
        this.transactions.set(transactionHash, transaction);
    }
    async startListen(
        transactionHash: string,
        option?: { successOnly?: boolean; maxTries?: number }
    ) {
        if (!this.transactions.has(transactionHash))
            throw {
                error: `Transaction of hash "${transactionHash}" not subscribed.`
            };
        else if (this.transactions.get(transactionHash)?.notifiedAt)
            throw {
                error: `Transaction of hash "${transactionHash}" already notified.`
            };

        const keepCheckingUntilSuccess: boolean = option?.successOnly ?? true;
        const maxTries = option?.maxTries ?? 10;
        let continueLoop: boolean = true;
        let status: TransactionStatus = 'pending';
        let tries = 0;

        while (continueLoop) {
            if (tries > maxTries)
                throw {
                    error: `Number of max tries (${maxTries}) reached for check status of transaction "${transactionHash}".`
                };

            const checkRes = await this.checkTransactionStatus(transactionHash);
            tries = 1;

            if (typeof checkRes === 'object' && !!checkRes?.error)
                throw checkRes;
            else {
                if (!keepCheckingUntilSuccess) {
                    status = (checkRes as TransactionStatus) ?? 'pending';
                    continueLoop = false;
                } else if (checkRes === 'success') continueLoop = false;
                else await timer(3000);
            }
        }

        this.notify(transactionHash, status);
    }
    subscribe(transactionHash: string, cbk: SubscriptionHandler) {
        this.transactions.set(transactionHash, { handler: cbk });
    }
    unsubscribe(transactionHash: string) {
        this.transactions.delete(transactionHash);
    }
    unsubscribeAll() {
        this.transactions.clear();
    }
}
const TransactionsObserverContext = createContext<
    TransactionsObserverContextValue | undefined
>(undefined);

export const TransactionsObserverProvider = ({
    children
}: PropsWithChildren) => {
    const observer = useRef<TransactionsObserver>();

    const notify = useCallback(
        (transactionHash: string, handler: SubscriptionHandler) => {
            observer.current?.subscribe?.(transactionHash, handler);
            observer.current?.startListen?.(transactionHash);
        },
        []
    );

    useEffect(() => {
        //NOTE remix needs useeffect to interprets these hook uses the "window" browser API
        observer.current = new TransactionsObserver(window.ethereum);
        return () => observer.current?.unsubscribeAll?.();
    }, []);

    const value = useMemo(() => ({ notify }), []);

    return (
        <TransactionsObserverContext.Provider value={value}>
            {children}
        </TransactionsObserverContext.Provider>
    );
};

export const useTransactionsObserver = () => {
    const context = useContext(TransactionsObserverContext);

    if (typeof context === 'undefined')
        throw new Error(
            'An useTransactionsObserver consumer node must be inside a TransactionsObserverProvider three.'
        );

    return context;
};
