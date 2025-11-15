"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Search, X } from "lucide-react"; // Optional icons
import { PublicationAPI } from "../services/api";

export default function StatsChart() {
  /* ---------- Summary (non-paginated) ---------- */
  const [summary, setSummary] = useState({
    total_publications: 0,
    approved: 0,
    rejected: 0,
    under_review: 0,
    draft: 0,
    total_likes: 0,
    total_dislikes: 0,
    total_payments: 0,
    total_subscriptions: 0,
  });

  /* ---------- Monthly data (paginated) ---------- */
  const [monthly, setMonthly] = useState([]);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlySize, setMonthlySize] = useState(10);
  const [monthlyCount, setMonthlyCount] = useState(0);

  /* ---------- Editors actions (paginated) ---------- */
  const [editors, setEditors] = useState([]);
  const [editorsPage, setEditorsPage] = useState(1);
  const [editorsSize, setEditorsSize] = useState(10);
  const [editorsCount, setEditorsCount] = useState(0);

  /* ---------- Payments (review_fee) (paginated) ---------- */
  const [payments, setPayments] = useState([]);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsSize, setPaymentsSize] = useState(10);
  const [paymentsCount, setPaymentsCount] = useState(0);

  /* ---------- Subscriptions (paginated) ---------- */
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsPage, setSubsPage] = useState(1);
  const [subsSize, setSubsSize] = useState(10);
  const [subsCount, setSubsCount] = useState(0);

  /* ---------- Users who paid BOTH fees (paginated) ---------- */
  const [usersWithBothFees, setUsersWithBothFees] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersSize, setUsersSize] = useState(10);
  const [usersCount, setUsersCount] = useState(0);

  /* ---------- ALL PAYMENTS + SEARCH ---------- */
  const [allPayments, setAllPayments] = useState([]);
  const [allPaymentsPage, setAllPaymentsPage] = useState(1);
  const [allPaymentsSize, setAllPaymentsSize] = useState(10);
  const [allPaymentsCount, setAllPaymentsCount] = useState(0);
  const [allPaymentsSearch, setAllPaymentsSearch] = useState("");

  /* ---------- Debounced search (300ms) ---------- */
  const debouncedSearch = useMemo(
    () =>
      setTimeout(() => {
        setAllPaymentsPage(1); // Reset page on search
      }, 300),
    [allPaymentsSearch]
  );

  useEffect(() => {
    return () => clearTimeout(debouncedSearch);
  }, [debouncedSearch]);

  /* ---------- Load everything ---------- */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await PublicationAPI.stats({
          monthly_page: monthlyPage,
          monthly_size: monthlySize,
          editors_page: editorsPage,
          editors_size: editorsSize,
          payments_page: paymentsPage,
          payments_size: paymentsSize,
          subs_page: subsPage,
          subs_size: subsSize,
          users_page: usersPage,
          users_size: usersSize,
          all_payments_page: allPaymentsPage,
          all_payments_size: allPaymentsSize,
          search: allPaymentsSearch || undefined,
        });

        console.log("API Response:", res.data);

        /* Summary */
        setSummary({
          total_publications: res.data.total_publications || 0,
          approved: res.data.approved || 0,
          rejected: res.data.rejected || 0,
          under_review: res.data.under_review || 0,
          draft: res.data.draft || 0,
          total_likes: res.data.total_likes || 0,
          total_dislikes: res.data.total_dislikes || 0,
          total_payments: res.data.total_payments ?? 0,
          total_subscriptions: res.data.total_subscriptions ?? 0,
        });

        /* Monthly Data */
        const monthlyData = res.data.monthly_data || {};
        setMonthly(monthlyData.results || []);
        setMonthlyCount(monthlyData.count || 0);

        /* Editors Actions */
        setEditors(res.data.editors_actions || []);
        setEditorsCount(res.data.editors_actions?.length || 0);

        /* Payments (review_fee) */
        setPayments(res.data.payment_details || []);
        setPaymentsCount(res.data.payment_details?.length || 0);

        /* Subscriptions */
        setSubscriptions(res.data.subscription_details || []);
        setSubsCount(res.data.subscription_details?.length || 0);

        /* Users with Both Fees */
        const usersData = res.data.users_with_both_fees || {};
        setUsersWithBothFees(usersData.results || []);
        setUsersCount(usersData.count || 0);

        /* ALL PAYMENTS */
        const allPay = res.data.all_payments || {};
        setAllPayments(allPay.results || []);
        setAllPaymentsCount(allPay.count || 0);

      } catch (err) {
        console.error("Failed to load stats", err);
      }
    };
    load();
  }, [
    monthlyPage,
    monthlySize,
    editorsPage,
    editorsSize,
    paymentsPage,
    paymentsSize,
    subsPage,
    subsSize,
    usersPage,
    usersSize,
    allPaymentsPage,
    allPaymentsSize,
    allPaymentsSearch, // ← Trigger on search
  ]);

  /* ---------- Pie chart data ---------- */
  const pieData = [
    { name: "Approved", value: summary.approved },
    { name: "Rejected", value: summary.rejected },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  /* ---------- Re-usable pagination UI ---------- */
  const PaginationControls = ({ page, setPage, size, setSize, total, label }) => {
    const totalPages = Math.ceil(total / size) || 1;

    return (
      <div className="flex items-center gap-2 mt-2 text-sm">
        <span>
          {label} – Page {page} of {totalPages} ({total} items)
        </span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Prev
        </button>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
        <select
          className="ml-2 border rounded px-1"
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {[5, 10, 20, 50].map((v) => (
            <option key={v} value={v}>
              {v}/page
            </option>
          ))}
        </select>
      </div>
    );
  };

  /* ---------- Format month for chart ---------- */
  const formattedMonthly = monthly.map((item) => ({
    ...item,
    month: item.month
      ? new Date(item.month + "-01").toLocaleString("default", {
          month: "short",
          year: "numeric",
        })
      : "N/A",
  }));

  /* ---------- Render ---------- */
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Publication Statistics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded text-center flex flex-col">
          <strong>Total Publications:</strong> {summary.total_publications}
        </div>
        <div className="bg-green-50 p-3 rounded text-center flex flex-col">
          <strong>Approved:</strong> {summary.approved}
        </div>
        <div className="bg-red-50 p-3 rounded text-center flex flex-col">
          <strong>Rejected:</strong> {summary.rejected}
        </div>
        <div className="bg-yellow-50 p-3 rounded text-center flex flex-col">
          <strong>Under Review:</strong> {summary.under_review}
        </div>
        <div className="bg-purple-50 p-3 rounded text-center flex flex-col">
          <strong>Draft:</strong> {summary.draft}
        </div>
        <div className="bg-pink-50 p-3 rounded text-center flex flex-col">
          <strong>Likes:</strong> {summary.total_likes}
        </div>
        <div className="bg-orange-50 p-3 rounded text-center flex flex-col">
          <strong>Dislikes:</strong> {summary.total_dislikes}
        </div>
      </div>

      {/* Pie Chart + Glass Card */}
      <div className="flex flex-col xl:flex-row justify-center items-center gap-8 mb-10">
        {/* Pie Chart */}
        <div className="w-full md:w-80 h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Glass Card */}
        <div className="relative w-full max-w-sm h-56 perspective-1000">
          <div className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700 hover:rotate-y-180">
            {/* Front */}
            <div className="absolute inset-0 backface-hidden">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-6 rounded-2xl shadow-2xl h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-14 h-10 rounded-md shadow-md"></div>
                  <div className="text-xl font-bold">Journivo Card</div>
                </div>
                <div className="text-2xl tracking-widest font-mono">
                  {String(summary.total_payments).padStart(9, "0").replace(/\d{4}(?=.)/g, "$& ")}
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="opacity-80">Total Payments</div>
                    <div className="font-bold">₦{summary.total_payments.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="opacity-80">Review Fees</div>
                    <div className="font-bold">₦{summary.total_subscriptions.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Back */}
            <div className="absolute inset-0 rotate-y-180 backface-hidden">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-2xl h-full flex flex-col justify-center items-center">
                <div className="bg-gray-800 h-12 w-full mb-4 rounded"></div>
                <div className="text-right w-full">
                  <div className="opacity-80">Total Earned</div>
                  <div className="text-2xl font-bold">
                    ₦{(summary.total_payments + summary.total_subscriptions).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <h3 className="text-lg font-semibold mb-2">Monthly Uploads</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedMonthly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" name="Total" />
          <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
          <Bar dataKey="rejected" fill="#ff7300" name="Rejected" />
          <Bar dataKey="under_review" fill="#ffc658" name="Under Review" />
          <Bar dataKey="draft" fill="#a4de6c" name="Draft" />
        </BarChart>
      </ResponsiveContainer>
      <PaginationControls
        page={monthlyPage}
        setPage={setMonthlyPage}
        size={monthlySize}
        setSize={setMonthlySize}
        total={monthlyCount}
        label="Monthly Data"
      />

      {/* Editors Actions */}
      <h3 className="text-lg font-semibold mt-8 mb-2">Editor Actions</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Editor</th>
              <th className="border p-2">Approved</th>
              <th className="border p-2">Rejected</th>
            </tr>
          </thead>
          <tbody>
            {editors.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-2">{item.editor__full_name}</td>
                <td className="border p-2 text-center">{item.approved}</td>
                <td className="border p-2 text-center">{item.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={editorsPage}
        setPage={setEditorsPage}
        size={editorsSize}
        setSize={setEditorsSize}
        total={editorsCount}
        label="Editors"
      />

      {/* ALL PAYMENTS TABLE + SEARCH */}
      <h3 className="text-lg font-semibold mt-8 mb-2">All Payments (Success + Pending)</h3>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={allPaymentsSearch}
            onChange={(e) => setAllPaymentsSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {allPaymentsSearch && (
            <button
              onClick={() => setAllPaymentsSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-blue-300 text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="border border-blue-300 p-2">User</th>
              <th className="border border-blue-300 p-2">Type</th>
              <th className="border border-blue-300 p-2">Amount</th>
              <th className="border border-blue-300 p-2">Status</th>
              <th className="border border-blue-300 p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {allPayments.map((p) => (
              <tr
                key={p.id}
                className={
                  p.status === "success"
                    ? "bg-green-50"
                    : p.status === "pending"
                    ? "bg-yellow-50"
                    : "bg-red-50"
                }
              >
                <td className="border border-blue-300 p-2 font-medium">{p.user}</td>
                <td className="border border-blue-300 p-2">{p.type}</td>
                <td className="border border-blue-300 p-2 text-right font-medium">
                  ₦{p.amount.toLocaleString()}
                </td>
                <td className="border border-blue-300 p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.status === "success"
                        ? "bg-green-200 text-green-800"
                        : p.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {p.status_display}
                  </span>
                </td>
                <td className="border border-blue-300 p-2 text-xs">{p.created_at}</td>
              </tr>
            ))}
            {allPayments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  {allPaymentsSearch
                    ? `No payments found for "${allPaymentsSearch}"`
                    : "No payments recorded yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PaginationControls
        page={allPaymentsPage}
        setPage={setAllPaymentsPage}
        size={allPaymentsSize}
        setSize={setAllPaymentsSize}
        total={allPaymentsCount}
        label="All Payments"
      />

      {/* Payment Details (Review Fees) */}
      <h3 className="text-lg font-semibold mt-8 mb-2">Review Fee Payments</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-2">{item.user__full_name}</td>
                <td className="border p-2">₦{item.total_amount.toLocaleString()}</td>
                <td className="border p-2 text-center">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={paymentsPage}
        setPage={setPaymentsPage}
        size={paymentsSize}
        setSize={setPaymentsSize}
        total={paymentsCount}
        label="Payments"
      />

      {/* Subscription Details */}
      <h3 className="text-lg font-semibold mt-8 mb-2">Free Review Subscriptions</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">User</th>
              <th className="border p-2">Free Reviews Used</th>
              <th className="border p-2">Granted?</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-2">{item.user__full_name}</td>
                <td className="border p-2 text-center">{item.free_reviews_used}</td>
                <td className="border p-2 text-center">
                  {item.free_reviews_granted ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={subsPage}
        setPage={setSubsPage}
        size={subsSize}
        setSize={setSubsSize}
        total={subsCount}
        label="Subscriptions"
      />

      {/* Users Who Paid BOTH Fees */}
      <h3 className="text-lg font-semibold mt-8 mb-2">Users Who Paid Both Fees</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-green-300 text-sm">
          <thead className="bg-green-100">
            <tr>
              <th className="border border-green-300 p-2">User</th>
              <th className="border border-green-300 p-2">Publication Fee</th>
              <th className="border border-green-300 p-2">Review Fee</th>
              <th className="border border-green-300 p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {usersWithBothFees.map((u) => (
              <tr key={u.id} className="hover:bg-green-50">
                <td className="border border-green-300 p-2 font-medium">{u.full_name}</td>
                <td className="border border-green-300 p-2 text-right">
                  ₦{u.publication_fee.toLocaleString()}
                </td>
                <td className="border border-green-300 p-2 text-right">
                  ₦{u.review_fee.toLocaleString()}
                </td>
                <td className="border border-green-300 p-2 text-right font-bold">
                  ₦{u.total.toLocaleString()}
                </td>
              </tr>
            ))}
            {usersWithBothFees.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No users have paid both fees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={usersPage}
        setPage={setUsersPage}
        size={usersSize}
        setSize={setUsersSize}
        total={usersCount}
        label="Users with Both Fees"
      />
    </div>
  );
}