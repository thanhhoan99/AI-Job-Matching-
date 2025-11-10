import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Clock,
  Building2,
  Youtube,
  Twitter,
  Facebook,
  Database,
  ChartNoAxesGanttIcon,
} from "lucide-react";
import { ApplyButton } from "@/components/applicant/apply-button";
import { SaveJobButton } from "@/components/applicant/save-job-button";
import SimilarJobs from "@/components/public/similarJobs";
import Link from "next/link";
import FeaturedSlider from "@/components/sliders/Featured";
import { JobDetailTracker } from "@/components/applicant/JobDetailTracker";


export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

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

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!applicantProfile) {
    redirect("/applicant/profile?message=complete-profile");
  }

  const { data: existingApplication } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", id)
    .eq("applicant_id", applicantProfile?.id || "")
    .single();

  const { data: savedJob } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("job_id", id)
    .eq("applicant_id", applicantProfile?.id || "")
    .single();

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max)
      return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(
        0
      )} triệu VNĐ`;
    if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu VNĐ`;
    return "Thỏa thuận";
  };

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
    <div>
       <JobDetailTracker jobId={id} applicantId={applicantProfile.id} />
      <section className="section-box mt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="box-border-single">
                <div className="row mt-10">
                  <div className="breadcrumbs mb-30">
                    <ul>
            <li><a className="home-icon" href="/">Job</a></li>
            <li>{job.title}</li>
          
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
                  <div className="col-lg-4 col-md-12 text-lg-end flex justify-end items-center gap-3 ">
                      <SaveJobButton
                        jobId={id}
                        applicantId={applicantProfile?.id || ""}
                        isSaved={!!savedJob}
                      />
                    <ApplyButton
                      jobId={id}
                      applicantId={applicantProfile?.id || ""}
                      hasApplied={!!existingApplication}
                    />
                  </div>
                </div>
                <div className="border-bottom " />
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
                          {job.experience_years_min}-{job.experience_years_max}{" "}
                          years
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
                        <span className="text-description mb-10">Deadline</span>
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
                          {new Date(job.created_at).toLocaleDateString("vi-VN")}
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <MapPin />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description mb-10">Location</span>
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
                    <div className="col-lg-4 col-md-12 text-lg-end flex justify-end items-center gap-3">
                      <SaveJobButton
                        jobId={id}
                        applicantId={applicantProfile?.id || ""}
                        isSaved={!!savedJob}
                      />
                      <ApplyButton
                        jobId={id}
                        applicantId={applicantProfile?.id || ""}
                        hasApplied={!!existingApplication}
                      />
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
                          <span className="link-underline mt-15"> Website</span>
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
  );
}
