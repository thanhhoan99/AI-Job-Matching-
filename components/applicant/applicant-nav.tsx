// /* eslint-disable @next/next/no-html-link-for-pages */
// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { usePathname } from "next/navigation";
// import { createClient } from "@/lib/supabase/client";
// import {
//   User,
//   LogOut,
//   ChevronDown,
// } from "lucide-react";

// interface HeaderProps {
//   handleOpen?: () => void;
//   handleRemove?: () => void;
//   openClass?: string;
// }

// const navItems = [
//   { href: "/applicant", label: "Home" },
//   { href: "/applicant/dashboard", label: "Dashboard" },
//   { href: "/applicant/profile", label: "Profile" },
//   { href: "/applicant/jobs", label: "My Jobs" },
//   { href: "/applicant/applications", label: "Applications" },
//   { href: "/applicant/interview", label: "AI Interview" },
//   { href: "/applicant/chat", label: "Chatbot" },
// ];

// const ApplicantHeader = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
//   const [scroll, setScroll] = useState(false);
//   const [openMenu, setOpenMenu] = useState(false);
//   const [userDropdown, setUserDropdown] = useState(false);
//   const [user, setUser] = useState<any>(null);
//   const pathname = usePathname();
//   const supabase = createClient();

//   useEffect(() => {
//     const onScroll = () => setScroll(window.scrollY > 100);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     getUser();
//   }, [supabase.auth]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     window.location.href = "/";
//   };

//   const isActive = (href: string) => {
//     if (href === "/applicant") {
//       return pathname === "/applicant";
//     }
//     return pathname.startsWith(href);
//   };

//   const getDisplayName = () => {
//     if (user?.user_metadata?.full_name) {
//       return user.user_metadata.full_name;
//     }
//     if (user?.user_metadata?.name) {
//       return user.user_metadata.name;
//     }
//     if (user?.email) {
//       return user.email.split('@')[0];
//     }
//     return "User";
//   };

//   const getInitials = () => {
//     const name = getDisplayName();
//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <>
//       <header className={`${scroll ? "header sticky-bar stick" : "header sticky-bar"} w-full z-40`}>
//   <div className="w-full px-0">
//           <div className="main-header flex items-center justify-between w-full px-6">
//             {/* Logo */}
//             <div style={{ paddingLeft: "5rem" }} className="header-left">
//               <div className="header-logo">
//                 <Link href="/applicant/dashboard">
//                   <span className="d-flex">
//                     <Image
//                       alt="JobBox"
//                       src="/assets/imgs/template/jobhub-logo.svg"
//                       width={130}
//                       height={40}
//                     />
//                   </span>
//                 </Link>
//               </div>
//             </div>

//             {/* Nav */}
//             <div className="header-nav">
//               <nav className="nav-main-menu">
//                 <ul className="main-menu">
//                   {navItems.map((item) => {
//                     const active = isActive(item.href);
//                     return (
//                       <li key={item.href} className={active ? "active" : ""}>
//                         <Link 
//                           href={item.href}
//                           className={active ? "active" : ""}
//                         >
//                           {item.label}
//                         </Link>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </nav>

//               <div
//                 className={`burger-icon burger-icon-white ${openMenu ? "burger-close" : ""}`}
//                 onClick={() => setOpenMenu(!openMenu)}
//               >
//                 <span className="burger-icon-top" />
//                 <span className="burger-icon-mid" />
//                 <span className="burger-icon-bottom" />
//               </div>
//             </div>

//             {/* User dropdown - Luôn nằm bên phải */}
//             <div className="header-right">
//               <div  className="block-signin">
//                 {user ? (
//                   <div className="relative user-dropdown">
//                     <button
//                       onClick={() => setUserDropdown(!userDropdown)}
//                       className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
//                     >
//                       <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
//                         {getInitials()}
//                       </div>
//                       <span className="text-gray-700 font-medium hidden md:block">
//                         {getDisplayName()}
//                       </span>
//                       <ChevronDown 
//                         className={`w-4 h-4 text-gray-500 transition-transform ${
//                           userDropdown ? "rotate-180" : ""
//                         }`} 
//                       />
//                     </button>

//                     {/* Dropdown menu */}
//                     {userDropdown && (
//                       <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
//                         <div className="px-4 py-2 border-b border-gray-100">
//                           <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
//                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
//                         </div>
                        
//                         <Link
//                           href="/applicant/profile"
//                           className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                           onClick={() => setUserDropdown(false)}
//                         >
//                           <User className="w-4 h-4" />
//                           Profile
//                         </Link>
                        
//                         <button
//                           onClick={handleLogout}
//                           className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors"
//                         >
//                           <LogOut className="w-4 h-4" />
//                           Đăng xuất
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile menu */}
//      {openMenu && (
//   <div
//     className="fixed inset-0 z-50 bg-white mobile-header-active overflow-y-auto"
//   >
//     <div className="p-4">
//       <button
//         className="absolute top-4 right-4 text-gray-600"
//         onClick={() => setOpenMenu(false)}
//       >
        
//       </button>

