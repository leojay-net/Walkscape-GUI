'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@/contexts/GuiWalletContext';
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation';
import {
    MapPin,
    Trophy,
    Heart,
    Calendar,
    PawPrint,
    Users,
    Coins,
    User,
    Flame,
    TrendingUp,
    Activity,
    Gift
} from 'lucide-react';

export default function GuiDashboard() {
    const { playerStats, refreshPlayerStats, address, isRegistered, isLoading, guiTokenInfo } = useWallet();
    const [lastRefresh, setLastRefresh] = useState(Date.now());
    const [canCheckIn, setCanCheckIn] = useState(false);
    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [checkInResult, setCheckInResult] = useState<{ success: boolean; reward: number } | null>(null);
    const [statsLoadTimeout, setStatsLoadTimeout] = useState(false);

    // Scroll animations
    const headerAnimation = useScrollAnimation({ threshold: 0.2 });
    const tokenInfoAnimation = useScrollAnimation({ threshold: 0.1 });
    const balanceAnimation = useScrollAnimation({ threshold: 0.1 });
    const { containerRef: statsGridRef, getItemClasses: getStatsItemClasses } = useStaggeredScrollAnimation(8, 100);
    const actionsAnimation = useScrollAnimation({ threshold: 0.1 });

    // Debug log
    console.log('GuiDashboard render - State:', {
        isRegistered,
        isLoading,
        hasPlayerStats: !!playerStats,
        playerStats: playerStats ? 'loaded' : 'null',
        address: address?.slice(0, 8)
    });

    useEffect(() => {
        // Refresh stats when component mounts if user is registered
        if (isRegistered && !playerStats && !isLoading) {
            console.log('Dashboard requesting player stats refresh...');
            refreshPlayerStats();
        }
    }, [isRegistered, isLoading]); // Removed playerStats and refreshPlayerStats from dependencies

    // Add a timeout fallback for loading stats
    useEffect(() => {
        if (isRegistered && !playerStats && !isLoading) {
            const timeout = setTimeout(() => {
                console.log('Stats loading timeout - showing fallback');
                setStatsLoadTimeout(true);
            }, 5000); // 5 second timeout

            return () => clearTimeout(timeout);
        }
    }, [isRegistered, playerStats, isLoading]);

    useEffect(() => {
        // Check if user can do daily check-in
        if (playerStats) {
            const now = Date.now();
            const lastCheckin = playerStats.last_checkin;
            const daysSinceLastCheckin = Math.floor((now - lastCheckin) / (24 * 60 * 60 * 1000));
            setCanCheckIn(daysSinceLastCheckin >= 1);
        }
    }, [playerStats]);

    useEffect(() => {
        // Disabled auto-refresh for mock demo
        // Auto-refresh can cause performance issues in mock mode
    }, []);

    const handleDailyCheckIn = async () => {
        try {
            setIsCheckingIn(true);

            // Mock daily check-in
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockReward = Math.floor(Math.random() * 1000) + 500;
            setCheckInResult({ success: true, reward: mockReward });

            // Mock refresh stats
            await refreshPlayerStats();

            // Clear result after 3 seconds
            setTimeout(() => setCheckInResult(null), 3000);
        } catch (error) {
            console.error('Check-in failed:', error);
            setCheckInResult({ success: false, reward: 0 });
        } finally {
            setIsCheckingIn(false);
        }
    };

    // Show loading if wallet context is still loading
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-slate-400 mt-4 text-lg">Loading wallet status...</p>
                </div>
            </div>
        );
    }

    // Show loading if not registered or stats not loaded yet
    if (!isRegistered) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Please complete registration first</p>
                </div>
            </div>
        );
    }

    // Check if playerStats is actually null/undefined
    if (!playerStats && !statsLoadTimeout) {
        // Show skeleton loader
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                        <p className="text-slate-400">Loading player stats...</p>
                    </div>
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-slate-800 rounded w-2/3 mx-auto" />
                        <div className="h-6 bg-slate-800 rounded w-1/2 mx-auto" />
                        <div className="h-40 bg-slate-800 rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    // If timeout occurred, show error with retry option
    if (statsLoadTimeout && !playerStats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg mb-4">Failed to load player stats</p>
                    <button
                        onClick={() => {
                            setStatsLoadTimeout(false);
                            refreshPlayerStats();
                        }}
                        className="btn-primary"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Final safety check - should not happen but prevents null access
    if (!playerStats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No player data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div ref={headerAnimation.ref} className={`text-center space-y-4 ${headerAnimation.animationClasses}`}>
                    <div className="flex items-center justify-center gap-3 group">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-green-500/50">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-green-400">Explorer Dashboard</h1>
                            <p className="text-slate-400 text-sm transition-all duration-300 group-hover:text-slate-300">Powered by GUI INU</p>
                        </div>
                    </div>

                    {/* GUI Token Price */}
                    {guiTokenInfo && (
                        <div ref={tokenInfoAnimation.ref} className={`bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-slate-700/60 ${tokenInfoAnimation.animationClasses}`}>
                            <div className="flex items-center justify-center gap-4">
                                <div className="text-center group cursor-pointer">
                                    <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">GUI Price</div>
                                    <div className="text-lg font-bold text-green-400 transition-all duration-300 group-hover:scale-110">
                                        ${guiTokenInfo.current_price_usd.toFixed(6)}
                                    </div>
                                </div>
                                <div className="text-center group cursor-pointer">
                                    <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Market Cap</div>
                                    <div className="text-lg font-bold text-blue-400 transition-all duration-300 group-hover:scale-110">
                                        ${(guiTokenInfo.market_cap / 1000000).toFixed(1)}M
                                    </div>
                                </div>
                                <div className="text-center group cursor-pointer">
                                    <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Holders</div>
                                    <div className="text-lg font-bold text-purple-400 transition-all duration-300 group-hover:scale-110">
                                        {guiTokenInfo.holders.toLocaleString()}+
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Daily Check-in */}
                {canCheckIn && (
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-green-500/30 shadow-2xl shadow-green-500/20 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-green-500/30">
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 group">
                                <Gift className="w-6 h-6 text-green-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                                <h3 className="text-lg font-semibold text-white transition-all duration-300 group-hover:text-green-400">Daily Check-in Available!</h3>
                            </div>
                            <p className="text-slate-300 transition-all duration-300 hover:text-slate-200">
                                Claim your daily $GUI rewards and keep your streak going!
                            </p>
                            <button
                                onClick={handleDailyCheckIn}
                                disabled={isCheckingIn}
                                className="bg-green-500 hover:bg-green-400 disabled:bg-slate-500 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 disabled:shadow-slate-500/30"
                            >
                                {isCheckingIn ? 'Checking in...' : 'Claim Daily Reward'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Check-in Result */}
                {checkInResult && (
                    <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 ${checkInResult.success
                        ? 'bg-green-900/30 border-green-500/30 text-green-300 shadow-green-500/20'
                        : 'bg-red-900/30 border-red-500/30 text-red-300 shadow-red-500/20'
                        }`}>
                        {checkInResult.success ? (
                            <div className="text-center">
                                <p className="font-semibold">Daily Check-in Complete!</p>
                                <p>You earned {(checkInResult.reward / 100000).toFixed(1)}M $GUI tokens!</p>
                            </div>
                        ) : (
                            <p className="text-center">Check-in failed. Try again later.</p>
                        )}
                    </div>
                )}

                {/* GUI Token Balance */}
                <div ref={balanceAnimation.ref} className={`bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-slate-700/60 ${balanceAnimation.animationClasses}`}>
                    <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center justify-center gap-2 group">
                            <Coins className="w-5 h-5 text-yellow-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                            <span className="transition-all duration-300 group-hover:text-yellow-400">Your GUI Holdings</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-700/30 rounded-xl p-4 shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-105 hover:shadow-green-500/20 group">
                                <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Available Balance</div>
                                <div className="text-2xl font-bold text-green-400 transition-all duration-300 group-hover:scale-110">
                                    {(playerStats.gui_balance / 100000).toFixed(1)}M
                                </div>
                                <div className="text-xs text-slate-500">$GUI</div>
                            </div>
                            <div className="bg-slate-700/30 rounded-xl p-4 shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 group">
                                <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Staked Amount</div>
                                <div className="text-2xl font-bold text-blue-400 transition-all duration-300 group-hover:scale-110">
                                    {(playerStats.gui_staked / 100000).toFixed(1)}M
                                </div>
                                <div className="text-xs text-slate-500">$GUI</div>
                            </div>
                            <div className="bg-slate-700/30 rounded-xl p-4 shadow-lg shadow-slate-900/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 group">
                                <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Total Earned</div>
                                <div className="text-2xl font-bold text-purple-400 transition-all duration-300 group-hover:scale-110">
                                    {(playerStats.gui_rewards_earned / 100000).toFixed(1)}M
                                </div>
                                <div className="text-xs text-slate-500">$GUI</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explorer Stats Grid */}
                <div ref={statsGridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-green-500/20 group">
                        <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-green-400">{playerStats.walks_xp}</div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Walk XP</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-red-500/20 group">
                        <Heart className="w-8 h-8 text-red-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-red-400">{playerStats.health_score}</div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Health Score</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20 group">
                        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-yellow-400">{playerStats.total_artifacts}</div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Artifacts</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/20 group">
                        <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-orange-400">{playerStats.grass_touch_streak}</div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Day Streak</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/20 group">
                        <PawPrint className="w-8 h-8 text-pink-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-pink-400">{playerStats.pets_owned}</div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Pets Owned</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20 group">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-blue-400">
                            {playerStats.current_colony > 0 ? '1' : '0'}
                        </div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Colony</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/20 group">
                        <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-purple-400">
                            {Math.floor((Date.now() - playerStats.last_checkin) / (24 * 60 * 60 * 1000))}
                        </div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Days Since Check-in</div>
                    </div>

                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 text-center shadow-xl shadow-slate-900/50 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20 group">
                        <Activity className="w-8 h-8 text-cyan-400 mx-auto mb-2 transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse" />
                        <div className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-cyan-400">Active</div>
                        <div className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Status</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-700/60">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white p-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium">
                            <MapPin className="w-4 h-4 mx-auto mb-1" />
                            Explore
                        </button>
                        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium">
                            <Coins className="w-4 h-4 mx-auto mb-1" />
                            Stake GUI
                        </button>
                        <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium">
                            <PawPrint className="w-4 h-4 mx-auto mb-1" />
                            Adopt Pet
                        </button>
                        <button className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white p-3 rounded-lg transition-all duration-200 transform hover:scale-105 text-sm font-medium">
                            <Users className="w-4 h-4 mx-auto mb-1" />
                            Join Colony
                        </button>
                    </div>
                </div>

                {/* GUI Ecosystem Info */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <div className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-white">About GUI INU</h3>
                        <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                            GUI INU is the #1 Aptos community token with 50k+ holders, $120M+ market cap, and 20+ integrations.
                            &quot;What is dead cannot die&quot; - Join the movement that&apos;s building the future of Aptos.
                        </p>
                        <div className="flex justify-center items-center gap-4 text-xs text-slate-400">
                            <span>• 20+ Integrations</span>
                            <span>• Exchange Listed</span>
                            <span>• Community Driven</span>
                            <span>• DeFi Enabled</span>
                        </div>
                    </div>
                </div>

                {/* Last Update */}
                <div className="text-center text-xs text-slate-500">
                    Last updated: {new Date(lastRefresh).toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
}
