import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 cards at once
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    arrows: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                },
            },
        ],
    };

    const banners = [
        {
            src: "/betfury.png",
            alt: "BetFury",
            title: "BetFury",
            subtitle: "Get Free Cryptos",
            link: "https://betfury.io/?r=LUCKYUser447840",
        },
        {
            src: "/faucetPay.png",
            alt: "FaucetPay",
            title: "FuacetPay",
            subtitle: "Fast, Easy and Free",
            link: "https://faucetpay.io/?r=68645",
        },
        {
            src: "/freeBitcoin.jpeg",
            alt: "FreeBitcoin",
            title: "FreeBitcoin",
            subtitle: "WIn $200 in Bitcoins every hour!",
            link: "https://freebitco.in/?r=4588595",
        },
    ];

    return (
        <div className="mb-4 sm:mb-6 bg-[#1a1a1a] p-4">
            <div className="max-w-7xl mx-auto">
                <Slider {...settings} className="mx-2 sm:mx-4">
                    {banners.map((banner, index) => (
                        <Link
                            href={banner.link}
                            key={index}
                            className="px-2"
                        >
                            <div className="bg-[#252525] rounded-lg overflow-hidden h-[200px] relative group transition-all duration-300 hover:transform hover:scale-[1.02]">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={banner.src}
                                        alt={banner.alt}
                                        layout="fill"
                                        objectFit="contain"
                                        className="rounded-lg"
                                        priority={index === 0}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                        <h3 className="text-white font-bold text-lg">
                                            {banner.title}
                                        </h3>
                                        <p className="text-gray-200 text-sm">
                                            {banner.subtitle}
                                        </p>
                                        {banner.date && (
                                            <p className="text-pink-500 text-sm mt-1">
                                                {banner.date}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Banner;