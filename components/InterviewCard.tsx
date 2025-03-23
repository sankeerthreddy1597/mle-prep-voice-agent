"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot } from "lucide-react";
import { useState, useEffect } from "react";

import axios from "axios";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatusType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export const InterviewCard = () => {
  const [topic, setTopic] = useState("cardiology");

  const [isGeneratingInterview, setIsGeneratingInterview] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatusType>(
    CallStatusType.INACTIVE
  );
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  const onCallStart = () => setCallStatus(CallStatusType.ACTIVE);
  const onCallEnd = () => setCallStatus(CallStatusType.FINISHED);
  const onSpeechStart = () => setIsSpeaking(true);
  const onSpeechEnd = () => setIsSpeaking(false);
  const onError = (error: Error) => console.log(error);

  const onMessage = (message: any) => {
    console.log('message', message);
    if (
      message.type === "transcript" &&
      message.transcriptionType === "final"
    ) {
      const newMessage = {
        role: message.role,
        content: message.transcript,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
  };

  const handleStartInterview = async () => {
    setIsGeneratingInterview(true);

    const geminiResponse = await axios.post(
      "/api/gemini/generate",
      { topic },
      { headers: { "Content-Type": "application/json" } }
    );

    setIsGeneratingInterview(false);

    console.log(geminiResponse);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    let formattedQuestions = "";

    if (geminiResponse.data.data) {
      formattedQuestions = geminiResponse.data.data
        .map((question: string) => `- ${question}`)
        .join("\n");

      await vapi.start(
        {
          transcriber: {
            provider: "deepgram",
            model: "nova-2",
            language: "en-US",
          },
          model: {
            provider: "openai",
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `You are a professional MLE Job Interview Assistant conducting a real time voice interview with a candidate. Your goal is to assess their knowlege, motivation and fit for the residency program 
                  Interview Guidelines: 
                  Follow the structures question flow: 
                  {{questions}}
      
                  Engage naturally & react appropriately: 
                  Listen actively to responses and acknowledge them before moving forward with the next questions.
                  Ask brief follow up questions if a response is vague or requires more information.
                  Keep the conversation flowing smoothly while maintaining control.
                  Be professional, yet warm and welcoming: 
                  
                  Use official yet friendly language.
                  Keep response consice and to the point (like in a real voice interview).
                  Avoid robotic phrasing - sound natural and conversational.
      
                  Answer the candidates questions professionalyy: 
                  If asked about the role, the medical program or expectations, provide a clear answer.
                  If unsure, redirect to HR for more details.
      
                  Conclude the interview properly: 
                  Thanks the candidate for their time. 
                  End the conversation on a polite and positive note.
      
                  - Keep your responses short and simple. Use official language.
                  - This is a voice conversation, so keep your responses short, like a real world comversation.
                  `,
              },
            ],
          },
          voice: {
            provider: "11labs",
            voiceId: "sarah",
            stability: 0.4,
            similarityBoost: 0.8,
            speed: 0.9,
            style: 0.5,
            useSpeakerBoost: true,
          },
          name: "MLE Prep Assistant",
          firstMessage:
            "Hello! Thank you for taking the time to speak with me today. I will be your interviewer. I'm excited to see how you tackle these questions. Shall we get started?",
        },
        {
          variableValues: {
            questions: formattedQuestions,
          },
        }
      );
    }
  };

  const handleStopInterview = () => {
    setCallStatus(CallStatusType.FINISHED);

    console.log(messages);

    vapi.stop();
  };

  useEffect(() => {
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Mock Interview</CardTitle>
          <CardDescription>
            Use AI to practive and ace your MLE interviews
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-6 relative">
          <div className="relative inline-flex">
            {isSpeaking && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
              </span>
            )}
            <Bot className="h-40 w-40 border-2 rounded-lg p-4" />
          </div>
          <p>Practice with Sarah</p>
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-2">
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="endocrinology">Endocrinology</SelectItem>
              <SelectItem value="pathology">Pathology</SelectItem>
              <SelectItem value="pharmacology">Pharmacology</SelectItem>
              <SelectItem value="physiology">Physiology</SelectItem>
              <SelectItem value="anatomy">Anatomy</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={
              callStatus === CallStatusType.ACTIVE ? "destructive" : "secondary"
            }
            onClick={
              callStatus === CallStatusType.ACTIVE
                ? handleStopInterview
                : handleStartInterview
            }
            disabled={
              isGeneratingInterview
            }
          >
            {callStatus === CallStatusType.ACTIVE
              ? "Disconnect"
              : isGeneratingInterview
              ? "Loading..."
              : "Start Interview"}
          </Button>
        </CardFooter>
      </Card>
      {/* <Button onClick={handleStopInterview}>Disc</Button> */}
    </div>
  );
};
