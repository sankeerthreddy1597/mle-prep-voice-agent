import { NextResponse } from 'next/server';
import {generateText} from 'ai';
import {google} from '@ai-sdk/google';

export async function GET() {
    return NextResponse.json({success: true, data: "SUCCESS"}, {status: 200});
}

export async function POST(request: Request) {

    const {topic} = await request.json();

    try{
        const {text: questions} = await generateText({
            model: google('gemini-2.0-flash-001'),
            prompt: `Prepare questions for a US MLE Interview.
            The questions should cover basic questions that are asked during a US MLE exam for medicine.
            The questions should be for the topic: ${topic}.
            The number of questions required is 5.
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters that might break the voice assistant.
            Return the questions formatted like this: 
            ["Question 1", "Question 2", "Question 3"]
    
            Thank you!
            `
        })

        //TODO handle error sceanrio
        return NextResponse.json({success: true, data: JSON.parse(questions)}, {status: 200});

    } catch(e) {
        console.error(e);

        return NextResponse.json({success: false, error: e}, {status: 500})
    }
}