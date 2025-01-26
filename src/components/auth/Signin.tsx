import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { getRedirectResult, signInWithEmail, signInWithGoogle } from "src/services/authService";
import Link from "next/link";
import { EmailSignInPayload } from "src/interfaces/payload/authPayload";
import LoadingPage from "../global/LoadingPage";
import Image from "next/image";

type Props = {};

export default function Signin({}: Props) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onSignInWithGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            // router.push("/redirect-handler");
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handler = async () => {
            try {
                setLoading(true);
                const result = await getRedirectResult();
                if (result) {
                    router.push("/profile");
                }
                setLoading(false);
            } catch (error: unknown) {
                alert("Contact Nuk");
            }
        };
        handler();
    }, [router]);

    const onSignInWithEmail = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const payload: EmailSignInPayload = { email, password };
            await signInWithEmail(payload);
            router.push("/profile");
        } catch (error: any) {
            setError("Invalid email or password. Please try again."); // Set the error message
            console.log(error);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <section>
            <div className="absolute top-0 h-screen w-screen flex bg-orange-300 ">
                <div className="w-3/6 flex flex-col justify-center items-start p-16 ">
                    <Link href="/">
                        <Image
                            src="/assets/shark.png"
                            alt="shark img"
                            className="absolute top-10 left-14 w-14 h-14 rounded-full"
                            width={56}
                            height={56}
                        />
                    </Link>
                    <div className="fixed top-20">
                        <p className="text-white mb-5 mt-20">Welcome back</p>
                        <h1 className="text-white text-4xl font-medium">Sign in to Shark Funding</h1>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center items-center bg-white p-16 rounded-tl-4xl">
                    <div className="w-full pl-20">
                        <div className="flex flex-col mt-24">
                            <p className="font-medium text-gray-700 mb-4">Your account details</p>
                            <form onSubmit={onSignInWithEmail}>
                                <div className="w-full mb-4">
                                    <input
                                        className="border border-gray-300 w-full p-3 rounded"
                                        type="email"
                                        id="email"
                                        placeholder="Email Address"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="w-full mb-4">
                                    <input
                                        className="border border-gray-300 w-full p-3 rounded"
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                {error && <div className="text-red-500 mb-4">{error}</div>}
                                <div className="flex flex-row justify-between w-full text-left mb-4">
                                    <div>
                                        <p>
                                            {`Don't have an account? `}
                                            <a
                                                href="/sign-up"
                                                className="underline text-orange-300 hover:text-orange-200"
                                            >
                                                Sign up
                                            </a>
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="w-full mt-auto text-center mb-4">
                                    <p className="mb-4 text-sm text-gray-600">
                                        By clicking the Sign In button below,
                                        you agree to the Shark{" "}
                                        <a
                                            href="#"
                                            className="underline text-orange-300 hover:text-orange-200"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        and acknowledge the{" "}
                                        <a
                                            href="#"
                                            className="underline text-orange-300 hover:text-orange-200"
                                        >
                                            Privacy Notice
                                        </a>
                                        .
                                    </p>
                                </div> */}
                                <div className="w-full text-center mb-4">
                                    <button className="bg-orange-300  items-center px-3 py-1.5 rounded-full shadow-md hover:bg-orange-200 transition">
                                        <span className="text-white mx-12 my-">Sign in</span>
                                    </button>
                                </div>
                            </form>
                            <div className="w-full flex items-center justify-center mb-4">
                                <span className="border-t border-gray-300 flex-grow"></span>
                                <span className="mx-2 text-gray-500">OR</span>
                                <span className="border-t border-gray-300 flex-grow"></span>
                            </div>
                            <div className="w-full text-center mb-4">
                                <button
                                    className="bg-orange-300  items-center px-3 py-1 my-0.5 rounded-full shadow-md hover:bg-orange-200 transition"
                                    onClick={onSignInWithGoogle}
                                >
                                    <div className="flex">
                                        <Image
                                            src="/assets/google.webp"
                                            alt="Google logo"
                                            className="w-6 h-6 mr-2"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="text-white">Sign in with Google</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
