"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Trash2, BookMarked, CheckCircle2, Clock, X, Edit3 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CatalogItem {
    _id: string;
    type: "subject" | "level" | "curriculum";
    name: string;
    status: string;
    createdAt: string;
}

const types = ["subject", "level", "curriculum"] as const;

export default function AcademicSetupPage() {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<typeof types[number] | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        type: "subject" as typeof types[number],
        name: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await api.get("/catalogs/admin");
            if (response.data.success) {
                setItems(response.data.data.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to fetch catalog items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedItemId(null);
        setFormData({ type: "subject", name: "" });
        setIsModalOpen(true);
    };

    const openEditModal = (item: CatalogItem) => {
        setIsEditMode(true);
        setSelectedItemId(item._id);
        setFormData({ type: item.type, name: item.name });
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Please enter a name");
            return;
        }

        try {
            setIsSubmitting(true);
            if (isEditMode && selectedItemId) {
                const response = await api.patch(`/catalogs/update/${selectedItemId}`, formData);
                if (response.data.success) {
                    toast.success("Catalog item updated successfully");
                    setIsModalOpen(false);
                    fetchItems();
                }
            } else {
                const response = await api.post("/catalogs/create", formData);
                if (response.data.success) {
                    toast.success("Catalog item created successfully");
                    setIsModalOpen(false);
                    setFormData({ type: "subject", name: "" });
                    fetchItems();
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${isEditMode ? "update" : "create"} catalog item`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            const response = await api.delete(`/catalogs/delete/${id}`);
            if (response.data.success) {
                toast.success("Catalog item deleted successfully");
                fetchItems();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete catalog item");
        }
    };

    const filteredItems = items.filter((item) => {
        const matchesTab = activeTab === "all" || item.type === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="p-4 md:p-8 space-y-6 bg-[#F9FAFB] min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-none shadow-sm border border-gray-50">
                <div>
                    <h1 className="text-2xl font-bold text-[#0D1C35] font-sans uppercase tracking-tight">Academic Setup</h1>
                    <p className="text-sm text-gray-500 font-sans mt-1">Manage subjects, levels, and curriculum types.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-[#0A47C2] hover:bg-[#083691] text-white px-6 h-12 rounded-none flex items-center gap-2 font-bold font-sans transition-all active:scale-95 shadow-lg shadow-blue-100"
                >
                    <Plus size={20} />
                    Add New Item
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-none shadow-sm border border-gray-50 flex flex-col md:flex-row gap-4 items-center">
                <div className="flex bg-gray-50 p-1.5 rounded-none overflow-hidden shrink-0 border border-gray-100 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={cn(
                            "px-6 py-2.5 rounded-none text-sm font-bold transition-all font-sans whitespace-nowrap",
                            activeTab === "all" ? "bg-white text-[#0A47C2] shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        All Items
                    </button>
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={cn(
                                "px-6 py-2.5 rounded-none text-sm font-bold transition-all font-sans capitalize whitespace-nowrap",
                                activeTab === t ? "bg-white text-[#0A47C2] shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="relative w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        placeholder="Search items..."
                        className="w-full pl-12 h-14 rounded-none border border-gray-50 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 font-sans transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-none shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans border-collapse">
                        <thead className="bg-gray-50/50">
                            <tr className="text-[11px] uppercase tracking-widest text-gray-400 font-black border-b border-gray-50">
                                <th className="px-8 py-5">Name</th>
                                <th className="px-8 py-5 text-center">Type</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-center">Created At</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-20 bg-gray-50/20" />
                                    </tr>
                                ))
                            ) : filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id} className="group hover:bg-gray-50/30 transition-all border-l-4 border-transparent hover:border-[#0A47C2]">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-none bg-blue-50 flex items-center justify-center text-[#0A47C2]">
                                                    <BookMarked size={20} />
                                                </div>
                                                <span className="font-bold text-[#0D1C35]">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-wider border",
                                                    item.type === "subject" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                        item.type === "level" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-purple-50 text-purple-600 border-purple-100"
                                                )}>
                                                    {item.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-none border border-green-100 text-[10px] font-bold">
                                                    <CheckCircle2 size={12} />
                                                    Active
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                                <Clock size={14} />
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-none transition-all"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-none transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-sans">
                                        No items found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creation & Update */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-none shadow-2xl w-full max-w-[425px] overflow-hidden animate-in zoom-in fade-in duration-300">
                        <div className="p-8 space-y-6">
                            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-[#0D1C35] font-sans uppercase tracking-tight">
                                        {isEditMode ? "Update Item" : "Create Item"}
                                    </h2>
                                    <p className="text-sm text-gray-500 font-sans">
                                        {isEditMode ? "Update the entry in the academic system." : "Add a new entry to the academic system."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-none transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0D1C35] font-sans ml-1 uppercase tracking-wider">Item Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                            className="w-full h-14 pl-6 pr-12 rounded-none border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 font-sans appearance-none capitalize transition-all"
                                        >
                                            {types.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <Plus size={16} className="rotate-45" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0D1C35] font-sans ml-1 uppercase tracking-wider">Name</label>
                                    <input
                                        placeholder="e.g. Mathematics, O Level..."
                                        className="w-full h-14 px-6 rounded-none border border-gray-100 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 font-sans transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full h-14 bg-[#0A47C2] hover:bg-[#083691] disabled:bg-gray-300 text-white rounded-none font-bold font-sans text-lg shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {isEditMode ? "Updating..." : "Creating..."}
                                        </>
                                    ) : (
                                        isEditMode ? "Update Item" : "Create Item"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
