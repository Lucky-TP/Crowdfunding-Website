"use client";

import React, { useRef, useEffect, useState } from "react";
import ProductCard from "../SingleProduct/SingleProductCard";
import { ShowProject } from "src/interfaces/models/common"; // Adjust the import path as needed
import { getTenPopularProjects } from "src/services/apiService/projects/getTenPopularProjects"; // Adjust the import path as needed

interface CarouselTrendingProductCardProps {
    showTopic?: boolean;
}
export default function CarouselTrendingProductCard({
    showTopic = true,
}: CarouselTrendingProductCardProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [products, setProducts] = useState<ShowProject[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getTenPopularProjects();

                setProducts(data.data);
            } catch (error) {
                setError("An error occurred while fetching products.");
                console.error(
                    "An error occurred while fetching products:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: -carouselRef.current.clientWidth / 4,
                behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({
                left: carouselRef.current.clientWidth / 4,
                behavior: "smooth",
            });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <section className="relative">
            {showTopic && <p className="pb-2 font-bold">Top 10 Popular Projects</p>}
            <div className="relative">
                <button
                    onClick={scrollLeft}
                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 bg-transparent hover:bg-orange-400 p-2 rounded-full flex items-center justify-center h-12 w-12 border border-gray-300 hover:border-gray-500 transition-all duration-300"
                >
                    <span className="sr-only">Scroll Left</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <div className="pt-2 pb-4 overflow-x-hidden" ref={carouselRef}>
                    <ul className="flex space-x-8">
                        {products.map((product) => (
                            <li
                                key={product.projectId}
                                className="flex-shrink-0"
                                style={{ width: "calc(25% - 32px)" }}
                            >
                                <ProductCard product={product} />
                            </li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={scrollRight}
                    className="absolute -right-5 top-1/2 transform -translate-y-1/2 z-10 bg-transparent hover:bg-orange-400 p-2 rounded-full flex items-center justify-center h-12 w-12 border border-gray-300 hover:border-gray-500 transition-all duration-300"
                >
                    <span className="sr-only">Scroll Right</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500 hover:text-gray-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </section>
    );
}
