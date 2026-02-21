import openai from "../services/aiService.js";


const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message },
            ],

        });

        const aiReply = completion.choices[0].message.content;


        res.status(200).json({
            reply: aiReply
        });

    } catch (error) {
        console.error("Chat Error:", error)
        res.status(500).json({
            error: "Something went wrong"
        });
    }
};

export default chatHandler;