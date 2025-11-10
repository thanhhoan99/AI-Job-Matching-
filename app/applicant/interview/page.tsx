

// "use client"

// import { useState } from "react"
// import { Play, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
// import Link from "next/link"

// export default function InterviewPage() {
//   const [step, setStep] = useState<"setup" | "interview" | "results">("setup")
//   const [jobPosition, setJobPosition] = useState("")
//   const [difficultyLevel, setDifficultyLevel] = useState("medium")
//   const [questions, setQuestions] = useState<any[]>([])
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
//   const [answers, setAnswers] = useState<Record<string, string>>({})
//   const [currentAnswer, setCurrentAnswer] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [evaluationsData, setEvaluationsData] = useState<Record<string, any>>({})

//   const handleStartInterview = async () => {
//     if (!jobPosition) {
//       alert("Vui lòng nhập vị trí công việc")
//       return
//     }

//     setIsLoading(true)
//     try {
//       const response = await fetch("/api/ai/generate-interview", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           jobPosition,
//           difficultyLevel,
//           numberOfQuestions: 5,
//         }),
//       })

//       const result = await response.json()
//       if (result.data?.questions) {
//         setQuestions(result.data.questions)
//         setStep("interview")
//         setCurrentQuestionIndex(0)
//       }
//     } catch (error) {
//       alert("Không thể tạo câu hỏi phỏng vấn")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleSubmitAnswer = async () => {
//     if (!currentAnswer.trim()) {
//       alert("Vui lòng nhập câu trả lời")
//       return
//     }

//     const currentQuestion = questions[currentQuestionIndex]
//     const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer }
//     setAnswers(newAnswers)

//     // Evaluate answer
//     setIsLoading(true)
//     try {
//       const response = await fetch("/api/ai/evaluate-answer", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: currentQuestion.question,
//           answer: currentAnswer,
//         }),
//       })

//       const result = await response.json()
//       if (result.data) {
//         setEvaluationsData({ ...evaluationsData, [currentQuestion.id]: result.data })
//       }
//     } catch (error) {
//       console.error("Evaluation error:", error)
//     } finally {
//       setIsLoading(false)
//     }

//     setCurrentAnswer("")

//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1)
//     } else {
//       setStep("results")
//     }
//   }

//   const currentQuestion = questions[currentQuestionIndex]
//   const averageScore =
//     Object.values(evaluationsData).reduce((sum: number, evalData: any) => sum + (evalData.score || 0), 0) /
//     Object.keys(evaluationsData).length

//   return (
//     <div className="section-box mt-50">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-12">
//             {/* Breadcrumb */}
//             <div className="breadcrumbs mb-30">
//               <ul>
//                 <li><Link href="/applicant/dashboard" className="home-icon">Dashboard</Link></li>
//                 <li><span>Mô Phỏng Phỏng Vấn AI</span></li>
//               </ul>
//             </div>

//             {/* Header */}
//             {/* <div className="box-heading mb-30">
//               <h3 className="text-32">Mô Phỏng Phỏng Vấn AI</h3>
//               <p className="text-md color-text-paragraph">
//                 Luyện tập kỹ năng phỏng vấn với AI và nhận phản hồi chi tiết
//               </p>
//             </div> */}

//             {/* Main Content */}
//             <div className="row justify-content-center">
//               <div className="col-lg-8 col-md-10">
//                 {step === "setup" && (
//                   <div className="card-shadow border-radius-15">
//                     <div className="card-heading p-30 border-bottom">
//                       <h5 className="text-18">Thiết lập buổi phỏng vấn</h5>
//                       <p className="text-sm color-text-mutted mt-5">Chọn vị trí và độ khó để bắt đầu</p>
//                     </div>
//                     <div className="card-content p-30">
//                       <div className="form-contact">
//                         <div className="row">
//                           <div className="col-lg-12">
//                             <div className="form-group">
//                               <label className="text-14">Vị trí công việc *</label>
//                               <input
//                                 className="form-control"
//                                 placeholder="VD: Frontend Developer, Marketing Manager..."
//                                 value={jobPosition}
//                                 onChange={(e) => setJobPosition(e.target.value)}
//                               />
//                             </div>
//                           </div>

//                           <div className="col-lg-12">
//                             <div className="form-group">
//                               <label className="text-14">Độ khó</label>
//                               <select 
//                                 className="form-control"
//                                 value={difficultyLevel}
//                                 onChange={(e) => setDifficultyLevel(e.target.value)}
//                               >
//                                 <option value="easy">Dễ - Phù hợp cho người mới</option>
//                                 <option value="medium">Trung bình - Phù hợp cho người có kinh nghiệm</option>
//                                 <option value="hard">Khó - Phù hợp cho vị trí senior</option>
//                               </select>
//                             </div>
//                           </div>

