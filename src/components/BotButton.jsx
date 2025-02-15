import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

const BotButton = () => {
    return (
        <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <motion.div className="relative group">
                <motion.button
                    className="bg-purple-500 hover:bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Bot className="w-8 h-8 text-white" />
                </motion.button>
                <motion.span
                    className="absolute -top-5 right-4 -translate-x-1/2 bg-white/80 text-violet-500 border font-semibold text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                    Study Buddy
                </motion.span>
            </motion.div>

        </motion.div>
    );
};

export default BotButton;