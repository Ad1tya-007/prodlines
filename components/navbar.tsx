'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { BarChart3, Github, ChevronRight } from 'lucide-react';

export function Navbar() {
  return (
    <div className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
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
              <Link
                href="/public-stats"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Public Stats
              </Link>
              <Link
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>

              <Link
                href="#docs"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Docs
              </Link>
              <Link
                href="#status"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                Status
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm hover-button" asChild>
              <Link href="/login">Sign in</Link>
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
    </div>
  );
}

export default Navbar;
