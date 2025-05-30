import React from 'react'
import { motion } from "framer-motion";

interface SpinnerProps {
  fullscreen?: boolean;
}

const Spinner = ({ fullscreen = false }: SpinnerProps) => {
  return (
    <div className={`flex justify-center items-center ${fullscreen ? 'fixed inset-0 z-50 bg-white/50 dark:bg-black/50' : 'min-h-[400px]'}`}>
        <motion.div
          role="status"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white rounded-full"
        />
      </div>
  )
}

export default Spinner