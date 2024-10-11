"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { getCreatorOwnProjects } from "src/services/apiService/users/getCreatorOwnProjects";
import { ProjectSummary } from "src/interfaces/datas/project";
import LoadingPage from "src/components/global/LoadingPage";

// Enum สำหรับ StageId
export enum StageId {
    CONCEPT = 0,
    PROTOTYPE = 1,
    PRODUCTION = 2,
    UNDEFINE = 3,
}

const StagePage = () => {
    const [projects, setProjects] = useState<ProjectSummary[]>([]); // เก็บข้อมูลโปรเจกต์จาก API
    const [loading, setLoading] = useState(true); // ใช้สำหรับ loading state
    const [error, setError] = useState<string | null>(null); // สำหรับจัดการ error
    const [activeStage, setActiveStage] = useState(0); // ควบคุมการเลื่อนของ stage

    // เรียก API เมื่อคอมโพเนนต์เรนเดอร์
    useEffect(() => {
        async function fetchProjects() {
            try {
                // เรียกใช้ API เพื่อดึงข้อมูลโปรเจกต์ของผู้สร้าง
                const data = await getCreatorOwnProjects();
                setProjects(data.data.launched); // ตั้งค่าข้อมูลที่ได้จาก API ไปยัง state
                setLoading(false); // ปิด loading
            } catch (error) {
                console.error("Error fetching creator projects: ", error); // ตรวจสอบ error ถ้ามี
                setError("Failed to load projects");
                setLoading(false); // ปิด loading เมื่อ error
            }
        }
        fetchProjects();
    }, []);

    // ฟังก์ชันสำหรับแสดงชื่อ Stage จาก stageId
    const getStageName = (stageId: StageId): string => {
        switch (stageId) {
            case StageId.CONCEPT:
                return "Concept";
            case StageId.PROTOTYPE:
                return "Prototype";
            case StageId.PRODUCTION:
                return "Production";
            default:
                return "Undefined Stage";
        }
    };

    // ฟังก์ชันสำหรับเปลี่ยน Stage ไปยังสเตจถัดไป
    const goToNextStage = (index: number) => {
        setProjects((prevProjects) => {
            const updatedProjects = [...prevProjects];
            const currentStageId = updatedProjects[index].currentStage?.stageId ?? StageId.CONCEPT;

            // ตรวจสอบว่า currentStageId ไม่เกิน StageId.PRODUCTION และเพิ่ม stage ทีละขั้น
            if (currentStageId === StageId.CONCEPT) {
                updatedProjects[index].currentStage = {
                    ...updatedProjects[index].currentStage,
                    stageId: StageId.PROTOTYPE, // เปลี่ยนจาก Concept ไป Prototype
                };
            } else if (currentStageId === StageId.PROTOTYPE) {
                updatedProjects[index].currentStage = {
                    ...updatedProjects[index].currentStage,
                    stageId: StageId.PRODUCTION, // เปลี่ยนจาก Prototype ไป Production
                };
            } else {
                console.log(`Project ${index} is already in the final stage.`);
            }

            return updatedProjects;
        });

        // ทำให้กรอบเลื่อนไป stage ถัดไป
        setActiveStage((prevActiveStage) => Math.min(prevActiveStage + 1, projects.length - 1));
    };

    if (loading) {
        return <LoadingPage />;
    }
    if (error) return <p>{error}</p>;
    if (!projects.length) return <p>No projects available.</p>; // แสดงข้อความเมื่อไม่มีโปรเจกต์

    return (
        <div className="flex justify-center mt-10">
            {/* Container สำหรับสองกรอบ */}
            <div className="overflow-hidden w-full max-w-lg">
                {/* Section ที่ใช้สำหรับเลื่อน */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${activeStage * 100}%)` }} // เลื่อน stage เมื่อ activeStage เปลี่ยน
                >
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="w-full flex-shrink-0 p-8 bg-orange-100 rounded-lg shadow-lg"
                        >
                            <h2 className="text-2xl font-bold mb-2">{project.name || "No Name"}</h2>
                            {/* ใช้ getStageName เพื่อแสดงชื่อ Stage ที่ถูกต้อง */}
                            <p className="text-lg mb-6">
                                {getStageName(project.currentStage?.stageId ?? StageId.UNDEFINE)}
                            </p>

                            <div className="flex items-center mb-4">
                                <AiOutlineCheckCircle className="text-green-600 h-8 w-8" />
                                <p className="text-lg ml-3">Funding complete</p>
                            </div>

                            <div className="flex items-center mb-6">
                                <AiOutlineCheckCircle className="text-green-600 h-8 w-8" />
                                <p className="text-lg ml-3">Project progress has been updated by creator</p>
                            </div>

                            {/* ปุ่มจะถูกแสดงตลอดแม้ว่า stage สุดท้าย */}
                            <button
                                onClick={() => goToNextStage(index)} // เมื่อกดปุ่มจะไปยังสเตจถัดไป
                                className="mt-6 bg-gray-200 text-black font-semibold py-3 px-6 rounded-full text-lg"
                            >
                                Go to next stage
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StagePage;
