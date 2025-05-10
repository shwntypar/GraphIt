import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	fname: text('fname'),
	lname: text('lname'),
	isAdmin: integer('isAdmin').default(0),
	email: text('email').unique(),
	password: text('password')
});

// Store CSV file metadata
export const csvUploads = sqliteTable('csv_uploads', {
	id: integer('id').primaryKey(),
	fileName: text('file_name').notNull(),
	uploadDate: integer('upload_date').notNull(), // SQLite stores dates as integers
	description: text('description'),
	userId: integer('user_id').references(() => user.id),
});

// Store KPI categories
export const kpiCategories = sqliteTable('kpi_categories', {
	id: integer('id').primaryKey(),
	name: text('name').notNull().unique(),
	description: text('description')
});

// Store KPI metrics
export const kpiMetrics = sqliteTable('kpi_metrics', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	categoryId: integer('category_id').references(() => kpiCategories.id),
	description: text('description'),
	unit: text('unit'), // e.g., '%', '$', 'seconds', etc.
	chartType: text('chart_type').default('line') // Default to line chart
});

// Store the actual KPI data points
export const kpiData = sqliteTable('kpi_data', {
	id: integer('id').primaryKey(),
	uploadId: integer('upload_id').references(() => csvUploads.id),
	metricId: integer('metric_id').references(() => kpiMetrics.id),
	date: integer('date').notNull(), // The date this data point represents
	value: real('value').notNull(), // Using real for decimal numbers
	notes: text('notes'),
	isArchived: integer('isArchived').notNull().default(0)
});

