import { motion } from "framer-motion";

{
  /* How It Works - Redesigned Stepper */
}
<motion.div
  className="max-w-4xl mt-8 w-full flex flex-col items-center"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7, delay: 0.2 }}
>
  <h3 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-100">
    How It Works
  </h3>
  <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full">
    {/* Step 1 */}
    <div className="flex flex-col items-center flex-1">
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-2">
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <rect x="6" y="10" width="20" height="12" rx="3" fill="#6366F1" />
          <rect x="10" y="14" width="12" height="4" rx="2" fill="#fff" />
        </svg>
      </div>
      <div className="font-semibold text-blue-800 dark:text-blue-200">
        Data Intake
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
        Upload files from OMS, PSP, and Bank.
      </div>
    </div>
    {/* Arrow */}
    <div className="hidden md:block text-3xl text-blue-300 dark:text-blue-700">
      →
    </div>
    {/* Step 2 */}
    <div className="flex flex-col items-center flex-1">
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-2">
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="#38BDF8" />
          <path
            d="M12 16h8M16 12v8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="font-semibold text-blue-800 dark:text-blue-200">
        Rules Engine
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
        System applies mapping rules and creates expectations.
      </div>
    </div>
    <div className="hidden md:block text-3xl text-blue-300 dark:text-blue-700">
      →
    </div>
    {/* Step 3 */}
    <div className="flex flex-col items-center flex-1">
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-2">
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <rect x="8" y="8" width="16" height="16" rx="4" fill="#6366F1" />
          <path
            d="M12 16h8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="font-semibold text-blue-800 dark:text-blue-200">
        Smart Ledger
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
        Track all posted and expected entries in real time.
      </div>
    </div>
    <div className="hidden md:block text-3xl text-blue-300 dark:text-blue-700">
      →
    </div>
    {/* Step 4 */}
    <div className="flex flex-col items-center flex-1">
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-2">
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="#22C55E" />
          <path
            d="M12 17l3 3 5-5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="font-semibold text-blue-800 dark:text-blue-200">
        Exception Management
      </div>
      <div className="text-gray-600 dark:text-gray-300 text-sm text-center">
        Mismatches or issues are flagged for review.
      </div>
    </div>
  </div>
</motion.div>;
