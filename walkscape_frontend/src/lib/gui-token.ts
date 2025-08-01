/**
 * GUI Token Integration for WalkScape
 * Based on GUI INU - The #1 Aptos Community Token
 * Simulates contract interactions for the game mechanics
 */

// Enums and types
export enum ArtifactType {
    MUSHROOM = 1,
    FOSSIL = 2,
    GRAFFITI = 3,
    PIXEL_PLANT = 4
}

export interface Artifact {
    id: number;
    name: string;
    rarity: string;
    gui_value: number;
    discovery_location: string;
    special_properties: string[];
    type: ArtifactType;
}

export enum PetType {
    NONE = 0,
    GUI_PUP = 1,
    APTOS_COMPANION = 2,
    DIGITAL_FRIEND = 3,
    MEME_SPIRIT = 4,
    BLOCKCHAIN_BUDDY = 5
}

export interface PlayerStats {
    walks_xp: number;
    health_score: number;
    last_checkin: number;
    total_artifacts: number;
    current_colony: number;
    pets_owned: number;
    grass_touch_streak: number;
    gui_balance: number;
    gui_staked: number;
    gui_rewards_earned: number;
}

export interface GuiTokenInfo {
    symbol: string;
    name: string;
    decimals: number;
    total_supply: number;
    current_price_usd: number;
    market_cap: number;
    holders: number;
}

export interface StakeInfo {
    amount: number;
    start_time: number;
    reward_rate: number;
    pending_rewards: number;
    lock_period: number;
}

export interface PetStats {
    owner: string;
    pet_type: number;
    level: number;
    happiness: number;
    evolution_stage: number;
    last_fed: number;
    special_traits: number;
    gui_investment: number;
}

export interface ColonyStats {
    name: string;
    founder: string;
    member_count: number;
    total_gui_pooled: number;
    prosperity_level: number;
    special_projects: string[];
    creation_time: number;
}

export interface ArtifactInfo {
    id: number;
    name: string;
    rarity: string;
    gui_value: number;
    discovery_location: string;
    special_properties: string[];
}

// GUI Token Information (based on the provided data)
export const GUI_TOKEN_INFO: GuiTokenInfo = {
    symbol: 'GUI',
    name: 'GUI INU',
    decimals: 8,
    total_supply: 1000000000000, // 1 trillion (based on burn data showing billions burned)
    current_price_usd: 0.00012, // Simulated current price
    market_cap: 120000000, // $120M simulated
    holders: 50000 // 50k+ holders as mentioned
};

// Simulated contract state
const contractState = {
    players: new Map<string, PlayerStats>(),
    stakes: new Map<string, StakeInfo>(),
    pets: new Map<string, PetStats>(),
    colonies: new Map<string, ColonyStats>(),
    artifacts: new Map<string, Artifact[]>(),
    guiPriceHistory: [] as { timestamp: number; price: number }[]
};

/**
 * Simulates wallet connection for GUI token ecosystem
 */
export class GuiWalletManager {
    private static instance: GuiWalletManager;
    private connectedAddress: string | null = null;
    private isConnected = false;

    static getInstance(): GuiWalletManager {
        if (!GuiWalletManager.instance) {
            GuiWalletManager.instance = new GuiWalletManager();
        }
        return GuiWalletManager.instance;
    }

    async connect(): Promise<{ address: string; success: boolean }> {
        // Simulate wallet connection - in real implementation this would connect to Aptos wallet
        const mockAddress = `apt_${Math.random().toString(36).substring(2, 15)}`;
        this.connectedAddress = mockAddress;
        this.isConnected = true;

        // Initialize player if not exists
        if (!contractState.players.has(mockAddress)) {
            contractState.players.set(mockAddress, {
                walks_xp: 0,
                health_score: 100,
                last_checkin: Date.now(),
                total_artifacts: 0,
                current_colony: 0,
                pets_owned: 0,
                grass_touch_streak: 0,
                gui_balance: 1000000, // 10M GUI starting balance
                gui_staked: 0,
                gui_rewards_earned: 0
            });
        }

        return { address: mockAddress, success: true };
    }

