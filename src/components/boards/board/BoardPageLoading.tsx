export function BoardPageLoading() {
  return (
    <div className="min-h-screen">
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="flex space-x-2">
                <div className="h-9 w-20 bg-muted rounded"></div>
                <div className="h-9 w-9 bg-muted rounded"></div>
              </div>
            </div>
            <div className="text-center space-y-3">
              <div className="h-8 w-64 bg-muted rounded mx-auto"></div>
              <div className="h-4 w-96 bg-muted rounded mx-auto"></div>
              <div className="h-3 w-48 bg-muted rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
