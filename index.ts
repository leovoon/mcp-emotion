import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";


type EmotionData = {
    emotion: string;
    interpretation: string;
}

type TextContent = {
    type: "text";
    text: string;
}

const emotionKnowledgeBase: Record<string, EmotionData> = {
    "angry": {
        "emotion": "Anger",
        "interpretation": "Anger is energy and it's showing you that something is misaligned with your values. Use it as a motivator for change and not something that's just going to consume you."
    },
    "anxious": {
        "emotion": "Anxiety",
        "interpretation": "Your anxiety is trying to get you to prepare and to focus on what you can control and to release what you can't."
    },
    "tired": {
        "emotion": "Exhaustion",
        "interpretation": "Your exhaustion is a warning sign that is telling you to prioritize your rest before your body forces you to."
    },
    "guilty": {
        "emotion": "Guilt",
        "interpretation": "Guilt is a reminder of your values, not your worth. Acknowledge the lesson, make amends if you have to, and then move forward."
    },
    "bored": {
        "emotion": "Boredom",
        "interpretation": "Boredom is creative potential that's wanting to be explored, so challenge yourself to try something new instead of staying stuck."
    },
    "lonely": {
        "emotion": "Loneliness",
        "interpretation": "Loneliness is calling for connection, so reach out to others who deepen your relationship with yourself."
    },
    "scared": {
        "emotion": "Fear",
        "interpretation": "Your fear is pointing out what truly matters to you, so use it to be courageous instead of avoiding things."
    },
    "disappointed": {
        "emotion": "Disappointment",
        "interpretation": "Your disappointment is a telltale sign of unmet expectations. Use that as an adjustment, not a reason to give up."
    },
    "resistant": {
        "emotion": "Resistance",
        "interpretation": "Your resistance is an indication of an outdated pattern, so use this as an opportunity to break the cycle and choose a different response."
    },
    "envious": {
        "emotion": "Envy",
        "interpretation": "Your envy in comparison to other people is showing you what's possible and what you want in life, So use it as inspiration and not self-criticism."
    },
    "overthinking": {
        "emotion": "Overthinking",
        "interpretation": "Your overthinking is your mind searching for safety, so you'll want to regulate yourself and bring yourself back into the present moment."
    },
    "insecure": {
        "emotion": "Insecurity",
        "interpretation": "Your insecurity is a call for self-compassion."
    },
    "doubtful": {
        "emotion": "Doubt",
        "interpretation": "Your doubt is asking for clarity, so try to ask yourself questions and get curious about yourself instead of just assuming the worst."
    },
    "numb": {
        "emotion": "Numbness",
        "interpretation": "Your numbness is an emotional overload. You need to give yourself space and give yourself time to regulate."
    },
    "controlling": {
        "emotion": "Need for Control",
        "interpretation": "Your need for control is a fear of uncertainty. You need to build trust with yourself to be able to understand that you can handle whatever it is that might happen."
    },
    "people pleasing": {
        "emotion": "People Pleasing",
        "interpretation": "Your people pleasing is a form of self-abandonment try honoring and validating your own needs."
    },
    "procrastinating": {
        "emotion": "Procrastination",
        "interpretation": "Your procrastination is self-protection so identify the fear of whatever it is that you're going after and tackle it one little bit at a time."
    },
    "perfectionist": {
        "emotion": "Perfectionism",
        "interpretation": "Your perfectionism is a protective coping mechanism that's not allowing you to be vulnerable you need to allow yourself to be seen and understood not only from other people but with yourself."
    },
    "change": {
        "emotion": "Desire for Change",
        "interpretation": "Your desire for change is proof that you're already doing it so give yourself a little bit more credit."
    }
};

const server = new McpServer({
    transport: new StdioServerTransport(),
    name: "mcp-emotion",
    version: "0.0.1",
});




server.tool(
    "analyzeEmotion",
    "Analyze text for emotions and provide interpretations",
    { text: z.string() },
    async ({ text }): Promise<{ content: TextContent[] }> => {
        const foundEmotions: EmotionData[] = [];

        // Find matching emotions
        Object.entries(emotionKnowledgeBase).forEach(([keyword, emotion]) => {
            if (text.toLowerCase().includes(keyword)) {
                foundEmotions.push(emotion);
            }
        });

        // Generate response
        if (foundEmotions.length === 0) {
            return {
                content: [{
                    type: "text",
                    text: "No specific emotions detected from the provided knowledge base."
                }]
            };
        }

        // Generate responses for each emotion
        const responses = foundEmotions.map(emotionData => {
            const { emotion, interpretation } = emotionData;
            const variations = [
                `It seems you're feeling ${emotion}. ${interpretation}`,
                `I'm picking up on ${emotion}. ${interpretation}`,
                `You might be experiencing ${emotion}. ${interpretation}`,
                `Based on your input, it sounds like ${emotion} is present. ${interpretation}`
            ] as [string, ...string[]];
            const randomIndex = Math.floor(Math.random() * variations.length);
            return variations[randomIndex];
        });

        return {
            content: responses.map(text => ({
                type: "text",
                text
            })) as TextContent[]
        };
    }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);