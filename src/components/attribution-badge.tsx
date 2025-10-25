
import Image from 'next/image';

export function AttributionBadge() {
  return (
    <a
      href="https://www.linkedin.com/in/sami-e-j/"
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-5 right-5 z-50 h-12
        flex items-center gap-3
        px-4
        rounded-full
        bg-card/60 backdrop-blur-sm
        text-sm text-card-foreground
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:bg-card/80 hover:shadow-xl
        md:bottom-6 md:right-6
        max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-[90%] max-md:justify-center
      "
    >
      <div className="relative h-7 w-7 flex-shrink-0">
        <Image
          src="https://res.cloudinary.com/dpyireagy/image/upload/v1721059441/user_pic.jpg"
          alt="Sami-e's profile picture"
          fill
          className="rounded-full object-cover"
          sizes="28px"
        />
      </div>
      <p className="tracking-wide">
        Template by <span className="font-semibold">Sami-e</span>
      </p>
    </a>
  );
}
