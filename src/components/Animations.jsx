import { motion } from 'framer-motion'

export const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
)

export const FadeInStagger = ({ children, staggerDelay = 0.1 }) => (
  <motion.div
    variants={{
      show: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
)

export const FadeInStaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
)

export const ScaleOnHover = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 17 }}
    className={className}
  >
    {children}
  </motion.div>
)