    disconnect(): void {
        this.connectedAddress = null;
        this.isConnected = false;
    }

    getConnectedAddress(): string | null {
        return this.connectedAddress;
    }

    isWalletConnected(): boolean {
        return this.isConnected;
    }
}

/**
 * GUI Token contract simulation
 */
export class GuiContract {
    private wallet: GuiWalletManager;

    constructor() {
        this.wallet = GuiWalletManager.getInstance();
    }

    // Player management functions
    async registerPlayer(): Promise<boolean> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const player = contractState.players.get(address);
        if (player) {
            player.last_checkin = Date.now();
            contractState.players.set(address, player);
            return true;
        }
        return false;
    }

    async getPlayerStats(address: string): Promise<PlayerStats | null> {
        return contractState.players.get(address) || null;
    }

    async dailyCheckin(): Promise<{ success: boolean; gui_reward: number }> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const player = contractState.players.get(address);
        if (!player) throw new Error('Player not registered');

        const now = Date.now();
        const lastCheckin = player.last_checkin;
        const daysSinceLastCheckin = Math.floor((now - lastCheckin) / (24 * 60 * 60 * 1000));

        if (daysSinceLastCheckin >= 1) {
            const reward = 50000 * (1 + player.grass_touch_streak * 0.1); // Base 500k GUI + streak bonus
            player.gui_balance += reward;
            player.gui_rewards_earned += reward;
            player.last_checkin = now;
            player.grass_touch_streak += 1;

            contractState.players.set(address, player);
            return { success: true, gui_reward: reward };
        }

        return { success: false, gui_reward: 0 };
    }

    // Staking functions
    async stakeGui(amount: number, lockPeriod: number): Promise<boolean> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const player = contractState.players.get(address);
        if (!player || player.gui_balance < amount) return false;

        player.gui_balance -= amount;
        player.gui_staked += amount;

        const stakeInfo: StakeInfo = {
            amount,
            start_time: Date.now(),
            reward_rate: lockPeriod === 30 ? 5 : lockPeriod === 90 ? 15 : 25, // APY %
            pending_rewards: 0,
            lock_period: lockPeriod
        };

        contractState.stakes.set(address, stakeInfo);
        contractState.players.set(address, player);
        return true;
    }

    async unstakeGui(): Promise<{ success: boolean; amount: number; rewards: number }> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const stake = contractState.stakes.get(address);
        const player = contractState.players.get(address);

        if (!stake || !player) return { success: false, amount: 0, rewards: 0 };

        const rewards = this.calculateStakeRewards(stake);
        player.gui_balance += stake.amount + rewards;
        player.gui_staked -= stake.amount;
        player.gui_rewards_earned += rewards;

        contractState.stakes.delete(address);
        contractState.players.set(address, player);

        return { success: true, amount: stake.amount, rewards };
    }

    async getStakeInfo(address: string): Promise<StakeInfo | null> {
        return contractState.stakes.get(address) || null;
    }

    // Pet management
    async adoptPet(petType: PetType, guiInvestment: number): Promise<boolean> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const player = contractState.players.get(address);
        if (!player || player.gui_balance < guiInvestment) return false;

        player.gui_balance -= guiInvestment;
        player.pets_owned += 1;

        const pet: PetStats = {
            owner: address,
            pet_type: petType,
            level: 1,
            happiness: 100,
            evolution_stage: 1,
            last_fed: Date.now(),
            special_traits: 0,
            gui_investment: guiInvestment
        };

        const petId = `${address}_pet_${player.pets_owned}`;
        contractState.pets.set(petId, pet);
        contractState.players.set(address, player);
        return true;
    }

    // Colony management
    async createColony(name: string, initialGuiPool: number): Promise<boolean> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const player = contractState.players.get(address);
        if (!player || player.gui_balance < initialGuiPool) return false;

        player.gui_balance -= initialGuiPool;

        const colony: ColonyStats = {
            name,
            founder: address,
            member_count: 1,
            total_gui_pooled: initialGuiPool,
            prosperity_level: 1,
            special_projects: [],
            creation_time: Date.now()
        };

        const colonyId = `colony_${Date.now()}`;
        contractState.colonies.set(colonyId, colony);

        player.current_colony = parseInt(colonyId.split('_')[1]);
        contractState.players.set(address, player);
        return true;
    }

    // Artifact management
    async claimArtifact(artifactName: string, location: string): Promise<{ success: boolean; gui_reward: number }> {
        const address = this.wallet.getConnectedAddress();
        if (!address) throw new Error('Wallet not connected');

        const player = contractState.players.get(address);
        if (!player) return { success: false, gui_reward: 0 };

        const rarity = this.determineArtifactRarity();
        const guiReward = this.calculateArtifactReward(rarity);

        const artifact: Artifact = {
            id: Date.now(),
            name: artifactName,
            rarity,
            gui_value: guiReward,
            discovery_location: location,
            special_properties: this.generateSpecialProperties(rarity),
            type: ArtifactType.MUSHROOM // Default type, should be determined based on the artifact
        };

        const playerArtifacts = contractState.artifacts.get(address) || [];
        playerArtifacts.push(artifact);
        contractState.artifacts.set(address, playerArtifacts);

        player.total_artifacts += 1;
        player.gui_balance += guiReward;
        player.gui_rewards_earned += guiReward;
        player.walks_xp += 100;

        contractState.players.set(address, player);
        return { success: true, gui_reward: guiReward };
    }

    // Helper functions
    private calculateStakeRewards(stake: StakeInfo): number {
        const currentTime = Date.now();
        const stakingDuration = currentTime - stake.start_time;
        const daysStaked = stakingDuration / (24 * 60 * 60 * 1000);
        return (stake.amount * stake.reward_rate / 100 / 365) * daysStaked;
    }

    private determineArtifactRarity(): string {
        const random = Math.random();
        if (random < 0.6) return 'Common';
        if (random < 0.85) return 'Uncommon';
        if (random < 0.95) return 'Rare';
        if (random < 0.99) return 'Epic';
        return 'Legendary';
    }

    private calculateArtifactReward(rarity: string): number {
        const baseRewards = {
            'Common': 1000,
            'Uncommon': 5000,
            'Rare': 25000,
            'Epic': 100000,
            'Legendary': 500000
        };
        return baseRewards[rarity as keyof typeof baseRewards] || 1000;
    }

    private generateSpecialProperties(rarity: string): string[] {
        const properties = ['GUI Multiplier', 'XP Boost', 'Happiness Bonus', 'Staking Bonus', 'Colony Power'];
        const numProperties = rarity === 'Legendary' ? 3 : rarity === 'Epic' ? 2 : 1;
        return properties.slice(0, numProperties);
    }

    // Market functions
    async getGuiPrice(): Promise<number> {
        // Simulate price fluctuation
        const basePrice = GUI_TOKEN_INFO.current_price_usd;
        const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
        return basePrice * (1 + fluctuation);
    }

    async getGuiMarketData(): Promise<GuiTokenInfo> {
        const currentPrice = await this.getGuiPrice();
        return {
            ...GUI_TOKEN_INFO,
            current_price_usd: currentPrice,
            market_cap: currentPrice * GUI_TOKEN_INFO.total_supply
        };
    }
}

// Export singleton instance
export const guiContract = new GuiContract();
export const guiWallet = GuiWalletManager.getInstance();

// Utility functions for backwards compatibility
export function generateLocationHash(lat: number, lng: number): string {
    return `${Math.floor(lat * 1000)}_${Math.floor(lng * 1000)}`;
}

export function stringToFelt252(str: string): string {
    return str; // For GUI ecosystem, we just return the string
}

export function felt252ToString(felt: string): string {
    return felt; // For GUI ecosystem, we just return the string
}
