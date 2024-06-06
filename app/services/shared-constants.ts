export const baseUrl = 'http://localhost:8080';
export const inspectBaseUrl = `${baseUrl}/inspect`;
export const dappAddress = '0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e';
export const advanceABI = {
    addValidationFunction: {
        name: 'addValidationFunction',
        abi: 'function addValidationFunction(bytes32 name, bytes32 functionString)'
    },
    createGame: {
        name: 'createGame',
        abi: 'function createGame(bytes32 home, bytes32 away, address token , uint256 start, uint256 end, bytes32 validatorFunctionName)'
    },
    placeBet: {
        name: 'placeBet',
        abi: 'function placeBet(bytes32 gameid, bytes32 pick, address token, uint256 amount)'
    }
};
export const advanceABIMap = Object.values(advanceABI).map(
    currentABI => currentABI.abi
);
