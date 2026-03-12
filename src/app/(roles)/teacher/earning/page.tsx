"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
    DollarSign, 
    CreditCard, 
    TrendingUp, 
    ArrowUpRight, 
    Plus, 
    MoreHorizontal,
    ChevronDown,
    X,
    Check
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { toast } from "sonner";

const earningChartData = [
    { month: "Aug 01", earning: 30000 },
    { month: "Aug 05", earning: 45000 },
    { month: "Aug 10", earning: 35000 },
    { month: "Aug 15", earning: 58000 },
    { month: "Aug 20", earning: 42000 },
    { month: "Aug 25", earning: 65000 },
    { month: "Aug 31", earning: 55000 },
];

const withdrawHistory = [
    { id: 1, date: "21 Sep, 2021 at 2:14 AM", method: "Mastercards", amount: "$7,656", status: "Pending" },
    { id: 2, date: "21 Sep, 2021 at 2:14 AM", method: "Visa", amount: "$7,656", status: "Pending" },
    { id: 3, date: "21 Sep, 2021 at 2:14 AM", method: "Visa", amount: "$7,656", status: "Completed" },
    { id: 4, date: "21 Sep, 2021 at 2:14 AM", method: "Mastercards", amount: "$7,656", status: "Completed" },
    { id: 5, date: "21 Sep, 2021 at 2:14 AM", method: "Visa", amount: "$7,656", status: "Canceled" },
    { id: 6, date: "21 Sep, 2021 at 2:14 AM", method: "Mastercards", amount: "$7,656", status: "Completed" },
    { id: 7, date: "21 Sep, 2021 at 2:14 AM", method: "Visa", amount: "$7,656", status: "Completed" },
];

