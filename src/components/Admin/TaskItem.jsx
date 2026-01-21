import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import './TaskItem.css';

export default function TaskItem({ task, onToggle, onDelete }) {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, -50, 0, 50, 100], [0, 1, 1, 1, 0]);
    const background = useTransform(x, [-100, 0, 100], ["#ef4444", "#ffffff", "#ef4444"]);

    const handleDragEnd = (event, info) => {
        if (Math.abs(info.offset.x) > 100) {
            onDelete(task.id);
        }
    };

    return (
        <motion.div style={{ x, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="task-item-wrapper"
        >
            <div className={`task-card ${task.status === 'Finish' ? 'completed' : ''}`}>
                <div
                    className={`checkbox ${task.status === 'Finish' ? 'checked' : ''}`}
                    onClick={() => onToggle(task.id)}
                >
                    {task.status === 'Finish' && <Check size={16} color="white" />}
                </div>

                <span className="task-title">{task.title}</span>

                <span className={`status-badge ${task.status === 'Finish' ? 'finish' : 'progress'}`}>
                    {task.status === 'Finish' ? 'Finish' : 'In Progress'}
                </span>
            </div>

            {/* Visual cue for deleting (behind the card conceptually, but simplified here) */}
            <div className="swipe-indicator left">
                <Trash2 color="#ef4444" />
            </div>
        </motion.div>
    );
}
