import { Route, Switch } from 'wouter';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import { Content } from "@/components/tourist/Content";
import { Toaster } from "@/components/ui/toaster";

export function App() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="border-b border-border/10">
            <div className="flex items-center gap-2 px-2">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Tokyo Guide</h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {/* We'll add navigation items here later */}
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1">
          <Switch>
            <Route path="/" component={Content} />
          </Switch>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
