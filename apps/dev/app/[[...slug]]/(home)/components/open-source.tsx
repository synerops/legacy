import { Github, Star, GitFork } from "lucide-react";
import { Button } from "@syner/ui/components/button";

const repos = [
  {
    name: "synerops/syner",
    description:
      "Syner OS monorepo - the Cloud for Agents implementation",
    href: "https://github.com/synerops/syner",
  },
  {
    name: "synerops/protocol",
    description:
      "OS Protocol specification - contracts for agentic systems",
    href: "https://github.com/synerops/protocol",
  },
];

export const OpenSource = () => (
  <section className="bg-muted/50 px-4 py-16 sm:px-16 sm:py-24">
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center font-semibold text-3xl sm:text-4xl">
        Open Source
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        Syner OS and the OS Protocol are fully open source. Contribute, explore,
        or build on top.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-lg border bg-card p-6 shadow-sm transition-colors hover:bg-accent"
          >
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6" />
              <span className="font-mono font-medium">{repo.name}</span>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              {repo.description}
            </p>
          </a>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <a
            href="https://github.com/synerops"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="mr-2 h-4 w-4" />
            View all repositories
          </a>
        </Button>
      </div>
    </div>
  </section>
);
