"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, User, Package, Calendar, Loader2, Edit2, Check, X } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [customer, setCustomer] = useState<{ id: string; full_name: string; email: string; phone?: string } | null>(null);
  const [orders, setOrders] = useState<Array<{
    id: string;
    order_id: string;
    created_at: string;
    total: number;
    order_items: Array<{
      name: string;
      size: string;
      color: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
  }>>([]);
  const [loading, setLoading] = useState(true);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.replace("/login");
          return;
        }

        if (user) {
          setUser(user);
          // Fetch customer record linked to auth user
          const { data: customerData } = await supabase
            .from("customers")
            .select("*")
            .eq("auth_id", user.id)
            .maybeSingle();
          
          if (customerData) {
            setCustomer(customerData);
            setEditName(customerData.full_name);
            const { data: ordersData } = await supabase
              .from("orders")
              .select("*")
              .eq("customer_id", customerData.id)
              .order("created_at", { ascending: false });
            if (ordersData) setOrders(ordersData);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSaveName = async () => {
    if (!editName.trim() || !customer) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from("customers")
        .update({ full_name: editName })
        .eq("id", customer.id);
        
      if (!error) {
        setCustomer({ ...customer, full_name: editName });
        // Also update auth user metadata
        await supabase.auth.updateUser({
          data: { full_name: editName }
        });
      }
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif text-zinc-900 tracking-wide">My Account</h1>
            <p className="mt-1 text-sm text-zinc-500 uppercase tracking-widest">
              Manage your profile and orders
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 mb-4">
                <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center rounded-full">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900">
                    Profile Details
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-sm border-b border-black focus:outline-none bg-transparent py-1 text-zinc-900"
                        autoFocus
                      />
                      <button onClick={handleSaveName} disabled={isSaving} className="text-emerald-600">
                        {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setIsEditing(false)} disabled={isSaving} className="text-zinc-400">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <p className="text-sm text-zinc-900 font-medium">
                        {customer?.full_name || user?.user_metadata?.full_name || "Guest"}
                      </p>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-black transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-1">
                    Email Address
                  </label>
                  <p className="text-sm text-zinc-900">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="md:col-span-2">
            <div className="bg-white border border-zinc-200 p-6 shadow-sm min-h-[400px]">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 mb-6">
                <Package className="w-5 h-5 text-zinc-400" />
                <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-900">
                  Order History ({orders.length})
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <Package className="w-12 h-12 text-zinc-200 mb-4" />
                  <p className="text-sm font-medium text-zinc-900">No orders yet</p>
                  <p className="text-xs text-zinc-500 mt-1 mb-6">Discover our latest collection.</p>
                  <button
                    onClick={() => router.push("/shop")}
                    className="bg-black text-white py-3 px-8 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-zinc-200 p-4">
                      <div className="flex flex-wrap gap-4 justify-between items-start border-b border-zinc-100 pb-4 mb-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">
                            Order ID
                          </p>
                          <p className="text-xs font-mono font-semibold text-zinc-900">
                            {order.order_id}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Date
                          </p>
                          <p className="text-xs font-medium text-zinc-900">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-bold mb-1">
                            Total
                          </p>
                          <p className="text-sm font-semibold text-zinc-900">
                            {formatINR(Number(order.total))}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.order_items?.map((item, idx: number) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-zinc-100 flex-shrink-0 relative">
                              {item.image && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-serif text-zinc-900 line-clamp-1">{item.name}</p>
                              <p className="text-[9px] uppercase tracking-wider text-zinc-500">
                                {item.size} / {item.color} · Qty {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
