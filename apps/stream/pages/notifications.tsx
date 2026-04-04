import React from 'react';
import { Navbar } from "@/components/shared/NavBar";
import { signOut, useSession } from "next-auth/react";
import Notifications from '@/components/Notifications';

function Page() {
    const { data: session } = useSession();

    return (
        <div className='min-h-[100vh]'>
            <div className='h-20'>
                <Navbar toTop home={true} />
            </div>
            <Notifications session={session}/>
        </div>
    );
}

export default Page;