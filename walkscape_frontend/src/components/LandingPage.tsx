'use client';

import { useState } from 'react';
import { useWallet } from '@/contexts/GuiWalletContext';
import { useScrollAnimation, useStaggeredScrollAnimation } from '@/hooks/useScrollAnimation';
import {
    Play,
    Zap,
    Users,
    Coins,
    Shield,
    Globe,
    Smartphone,
    Heart,
    Star,
    TreePine,
    MapPin,
    Trophy,
    ChevronRight,
    ExternalLink,
    Github,
    Twitter
} from 'lucide-react';

export default function LandingPage() {
    const { connect, isLoading } = useWallet();
    const [activeFeature, setActiveFeature] = useState(0);

    // Scroll animations
    const heroAnimation = useScrollAnimation({ threshold: 0.2 });
    const featuresAnimation = useScrollAnimation({ threshold: 0.1 });
    const howItWorksAnimation = useScrollAnimation({ threshold: 0.1 });
    const communityAnimation = useScrollAnimation({ threshold: 0.1 });
    const { containerRef: statsRef, getItemClasses: getStatsClasses } = useStaggeredScrollAnimation(4, 150);
    const { containerRef: stepsRef, getItemClasses: getStepsClasses } = useStaggeredScrollAnimation(3, 200);

    const features = [
        {
            icon: <MapPin className="w-8 h-8 text-green-400" />,
            title: "Explore & Discover",
            description: "Turn every walk into an adventure. Discover hidden artifacts and unlock new biomes as you explore the real world."
        },
        {
            icon: <TreePine className="w-8 h-8 text-green-300" />,
            title: "Collect Companions",
            description: "Find and nurture magical pets that accompany you on your journey. Each companion has unique abilities and traits."
        },
        {
            icon: <Users className="w-8 h-8 text-gray-300" />,
            title: "Build Communities",
            description: "Join or create colonies with other explorers. Share resources, plan expeditions, and grow together."
        },
        {
            icon: <Coins className="w-8 h-8 text-white" />,
            title: "Earn & Stake",
            description: "Stake your tokens for growth rewards. The more you walk and explore, the more you earn."
        }
    ];

    const stats = [
        { label: "Steps Tracked", value: "1M+", icon: <Zap className="w-5 h-5" /> },
        { label: "Artifacts Found", value: "15K+", icon: <Star className="w-5 h-5" /> },
        { label: "Active Explorers", value: "500+", icon: <Users className="w-5 h-5" /> },
        { label: "Colonies Formed", value: "50+", icon: <Shield className="w-5 h-5" /> }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 shadow-lg shadow-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-green-500/50">
                                <TreePine className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold transition-all duration-300 group-hover:text-green-400">WalkScape</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 hover:text-green-400 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">Features</a>
                            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 hover:text-green-400 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">How it Works</a>
                            <a href="#community" className="text-slate-300 hover:text-white transition-all duration-300 hover:scale-105 hover:text-green-400 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-green-400 after:transition-all after:duration-300 hover:after:w-full">Community</a>
                            <button
                                onClick={connect}
                                disabled={isLoading}
                                className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? 'Connecting...' : 'Launch App'}
                            </button>
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={connect}
                                disabled={isLoading}
                                className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 disabled:opacity-50"
                            >
                                {isLoading ? 'Connecting...' : 'Launch'}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={heroAnimation.ref} className="relative pt-20 pb-32 overflow-hidden bg-slate-950">
                <div className="absolute inset-0 bg-slate-950"></div>
                <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping shadow-lg shadow-blue-400/50"></div>
                <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce shadow-lg shadow-purple-400/50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className={`text-center lg:text-left ${heroAnimation.animationClasses}`}>
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 group">
                                <span className="block text-white transition-all duration-500 group-hover:scale-105 group-hover:text-green-400 inline-block animate-in slide-in-from-left-8 fade-in duration-1000 delay-200">Explore.</span>
                                <span className="block text-green-400 transition-all duration-500 delay-100 group-hover:scale-105 group-hover:text-white inline-block animate-in slide-in-from-left-8 fade-in duration-1000 delay-400">Discover.</span>
                                <span className="block text-gray-300 transition-all duration-500 delay-200 group-hover:scale-105 group-hover:text-green-400 inline-block animate-in slide-in-from-left-8 fade-in duration-1000 delay-600">Earn.</span>
                            </h1>

                            <p className="text-xl text-slate-300 mb-8 max-w-2xl transition-all duration-300 hover:text-slate-200 animate-in slide-in-from-bottom-4 fade-in duration-800 delay-800">
                                The first social exploration game that turns your daily walks into epic adventures.
                                Built on Aptos, powered by $GUI token.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-in slide-in-from-bottom-6 fade-in duration-800 delay-1000">
                                <button
                                    onClick={connect}
                                    disabled={isLoading}
                                    className="bg-green-500 hover:bg-green-400 text-white rounded-2xl border border-green-400/20 shadow-2xl shadow-green-500/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/40 active:scale-[0.98] flex items-center justify-center gap-2 text-lg px-8 py-4"
                                >
                                    <Play className="w-5 h-5" />
                                    {isLoading ? 'Connecting Wallet...' : 'Start Exploring'}
                                </button>

                                <a
                                    href="#how-it-works"
                                    className="bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-2xl border border-slate-600/30 shadow-xl shadow-slate-900/30 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-slate-700/40 active:scale-[0.98] flex items-center justify-center gap-2 text-lg px-8 py-4"
                                >
                                    Learn More
                                    <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>
                            </div>

                            {/* Stats */}
                            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
                                {stats.map((stat, index) => (
                                    <div key={index} className={`text-center lg:text-left group cursor-pointer ${getStatsClasses(index)}`}>
                                        <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 transition-all duration-300 group-hover:scale-110">
                                            <div className="transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                                                {stat.icon}
                                            </div>
                                            <span className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-green-400">{stat.value}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className={`relative group ${heroAnimation.animationClasses} animate-in slide-in-from-right-8 fade-in duration-1000 delay-1200`}>
                            <div className="relative bg-slate-800/50 hover:bg-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-slate-900/50 border border-slate-600/30 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-slate-700/60">
                                <div className="bg-slate-900/80 rounded-2xl p-6 mb-6 shadow-xl shadow-slate-900/40 transition-all duration-300 hover:shadow-slate-800/60">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-green-500/50">
                                            <MapPin className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold transition-all duration-300 group-hover:text-green-400">Daily Quest</h3>
                                            <p className="text-sm text-slate-400 transition-all duration-300 group-hover:text-slate-300">Discover Forest Biome</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/80 rounded-lg p-4 shadow-lg shadow-slate-900/30 transition-all duration-300 hover:shadow-slate-800/50">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-slate-300">Progress</span>
                                            <span className="text-sm text-green-400 font-medium">75%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2 shadow-inner">
                                            <div className="bg-green-400 h-2 rounded-full shadow-lg shadow-green-400/30 transition-all duration-1000 hover:shadow-green-400/50" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-900/80 rounded-xl p-4 text-center shadow-lg shadow-slate-900/40 transition-all duration-300 hover:scale-105 hover:shadow-yellow-400/20 group/card">
                                        <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2 transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-12" />
                                        <div className="text-lg font-bold transition-all duration-300 group-hover/card:text-yellow-400">1,247</div>
                                        <div className="text-xs text-slate-400 transition-all duration-300 group-hover/card:text-slate-300">XP Earned</div>
                                    </div>
                                    <div className="bg-slate-900/80 rounded-xl p-4 text-center shadow-lg shadow-slate-900/40 transition-all duration-300 hover:scale-105 hover:shadow-red-400/20 group/card">
                                        <Heart className="w-8 h-8 text-red-400 mx-auto mb-2 transition-all duration-300 group-hover/card:scale-110 group-hover/card:animate-pulse" />
                                        <div className="text-lg font-bold transition-all duration-300 group-hover/card:text-red-400">3</div>
                                        <div className="text-xs text-slate-400 transition-all duration-300 group-hover/card:text-slate-300">Pets Found</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl shadow-blue-500/50 transition-all duration-300 hover:scale-110">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-110 hover:rotate-12">
                                <Coins className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresAnimation.ref} id="features" className="py-24 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 ${featuresAnimation.animationClasses}`}>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 group">
                            Why Choose <span className="text-green-400 transition-all duration-300 group-hover:scale-110 inline-block">WalkScape</span>?
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto transition-all duration-300 hover:text-slate-200">
                            Experience the perfect blend of fitness, gaming, and blockchain technology.
                            Every step you take has real value and purpose.
                        </p>
                    </div>

                    <div className={`grid lg:grid-cols-2 gap-8 items-center ${featuresAnimation.animationClasses}`}>
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-left-6 fade-in duration-600 ${activeFeature === index
                                        ? 'bg-slate-800/80 border-green-500 shadow-2xl shadow-green-500/30 backdrop-blur-md'
                                        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-800/50 backdrop-blur-sm'
                                        }`}
                                    onClick={() => setActiveFeature(index)}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 transition-all duration-300 hover:scale-110 hover:rotate-6">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold mb-2 transition-all duration-300 ${activeFeature === index ? 'text-green-400' : 'hover:text-green-400'}`}>{feature.title}</h3>
                                            <p className="text-slate-300 transition-all duration-300 hover:text-slate-200">{feature.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:pl-12">
                            <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50 shadow-2xl shadow-slate-900/50 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-slate-700/60 group">
                                <div className="aspect-square bg-slate-900/80 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-slate-800/60">
                                    <Smartphone className="w-24 h-24 text-slate-600 transition-all duration-300 group-hover:scale-110 group-hover:text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 transition-all duration-300 group-hover:text-green-400">Mobile-First Experience</h3>
                                <p className="text-slate-300 mb-6 transition-all duration-300 group-hover:text-slate-200">
                                    Designed for modern explorers. Our mobile-optimized interface ensures
                                    seamless gameplay wherever your adventures take you.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-400 transition-all duration-300 hover:text-slate-300">
                                        <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
                                        iOS Compatible
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 transition-all duration-300 hover:text-slate-300">
                                        <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse"></div>
                                        Android Ready
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section ref={howItWorksAnimation.ref} id="how-it-works" className="py-24 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 ${howItWorksAnimation.animationClasses}`}>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 group">
                            Start Your <span className="text-blue-400 transition-all duration-300 group-hover:scale-110 inline-block">Journey</span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto transition-all duration-300 hover:text-slate-200">
                            Getting started is easy. Connect your wallet, create your explorer,
                            and begin your adventure in just three simple steps.
                        </p>
                    </div>

                    <div ref={stepsRef} className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Connect Wallet",
                                description: "Connect your Aptos wallet to securely store your progress and earn $GUI token rewards.",
                                icon: <Shield className="w-12 h-12 text-green-400" />
                            },
                            {
                                step: "02",
                                title: "Create Explorer",
                                description: "Set up your unique explorer profile and choose your starting biome preference.",
                                icon: <Users className="w-12 h-12 text-blue-400" />
                            },
                            {
                                step: "03",
                                title: "Start Walking",
                                description: "Begin exploring! Every step counts towards discovering artifacts and earning XP.",
                                icon: <Globe className="w-12 h-12 text-purple-400" />
                            }
                        ].map((item, index) => (
                            <div key={index} className={`text-center group ${getStepsClasses(index)}`}>
                                <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50 shadow-2xl shadow-slate-900/50 backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-slate-700/60 hover:border-slate-600/50">
                                    <div className="text-6xl font-bold text-slate-700 mb-4 transition-all duration-300 group-hover:text-slate-600 group-hover:scale-110">{item.step}</div>
                                    <div className="mb-6 flex justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-4 transition-all duration-300 group-hover:text-green-400">{item.title}</h3>
                                    <p className="text-slate-300 transition-all duration-300 group-hover:text-slate-200">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Section */}
            <section ref={communityAnimation.ref} id="community" className="py-24 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`text-center mb-16 ${communityAnimation.animationClasses}`}>
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6 group">
                            Join the <span className="text-purple-400 transition-all duration-300 group-hover:scale-110 inline-block">Community</span>
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto transition-all duration-300 hover:text-slate-200">
                            Connect with fellow explorers, share your discoveries, and shape the future of WalkScape.
                        </p>
                    </div>

                    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${communityAnimation.animationClasses}`}>
                        {[
                            {
                                title: "Discord Community",
                                description: "Chat with explorers, get tips, and stay updated on new features.",
                                members: "500+ Members",
                                link: "#",
                                color: "text-purple-400"
                            },
                            {
                                title: "GitHub",
                                description: "Contribute to development, report bugs, and suggest improvements.",
                                members: "Open Source",
                                link: "#",
                                color: "text-blue-400"
                            },
                            {
                                title: "Twitter",
                                description: "Follow for updates, community highlights, and exciting announcements.",
                                members: "1K+ Followers",
                                link: "#",
                                color: "text-green-400"
                            }
                        ].map((community, index) => (
                            <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-slate-700/60 hover:border-slate-600/50 group">
                                <h3 className="text-xl font-bold mb-3 transition-all duration-300 group-hover:text-green-400">{community.title}</h3>
                                <p className="text-slate-300 mb-4 transition-all duration-300 group-hover:text-slate-200">{community.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${community.color} font-medium transition-all duration-300 group-hover:scale-105`}>{community.members}</span>
                                    <a
                                        href={community.link}
                                        className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-all duration-300 hover:scale-105 group-hover:text-green-400"
                                    >
                                        Join <ExternalLink className="w-4 h-4 transition-all duration-300 group-hover:rotate-12" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-950">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 group">
                        Ready to <span className="text-green-400 transition-all duration-300 group-hover:scale-110 inline-block">Explore</span>?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 transition-all duration-300 hover:text-slate-200">
                        Your adventure awaits. Connect your wallet and start discovering the world around you.
                    </p>
                    <button
                        onClick={connect}
                        disabled={isLoading}
                        className="bg-green-500 hover:bg-green-400 text-white rounded-2xl border border-green-400/20 shadow-2xl shadow-green-500/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-green-500/40 active:scale-[0.98] text-lg px-12 py-4 mb-8"
                    >
                        {isLoading ? 'Connecting...' : 'Launch WalkScape'}
                    </button>
                    <div className="text-sm text-slate-400 transition-all duration-300 hover:text-slate-300">
                        Powered by GUI INU • Built for Explorers
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-800/50 py-12 bg-slate-900/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0 group">
                            <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-green-500/50">
                                <TreePine className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold transition-all duration-300 group-hover:text-green-400">WalkScape</span>
                        </div>

                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:text-green-400">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-all duration-300 hover:scale-110 hover:text-green-400">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <span className="text-slate-400 text-sm transition-all duration-300 hover:text-slate-300">© 2025 WalkScape. All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
