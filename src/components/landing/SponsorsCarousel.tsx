import React from 'react'

// E-cell sponsor logos — explicit imports so the strip is always visible
import img1 from '../../images/EcellSponsors/Associate_Partner_1_2026.png'
import img2 from '../../images/EcellSponsors/Associate_Partner_3_2026.jpeg'
import img3 from '../../images/EcellSponsors/Associate_partner_2_2026.jpg'
import img4 from '../../images/EcellSponsors/Associate_partner_4_2026.png'
import img5 from '../../images/EcellSponsors/C0_Title_Partner_2026.png'
import img6 from '../../images/EcellSponsors/CAP_Title_Partner_7_2026.jpeg'
import img7 from '../../images/EcellSponsors/Media_Partner_11_2026.jpeg'
import img8 from '../../images/EcellSponsors/Media_Partner_12_2026.jpeg'
import img9 from '../../images/EcellSponsors/Media_Partner_3_2026.jpeg'
import img10 from '../../images/EcellSponsors/Media_Partner_4_2026.jpeg'
import img11 from '../../images/EcellSponsors/Media_Partner_5_2026.png'
import img12 from '../../images/EcellSponsors/Technology_Partner_2026.png'
import img13 from '../../images/EcellSponsors/Title_Media_Partner_2_2026.png'
import img14 from '../../images/EcellSponsors/Titlemediapartner.png.png'

const sponsorUrls: string[] = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14,
]

export function SponsorsCarousel() {
  // Duplicate for seamless right-to-left loop
  const duplicated = [...sponsorUrls, ...sponsorUrls]

  return (
    <section className="w-full py-4 bg-white/20 backdrop-blur-sm border-y border-gray-200/50 overflow-hidden rounded-lg" aria-label="Our sponsors">
      <p className="text-center text-xs md:text-sm font-medium text-gray-600 uppercase tracking-wider mb-3">
        Companies associated with us
      </p>
      <div className="relative h-16 md:h-20 overflow-hidden">
        <div
          className="flex gap-12 md:gap-16 items-center h-full min-w-max sponsor-strip"
          style={{
            animation: 'sponsor-marquee 40s linear infinite',
          }}
        >
          {duplicated.map((url, i) => (
            <div
              key={`${i}-${url}`}
              className="flex-shrink-0 flex items-center justify-center h-full"
            >
              <img
                src={url}
                alt={`Sponsor ${(i % sponsorUrls.length) + 1}`}
                className="max-h-10 md:max-h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
