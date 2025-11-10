

// app/page.tsx (sửa đổi)
import Link from "next/link";


import { createClient } from "@/lib/supabase/server";
import TopRekruterSlider from "@/components/sliders/TopRekruter";
import BlogSlider from "@/components/sliders/Blog";
import CategoryTab from "@/components/elements/CategoryTab";

import "@/public/assets/css/style.css";
import "@/styles/globalsApplicant.css";
import CategorySlider2 from "@/components/sliders/Category2";
import ApplicantFooter from "@/components/applicant/ApplicantFooter";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("name");

  // Lấy thống kê tổng quan
  const { count: totalJobs } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: totalCompanies } = await supabase
    .from("employer_profiles")
    .select("*", { count: "exact", head: true });

  // Lấy các công việc mới nhất để hiển thị
  const { data: jobs  } = await supabase
    .from("job_postings")
    .select(
      `
    *,
    employer_profiles (
      company_name,
      logo_url,
      city,
      industry
    ),
    categories (
      name
    )
  `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <div className="min-h-screen">
    
      {/* <section className="relative w-full bg-gradient-to-r from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center">
    
          <div className="lg:w-2/3 space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-gray-800">
              Cách <span className="text-blue-600">Dễ Nhất</span>
              <br className="hidden lg:block" />
              Để Tìm Công Việc Mới
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Mỗi tháng, hơn 3 triệu ứng viên tìm đến website của chúng tôi để
              tìm kiếm việc làm, với hơn 140,000 đơn ứng tuyển mỗi ngày.
            </p>

       
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <JobSearchPublic showFilters={true} />
            </div>

 
            <div className="flex flex-wrap gap-2 mt-6 text-gray-600 text-sm">
              <strong className="font-medium mr-1 text-gray-700">
                Tìm kiếm phổ biến:
              </strong>
              {[
                "Frontend",
                "Backend",
                "Fullstack",
                "React",
                "NodeJS",
                "Senior",
                "Developer",
              ].map((tag) => (
                <Link
                  key={tag}
                  href={`/?search=${encodeURIComponent(tag)}`}
                  className="text-blue-600 hover:underline"
                >
                  {tag},
                </Link>
              ))}
            </div>
          </div>

      
          <div className="hidden lg:flex lg:w-1/3 justify-center relative">
            <img
              src="/assets/imgs/page/homepage1/banner1.png"
              alt="Banner 1"
              className="w-60 absolute top-0 left-0"
            />
            <img
              src="/assets/imgs/page/homepage1/banner2.png"
              alt="Banner 2"
              className="w-60 absolute bottom-0 right-0"
            />
            <img
              src="/assets/imgs/page/homepage1/icon-top-banner.png"
              alt="Icon Top"
              className="w-20 absolute top-4 right-4 animate-bounce"
            />
          </div>
        </div>
      </section> */}

      {/* Stats Section */}
      {/* <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <Briefcase className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalJobs || 0}+
                </h3>
                <p className="text-gray-600">Công Việc</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <Building2 className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalCompanies || 0}+
                </h3>
                <p className="text-gray-600">Công Ty</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="flex justify-center mb-4">
                  <Users className="w-12 h-12 text-purple-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">10,000+</h3>
                <p className="text-gray-600">Ứng Viên</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

<div className="bg-homepage1" />
 
        <section className="section-box">
          <div className="banner-hero hero-1">
            <div className="banner-inner">
              <div className="row">
                <div className="col-xl-8 col-lg-12">
                  <div className="block-banner">
                    <h1 className="heading-banner wow animate__animated animate__fadeInUp">
                      The <span className="color-brand-2">Easiest Way</span>
                      <br className="d-none d-lg-block" />
                      to Get Your New Job
                    </h1>
                    <div className="banner-description mt-20 wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                      Each month, more than 3 million job seekers turn to <br className="d-none d-lg-block" />
                      website in their search for work, making over 140,000 <br className="d-none d-lg-block" />
                      applications every single day
                    </div>
                    <div className="form-find mt-40 wow animate__animated animate__fadeIn" data-wow-delay=".2s">
                      <form>
                        <div className="box-industry">
                          <select className="form-input mr-10 select-active input-industry">
                            <option value={0}>Industry</option>
                            <option value={1}>Software</option>
                            <option value={2}>Finance</option>
                  
                          </select>
                        </div>
                        <div className="box-industry">
                          <select className="form-input mr-10 select-active  input-location">
                            <option value="">Location</option>
                            <option value="AX">Aland Islands</option>
                  
                          </select>
                        </div>
                        <input className="form-input input-keysearch mr-10" type="text" placeholder="Your keyword... " />
                        <button className="btn btn-default btn-find font-sm">Search</button>
                      </form>
                    </div>
                    <div className="list-tags-banner mt-60 wow animate__animated animate__fadeInUp" data-wow-delay=".3s">
                      <strong>Popular Searches:</strong>
                      <Link href="#">Designer,</Link>
                      <Link href="#">Web,</Link>
                      <Link href="#">IOS,</Link>
             
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-12 d-none d-xl-block col-md-6">
                  <div className="banner-imgs">
                    <div className="block-1 shape-1">
                      <img className="img-responsive" alt="jobBox" src="assets/imgs/page/homepage1/banner1.png" />
                    </div>
                    <div className="block-2 shape-2">
                      <img className="img-responsive" alt="jobBox" src="assets/imgs/page/homepage1/banner2.png" />
                    </div>
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-100" />
        <section className="section-box mt-80">
          <div className="section-box wow animate__animated animate__fadeIn">
            <div className="container">
              <div className="text-center">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Browse by category</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Find the job that’s perfect for you. about 800+ new jobs everyday</p>
              </div>
              <div className="box-swiper mt-50">
                <CategorySlider2 />
              </div>
            </div>
          </div>
        </section>
        <div>
        <div className="section-box mb-30">
          <div className="container">
            <div className="box-we-hiring">
              <div className="text-1">
                <span className="text-we-are">We are</span>
                <span className="text-hiring">Hiring</span>
              </div>
              <div className="text-2">
                Let’s <span className="color-brand-1">Work</span> Together
                <br /> &amp; <span className="color-brand-1">Explore</span> Opportunities
              </div>
              <div className="text-3">
                <div className="btn btn-apply btn-apply-icon" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                  Apply now
                </div>
              </div>
            </div>
          </div>
        </div>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Jobs of the day</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Search and connect with the right candidates faster. </p>
            </div>
            <div className="mt-70">
              <CategoryTab jobs={jobs  || []} />
            </div>
          </div>
        </section>
        <section className="section-box overflow-visible mt-100 mb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-sm-12">
                <div className="box-image-job">
                  <img className="img-job-1" alt="jobBox" src="assets/imgs/page/homepage1/img-chart.png" />
                  <img className="img-job-2" alt="jobBox" src="assets/imgs/page/homepage1/controlcard.png" />
                  <figure className="wow animate__animated animate__fadeIn">
                    <img alt="jobBox" src="assets/imgs/page/homepage1/img1.png" />
                  </figure>
                </div>
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="content-job-inner">
                  <span className="color-text-mutted text-32">Millions Of Jobs. </span>
                  <h2 className="text-52 wow animate__animated animate__fadeInUp">
                    Find The One That’s <span className="color-brand-2">Right</span> For You
                  </h2>
                  <div className="mt-40 pr-50 text-md-lh28 wow animate__animated animate__fadeInUp">Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 600,000 companies worldwide. The right job is out there.</div>
                  <div className="mt-40">
                    <div className="wow animate__animated animate__fadeInUp">
                      <Link href="/jobs-grid">
                        <span className="btn btn-default">Search Jobs</span>
                      </Link>

                      <Link href="/page-about">
                        <span className="btn btn-link">Learn More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box overflow-visible mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">25</span>
                    <span> K+</span>
                  </h1>
                  <h5>Completed Cases</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a <br className="d-none d-lg-block" />
                    complete solution upon focused of
                    <br className="d-none d-lg-block" /> any business
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">17</span>
                    <span> +</span>
                  </h1>
                  <h5>Our Office</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a <br className="d-none d-lg-block" />
                    complete solution upon focused of <br className="d-none d-lg-block" />
                    any business
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">86</span>
                    <span> +</span>
                  </h1>
                  <h5>Skilled People</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a <br className="d-none d-lg-block" />
                    complete solution upon focused of <br className="d-none d-lg-block" />
                    any business
                  </p>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                <div className="text-center">
                  <h1 className="color-brand-2">
                    <span className="count">28</span>
                    <span> +</span>
                  </h1>
                  <h5>CHappy Clients</h5>
                  <p className="font-sm color-text-paragraph mt-10">
                    We always provide people a <br className="d-none d-lg-block" />
                    complete solution upon focused of <br className="d-none d-lg-block" />
                    any business
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Top Recruiters</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Discover your next career move, freelance gig, or internship</p>
            </div>
          </div>
          <div className="container">
            <div className="box-swiper mt-50">
              <TopRekruterSlider />
            </div>
          </div>
        </section>
        <section className="section-box mt-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Jobs by Location</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Find your favourite jobs and get the benefits of yourself</p>
            </div>
          </div>
          <div className="container">
            <div className="row mt-50">
              <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location1.png)" }}>
                      <span className="lbl-hot">Hot</span>
                    </div>
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Paris, France</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">5 Vacancy</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">120 companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-7 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location2.png)" }}>
                      <span className="lbl-hot">Trending</span>
                    </div>
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>London, England</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">7 Vacancy</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">68 companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location3.png)" }}>
                      <span className="lbl-hot">Hot</span>
                    </div>
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>New York, USA</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">9 Vacancy</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">80 companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location4.png)" }} />
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Amsterdam, Holland</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">16 Vacancy</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">86 companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-5 col-lg-5 col-md-7 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location5.png)" }} />
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Copenhagen, Denmark</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">39 Vacancy</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">186 companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3 col-md-5 col-sm-12 col-12">
                <div className="card-image-top hover-up">
                  <Link href="/jobs-grid">
                    <div className="image" style={{ backgroundImage: "url(assets/imgs/page/homepage1/location6.png)" }} />
                  </Link>

                  <div className="informations">
                    <Link href="/jobs-grid">
                      <h5>Berlin, Germany</h5>
                    </Link>

                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <span className="text-14 color-text-paragraph-2">15 Vacancy</span>
                      </div>
                      <div className="col-lg-6 col-6 text-end">
                        <span className="color-text-paragraph-2 text-14">632 companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-center">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">News and Blog</h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
            </div>
          </div>
          <div className="container">
            <div className="mt-50">
              <div className="box-swiper style-nav-top">
                <BlogSlider />
              </div>

              <div className="text-center">
                <Link href="/blog-grid">
                  <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">Load More Posts</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="section-box mt-50 mb-20">
          <div className="container">
            <div className="box-newsletter">
              <div className="row">
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
                </div>
                <div className="col-lg-12 col-xl-6 col-12">
                  <h2 className="text-md-newsletter text-center">
                    New Things Will Always
                    <br /> Update Regularly
                  </h2>
                  <div className="box-form-newsletter mt-40">
                    <form className="form-newsletter">
                      <input className="input-newsletter" type="text" placeholder="Enter your email here" />
                      <button className="btn btn-default font-heading icon-send-letter">Subscribe</button>
                    </form>
                  </div>
                </div>
                <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                  <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
                </div>
              </div>
            </div>
          </div>
        </section>

    </div>
       </div>
  );
}
