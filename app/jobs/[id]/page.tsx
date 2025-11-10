// import { createClient } from "@/lib/supabase/server";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { Building2, MapPin, DollarSign, Briefcase, Calendar, Clock, Users } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import FeaturedSlider from "@/components/sliders/Featured";
// import SimilarJobs from "@/components/public/similarJobs";

// export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = await params;
//   const supabase = await createClient();

//   const { data: job } = await supabase
//     .from("job_postings")
//     .select(
//       `
//       *,
//       categories ( name ),
//       employer_profiles (
//         company_name,
//         logo_url,
//         description,
//         city,
//         website,
//         industry,
//         company_size,
//         address
//       )
//     `
//     )
//     .eq("id", id)
//     .eq("is_active", true)
//     .eq("status", "published")
//     .single();

//   if (!job) notFound();

//   const formatSalary = (min: number | null, max: number | null) => {
//     if (!min && !max) return "Thỏa thuận";
//     if (min && max) return `${(min / 1_000_000).toFixed(0)} - ${(max / 1_000_000).toFixed(0)} triệu VNĐ`;
//     if (min) return `Từ ${(min / 1_000_000).toFixed(0)} triệu VNĐ`;
//     return "Thỏa thuận";
//   };

//   const formatJobType = (type: string) => {
//     const map: Record<string, string> = {
//       full_time: "Toàn thời gian",
//       part_time: "Bán thời gian",
//       contract: "Hợp đồng",
//       internship: "Thực tập",
//       freelance: "Freelance",
//     };
//     return map[type] || type;
//   };

//   return (
//     <div className="mt-12">
//       <section className="section-box">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* ---------- MAIN CONTENT ---------- */}
//             <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
//                   <div className="text-gray-500 mb-4 flex items-center gap-2">
//                     <Briefcase className="w-4 h-4" /> {formatJobType(job.job_type)}
//                     <span>•</span>
//                     <Clock className="w-4 h-4" />{" "}
//                     {new Date(job.created_at).toLocaleDateString("vi-VN")}
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline">Lưu công việc</Button>
//                   <Button>Ứng tuyển ngay</Button>
//                 </div>
//               </div>

//               <hr className="my-4" />

//               {/* ẢNH BANNER */}
//               {job.banner_url && (
//                 <div className="rounded-lg overflow-hidden mb-4">
//                   <img src={job.banner_url} alt={job.title} className="w-full object-cover" />
//                 </div>
//               )}

//               {/* OVERVIEW */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-3 border-b pb-2">Thông tin chung</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-4 h-4 text-gray-500" /> {job.city || job.location}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <DollarSign className="w-4 h-4 text-gray-500" /> {formatSalary(job.salary_min, job.salary_max)}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Users className="w-4 h-4 text-gray-500" /> {job.number_of_positions} vị trí
//                   </div>
//                   {job.deadline && (
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-gray-500" /> Hạn:{" "}
//                       {new Date(job.deadline).toLocaleDateString("vi-VN")}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* MÔ TẢ */}
//               <div className="mt-8">
//                 <h3 className="text-lg font-semibold mb-2">Mô tả công việc</h3>
//                 <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
//               </div>

//               {job.requirements && (
//                 <div className="mt-8">
//                   <h3 className="text-lg font-semibold mb-2">Yêu cầu công việc</h3>
//                   <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
//                 </div>
//               )}

//               {job.benefits && (
//                 <div className="mt-8">
//                   <h3 className="text-lg font-semibold mb-2">Quyền lợi</h3>
//                   <p className="text-gray-700 whitespace-pre-line">{job.benefits}</p>
//                 </div>
//               )}
//             </div>

