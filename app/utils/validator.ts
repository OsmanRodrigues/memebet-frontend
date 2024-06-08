import { object } from 'yup';
import type { Schema } from 'yup';

export const validateSchema = async (
    schema: Record<string, Schema>,
    data: Record<string, any>
) => {
    const schemaValidator = object(schema);

    return await schemaValidator.validate(data);
};
