import Image from "next/image";

interface FeatureCardProps {
  imageSrc: string;
  imageAlt: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

export function FeatureCard({
  imageSrc,
  imageAlt,
  icon,
  title,
  description,
  href,
  onClick,
}: FeatureCardProps) {
  const content = (
    <>
      <div className="h-[170px] bg-gray-100 flex items-end justify-center">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={200}
          height={170}
          className="object-contain object-bottom"
        />
      </div>
      <div className="p-4 flex items-start gap-3 bg-white">
        <span className="mt-0.5 shrink-0 rotate-[-15deg]">{icon}</span>
        <div>
          <h3 className="text-[15px] font-medium leading-tight">{title}</h3>
          <p className="text-[13px] text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </>
  );

  const className =
    "border-[1.5px] border-gray-200 overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.02]";

  if (href) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={className}
    >
      {content}
    </div>
  );
}
