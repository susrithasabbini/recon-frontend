import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import clsx from "clsx";
import { title, subtitle } from "@/components/primitives";

const steps = [
  {
    title: "1. Account Creation",
    description:
      "Set up your accounts (e.g., Sales Revenue, PSP Holding, Bank Account).",
    href: "/account-creation",
  },
  {
    title: "2. Recon Rules Mapping",
    description:
      "Define how data flows and set up expectations between accounts.",
    href: "/rules-mapping",
  },
  {
    title: "3. File Upload",
    description: "Upload OMS, PSP, and Bank data for reconciliation.",
    href: "/file-upload",
  },
];

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 640 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl mx-auto mb-6"
    >
      <defs>
        <linearGradient id="node-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#6366F1" />
          <stop offset="1" stop-color="#38BDF8" />
        </linearGradient>

        <linearGradient id="arrow-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop stop-color="#38BDF8" />
          <stop offset="1" stop-color="#6366F1" />
        </linearGradient>

        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="6"
            flood-color="#6366F1"
            flood-opacity="0.08"
          />
        </filter>

        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 8,4 0,8" fill="#38BDF8" />
        </marker>
      </defs>

      <ellipse
        cx="320"
        cy="100"
        rx="310"
        ry="90"
        fill="url(#node-gradient)"
        fill-opacity="0.10"
        filter="url(#shadow)"
      />

      <g filter="url(#shadow)">
        <circle
          cx="140"
          cy="110"
          r="38"
          fill="#fff"
          stroke="url(#node-gradient)"
          stroke-width="3"
        />
        <circle
          cx="320"
          cy="90"
          r="38"
          fill="#fff"
          stroke="url(#node-gradient)"
          stroke-width="3"
        />
        <circle
          cx="500"
          cy="110"
          r="38"
          fill="#fff"
          stroke="url(#node-gradient)"
          stroke-width="3"
        />
      </g>

      <text
        x="140"
        y="116"
        text-anchor="middle"
        font-size="18"
        font-weight="bold"
        fill="#6366F1"
      >
        OMS
      </text>
      <text
        x="320"
        y="96"
        text-anchor="middle"
        font-size="18"
        font-weight="bold"
        fill="#38BDF8"
      >
        PSP
      </text>
      <text
        x="500"
        y="116"
        text-anchor="middle"
        font-size="18"
        font-weight="bold"
        fill="#6366F1"
      >
        Bank
      </text>

      <path
        d="M178 110 Q230 60 282 90"
        stroke="url(#arrow-gradient)"
        stroke-width="4"
        fill="none"
        marker-end="url(#arrowhead)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="120"
          to="0"
          dur="1s"
          begin="0.2s"
          fill="freeze"
        />
      </path>

      <path
        d="M358 90 Q410 90 462 110"
        stroke="url(#arrow-gradient)"
        stroke-width="4"
        fill="none"
        marker-end="url(#arrowhead)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="120"
          to="0"
          dur="1s"
          begin="0.6s"
          fill="freeze"
        />
      </path>

      <path
        d="M490 110 l12 12 l20 -24"
        stroke="#22C55E"
        stroke-width="4"
        fill="none"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="50"
          to="0"
          dur="1s"
          begin="1.2s"
          fill="freeze"
        />
      </path>
    </svg>
  );
}

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-16 transition-colors duration-300">
        {/* Hero Illustration */}
        <HeroIllustration />
        {/* Animated Intro Section */}
        <motion.div
          className="max-w-2xl text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className={clsx(title({ size: "md", color: "blue" }))}>
            Accounting & Reconciliation Tool
          </h1>
          <p className={subtitle()}>
            Gain real-time financial clarity and automate reconciliation with a
            smart ledger system.
          </p>
        </motion.div>
        {/* Animated Divider */}
        <motion.div
          className="w-full max-w-2xl h-2 bg-gradient-to-r from-blue-200/60 via-blue-400/30 to-blue-200/60 dark:from-blue-900/40 dark:via-blue-700/30 dark:to-blue-900/40 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          style={{ transformOrigin: "center" }}
        />
        {/* Step Navigation with Animation */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 4px 24px 0 rgba(60, 80, 180, 0.10)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <div className="h-full flex flex-col justify-between p-6 rounded-xl border border-blue-100 dark:border-neutral-800 shadow bg-white dark:bg-neutral-900 hover:border-blue-400 dark:hover:border-blue-300 transition-colors duration-300">
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">
                    {step.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {step.description}
                  </p>
                </div>
                <Button
                  as={Link}
                  color="primary"
                  href={step.href}
                  className="w-full mt-auto"
                >
                  Go to {step.title}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
