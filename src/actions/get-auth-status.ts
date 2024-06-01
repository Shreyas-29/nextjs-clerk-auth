"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const getAuthStatus = async () => {
    const user = await currentUser();
    
    if (!user?.id || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error("User not found");
    }

    const existingUser = await db.user.findFirst({
        where: {
            id: user.id,
        }
    });

    console.log("existingUser", existingUser);

    if (!existingUser) {
        await db.user.create({
            data: {
                id: user.id,
                email: user.primaryEmailAddress.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImageUrl: user.imageUrl,
            },
        });

        console.log("User created");
    }

    return { success: true };
};

export default getAuthStatus;
