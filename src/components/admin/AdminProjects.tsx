import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { type Project } from "../../types";
import { Layers, Plus, X, Loader2, Edit } from "lucide-react";
import { motion } from "motion/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableProjectItem } from "./SortableProjectItem";

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("Web App");
  const [liveLink, setLiveLink] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [techStack, setTechStack] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "projects"), (querySnapshot) => {
      const projList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      // Sort by date created (descending) if createdAt exists
      projList.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
           return a.order - b.order;
        }
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setProjects(projList);
      setLoading(false);
    }, (error: any) => {
      setError(error.message || "Failed to fetch projects realtime limit.");
      console.error("Error fetching realtime projects:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setThumbnail("");
    setCategory("Web App");
    setLiveLink("");
    setGithubLink("");
    setTechStack("");
  };

  const handleEditClick = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setThumbnail(project.thumbnail || "");
    setCategory(project.category || "Web App");
    setLiveLink(project.liveLink || "");
    setGithubLink(project.githubLink || "");
    setTechStack(project.techStack ? project.techStack.join(", ") : "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddOrEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const projectData = {
        title,
        description,
        thumbnail,
        category,
        liveLink,
        githubLink,
        techStack: techStack.split(",").map((t) => t.trim()),
        updatedAt: new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        setSuccess("Project updated successfully!");
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: new Date(),
          order: projects.length,
        });
        setSuccess("Project added successfully!");
      }
      resetForm();
    } catch (error: any) {
      if (error.message && error.message.includes("Missing or insufficient permissions")) {
         setError("You don't have permission to perform this action. Your email must be registered as an admin.");
      } else {
         setError(error.message || "Failed to save project.");
      }
      console.error("Error saving project", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError("");
    setSuccess("");
    try {
      await deleteDoc(doc(db, "projects", id));
      setSuccess("Project deleted successfully!");
      setDeletingId(null);
    } catch (error: any) {
      setError(error.message || "Failed to delete project.");
      console.error("Error deleting project", error);
      setDeletingId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    setProjects((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update db order
      saveOrderToDb(newItems);
      
      return newItems;
    });
  };

  const saveOrderToDb = async (orderedItems: Project[]) => {
    try {
      const batch = writeBatch(db);
      orderedItems.forEach((item, index) => {
        const docRef = doc(db, "projects", item.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    } catch (err: any) {
      console.error("Error saving new order: ", err);
      setError("Failed to save new custom order to database.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
          <Layers className="text-blue-500" /> Manage Projects
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-4 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-200 text-sm p-4 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add/Edit Project Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddOrEditProject} className="glass-card glass-card-glow p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-medium mb-4 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                {editingId ? <Edit className="text-yellow-400" /> : <Plus className="text-green-400" />} 
                {editingId ? "Edit Project" : "New Project"}
              </span>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              )}
            </h3>
            
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors placeholder:text-gray-500 input-glow"
              required
            />
            
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors h-24 resize-none placeholder:text-gray-500 input-glow"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Check file size (< 800KB to fit in Firestore 1MB doc limit)
                  if (file.size > 800 * 1024) {
                    alert("Image too large, please select an image under 800KB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setThumbnail(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20 text-gray-500"
            />
            
            {thumbnail && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-10 w-10 rounded bg-cover bg-center border border-white/10" style={{ backgroundImage: `url(${thumbnail})` }} />
                <span className="text-sm text-gray-400">Image selected/provided.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors text-white appearance-none input-glow"
              >
                <option value="Web App" className="bg-gray-900">Web App</option>
                <option value="Website" className="bg-gray-900">Website</option>
                <option value="Mobile App" className="bg-gray-900">Mobile App</option>
                <option value="AI Tool" className="bg-gray-900">AI Tool</option>
                <option value="Design" className="bg-gray-900">Design</option>
              </select>
              
              <input
                type="text"
                placeholder="Tech Stack (comma separated)"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors placeholder:text-gray-500 input-glow"
              />
            </div>

            <input
              type="url"
              placeholder="Live Link"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors placeholder:text-gray-500 input-glow"
            />

            <input
              type="url"
              placeholder="GitHub Link"
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors placeholder:text-gray-500 input-glow"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-medium py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed btn-glow ${
                editingId ? "bg-yellow-600 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {isSubmitting ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Project" : "Add Project")}
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card glass-card-glow p-12 text-center rounded-2xl flex flex-col items-center gap-4 text-gray-500">
              <Layers className="w-12 h-12 opacity-50" />
              <p>No projects found. Add one to get started.</p>
            </div>
          ) : (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={projects.map(p => p.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <SortableProjectItem 
                      key={project.id}
                      project={project}
                      editingId={editingId}
                      deletingId={deletingId}
                      isDeleting={isDeleting}
                      handleEditClick={handleEditClick}
                      setDeletingId={setDeletingId}
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}