//                           <div className="col-lg-12">
//                             <div className="form-group">
//                               <button 
//                                 onClick={handleStartInterview} 
//                                 disabled={isLoading}
//                                 className="btn btn-default btn-brand btn-full"
//                               >
//                                 {isLoading ? "Đang tạo câu hỏi..." : "Bắt đầu phỏng vấn"}
//                                 <Play className="w-4 h-4 ml-10" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {step === "interview" && currentQuestion && (
//                   <div className="card-shadow border-radius-15">
//                     <div className="card-heading p-30 border-bottom">
//                       <div className="d-flex justify-content-between align-items-center mb-10">
//                         <span className="btn-tag bg-brand-2 color-white">
//                           Câu {currentQuestionIndex + 1}/{questions.length}
//                         </span>
//                         <span className="btn-tag bg-15 color-brand-1">
//                           {currentQuestion.category}
//                         </span>
//                       </div>
//                       <h5 className="text-18">{currentQuestion.question}</h5>
//                       <div className="d-flex align-items-center mt-10">
//                         <AlertCircle className="w-4 h-4 mr-10 text-warning" />
//                         <span className="text-sm color-text-mutted">Gợi ý: {currentQuestion.tips}</span>
//                       </div>
//                     </div>
//                     <div className="card-content p-30">
//                       <div className="form-group">
//                         <label className="text-14">Câu trả lời của bạn</label>
//                         <textarea
//                           className="form-control"
//                           rows={8}
//                           placeholder="Nhập câu trả lời của bạn..."
//                           value={currentAnswer}
//                           onChange={(e) => setCurrentAnswer(e.target.value)}
//                         />
//                       </div>

