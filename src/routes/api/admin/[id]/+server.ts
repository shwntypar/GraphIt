import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { user } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';

export const PUT: RequestHandler = async ({request, params}) => {
    try{
        const {id} = params;
        const body = await request.json();
        const { fname, lname, email, role, password} = body;

        /* CHECK IF THE DATA IS BEING RECEIVED */

        const user_id = Number(id);

        if (isNaN(user_id)) throw error(400, 'invalid id');

        const [exisiting_user] = await db.select().from(user).where(eq(user.id, user_id)).limit(1);

		if (!exisiting_user) throw error(404, 'user not found');

        const update_data = {};
		if (fname !== undefined) update_data.fname = fname;
        if (lname !== undefined) update_data.lname = fname;
        if (role !== undefined) update_data.role = role;
		if (email !== undefined) update_data.email = email;
		if (password !== undefined) update_data.password = password;

		if (Object.keys(update_data).length === 0) {
			throw error(400, 'No fields provided to update');
		}

		const [updatedUser] = await db
			.update(user)
			.set(update_data)
			.where(eq(user.id, user_id))
			.returning();

        return json({
            message: "succesfully updated informations!",
            
        })
    } catch(any){
        console.log("fail message:", any);
        throw error(500, "Failed to update info!")
    }
};