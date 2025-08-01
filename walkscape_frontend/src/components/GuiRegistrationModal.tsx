'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/GuiWalletContext';
import { guiContract } from '@/lib/gui-token';
import {
    X,
    User,
    Loader2,
    CheckCircle,
    AlertCircle,
    Coins,
    Gift,
    Users,
    TreePine,
    Star
} from 'lucide-react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
    const { account, address, checkRegistration, guiTokenInfo } = useWallet();
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationStep, setRegistrationStep] = useState<'welcome' | 'registering' | 'success' | 'error'>('welcome');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setRegistrationStep('welcome');
            setErrorMessage('');
        }
    }, [isOpen]);

    const handleRegister = async () => {
        if (!account || !address) {
            setErrorMessage('Wallet not properly connected. Please reconnect.');
            setRegistrationStep('error');
            return;
        }

        setIsRegistering(true);
        setRegistrationStep('registering');

        try {
            console.log('Starting registration for address:', address);

            if (await guiContract.registerPlayer()) {
                console.log('✅ Registration successful');
                setRegistrationStep('success');

                // Wait a moment then check registration and close modal
                setTimeout(async () => {
                    await checkRegistration();
                    onClose();
                }, 3000);
            } else {
                throw new Error('Registration failed - unable to register player');
            }
        } catch (error: unknown) {
            console.error('❌ Registration error:', error);
            if (error instanceof Error) {
                setErrorMessage(error.message || 'Registration failed. Please try again.');
            } else {
                setErrorMessage('Registration failed. Please try again.');
            }
            setRegistrationStep('error');
        } finally {
            setIsRegistering(false);
        }
    };

    const handleRetry = () => {
        setRegistrationStep('welcome');
        setErrorMessage('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Join the GUI Ecosystem</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                        disabled={isRegistering}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {registrationStep === 'welcome' && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    Welcome to WalkScape!
                                </h3>
                                <p className="text-slate-300 text-sm">
                                    Register as an explorer and start earning $GUI tokens through real-world adventures.
                                </p>
                            </div>

                            {/* Registration Benefits */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Gift className="w-4 h-4 text-yellow-400" />
                                    Registration Rewards
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                        <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                                        <div className="text-xs text-white font-semibold">10M $GUI</div>
                                        <div className="text-xs text-slate-400">Starting Balance</div>
                                    </div>
                                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                        <Star className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                                        <div className="text-xs text-white font-semibold">Daily Rewards</div>
                                        <div className="text-xs text-slate-400">Check-in Bonuses</div>
                                    </div>
                                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                        <TreePine className="w-6 h-6 text-green-400 mx-auto mb-1" />
                                        <div className="text-xs text-white font-semibold">Pet Adoption</div>
                                        <div className="text-xs text-slate-400">Digital Companions</div>
                                    </div>
                                    <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                                        <Users className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                                        <div className="text-xs text-white font-semibold">Colony Access</div>
                                        <div className="text-xs text-slate-400">Community Building</div>
                                    </div>
                                </div>
                            </div>

                            {/* GUI Token Info */}
                            {guiTokenInfo && (
                                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg p-4 border border-green-500/20">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-400 mb-1">Current GUI Price</div>
                                        <div className="text-lg font-bold text-green-400">
                                            ${guiTokenInfo.current_price_usd.toFixed(6)}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            Market Cap: ${(guiTokenInfo.market_cap / 1000000).toFixed(1)}M
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleRegister}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
                            >
                                Register as Explorer
                            </button>

                            <p className="text-xs text-slate-400 text-center">
                                Powered by GUI INU - &quot;What is dead cannot die&quot;
                            </p>
                        </div>
                    )}

                    {registrationStep === 'registering' && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Registering Your Account
                            </h3>
                            <p className="text-slate-300 text-sm">
                                Setting up your explorer profile and allocating your starting $GUI tokens...
                            </p>
                            <div className="text-xs text-slate-400">
                                This may take a few moments
                            </div>
                        </div>
                    )}

                    {registrationStep === 'success' && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Welcome to the Adventure!
                            </h3>
                            <p className="text-slate-300 text-sm">
                                Your explorer account has been successfully created. You now have 10M $GUI tokens to start your journey!
                            </p>
                            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                                <div className="text-sm text-green-300">
                                    ✅ Account registered<br />
                                    ✅ 10M $GUI allocated<br />
                                    ✅ Ready to explore!
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">
                                Redirecting to dashboard...
                            </p>
                        </div>
                    )}

                    {registrationStep === 'error' && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Registration Failed
                            </h3>
                            <p className="text-slate-300 text-sm">
                                {errorMessage}
                            </p>
                            <div className="space-y-2">
                                <button
                                    onClick={handleRetry}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full text-slate-400 hover:text-white text-sm transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
