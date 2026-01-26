"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  GitBranch, 
  Shield, 
  Filter, 
  Users, 
  BarChart3, 
  Bot,
  ChevronRight,
  Github,
  ExternalLink
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Production LOC ownership",
    description: "See exactly who owns the most lines currently in production. Real metrics, not vanity stats."
  },
  {
    icon: Bot,
    title: "Exclude bots & generated code",
    description: "Automatically filter out dependabot, renovate, and auto-generated files from your counts."
  },
  {
    icon: Filter,
    title: "Path + filetype filters",
    description: "Include or exclude specific paths and file types. Count only what matters to your team."
  },
  {
    icon: Users,
    title: "Team insights",
    description: "Understand code ownership distribution across your team. Identify knowledge silos."
  },
  {
    icon: GitBranch,
    title: "Branch-aware counting",
    description: "Track production branches separately. Only merged code counts toward ownership."
  },
  {
    icon: Shield,
    title: "Read-only access",
    description: "We never write to your repos. Read-only GitHub access with no tokens stored."
  }
]

const mockLeaderboard = [
  { rank: 1, name: "alexchen", loc: "45,892", share: "28.4%" },
  { rank: 2, name: "sarahdev", loc: "38,241", share: "23.7%" },
  { rank: 3, name: "mikejohnson", loc: "28,456", share: "17.6%" },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center group-hover:rounded-none transition-all duration-200">
                  <BarChart3 className="w-5 h-5 text-background" />
                </div>
                <span className="text-lg font-semibold">ProdLines</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Product
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="#docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Docs
                </Link>
                <Link href="#status" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Status
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-sm hover-button" asChild>
                <Link href="/login">
                  Sign in
                </Link>
              </Button>
              <Button className="hover-button group" asChild>
                <Link href="/login">
                  <Github className="w-4 h-4 mr-2" />
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1 icon-hover" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 sm:py-32 animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Leaderboard for code that actually ships.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Connect a repo and see who owns the most lines currently in production. Only merged code counts.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="hover-button group w-full sm:w-auto" asChild>
                <Link href="/login">
                  <Github className="w-5 h-5 mr-2" />
                  Get Started with GitHub
                  <ChevronRight className="w-5 h-5 ml-1 icon-hover" />
                </Link>
              </Button>
            </div>
            
            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm hover-card">
                <Shield className="w-4 h-4 mr-2" />
                SOC2-ready
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm hover-card">
                <GitBranch className="w-4 h-4 mr-2" />
                Read-only access
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm hover-card">
                <Shield className="w-4 h-4 mr-2" />
                No tokens stored
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold">Built for engineering teams</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Everything you need to understand code ownership and contribution patterns.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="hover-card group opacity-0 animate-fade-in bg-card/50 border-border/50"
                style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: "forwards" }}
              >
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-3 group-hover:rounded-none transition-all duration-200">
                    <feature.icon className="w-5 h-5 text-foreground icon-hover" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold">See your team in action</h2>
            <p className="mt-4 text-muted-foreground">
              Real-time leaderboard showing production code ownership.
            </p>
          </div>
          <Card className="hover-card max-w-2xl mx-auto opacity-0 animate-fade-in animate-delay-200 bg-card/80 border-border/50" style={{ animationFillMode: "forwards" }}>
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">acme-corp/frontend-app</span>
                  <Badge variant="outline" className="text-xs">main</Badge>
                </div>
                <span className="text-xs text-muted-foreground">Last sync: 2 min ago</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {mockLeaderboard.map((item, index) => (
                  <div 
                    key={item.rank}
                    className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-bold ${index === 0 ? "text-amber-500" : index === 1 ? "text-zinc-400" : index === 2 ? "text-amber-700" : "text-muted-foreground"}`}>
                        #{item.rank}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium group-hover:rounded-none transition-all duration-200">
                        {item.name[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="font-mono">{item.loc} LOC</span>
                      <span className="text-muted-foreground w-16 text-right">{item.share}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-secondary/30 border-border/50 hover-card">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl font-bold">Ready to see your leaderboard?</h2>
              <p className="mt-4 text-muted-foreground max-w-md mx-auto">
                Connect your GitHub repos in seconds. Free for public repositories.
              </p>
              <Button size="lg" className="mt-8 hover-button group" asChild>
                <Link href="/login">
                  <Github className="w-5 h-5 mr-2" />
                  Get Started
                  <ChevronRight className="w-5 h-5 ml-1 icon-hover" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-background" />
              </div>
              <span className="font-medium">ProdLines</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Careers</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © 2026 ProdLines. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
