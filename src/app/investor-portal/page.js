"use client";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext"; 
import LoginForm from "../../components/LoginForm";
import Logout from "../../components/Logout";
import Header from "../../components/Header/index";

export default function InvestorPortal() {
    const { user, checkAuthStatus } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    console.log('user: ' + user);

    useEffect(() => {
        const fetchUser = async () => {
            await checkAuthStatus();
            setLoading(false);
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Header portal={false} />
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <LoginForm />;
    }

    return (
        <div className="container mx-auto p-4 pt-50">
            <Header portal={false}  />
            <h1>Welcome to the Investor Portal</h1>
            <p className="mb-6">Here is your dashboard content...</p>
            <Logout />
        </div>
    );
}
