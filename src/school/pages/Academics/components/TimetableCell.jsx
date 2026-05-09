import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';

const TimetableCell = ({ period, day, assignment, onAdd, onEdit }) => {
    return (
        <motion.td
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => assignment ? onEdit(period, day, assignment) : onAdd(period, day)}
            className="p-2 border border-gray-100 text-center cursor-pointer hover:bg-blue-50/20 transition-all group relative"
        >
            <AnimatePresence mode="wait">
                {assignment ? (
                    <motion.div
                        key="assigned"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center justify-center py-4 px-3 rounded-xl bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] group-hover:shadow-[0_8px_25px_rgba(61,94,225,0.12)] group-hover:border-blue-300 group-hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full"></div>
                        <div className="text-[14px] font-bold text-[#1f2937] leading-tight mb-1.5 line-clamp-2 relative z-10">
                            {assignment.subject}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-blue-600 font-semibold tracking-tight uppercase opacity-90 relative z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            {assignment.teacher}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center py-6 min-h-[85px]"
                    >
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-blue-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300 shadow-sm group-hover:shadow-md"
                        >
                            <IconPlus size={18} stroke={2.5} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.td>
    );
};

export default TimetableCell;