//       {user && (
//         <div className="flex items-center gap-3 mb-4 border-b pb-4">
//           <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
//             {getInitials()}
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
//             <p className="text-xs text-gray-500">{user.email}</p>
//           </div>
//         </div>
//       )}

//       <nav>
//         <ul className="space-y-2">
//           {navItems.map((item) => (
//             <li key={item.href}>
//               <Link
//                 href={item.href}
//                 className={`block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${
//                   isActive(item.href) ? "font-semibold text-blue-600" : ""
//                 }`}
//                 onClick={() => setOpenMenu(false)}
//               >
//                 {item.label}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       <div className="mt-6 border-t pt-4">
//         <button
//           onClick={handleLogout}
//           className="w-full text-left text-red-500 flex items-center gap-2"
//         >
//           <LogOut className="w-4 h-4" />
//           Đăng xuất
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </>
//   );
// };

// export default ApplicantHeader;

/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  handleOpen?: () => void;
  handleRemove?: () => void;
  openClass?: string;
}

const navItems = [
  { href: "/applicant", label: "Home" },
  { href: "/applicant/dashboard", label: "Dashboard" },
  { href: "/applicant/profile", label: "Profile" },
  { href: "/applicant/jobs", label: "My Jobs" },
  { href: "/applicant/applications", label: "Applications" },
  { href: "/applicant/interview", label: "AI Interview" },
  { href: "/applicant/chat", label: "Chatbot" },
];

const ApplicantHeader = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const [scroll, setScroll] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string) => {
    if (href === "/applicant") {
      return pathname === "/applicant";
    }
    
    // Xử lý đặc biệt cho My Jobs - bao gồm cả các route CV
    // if (href === "/applicant/jobs") {
    //   return pathname.startsWith("/applicant/jobs") || 
    //          pathname.startsWith("/applicant/cvs") ||
    //          pathname.startsWith("/applicant/saved-jobs");
    // }
    
    // Xử lý đặc biệt cho Dashboard
    if (href === "/applicant/dashboard") {
      return pathname === "/applicant/dashboard" || 
             pathname.startsWith("/applicant/cvs"); // Thêm này để CV cũng thuộc Dashboard
    }
    
    return pathname.startsWith(href);
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  // Hàm render breadcrumb dựa trên pathname hiện tại
  // const renderBreadcrumb = () => {
  //   if (pathname.startsWith("/applicant/cvs/new")) {
  //     return (
  //       <div className="breadcrumb-container" style={{ paddingLeft: "5rem", paddingTop: "1rem" }}>
  //         <div className="breadcrumbs">
  //           <ul>
  //             <li><Link href="/applicant/dashboard" className="home-icon">Dashboard</Link></li>
  //             <li><span>Select Template</span></li>
  //           </ul>
  //         </div>
  //       </div>
  //     );
  //   }
  //   return null;
  // };

  return (
    <>
      <header className={`${scroll ? "header sticky-bar stick" : "header sticky-bar"} w-full z-40`}>
        <div className="w-full px-0">
          <div className="main-header flex items-center justify-between w-full px-6">
            {/* Logo */}
            <div style={{ paddingLeft: "3rem" }} className="header-left">
              <div className="header-logo">
                <Link href="/applicant/dashboard">
                  <span className="d-flex">
                    <Image
                      alt="JobBox"
                      src="/assets/imgs/template/jobhub-logo.svg"
                      width={130}
                      height={40}
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* Nav */}
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href} className={active ? "active" : ""}>
                        <Link 
                          href={item.href}
                          className={active ? "active" : ""}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div
                className={`burger-icon burger-icon-white ${openMenu ? "burger-close" : ""}`}
                onClick={() => setOpenMenu(!openMenu)}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>

            {/* User dropdown - Luôn nằm bên phải */}
            <div style={{ paddingLeft: "3rem" }} className="header-right">
              <div className="block-signin">
                {user ? (
                  <div className="relative user-dropdown">
                    <button
                      onClick={() => setUserDropdown(!userDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {getInitials()}
                      </div>
                      <span className="text-gray-700 font-medium hidden md:block">
                        {getDisplayName()}
                      </span>
                      <ChevronDown 
                        className={`w-4 h-4 text-gray-500 transition-transform ${
                          userDropdown ? "rotate-180" : ""
                        }`} 
                      />
                    </button>

                    {/* Dropdown menu */}
                    {userDropdown && (
                       <div style={{width:160}} className="absolute top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn">
                       
                          <p className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            {getDisplayName()}
                          </p>
                          {/* <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user.email}
                          </p> */}
                      

                        <Link
                          href="/applicant/profile"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdown(false)}
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb - Hiển thị khi ở trang tạo CV */}
      {/* {renderBreadcrumb()} */}

      {/* Mobile menu */}
      {openMenu && (
        <div
          className="fixed inset-0 z-50 bg-white mobile-header-active overflow-y-auto"
        >
          <div className="p-4">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={() => setOpenMenu(false)}
            >
              {/* Thêm icon close nếu cần */}
            </button>

            {user && (
              <div className="flex items-center gap-3 mb-4 border-b pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {getInitials()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 ${
                          active ? "font-semibold text-blue-600" : ""
                        }`}
                        onClick={() => setOpenMenu(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-6 border-t pt-4">
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-500 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantHeader;