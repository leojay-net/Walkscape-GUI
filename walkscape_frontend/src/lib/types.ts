export interface EnvironmentDetection {
    detectedItems: string[];
    suggestedArtifacts: string[];
    confidence: number;
    description: string;
    timestamp: number;
}
