import { FileText, Layers, Puzzle } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "No Programming Required",
    description:
      "Define agents with .md files. SKILL.md describes capabilities, AGENT.md defines behavior. The SDK handles the rest.",
  },
  {
    icon: Layers,
    title: "Protocol-First",
    description:
      "OS Protocol defines contracts for agentic systems, like HTTP did for the web. Build interoperable agents that work together.",
  },
  {
    icon: Puzzle,
    title: "Extensible",
    description:
      "Vendors create extensions that implement protocol contracts. @syner/vercel provides sandbox execution out of the box.",
  },
];

export const WhatIsSyner = () => (
  <section className="px-4 py-16 sm:px-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center font-semibold text-3xl sm:text-4xl">
        What is Syner OS?
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        A Cloud for Agents that lets you build AI agents using simple
        markdown files.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <feature.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-semibold text-lg">{feature.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
