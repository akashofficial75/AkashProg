import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Plus, Trash2, Edit, X, Loader2 } from "lucide-react";
import { type Skill } from "../../types";
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
import { SortableSkillItem } from "./SortableSkillItem";

export function AdminSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Frontend Engineering");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "skills"), (querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Skill[];
      
      list.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0; // fallback
      });
      
      setSkills(list);
      setLoading(false);
    }, (error: any) => {
      setError(error.message || "Failed to fetch skills realtime.");
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("Frontend Engineering");
    setProgress(0);
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setProgress(item.progress || 0);
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const data: any = {
        name,
        category,
        progress: Number(progress)
      };

      if (editingId) {
        await updateDoc(doc(db, "skills", editingId), data);
        setSuccess("Skill updated successfully!");
      } else {
        data.order = skills.length;
        await addDoc(collection(db, "skills"), data);
        setSuccess("Skill added successfully!");
      }
      resetForm();
    } catch (error: any) {
      setError(error.message || "Failed to save skill.");
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
      await deleteDoc(doc(db, "skills", id));
      setSuccess("Skill deleted successfully!");
      setDeletingId(null);
    } catch (error: any) {
      setError(error.message || "Failed to delete.");
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

    setSkills((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      saveOrderToDb(newItems);
      
      return newItems;
    });
  };

  const saveOrderToDb = async (orderedItems: Skill[]) => {
    try {
      const batch = writeBatch(db);
      orderedItems.forEach((item, index) => {
        const docRef = doc(db, "skills", item.id);
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
      {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-4 rounded-lg">{error}</div>}
      {success && <div className="bg-green-500/20 border border-green-500/50 text-green-200 text-sm p-4 rounded-lg">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddOrEdit} className="glass-card glass-card-glow p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-medium mb-4 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                {editingId ? <Edit className="text-yellow-400" /> : <Plus className="text-green-400" />} 
                {editingId ? "Edit Skill" : "New Skill"}
              </span>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              )}
            </h3>
            <input type="text" placeholder="Skill Name (e.g. React)" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors input-glow" required />
            <input type="text" placeholder="Category (e.g. Frontend Engineering)" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors input-glow" required />
            <input type="number" placeholder="Progress % (Optional)" value={progress} onChange={(e) => setProgress(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none transition-colors input-glow" />
            
            <button type="submit" disabled={isSubmitting} className={`w-full text-white font-medium py-2 rounded-lg transition-colors btn-glow ${editingId ? "bg-yellow-600 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-500"}`}>
              {isSubmitting ? "Saving..." : editingId ? "Update Skill" : "Add Skill"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div> : 
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={skills.map(s => s.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.map((item) => (
                    <SortableSkillItem
                      key={item.id}
                      item={item}
                      editingId={editingId}
                      deletingId={deletingId}
                      handleEditClick={handleEditClick}
                      setDeletingId={setDeletingId}
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          }
        </div>
      </div>
    </div>
  );
}
