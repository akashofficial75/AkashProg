import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Save, Loader2 } from "lucide-react";

export function AdminContact() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    email: "akashabdullahalmahmud@gmail.com",
    whatsapp: "01327240031",
    location: "Dhaka, Bangladesh"
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const docRef = doc(db, "settings", "contact_info");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data().value;
          if (data) {
            setFormData(JSON.parse(data));
          }
        }
      } catch (err: any) {
        console.error("Error fetching contact info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await setDoc(doc(db, "settings", "contact_info"), {
        value: JSON.stringify(formData)
      });
      setSuccess("Contact information updated successfully!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update contact information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {error && <div className="bg-red-500/20 text-red-200 text-sm p-4 rounded-lg">{error}</div>}
      {success && <div className="bg-green-500/20 text-green-200 text-sm p-4 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="glass-card glass-card-glow p-6 rounded-2xl space-y-6">
        <h3 className="text-xl font-medium mb-6 text-white">Contact Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white transition-colors input-glow"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">WhatsApp Number</label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white transition-colors input-glow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white transition-colors input-glow"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 btn-glow"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
