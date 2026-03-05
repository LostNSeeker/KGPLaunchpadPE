"use client";
import { useRef } from "react";
import { TimelineContent } from "@/components/ui/timeline-animation";

// Dummy image URLs since unsplash links in example might expire or be slow. 
// Using placeholder avatars for now or keeping originals if they work.
// Actually, I'll keep the original URLs as they are likely fine for a demo.

export function ClientFeedback() {
    const testimonialRef = useRef<HTMLDivElement>(null);
  
    const revealVariants = {
      visible: (i: number) => ({
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          delay: i * 0.2, // Reduced delay for snappier feel
          duration: 0.5,
        },
      }),
      hidden: {
        filter: "blur(10px)",
        y: -20,
        opacity: 0,
      },
    };
  
  return (
    <section className="w-full bg-white">
      <div className="relative h-full container text-black mx-auto rounded-lg py-14 bg-white" ref={testimonialRef}>
        <article className={"max-w-screen-md mx-auto text-center space-y-2 mb-12"} >
          <TimelineContent as="h1" className={"xl:text-4xl text-3xl font-medium"} animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef}>
            Trusted by Founders and Students
          </TimelineContent>
          <TimelineContent as="p" className={"mx-auto text-gray-500"} animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef}>
            Hear from founders who get work done and students who learn by doing.
          </TimelineContent>
        </article>
        <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col w-full px-4">
          <div className="md:flex lg:flex-col lg:space-y-4 h-full gap-4">
            <TimelineContent animationNum={0} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-primaryColor overflow-hidden rounded-lg border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>
              <article className="mt-auto relative z-10">
                <p className="text-gray-700 italic mb-6">
                  "KGP Launchpad has been a game-changer for us. We found talented
                  students for our MVP and the launchpad team was incredibly responsive."
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Priya Sharma
                    </h2>
                    <p className="text-gray-500 text-sm">Founder, TechVentures</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=687&auto=format&fit=crop"
                    alt="Priya Sharma"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={1} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] lg:h-fit lg:shrink-0 flex flex-col justify-between relative bg-blue-600 text-white overflow-hidden rounded-lg border border-blue-500 p-6 shadow-md">
              <article className="mt-auto">
                <p className="italic mb-6">
                  "We've seen incredible results with KGP Launchpad. Found the right
                  developers through the launchpad — highly recommend."
                </p>
                <div className="flex justify-between items-center border-t border-blue-500/30 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">Arjun Mehta</h2>
                    <p className="text-blue-100 text-sm">Founder, Kintsugi Labs</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1512485694743-9c9538b4e6e0?q=80&w=687&auto=format&fit=crop"
                    alt="Arjun Mehta"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                </div>
              </article>
            </TimelineContent>
          </div>
          <div className="lg:h-full md:flex lg:flex-col h-fit lg:space-y-4 gap-4">
            <TimelineContent animationNum={2} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white overflow-hidden rounded-lg border border-gray-800 p-6 shadow-md">
              <article className="mt-auto">
                <p className="text-gray-300 italic mb-6">
                  "KGP Launchpad connected us with sharp IIT KGP talent. Professional
                  and fair — the way we operate has improved a lot."
                </p>
                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Ananya Reddy
                    </h2>
                    <p className="text-gray-400 text-sm">Founder, Odeao Labs</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=1021&auto=format&fit=crop"
                    alt="Ananya Reddy"
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={3} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white overflow-hidden rounded-lg border border-gray-800 p-6 shadow-md">
              <article className="mt-auto">
                <p className="text-gray-300 italic mb-6">
                  "We're extremely satisfied with KGP Launchpad. The platform's
                  expertise and dedication have exceeded our expectations."
                </p>
                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">Rohan Verma</h2>
                    <p className="text-gray-400 text-sm">Founder, Labsbo</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1615109398623-88346a601842?q=80&w=687&auto=format&fit=crop"
                    alt="Rohan Verma"
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={4} customVariants={revealVariants} timelineRef={testimonialRef} className="flex flex-col justify-between relative bg-[#111111] text-white overflow-hidden rounded-lg border border-gray-800 p-6 shadow-md">
              <article className="mt-auto">
                <p className="text-gray-300 italic mb-6">
                  "Customer support on KGP Launchpad is exceptional. They're
                  always available and helped us find the right student team."
                </p>
                <div className="flex justify-between items-center border-t border-gray-800 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Kavya Nair
                    </h2>
                    <p className="text-gray-400 text-sm">Founder, Boxefi</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1740102074295-c13fae3e4f8a?q=80&w=687&auto=format&fit=crop"
                    alt="Kavya Nair"
                    className="w-12 h-12 rounded-full object-cover border border-gray-700"
                  />
                </div>
              </article>
            </TimelineContent>
          </div>
          <div className="h-full md:flex lg:flex-col lg:space-y-4 gap-4">
            <TimelineContent animationNum={5} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[3] flex-[4] flex flex-col justify-between relative bg-blue-600 text-white overflow-hidden rounded-lg border border-blue-500 p-6 shadow-md">
              <article className="mt-auto">
                <p className="italic mb-6">
                  "KGP Launchpad has been a key partner in our growth journey."
                </p>
                <div className="flex justify-between items-center border-t border-blue-500/30 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">Vikram Singh</h2>
                    <p className="text-blue-100 text-sm">Founder, Odeao Labs</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1563237023-b1e970526dcb?q=80&w=765&auto=format&fit=crop"
                    alt="Vikram Singh"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                </div>
              </article>
            </TimelineContent>
            <TimelineContent animationNum={6} customVariants={revealVariants} timelineRef={testimonialRef} className="lg:flex-[7] flex-[6] flex flex-col justify-between relative bg-white overflow-hidden rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none"></div>
              <article className="mt-auto relative z-10">
                <p className="text-gray-700 italic mb-6">
                  "KGP Launchpad has been a true game-changer for us. Exceptional
                  service and commitment to connecting founders with IIT KGP talent
                  have made a real impact on our business."
                </p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <h2 className="font-semibold text-lg">Aditya Krishnan</h2>
                    <p className="text-gray-500 text-sm">CTO, Spectrum</p>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1590086782957-93c06ef21604?q=80&w=687&auto=format&fit=crop"
                    alt="Aditya Krishnan"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                </div>
              </article>
            </TimelineContent>
          </div>
        </div>

        {/* Decorative Grid Lines - Positioned relative to section */}
        <div className="absolute border-b-2 border-[#e6e6e6] bottom-4 h-16 z-[2] md:w-full w-[90%] md:left-0 left-[5%] pointer-events-none">
          <div className="container mx-auto w-full h-full relative before:absolute before:-left-2 before:-bottom-2 before:w-4 before:h-4 before:bg-white before:shadow-sm before:border border-gray-200 before:border-gray-300 after:absolute after:-right-2 after:-bottom-2 after:w-4 after:h-4 after:bg-white after:shadow-sm after:border after:border-gray-300 "></div>
        </div>
      </div>
    </section>
  );
}
