using Yarp.ReverseProxy;
using Yarp.ReverseProxy.Configuration;            // RouteConfig, ClusterConfig, DestinationConfig
using Microsoft.AspNetCore.SpaServices.Extensions; // AddSpaStaticFiles, UseSpa

var builder = WebApplication.CreateBuilder(args);

// Backend base (fallback to 5050 if not set)
var backendBase = (builder.Configuration["BackendApiBase"] ?? "http://localhost:5050").TrimEnd('/') + "/";

// Proxy config
builder.Services.AddReverseProxy().LoadFromMemory(
    routes: new[]
    {
        // Forward /api/* to backend — NOTE: catchall has **no dash**
        new RouteConfig
        {
            RouteId  = "mixerp-api",
            ClusterId = "mixerp",
            Match = new() { Path = "/api/{**catchall}" }   // <-- fixed
            // (No PathRemovePrefix — we want /api to reach backend as /api)
        },

        // Optional: forward legacy /auth/* too (remove if unused)
        new RouteConfig
        {
            RouteId  = "mixerp-auth",
            ClusterId = "mixerp",
            Match = new() { Path = "/auth/{**catchall}" }  // <-- also no dash
        }
    },
    clusters: new[]
    {
        new ClusterConfig
        {
            ClusterId = "mixerp",
            Destinations = new Dictionary<string, DestinationConfig>
            {
                ["d1"] = new DestinationConfig { Address = backendBase }
            }
        }
    }
);

// Serve built SPA from ClientApp/dist
builder.Services.AddSpaStaticFiles(o => o.RootPath = "ClientApp/dist");

var app = builder.Build();

// IMPORTANT: map proxy BEFORE SPA/static fallback
app.MapReverseProxy();

app.MapGet("/health", () => Results.Ok(new { ok = true }));

app.UseSpaStaticFiles();
app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; });

app.Run();
