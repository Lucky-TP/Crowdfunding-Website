import { useState } from "react";
import Link from "next/link";
import { EmailSignUpPayload } from "src/interfaces/payload/authPayload";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "src/services/authService";
import { dateToString } from "src/utils/date";

type Props = {};

export default function Signup({}: Props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState<Date>(new Date());
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [province, setProvince] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const onSignUp = async (event: React.FormEvent) => {
        event.preventDefault();

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            const payload: EmailSignUpPayload = {
                firstName,
                lastName,
                email,
                password,
                birthDate: dateToString(birthDate),
                address: {
                    country,
                    city,
                    postalCode,
                    province,
                },
            };
            console.log(payload);
            await signUpWithEmail(payload);
            router.push("/profile");
        } catch (error: any) {
            console.log("Sign-up failed ", error);
        }
    };

    return (
        <section>
            <div className="absolute top-0  h-screen w-screen flex bg-orange-300 ">
                <div className="w-3/6 flex flex-col justify-center items-start p-16 ">
                    <Link href="/">
                        <img
                            src="./assets/shark.png"
                            alt="shark Funding img"
                            className="absolute top-10 left-14 w-14 h-14 rounded-full"
                        />
                    </Link>
                    <div className="fixed top-20">
                        <p className="text-white mb-5 mt-20">Welcome to Shark Funding</p>
                        <h1 className="text-white text-4xl font-medium">Sign up to Shark Funding</h1>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center items-center bg-white p-16 rounded-tl-4xl">
                    <div className="w-full pl-20">
                        <div className="text-right text-sm text-gray-600 mb-4 absolute top-10 right-14">
                            <p>
                                Already have an account?{" "}
                                <a
                                    href="/sign-in"
                                    className="underline text-orange-300 hover:text-orange-200"
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>
                        <div className="flex flex-col mt-24">
                            <p className="font-medium text-gray-700 mb-4">Your account details</p>
                            <form onSubmit={onSignUp}>
                                {error && <div className="text-red-500 mb-4">{error}</div>}
                                <div className="flex flex-row">
                                    <div className="w-full mb-4">
                                        <label>First Name</label>
                                        <input
                                            className="border border-gray-300 w-full p-3 rounded"
                                            type="text"
                                            id="firstname"
                                            placeholder="First Name"
                                            required
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full mb-4">
                                        <label>Last Name</label>
                                        <input
                                            className="border border-gray-300 w-full p-3 rounded"
                                            type="text"
                                            id="lastname"
                                            placeholder="Last Name"
                                            required
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-full mb-4">
                                    <label>Email Address</label>
                                    <input
                                        className="border border-gray-300 w-full p-3 rounded"
                                        type="email"
                                        id="email"
                                        placeholder="Email Address"
                                        required
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="w-full mb-4">
                                    <label>Password</label>
                                    <input
                                        className="border border-gray-300 w-full p-3 rounded"
                                        type="password"
                                        id="password"
                                        placeholder="Password"
                                        required
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-row">
                                    <div className="w-full mb-4">
                                        <label>Date of Birth</label>
                                        <input
                                            className="border border-gray-300 w-full p-3 rounded"
                                            type="date"
                                            id="dateofbirth"
                                            placeholder="Date of Birth"
                                            required
                                            onChange={(e) => setBirthDate(new Date(e.target.value))}
                                        />
                                    </div>
                                    <div className="w-full mb-4">
                                        <label>Country</label>
                                        <input
                                            className="border border-gray-300 w-full p-3 rounded"
                                            type="text"
                                            id="country"
                                            placeholder="Country"
                                            required
                                            onChange={(e) => setCountry(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-row mb-4">
                                    <div className="w-full mb-4">
                                        <label>City</label>
                                        <input
                                            className="border border-gray-300 w-full p-3 rounded"
                                            type="text"
                                            id="city"
                                            placeholder="City"
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full mb-4">
                                        <label>Postal Code</label>
                                        <input
                                            className="border border-gray-300 w-full p-3 rounded"
                                            type="text"
                                            id="postal-code"
                                            placeholder="Postal Code"
                                            required
                                            onChange={(e) => setPostalCode(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-full text-center mb-4">
                                    <button
                                        type="submit"
                                        className="bg-orange-300  items-center px-3 py-1.5 rounded-full shadow-md hover:bg-orange-200 transition"
                                    >
                                        <span className="text-white mx-12 my-">Sign up</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
