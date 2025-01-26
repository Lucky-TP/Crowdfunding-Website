import React, { useState } from "react";
import { PopularCreator } from "src/interfaces/datas/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingSection from "src/components/global/LoadingSection";

interface CreatorCardProps {
    creator: PopularCreator;
}

const SingleCreatorCard = ({ creator }: CreatorCardProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const handleViewProject = () => {
        setIsLoading(true);
        router.push(`/users/${creator.uid}/profile`);
    };
    return (
        <section>
            <div className="pl-6 p-3">
                <div className="w-full h-full rounded-lg overflow-hidden relative group">
                    <div className="relative w-full h-48">
                        {" "}
                        {/* Fixed height for the image container */}
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                                <LoadingSection />
                            </div>
                        )}
                        <Image
                            className="w-full h-full object-contain" // Ensure the image fits within the container without cropping
                            src={creator.profileImageUrl?.trim() || '/nuk.jpg'}
                            alt={`${creator.firstName} ${creator.lastName}'s profile picture`}
                            width={400}
                            height={400}
                        />
                        {/* Hover elements */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <button
                                className="absolute bottom-2 bg-orange-600 text-white font-semibold py-2 px-4 rounded-full"
                                onClick={handleViewProject}
                            >
                                View Creator
                            </button>
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* <button className="bg-orange-600 text-white p-2 rounded-full">
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 21l-7-5.3L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            </button> */}
                        </div>
                    </div>
                    <div className="pt-3 py-1">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {creator.firstName}
                            <span> </span>
                            {creator.lastName}
                        </h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SingleCreatorCard;
