// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { 
//   LayoutDashboard, 
//   Briefcase, 
//   Users, 
//   CheckSquare, 
//   BarChart, 
//   MessageSquare, 
//   Bell, 
//   BookOpen, 
//   CreditCard, 
//   ShieldOff, 
//   Edit,
//   Code,
// } from 'lucide-react';

// export default function Sidebar() {
//   const [isOpen, setIsOpen] = useState(true);

//   const menuButton = () => {
//     setIsOpen(!isOpen);
//   };

//   const navItems = [
//     { href: '/', label: 'Dashboard', icon: LayoutDashboard },
//     { href: '/jobs', label: 'Jobs', icon: Briefcase },
//     { href: '/candidates', label: 'Candidates', icon: Users },
//     { href: '/tasks', label: 'Tasks', icon: CheckSquare },
//     { href: '/users', label: 'Users', icon: Users },
//     { href: '/analytics', label: 'Analytics', icon: BarChart },
//     { href: '/messages', label: 'Messages', icon: MessageSquare },
//     { href: '#', label: 'Notifications', icon: Bell },
//     { href: '/publications', label: 'Publications', icon: BookOpen },
//     { href: '#', label: 'Payments', icon: CreditCard },
//     { href: '/users', label: 'Blocked Users', icon: ShieldOff },
//     { href: '#', label: 'Editors', icon: Edit },
//     {href: "/passcode", label: 'Access code', icon: Code},
//   ];

//   return (
//     <aside className={`bg-white shadow-md h-screen ${isOpen ? 'w-fit' : 'w-fit'} transition-all duration-300`}>
//       <div className="p-4">
//         <header className="flex items-center justify-between">
//           <h1 className={`text-xl font-bold text-[var(--primary-color)] ${isOpen ? 'block' : 'hidden'}`}>
//             Welcome Admin
//           </h1>
//           <button
//             onClick={menuButton}
//             className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
//             aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
//               />
//             </svg>
//           </button>
//         </header>
//       </div>
//       <nav className="mt-4">
//         <ul>
//           {navItems.map((item, index) => (
//             <div key={index} className='flex'>
//              <li key={item.label}>
//               </li>
//               <Link
//                   href={item.href}
//                   className={`flex items-center py-2 px-4 hover:bg-gray-100 text-gray-700 hover:text-[var(--primary-color)] transition-all duration-200 ${
//                     isOpen ? 'justify-start' : 'justify-center'
//                   }`}
//                 >
//                   <item.icon
//                     className={`w-5 h-5 text-gray-700 transition-all duration-200 ${
//                       isOpen ? 'mr-3' : 'mr-0'
//                     }`}
//                   />
//                   {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
//                 </Link>
//               </div>
//           ))}
//         </ul>
//       </nav>
//     </aside>
//   );
// }