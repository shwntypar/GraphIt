import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';

/* this should handle retrieving the data in user db */

export const GET: RequestHandler = async ({}) => {
    try {

        const GetUsers = await db.select({
            fname: user.fname,
            lname: user.lname,
            isAdmin: user.isAdmin,
            password: user.password
        }).from(user);


        return json({
            message: 'Successful retrieving data!',
            data: GetUsers
        });
    } catch (err) {
        console.error('retrieving error:', err);
        throw error(500, 'Failed to Retrieve Data!');
    }
};



