"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import Toast from "@/components/Toast";
import { useToast } from "@/hooks/useToast";

const invoiceTemplates = [
  {
    id: "INV-2024-001",
    client: "Tech Solutions Inc.",
    amount: 2450.00,
    status: "Paid",
    date: "2024-01-15",
    description: (name) => `Monthly subscription services for ${name}'s account`,
  },
  {
    id: "INV-2024-002",
    client: "Digital Marketing Pro",
    amount: 1800.50,
    status: "Pending",
    date: "2024-01-20",
    description: (name) => `API usage and premium features for ${name}`,
  },
  {
    id: "INV-2024-003",
    client: "Cloud Services Ltd",
    amount: 3200.00,
    status: "Paid",
    date: "2024-01-10",
    description: (name) => `Quarterly service package for ${name}`,
  },
  {
    id: "INV-2024-004",
    client: "Startup Ventures",
    amount: 950.25,
    status: "Overdue",
    date: "2023-12-28",
    description: (name) => `Custom development services for ${name}`,
  },
];

const paymentTips = [
  {
    title: "Payment Reminder",
    content: (name) => `Hey ${name}! Don't forget to follow up on pending invoices. Timely payments help maintain healthy business relationships.`,
  },
  {
    title: "Invoice Best Practices",
    content: (name) => `${name}, make sure your invoices include clear descriptions, payment terms, and due dates. This reduces payment delays.`,
  },
  {
    title: "Record Keeping",
    content: (name) => `${name}, keeping detailed records of all invoices helps with accounting and tax preparation. Stay organized!`,
  },
];

export default function InvoicesPage() {
  const { user } = useAuth();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { toast, showToast, hideToast } = useToast();
  const [invoices, setInvoices] = useState([]);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    if (user) {
      const userName = user.name || user.email.split("@")[0];
      
      // Shuffle invoices
      const shuffled = [...invoiceTemplates].sort(() => 0.5 - Math.random());
      setInvoices(shuffled.map(invoice => ({
        ...invoice,
        description: invoice.description(userName),
      })));

      // Shuffle tips
      const shuffledTips = [...paymentTips].sort(() => 0.5 - Math.random());
      setTips(shuffledTips.map(tip => ({
        ...tip,
        content: tip.content(userName),
      })));
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const userName = user.name || user.email.split("@")[0];
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "Pending").reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <Toast toast={toast} onClose={hideToast} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <div className="px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
                <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
                  Invoices
                </h1>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="mb-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white">
              <h2 className="mb-2 text-2xl font-bold">
                💰 {userName}'s Invoice Management
              </h2>
              <p className="text-green-100">
                Track and manage all your invoices, payments, and financial records.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Invoices
                </div>
                <div className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                  {invoices.length}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Total Amount
                </div>
                <div className="mt-2 text-3xl font-bold text-black dark:text-zinc-50">
                  ${totalAmount.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Paid
                </div>
                <div className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  ${paidAmount.toLocaleString()}
                </div>
              </div>
              <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Pending
                </div>
                <div className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  ${pendingAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800"
                >
                  <h3 className="mb-2 text-lg font-semibold text-black dark:text-zinc-50">
                    {tip.title}
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Invoices List */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-bold text-black dark:text-zinc-50">
                Recent Invoices
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-zinc-800">
                <table className="w-full">
                  <thead className="bg-zinc-50 dark:bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Invoice ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                    {invoices.map((invoice, index) => (
                      <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-black dark:text-zinc-50">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                          {invoice.client}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-black dark:text-zinc-50">
                          ${invoice.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : invoice.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                          {new Date(invoice.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

