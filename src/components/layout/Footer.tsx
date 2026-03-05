import React from 'react'
import { Link } from 'react-router-dom'
import {
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react'
import kgp_logo from "../../images/kgp_logo.png"
import LaunchpadLogo from "../../images/LaunchpadLOGO.png"
import dvlaunchLogo from "../../images/dvlaunch_logo.jpeg"

const data = {
  facebookLink: '#',
  instaLink: '#',
  twitterLink: '#',
  githubLink: '#',
  platform: {
    projects: '/projects',
    register: '/register',
    messages: '/messages',
    launchpad: '/launchpad',
  },
  about: {
    history: '/about',
    team: '/team',
    blog: '/blog',
  },
  help: {
    privacy: '/privacy-policy',
    terms: '/terms-of-service',
    support: '/support',
  },
  contact: {
    email: 'launchpad@iitkgp.ac.in',
    phone: '+91 3222 255221',
    address: 'IIT Kharagpur, West Bengal',
  },
  company: {
    name: 'KGP Launchpad',
    description:
      "Connecting students with alumni, showcasing innovation, and building the future of IIT Kharagpur's startup ecosystem.",
    logo: kgp_logo,
  },
};

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: data.facebookLink },
  { icon: Instagram, label: 'Instagram', href: data.instaLink },
  { icon: Twitter, label: 'Twitter', href: data.twitterLink },
  { icon: Github, label: 'GitHub', href: data.githubLink },
];

const aboutLinks = [
  { text: 'About Us', href: data.about.history },
  { text: 'Meet the Team', href: data.about.team },
  { text: 'Blog', href: data.about.blog },
];

const platformLinks = [
  { text: 'Projects', href: data.platform.projects },
  { text: 'Launchpad', href: data.platform.launchpad },
  { text: 'Register', href: data.platform.register },
  { text: 'Messages', href: data.platform.messages },
];

const helpfulLinks = [
  { text: 'Privacy Policy', href: data.help.privacy },
  { text: 'Terms of Service', href: data.help.terms },
  { text: 'Support', href: data.help.support },
];

const contactInfo = [
  { icon: Mail, text: data.contact.email },
  { icon: Phone, text: data.contact.phone },
  { icon: MapPin, text: data.contact.address, isAddress: true },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-16 w-full place-self-end rounded-t-xl border-t">
      <div className="container mx-auto px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-primary flex justify-center gap-2 sm:justify-start items-center flex-wrap">
              <img
                src={LaunchpadLogo}
                alt="KGP Launchpad"
                className="h-16 w-auto object-contain"
              />
              <span className="text-2xl font-semibold">
                {data.company.name}
              </span>
            </div>
            <div className="mt-4 flex justify-center sm:justify-start items-center gap-2">
              <span className="text-sm text-muted-foreground">In partnership with</span>
              <div>
              <a
                href="https://devlaunch.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                <img
                  src={dvlaunchLogo}
                  alt="DevLaunch"
                  className="h-8 object-contain"
                />
                <span className="text-sm font-medium">DevLaunch</span>
              </a>
              </div>
             
            </div>

            <p className="text-muted-foreground mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              {data.company.description}
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-primary hover:text-primary/80 transition"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="w-6 h-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">About Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {aboutLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-muted-foreground hover:text-primary transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Platform</p>
              <ul className="mt-8 space-y-4 text-sm">
                {platformLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-muted-foreground hover:text-primary transition"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Helpful Links</p>
              <ul className="mt-8 space-y-4 text-sm">
                {helpfulLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className="text-muted-foreground hover:text-primary transition"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium">Contact Us</p>
              <ul className="mt-8 space-y-4 text-sm">
                {contactInfo.map(({ icon: Icon, text, isAddress }) => (
                  <li key={text}>
                    <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                      <Icon className="text-primary w-5 h-5 shrink-0" />
                      {isAddress ? (
                        <address className="text-muted-foreground -mt-0.5 flex-1 not-italic transition">
                          {text}
                        </address>
                      ) : (
                        <span className="text-muted-foreground flex-1 transition">
                          {text}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-muted-foreground">
              <span className="block sm:inline">All rights reserved.</span>
            </p>

            <p className="text-muted-foreground mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} {data.company.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