//             {/* ---------- SIDEBAR ---------- */}
//             <div className="space-y-6">
//               <div className="bg-white border rounded-2xl p-5">
//                 <div className="flex items-center gap-4 mb-4">
//                   {job.employer_profiles?.logo_url ? (
//                     <img
//                       src={job.employer_profiles.logo_url}
//                       alt={job.employer_profiles.company_name}
//                       className="w-14 h-14 rounded-lg object-cover border"
//                     />
//                   ) : (
//                     <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
//                       <Building2 className="w-6 h-6 text-gray-400" />
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-semibold">{job.employer_profiles?.company_name}</p>
//                     <p className="text-sm text-gray-500">{job.employer_profiles?.city}</p>
//                     <Link href="#" className="text-blue-600 text-sm hover:underline">
//                       {job.employer_profiles?.website || "Website công ty"}
//                     </Link>
//                   </div>
//                 </div>

//                 <div className="text-sm text-gray-600 space-y-2">
//                   <p>📍 {job.employer_profiles?.address}</p>
//                   <p>🏢 {job.employer_profiles?.industry}</p>
//                   <p>👥 Quy mô: {job.employer_profiles?.company_size || "Chưa rõ"}</p>
//                 </div>
//               </div>

//               {/* JOB TƯƠNG TỰ */}
//               <div className="bg-white border rounded-2xl p-5">
//                 <h4 className="text-lg font-semibold mb-3">Công việc tương tự</h4>
//                 <ul className="space-y-3 text-sm text-gray-700">
//                   <li className="flex justify-between">
//                    <SimilarJobs currentJob={job} />

//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FEATURED JOBS */}
//       <section className="mt-16">
//         <div className="container mx-auto px-4 lg:px-8">
//           <h2 className="text-2xl font-bold mb-2">Featured Jobs</h2>
//           <p className="text-gray-500 mb-6">Các công việc nổi bật gần đây</p>
//           <FeaturedSlider />
//         </div>
//       </section>

//       {/* NEWSLETTER */}
//       <section className="mt-20 mb-10">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="bg-blue-50 rounded-2xl p-10 text-center">
//             <h2 className="text-2xl font-bold mb-4">Nhận thông báo việc làm mới nhất</h2>
//             <form className="max-w-md mx-auto flex gap-2">
//               <input
//                 type="email"
//                 placeholder="Nhập email của bạn"
//                 className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
//               />
//               <Button type="submit">Đăng ký</Button>
//             </form>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// app/jobs/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Clock,
  Building2,
  Globe,
  ChartNoAxesGanttIcon,
  Database,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import "@/public/assets/css/style.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import FeaturedSlider from "@/components/sliders/Featured";
