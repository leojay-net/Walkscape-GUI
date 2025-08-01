'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation';
import { Users, Trophy, Loader2, UserPlus, LogOut, Crown, Star, Zap } from 'lucide-react';

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

    // Scroll animations
    const headerAnimation = useScrollAnimation({ threshold: 0.2 });
    const tabsAnimation = useScrollAnimation({ threshold: 0.1 });
    const contentAnimation = useScrollAnimation({ threshold: 0.1 });
    const { containerRef: coloniesRef, getItemClasses: getColonyClasses } = useStaggeredScrollAnimation(6, 150);

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
        <div className="min-h-screen bg-slate-950 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div ref={headerAnimation.ref} className={`text-center space-y-4 ${headerAnimation.animationClasses}`}>
                    <div className="flex items-center justify-center gap-3 group">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-purple-500/50">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-purple-400">Colony Hub</h1>
                            <p className="text-slate-400 text-sm transition-all duration-300 group-hover:text-slate-300">Connect with fellow explorers</p>
                        </div>
                    </div>
                </div>

                {/* Tab navigation */}
                <div ref={tabsAnimation.ref} className={`flex justify-center space-x-4 ${tabsAnimation.animationClasses}`}>
                    <button
                        onClick={() => setActiveTab('my-colony')}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${activeTab === 'my-colony'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                            : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:scale-105'
                            }`}
                    >
                        My Colony
                    </button>
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${activeTab === 'discover'
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                            : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:scale-105'
                            }`}
                    >
                        Discover
                    </button>
                </div>

                {/* Content */}
                <div ref={contentAnimation.ref} className={`${contentAnimation.animationClasses}`}>
                    {activeTab === 'my-colony' && (
                        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-700/60">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
                                        <p className="text-slate-400">Loading your colony...</p>
                                    </div>
                                </div>
                            ) : colony ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                                                <Crown className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">{colony.name}</h2>
                                                <p className="text-slate-400">Founded by {colony.creator}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {/* Handle leave colony */ }}
                                            className="p-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/30"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-700/30 rounded-xl p-4 text-center shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20">
                                            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                            <div className="text-xl font-bold text-white">{Number(colony.member_count)}</div>
                                            <div className="text-sm text-slate-400">Members</div>
                                        </div>
                                        <div className="bg-slate-700/30 rounded-xl p-4 text-center shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20">
                                            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                            <div className="text-xl font-bold text-white">{Number(colony.total_xp).toLocaleString()}</div>
                                            <div className="text-sm text-slate-400">Total XP</div>
                                        </div>
                                        <div className="bg-slate-700/30 rounded-xl p-4 text-center shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/20">
                                            <Zap className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                                            <div className="text-xl font-bold text-white">{Number(colony.weekly_challenge_score)}</div>
                                            <div className="text-sm text-slate-400">Weekly Score</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">No Colony Yet</h3>
                                    <p className="text-slate-400 mb-6">Join a colony to connect with other explorers</p>
                                    <button
                                        onClick={() => setActiveTab('discover')}
                                        className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 mx-auto"
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        <span>Discover Colonies</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'discover' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Popular Colonies</h2>
                                <p className="text-slate-400">Find the perfect community for your adventures</p>
                            </div>

                            {isLoadingPopular ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Loader2 className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-spin" />
                                        <p className="text-slate-400">Loading popular colonies...</p>
                                    </div>
                                </div>
                            ) : (
                                <div ref={coloniesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {popularColonies.map((colonyItem, index) => (
                                        <div
                                            key={colonyItem.id}
                                            className={`bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-slate-700/60 group ${getColonyClasses(index)}`}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-1 transition-all duration-300 group-hover:text-purple-400">{colonyItem.name}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                                        <span className="flex items-center gap-1">
                                                            <Users size={14} />
                                                            {colonyItem.member_count}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Star size={14} />
                                                            Level {colonyItem.level}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                                    <Crown className="w-5 h-5 text-purple-400" />
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-400">Total XP</span>
                                                    <span className="text-sm font-medium text-yellow-400">{colonyItem.total_xp.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {/* Handle join colony */ }}
                                                className="w-full bg-purple-500 hover:bg-purple-400 text-white py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 font-medium"
                                            >
                                                Join Colony
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {loadError && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <Users size={16} />
                            <span className="font-medium">Colony Error</span>
                        </div>
                        <p className="text-red-300 text-sm">{loadError}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
