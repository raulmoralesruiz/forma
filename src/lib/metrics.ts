import { 
    Scale, 
    Percent, 
    Activity, 
    Heart, 
    Droplets, 
    Zap, 
    Flame,
    User, 
    Dna, 
    TrendingUp 
} from "lucide-svelte";
import type { BodyMetrics } from "./csvParser";

type NumericKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

export interface MetricConfig {
    key: NumericKeys<BodyMetrics>;
    label: string;
    unit: string;
    icon: any;
    inverse?: boolean;
    format: (v: number) => string;
}

export const METRICS: MetricConfig[] = [
    {
        key: 'weight',
        label: 'Weight',
        unit: 'kg',
        icon: Scale,
        inverse: true,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'bodyFat',
        label: 'Body Fat',
        unit: '%',
        icon: Percent,
        inverse: true,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'muscleMass',
        label: 'Muscle',
        unit: 'kg',
        icon: Activity,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'bmi',
        label: 'BMI',
        unit: '',
        icon: Activity,
        inverse: true,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'visceralFat',
        label: 'Visceral Fat',
        unit: '',
        icon: Flame,
        inverse: true,
        format: (v) => v.toFixed(0)
    },
    {
        key: 'heartRate',
        label: 'Heart Rate',
        unit: 'bpm',
        icon: Heart,
        inverse: true,
        format: (v) => v.toFixed(0)
    },
    {
        key: 'waterMass',
        label: 'Water Mass',
        unit: 'kg',
        icon: Droplets,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'boneMass',
        label: 'Bone Mass',
        unit: 'kg',
        icon: Zap,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'metabolicIndex',
        label: 'Basal Met.',
        unit: 'kcal',
        icon: Zap,
        inverse: false,
        format: (v) => v.toFixed(0)
    },
    {
        key: 'bodyAge',
        label: 'Body Age',
        unit: 'y',
        icon: User,
        inverse: true,
        format: (v) => v.toFixed(0)
    },
    {
        key: 'skeletalMuscleMass',
        label: 'Skel. Muscle',
        unit: 'kg',
        icon: Dna,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'waistHipRatio',
        label: 'WHR',
        unit: '',
        icon: TrendingUp,
        inverse: true,
        format: (v) => v.toFixed(2)
    },
    {
        key: 'fatMass',
        label: 'Fat Mass',
        unit: 'kg',
        icon: Scale,
        inverse: true,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'proteinMass',
        label: 'Protein Mass',
        unit: 'kg',
        icon: Activity,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'musclePercentage',
        label: 'Muscle %',
        unit: '%',
        icon: Activity,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'waterPercentage',
        label: 'Water %',
        unit: '%',
        icon: Droplets,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'proteinPercentage',
        label: 'Protein %',
        unit: '%',
        icon: Activity,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'bonePercentage',
        label: 'Bone %',
        unit: '%',
        icon: Zap,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'fatFreeMass',
        label: 'Fat Free Mass',
        unit: 'kg',
        icon: Scale,
        inverse: false,
        format: (v) => v.toFixed(1)
    }
];

export const METRIC_MAP = METRICS.reduce((acc, m) => {
    acc[m.key] = m;
    return acc;
}, {} as Record<string, MetricConfig>);
