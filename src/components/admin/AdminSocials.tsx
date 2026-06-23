import { useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Plus, Trash2, Edit, X, Loader2 } from "lucide-react";
import { type Social } from "../../types";
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
import { SortableSocialItem } from "./SortableSocialItem";

export function AdminSocials() {
  const [socials, setSocials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultSocialLinks = [
    { platform: "GitHub", url: "https://github.com/akashofficial75" },
    { platform: "Instagram", url: "https://www.instagram.com/akash_official75/?hl=en" },
    { platform: "Twitter", url: "https://x.com/Akash0fficial75" },
    { platform: "YouTube", url: "https://www.youtube.com/@tripexvibe" },
    { platform: "WhatsApp", url: "https://wa.me/8801327240031" }
  ];

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, "socials"), (querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Social[];

      list.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return 0;
      });

      setSocials(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setPlatform("");
    setUrl("");
  };

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setPlatform(item.platform);
    setUrl(item.url);
  };

  const handleAddOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const data: any = {
        platform,
        url
      };

      if (editingId) {
        await updateDoc(doc(db, "socials", editingId), data);
        setSuccess("Social link updated successfully!");
      } else {
        data.order = socials.length;
        await addDoc(collection(db, "socials"), data);
        setSuccess("Social link added successfully!");
      }
      resetForm();
    } catch (error: any) {
      setError(error.message || "Failed to save social link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setError("");
    setSuccess("");
    try {
      await deleteDoc(doc(db, "socials", id));
      setSuccess("Social link deleted successfully!");
      setDeletingId(null);
    } catch (error: any) {
      setError(error.message || "Failed to delete.");
      setDeletingId(null);
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

    const oldIndex = mergedSocials.findIndex((item) => (item.id || item.platform) === active.id);
    const newIndex = mergedSocials.findIndex((item) => (item.id || item.platform) === over.id);
    
    const newItems = arrayMove(mergedSocials, oldIndex, newIndex);
    
    // Save all items to DB respecting their new custom order.
    // If an item is a default social placeholder, create it as an actual db entity.
    saveOrderToDb(newItems);
  };

  const saveOrderToDb = async (orderedItems: any[]) => {
    try {
      const batch = writeBatch(db);
      orderedItems.forEach((item, index) => {
        if (item.id) {
            const docRef = doc(db, "socials", item.id);
            batch.update(docRef, { order: index });
        } else if (item.isDefault) {
            const newDocRef = doc(collection(db, "socials"));
            batch.set(newDocRef, {
                platform: item.platform,
                url: item.url,
                order: index
            });
        }
      });
      await batch.commit();
    } catch (err: any) {
      console.error("Error saving new order: ", err);
      setError("Failed to save new custom order to database.");
    }
  };

  const mergedSocials = [
    ...socials,
    ...defaultSocialLinks.filter(d => !socials.some(s => s.platform.toLowerCase() === d.platform.toLowerCase())).map(d => ({ ...d, isDefault: true }))
  ];

  return (
    <div className="space-y-8">
      {error && <div className="bg-red-500/20 text-red-200 text-sm p-4 rounded-lg">{error}</div>}
      {success && <div className="bg-green-500/20 text-green-200 text-sm p-4 rounded-lg">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleAddOrEdit} className="glass-card glass-card-glow p-6 rounded-2xl space-y-4">
            <h3 className="text-xl font-medium mb-4 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                {editingId ? <Edit className="text-yellow-400" /> : <Plus className="text-green-400" />} 
                {editingId ? "Edit Social" : "New Social"}
              </span>
              {editingId && (
                <button type="button" onClick={resetForm} className="text-gray-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              )}
            </h3>
            <input type="text" placeholder="Platform (e.g. GitHub)" value={platform} onChange={(e) => setPlatform(e.target.value)} disabled={!!editingId && mergedSocials.find(s => s.id === editingId)?.isDefault} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none text-white disabled:opacity-50 transition-colors input-glow" required />
            <input type="url" placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none text-white transition-colors input-glow" required />
            
            <button type="submit" disabled={isSubmitting} className={`w-full text-white font-medium py-2 rounded-lg transition-colors btn-glow ${editingId ? "bg-yellow-600 hover:bg-yellow-500" : "bg-blue-600 hover:bg-blue-500"}`}>
              {isSubmitting ? "Saving..." : editingId ? "Update" : "Add"}
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
                items={mergedSocials.map(s => s.id || s.platform)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mergedSocials.map((item, i) => (
                    <SortableSocialItem
                      key={item.id || item.platform}
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
