'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerStats } from '@/lib/gui-token';

// Mock wallet interface
interface AptosAccount {
    address: string;
    publicKey?: string;
    isConnected?: boolean;
}

interface WalletContextType {
    isLoading: boolean;
    account: AptosAccount | null;
    address: string | null;
    isConnected: boolean;
    isRegistered: boolean;
    playerStats: PlayerStats | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    checkRegistration: () => Promise<void>;
    refreshPlayerStats: () => Promise<void>;
    retryRegistrationCheck: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<AptosAccount | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Mock player data
    const mockPlayerStats: PlayerStats = {
        walks_xp: 1250,
        health_score: 85,
        last_checkin: Date.now(),
        total_artifacts: 12,
        current_colony: 1,
        pets_owned: 3,
        grass_touch_streak: 15,
        gui_balance: 50000,
        gui_staked: 25000,
        gui_rewards_earned: 1250
    };

    const mockAddress = "0x1234567890abcdef1234567890abcdef12345678";

    // Initialize with mock connection after component mount
    useEffect(() => {
        const initMockWallet = () => {
            setTimeout(() => {
                const mockAccount = { address: mockAddress };
                setAccount(mockAccount);
                setAddress(mockAddress);
                setIsConnected(true);
                setIsRegistered(true);
                setPlayerStats(mockPlayerStats);
                setIsLoading(false);
                console.log('Mock wallet initialized and player is registered');
            }, 1000); // Simulate loading delay
        };

        initMockWallet();
    }, []);

    const connect = async () => {
        setIsLoading(true);

        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockAccount = { address: mockAddress };
        setAccount(mockAccount);
        setAddress(mockAddress);
        setIsConnected(true);
        setIsRegistered(true);
        setPlayerStats(mockPlayerStats);
        setIsLoading(false);

        console.log('Mock wallet connected:', mockAddress);
    };

    const disconnect = async () => {
        setAccount(null);
        setAddress(null);
        setIsConnected(false);
        setIsRegistered(false);
        setPlayerStats(null);

        console.log('Mock wallet disconnected');
    };

    const checkRegistration = async () => {
        if (!address) return;

        // Mock registration check
        console.log('Player is registered and stats loaded');
        setIsRegistered(true);
        setPlayerStats(mockPlayerStats);
    };

    const refreshPlayerStats = async () => {
        if (!address) return;

        // Simulate stats refresh with slight variations
        const refreshedStats = {
            ...mockPlayerStats,
            walks_xp: mockPlayerStats.walks_xp + Math.floor(Math.random() * 10),
            health_score: Math.max(75, Math.min(95, mockPlayerStats.health_score + (Math.random() - 0.5) * 5)),
            last_checkin: Date.now(),
        };

        setPlayerStats(refreshedStats);
        console.log('Mock player stats refreshed');
    };

    const retryRegistrationCheck = async () => {
        console.log('Retrying registration check (mock)');
        await checkRegistration();
    };

    return (
        <WalletContext.Provider
            value={{
                isLoading,
                account,
                address,
                isConnected,
                isRegistered,
                playerStats,
                connect,
                disconnect,
                checkRegistration,
                refreshPlayerStats,
                retryRegistrationCheck,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}