interface AuthorCardProps {
  name: string;
  role?: string;
  bio?: string;
}

export function AuthorCard({
  name,
  role,
  bio = "Our team of industry professionals share their expertise to help you make informed decisions about your construction and maintenance projects.",
}: AuthorCardProps) {
  return (
    <div className="bg-surface-muted rounded-2xl p-6 sm:p-8 border border-gray-100">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-primary rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-brand-primary uppercase tracking-wide mb-1">
            About the Author
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{name}</h3>
          {role && <p className="text-gray-600 font-medium mb-3">{role}</p>}
          <p className="text-gray-700 leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  );
}
