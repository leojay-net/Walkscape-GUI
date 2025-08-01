'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '@/contexts/GuiWalletContext';
import { guiContract } from '@/lib/gui-token';
import Webcam from 'react-webcam';
import {
    QrCode,
    MapPin,
    Camera,
    Loader2,
    CheckCircle,
    AlertCircle,
    Zap,
    Gem,
    Palette,
    Bone,
    Sprout,
    CameraOff,
    Brain,
    Coins
} from 'lucide-react';
import {
    analyzeEnvironmentWithGemini,
    analyzeEnvironmentWithAlternative,
    getConfidenceColor,
    formatConfidence,
    EnvironmentDetection,
    DetectionResult
} from '@/lib/aiDetection';

// Artifact types for GUI ecosystem
const GUI_ARTIFACT_TYPES = {
    MUSHROOM: { id: 1, name: 'Mushroom', icon: Sprout, color: 'text-green-400', rarity: 'Common' },
    GRAFFITI: { id: 2, name: 'Graffiti', icon: Palette, color: 'text-purple-400', rarity: 'Uncommon' },
    FOSSIL: { id: 3, name: 'Fossil', icon: Bone, color: 'text-orange-400', rarity: 'Rare' },
    PIXEL_PLANT: { id: 4, name: 'Pixel Plant', icon: Gem, color: 'text-blue-400', rarity: 'Epic' },
    GUI_CRYSTAL: { id: 5, name: 'GUI Crystal', icon: Zap, color: 'text-yellow-400', rarity: 'Legendary' }
};

