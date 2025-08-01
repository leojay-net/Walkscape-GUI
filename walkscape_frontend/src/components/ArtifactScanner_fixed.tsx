'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import Webcam from 'react-webcam';
import {
    MapPin,
    Camera,
    Loader2,
    AlertCircle,
    Brain
} from 'lucide-react';
import { analyzeEnvironmentWithGemini } from '@/lib/aiDetection';
// Ensure EnvironmentDetection type safety
interface EnvironmentDetection {
    description: string;
    suggestedArtifacts: string[];
}

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

    const handleEnvironmentAnalysis = useCallback(async () => {
        if (!webcamRef.current || !location) return;

        setIsAnalyzing(true);
        setAiDetectionError(null);
        setEnvironmentDetection(null);

        try {
            const screenshot = webcamRef.current?.getScreenshot();
            if (!screenshot) {
                throw new Error('Failed to capture screenshot');
            }

            // Pass screenshot string directly
            const detectionResult = await analyzeEnvironmentWithGemini(screenshot);
            console.log('AI Detection Result:', detectionResult);

            if (detectionResult.success && detectionResult.data) {
                setEnvironmentDetection(detectionResult.data);
            } else if (detectionResult.error) {
                setAiDetectionError(detectionResult.error);
            }
        } catch (error) {
            console.error('Error analyzing environment:', error);
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
        } catch (error) {
            console.error('Error getting location:', error);
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
        <div className="relative min-h-[500px] bg-slate-900 rounded-lg p-4">
            <div className="flex flex-col h-full">
                {isCameraActive ? (
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{
                                facingMode: 'environment'
                            }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                            {isLoadingLocation ? (
                                <div className="flex items-center space-x-2 text-white">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span className="text-sm">Getting location...</span>
                                </div>
                            ) : location ? (
                                <div className="flex items-center space-x-2 text-white">
                                    <MapPin size={16} className="text-emerald-400" />
                                    <span className="text-sm">Location acquired</span>
                                </div>
                            ) : locationError ? (
                                <div className="flex items-center space-x-2 text-red-400">
                                    <AlertCircle size={16} />
                                    <span className="text-sm">{locationError}</span>
                                </div>
                            ) : null}
                        </div>

                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <button
                                onClick={handleEnvironmentAnalysis}
                                disabled={isAnalyzing || !location}
                                aria-label="Analyze environment"
                                className="bg-emerald-500 text-white p-4 rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="flex-1 flex items-center justify-center">
                        <button
                            onClick={() => setIsCameraActive(true)}
                            aria-label="Start scanning"
                            className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                            <Camera size={20} />
                            <span>Start Scanning</span>
                        </button>
                    </div>
                )}

                {environmentDetection && (
                    <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">Environment Analysis</h3>
                        <p className="text-slate-300 mb-2">{environmentDetection.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {environmentDetection.suggestedArtifacts.map((item: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-slate-700 text-emerald-400 rounded-full text-sm"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {aiDetectionError && (
                    <div className="mt-4 p-4 bg-red-900/50 text-red-400 rounded-lg">
                        {aiDetectionError}
                    </div>
                )}
            </div>
        </div>
    );
}
