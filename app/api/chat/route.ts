import { chatSession } from "@/configs/ai-model"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    const result = await chatSession.sendMessage(prompt, {})

    return NextResponse.json(result.response.text())
  } catch (e) {
    return NextResponse.json({ error: e })
  }
}
