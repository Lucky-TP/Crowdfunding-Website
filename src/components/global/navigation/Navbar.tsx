"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown } from "antd";
import Image from "next/image";
import { signOut } from "src/services/authService";
import { createProject } from "src/services/apiService/projects/createProject"; // Import your function
import { useUserData } from "src/context/useUserData";

type Props = {};

export default function Navbar({}: Props) {
    const router = useRouter();
    const { user } = useUserData();
    const [loading, setLoading] = useState(false);

    const handleCreateProject = async () => {
        setLoading(true);
        try {
            const result = await createProject();
            const projectId = result.data?.projectId; // Get the project ID from response
            router.push(`/create-project/${projectId}/basic`); // Navigate to the project page
        } catch (error: any) {
            router.push(`/sign-in`);
            console.error("Error creating project:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleProfile = async () => {
        router.push("/profile");
    };
    const handleProfileSetting = async () => {
        router.push("/settings/profile-config");
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push("/");
            window.location.reload();
        } catch (error: any) {
            console.error("Error signing out:", error.message);
        }
    };

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlNavbar = () => {
        if (window.scrollY > lastScrollY) {
            // If we are scrolling down, hide the navbar
            setShowNavbar(false);
        } else {
            // If we are scrolling up, show the navbar
            setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <section
            className={`fixed top-0 w-[100vw] z-50 transition-transform duration-500 ease-in-out ${
                showNavbar ? "translate-y-0" : "-translate-y-full"
            }`}
        >
            <nav className="px-[3vw] bg-transparent py-[2vh] backdrop-blur-sm">
                <div className="flex flex-row justify-between items-center px-[3vw]">
                    <div className="flex items-center justify-center">
                        <Link href="/">
                            <Image
                                src="/assets/SharkLogo.png"
                                alt="Shark Logo"
                                width={200}
                                height={200}
                            />
                        </Link>
                    </div>
                    <ul className="flex flex-row gap-x-[3vw] items-center">
                        <li>
                            <Link href="/explore">
                                <h1 className="text-orange-600 sm:text-lg lg:text-xl font-semibold hover:text-orange-400 duration-700">
                                    EXPLORE
                                </h1>
                            </Link>
                        </li>
                        <li>
                            <Button type="link" onClick={handleCreateProject} loading={loading}>
                                <span>
                                    <h1 className="text-orange-600 sm:text-lg lg:text-xl font-semibold hover:text-orange-400 duration-700">
                                        CREATE PROJECT
                                    </h1>
                                </span>
                            </Button>
                        </li>
                        <li>
                            {!user && (
                                <Link href="/sign-in">
                                    <h1 className="text-orange-600 sm:text-lg lg:text-xl font-semibold hover:text-orange-400 duration-700">
                                        SIGN IN / SIGN UP
                                    </h1>
                                </Link>
                            )}
                            {user && (
                                <Dropdown
                                    className="flex items-center"
                                    menu={{
                                        items: [
                                            {
                                                key: "1",
                                                label: <div onClick={handleProfile}>Profile</div>,
                                            },
                                            {
                                                key: "2",
                                                label: <div onClick={handleProfileSetting}>Setting</div>,
                                            },
                                            {
                                                key: "3",
                                                label: <div onClick={handleSignOut}>Sign Out</div>,
                                                danger: true,
                                            },
                                        ],
                                    }}
                                >
                                    <Image
                                        src={user.profileImageUrl || ""}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="rounded-full w-10 h-10"
                                        width={120}
                                        height={120}
                                    />
                                </Dropdown>
                            )}
                        </li>
                    </ul>
                </div>
            </nav>
        </section>
    );
}
