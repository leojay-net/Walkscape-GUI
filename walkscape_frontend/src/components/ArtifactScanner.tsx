'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import Webcam from 'react-webcam';
import {
    MapPin,
    Camera,
    Loader2,
    AlertCircle,
    Brain
} from 'lucide-react';
import { analyzeEnvironmentWithGemini, EnvironmentDetection } from '@/lib/aiDetection';

interface LocationData {
    lat: number;
    lng: number;
}

export default function ArtifactScanner() {
    const { isRegistered } = useWallet();
    const [location, setLocation] = useState<LocationData | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const webcamRef = useRef<Webcam>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [environmentDetection, setEnvironmentDetection] = useState<EnvironmentDetection | null>(null);
    const [aiDetectionError, setAiDetectionError] = useState<string | null>(null);

    // Scroll animations
    const headerAnimation = useScrollAnimation({ threshold: 0.2 });
    const scannerAnimation = useScrollAnimation({ threshold: 0.1 });
    const resultsAnimation = useScrollAnimation({ threshold: 0.1 });

    const handleEnvironmentAnalysis = useCallback(async () => {
        if (!webcamRef.current || !location) return;

        setIsAnalyzing(true);
        setAiDetectionError(null);
        setEnvironmentDetection(null);

        try {
            const screenshot = webcamRef.current.getScreenshot();
            if (!screenshot) {
                throw new Error('Failed to capture screenshot');
            }

            const base64Data = screenshot.split(',')[1];
            const detectionResult = await analyzeEnvironmentWithGemini(base64Data);

            if (detectionResult.success && detectionResult.data) {
                setEnvironmentDetection(detectionResult.data);
            } else {
                throw new Error(detectionResult.error || 'Unknown error during analysis');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error analyzing environment:', errorMessage);
            setAiDetectionError('Failed to analyze environment. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [location]);

    const handleLocationUpdate = useCallback(async () => {
        setIsLoadingLocation(true);
        setLocationError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error getting location:', errorMessage);
            setLocationError('Failed to get location. Please enable location services and try again.');
        } finally {
            setIsLoadingLocation(false);
        }
    }, []);

    useEffect(() => {
        if (isCameraActive) {
            handleLocationUpdate();
        }
    }, [isCameraActive, handleLocationUpdate]);

    if (!isRegistered) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Camera className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Please complete registration first</p>
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
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-emerald-500/50">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white transition-all duration-300 group-hover:text-emerald-400">Artifact Scanner</h1>
                            <p className="text-slate-400 text-sm transition-all duration-300 group-hover:text-slate-300">AI-Powered Environment Detection</p>
                        </div>
                    </div>
                </div>

                {/* Scanner Interface */}
                <div ref={scannerAnimation.ref} className={`bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-700/60 ${scannerAnimation.animationClasses}`}>
                    {isCameraActive ? (
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/50">
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                videoConstraints={{
                                    facingMode: 'environment'
                                }}
                                className="w-full h-full object-cover"
                            />
                            {/* Location indicator */}
                            <div className="absolute top-4 left-4">
                                {isLoadingLocation ? (
                                    <div className="flex items-center space-x-2 text-white bg-slate-900/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                                        <Loader2 className="animate-spin" size={16} />
                                        <span className="text-sm">Getting location...</span>
                                    </div>
                                ) : location ? (
                                    <div className="flex items-center space-x-2 text-white bg-emerald-900/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                                        <MapPin size={16} className="text-emerald-400" />
                                        <span className="text-sm">Location acquired</span>
                                    </div>
                                ) : locationError ? (
                                    <div className="flex items-center space-x-2 text-red-400 bg-red-900/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                                        <AlertCircle size={16} />
                                        <span className="text-sm">{locationError}</span>
                                    </div>
                                ) : null}
                            </div>

                            {/* Capture button */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={handleEnvironmentAnalysis}
                                    disabled={isAnalyzing || !location}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-white p-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl shadow-emerald-500/20"
                                >
                                    {isAnalyzing ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <Brain size={24} />
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center py-32">
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20">
                                    <Camera size={32} className="text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Ready to Scan</h3>
                                    <p className="text-slate-400 mb-6">Use AI to identify your environment and discover artifacts</p>
                                    <button
                                        onClick={() => setIsCameraActive(true)}
                                        className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 mx-auto"
                                    >
                                        <Camera size={20} />
                                        <span>Start Scanning</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Detection Results */}
                {environmentDetection && (
                    <div ref={resultsAnimation.ref} className={`bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl shadow-slate-900/50 transition-all duration-300 hover:shadow-slate-700/60 ${resultsAnimation.animationClasses}`}>
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                            <Brain className="w-5 h-5 text-emerald-400" />
                            Environment Analysis
                        </h3>
                        <p className="text-slate-300 mb-4 leading-relaxed">{environmentDetection.description}</p>
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-slate-400">Suggested Artifacts:</h4>
                            <div className="flex flex-wrap gap-2">
                                {environmentDetection.suggestedArtifacts.map((item, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-slate-700/50 text-emerald-400 rounded-xl text-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {aiDetectionError && (
                    <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-red-400">
                            <AlertCircle size={16} />
                            <span className="font-medium">Analysis Error</span>
                        </div>
                        <p className="text-red-300 text-sm mt-1">{aiDetectionError}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
