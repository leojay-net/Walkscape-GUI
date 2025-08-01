'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/contexts/GuiWalletContext';
import { guiContract, StakeInfo } from '@/lib/gui-token';
import {
    TrendingUp,
    Coins,
    Loader2,
    Star,
    CheckCircle,
    Info
} from 'lucide-react';

export default function GuiStaking() {
    const { refreshPlayerStats, isRegistered, playerStats, address } = useWallet();
    const [stakeInfo, setStakeInfo] = useState<StakeInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isStaking, setIsStaking] = useState(false);
    const [isUnstaking, setIsUnstaking] = useState(false);
    const [stakeAmount, setStakeAmount] = useState('');
    const [selectedLockPeriod, setSelectedLockPeriod] = useState(30);
    const [showStakeForm, setShowStakeForm] = useState(false);

    const loadStakeInfo = useCallback(async () => {
        if (!address) return;
        setIsLoading(true);
        try {
            const info = await guiContract.getStakeInfo(address);
            setStakeInfo(info ?? null);
        } catch (error) {
            console.error('Failed to load stake info:', error);
            setStakeInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    useEffect(() => {
        loadStakeInfo();
    }, [loadStakeInfo, playerStats]);

    if (!isRegistered) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Coins className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Please complete registration first</p>
                </div>
            </div>
        );
    }

    const calculatePendingRewards = () => {
        if (!stakeInfo) return 0;
        const stakingDuration = Date.now() - stakeInfo.start_time;
        const daysStaked = stakingDuration / (24 * 60 * 60 * 1000);
        return (stakeInfo.amount * stakeInfo.reward_rate / 100 / 365) * daysStaked;
    };

    const getAPYForLockPeriod = (days: number) => {
        switch (days) {
            case 30: return 5;
            case 90: return 15;
            case 180: return 25;
            default: return 5;
        }
    };

    const handleStake = async () => {
        if (!stakeAmount.trim()) return;

        const amount = parseFloat(stakeAmount) * 100000; // Convert to base units
        if (!playerStats || amount > playerStats.gui_balance) {
            alert('Insufficient GUI balance');
            return;
        }

        setIsStaking(true);
        try {
            const success = await guiContract.stakeGui(amount, selectedLockPeriod);

            if (success) {
                // Refresh data after staking
                setTimeout(() => {
                    loadStakeInfo();
                    refreshPlayerStats();
                    setIsStaking(false);
                    setStakeAmount('');
                    setShowStakeForm(false);
                }, 2000);
            } else {
                throw new Error('Staking failed');
            }
        } catch (error) {
            console.error('Failed to stake:', error);
            setIsStaking(false);
        }
    };

    const handleUnstake = async () => {
        if (!stakeInfo) return;

        setIsUnstaking(true);
        try {
            const result = await guiContract.unstakeGui();

            if (result.success) {
                setTimeout(() => {
                    loadStakeInfo();
                    refreshPlayerStats();
                    setIsUnstaking(false);
                    alert(`Unstaked ${(result.amount / 100000).toFixed(1)}M GUI + ${(result.rewards / 100000).toFixed(1)}M rewards!`);
                }, 2000);
            } else {
                throw new Error('Unstaking failed');
            }
        } catch (error) {
            console.error('Failed to unstake:', error);
            setIsUnstaking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-green-400 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-400">Loading staking info...</p>
                </div>
            </div>
        );
    }

    const pendingRewards = stakeInfo ? calculatePendingRewards() : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">GUI Staking</h1>
                            <p className="text-slate-400 text-sm">Earn passive rewards with your $GUI tokens</p>
                        </div>
                    </div>
                </div>

                {/* Staking Info */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Staking Tiers</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-green-500/20">
                            <div className="text-center">
                                <div className="text-sm text-slate-400">30 Days</div>
                                <div className="text-2xl font-bold text-green-400">5% APY</div>
                                <div className="text-xs text-slate-500">Flexible staking</div>
                            </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-blue-500/20">
                            <div className="text-center">
                                <div className="text-sm text-slate-400">90 Days</div>
                                <div className="text-2xl font-bold text-blue-400">15% APY</div>
                                <div className="text-xs text-slate-500">Enhanced rewards</div>
                            </div>
                        </div>
                        <div className="bg-slate-700/30 rounded-lg p-4 border border-purple-500/20">
                            <div className="text-center">
                                <div className="text-sm text-slate-400">180 Days</div>
                                <div className="text-2xl font-bold text-purple-400">25% APY</div>
                                <div className="text-xs text-slate-500">Maximum rewards</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Stake */}
                {stakeInfo ? (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400" />
                            Your Active Stake
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-sm text-slate-400">Staked Amount</div>
                                <div className="text-xl font-bold text-white">
                                    {(stakeInfo.amount / 100000).toFixed(1)}M GUI
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-slate-400">APY Rate</div>
                                <div className="text-xl font-bold text-green-400">
                                    {stakeInfo.reward_rate}%
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-slate-400">Pending Rewards</div>
                                <div className="text-xl font-bold text-blue-400">
                                    {(pendingRewards / 100000).toFixed(3)}M GUI
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-slate-400">Lock Period</div>
                                <div className="text-xl font-bold text-purple-400">
                                    {stakeInfo.lock_period} days
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={handleUnstake}
                                disabled={isUnstaking}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                            >
                                {isUnstaking ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Unstaking...
                                    </div>
                                ) : (
                                    'Unstake & Claim Rewards'
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <div className="text-center space-y-4">
                            <Coins className="w-12 h-12 text-slate-400 mx-auto" />
                            <h3 className="text-lg font-semibold text-white">No Active Stakes</h3>
                            <p className="text-slate-400">Start staking your GUI tokens to earn passive rewards!</p>
                            <button
                                onClick={() => setShowStakeForm(true)}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Start Staking
                            </button>
                        </div>
                    </div>
                )}

                {/* Staking Form */}
                {showStakeForm && (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white mb-4">Stake GUI Tokens</h3>

                        <div className="space-y-4">
                            {/* Available Balance */}
                            <div className="bg-slate-700/30 rounded-lg p-4">
                                <div className="text-sm text-slate-400">Available Balance</div>
                                <div className="text-xl font-bold text-white">
                                    {playerStats ? (playerStats.gui_balance / 100000).toFixed(1) : '0'}M GUI
                                </div>
                            </div>

                            {/* Stake Amount */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Stake Amount (millions)
                                </label>
                                <input
                                    type="number"
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    placeholder="Enter amount in millions (e.g., 5 for 5M GUI)"
                                    className="w-full bg-slate-700/50 text-white border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
                                />
                            </div>

                            {/* Lock Period */}
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">
                                    Lock Period
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[30, 90, 180].map((days) => (
                                        <button
                                            key={days}
                                            onClick={() => setSelectedLockPeriod(days)}
                                            className={`p-3 rounded-lg border text-center transition-all ${selectedLockPeriod === days
                                                ? 'bg-green-500/20 border-green-500 text-green-400'
                                                : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                                                }`}
                                        >
                                            <div className="text-sm font-semibold">{days} Days</div>
                                            <div className="text-xs">{getAPYForLockPeriod(days)}% APY</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Projected Rewards */}
                            {stakeAmount && (
                                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Info className="w-4 h-4 text-blue-400" />
                                        <span className="text-sm font-medium text-blue-400">Projected Rewards</span>
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        Staking {stakeAmount}M GUI for {selectedLockPeriod} days at {getAPYForLockPeriod(selectedLockPeriod)}% APY
                                        will earn approximately{' '}
                                        <span className="text-green-400 font-semibold">
                                            {((parseFloat(stakeAmount) * getAPYForLockPeriod(selectedLockPeriod) / 100 / 365) * selectedLockPeriod).toFixed(3)}M GUI
                                        </span>{' '}
                                        in rewards.
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowStakeForm(false)}
                                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleStake}
                                    disabled={isStaking || !stakeAmount}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                >
                                    {isStaking ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Staking...
                                        </div>
                                    ) : (
                                        'Stake GUI'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Benefits */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Staking Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                            <div>
                                <div className="text-white font-medium">Passive Income</div>
                                <div className="text-sm text-slate-400">Earn GUI tokens automatically while staked</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                            <div>
                                <div className="text-white font-medium">Ecosystem Support</div>
                                <div className="text-sm text-slate-400">Help secure and grow the GUI ecosystem</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                            <div>
                                <div className="text-white font-medium">Flexible Terms</div>
                                <div className="text-sm text-slate-400">Choose lock periods that fit your strategy</div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                            <div>
                                <div className="text-white font-medium">Community Power</div>
                                <div className="text-sm text-slate-400">Higher staking rewards for community participants</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
