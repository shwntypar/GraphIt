import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            throw error(400, "Please fill in all fields");
        }

        // Find the user
        const [foundUser] = await db
            .select()
            .from(user)
            .where(eq(user.email, email))
            .limit(1);

        if (!foundUser || foundUser.password !== password) {
            throw error(400, "Invalid email or password");
        }

        // Set a simple session cookie
        cookies.set('session', foundUser.id.toString(), {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30 // 30 days
        });

        return json({
            success: true,
            isAdmin: Boolean(foundUser.isAdmin)
        });
    } catch (err) {
        console.error('Login error:', err);
        if (err instanceof Error) {
            throw error(500, err.message || 'Login failed');
        }
        throw error(500, 'Login failed');
    }
};

// Add a logout endpoint
export const DELETE: RequestHandler = async ({ cookies }) => {
    cookies.delete('session', { path: '/' });
    return json({ success: true });
};