export default function GuiArtifactScanner() {
    const { account, refreshPlayerStats, isRegistered, isLoading, playerStats } = useWallet();
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string; guiReward?: number } | null>(null);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [selectedArtifactType, setSelectedArtifactType] = useState<keyof typeof GUI_ARTIFACT_TYPES>('MUSHROOM');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const webcamRef = useRef<Webcam>(null);

    // AI Environment Detection state
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [environmentDetection, setEnvironmentDetection] = useState<EnvironmentDetection | null>(null);
    const [aiDetectionError, setAiDetectionError] = useState<string | null>(null);

    // Dynamic imports for browser-specific functionality
    const [browserAPIsLoaded, setBrowserAPIsLoaded] = useState(false);

    // Enhanced location request with comprehensive error handling and fallback strategies
    const requestLocation = useCallback(async () => {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by this browser');
            setIsLoadingLocation(false);
            return;
        }

        // Define options for different accuracy levels
        const highAccuracyOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 30000
        };

        // Success handler
        const onSuccess = (position: GeolocationPosition) => {
            const { latitude, longitude, accuracy } = position.coords;
            setLocation({
                lat: latitude,
                lng: longitude
            });
            setIsLoadingLocation(false);
            console.log(`Location acquired: ${latitude}, ${longitude} (accuracy: ${accuracy}m)`);
        };

        // Error handler with fallback
        const onError = (error: GeolocationPositionError) => {
            console.error('Location error:', error);
            let errorMessage = 'Unknown location error';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Please enable location services.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable. Check your device settings.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Trying with lower accuracy...';
                    break;
            }

            setLocationError(errorMessage);
            setIsLoadingLocation(false);
        };

        try {
            navigator.geolocation.getCurrentPosition(onSuccess, onError, highAccuracyOptions);
        } catch (error) {
            setLocationError('Failed to request location');
            setIsLoadingLocation(false);
        }
    }, []);

    // Load browser-specific APIs
    useEffect(() => {
        const loadBrowserAPIs = async () => {
            try {
                // Browser APIs loading can be added here if needed
                setBrowserAPIsLoaded(true);
                console.log('Browser APIs loaded successfully');
            } catch (error) {
                console.warn('Failed to load some browser APIs:', error);
                setBrowserAPIsLoaded(true); // Continue without optional features
            }
        };

        loadBrowserAPIs();
    }, []);

    // Auto-request location on component mount
    useEffect(() => {
        if (browserAPIsLoaded) {
            requestLocation();
        }
    }, [browserAPIsLoaded, requestLocation]);

    const handleCapture = useCallback(async () => {
        if (!webcamRef.current) return;

        setIsCapturing(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            setCapturedImage(imageSrc);

            // Trigger AI analysis automatically after capture
            if (imageSrc) {
                analyzeEnvironment(imageSrc);
            }
        } catch (error) {
            console.error('Failed to capture image:', error);
        } finally {
            setIsCapturing(false);
        }
    }, []);

    const analyzeEnvironment = async (imageData: string) => {
        setIsAnalyzing(true);
        setAiDetectionError(null);
        setEnvironmentDetection(null);

        try {
            console.log('🧠 Starting AI environment analysis...');

            // Try Gemini first, fallback to alternative if needed
            let result: DetectionResult;

            try {
                result = await analyzeEnvironmentWithGemini(imageData);
                if (!result.success && result.error?.includes('API_KEY')) {
                    console.log('Gemini API key not available, using alternative analysis...');
                    result = await analyzeEnvironmentWithAlternative(imageData);
                }
            } catch (error) {
                console.log('Gemini analysis failed, using alternative:', error);
                result = await analyzeEnvironmentWithAlternative(imageData);
            }

            if (result.success && result.data) {
                setEnvironmentDetection(result.data);
                console.log('✅ Environment analysis complete:', result.data);

                // Auto-suggest artifact type based on environment
                const suggestedArtifacts = result.data.suggestedArtifacts;
                if (suggestedArtifacts.length > 0) {
                    const firstSuggestion = suggestedArtifacts[0];
                    // Map suggested artifact to our GUI artifact types
                    const artifactMapping: Record<string, keyof typeof GUI_ARTIFACT_TYPES> = {
                        'Mushroom': 'MUSHROOM',
                        'Graffiti': 'GRAFFITI',
                        'Fossil': 'FOSSIL',
                        'Pixel Plant': 'PIXEL_PLANT'
                    };

                    const mappedType = artifactMapping[firstSuggestion] || 'MUSHROOM';
                    setSelectedArtifactType(mappedType);
                }
            } else {
                throw new Error(result.error || 'Analysis failed');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to analyze environment';
            console.error('❌ Environment analysis failed:', errorMessage);
            setAiDetectionError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleScan = async () => {
        if (!account || !location) return;

        setIsScanning(true);
        setScanResult(null);

        try {
            console.log('Starting GUI artifact claim...');

            const locationString = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
            const artifactName = GUI_ARTIFACT_TYPES[selectedArtifactType].name;

            const result = await guiContract.claimArtifact(artifactName, locationString);

            if (result.success) {
                setScanResult({
                    success: true,
                    message: `${artifactName} claimed successfully!`,
                    guiReward: result.gui_reward
                });

                // Refresh player stats to show updated balance
                setTimeout(() => {
                    refreshPlayerStats();
                }, 1000);
            } else {
                throw new Error('Failed to claim artifact');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to claim artifact. Please try again.';
            console.error('Scan error:', errorMessage);
            setScanResult({
                success: false,
                message: errorMessage
            });
        } finally {
            setIsScanning(false);
        }
    };

    const startCamera = async () => {
        setCameraError(null);
        setIsCameraActive(true);
        console.log('Camera activated');
    };

    const stopCamera = () => {
        setIsCameraActive(false);
        setCapturedImage(null);
        setEnvironmentDetection(null);
        setAiDetectionError(null);
        console.log('Camera deactivated');
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        setEnvironmentDetection(null);
        setAiDetectionError(null);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-green-400 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-400">Loading scanner...</p>
                </div>
            </div>
        );
    }

    // Registration required
    if (!isRegistered) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">Please complete registration first</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Artifact Scanner</h1>
                            <p className="text-slate-400 text-sm">Discover and claim $GUI rewards in the real world</p>
                        </div>
                    </div>

                    {/* Player GUI Balance */}
                    {playerStats && (
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center justify-center gap-2">
                                <Coins className="w-5 h-5 text-yellow-400" />
                                <span className="text-slate-400">Current Balance:</span>
                                <span className="text-green-400 font-bold">
                                    {(playerStats.gui_balance / 100000).toFixed(1)}M $GUI
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Location Status */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-400" />
                        Location Status
                    </h3>

                    {isLoadingLocation ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                            <span className="text-slate-300">Getting your location...</span>
                        </div>
                    ) : location ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                                <span className="text-green-300">Location acquired</span>
                            </div>
                            <p className="text-sm text-slate-400 font-mono">
                                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-300">
                                    {locationError || 'Location not available'}
                                </span>
                            </div>
                            <button
                                onClick={requestLocation}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Retry Location
                            </button>
                        </div>
                    )}
                </div>

                {/* Artifact Type Selection */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">Select Artifact Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {Object.entries(GUI_ARTIFACT_TYPES).map(([key, artifact]) => {
                            const Icon = artifact.icon;
                            const isSelected = selectedArtifactType === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedArtifactType(key as keyof typeof GUI_ARTIFACT_TYPES)}
                                    className={`p-4 rounded-lg border transition-all ${isSelected
                                        ? 'bg-green-500/20 border-green-500 text-green-400'
                                        : 'bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${artifact.color}`} />
                                    <div className="text-sm font-medium">{artifact.name}</div>
                                    <div className="text-xs opacity-75">{artifact.rarity}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Camera Section */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-400" />
                        Camera & AI Analysis
                    </h3>

                    {!isCameraActive ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto">
                                <Camera className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-400">Use AI-powered environment detection to find the best artifacts</p>
                            <button
                                onClick={startCamera}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                            >
                                Start Camera
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {capturedImage ? (
                                <div className="space-y-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={capturedImage}
                                        alt="Captured environment"
                                        className="w-full h-64 object-cover rounded-lg border border-slate-600"
                                    />

                                    {/* AI Analysis Results */}
                                    {isAnalyzing && (
                                        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
                                                <span className="text-blue-300">AI is analyzing your environment...</span>
                                            </div>
                                        </div>
                                    )}

                                    {environmentDetection && (
                                        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Brain className="w-5 h-5 text-green-400" />
                                                <span className="text-green-300 font-semibold">AI Analysis Complete</span>
                                            </div>
                                            <div className="space-y-2">
                                                <div>
                                                    <span className="text-slate-400">Environment: </span>
                                                    <span className="text-white font-semibold">{environmentDetection.environment}</span>
                                                    <span className={`ml-2 text-sm ${getConfidenceColor(environmentDetection.confidence)}`}>
                                                        ({formatConfidence(environmentDetection.confidence)})
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Description: </span>
                                                    <span className="text-slate-300">{environmentDetection.description}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400">Suggested artifacts: </span>
                                                    <span className="text-green-400">
                                                        {environmentDetection.suggestedArtifacts.join(', ')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {aiDetectionError && (
                                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-red-400" />
                                                <span className="text-red-300">AI Analysis Failed: {aiDetectionError}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={retakePhoto}
                                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Retake
                                        </button>
                                        <button
                                            onClick={() => analyzeEnvironment(capturedImage)}
                                            disabled={isAnalyzing}
                                            className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Webcam
                                            ref={webcamRef}
                                            audio={false}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-64 object-cover rounded-lg border border-slate-600"
                                            onUserMediaError={(error) => {
                                                console.error('Camera error:', error);
                                                setCameraError('Failed to access camera');
                                            }}
                                        />
                                        {cameraError && (
                                            <div className="absolute inset-0 bg-red-900/80 rounded-lg flex items-center justify-center">
                                                <div className="text-center">
                                                    <CameraOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                                    <p className="text-red-300 text-sm">{cameraError}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleCapture}
                                            disabled={isCapturing || !!cameraError}
                                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                                        >
                                            {isCapturing ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Capturing...
                                                </div>
                                            ) : (
                                                'Capture & Analyze'
                                            )}
                                        </button>
                                        <button
                                            onClick={stopCamera}
                                            className="bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg transition-colors"
                                        >
                                            Stop Camera
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Scan Button */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <div className="text-center space-y-4">
                        <button
                            onClick={handleScan}
                            disabled={isScanning || !location || !account}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-green-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                        >
                            {isScanning ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Claiming {GUI_ARTIFACT_TYPES[selectedArtifactType].name}...
                                </div>
                            ) : (
                                `Claim ${GUI_ARTIFACT_TYPES[selectedArtifactType].name}`
                            )}
                        </button>

                        {!location && (
                            <p className="text-sm text-slate-400">
                                Location required to claim artifacts
                            </p>
                        )}
                    </div>
                </div>

                {/* Scan Result */}
                {scanResult && (
                    <div className={`p-6 rounded-xl border ${scanResult.success
                        ? 'bg-green-900/30 border-green-500/30'
                        : 'bg-red-900/30 border-red-500/30'
                        }`}>
                        <div className="flex items-center gap-3">
                            {scanResult.success ? (
                                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className={`font-semibold ${scanResult.success ? 'text-green-300' : 'text-red-300'
                                    }`}>
                                    {scanResult.message}
                                </p>
                                {scanResult.success && scanResult.guiReward && (
                                    <p className="text-sm text-green-400 mt-1">
                                        Earned: {(scanResult.guiReward / 100000).toFixed(3)}M $GUI tokens!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Section */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">🎯 Discovery Process</h4>
                            <ul className="text-slate-400 space-y-1">
                                <li>• Use your camera to capture environments</li>
                                <li>• AI analyzes and suggests best artifacts</li>
                                <li>• Choose artifact type and claim rewards</li>
                                <li>• Earn $GUI tokens based on rarity</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">💰 Reward Tiers</h4>
                            <ul className="text-slate-400 space-y-1">
                                <li>• Common: 10k $GUI</li>
                                <li>• Uncommon: 50k $GUI</li>
                                <li>• Rare: 250k $GUI</li>
                                <li>• Epic: 1M $GUI</li>
                                <li>• Legendary: 5M $GUI</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
