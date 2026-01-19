


export default function OurStorySection() {
  return (
    <section className="w-full py-16 bg-[#FFFCF9] ">
     
           {/* Our Story Section */}
            <section className="w-full py-20 bg-center md:bg-top bg-cover relative" style={{backgroundImage: "url('/v2/our_story.png')"}}>
              {/* Dark overlay for text legibility */}
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                  <span className="text-[#8A9C66] font-medium tracking-wider uppercase text-sm">Discover</span>
                  <h2 className="text-3xl md:text-5xl font-bold text-[#fff] mt-2">Our Story</h2>
                </div>
      
                <div className="prose prose-lg max-w-none text-[#fff]">
                  <p className="text-xl md:text-2xl font-light text-center italic mb-8">
                    Kailash is not manufactured.<br />
                    It is discovered.
                  </p>
      
                  <div className="space-y-6 text-base md:text-lg leading-relaxed">
                    <p>
                      High in the Himalayas—where silence is deeper, air is purer, and time moves slowly—nature
      creates Shilajit over centuries. Hidden within ancient cliffs, it forms beyond reach, beyond haste, beyond
      imitation.
                    </p>
      
                    <p>
                      Reaching it demands more than effort. It requires devotion. A multi-day journey across
      glacial paths and razor-edged terrain, guided only by experience and respect for the mountain. This is
      where our story begins.
                    </p>
      
                    <p>
                      We partner exclusively with native Himalayan families—custodians of generational wisdom—who
       harvest each trace of resin by hand. No machinery. No acceleration. No compromise. Every extraction is an
      act of reverence, not production.
                    </p>
      
                    <p>
                      Our Shilajit is never heated or chemically refined. It is purified naturally under
      Himalayan sunlight and cold alpine winds, preserving its living mineral essence in its purest form.
                    </p>
      
                    <p>
                      True Shilajit is exceptionally rare. And when it is real, it does not need persuasion. The
      body recognizes it. Energy deepens. Focus sharpens. Strength returns with quiet certainty.
                    </p>
      
                    <p>
                      Kailash exists for those who seek authenticity over abundance, essence over excess, truth
      over trend.
                    </p>
                  </div>
      
                  <p className="text-xl md:text-2xl font-medium text-center mt-10 text-[#fff]">
                    This is not a supplement.<br />
                    <span className="text-[#fff]">It is a standard.</span>
                  </p>
                </div>
              </div>
            </section>
      
            {/* Mission & Vision Section */}
            <section className="w-full py-20 bg-[#F5F2ED]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      
                  {/* Our Mission */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 shadow-sm">
                    <div className="mb-6">
                      <span className="inline-block w-12 h-1 bg-[#8A9C66] rounded-full mb-4"></span>
                      <h3 className="text-2xl md:text-3xl font-bold text-[#373436]">Our Mission</h3>
                    </div>
      
                    <p className="text-lg md:text-xl font-medium text-[#373436] mb-6 leading-relaxed">
                      To preserve and deliver nature&apos;s rarest living substances in their purest form—without
       haste, heat, or compromise.
                    </p>
      
                    <div className="space-y-4 text-[#373436]/80">
                      <p>
                        At Kailash, our mission is to protect the integrity of authentic Himalayan Shilajit by
      honoring ancient harvesting wisdom, ethical sourcing, and natural purification.
                      </p>
                      <p>
                        We exist to offer only what truly works—substances shaped by time, untouched by industry,
          nd respected at every stage of their journey.
                      </p>
                      <p className="font-medium text-[#373436]">
                        We serve those who value truth over trend, purity over profit, and results that are
      felt—not promised.
                      </p>
                    </div>
                  </div>
      
                  {/* Our Vision */}
                  <div className="bg-[#373436] rounded-2xl p-8 md:p-10 shadow-sm">
                    <div className="mb-6">
                      <span className="inline-block w-12 h-1 bg-[#8A9C66] rounded-full mb-4"></span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h3>
                    </div>
      
                    <p className="text-lg md:text-xl font-medium text-white mb-6 leading-relaxed">
                      To redefine the global standard of natural vitality.
                    </p>
      
                    <div className="space-y-4 text-white/80">
                      <p>
                        We envision a world where wellness is rooted in authenticity, where luxury means purity,
         and where ancient natural intelligence is preserved—not diluted—for future generations.
                      </p>
                      <p>
                        Kailash aims to become a globally trusted symbol of uncompromising quality—bridging
      Himalayan heritage with modern discernment, and setting a new benchmark for what true natural power should
      be.
                      </p>
                    </div>
      
                    <div className="mt-8 pt-6 border-t border-white/20">
                      <p className="text-white/90 font-medium text-center">
                        Not mass-produced.<br />
                        Not manipulated.<br />
                        <span className="text-[#8A9C66]">Only what nature perfected.</span>
                      </p>
                    </div>
                  </div>
      
                </div>
              </div>
            </section>
      

    </section>
  )
}