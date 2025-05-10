import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({request}) => {
    try{
        const { email, password } = await request.json();

        if(!email || !password){
            throw error(400, "Fill in the following fields!");
        } 

        console.log(email);
        console.log(password);
        const founduser = await db.select().from(user).where(eq(user.email, email)).limit(1);

        if(founduser != email){
            throw error(400, "Enter a valid email or password!")
        }


        return json({
            message: 'email found'
        })
    } catch (err){
        console.error('register error:', err);
        throw error(500, 'Failed to register');
    }
    
};