//                       <div className="row mt-20">
//                         <div className={currentQuestionIndex > 0 ? "col-8" : "col-12"}>
//                           <button 
//                             onClick={handleSubmitAnswer} 
//                             disabled={isLoading}
//                             className="btn btn-default btn-brand btn-full"
//                           >
//                             {isLoading
//                               ? "Đang đánh giá..."
//                               : currentQuestionIndex < questions.length - 1
//                                 ? "Câu tiếp theo"
//                                 : "Hoàn thành"}
//                           </button>
//                         </div>
//                         {currentQuestionIndex > 0 && (
//                           <div className="col-4">
//                             <button 
//                               className="btn btn-border btn-full"
//                               onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
//                             >
//                               Quay lại
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {step === "results" && (
//                   <div className="card-shadow border-radius-15">
//                     <div className="card-heading p-30 border-bottom">
//                       <div className="d-flex align-items-center">
//                         <CheckCircle className="w-6 h-6 text-green mr-15" />
//                         <div>
//                           <h5 className="text-18">Hoàn thành buổi phỏng vấn!</h5>
//                           <p className="text-sm color-text-mutted mt-5">
//                             Điểm trung bình: <strong>{averageScore.toFixed(1)}/100</strong>
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="card-content p-30">
//                       <div className="box-interview-results">
//                         {questions.map((question, index) => {
//                           const evaluation = evaluationsData[question.id]
//                           return (
//                             <div key={question.id} className="item-result border-radius-10 p-20 mb-15 bg-9">
//                               <div className="d-flex justify-content-between align-items-start mb-15">
//                                 <h6 className="text-16 mb-0">
//                                   Câu {index + 1}: {question.question}
//                                 </h6>
//                                 {evaluation && (
//                                   <span className="btn-tag bg-brand-2 color-white">
//                                     {evaluation.score}/100
//                                   </span>
//                                 )}
//                               </div>

//                               <div className="text-sm">
//                                 <div className="mb-10">
//                                   <strong className="color-text-mutted">Câu trả lời: </strong>
//                                   <p className="mt-5 color-text-paragraph">{answers[question.id]}</p>
//                                 </div>

//                                 {evaluation && (
//                                   <>
//                                     <div className="mb-10">
//                                       <strong className="color-green">Điểm mạnh:</strong>
//                                       <ul className="list-checked mt-5">
//                                         {evaluation.strengths.map((s: string, i: number) => (
//                                           <li key={i} className="text-sm color-text-paragraph">
//                                             <CheckCircle className="w-4 h-4 text-green mr-5" />
//                                             {s}
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     </div>

//                                     {evaluation.weaknesses.length > 0 && (
//                                       <div className="mb-10">
//                                         <strong className="color-orange">Cần cải thiện:</strong>
//                                         <ul className="list-checked mt-5">
//                                           {evaluation.weaknesses.map((w: string, i: number) => (
//                                             <li key={i} className="text-sm color-text-paragraph">
//                                               <AlertCircle className="w-4 h-4 text-orange mr-5" />
//                                               {w}
//                                             </li>
//                                           ))}
//                                         </ul>
//                                       </div>
//                                     )}

//                                     <div className="mb-10">
//                                       <strong className="color-brand-2">Gợi ý:</strong>
//                                       <ul className="list-checked mt-5">
//                                         {evaluation.suggestions.map((s: string, i: number) => (
//                                           <li key={i} className="text-sm color-text-paragraph">
//                                             <Play className="w-4 h-4 text-brand-2 mr-5" />
//                                             {s}
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     </div>

//                                     <div className="bg-15 p-15 border-radius-10 mt-15">
//                                       <strong className="color-brand-1">Phản hồi tổng quan:</strong>
//                                       <p className="text-sm color-text-paragraph mt-5 mb-0">
//                                         {evaluation.feedback}
//                                       </p>
//                                     </div>
//                                   </>
//                                 )}
//                               </div>
//                             </div>
//                           )
//                         })}
//                       </div>

//                       <div className="row mt-20">
//                         <div className="col-6">
//                           <button
//                             onClick={() => {
//                               setStep("setup")
//                               setQuestions([])
//                               setAnswers({})
//                               setEvaluationsData({})
//                               setCurrentQuestionIndex(0)
//                             }}
//                             className="btn btn-default btn-brand btn-full"
//                           >
//                             Bắt đầu buổi phỏng vấn mới
//                           </button>
//                         </div>
//                         <div className="col-6">
//                           <Link href="/applicant/dashboard" className="btn btn-border btn-full">
//                             <ArrowLeft className="w-4 h-4 mr-10" />
//                             Quay lại Dashboard
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { Play, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import styles from "./Interview.module.css"

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "interview" | "results">("setup")
  const [jobPosition, setJobPosition] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState("medium")
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [evaluationsData, setEvaluationsData] = useState<Record<string, any>>({})

  const handleStartInterview = async () => {
    if (!jobPosition) {
      alert("Vui lòng nhập vị trí công việc")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition,
          difficultyLevel,
          numberOfQuestions: 5,
        }),
      })

      const result = await response.json()
      if (result.data?.questions) {
        setQuestions(result.data.questions)
        setStep("interview")
        setCurrentQuestionIndex(0)
      }
    } catch (error) {
      alert("Không thể tạo câu hỏi phỏng vấn")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      alert("Vui lòng nhập câu trả lời")
      return
    }

    const currentQuestion = questions[currentQuestionIndex]
    const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer }
    setAnswers(newAnswers)

    // Evaluate answer
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: currentAnswer,
        }),
      })

      const result = await response.json()
      if (result.data) {
        setEvaluationsData({ ...evaluationsData, [currentQuestion.id]: result.data })
      }
    } catch (error) {
      console.error("Evaluation error:", error)
    } finally {
      setIsLoading(false)
    }

    setCurrentAnswer("")

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setStep("results")
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const averageScore =
    Object.values(evaluationsData).reduce((sum: number, evalData: any) => sum + (evalData.score || 0), 0) /
    Object.keys(evaluationsData).length

  return (
    <div className={styles.sectionBox}>
      <div className={styles.container}>
        <div className="breadcrumbs">
          <ul>
            <li><Link href="/applicant/dashboard" className={styles.homeIcon}>Dashboard</Link></li>
            <li><span>Mô Phỏng Phỏng Vấn AI</span></li>
          </ul>
        </div>

        <div className={styles.content}>
          {step === "setup" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Thiết lập buổi phỏng vấn</h5>
                <p className={styles.cardSubtitle}>Chọn vị trí và độ khó để bắt đầu</p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Vị trí công việc *</label>
                  <input
                    className={styles.formControl}
                    placeholder="VD: Frontend Developer, Marketing Manager..."
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Độ khó</label>
                  <select 
                    className={styles.formControl}
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value)}
                  >
                    <option value="easy">Dễ - Phù hợp cho người mới</option>
                    <option value="medium">Trung bình - Phù hợp cho người có kinh nghiệm</option>
                    <option value="hard">Khó - Phù hợp cho vị trí senior</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <button 
                    onClick={handleStartInterview} 
                    disabled={isLoading}
                    className={`${styles.btn} ${styles.btnFull} ${styles.btnDefault} ${isLoading ? styles.loading : ''}`}
                  >
                    {isLoading ? "Đang tạo câu hỏi..." : "Bắt đầu phỏng vấn"}
                    <Play className="w-4 h-4 ml-10" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "interview" && currentQuestion && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.interviewProgress}>
                  <span className={`${styles.tag} ${styles.tagPrimary}`}>
                    Câu {currentQuestionIndex + 1}/{questions.length}
                  </span>
                  <span className={`${styles.tag} ${styles.tagOutline}`}>
                    {currentQuestion.category}
                  </span>
                </div>
                <div className={styles.questionText}>{currentQuestion.question}</div>
                <div className={styles.questionTips}>
                  <AlertCircle className="w-4 h-4" />
                  <span>Gợi ý: {currentQuestion.tips}</span>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Câu trả lời của bạn</label>
                  <textarea
                    className={styles.formControl}
                    rows={8}
                    placeholder="Nhập câu trả lời của bạn..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                  />
                </div>

                <div className={styles.buttonGroup}>
                  {currentQuestionIndex > 0 && (
                    <button 
                      className={`${styles.btn} ${styles.btnBorder}`}
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    >
                      Quay lại
                    </button>
                  )}
                  <button 
                    onClick={handleSubmitAnswer} 
                    disabled={isLoading}
                    className={`${styles.btn} ${styles.btnDefault} ${styles.btnFull} ${isLoading ? styles.loading : ''}`}
                  >
                    {isLoading
                      ? "Đang đánh giá..."
                      : currentQuestionIndex < questions.length - 1
                        ? "Câu tiếp theo"
                        : "Hoàn thành"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "results" && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.successHeader}>
                  <CheckCircle className={`${styles.successCheck} w-6 h-6`} />
                  <div>
                    <h5 className={styles.cardTitle}>Hoàn thành buổi phỏng vấn!</h5>
                    <p className={styles.cardSubtitle}>
                      Điểm trung bình: <strong>{averageScore.toFixed(1)}/100</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.resultsContainer}>
                  {questions.map((question, index) => {
                    const evaluation = evaluationsData[question.id]
                    return (
                      <div key={question.id} className={styles.resultItem}>
                        <div className={styles.resultHeader}>
                          <h6 className={styles.questionText}>
                            Câu {index + 1}: {question.question}
                          </h6>
                          {evaluation && (
                            <span className={`${styles.tag} ${styles.tagPrimary}`}>
                              {evaluation.score}/100
                            </span>
                          )}
                        </div>

                        <div className={styles.answerSection}>
                          <div className={styles.answerLabel}>Câu trả lời:</div>
                          <p className={styles.answerText}>{answers[question.id]}</p>
                        </div>

                        {evaluation && (
                          <>
                            <div className={styles.feedbackSection}>
                              <div className={`${styles.feedbackTitle} ${styles.feedbackTitleSuccess}`}>
                                <CheckCircle className="w-4 h-4" />
                                Điểm mạnh
                              </div>
                              <ul className={styles.feedbackList}>
                                {evaluation.strengths.map((s: string, i: number) => (
                                  <li key={i} className={styles.feedbackItem}>
                                    <CheckCircle className="w-4 h-4 text-green" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {evaluation.weaknesses.length > 0 && (
                              <div className={styles.feedbackSection}>
                                <div className={`${styles.feedbackTitle} ${styles.feedbackTitleWarning}`}>
                                  <AlertCircle className="w-4 h-4" />
                                  Cần cải thiện
                                </div>
                                <ul className={styles.feedbackList}>
                                  {evaluation.weaknesses.map((w: string, i: number) => (
                                    <li key={i} className={styles.feedbackItem}>
                                      <AlertCircle className="w-4 h-4 text-orange" />
                                      {w}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className={styles.feedbackSection}>
                              <div className={`${styles.feedbackTitle} ${styles.feedbackTitleInfo}`}>
                                <Play className="w-4 h-4" />
                                Gợi ý
                              </div>
                              <ul className={styles.feedbackList}>
                                {evaluation.suggestions.map((s: string, i: number) => (
                                  <li key={i} className={styles.feedbackItem}>
                                    <Play className="w-4 h-4 text-brand-2" />
                                    {s}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className={styles.overallFeedback}>
                              <div className={styles.overallFeedbackTitle}>Phản hồi tổng quan</div>
                              <p className={styles.overallFeedbackText}>{evaluation.feedback}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => {
                      setStep("setup")
                      setQuestions([])
                      setAnswers({})
                      setEvaluationsData({})
                      setCurrentQuestionIndex(0)
                    }}
                    className={`${styles.btn} ${styles.btnDefault}`}
                  >
                    Bắt đầu buổi phỏng vấn mới
                  </button>
                  <Link href="/applicant/dashboard" className={`${styles.btn} ${styles.btnBorder}`}>
                    <ArrowLeft className="w-4 h-4 mr-10" />
                    Quay lại Dashboard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}