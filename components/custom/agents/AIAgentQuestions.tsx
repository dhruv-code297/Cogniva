"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClarificationQuestion } from "./CreateAgent"

type Props = {
    questionList: ClarificationQuestion[]
     onComplete:any
}

export default function AIAgentQuestions({
    questionList,
    onComplete

}: Props) {

    const [currentIndex, setCurrentIndex] = useState(0)

    const [answers, setAnswers] = useState<Record<string, string>>({})

    const [customMode, setCustomMode] = useState<Record<string, boolean>>({})

    const currentQuestion = questionList[currentIndex]

    const currentAnswer = answers[currentQuestion.id] || ""

    const handleAnswer = (value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: value,
        }))
    }

    const handleNext = () => {

        if (!currentAnswer.trim()) return

        if (currentIndex < questionList.length - 1) {

            setCurrentIndex((prev) => prev + 1)

        } else {

         onComplete(answers)

        }
    }

    const handlePrevious = () => {

        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1)
        }
    }

    const handleOptionSelect = (option: string) => {

        setCustomMode((prev) => ({
            ...prev,
            [currentQuestion.id]: false,
        }))

        handleAnswer(option)
    }

    const handleCustomClick = () => {

        setCustomMode((prev) => ({
            ...prev,
            [currentQuestion.id]: true,
        }))

        handleAnswer("")
    }

    const progress =
        ((currentIndex + 1) / questionList.length) * 100

    const isLastQuestion =
        currentIndex === questionList.length - 1

    if (!currentQuestion) {
        return null
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">

            {/* Header */}

            <div className="mb-8">

                <div className="flex items-center justify-between mb-3">

                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Configure your agent
                        </p>

                        <h2 className="text-xl font-semibold text-slate-900">
                            A few questions first
                        </h2>
                    </div>

                    <div className="text-sm text-slate-500">
                        {currentIndex + 1} / {questionList.length}
                    </div>

                </div>

                {/* Progress */}

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                    <div
                        className="h-full bg-violet-600 rounded-full transition-all duration-300"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </div>


            {/* Question */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-7">

                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mb-2">
                        Question {currentIndex + 1}
                    </p>

                    <h3 className="text-xl font-semibold text-slate-900 leading-7">
                        {currentQuestion.question}
                    </h3>

                </div>


                {/* TEXT QUESTION */}

                {currentQuestion.type === "text" && (

                    <div className="space-y-3">

                        <Input
                            value={currentAnswer}
                            onChange={(e) =>
                                handleAnswer(e.target.value)
                            }
                            placeholder={
                                currentQuestion.customPlaceholder ||
                                "Enter your answer"
                            }
                            className="h-12"
                        />

                        <p className="text-xs text-slate-400">
                            Enter your answer in your own words.
                        </p>

                    </div>

                )}


                {/* SINGLE SELECT */}

                {currentQuestion.type === "single_select" && (

                    <div className="space-y-3">

                        {currentQuestion.options?.map((option) => (

                            <button
                                key={option}
                                type="button"
                                onClick={() =>
                                    handleOptionSelect(option)
                                }
                                className={`w-full flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                                    !customMode[currentQuestion.id] &&
                                    currentAnswer === option
                                        ? "border-violet-500 bg-violet-50"
                                        : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                                }`}
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                            !customMode[currentQuestion.id] &&
                                            currentAnswer === option
                                                ? "border-violet-600"
                                                : "border-slate-300"
                                        }`}
                                    >

                                        {!customMode[currentQuestion.id] &&
                                            currentAnswer === option && (

                                                <div className="h-2.5 w-2.5 rounded-full bg-violet-600" />

                                            )}

                                    </div>

                                    <span
                                        className={`text-sm font-medium ${
                                            !customMode[currentQuestion.id] &&
                                            currentAnswer === option
                                                ? "text-violet-700"
                                                : "text-slate-700"
                                        }`}
                                    >
                                        {option}
                                    </span>

                                </div>

                                {!customMode[currentQuestion.id] &&
                                    currentAnswer === option && (

                                        <Check className="h-5 w-5 text-violet-600" />

                                    )}

                            </button>

                        ))}


                        {/* CUSTOM OPTION */}

                        {currentQuestion.allowCustom && (

                            <div className="pt-2">

                                <button
                                    type="button"
                                    onClick={handleCustomClick}
                                    className={`w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                                        customMode[currentQuestion.id]
                                            ? "border-violet-500 bg-violet-50"
                                            : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
                                    }`}
                                >

                                    <div
                                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                                            customMode[currentQuestion.id]
                                                ? "border-violet-600"
                                                : "border-slate-300"
                                        }`}
                                    >

                                        {customMode[currentQuestion.id] && (

                                            <div className="h-2.5 w-2.5 rounded-full bg-violet-600" />

                                        )}

                                    </div>

                                    <span
                                        className={`text-sm font-medium ${
                                            customMode[currentQuestion.id]
                                                ? "text-violet-700"
                                                : "text-slate-700"
                                        }`}
                                    >
                                        Other
                                    </span>

                                </button>


                                {customMode[currentQuestion.id] && (

                                    <div className="mt-3">

                                        <Input
                                            autoFocus
                                            value={currentAnswer}
                                            onChange={(e) =>
                                                handleAnswer(e.target.value)
                                            }
                                            placeholder={
                                                currentQuestion.customPlaceholder ||
                                                "Enter your answer"
                                            }
                                            className="h-12"
                                        />

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                )}


                {/* Navigation */}

                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className="gap-2"
                    >

                        <ArrowLeft className="h-4 w-4" />

                        Previous

                    </Button>


                    <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!currentAnswer.trim()}
                        className="gap-2"
                    >

                        {isLastQuestion
                            ? "Create Agent"
                            : "Next"}

                        {isLastQuestion ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <ArrowRight className="h-4 w-4" />
                        )}

                    </Button>

                </div>

            </div>


            {/* Bottom Progress Text */}

            <div className="flex items-center justify-center gap-2 mt-5">

                {questionList.map((question, index) => (

                    <div
                        key={question.id}
                        className={`h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? "w-7 bg-violet-600"
                                : index < currentIndex
                                    ? "w-2 bg-violet-400"
                                    : "w-2 bg-slate-200"
                        }`}
                    />

                ))}

            </div>

        </div>
    )
}