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

      <Tabs defaultValue="add" className="space-y-6">
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

        <TabsContent value="add" className="mt-6">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="p-6 sm:p-8">
              <AddRepositories />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <Card className="hover-card bg-card/50 border-border/50">
            <CardContent className="p-6 sm:p-8">
              <ManageRepositories />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
