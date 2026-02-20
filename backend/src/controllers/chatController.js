const chatHandler = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        res.status(200).json({
            success: true,
            userMessage: message,
            reply: `You said: ${message}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export default chatHandler;