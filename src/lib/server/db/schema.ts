import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	fname: text('fname'),
	lname: text('lname'),
	role: text('role'),
	email: text('email').unique(),
	password: text('password')
});

export const compan = sqliteTable('business', {
	id: integer('id').primaryKey(),
	ceo: text('ceo'),
	company_name: text('company_name'),
	company_desc: text('company_desc'),
	telephone_no: integer('telephone_no'),
	email: text('email').unique()
})