import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { Edit, Trash2, GripVertical } from 'lucide-react';
import { type Social } from '../../types';

interface Props {
  item: Social & { isDefault?: boolean };
  editingId: string | null;
  deletingId: string | null;
  handleEditClick: (item: any) => void;
  setDeletingId: (id: string | null) => void;
  handleDelete: (id: string) => void;
}

export function SortableSocialItem({
  item, editingId, deletingId, handleEditClick, setDeletingId, handleDelete
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id || item.platform });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`glass-card glass-card-glow p-4 rounded-xl border flex justify-between items-center gap-2 transition-colors ${
        editingId === item.id ? "border-yellow-500/50 bg-white/10" : "border-white/10"
      } ${isDragging ? "opacity-50 ring-2 ring-blue-500" : ""}`}
    >
      <div className="text-gray-500 hover:text-white cursor-grab active:cursor-grabbing p-1" {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="min-w-0 flex-1 ml-2">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-lg truncate">{item.platform}</h4>
          {item.isDefault && <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-400 shrink-0">Default</span>}
        </div>
        <span className="text-xs text-gray-400 block truncate">{item.url}</span>
      </div>
      
      <div className="flex gap-2 items-center shrink-0 relative z-20">
        <button type="button" onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="text-gray-400 hover:text-yellow-400 p-1">
          <Edit className="w-4 h-4" />
        </button>
        {!item.isDefault && (
          deletingId === item.id ? (
            <div className="flex gap-1 items-center">
              <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 bg-red-400/10 rounded font-medium">Yes</button>
              <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} className="text-gray-400 hover:text-white text-xs px-2 py-1 font-medium">No</button>
            </div>
          ) : (
            <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(item.id); }} className="text-gray-400 hover:text-red-400 p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}