export default function TeacherEarningPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("visa-4855");
    const [activeActionId, setActiveActionId] = useState<number | null>(null);

    const handleCancelWithdraw = (id: number) => {
        toast.success("Withdrawal cancelled successfully");
        setActiveActionId(null);
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 bg-[#F9FAFB] min-h-screen">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: "$13,804.00", icon: DollarSign, color: "bg-amber-50 text-amber-500" },
                    { label: "Current Balance", value: "$16,593.00", icon: CreditCard, color: "bg-blue-50 text-blue-500" },
                    { label: "Total Withdrawals", value: "$13,184.00", icon: TrendingUp, color: "bg-red-50 text-red-500" },
                    { label: "Today Revenue", value: "$162.00", icon: ArrowUpRight, color: "bg-emerald-50 text-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-none border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-[#0D1C35]">{stat.value}</p>
                            <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Statistic Chart */}
                <div className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-none shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#0D1C35]">Statistic</h2>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                            Revenue <ChevronDown size={14} />
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ChartContainer config={{ earning: { label: "Earning", color: "#22C55E" } }} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earningChartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fill: '#9CA3AF'}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fontSize: 10, fill: '#9CA3AF'}}
                                        tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Area 
                                        type="monotone" 
                                        dataKey="earning" 
                                        stroke="#22C55E" 
                                        strokeWidth={3} 
                                        fill="none" 
                                        dot={{ r: 4, fill: "#22C55E", strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="bg-white p-8 border border-gray-100 rounded-none shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-[#0D1C35]">Cards</h2>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                            Revenue <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Visa Card UI */}
                        <div className="relative aspect-[1.6/1] bg-[#0A47C2] p-6 rounded-xl overflow-hidden text-white flex flex-col justify-between shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
                            
                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl font-black italic tracking-tighter opacity-90">VISA</h3>
                                <MoreHorizontal size={20} className="opacity-60" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <p className="text-xl font-medium tracking-[3px]">4855 **** **** ****</p>
                                    <button className="opacity-60"><Plus size={14} /></button>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] uppercase opacity-60 font-bold">Expires</p>
                                        <p className="text-xs font-bold">04/24</p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[10px] uppercase opacity-60 font-bold">Card Name</p>
                                        <p className="text-xs font-bold">Vako Shvili</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                            <div className="w-2 h-2 rounded-full bg-gray-200" />
                        </div>

                        {/* Add New Card Slot */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full border-2 border-dashed border-gray-100 py-6 flex items-center justify-center gap-2 text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all font-bold text-sm"
                        >
                            <div className="w-6 h-6 rounded-full border-2 border-orange-400 text-orange-400 flex items-center justify-center">
                                <Plus size={14} />
                            </div>
                            Add new card
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Withdraw Your Money */}
                <div className="bg-white p-8 border border-gray-100 rounded-none shadow-sm space-y-8">
                    <h2 className="text-lg font-bold text-[#0D1C35]">Withdraw your money</h2>
                    
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Payment method:</p>
                        
                        {/* Card Options */}
                        <div className="space-y-3">
                            {[
                                { id: "visa-4855", type: "VISA", number: "4855 **** **** ****", expiry: "04/24", name: "Vako Shvili" },
                                { id: "master-2855", type: "MASTER", number: "2855 **** **** ****", expiry: "04/24", name: "Vako Shvili" },
                            ].map((card) => (
                                <div 
                                    key={card.id}
                                    onClick={() => setSelectedPayment(card.id)}
                                    className={`p-4 border  flex items-center justify-between cursor-pointer transition-all ${
                                        selectedPayment === card.id ? "border-emerald-400 bg-emerald-50/10" : "border-gray-100"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-black italic tracking-tighter ${
                                            card.type === "VISA" ? "text-blue-600" : "text-orange-500"
                                        }`}>{card.type}</span>
                                        <p className="text-xs font-bold text-[#0D1C35]">{card.number}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs font-medium text-gray-400">{card.expiry}</span>
                                        <span className="text-xs font-medium text-gray-400 hidden sm:block">{card.name}</span>
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                            selectedPayment === card.id ? "bg-emerald-500 text-white" : "border border-gray-200"
                                        }`}>
                                            {selectedPayment === card.id && <Check size={12} />}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* PayPal Option */}
                            <div className="flex items-start gap-4 p-2">
                                <div className="w-6 h-6 shrink-0 text-blue-800">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.067 8.478c.492.88.556 2.014.307 3.292-.925 4.882-5.75 4.882-5.75 4.882h-1.638c-.464 0-.853.308-.948.74l-.94 4.303-.027.114a.557.557 0 01-.543.439h-3.32a.574.574 0 01-.54-.694l.024-.11 1.956-8.913.023-.105a.556.556 0 01.543-.439h1.1c.54 0 1.053-.11 1.517-.306.463-.195.845-.487 1.137-.872.29-.385.49-.86.583-1.424.125-.66-.023-1.222-.44-1.688a2.536 2.536 0 00-1.633-.76c-.463-.039-1.053.033-1.745.215-.694.183-1.054.44-1.127.487l.024-.11 1.04-4.717a.574.574 0 01.54-.694h3.32c.54 0 1.053.11 1.517.306.463.195.845.487 1.137.872.29.385.49.86.583 1.424zM10.274 2.822a.556.556 0 00-.543.439L8.686 7.978l-4.113.114a.556.556 0 00-.543.439l-.94 4.303.027.114a.557.557 0 00.543.439h3.32a.574.574 0 00.54-.694l.024-.11 1.956-8.913.023-.105a.556.556 0 00.543-.439h1.1c.54 0 1.053-.11 1.517-.306.463-.195.845-.487 1.137-.872.29-.385.49-.86.583-1.424.125-.66-.023-1.222-.44-1.688a2.536 2.536 0 00-1.633-.76z"/></svg>
                                </div>
                                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                                    You will be redirected to the PayPal site after reviewing your order.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xl font-bold text-[#0D1C35]">$16,593.00</p>
                            <p className="text-xs text-gray-400 font-medium">Current Balance</p>
                        </div>
                        <button className="bg-orange-500 text-white px-8 py-4 rounded-none font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors">
                            Withdraw Money
                        </button>
                    </div>
                </div>

                {/* Withdraw History */}
                <div className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-none shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-[#0D1C35]">Withdraw History</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-[1.5px] border-b border-gray-50">
                                    <th className="pb-4 font-bold">Date</th>
                                    <th className="pb-4 font-bold">Method</th>
                                    <th className="pb-4 font-bold">Amount</th>
                                    <th className="pb-4 font-bold text-right pr-12">Status</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawHistory.map((row) => (
                                    <tr key={row.id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="py-5 text-xs font-bold text-[#0D1C35] font-sans">{row.date}</td>
                                        <td className="py-5 text-xs font-bold text-gray-400 font-sans">{row.method}</td>
                                        <td className="py-5 text-xs font-bold text-gray-400 font-sans">{row.amount}</td>
                                        <td className="py-5 text-right pr-12">
                                            <span className={`text-xs font-bold ${
                                                row.status === "Pending" ? "text-orange-400" : 
                                                row.status === "Completed" ? "text-emerald-500" : "text-red-400"
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right relative">
                                            <button 
                                                onClick={() => setActiveActionId(activeActionId === row.id ? null : row.id)}
                                                className="p-2 text-gray-200 group-hover:text-gray-400 transition-colors"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                            {activeActionId === row.id && (
                                                <div className="absolute top-12 right-0 bg-white shadow-xl border border-gray-100 py-3 px-6 z-10 whitespace-nowrap">
                                                    <button 
                                                        onClick={() => handleCancelWithdraw(row.id)}
                                                        className="text-[10px] font-bold text-gray-400 hover:text-[#0D1C35]"
                                                    >
                                                        Cancel Withdraw
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add New Card Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-none shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-[#0D1C35]">New Payment Card</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Name on card"
                                    className="w-full px-6 py-4 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Card Number</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600">
                                        <CreditCard size={20} />
                                    </div>
                                    <div className="absolute left-14 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gray-50" />
                                    <input 
                                        type="text" 
                                        placeholder="Label"
                                        className="w-full pl-20 pr-6 py-4 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">MM / YY</label>
                                    <input 
                                        type="text" 
                                        placeholder="MM / YY"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">CVC</label>
                                    <input 
                                        type="text" 
                                        placeholder="Security Code"
                                        className="w-full px-6 py-4 bg-white border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-10 py-4 border border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-10 py-4 bg-[#0A47C2] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
                                >
                                    Add
                                    <ArrowUpRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
