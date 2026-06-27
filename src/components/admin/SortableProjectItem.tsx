import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'motion/react';
import { Link as LinkIcon, Github, Edit, Trash2, Loader2, GripVertical } from 'lucide-react';
import { type Project } from '../../types';

interface Props {
  project: Project;
  editingId: string | null;
  deletingId: string | null;
  isDeleting: boolean;
  handleEditClick: (project: Project) => void;
  setDeletingId: (id: string | null) => void;
  handleDelete: (id: string) => void;
}

export function SortableProjectItem({
  project, editingId, deletingId, isDeleting, handleEditClick, setDeletingId, handleDelete
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

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
      className={`glass-card glass-card-glow p-4 rounded-xl border group flex flex-col h-full transition-colors ${
        editingId === project.id ? "border-yellow-500/50 bg-white/10" : "border-white/10"
      } ${isDragging ? "opacity-50 ring-2 ring-blue-500" : ""}`}
    >
      <div className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing backdrop-blur-md bg-black/20 rounded-md z-10" {...attributes} {...listeners}>
        <GripVertical className="w-5 h-5" />
      </div>

      {project.thumbnail && (
        <div className="h-32 w-full rounded-lg bg-white/5 bg-cover bg-center mb-4" style={{ backgroundImage: `url(${project.thumbnail})` }} />
      )}
      <div className="flex-1 mt-2">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-lg pr-8">{project.title}</h4>
          <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
            {project.category}
          </span>
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack?.map((t, idx) => (
            <span key={idx} className="text-xs text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
              {t}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
        <div className="flex gap-3">
          {project.liveLink && (
            <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <LinkIcon className="w-4 h-4" />
            </a>
          )}
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="flex gap-2 items-center relative z-20">
          <button type="button" onClick={(e) => { e.stopPropagation(); handleEditClick(project); }} className="text-gray-400 hover:text-yellow-400 transition-colors p-1">
            <Edit className="w-4 h-4" />
          </button>
          {deletingId === project.id ? (
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} 
                disabled={isDeleting}
                className="text-red-400 hover:text-red-300 text-xs font-medium px-2 py-1 bg-red-400/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isDeleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                {isDeleting ? "Deleting..." : "Confirm"}
              </button>
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} 
                disabled={isDeleting}
                className="text-gray-400 hover:text-white text-xs font-medium px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={(e) => { e.stopPropagation(); setDeletingId(project.id); }} className="text-gray-400 hover:text-red-400 transition-colors p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
