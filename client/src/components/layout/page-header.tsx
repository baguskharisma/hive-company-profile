import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8 pb-12 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{title}</h1>
      <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </motion.div>
  );
}