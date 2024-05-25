export type InspectResponse = {
    exception_payload: string;
    processed_input_count: number;
    reports: [{ payload: string }];
    status: 'Accepted' | 'Rejected';
};
