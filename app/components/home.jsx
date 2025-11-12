"use client";

import { useState, useEffect } from "react";
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
import { PublicationAPI } from "../services/api";
import Image from "next/image";

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

  /* ---------- Monthly data ---------- */
  const [monthly, setMonthly] = useState([]);
  const [monthlyPage, setMonthlyPage] = useState(1);
  const [monthlySize, setMonthlySize] = useState(10);
  const [monthlyCount, setMonthlyCount] = useState(0);

  /* ---------- Editors actions ---------- */
  const [editors, setEditors] = useState([]);
  const [editorsPage, setEditorsPage] = useState(1);
  const [editorsSize, setEditorsSize] = useState(10);
  const [editorsCount, setEditorsCount] = useState(0);

  /* ---------- Payments ---------- */
  const [payments, setPayments] = useState([]);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsSize, setPaymentsSize] = useState(10);
  const [paymentsCount, setPaymentsCount] = useState(0);

  /* ---------- Subscriptions ---------- */
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsPage, setSubsPage] = useState(1);
  const [subsSize, setSubsSize] = useState(10);
  const [subsCount, setSubsCount] = useState(0);

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
        });

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

        /* Monthly */
        const m = res.data.monthly_data;
        setMonthly(m.results || []);
        setMonthlyCount(m.count || 0);

        /* Editors */
        const e = res.data.editors_actions;
        setEditors(e.results || []);
        setEditorsCount(e.count || 0);

        /* Payments */
        const p = res.data.payment_details;
        setPayments(p.results || []);
        setPaymentsCount(p.count || 0);

        /* Subscriptions */
        const s = res.data.subscription_details;
        setSubscriptions(s.results || []);
        setSubsCount(s.count || 0);
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
  ]);

  /* ---------- Pie chart data ---------- */
  const pieData = [
    { name: "Approved", value: summary.approved },
    { name: "Rejected", value: summary.rejected },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  /* ---------- Re-usable pagination UI ---------- */
  const PaginationControls = ({
    page,
    setPage,
    size,
    setSize,
    total,
    label,
  }) => {
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

  /* ---------- Format month for the chart ---------- */
  const formattedMonthly = monthly.map((item) => ({
    ...item,
    month: new Date(item.month).toLocaleString("default", {
      month: "short",
      year: "numeric",
    }),
  }));

  /* ---------- Render ---------- */
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Publication Statistics</h2>

      {/* Summary cards */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="grid grid-cols-2 md:grid-cols-6 xl:grid-cols-7 gap-8">
          <p className="analytics">
            <strong>Total Publications:</strong> {summary.total_publications}
          </p>
          <p className="analytics">
            <strong>Approved:</strong> {summary.approved}
          </p>
          <p className="analytics">
            <strong>Rejected:</strong> {summary.rejected}
          </p>
          <p className="analytics">
            <strong>Under Review:</strong> {summary.under_review}
          </p>
          <p className="analytics">
            <strong>Total Likes:</strong> {summary.total_likes}
          </p>
          <p className="analytics">
            <strong>Total Dislikes:</strong> {summary.total_dislikes}
          </p>
          <p className="analytics">
            <strong>Draft:</strong> {summary.draft}
          </p>
        </div>


        {/* Center: Pie chart for Approved/Rejected */}
        <div className="w-full md:w-1/3 h-[50vh] flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius="80%"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Glass Credit Card */}
        <div className="relative w-full max-w-sm h-52 perspective-1000">
          <div className="relative w-full h-full transform-style-preserve-3d transition-transform duration-700 hover:rotate-y-180">
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden">
              <div className="bg-gray-600 w-full h-full rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl">
                {/* Chip + Contactless */}
                <div className="flex justify-between items-start">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-12 h-9 rounded-md shadow-md"></div>
                  <div className="text-2xl">Journivo Card</div>
                </div>

                {/* Card Number */}
                <div className="text-2xl tracking-widest font-mono">
                  {String(summary.total_payments).padStart(9, "0").replace(/\d{4}(?=.)/g, "$& ")}
                </div>

                {/* Name + Expiry */}
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="opacity-80">Total Payments</div>
                    <div className="font-semibold">₦{summary.total_payments.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="opacity-80">Total Subscriptions</div>
                    <div className="font-semibold">₦{summary.total_subscriptions.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back of Card (rotated 180°) */}
            <div className="absolute inset-0 rotate-y-180 backface-hidden">
              <div className="glass-card w-full h-full rounded-2xl p-6 flex flex-col justify-center text-white">
                <div className="bg-gray-800 h-12 mb-4 rounded"></div>
                <div className="text-right text-sm">
                  <div className="opacity-80">Total Subscriptions</div>
                  <div className="text-xl font-bold">₦{summary.total_subscriptions.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly chart */}
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
        </BarChart>
      </ResponsiveContainer>
      <PaginationControls
        page={monthlyPage}
        setPage={setMonthlyPage}
        size={monthlySize}
        setSize={setMonthlySize}
        total={monthlyCount}
        label="Monthly data"
      />

      {/* Editors actions */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Editors Actions</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Editor</th>
              <th className="border border-gray-300 p-2">Approved</th>
              <th className="border border-gray-300 p-2">Rejected</th>
            </tr>
          </thead>
          <tbody>
            {editors.map((item, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2">{item.editor__full_name}</td>
                <td className="border border-gray-300 p-2">{item.approved}</td>
                <td className="border border-gray-300 p-2">{item.rejected}</td>
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

      {/* Payment details */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Payment Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Payment Type</th>
              <th className="border border-gray-300 p-2">Total Amount</th>
              <th className="border border-gray-300 p-2">Count</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((item, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2">{item.user__full_name}</td>
                <td className="border border-gray-300 p-2">{item.payment_type}</td>
                <td className="border border-gray-300 p-2">
                  ₦{item.total_amount.toLocaleString()}
                </td>
                <td className="border border-gray-300 p-2">{item.count}</td>
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

      {/* Subscription details */}
      <h3 className="text-lg font-semibold mt-6 mb-2">Subscription Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">User</th>
              <th className="border border-gray-300 p-2">Free Reviews Used</th>
              <th className="border border-gray-300 p-2">Free Reviews Granted</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2">{item.user__full_name}</td>
                <td className="border border-gray-300 p-2">{item.free_reviews_used}</td>
                <td className="border border-gray-300 p-2">
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
    </div>
  );
}