import SimilarJobs from "@/components/public/similarJobs";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job } = await supabase
    .from("job_postings")
    .select(
      `
      *,
      categories (
        id,
        name
      ),
      employer_profiles (
        company_name,
        logo_url,
        description,
        city,
        website,
        industry,
        company_size,
        address
      )
    `
    )
    .eq("id", id)
    .eq("is_active", true)
    .eq("status", "published")
    .single();

  if (!job) {
    notFound();
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };
  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max)
      return `${(min / 1000000).toFixed(0)} - ${(max / 1000000).toFixed(
        0
      )} triệu VNĐ`;
    if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu VNĐ`;
    return "Thỏa thuận";
  };

  const formatJobType = (type: string) => {
    const types: Record<string, string> = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      contract: "Hợp đồng",
      internship: "Thực tập",
      freelance: "Freelance",
    };
    return types[type] || type;
  };

  return (
    <>
      <Header />

      <div>
        <section className="section-box mt-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                <div className="box-border-single">
                  <div className="row mt-10">
                    <div className="breadcrumbs mb-30">
                      <ul>
                        <li>
                          <a className="home-icon" href="/">
                            Home
                          </a>
                        </li>
                        <li>Job</li>
                        {/* <li><span>{job.title}</span></li> */}
                      </ul>
                    </div>
                    <div className="col-lg-8 col-md-12">
                      <h3>{job.title}</h3>

                      <div className="mt-0 mb-15">
                        <span className="card-briefcase">
                          {formatJobType(job.job_type)}
                        </span>
                        <span className="card-time">
                          {" "}
                          {getTimeAgo(job.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-12 text-lg-end">
                      <Link
                        href={`/auth/login?redirect=${encodeURIComponent(
                          `/applicant/jobs/${job.id}`
                        )}`}
                        className="btn btn-apply-icon btn-apply btn-apply-big hover-up"
                        data-bs-toggle="modal"
                        data-bs-target="#ModalApplyJobForm"
                      >
                        Apply now
                      </Link>
                    </div>
                  </div>
                  <div className="banner-hero banner-image-single mt-10 mb-20">
                    {/* <h5 className="border-bottom pb-15 mb-30">Skill</h5> */}
                    <div className="job-tags mt-25">
                      {job.skills_required?.map((skill: string) => (
                        <span
                          key={skill}
                          className="btn btn-tags-sm mr-10 mb-10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="job-overview">
                    <h5 className="border-bottom pb-15 mb-30">Overview</h5>
                    <div className="row">
                      <div className="col-md-6 d-flex">
                        <div className="sidebar-icon-item">
                          <ChartNoAxesGanttIcon />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description industry-icon mb-10">
                            Category
                          </span>
                          <strong className="small-heading">
                            {job.categories?.name || "Không rõ"}
                          </strong>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex mt-sm-15">
                        <div className="sidebar-icon-item">
                          <Briefcase />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description joblevel-icon mb-10">
                            Job level
                          </span>
                          <strong className="small-heading">
                            {job.job_level}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-25">
                      <div className="col-md-6 d-flex mt-sm-15">
                        <div className="sidebar-icon-item">
                          <DollarSign />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description salary-icon mb-10">
                            Salary
                          </span>
                          <strong className="small-heading">
                            {formatSalary(job.salary_min, job.salary_max)}
                          </strong>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex">
                        <div className="sidebar-icon-item">
                          <Clock />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description experience-icon mb-10">
                            Experience
                          </span>
                          <strong className="small-heading">
                            {job.experience_years_min}-
                            {job.experience_years_max} years
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-25">
                      <div className="col-md-6 d-flex mt-sm-15">
                        <div className="sidebar-icon-item">
                          <Building2 />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description jobtype-icon mb-10">
                            Job type
                          </span>
                          <strong className="small-heading">
                            {formatJobType(job.job_type)}
                          </strong>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex mt-sm-15">
                        <div className="sidebar-icon-item">
                          <Calendar />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description mb-10">
                            Deadline
                          </span>
                          <strong className="small-heading">
                            {new Date(job.deadline).toLocaleDateString("vi-VN")}
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-25">
                      <div className="col-md-6 d-flex mt-sm-15">
                        <div className="sidebar-icon-item">
                          <Database />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description jobtype-icon mb-10">
                            Updated
                          </span>
                          <strong className="small-heading">
                            {new Date(job.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </strong>
                        </div>
                      </div>
                      <div className="col-md-6 d-flex mt-sm-15">
                        <div className="sidebar-icon-item">
                          <MapPin />
                        </div>
                        <div className="sidebar-text-info ml-10">
                          <span className="text-description mb-10">
                            Location
                          </span>
                          <strong className="small-heading">
                            {job.city || job.location}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-single">
                    <h4>
                      Welcome to{" "}
                      {job.employer_profiles?.company_name || "Company Name"}
                    </h4>

                    <p>{job.description || "Job Description"}</p>
                    <h4>Requirements</h4>
                    <p>{job.requirements || "Job Requirements"}</p>
                    <h4>Benefits</h4>
                    <p>{job.benefits || "Job Benefits"}</p>
                    <h4>Company Description</h4>
                    <p>
                      {job.employer_profiles?.description ||
                        "Company Description"}
                    </p>
                  </div>
                  <div className="author-single">
                    <span>AliThemes</span>
                  </div>
                  <div className="single-apply-jobs">
                    <div className="row align-items-center">
                      <div className="col-md-5">
                        <Link
                          href={`/auth/login?redirect=${encodeURIComponent(
                            `/applicant/jobs/${job.id}`
                          )}`}
                        >
                          <span className="btn btn-default mr-15">
                            Apply now
                          </span>
                        </Link>

                        <Link
                          href={`/auth/login?redirect=${encodeURIComponent(
                            `/applicant/jobs/${job.id}`
                          )}`}
                        >
                          <span className="btn btn-border">Save job</span>
                        </Link>
                      </div>
                      <div className="col-md-7 text-lg-end social-share">
                        <h6 className="color-text-paragraph-2 d-inline-block d-baseline mr-10">
                          Share this
                        </h6>
                        <Link href="#">
                          <span className="mr-5 d-inline-block d-middle">
                            <Facebook />
                          </span>
                        </Link>

                        <Link href="#">
                          <span className="mr-5 d-inline-block d-middle">
                            <Twitter />
                          </span>
                        </Link>

                        <Link href="#">
                          <span className="mr-5 d-inline-block d-middle">
                            <Youtube />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                {job.employer_profiles && (
                  <div className="sidebar-border">
                    <div className="sidebar-heading">
                      <div className="avatar-sidebar">
                        <figure>
                          {job.employer_profiles.logo_url ? (
                            <img
                              src={job.employer_profiles.logo_url}
                              alt={job.employer_profiles.company_name}
                              className="img-responsive"
                            />
                          ) : (
                            <div className="card-grid-2-img-small bg-9">
                              <Building2 className="w-6 h-6 text-brand-2" />
                            </div>
                          )}
                        </figure>
                        <div className="sidebar-info">
                          <span className="sidebar-company">
                            {job.employer_profiles.company_name}
                          </span>

                          <span className="card-location">
                            {job.employer_profiles.address},
                            {job.employer_profiles.city}
                          </span>

                          <Link href={job.employer_profiles.website}>
                            <span className="link-underline mt-15">
                              {" "}
                              Website
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="sidebar-list-job">
                      <div className="box-map">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3150609575905!2d-87.6235655!3d41.886080899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34afe61%3A0x6caeb5f721ca846!2s205%20N%20Michigan%20Ave%20Suit%20810%2C%20Chicago%2C%20IL%2060601%2C%20Hoa%20K%E1%BB%B3!5e0!3m2!1svi!2s!4v1658551322537!5m2!1svi!2s"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <ul className="ul-disc">
                        {/* <li>Phone: {job.employer_profiles.contact_phone}</li>
                        <li>Email: {job.employer_profiles.contact_email}</li> */}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="sidebar-border">
                  <h6 className="f-18">Similar jobs</h6>
                  <div className="sidebar-list-job">
                    <ul>
                      <li>
                        <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                          <SimilarJobs currentJob={job} />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="sidebar-border">
                  <h6 className="f-18">Tags</h6>
                  <div className="sidebar-list-job">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        App
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Digital
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Marketing
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Conten Writer
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Sketch
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        PSD
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Laravel
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        React JS
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        HTML
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Finance
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Manager
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small bg-14 mb-10 mr-5">
                        Business
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-left">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                Featured Jobs
              </h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                Get the latest news, updates and tips
              </p>
            </div>
            <div className="mt-50">
              <div className="box-swiper style-nav-top">
                <FeaturedSlider />
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-20">
          <div className="container">
            <div className="box-newsletter">
              <div className="row">
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img
                    src="assets/imgs/template/newsletter-left.png"
                    alt="joxBox"
                  />
                </div>
                <div className="col-lg-12 col-xl-6 col-12">
                  <h2 className="text-md-newsletter text-center">
                    New Things Will Always
                    <br /> Update Regularly
                  </h2>
                  <div className="box-form-newsletter mt-40">
                    <form className="form-newsletter">
                      <input
                        className="input-newsletter"
                        type="text"
                        placeholder="Enter your email here"
                      />
                      <button className="btn btn-default font-heading icon-send-letter">
                        Subscribe
                      </button>
                    </form>
                  </div>
                </div>
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img
                    src="assets/imgs/template/newsletter-right.png"
                    alt="joxBox"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
