import React from "react";

import Link from "next/link";
import Image from "next/image";

type Props = {};

export default function Footer({}: Props) {
    return (
        <section>
            <footer className="bg-primary text-white py-8">
                <div className="flex flex-col gap-2 justify-center items-center">
                    <Image
                        width={600}
                        height={300}
                        alt="Footer Icon"
                        src="/assets/FooterIcon.svg"
                    />
                    <p className="mt-2">&copy; 2024 Shark Funding. All rights reserved.</p>
                </div>
            </footer>
        </section>
    );
}
