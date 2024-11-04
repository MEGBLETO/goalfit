import OpenAI from "openai";
import { encode } from "gpt-3-encoder";
import logger from './logger'


const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });




async function countTokens(messages: any[]): Promise<number> {
  logger.info('Counting tokens for the messages.');
  let totalTokens = 0;
  for (const message of messages) {
    totalTokens += encode(message.content).length;
  }
  logger.info(`Total tokens counted: ${totalTokens}`);
  return totalTokens;
}


export async function query(
  messages: any[],
  model = "gpt-4-turbo",
  maxTokens = 4096
) {
  try {
    const inputTokens = await countTokens(messages);
    const maxContextLength = 8192;

    if (inputTokens + maxTokens > maxContextLength) {
      maxTokens = maxContextLength - inputTokens;
      logger.warn(
        `Adjusted maxTokens to ${maxTokens} to fit within the model's context length.`
      );
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: 1,
    });

    if (
      response &&
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      console.log("Response received from OpenAI API.");
      logger.info("Received response from OpenAI API.");
      return response.choices[0].message.content.trim();
    } else {
      console.log("Invalid response structure:", response);
      logger.error("Invalid response structure:", response);
      return null;
    }
  } catch (error) {
    console.log("Error with OpenAI API:", error);
    logger.error("Error with OpenAI API:", error);
    throw error;
  }
}