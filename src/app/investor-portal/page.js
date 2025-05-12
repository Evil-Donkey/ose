"use client";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext"; 
import LoginForm from "../../components/LoginForm";
import Logout from "../../components/Logout";
import Header from "../../components/Header/index";
import Container from '../../components/Container';

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
            <Container>
                <Header portal={false} />
                <p>Loading...</p>
            </Container>
        );
    }

    if (!user) {
        return <LoginForm />;
    }

    return (
        <Container className="pt-50">
            <Header portal={false}  />
            <h1>Welcome to the Investor Portal</h1>
            <p className="mb-6">Here is your dashboard content...</p>
            <Logout />
        </Container>
    );
}
