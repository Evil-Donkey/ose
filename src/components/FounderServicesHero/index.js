"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "@/components/Button";
import Container from "@/components/Container";
import VideoPopup from "@/components/FlexibleContent/HeroVideo/VideoPopup";
import VimeoEmbed from "@/components/FlexibleContent/HeroVideo/VimeoEmbed";
import { getOptimizedVideoProps, getVideoSources } from "@/lib/videoUtils";
import { proxyImageUrl } from "@/lib/proxyImage";

gsap.registerPlugin(ScrollTrigger);

const FounderServicesHero = ({ title, content, videoData }) => {
  const {
    fullMovie,
    introMovie,
    mobileMovie,
    fullMovieVimeo,
    introMovieMobileVimeo,
    introMovieVimeo,
    headings,
    desktopImage,
    mobileImage,
    copyOnTheLeft,
    ctaLabel,
  } = videoData || {};

  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef([]);
  const textRef = useRef([]);
  const textWrapperRef = useRef([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "center center",
        scrub: false,
      },
    });

    if (videoRef.current.length) {
      tl.to(videoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
      });
    }

    if (textRef.current.length) {
      tl.to(
        textRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 2,
          ease: "power4.out",
          stagger: 0.1,
        },
        "-=1"
      );
    }

    if (buttonRef.current) {
      tl.to(
        buttonRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
        },
        "-=1.5"
      );
    }

    if (textWrapperRef.current.length) {
      gsap.to(textWrapperRef.current, {
        y: -10,
        duration: 1,
        stagger: {
          amount: 0.5,
          from: "start",
          ease: "elastic.out(1,0.3)",
        },
        scrollTrigger: {
          trigger: textWrapperRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.4,
        },
      });
    }
  }, [videoData]);

  const hasVideo =
    introMovieVimeo ||
    introMovie ||
    introMovieMobileVimeo ||
    mobileMovie ||
    desktopImage ||
    mobileImage;

  const popupSource = fullMovieVimeo || fullMovie;

  return (
    <>
      <div className="bg-linear-to-t from-black/10 via-black/0 to-black/0 pb-16 md:pb-24 lg:pb-30">
        <Container className="pt-45 lg:pt-50 2xl:pt-60">
          <div className="text-center flex flex-col items-center gap-5 mb-12 lg:mb-16 xl:mb-20">
            {title && (
              <h1 className="text-7xl/18 md:text-8xl/23 text-darkblue text-center">
                {title}
              </h1>
            )}
            {content && (
              <div
                className="w-full xl:px-17 lg:w-200 text-xl md:text-2xl text-darkblue"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </Container>

        {hasVideo && (
          <Container>
            <div
              ref={heroRef}
              className="relative mx-auto h-[50vh] md:h-[65vh] lg:h-[75vh] min-h-[320px]"
            >
              <div className="relative h-full w-full">
                {introMovieVimeo ? (
                  <div
                    ref={(el) => (videoRef.current[0] = el)}
                    className={`w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 relative overflow-hidden ${
                      mobileMovie || introMovieMobileVimeo ? "hidden lg:block" : ""
                    }`}
                  >
                    {desktopImage && (
                      <div
                        className={`w-full h-full bg-cover bg-center absolute inset-0 ${
                          mobileImage ? "hidden lg:block" : ""
                        }`}
                        style={{
                          backgroundImage: `url(${proxyImageUrl(desktopImage.mediaItemUrl)})`,
                        }}
                      />
                    )}
                    {mobileImage && (
                      <div
                        className="w-full h-full bg-cover bg-center absolute inset-0 lg:hidden"
                        style={{
                          backgroundImage: `url(${proxyImageUrl(mobileImage.mediaItemUrl)})`,
                        }}
                      />
                    )}
                    <VimeoEmbed vimeoUrl={introMovieVimeo} />
                  </div>
                ) : (
                  introMovie && (
                    <div
                      className={`w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 relative ${
                        mobileMovie ? "hidden lg:block" : ""
                      }`}
                      ref={(el) => (videoRef.current[0] = el)}
                    >
                      {desktopImage && (
                        <div
                          className={`w-full h-full bg-cover bg-center absolute inset-0 ${
                            mobileImage ? "hidden lg:block" : ""
                          }`}
                          style={{
                            backgroundImage: `url(${proxyImageUrl(desktopImage.mediaItemUrl)})`,
                          }}
                        />
                      )}
                      {mobileImage && (
                        <div
                          className="w-full h-full bg-cover bg-center absolute inset-0 lg:hidden"
                          style={{
                            backgroundImage: `url(${proxyImageUrl(mobileImage.mediaItemUrl)})`,
                          }}
                        />
                      )}
                      <video
                        {...getOptimizedVideoProps(introMovie, {
                          context: "hero",
                          isHero: true,
                          isAboveFold: true,
                          isAutoplay: true,
                          className: "w-full h-full object-cover rounded-2xl",
                          controls: false,
                          muted: true,
                          loop: true,
                          playsInline: true,
                        })}
                      >
                        {getVideoSources(introMovie).map((source, index) => (
                          <source key={index} src={source.src} type={source.type} />
                        ))}
                      </video>
                    </div>
                  )
                )}

                {introMovieMobileVimeo ? (
                  <div
                    ref={(el) => (videoRef.current[1] = el)}
                    className="w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 overflow-hidden lg:hidden relative"
                  >
                    {mobileImage && (
                      <div
                        className="w-full h-full bg-cover bg-center absolute inset-0"
                        style={{
                          backgroundImage: `url(${proxyImageUrl(mobileImage.mediaItemUrl)})`,
                        }}
                      />
                    )}
                    <VimeoEmbed vimeoUrl={introMovieMobileVimeo} />
                  </div>
                ) : (
                  mobileMovie && (
                    <div
                      className="w-full h-full rounded-2xl shadow-xl opacity-0 scale-125 overflow-hidden lg:hidden relative"
                      ref={(el) => (videoRef.current[1] = el)}
                    >
                      {mobileImage && (
                        <div
                          className="w-full h-full bg-cover bg-center absolute inset-0"
                          style={{
                            backgroundImage: `url(${proxyImageUrl(mobileImage.mediaItemUrl)})`,
                          }}
                        />
                      )}
                      <video
                        {...getOptimizedVideoProps(mobileMovie, {
                          context: "hero",
                          isHero: true,
                          isAboveFold: true,
                          isAutoplay: true,
                          className: "w-full h-full object-cover rounded-2xl",
                          controls: false,
                          muted: true,
                          loop: true,
                          playsInline: true,
                        })}
                      >
                        {getVideoSources(mobileMovie).map((source, index) => (
                          <source key={index} src={source.src} type={source.type} />
                        ))}
                      </video>
                    </div>
                  )
                )}

                {desktopImage && !introMovieVimeo && !introMovie && (
                  <div
                    ref={(el) => (videoRef.current[2] = el)}
                    className={`w-full h-full rounded-2xl shadow-xl bg-cover bg-center opacity-0 scale-125 ${
                      mobileImage ? "hidden lg:block" : ""
                    }`}
                    style={{
                      backgroundImage: `url(${proxyImageUrl(desktopImage.mediaItemUrl)})`,
                    }}
                  />
                )}
                {mobileImage && !introMovieMobileVimeo && !mobileMovie && !introMovieVimeo && !introMovie && (
                  <div
                    ref={(el) => (videoRef.current[3] = el)}
                    className="w-full h-full rounded-2xl shadow-xl bg-cover bg-center opacity-0 scale-125 lg:hidden"
                    style={{
                      backgroundImage: `url(${proxyImageUrl(mobileImage.mediaItemUrl)})`,
                    }}
                  />
                )}

                <div
                  className={`absolute top-0 left-0 ${
                    !copyOnTheLeft ? "lg:left-auto lg:right-[13%]" : ""
                  } p-6 flex flex-col justify-center h-full text-white z-50`}
                >
                  {headings?.length > 0 && (
                    <h2 className="text-7xl/18 md:text-8xl/23 2xl:text-8xl/27">
                      {headings.map((heading, index) => (
                        <span
                          key={index}
                          className="block overflow-hidden"
                          ref={(el) => (textWrapperRef.current[index] = el)}
                        >
                          <span
                            className="block opacity-0 translate-y-full"
                            ref={(el) => (textRef.current[index] = el)}
                          >
                            {heading.heading}
                          </span>
                        </span>
                      ))}
                    </h2>
                  )}
                  {popupSource && (
                    <div ref={buttonRef} className="mt-8 opacity-0 translate-y-5">
                      <Button onClick={() => setIsVideoPopupOpen(true)}>
                        {ctaLabel ? ctaLabel : "Watch Full Video"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        )}
      </div>

      <VideoPopup
        isOpen={isVideoPopupOpen}
        onClose={() => setIsVideoPopupOpen(false)}
        fullMovie={popupSource}
      />
    </>
  );
};

export default FounderServicesHero;
