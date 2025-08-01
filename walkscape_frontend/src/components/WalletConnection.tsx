'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import {
    Wallet,
    User,
    Loader2,
    CheckCircle,
    AlertCircle,
    UserPlus,
    Flower2
} from 'lucide-react';

interface WalletConnectionProps {
    showRegistration?: boolean;
}

export default function WalletConnection({ showRegistration = false }: WalletConnectionProps) {
    const { connect, account, isConnected, checkRegistration, address } = useWallet();
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationResult, setRegistrationResult] = useState<{ success: boolean; message: string } | null>(null);

    const handleRegisterPlayer = async () => {
        if (!account || !address) {
            console.error('No account or address available');
            setRegistrationResult({
                success: false,
                message: 'Wallet not properly connected. Please reconnect.'
            });
            return;
        }

        setIsRegistering(true);
        setRegistrationResult(null);

        try {
            console.log('Starting registration with account:', account.address);
            console.log('Account object:', account);
            console.log('Address from context:', address);

            // Verify account has valid address
            if (!account.address || account.address === '0x0') {
                throw new Error('Invalid account address: ' + account.address);
            }

            // Simulate registration process (since the actual blockchain integration isn't complete)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

            console.log('Registration completed for:', account.address);

            setRegistrationResult({
                success: true,
                message: 'Welcome to WalkScape! Your adventure begins now.'
            });

            // Check registration status after a delay
            setTimeout(() => {
                checkRegistration();
                setIsRegistering(false);
            }, 3000);

        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Failed to register. Please try again.';

            const err = error as Error;

            if (err.message?.includes('Contract not found')) {
                errorMessage = 'Contract not found. Please check your network connection.';
            } else if (err.message?.includes('Player already registered')) {
                errorMessage = 'You are already registered! Please refresh the page.';
            } else if (err.message) {
                errorMessage = err.message;
            }

            setRegistrationResult({
                success: false,
                message: errorMessage
            });
            setIsRegistering(false);
        }
    };

    if (showRegistration && isConnected) {
        return (
            <div className="max-w-md mx-auto">
                <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl text-center transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-green-500/50">
                        <User size={32} className="text-white transition-transform duration-300" />
                    </div>

                    <h2 className="text-2xl font-bold mb-3 text-white">Join WalkScape</h2>
                    <p className="text-slate-300 text-sm mb-2 leading-relaxed">
                        Complete your registration to start exploring and collecting!
                    </p>
                    <p className="text-xs text-slate-400 mb-8 font-mono bg-slate-700/30 px-3 py-2 rounded-lg">
                        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>

                    <button
                        onClick={handleRegisterPlayer}
                        disabled={isRegistering}
                        className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6 border border-green-500/20"
                    >
                        {isRegistering ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Registering...</span>
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                                <span>Register Player</span>
                            </>
                        )}
                    </button>

                    {registrationResult && (
                        <div className={`p-4 rounded-xl border transition-all duration-500 transform animate-in slide-in-from-bottom-4 ${registrationResult.success
                                ? 'border-green-500/50 bg-green-900/20 shadow-lg shadow-green-500/10'
                                : 'border-red-500/50 bg-red-900/20 shadow-lg shadow-red-500/10'
                            }`}>
                            <div className="flex items-center gap-3 mb-2">
                                {registrationResult.success ? (
                                    <CheckCircle size={18} className="text-green-400 animate-in zoom-in duration-300" />
                                ) : (
                                    <AlertCircle size={18} className="text-red-400 animate-in zoom-in duration-300" />
                                )}
                                <span className={`font-semibold ${registrationResult.success ? 'text-green-400' : 'text-red-400'}`}>
                                    {registrationResult.success ? 'Success!' : 'Error'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                {registrationResult.message}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-xs text-slate-400 space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <p>Demo mode with simulated transactions</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <p>All features are mocked for demonstration</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <p>No real blockchain interaction required</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl text-center transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-blue-500/50">
                    <Wallet size={32} className="text-white transition-transform duration-300" />
                </div>

                <h2 className="text-2xl font-bold mb-3 text-white">Connect Your Demo Wallet</h2>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                    Connect to the demo wallet to explore WalkScape features
                </p>

                <button
                    onClick={connect}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] flex items-center justify-center gap-3 mb-6 border border-blue-500/20"
                >
                    <Wallet size={18} className="transition-transform duration-300 group-hover:rotate-12" />
                    Connect Demo Wallet
                </button>

                <div className="space-y-4 text-xs text-slate-400 mb-6">
                    <p className="font-medium text-slate-300">Demo Environment:</p>
                    <div className="flex justify-center space-x-6">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg transition-all duration-300 hover:bg-slate-700 hover:scale-105">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs font-bold">M</span>
                            </div>
                            <span className="text-slate-300">Mock Wallet</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 rounded-lg transition-all duration-300 hover:bg-slate-700 hover:scale-105">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                                <span className="text-white text-xs font-bold">D</span>
                            </div>
                            <span className="text-slate-300">Demo Mode</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30 transition-all duration-300 hover:bg-slate-700/50 hover:border-slate-500/50">
                    <h3 className="font-semibold mb-3 text-green-400 flex items-center justify-center gap-2">
                        <Flower2 size={16} className="transition-transform duration-300 hover:rotate-12" />
                        What is WalkScape?
                    </h3>
                    <div className="space-y-2 text-xs text-slate-300">
                        <div className="flex items-center gap-2 transition-all duration-200 hover:text-green-300">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <p>Explore real-world locations and claim artifacts</p>
                        </div>
                        <div className="flex items-center gap-2 transition-all duration-200 hover:text-green-300">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <p>Touch grass daily to build XP streaks</p>
                        </div>
                        <div className="flex items-center gap-2 transition-all duration-200 hover:text-green-300">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <p>Grow and care for digital pets in your biome</p>
                        </div>
                        <div className="flex items-center gap-2 transition-all duration-200 hover:text-green-300">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <p>Join colonies with other explorers</p>
                        </div>
                        <div className="flex items-center gap-2 transition-all duration-200 hover:text-green-300">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <p>Stake tokens to grow legendary companions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
