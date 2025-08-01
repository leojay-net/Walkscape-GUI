'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/GuiWalletContext';
import { guiContract } from '@/lib/gui-token';
import {
    Wallet,
    Loader2,
    CheckCircle,
    AlertCircle,
    UserPlus,
    Coins
} from 'lucide-react';

interface WalletConnectionProps {
    showRegistration?: boolean;
}

export default function WalletConnection({ showRegistration = false }: WalletConnectionProps) {
    const { connect, account, isConnected, checkRegistration, address, guiTokenInfo } = useWallet();
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
            console.log('Starting registration with GUI wallet:', address);

            const success = await guiContract.registerPlayer();

            if (success) {
                console.log('✅ Player registration successful');
                setRegistrationResult({
                    success: true,
                    message: 'Welcome to the GUI ecosystem! You\'ve been registered successfully.'
                });

                // Check registration status after successful registration
                setTimeout(() => {
                    checkRegistration();
                }, 1000);
            } else {
                throw new Error('Registration failed - contract call unsuccessful');
            }
        } catch (error: unknown) {
            console.error('❌ Registration error:', error);

            let errorMessage = 'Registration failed. ';
            if (error instanceof Error && error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please try again or contact support if the issue persists.';
            }

            setRegistrationResult({
                success: false,
                message: errorMessage
            });
        } finally {
            setIsRegistering(false);
        }
    };

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
            <div className="text-center space-y-6">
                {!isConnected ? (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
                                <Wallet className="w-12 h-12 text-green-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">
                                Connect Your GUI Wallet
                            </h2>
                            <p className="text-slate-300 max-w-md mx-auto">
                                Connect your Aptos wallet to start your exploration journey with $GUI tokens
                            </p>

                            {guiTokenInfo && (
                                <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <Coins className="w-4 h-4 text-yellow-400" />
                                        <span className="text-slate-300">Current GUI Price:</span>
                                        <span className="text-green-400 font-semibold">
                                            ${guiTokenInfo.current_price_usd.toFixed(6)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Market Cap: ${(guiTokenInfo.market_cap / 1000000).toFixed(1)}M |
                                        Holders: {guiTokenInfo.holders.toLocaleString()}+
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleConnect}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                        >
                            Connect GUI Wallet
                        </button>

                        <p className="text-xs text-slate-400">
                            Powered by GUI INU - The #1 Aptos Community Token<br />
                            &quot;What is dead cannot die&quot;
                        </p>
                    </>
                ) : showRegistration ? (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full">
                                <UserPlus className="w-12 h-12 text-purple-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">
                                Register as Explorer
                            </h2>
                            <p className="text-slate-300 max-w-md mx-auto">
                                Join the GUI ecosystem and start earning rewards through exploration!
                            </p>

                            <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                <h4 className="text-sm font-semibold text-white">Registration Rewards:</h4>
                                <ul className="text-xs text-slate-300 space-y-1">
                                    <li>• 10M $GUI starting balance</li>
                                    <li>• Daily check-in rewards</li>
                                    <li>• Artifact discovery bonuses</li>
                                    <li>• Staking rewards up to 25% APY</li>
                                    <li>• Colony participation rights</li>
                                </ul>
                            </div>
                        </div>

                        {registrationResult && (
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${registrationResult.success
                                ? 'bg-green-900/30 border border-green-500/30'
                                : 'bg-red-900/30 border border-red-500/30'
                                }`}>
                                {registrationResult.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                )}
                                <p className={`text-sm ${registrationResult.success ? 'text-green-300' : 'text-red-300'
                                    }`}>
                                    {registrationResult.message}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleRegisterPlayer}
                            disabled={isRegistering}
                            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            {isRegistering ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Registering...
                                </div>
                            ) : (
                                'Register as Explorer'
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center">
                            <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full">
                                <CheckCircle className="w-12 h-12 text-green-400" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">
                                Wallet Connected
                            </h2>
                            <p className="text-slate-300 font-mono text-sm break-all bg-slate-700/30 p-3 rounded-lg">
                                {address}
                            </p>

                            {guiTokenInfo && (
                                <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-sm">
                                        <Coins className="w-4 h-4 text-yellow-400" />
                                        <span className="text-slate-300">GUI Price:</span>
                                        <span className="text-green-400 font-semibold">
                                            ${guiTokenInfo.current_price_usd.toFixed(6)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
