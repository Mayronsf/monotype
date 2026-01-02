import { getTypeInfo } from '../data/pokemonTypes';

export default function TypeBadge({ type, size = 'md' }) {
  const typeInfo = getTypeInfo(type);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full text-white ${sizeClasses[size]} shadow-md`}
      style={{ backgroundColor: typeInfo.color }}
    >
      <span>{typeInfo.emoji}</span>
      <span>{typeInfo.name}</span>
    </span>
  );
}




