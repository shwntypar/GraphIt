import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { fname, lname, email, password } = body;

        if (!fname || !lname || !email || !password) {
            throw  error(400, 'Missing required fields');
        }

        /* const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);

        if (existingUser.length === 0  existingUser[0].password !== password) {
            throw error(401, 'Invalid email or password');
        } */

        if (password.length < 8) {
            throw error(400, 'Password length must be must longer than 8 characters!');
        }

        const existingEmail = await db.select().from(user).where(eq(user.email, email)).limit(1);
        if(existingEmail.length === 0){
            console.log('Email is already registered!');
        }

        const newUser = await db.insert(user).values({fname, lname, email, password});

        return json({
            message: 'Registration Successful!',
            data: newUser
            /* user: {
                id: existingUser[0].id,
                email: existingUser[0].email
            } */
        });
    } catch (err) {
        console.error('register error:', err);
        throw error(500, 'Failed to register');
    }
};