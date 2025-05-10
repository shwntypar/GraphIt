import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { csvUploads, kpiMetrics, kpiData, kpiCategories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter';

// Define recommended chart types for different metric patterns
const METRIC_PATTERNS = {
    time_series: ['revenue', 'users', 'growth', 'traffic', 'sales', 'spend', 'cost'],
    comparison: ['conversion', 'rate', 'ratio', 'distribution'],
    composition: ['share', 'breakdown', 'composition', 'percentage'],
    correlation: ['correlation', 'relationship', 'versus', 'against']
};

function determineChartType(metricName: string, categoryName: string): ChartType {
    const normalizedMetric = metricName.toLowerCase();
    const normalizedCategory = categoryName.toLowerCase();

    // Time-based metrics usually work best with line charts
    if (METRIC_PATTERNS.time_series.some(pattern => 
        normalizedMetric.includes(pattern) || normalizedCategory.includes(pattern))) {
        return 'line';
    }

    // Comparison metrics work well with bar charts
    if (METRIC_PATTERNS.comparison.some(pattern => 
        normalizedMetric.includes(pattern) || normalizedCategory.includes(pattern))) {
        return 'bar';
    }

    // Composition metrics are suited for pie charts
    if (METRIC_PATTERNS.composition.some(pattern => 
        normalizedMetric.includes(pattern) || normalizedCategory.includes(pattern))) {
        return 'pie';
    }

    // Correlation metrics work best with scatter plots
    if (METRIC_PATTERNS.correlation.some(pattern => 
        normalizedMetric.includes(pattern) || normalizedCategory.includes(pattern))) {
        return 'scatter';
    }

    // Default to line chart for time-series data
    return 'line';
}

interface DataPoint {
    date: number;
    value: number;
    notes?: string;
}

interface RequestData {
    upload: {
        fileName: string;
        description?: string;
        userId: number;
    };
    category: {
        name: string;
        description?: string;
    };
    metric: {
        name: string;
        description?: string;
        unit?: string;
        preferredChartType?: ChartType;  // Optional override for chart type
    };
    dataPoints: DataPoint[];
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data: RequestData = await request.json();
        
        // Expected data structure from Postman:
        // {
        //     "upload": {
        //         "fileName": "string",
        //         "description": "string",
        //         "userId": number
        //     },
        //     "category": {
        //         "name": "string",
        //         "description": "string"
        //     },
        //     "metric": {
        //         "name": "string",
        //         "description": "string",
        //         "unit": "string"
        //     },
        //     "dataPoints": [
        //         {
        //             "date": number,
        //             "value": number,
        //             "notes": "string"
        //         }
        //     ]
        // }

        // Store upload metadata
        const [uploadRecord] = await db.insert(csvUploads)
            .values({
                ...data.upload,
                uploadDate: Date.now()
            })
            .returning();

        // Check if category exists first
        let categoryRecord = await db.query.kpiCategories.findFirst({
            where: eq(kpiCategories.name, data.category.name)
        });

        // If category doesn't exist, create it
        if (!categoryRecord) {
            [categoryRecord] = await db.insert(kpiCategories)
                .values(data.category)
                .returning();
        }

        // Determine the best chart type for this metric
        const suggestedChartType = determineChartType(data.metric.name, data.category.name);
        const chartType = data.metric.preferredChartType || suggestedChartType;

        // Store metric with chart type
        const [metricRecord] = await db.insert(kpiMetrics)
            .values({
                ...data.metric,
                categoryId: categoryRecord.id,
                chartType
            })
            .returning();

        // Store data points
        const dataPointsWithRefs = data.dataPoints.map((point: DataPoint) => ({
            ...point,
            uploadId: uploadRecord.id,
            metricId: metricRecord.id
        }));

        await db.insert(kpiData).values(dataPointsWithRefs);

        return json({
            message: 'Data stored successfully',
            uploadId: uploadRecord.id,
            metricId: metricRecord.id,
            categoryId: categoryRecord.id,
            chartType,
            suggestedChartType
        });

    } catch (err: any) {
        console.error('Error:', err);
        return json({ 
            error: err.message || 'Failed to store data',
            details: err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 'A record with this name already exists' : undefined
        }, { status: 500 });
    }
};