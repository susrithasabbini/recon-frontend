import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import clsx from "clsx";
import { title, subtitle } from "@/components/primitives";

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
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>

        <linearGradient id="arrow-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#6366F1" />
        </linearGradient>

        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="6"
            floodColor="#6366F1"
            floodOpacity="0.08"
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
        fillOpacity="0.10"
        filter="url(#shadow)"
      />

      <g filter="url(#shadow)">
        <circle
          cx="140"
          cy="110"
          r="38"
          fill="#fff"
          stroke="url(#node-gradient)"
          strokeWidth="3"
        />
        <circle
          cx="320"
          cy="90"
          r="38"
          fill="#fff"
          stroke="url(#node-gradient)"
          strokeWidth="3"
        />
        <circle
          cx="500"
          cy="110"
          r="38"
          fill="#fff"
          stroke="url(#node-gradient)"
          strokeWidth="3"
        />
      </g>

      <text
        x="140"
        y="116"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#6366F1"
      >
        OMS
      </text>
      <text
        x="320"
        y="96"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#38BDF8"
      >
        PSP
      </text>
      <text
        x="500"
        y="116"
        textAnchor="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#6366F1"
      >
        Bank
      </text>

      <path
        d="M178 110 Q230 60 282 90"
        stroke="url(#arrow-gradient)"
        strokeWidth="4"
        fill="none"
        markerEnd="url(#arrowhead)"
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
        strokeWidth="4"
        fill="none"
        markerEnd="url(#arrowhead)"
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
        strokeWidth="4"
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
      <section className="flex flex-col items-center justify-center gap-16 transition-colors duration-300 h-full">
        {/* Hero Illustration */}
        <HeroIllustration />
        {/* Animated Intro Section */}
        <motion.div
          className="max-w-2xl text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className={clsx(title({ size: "md", color: "primary" }))}>
            Accounting & Reconciliation Tool
          </h1>
          <p className={subtitle()}>
            Our streamlined process guides you through setting up accounts,
            mapping rules, and uploading files for efficient reconciliation.
            Click below to begin.
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
        {/* Get Started Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            as={Link}
            href="/process-flow"
            color="primary"
            size="lg"
            className="px-8 py-4 text-lg font-semibold"
          >
            Get Started
          </Button>
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
