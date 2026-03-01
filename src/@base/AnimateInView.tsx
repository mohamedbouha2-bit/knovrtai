import { motion, Variants } from "framer-motion";
import React, { ReactNode } from "react";

// تعريف أنواع الأنميشن المتاحة
type AnimationType = "rise" | "fade" | "slideLeft";

interface AnimateInViewProps {
    type?: AnimationType;
    children?: ReactNode;
    delay?: number; // إضافة إمكانية تأخير الأنميشن
}

const AnimateInView: React.FC<AnimateInViewProps> = ({ 
    type = 'rise', 
    children, 
    delay = 0 
}) => {
    
    // تعريف الـ Variants بشكل مفصل واحترافي
    const variants: Variants = {
        rise: { 
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 }
        },
        fade: { 
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        slideLeft: {
            initial: { opacity: 0, x: -50 },
            animate: { opacity: 1, x: 0 }
        }
    };

    return (
        <motion.div
            initial={variants[type].initial}
            whileInView={variants[type].animate}
            viewport={{ once: true, margin: "-50px" }} // margin يضمن أن الأنميشن يبدأ قبل وصول العنصر بقليل
            transition={{ 
                duration: 0.8, 
                delay: delay,
                ease: "easeOut" 
            }}
        >
            {children}
        </motion.div>
    );
};

export default AnimateInView;