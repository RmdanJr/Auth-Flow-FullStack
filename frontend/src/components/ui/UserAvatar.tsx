interface UserAvatarProps {
  name: string;
}

export function UserAvatar({ name }: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl eg-gradient-blue text-2xl font-semibold text-white shadow-sm">
      {initial}
    </div>
  );
}
