import {
  Rocket,
  Briefcase,
  GraduationCap,
  Target,
  TrendingUp,
  Award,
} from "lucide-react";
import { ExpandingCards } from "../ui/expanding-cards";
import type { CardItem } from "../ui/expanding-cards";

const successStories: CardItem[] = [
  {
    id: "mvp-weeks",
    title: "MVP in 6 weeks",
    description:
      "A founder needed a working prototype for investors. A team of three IIT KGP students delivered the MVP on time and within budget through KGP Launchpad.",
    imgSrc:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&auto=format&fit=crop&q=60",
    icon: <Rocket size={24} />,
    linkHref: "#",
  },
  {
    id: "idea-to-launch",
    title: "From idea to launch",
    description:
      "A student-led team built and shipped a fintech feature for an alumni-founded startup. They learned production workflows and got strong referrals.",
    imgSrc:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=60",
    icon: <GraduationCap size={24} />,
    linkHref: "#",
  },
  {
    id: "hired-from-platform",
    title: "Hired from the platform",
    description:
      "After completing two projects as a developer on KGP Launchpad, a final-year student was offered a full-time role at the same startup.",
    imgSrc:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=60",
    icon: <Briefcase size={24} />,
    linkHref: "#",
  },
  {
    id: "scale-with-talent",
    title: "Scale with student talent",
    description:
      "A B2B SaaS founder scaled the product roadmap by onboarding two KGP Launchpad developers part-time. Quality and communication exceeded expectations.",
    imgSrc:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=60",
    icon: <TrendingUp size={24} />,
    linkHref: "#",
  },
  {
    id: "first-revenue",
    title: "First revenue with KGP talent",
    description:
      "A solo founder used KGP Launchpad to get design and dev support for her D2C brand. The site went live in a month and drove the first sales.",
    imgSrc:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&auto=format&fit=crop&q=60",
    icon: <Target size={24} />,
    linkHref: "#",
  },
  {
    id: "cross-campus-team",
    title: "Cross-campus team",
    description:
      "Students from different departments formed a team on the platform, delivered a full-stack project for an alumni, and continued as a freelance unit.",
    imgSrc:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&auto=format&fit=crop&q=60",
    icon: <Award size={24} />,
    linkHref: "#",
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="flex w-full flex-col items-center justify-center space-y-8 px-4 md:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Real outcomes from founders and students on KGP Launchpad. Hover or
            click on a card to read their story.
          </p>
        </div>
        <ExpandingCards items={successStories} defaultActiveIndex={0} />
      </div>
    </section>
  );
}
