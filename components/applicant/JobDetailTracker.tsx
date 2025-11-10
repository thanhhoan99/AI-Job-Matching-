// components/applicant/job-detail-tracker.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useTrackBehavior } from "@/hooks/useTrackBehavior";

interface JobDetailTrackerProps {
  jobId: string;
  applicantId: string;
}

export function JobDetailTracker({ jobId, applicantId }: JobDetailTrackerProps) {
  const { trackBehavior } = useTrackBehavior();
  const [timeOnPage, setTimeOnPage] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Track khi bắt đầu xem trang chi tiết
    trackBehavior({
      jobId,
      eventType: 'view',
    
    });

    console.log(`👀 Tracking view for job: ${jobId}`);

    // Bắt đầu đếm thời gian
    timerRef.current = setInterval(() => {
      setTimeOnPage(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      // Track khi rời trang
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (totalTime > 3) { // Chỉ track nếu xem đủ lâu (ít nhất 3 giây)
        trackBehavior({
          jobId,
          eventType: 'view',
          durationSeconds: totalTime,
        });
        
        console.log(`⏱️ Tracked ${totalTime}s view time for job: ${jobId}`);
      }
    };
  }, [jobId, trackBehavior]);

  return null; // Component này không render gì cả
}