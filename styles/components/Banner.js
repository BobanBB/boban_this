import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: { arrows: true, dots: true },
            },
            {
                breakpoint: 768,
                settings: { arrows: false, dots: true },
            },
        ],
    };

    const banners = [
        {
            src: "/betfury.png",
            alt: "Mobile Banner 1",
            link: "https://betfury.io/?r=LUCKYUser447840",
        },
        {
            src: "/faucetPay.png",
            alt: "Mobile Banner 2",
            link: "https://faucetpay.io/?r=68645",
        },
        {
            src: "/freeBitcoin.jpeg",
            alt: "Mobile Banner 3",
            link: "https://freebitco.in/?r=4588595",
        },
    ];

    return (
        <div className="mb-4 sm:mb-6">
            {/* Desktop Slider */}
            <div className="hidden md:block">
                <Slider {...settings} className="mx-2 sm:mx-4">
                    {banners.map((banner, index) => (
                        <Link
                            href={banner.link}
                            key={index}
                            className="relative w-full h-[300px] overflow-hidden"
                        >
                            <Image
                                src={banner.src}
                                alt={banner.alt}
                                layout="fill"
                                objectFit="contain"  
                                className="rounded-lg"
                                priority={index === 0}
                            />
                        </Link>
                    ))}
                </Slider>
            </div>

            {/* Mobile Slider */}
            <div className="block md:hidden px-2">
                <Slider {...settings}>
                    {banners.map((banner, index) => (
                        <Link
                            target="_blank"
                            href={banner.link}
                            key={index}
                            className="relative w-full aspect-[16/9] overflow-hidden"
                        >
                            <Image
                                src={banner.src}
                                alt={banner.alt}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                                priority={index === 0}
                            />
                        </Link>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Banner;
