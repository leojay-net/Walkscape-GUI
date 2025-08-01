'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerStats, GuiTokenInfo } from '@/lib/gui-token';

interface WalletContextType {
    isLoading: boolean;
    account: { address: string } | null;
    address: string | null;
    isConnected: boolean;
    isRegistered: boolean;
    playerStats: PlayerStats | null;
    guiTokenInfo: GuiTokenInfo | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    checkRegistration: () => Promise<void>;
    refreshPlayerStats: () => Promise<void>;
    retryRegistrationCheck: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<{ address: string } | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
    const [guiTokenInfo, setGuiTokenInfo] = useState<GuiTokenInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data
    const mockAddress = "0xabcdef1234567890abcdef1234567890abcdef12";

    const mockPlayerStats: PlayerStats = {
        walks_xp: 2500,
        health_score: 92,
        last_checkin: Date.now(),
        total_artifacts: 18,
        current_colony: 2,
        pets_owned: 5,
        grass_touch_streak: 23,
        gui_balance: 75000,
        gui_staked: 40000,
        gui_rewards_earned: 3200
    };

    const mockGuiTokenInfo: GuiTokenInfo = {
        symbol: "GUI",
        name: "GUI INU",
        decimals: 8,
        total_supply: 1000000000000,
        current_price_usd: 0.000042,
        market_cap: 4200000,
        holders: 15420
    };

    // Auto-initialize with mock data
    useEffect(() => {
        const initializeMockGui = () => {
            setTimeout(() => {
                setGuiTokenInfo(mockGuiTokenInfo);
                // Don't auto-connect, let user click "Launch App"
                setIsLoading(false);
                console.log('Mock GUI wallet initialized');
            }, 500);
        };

        initializeMockGui();
    }, []);

    const connect = async () => {
        setIsLoading(true);

        // Simulate connection process
        await new Promise(resolve => setTimeout(resolve, 1200));

        setAccount({ address: mockAddress });
        setAddress(mockAddress);
        setIsConnected(true);
        setIsRegistered(true);
        setPlayerStats(mockPlayerStats); // Set playerStats immediately
        setIsLoading(false);

        console.log('Mock GUI wallet connected:', mockAddress);
    };

    const disconnect = async () => {
        setAccount(null);
        setAddress(null);
        setIsConnected(false);
        setIsRegistered(false);
        setPlayerStats(null);

        console.log('Mock GUI wallet disconnected');
    };

    const checkRegistration = async () => {
        if (!address) return;

        console.log('Mock: Player is registered and stats loaded');
        setIsRegistered(true);
        setPlayerStats(mockPlayerStats);
    };

    const refreshPlayerStats = async () => {
        if (!address) return;

        // Mock stat variations
        const refreshedStats = {
            ...mockPlayerStats,
            walks_xp: mockPlayerStats.walks_xp + Math.floor(Math.random() * 20),
            health_score: Math.max(80, Math.min(100, mockPlayerStats.health_score + (Math.random() - 0.5) * 8)),
            last_checkin: Date.now(),
        };

        setPlayerStats(refreshedStats);
        console.log('Mock: Player stats refreshed');
    };

    const retryRegistrationCheck = async () => {
        console.log('Mock: Retrying registration check');
        await checkRegistration();
    };

    const value: WalletContextType = {
        isLoading,
        account,
        address,
        isConnected,
        isRegistered,
        playerStats,
        guiTokenInfo,
        connect,
        disconnect,
        checkRegistration,
        refreshPlayerStats,
        retryRegistrationCheck,
    };

    return (
        <WalletContext.Provider value={value}>
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet(): WalletContextType {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}

export default WalletContext;
