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
    TrendingUp, 
    Weight,
    Stethoscope
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
        icon: Stethoscope,
        inverse: true,
        format: (v) => v.toFixed(0)
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
        key: 'musclePercentage',
        label: 'Muscle',
        unit: '%',
        icon: Percent,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'waterPercentage',
        label: 'Water',
        unit: '%',
        icon: Percent,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'proteinPercentage',
        label: 'Protein',
        unit: '%',
        icon: Percent,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'bonePercentage',
        label: 'Bone',
        unit: '%',
        icon: Percent,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'muscleMass',
        label: 'Muscle',
        unit: 'kg',
        icon: Weight,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'waterMass',
        label: 'Water',
        unit: 'kg',
        icon: Weight,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'fatMass',
        label: 'Fat',
        unit: 'kg',
        icon: Weight,
        inverse: true,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'proteinMass',
        label: 'Protein',
        unit: 'kg',
        icon: Weight,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'boneMass',
        label: 'Bone',
        unit: 'kg',
        icon: Weight,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'skeletalMuscleMass',
        label: 'Skel. Muscle',
        unit: 'kg',
        icon: Weight,
        inverse: false,
        format: (v) => v.toFixed(1)
    },
    {
        key: 'fatFreeMass',
        label: 'Fat Free Mass',
        unit: 'kg',
        icon: Weight,
        inverse: false,
        format: (v) => v.toFixed(1)
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
        key: 'waistHipRatio',
        label: 'WHR',
        unit: '',
        icon: Dna,
        inverse: true,
        format: (v) => v.toFixed(2)
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
        key: 'metabolicIndex',
        label: 'Basal Met.',
        unit: 'kcal',
        icon: Zap,
        inverse: false,
        format: (v) => v.toFixed(0)
    }
];

export const METRIC_MAP = METRICS.reduce((acc, m) => {
    acc[m.key] = m;
    return acc;
}, {} as Record<string, MetricConfig>);
