"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../modals/settings-modal";


// This provider ensures any modal is rendered exclusively on the client side

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    
    }, []);

    if(!isMounted) return null;

    return (
        <>
            <SettingsModal />
        </>
    );
};