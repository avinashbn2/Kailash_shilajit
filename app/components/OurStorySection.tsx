import Image from 'next/image'

interface StoryCard {
  id: string
  image: string
  title: string
  description: string
}

const storyCards: StoryCard[] = [
  {
    id: '1',
    image: '/api/placeholder/500/400',
    title: 'A MULTI-SENSORIAL JOURNEY',
    description: 'Authentic in its roots and sophisticated in its presentation, Forest Essentials takes you on an immersive, multi-sensorial journey with every product.'
  },
  {
    id: '2',
    image: '/api/placeholder/500/400',
    title: 'FRESH. PURE. POTENT.',
    description: "Forest Essentials' products are handcrafted using 100% natural ingredients, sourced from the vast Indian landscape, to ensure the highest standards of purity."
  },
  {
    id: '3',
    image: '/api/placeholder/500/400',
    title: 'A NEW ERA IN AYURVEDIC BEAUTY',
    description: 'A pioneer in the beauty industry, Forest Essentials was the first brand to combine traditional Ayurvedic practices with modern aesthetics for a luxurious experience.'
  }
]

export default function OurStorySection() {
  return (
    <section className="w-full py-16 bg-[#FFFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12 text-[#373436]">OUR STORY</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {storyCards.map((card) => (
            <div key={card.id} className="flex flex-col">
              <div className="relative aspect-[5/4] rounded-2xl overflow-hidden mb-6">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                />
              </div>
              
              <h3 className="text-lg font-bold mb-4 tracking-wide">
                {card.title}
              </h3>
              
              <p className="text-gray-700 leading-relaxed text-base">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}