using Yarp.ReverseProxy;
using Yarp.ReverseProxy.Configuration;            // RouteConfig, ClusterConfig, DestinationConfig
using Microsoft.AspNetCore.SpaServices.Extensions; // AddSpaStaticFiles, UseSpa

var builder = WebApplication.CreateBuilder(args);

// Proxy: /api/* -> BackendApiBase (from appsettings.json)
builder.Services.AddReverseProxy().LoadFromMemory(
    routes: new[]
    {
        new RouteConfig
        {
            RouteId = "mixerp-api",
            ClusterId = "mixerp",
            Match = new() { Path = "/api/{**catchall}" },

            // IMPORTANT: initialize as an array (IReadOnlyList<...>)
            Transforms = new[]
            {
                new Dictionary<string, string> { ["PathRemovePrefix"] = "/api" }
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
                ["d1"] = new DestinationConfig
                {
                    Address = builder.Configuration["BackendApiBase"]!.TrimEnd('/') + "/"
                }
            }
        }
    });

builder.Services.AddSpaStaticFiles(o => o.RootPath = "ClientApp/dist");

var app = builder.Build();

app.MapReverseProxy();
app.MapGet("/health", () => Results.Ok(new { ok = true }));

app.UseSpaStaticFiles();
app.UseSpa(spa => { spa.Options.SourcePath = "ClientApp"; });

app.Run();
