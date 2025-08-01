'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Users, Trophy, Loader2, UserPlus, LogOut } from 'lucide-react';

interface Colony {
    id: string;
    name: string;
    creator: string;
    member_count: bigint;
    total_xp: bigint;
    created_at: bigint;
    weekly_challenge_score: bigint;
}

interface PopularColony {
    id: string;
    name: string;
    member_count: number;
    total_xp: number;
    level: number;
}

interface LoadColonyDataOptions {
    accountAddress: string | undefined;
    currentColonyId?: number;
}

export default function Colony() {
    const { account, playerStats, isRegistered } = useWallet();
    const [activeTab, setActiveTab] = useState<'my-colony' | 'discover'>('my-colony');
    const [colony, setColony] = useState<Colony | null>(null);
    const [popularColonies, setPopularColonies] = useState<PopularColony[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPopular, setIsLoadingPopular] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const loadColonyData = useCallback(async ({ accountAddress, currentColonyId }: LoadColonyDataOptions) => {
        console.log('=== loadColonyData called ===');
        console.log('accountAddress:', accountAddress);
        console.log('currentColonyId:', currentColonyId);

        if (!accountAddress) {
            console.log('No account address, returning');
            setIsLoading(false);
            return;
        }

        try {
            // Load colony data from your API or contract
            const colonyData = {
                id: 'sample-colony',
                name: 'Sample Colony',
                creator: accountAddress,
                member_count: BigInt(1),
                total_xp: BigInt(0),
                created_at: BigInt(Date.now()),
                weekly_challenge_score: BigInt(0)
            };

            setColony(colonyData);
            setLoadError(null);
        } catch (error) {
            console.error('Failed to load colony data:', error);
            setLoadError('Failed to load colony data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadPopularColonies = useCallback(async () => {
        if (isLoadingPopular) return;

        setIsLoadingPopular(true);
        try {
            // Load popular colonies from your API or contract
            const popularData: PopularColony[] = [
                {
                    id: 'colony-1',
                    name: 'Popular Colony 1',
                    member_count: 100,
                    total_xp: 10000,
                    level: 5
                }
            ];

            setPopularColonies(popularData);
        } catch (error) {
            console.error('Failed to load popular colonies:', error);
        } finally {
            setIsLoadingPopular(false);
        }
    }, [isLoadingPopular]);

    useEffect(() => {
        if (isRegistered && account?.address && playerStats?.current_colony !== undefined) {
            loadColonyData({
                accountAddress: account.address,
                currentColonyId: playerStats.current_colony
            });
        }
    }, [isRegistered, account?.address, playerStats?.current_colony, loadColonyData]);

    useEffect(() => {
        if (activeTab === 'discover') {
            loadPopularColonies();
        }
    }, [activeTab, loadPopularColonies]);

    if (!isRegistered) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Please complete registration first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[500px] bg-slate-900 rounded-lg p-4">
            {/* Tab navigation */}
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setActiveTab('my-colony')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'my-colony'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    My Colony
                </button>
                <button
                    onClick={() => setActiveTab('discover')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'discover'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                        }`}
                >
                    Discover
                </button>
            </div>

            {/* Content area */}
            <div className="mt-4">
                {activeTab === 'my-colony' ? (
                    isLoading ? (
                        <div className="flex items-center justify-center min-h-[300px]">
                            <Loader2 className="animate-spin text-slate-400" size={24} />
                        </div>
                    ) : colony ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-white">{colony.name}</h2>
                                <button
                                    onClick={() => {/* Handle leave colony */ }}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                                        <Users size={20} />
                                        <span>Members</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {colony.member_count.toString()}
                                    </p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    <div className="flex items-center space-x-2 text-purple-400 mb-2">
                                        <Trophy size={20} />
                                        <span>Total XP</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white">
                                        {colony.total_xp.toString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-400 mb-4">You haven&apos;t joined a colony yet</p>
                            <button
                                onClick={() => setActiveTab('discover')}
                                className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg mx-auto hover:bg-emerald-600 transition-colors"
                            >
                                <UserPlus size={20} />
                                <span>Find a Colony</span>
                            </button>
                        </div>
                    )
                ) : (
                    <div className="space-y-4">
                        {isLoadingPopular ? (
                            <div className="flex items-center justify-center min-h-[300px]">
                                <Loader2 className="animate-spin text-slate-400" size={24} />
                            </div>
                        ) : (
                            popularColonies.map(colony => (
                                <div
                                    key={colony.id}
                                    className="bg-slate-800 p-4 rounded-lg flex items-center justify-between"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {colony.name}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                                            <span className="flex items-center space-x-1">
                                                <Users size={16} />
                                                <span>{colony.member_count}</span>
                                            </span>
                                            <span className="flex items-center space-x-1">
                                                <Trophy size={16} />
                                                <span>{colony.total_xp.toLocaleString()}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {/* Handle join colony */ }}
                                        className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                                    >
                                        Join
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {loadError && (
                <div className="mt-4 p-4 bg-red-900/50 text-red-400 rounded-lg">
                    {loadError}
                </div>
            )}
        </div>
    );
}
