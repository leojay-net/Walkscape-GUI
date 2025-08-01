'use client';

import { useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import {
    Trophy,
    Heart,
    Zap,
    PawPrint,
    Users,
    Coins,
    Flame,
    Star,
    Sparkles,
    Leaf,
    Target,
    Clock,
    Award,
    ChevronRight,
    Activity,
    User
} from 'lucide-react';

export default function Dashboard() {
    const { playerStats, refreshPlayerStats, address, isRegistered, isLoading } = useWallet();

    // Debug log
    console.log('Dashboard state:', {
        isRegistered,
        isLoading,
        hasPlayerStats: !!playerStats,
        address: address?.slice(0, 8)
    });

    useEffect(() => {
        // Refresh stats when component mounts if user is registered
        if (isRegistered && !playerStats && !isLoading) {
            console.log('Attempting to refresh player stats...');
            refreshPlayerStats();
        }
    }, [isRegistered, playerStats, refreshPlayerStats, isLoading]);

    useEffect(() => {
        // Refresh stats every 30 seconds if user is registered
        if (isRegistered) {
            const interval = setInterval(() => {
                refreshPlayerStats();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [refreshPlayerStats, isRegistered]);

    const calculateLevel = (xp: bigint): number => {
        return Number(xp) / 100;
    };

    const formatXP = (xp: bigint): string => {
        return Number(xp).toLocaleString();
    };

    const getStreakIcon = (streakNum: bigint) => {
        const streak = Number(streakNum);
        if (streak >= 14) return <Star className="w-6 h-6 text-gray-300" />;
        if (streak >= 7) return <Sparkles className="w-6 h-6 text-green-300" />;
        if (streak >= 3) return <Leaf className="w-6 h-6 text-green-400" />;
        return <Leaf className="w-6 h-6 text-green-300" />;
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

    // Show registration prompt if not registered
    if (!isRegistered) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Please complete registration first</p>
                </div>
            </div>
        );
    }

    // Show loading or error if no stats
    if (!playerStats) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-slate-400 mt-4">Loading player stats...</p>
                </div>
            </div>
        );
    }

    const actualStats = playerStats;
    const currentLevel = calculateLevel(BigInt(actualStats.walks_xp));
    const nextLevelXp = (Math.floor(currentLevel) + 1) * 100;
    const xpProgress = () => {
        const currentXp = Number(actualStats.walks_xp);
        const levelFloor = Math.floor(currentLevel) * 100;
        return ((currentXp - levelFloor) / (nextLevelXp - levelFloor)) * 100;
    };

    return (
        <div className="grid gap-4">
            {/* Header section */}
            <div className="bg-slate-900 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-white">Player Stats</h1>
                    <div className="text-sm text-slate-400">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                        <div>
                            Level {calculateLevel(BigInt(actualStats.walks_xp))} • {formatXP(BigInt(actualStats.walks_xp))} XP
                        </div>
                        <button
                            onClick={refreshPlayerStats}
                            className="text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <Activity size={16} />
                        </button>
                    </div>
                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-emerald-500"
                            style={{ width: `${xpProgress()}%` }}
                        />
                    </div>
                    <div className="text-xs text-slate-500 text-center">
                        <span>{Math.round(xpProgress())}% to Level {Math.floor(currentLevel) + 1}</span>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Daily Streak */}
                <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <Flame size={20} />
                        <span>Daily Streak</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getStreakIcon(BigInt(actualStats.grass_touch_streak))}</span>
                        <span className="text-2xl font-bold text-white">{actualStats.grass_touch_streak} days</span>
                    </div>
                </div>

                {/* GUI Balance */}
                <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <Coins size={20} />
                        <span>GUI Balance</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{actualStats.gui_balance.toLocaleString()}</p>
                </div>

                {/* Colony */}
                <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <Users size={20} />
                        <span>Colony</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{actualStats.current_colony || 'None'}</p>
                </div>

                {/* Pets */}
                <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <PawPrint size={20} />
                        <span>Pets</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{actualStats.pets_owned}</p>
                </div>

                {/* Level */}
                <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <Trophy size={20} />
                        <span>Level</span>
                    </div>
                    <p className="text-2xl font-bold text-green-400">{calculateLevel(BigInt(actualStats.walks_xp))}</p>
                </div>

                {/* Total XP */}
                <div className="bg-slate-900 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-slate-400 mb-2">
                        <Zap size={20} />
                        <span>Total XP</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-300">{formatXP(BigInt(actualStats.walks_xp))}</p>
                </div>
            </div>

            {/* Health Stats */}
            <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <Heart size={20} className="text-rose-400" />
                        <h2 className="text-white font-semibold">Health Stats</h2>
                    </div>
                    <button
                        onClick={() => {/* Handle click */ }}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-400">Health Score</span>
                            <span className="text-white">{actualStats.health_score}</span>
                        </div>
                        <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-rose-500"
                                style={{ width: `${actualStats.health_score}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <Award size={20} className="text-gray-300" />
                        <h2 className="text-white font-semibold">Achievements</h2>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    {/* Daily Streak Achievement */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <Leaf size={16} className={
                                    actualStats.grass_touch_streak >= 7
                                        ? 'text-green-400'
                                        : 'text-slate-600'
                                } />
                                <span className="text-sm text-slate-400">7 Day Streak</span>
                            </div>
                            <span className="text-sm text-white">
                                {actualStats.grass_touch_streak}/7 days
                            </span>
                        </div>
                        <div className="relative h-1 bg-slate-700 rounded-full overflow-hidden">
                            <div
                                className="absolute left-0 top-0 h-full bg-green-500"
                                style={{ width: `${Math.min(100, (Number(actualStats.grass_touch_streak) / 7) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Artifact Collection */}
            <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <Target size={20} className="text-gray-300" />
                        <h2 className="text-white font-semibold">Artifacts</h2>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-slate-400 mb-1">Total Collected</div>
                            <div className="text-2xl font-bold text-white">{actualStats.total_artifacts}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Activity */}
            <div className="bg-slate-900 p-4 rounded-lg">
                <div className="flex items-center space-x-2 text-slate-400 mb-2">
                    <Clock size={20} className="text-slate-400" />
                    <span>Last Check-in</span>
                </div>
                <p className="text-white">
                    {new Date(Number(actualStats.last_checkin)).toLocaleString()}
                </p>
            </div>
        </div>
    );
}
