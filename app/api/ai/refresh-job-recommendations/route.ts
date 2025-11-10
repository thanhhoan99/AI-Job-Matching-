// app/api/ai/refresh-job-recommendations/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicantId } = await req.json();

    if (!applicantId) {
      return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
    }

    // Generate embeddings cho tất cả CV của applicant
    const { data: cvs, error: cvsError } = await supabase
      .from("applicant_cvs")
      .select("id")
      .eq("applicant_id", applicantId);

    if (cvsError || !cvs || cvs.length === 0) {
      return NextResponse.json({ error: "No CVs found" }, { status: 404 });
    }

    // Generate embeddings cho mỗi CV
    for (const cv of cvs) {
      await fetch(`${process.env.NEXTAUTH_URL}/api/ai/generate-cv-embedding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId: cv.id }),
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Job recommendations refreshed successfully",
      cvsProcessed: cvs.length
    });
  } catch (error: any) {
    console.error("Error refreshing job recommendations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to refresh job recommendations" },
      { status: 500 }
    );
  }
}