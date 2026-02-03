'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Plus } from 'lucide-react';
import { AddRepositories } from './add-repositories';
import { ManageRepositories } from './manage-repositories';

export function ReposPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Repositories</h1>
        <p className="text-muted-foreground mt-1">
          Manage which repositories to track for production code ownership.
        </p>
      </div>

      <Tabs defaultValue="add" className="space-y-2">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
            <Plus className="h-4 w-4 mr-2" />
            Add Repositories
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 data-[state=active]:rounded-lg hover:rounded-none">
            <Settings2 className="h-4 w-4 mr-2" />
            Manage Repositories
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="add"
          className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="">
              <AddRepositories />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="manage"
          className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="">
              <ManageRepositories />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
