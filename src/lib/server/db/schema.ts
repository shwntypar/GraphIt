import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	fname: text('fname'),
	lname: text('lname'),
	isAdmin: integer('isAdmin').default(0),
	email: text('email').unique(),
	password: text('password')
});


/* export const charts = sqliteTable('charts', {
	
}) */