"use client"
import { useEffect, useState } from "react";
import { ShowProject } from "src/interfaces/datas/project";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingSection from "src/components/global/LoadingSection";
import { toggleFavoriteProject } from "src/services/apiService/users/toggleFavoriteProject";
import { useUserData } from "src/context/useUserData";


interface ProjectCardProps {
    project: ShowProject;
    showEditProject?: boolean;
}

const SingleprojectCard = ({ project, showEditProject }: ProjectCardProps) => {
    const router = useRouter();
    const { user: initUser, refetchUserData } = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false); // State for favorite status

    useEffect(() => {
        if (initUser && initUser.favoriteProjectIds.includes(project.projectId)) {
            setIsFavorited(true);
        }
    }, [initUser]);

    let percentageFunded = 0;
    let fullgoalFunding = (project.stages[0].goalFunding + project.stages[1].goalFunding+ project.stages[2].goalFunding);

    if (project.stages[0].currentFunding > 0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0) {
        percentageFunded = Math.round((project.stages[0].currentFunding / fullgoalFunding) * 100);
    } else if (project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding === 0) {
        percentageFunded = Math.round(((project.stages[0].currentFunding+project.stages[1].currentFunding) / fullgoalFunding) * 100);
    } else if (project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding > 0) {
        percentageFunded = Math.round(((project.stages[0].currentFunding+project.stages[1].currentFunding+project.stages[2].currentFunding) / fullgoalFunding) * 100);
    }


    const handleViewProject = () => {
        setIsLoading(true);
        router.push(`/explore/${project.projectId}`);
        setIsLoading(false);
    };

    const handleEditProject = () => {
        setIsLoading(true);
        router.push(`/create-project/${project.projectId}/basic`);
        setIsLoading(false);
    };

    const handleFavoriteProject = async () => {
        if (initUser) {
            setIsFavorited(!isFavorited);
            await toggleFavoriteProject(project.projectId);
        } else {
            router.push(`/sign-in`);
        }
    };
    return (
        <section>
            <div className="pl-6 p-3">
                <div className="w-full h-full rounded-lg overflow-hidden relative group">
                    <div className={`relative w-full h-48 ${project.carouselImageUrls.length ? "" : "bg-orange-300"}`}>
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
                                <LoadingSection />
                            </div>
                        )}
                        {
                            project.carouselImageUrls.length !== 0 ? (
                                <Image
                                    className="w-full h-full object-contain"
                                    src={project.carouselImageUrls[0]}
                                    alt={project.projectId}
                                    width={400}
                                    height={400}
                                />
                            ) : (
                                <Image
                                    className="pl-20 w-3/4 h-full object-contain"
                                    src="/assets/SharkLogo.png"
                                    alt={project.projectId}
                                    width={400}
                                    height={400}
                                />
                                // <div className="rounded-full w-1/3 bg-orange-500 absolute top-28 left-24 text-center">No image yet</div>
                            ) 
                        }
                        
                        {/* Hover elements */}
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <button
                                className="bg-orange-600 text-white font-semibold py-2 px-4 rounded-full"
                                onClick={handleViewProject}
                            >
                                View Project
                            </button>
                            {(showEditProject && project.status === 0) && (
                                <button
                                    className="bg-orange-600 text-white ml-4 font-semibold py-2 px-4 rounded-full"
                                    onClick={handleEditProject}
                                >
                                    Edit Project
                                </button>
                            )}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                className="bg-orange-600 text-white p-2 rounded-full"
                                onClick={handleFavoriteProject}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill={isFavorited ? "yellow" : "white"} // Change color based on state
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 21l-7-5.3L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="pt-3 py-1">
                        <div className="w-64 h-10 text-xl font-semibold text-gray-800 truncate whitespace-nowrap">{project.name}</div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                {project.stages[0].currentFunding ===0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0 ? (
                                    <>Fund at {project.stages[0].fundingCost.toLocaleString()}฿ | </>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0 ? (
                                    <>Fund at {project.stages[0].fundingCost.toLocaleString()}฿ | </>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding === 0 ? (
                                    <>Fund at {project.stages[1].fundingCost.toLocaleString()}฿ | </>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding > 0 ? (
                                    <>Fund at {project.stages[2].fundingCost.toLocaleString()}฿ | </>
                                ) : null}
                                {project.stages[0].currentFunding === 0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0 ? (
                                    <>Stage 1</>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0 ? (
                                    <>Stage 1</>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding === 0 ? (
                                    <>Stage 2</>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding > 0 ? (
                                    <>Stage 3</>
                                ) : null}
                            </p>
                            {showEditProject && (
                                <div className={`px-1  text-sm rounded-md text-white ${project.status ? "bg-orange-600" : "bg-orange-300"}`}>{`${project.status ? "Launched" : "Draft"}`}</div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2 mb-2">
                            <div
                                className="bg-orange-400 h-2.5 rounded-full"
                                style={{ width: `${percentageFunded}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-left">
                            <span className="text-sm text-gray-600">
                                {project.stages[0].currentFunding === 0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0 ? (
                                    <>{project.stages[0].currentFunding.toLocaleString()}฿ |</>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding === 0 && project.stages[2].currentFunding === 0 ? (
                                    <>{project.stages[0].currentFunding.toLocaleString()}฿ |</>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding === 0 ? (
                                    <>{project.stages[1].currentFunding.toLocaleString()}฿ |</>
                                ) : project.stages[0].currentFunding > 0 && project.stages[1].currentFunding > 0 && project.stages[2].currentFunding > 0 ? (
                                    <>{project.stages[2].currentFunding.toLocaleString()}฿ |</>
                                ) : null}
                                {/* {project.stages[0].fundingCost.toLocaleString()}฿ |
                                {project.stages[0].currentFunding.toLocaleString()}฿ | */}
                            </span>
                            <span className="text-sm text-gray-600 ml-1">
                                {percentageFunded}% funded
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SingleprojectCard;
