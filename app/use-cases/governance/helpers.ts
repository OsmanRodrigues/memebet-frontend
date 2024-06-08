import type { GovernanceFormData } from './type';

export const validateFormData = (formData: Partial<GovernanceFormData>) => {
    if (!formData) return { error: 'Form data must be provided.' };
    else if (Object.values(formData).some(value => !value))
        return {
            error: 'Create form data must be filled with all required fields.'
        };
};
