import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Gallery({ imageIds }: { imageIds: string[] }) {
  const images = imageIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  return (
    <section id="gallery" className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-headline text-center mb-8">A Glimpse of Our World</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => image && (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
