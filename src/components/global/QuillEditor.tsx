"use client";

import React, { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    singleUpload,
    ProjectSingleUploadDetail,
    UserSingleUploadDetail,
} from "src/services/apiService/files/singleUpload";
import { message } from "antd";
import { FileUploadResponse } from "src/interfaces/response/fileResponse";

type QuillEditorProps = {
    value: string;
    onChange: (data: string) => void;
    projectId?: string;
};

export default function QuillEditor({ value, onChange, projectId }: QuillEditorProps) {
    const quillRef = useRef<any>(null);

    const imageHandler = async () => {
        const editor = quillRef.current.getEditor();
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file && /^image\//.test(file.type)) {
                try {
                    let response: FileUploadResponse;
                    if (projectId) {
                        const payload: ProjectSingleUploadDetail = {
                            file: file,
                            type: "projectGeneral",
                            projectId: projectId,
                        };
                        response = await singleUpload(payload);
                    } else {
                        const payload: UserSingleUploadDetail = {
                            file: file,
                            type: "userGeneral",
                        };
                        response = await singleUpload(payload);
                    }
                    const url = response.url;

                    if (url) {
                        editor.insertEmbed(editor.getSelection()?.index || 0, "image", url);
                    } else {
                        message.error("Failed to upload image.");
                    }
                } catch (error) {
                    message.error("Image upload failed.");
                }
            } else {
                message.error("You can only upload images.");
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["image", "link"],
                    [
                        {
                            color: [
                                "#000000",
                                "#e60000",
                                "#ff9900",
                                "#ffff00",
                                "#008a00",
                                "#0066cc",
                                "#9933ff",
                                "#ffffff",
                                "#facccc",
                                "#ffebcc",
                                "#ffffcc",
                                "#cce8cc",
                                "#cce0f5",
                                "#ebd6ff",
                                "#bbbbbb",
                                "#f06666",
                                "#ffc266",
                                "#ffff66",
                                "#66b966",
                                "#66a3e0",
                                "#c285ff",
                                "#888888",
                                "#a10000",
                                "#b26b00",
                                "#b2b200",
                                "#006100",
                                "#0047b2",
                                "#6b24b2",
                                "#444444",
                                "#5c0000",
                                "#663d00",
                                "#666600",
                                "#003700",
                                "#002966",
                                "#3d1466",
                            ],
                        },
                    ],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        [projectId]
    );

    return (
        <ReactQuill
            theme="snow"
            className="min-w-[90dvw] pr-40"
            ref={quillRef}
            value={value}
            modules={modules}
            onChange={onChange}
        />
    );
}
