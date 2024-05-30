export const inspectBaseUrl = 'http://localhost:8080/inspect';
export const dappAddress = '0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e';
export const advanceABI = {
    addValidationFunction: {
        name: 'addValidationFunction',
        abi: 'function addValidationFunction(bytes32 name, bytes32 functionString)'
    },
    createGame: {
        name: 'createGame',
        abi: 'function createGame(bytes32 home, bytes32 away, address token , uint256 start, uint256 end, bytes32 validatorFunctionName)'
    }
};
export const advanceABIMap = Object.values(advanceABI).map(
    currentABI => currentABI.abi
);
