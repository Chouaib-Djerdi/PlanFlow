import { CardProps } from "@/types";

export default function ProjectCard({ title, imgURL }: CardProps) {
  return (
    <div className="max-w-sm rounded shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out h-full">
      <div className="w-full h-48 overflow-hidden">
        <img
          src={
            imgURL ||
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
          }
          alt={title}
          className="w-full h-full object-cover rounded-t"
        />
      </div>
      <div className="px-6 py-4">
        <h2 className="font-bold text-xl mb-2 text-gray-800">{title}</h2>
      </div>
    </div>
  );
}
