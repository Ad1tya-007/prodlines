"use client"

import { useState, Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Github, 
  Search, 
  Check, 
  ChevronRight, 
  ChevronLeft,
  GitBranch,
  Settings2,
  Play,
  X,
  Plus,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

// Mock repositories for selection
const availableRepos = [
  { id: "1", name: "frontend-app", owner: "acme-corp", isPrivate: false, language: "TypeScript", stars: 234 },
  { id: "2", name: "api-server", owner: "acme-corp", isPrivate: true, language: "TypeScript", stars: 89 },
  { id: "3", name: "shared-lib", owner: "acme-corp", isPrivate: false, language: "TypeScript", stars: 156 },
  { id: "4", name: "mobile-app", owner: "acme-corp", isPrivate: true, language: "TypeScript", stars: 45 },
  { id: "5", name: "infra-tools", owner: "acme-corp", isPrivate: true, language: "Go", stars: 23 },
  { id: "6", name: "docs-site", owner: "acme-corp", isPrivate: false, language: "MDX", stars: 67 },
  { id: "7", name: "design-system", owner: "acme-corp", isPrivate: false, language: "TypeScript", stars: 312 },
  { id: "8", name: "analytics-sdk", owner: "acme-corp", isPrivate: true, language: "JavaScript", stars: 18 },
]

// Default exclude patterns
const defaultExcludePatterns = [
  "**/node_modules/**",
  "**/dist/**",
  "**/*.min.js",
  "**/vendor/**",
  "**/.git/**",
]

// Mock leaderboard preview
const previewLeaderboard = [
  { rank: 1, name: "alexchen", loc: "45,892", share: "28.4%" },
  { rank: 2, name: "sarahdev", loc: "38,241", share: "23.7%" },
  { rank: 3, name: "mikejohnson", loc: "28,456", share: "17.6%" },
]

const steps = [
  { id: 1, title: "Connect GitHub", description: "Authorize read-only access" },
  { id: 2, title: "Select Repositories", description: "Choose repos to track" },
  { id: 3, title: "Production Branch", description: "Define your main branch" },
  { id: 4, title: "Configure Rules", description: "Set counting filters" },
]

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-200",
                currentStep === step.id
                  ? "bg-foreground text-background"
                  : currentStep > step.id
                  ? "bg-green-500/20 text-green-500 border border-green-500/30"
                  : "bg-secondary text-muted-foreground",
                currentStep === step.id && "hover:rounded-none"
              )}
            >
              {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <div className="mt-2 text-center hidden sm:block">
              <p className={cn(
                "text-xs font-medium",
                currentStep === step.id ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-12 sm:w-24 h-0.5 mx-2",
                currentStep > step.id ? "bg-green-500/50" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Step1ConnectGitHub({ onNext }: { onNext: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-secondary mx-auto flex items-center justify-center">
        <Github className="h-10 w-10" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Connect your GitHub account</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          ProdLines needs read-only access to analyze your repositories. We never write to your repos or store tokens.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Button size="lg" className="hover-button group" onClick={onNext}>
          <Github className="h-5 w-5 mr-2" />
          Continue with GitHub
          <ChevronRight className="h-5 w-5 ml-1 icon-hover" />
        </Button>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            Read-only access
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            No tokens stored
          </span>
          <span className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            SOC2-ready
          </span>
        </div>
      </div>
    </div>
  )
}

function Step2SelectRepos({ 
  selectedRepos, 
  setSelectedRepos, 
  onNext, 
  onBack 
}: { 
  selectedRepos: string[]
  setSelectedRepos: (repos: string[]) => void
  onNext: () => void
  onBack: () => void 
}) {
  const [search, setSearch] = useState("")
  
  const filteredRepos = availableRepos.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase()) ||
    repo.owner.toLowerCase().includes(search.toLowerCase())
  )

  const toggleRepo = (repoId: string) => {
    setSelectedRepos(
      selectedRepos.includes(repoId)
        ? selectedRepos.filter(id => id !== repoId)
        : [...selectedRepos, repoId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Select repositories</h2>
        <p className="text-muted-foreground mt-2">
          Choose which repositories to track for production code ownership.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary/50 border-border/50"
        />
      </div>

      {/* Repo list */}
      <div className="grid gap-2 max-h-80 overflow-y-auto">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => toggleRepo(repo.id)}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:rounded-none group",
              selectedRepos.includes(repo.id)
                ? "bg-secondary border-foreground/20"
                : "bg-card/50 border-border/50 hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={selectedRepos.includes(repo.id)}
                className="data-[state=checked]:bg-foreground data-[state=checked]:text-background"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{repo.owner}/{repo.name}</span>
                  {repo.isPrivate && (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                  <span className="text-xs text-muted-foreground">{repo.stars} stars</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected count */}
      <div className="text-center text-sm text-muted-foreground">
        {selectedRepos.length} {selectedRepos.length === 1 ? "repository" : "repositories"} selected
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="hover-button bg-transparent">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={selectedRepos.length === 0}
          className="hover-button"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function Step3ProductionBranch({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [branch, setBranch] = useState("main")
  const [useEnvMapping, setUseEnvMapping] = useState(false)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Define production branch</h2>
        <p className="text-muted-foreground mt-2">
          Only code merged into this branch will count toward ownership.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Branch selector */}
        <div className="space-y-2">
          <Label>Production branch</Label>
          <Select value={branch} onValueChange={setBranch}>
            <SelectTrigger className="hover-button bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="main">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  main
                </div>
              </SelectItem>
              <SelectItem value="master">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  master
                </div>
              </SelectItem>
              <SelectItem value="release">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  release
                </div>
              </SelectItem>
              <SelectItem value="custom">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Custom...
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {branch === "custom" && (
          <div className="space-y-2">
            <Label>Custom branch name</Label>
            <Input 
              placeholder="e.g., production, deploy" 
              className="bg-secondary/50"
            />
          </div>
        )}

        {/* Environment mapping toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div>
            <Label htmlFor="env-mapping" className="font-medium">Environment mapping</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Track multiple branches for staging/production separation
            </p>
          </div>
          <Switch 
            id="env-mapping"
            checked={useEnvMapping}
            onCheckedChange={setUseEnvMapping}
          />
        </div>

        {useEnvMapping && (
          <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/50">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Production</Label>
              <Select defaultValue="main">
                <SelectTrigger className="hover-button">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="master">master</SelectItem>
                  <SelectItem value="release">release</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Staging</Label>
              <Select defaultValue="develop">
                <SelectTrigger className="hover-button">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="develop">develop</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                  <SelectItem value="next">next</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="hover-button bg-transparent">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} className="hover-button">
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function Step4ConfigureRules({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [excludePatterns, setExcludePatterns] = useState(defaultExcludePatterns)
  const [includePatterns, setIncludePatterns] = useState<string[]>([])
  const [newPattern, setNewPattern] = useState("")
  const [excludeBots, setExcludeBots] = useState(true)

  const addExcludePattern = () => {
    if (newPattern && !excludePatterns.includes(newPattern)) {
      setExcludePatterns([...excludePatterns, newPattern])
      setNewPattern("")
    }
  }

  const removeExcludePattern = (pattern: string) => {
    setExcludePatterns(excludePatterns.filter(p => p !== pattern))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Configure counting rules</h2>
        <p className="text-muted-foreground mt-2">
          Customize which files and paths are included in ownership calculations.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Exclude patterns */}
        <div className="space-y-3">
          <Label>Exclude patterns</Label>
          <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-secondary/30 border border-border/50 min-h-[60px]">
            {excludePatterns.map((pattern) => (
              <Badge 
                key={pattern} 
                variant="secondary" 
                className="text-xs flex items-center gap-1 pr-1"
              >
                <span className="font-mono">{pattern}</span>
                <button 
                  onClick={() => removeExcludePattern(pattern)} 
                  className="ml-1 h-4 w-4 rounded-sm hover:bg-secondary-foreground/20 flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add pattern, e.g. **/test/**"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addExcludePattern()}
              className="bg-secondary/50 font-mono text-sm"
            />
            <Button 
              variant="outline" 
              onClick={addExcludePattern}
              className="hover-button bg-transparent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Include patterns */}
        <div className="space-y-3">
          <Label>Include patterns (optional)</Label>
          <p className="text-xs text-muted-foreground">
            If specified, only files matching these patterns will be counted.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. src/**, lib/**"
              className="bg-secondary/50 font-mono text-sm"
            />
            <Button variant="outline" className="hover-button bg-transparent">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Exclude bots toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div>
            <Label htmlFor="exclude-bots" className="font-medium">Exclude bot contributions</Label>
            <p className="text-xs text-muted-foreground mt-1">
              Filter out dependabot, renovate, and other automated commits
            </p>
          </div>
          <Switch 
            id="exclude-bots"
            checked={excludeBots}
            onCheckedChange={setExcludeBots}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="hover-button bg-transparent">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={onNext} className="hover-button">
          Complete Setup
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

function CompletionScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/30 mx-auto flex items-center justify-center">
        <Check className="h-10 w-10 text-green-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold">Setup complete!</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Your repositories are configured. Start the first sync to analyze your codebase.
        </p>
      </div>
      <Button size="lg" className="hover-button group" onClick={onStart}>
        <Play className="h-5 w-5 mr-2" />
        Start First Sync
        <ChevronRight className="h-5 w-5 ml-1 icon-hover" />
      </Button>
    </div>
  )
}

function LeaderboardPreview() {
  return (
    <Card className="hover-card bg-card/50 border-border/50 h-fit sticky top-24">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-base">Preview</CardTitle>
        <CardDescription>How your leaderboard will look</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {previewLeaderboard.map((item) => (
            <div 
              key={item.rank}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "font-bold",
                  item.rank === 1 && "text-amber-500",
                  item.rank === 2 && "text-zinc-400",
                  item.rank === 3 && "text-amber-700"
                )}>
                  #{item.rank}
                </span>
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-secondary text-foreground text-xs">
                    {item.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{item.name}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono">{item.loc}</p>
                <p className="text-xs text-muted-foreground">{item.share}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Loading() {
  return null;
}

export function ReposPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const searchParams = useSearchParams();

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStart = () => {
    // Mock sync start - would redirect to overview
    window.location.href = "/app/overview"
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main wizard area */}
        <div className="lg:col-span-2">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="p-6 sm:p-8">
              {!isComplete && <StepIndicator currentStep={currentStep} />}
              
              {isComplete ? (
                <CompletionScreen onStart={handleStart} />
              ) : (
                <>
                  {currentStep === 1 && <Step1ConnectGitHub onNext={handleNext} />}
                  {currentStep === 2 && (
                    <Step2SelectRepos
                      selectedRepos={selectedRepos}
                      setSelectedRepos={setSelectedRepos}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  )}
                  {currentStep === 3 && (
                    <Step3ProductionBranch onNext={handleNext} onBack={handleBack} />
                  )}
                  {currentStep === 4 && (
                    <Step4ConfigureRules onNext={handleNext} onBack={handleBack} />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview panel */}
        <div className="hidden lg:block">
          <LeaderboardPreview />
        </div>
      </div>
    </div>
  )
}

