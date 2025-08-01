export type ContractMethodArgs = string | number | boolean | object;

export interface AptosContract {
    address: string;
    methods: {
        [key: string]: (...args: ContractMethodArgs[]) => Promise<unknown>;
    };
}

export const getContract = (): AptosContract => {
    return {
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '',
        methods: {
            // Add contract methods here
        }
    };
};
