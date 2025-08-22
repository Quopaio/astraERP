using Yarp.ReverseProxy;

var builder = WebApplication.CreateBuilder(args);

// Reverse proxy: /api/*  -> MixERP backend
// Uses BackendApiBase in appsettings.json
builder.Services.AddReverseProxy().LoadFromMemory(
    routes: new[]
    {
        new RouteConfig
        {
            RouteId = "mixerp-api",
            ClusterId = "mixerp",
            Match = new() { Path = "/api/{**catchall}" },
            Transforms = new List<Dictionary<string,string>>
            {
                new() { ["PathRemovePrefix"]="/api" }
            }
        }
    },
    clusters: new[]
    {
        new ClusterConfig
        {
            ClusterId = "mixerp",
            Destinations = new Dictionary<string, DestinationConfig>
            {
                ["d1"] = new() { Address = builder.Configuration["BackendApiBase"]!.TrimEnd('/') + "/" }
            }
        }
    });

// Serve SPA static files (Vite build output) in production
builder.Services.AddSpaStaticFiles(o => o.RootPath = "ClientApp/dist");

var app = builder.Build();

app.UseHttpsRedirection();          // fine even if you run HTTP-only (no-op when not bound)
app.MapReverseProxy();              // /api -> BackendApiBase

// Optional: simple health endpoint for load balancers/uptime checks
app.MapGet("/health", () => Results.Ok(new { ok = true }));

// SPA hosting (serves index.html and static assets)
app.UseSpaStaticFiles();
app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; });

// No controllers, no MVC, no endpoints beyond proxy + health
app.Run();
